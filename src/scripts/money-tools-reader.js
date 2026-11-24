/* Owner money tools: read a QuickBooks or Xero report export (CSV or Excel .xlsx) entirely in the browser.
   No network, no third-party code: the file is read with FileReader, unzipped with the browser's own
   DecompressionStream, and parsed with DOMParser. Nothing is kept after the page closes. */
window.MTReader = (function () {
  'use strict';

  function num(v) {
    if (v == null) return null;
    var s = String(v).trim();
    if (s === '' || s === '-' ) return null;
    var neg = /^\(.*\)$/.test(s) || /^-/.test(s) || /^−/.test(s);
    s = s.replace(/[()$,\s−-]/g, '');
    if (s === '' || isNaN(Number(s))) return null;
    var n = Number(s);
    return neg ? -n : n;
  }

  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  // Minimal .xlsx reader: zip central directory -> inflate -> first worksheet + shared strings.
  async function inflate(bytes) {
    var ds = new DecompressionStream('deflate-raw');
    var stream = new Blob([bytes]).stream().pipeThrough(ds);
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }
  async function unzip(buf) {
    var dv = new DataView(buf), u8 = new Uint8Array(buf), files = {};
    var eocd = -1;
    for (var i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('not a zip');
    var count = dv.getUint16(eocd + 10, true), off = dv.getUint32(eocd + 16, true);
    var dec = new TextDecoder();
    for (var n = 0; n < count; n++) {
      if (dv.getUint32(off, true) !== 0x02014b50) break;
      var method = dv.getUint16(off + 10, true), csize = dv.getUint32(off + 20, true);
      var nlen = dv.getUint16(off + 28, true), xlen = dv.getUint16(off + 30, true), clen = dv.getUint16(off + 32, true);
      var local = dv.getUint32(off + 42, true);
      var name = dec.decode(u8.subarray(off + 46, off + 46 + nlen));
      var lnlen = dv.getUint16(local + 26, true), lxlen = dv.getUint16(local + 28, true);
      var start = local + 30 + lnlen + lxlen;
      files[name] = { method: method, data: u8.subarray(start, start + csize) };
      off += 46 + nlen + xlen + clen;
    }
    return {
      text: async function (name) {
        var f = files[name]; if (!f) return null;
        var raw = f.method === 8 ? await inflate(f.data) : f.data;
        return dec.decode(raw);
      },
      names: Object.keys(files)
    };
  }
  function colIndex(ref) {
    var m = /^([A-Z]+)/.exec(ref || ''); if (!m) return 0;
    var s = m[1], n = 0;
    for (var i = 0; i < s.length; i++) n = n * 26 + (s.charCodeAt(i) - 64);
    return n - 1;
  }
  async function parseXLSX(buf) {
    var z = await unzip(buf);
    var dp = new DOMParser();
    var strings = [];
    var ss = await z.text('xl/sharedStrings.xml');
    if (ss) {
      var sdoc = dp.parseFromString(ss, 'application/xml');
      Array.prototype.forEach.call(sdoc.getElementsByTagName('si'), function (si) {
        var t = ''; Array.prototype.forEach.call(si.getElementsByTagName('t'), function (x) { t += x.textContent; });
        strings.push(t);
      });
    }
    var sheetName = z.names.filter(function (n) { return /^xl\/worksheets\/sheet\d+\.xml$/.test(n); }).sort()[0];
    if (!sheetName) throw new Error('no sheet');
    var doc = dp.parseFromString(await z.text(sheetName), 'application/xml');
    var rows = [];
    Array.prototype.forEach.call(doc.getElementsByTagName('row'), function (r) {
      var out = [];
      Array.prototype.forEach.call(r.getElementsByTagName('c'), function (c) {
        var t = c.getAttribute('t'), v = c.getElementsByTagName('v')[0], val = '';
        if (t === 's' && v) val = strings[Number(v.textContent)] || '';
        else if (t === 'inlineStr') { var is = c.getElementsByTagName('t')[0]; val = is ? is.textContent : ''; }
        else if (v) val = v.textContent;
        out[colIndex(c.getAttribute('r'))] = val;
      });
      for (var i = 0; i < out.length; i++) if (out[i] == null) out[i] = '';
      rows.push(out);
    });
    return rows;
  }

  async function readFile(file) {
    var buf = await file.arrayBuffer();
    var u8 = new Uint8Array(buf);
    if (u8[0] === 0x50 && u8[1] === 0x4b) return parseXLSX(buf);
    return parseCSV(new TextDecoder().decode(u8));
  }

  // Find the amount columns: the rightmost columns that hold numbers on most total rows.
  function amountCols(rows) {
    var counts = {};
    rows.forEach(function (r) {
      for (var i = 1; i < r.length; i++) if (num(r[i]) != null) counts[i] = (counts[i] || 0) + 1;
    });
    var cols = Object.keys(counts).map(Number).filter(function (i) { return counts[i] >= 3; }).sort(function (a, b) { return a - b; });
    return cols;
  }
  function label(r) { return String(r[0] == null ? '' : r[0]).trim(); }

  // P&L: returns { periods: [name...], cur: {...}, prior: {...} or null }.
  function readPL(rows) {
    var cols = amountCols(rows);
    if (!cols.length) return null;
    var header = rows.find(function (r) { return cols.every(function (c) { return r[c] && num(r[c]) == null; }); }) || [];
    // Comparative exports put the current period first; skip % and change columns.
    var useCols = cols.filter(function (c) { return !/%|change|var/i.test(header[c] || ''); }).slice(0, 2);
    function find(re, exclude) {
      for (var i = 0; i < rows.length; i++) {
        var l = label(rows[i]);
        if (re.test(l) && !(exclude && exclude.test(l))) return i;
      }
      return -1;
    }
    var iRev = find(/^total\s+(income|revenue|sales|trading income|operating revenue)$/i);
    var iCogs = find(/^total\s+(cost of goods sold|cost of sales|cogs|direct costs)$/i);
    var iExp = find(/^total\s+(operating\s+)?expenses$/i);
    if (iRev < 0) return null;
    function sumRows(re, from, to, exclude) {
      var out = useCols.map(function () { return 0; });
      for (var i = Math.max(from, 0); i < (to < 0 ? rows.length : to); i++) {
        var l = label(rows[i]);
        if (re.test(l) && !/^total/i.test(l) && !(exclude && exclude.test(l))) useCols.forEach(function (c, k) { out[k] += num(rows[i][c]) || 0; });
      }
      return out;
    }
    var interestAll = sumRows(/interest/i, 0, -1, /income|received|earned/i);
    var interestInOpex = sumRows(/interest/i, iCogs >= 0 ? iCogs : iRev, iExp, /income|received|earned/i);
    var deprInOpex = sumRows(/depreciation|amortization|amortisation/i, iCogs >= 0 ? iCogs : iRev, iExp);
    var take = function (i, k) { return i < 0 ? 0 : (num(rows[i][useCols[k]]) || 0); };
    var periods = useCols.map(function (c) { return String(header[c] || '').trim(); });
    var out = useCols.map(function (c, k) {
      return {
        rev: take(iRev, k),
        cogs: take(iCogs, k),
        opex: take(iExp, k) - interestInOpex[k] - deprInOpex[k],
        int: interestAll[k]
      };
    });
    return { periods: periods, cur: out[0], prior: out[1] || null, found: { cogs: iCogs >= 0, opex: iExp >= 0 } };
  }

  // Balance sheet (comparative): change in receivables, inventory, payables and loans, current minus prior.
  function readBS(rows) {
    var cols = amountCols(rows).slice(0, 2);
    if (cols.length < 2) return null;
    function val(re, exclude) {
      for (var i = 0; i < rows.length; i++) {
        var l = label(rows[i]);
        if (re.test(l) && !(exclude && exclude.test(l))) return cols.map(function (c) { return num(rows[i][c]) || 0; });
      }
      return [0, 0];
    }
    var ar = val(/^total\s+accounts receivable|^accounts receivable/i);
    var inv = val(/^total\s+inventory|^inventory/i);
    var ap = val(/^total\s+accounts payable|^accounts payable/i);
    var loans = [0, 0];
    rows.forEach(function (r) {
      var l = label(r);
      if (/loan|note[s]? payable|line of credit|long[- ]term debt/i.test(l) && !/^total/i.test(l) && !/receivable|shareholder|officer|owner/i.test(l)) {
        cols.forEach(function (c, k) { loans[k] += num(r[c]) || 0; });
      }
    });
    return {
      growth: (ar[0] - ar[1]) + (inv[0] - inv[1]) - (ap[0] - ap[1]),
      principal: Math.max(0, loans[1] - loans[0])
    };
  }

  function kind(rows) {
    var top = rows.slice(0, 8).map(label).join(' ').toLowerCase();
    if (/balance sheet|statement of financial position/.test(top)) return 'bs';
    if (/profit|loss|income statement|p&l/.test(top)) return 'pl';
    return rows.some(function (r) { return /^total\s+assets$/i.test(label(r)); }) ? 'bs' : 'pl';
  }

  return { readFile: readFile, readPL: readPL, readBS: readBS, kind: kind, parseCSV: parseCSV, num: num };
})();
