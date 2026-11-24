/* Owner money tools: shared helpers. Injected inline into each tool page.
   Privacy contract (build brief 2026-11-23, section 3): no form posts, no fetch or XHR,
   no analytics on typed values, no browser storage, no cookies, no query-string state.
   Nothing here reads or writes anything outside the page's own DOM. */
window.MT = (function () {
  'use strict';
  var whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
  var MINUS = '−';

  function round(n) { var r = Math.round(n); return r === 0 ? 0 : r; }
  function money(n) { var r = round(n); return (r < 0 ? MINUS : '') + '$' + whole.format(Math.abs(r)); }
  function signed(n) { var r = round(n); return (r > 0 ? '+' : r < 0 ? MINUS : '') + '$' + whole.format(Math.abs(r)); }
  function abs(n) { return '$' + whole.format(Math.abs(round(n))); }

  function clean(v) {
    return String(v == null ? '' : v).replace(/[$,\s]/g, '').replace(/−/g, '-');
  }

  // Dollars: blank reads as not entered (value 0); text reads as 0.
  function parseMoney(el, allowNegative) {
    var s = clean(el.value);
    if (s === '') return { entered: false, value: 0 };
    var n = Number(s);
    if (!isFinite(n)) n = 0;
    if (!allowNegative && n < 0) n = 0;
    return { entered: true, value: n };
  }

  // Bounded numbers (rates, months): out of range or text clamps to max (brief 4.6), below 0 clamps to 0.
  function parseRange(el, max) {
    var s = clean(el.value).replace(/%$/, '');
    if (s === '') return { entered: false, value: 0, clamped: false };
    var n = Number(s);
    if (!isFinite(n)) return { entered: true, value: max, clamped: true };
    if (n > max) return { entered: true, value: max, clamped: true };
    if (n < 0) return { entered: true, value: 0, clamped: true };
    return { entered: true, value: n, clamped: false };
  }

  function note(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    el.textContent = text || '';
    el.hidden = !text;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // Reformat a dollar field to $1,234,567 when focus leaves it.
  function reformatOnBlur(input, allowNegative) {
    input.addEventListener('blur', function () {
      var p = parseMoney(input, allowNegative);
      if (p.entered) input.value = money(p.value);
    });
  }

  function setDate() {
    var d = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
    document.querySelectorAll('[data-print-date]').forEach(function (n) { n.textContent = d; });
  }

  // Print list of every input the user typed, with its label.
  function printInputs(form, target, extra) {
    target.innerHTML = '';
    var rows = [];
    form.querySelectorAll('input[type="text"]').forEach(function (input) {
      if (clean(input.value) === '') return;
      var label = form.querySelector('label[for="' + input.id + '"]');
      var name = input.getAttribute('data-print-label') || (label ? label.textContent.trim() : input.id);
      var kind = input.getAttribute('data-kind');
      var shown = input.value.trim();
      if (kind === 'money' || kind === 'money-any') shown = money(parseMoney(input, kind === 'money-any').value);
      if (kind === 'rate') shown = parseRange(input, 60).value + '%';
      if (kind === 'months') shown = String(parseRange(input, Number(input.getAttribute('data-max') || 60)).value);
      rows.push([name, shown]);
    });
    if (extra) rows = extra.concat(rows);
    rows.forEach(function (r) {
      target.appendChild(el('dt', null, r[0]));
      target.appendChild(el('dd', null, r[1]));
    });
  }

  // Shared wiring: recompute on every change, example, clear, show the walk, phone summary, reset on reload.
  function wire(opts) {
    var form = opts.form, tool = opts.tool;
    var banner = tool.querySelector('[data-example-banner]');
    var result = tool.querySelector('[data-result]');
    var summary = tool.querySelector('[data-summary]');
    var filling = false;

    form.querySelectorAll('input[data-kind="money"]').forEach(function (i) { reformatOnBlur(i, false); });
    form.querySelectorAll('input[data-kind="money-any"]').forEach(function (i) { reformatOnBlur(i, true); });

    function run() { opts.recompute(); }
    form.addEventListener('input', function () { if (!filling && banner) banner.hidden = true; run(); });
    form.addEventListener('change', run);
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    function fillExample() {
      filling = true;
      form.reset();
      Object.keys(opts.example).forEach(function (id) {
        var i = document.getElementById(id);
        if (!i) return;
        if (i.type === 'radio' || i.type === 'checkbox') i.checked = !!opts.example[id];
        else i.value = opts.example[id];
      });
      filling = false;
      if (banner) banner.hidden = false;
      run();
    }
    var ex = tool.querySelector('[data-example]');
    if (ex) ex.addEventListener('click', function (e) { e.preventDefault(); fillExample(); });

    var clr = tool.querySelector('[data-clear]');
    if (clr) clr.addEventListener('click', function () {
      form.reset();
      if (banner) banner.hidden = true;
      run();
      var first = form.querySelector('input[type="text"]');
      if (first) first.focus();
    });

    var walk = tool.querySelector('[data-show-walk]');
    if (walk) walk.addEventListener('click', function () {
      tool.classList.add('is-expanded');
      if (summary) summary.setAttribute('aria-expanded', 'true');
      result.focus();
    });

    if (summary) summary.addEventListener('click', function () {
      var open = !tool.classList.contains('is-expanded');
      tool.classList.toggle('is-expanded', open);
      summary.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) result.focus();
    });

    // Closing or reloading clears every field (some browsers restore form state).
    window.addEventListener('pageshow', function () {
      if (opts.exampleOnLoad) { fillExample(); return; }
      form.reset(); if (banner) banner.hidden = true; run();
    });
    window.addEventListener('beforeprint', function () { setDate(); run(); });
    setDate();
    if (opts.exampleOnLoad) fillExample(); else run();
  }

  function setSummary(tool, text) {
    var s = tool.querySelector('[data-summary]');
    if (!s) return;
    var t = s.querySelector('[data-summary-text]');
    if (t) t.textContent = text || '';
    s.hidden = !text;
  }

  return {
    money: money, signed: signed, abs: abs, round: round,
    parseMoney: parseMoney, parseRange: parseRange,
    note: note, el: el, printInputs: printInputs, wire: wire, setSummary: setSummary, setDate: setDate
  };
})();
