/* Owner money tools: two-stage Sankey (sources -> one middle node -> uses), inline SVG, hover tooltips.
   Chart type only (a use-of-funds Sankey); no data is fetched or sent. */
window.MTSankey = function (box, opts) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var narrow = window.innerWidth < 720 || (box.clientWidth > 0 && box.clientWidth < 560);
  var nMax = Math.max((opts.left || []).length, (opts.right || []).length);
  var W = narrow ? 400 : 680, H = narrow ? 300 : Math.max(380, 40 + 40 * nMax), top = 14, bot = H - 14, nodeW = 14, gap = 10;
  var xL = narrow ? 8 : 196, xM = narrow ? 193 : 340, xR = narrow ? 378 : 484;
  var left = (opts.left || []).filter(function (n) { return n.value > 0.5; });
  var right = (opts.right || []).filter(function (n) { return n.value > 0.5; });
  var sumL = left.reduce(function (s, n) { return s + n.value; }, 0);
  var sumR = right.reduce(function (s, n) { return s + n.value; }, 0);
  var total = Math.max(sumL, sumR, 1);
  var avail = (bot - top) - gap * Math.max(left.length - 1, right.length - 1, 0);
  var k = avail / total;
  var SLOT = narrow ? 0 : 34;
  function slots(nodes) { return nodes.reduce(function (s, n) { return s + Math.max(n.value * k, SLOT); }, 0) + gap * Math.max(nodes.length - 1, 0); }
  var need = Math.max(slots(left), slots(right), total * k);
  if (need > bot - top) { H = Math.ceil(need + 28); bot = H - 14; }
  var mk = function (t, a, txt) { var e = document.createElementNS(NS, t); for (var key in a) e.setAttribute(key, a[key]); if (txt != null) e.textContent = txt; return e; };
  var svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, focusable: 'false', role: 'presentation' });
  var tip = box.querySelector('.mt-tip') || document.createElement('div');
  tip.className = 'mt-tip'; tip.hidden = true;

  function stack(nodes, x) {
    var hTot = slots(nodes);
    var y = top + ((bot - top) - hTot) / 2;
    nodes.forEach(function (n) {
      n.h = Math.max(1.5, n.value * k);
      var slot = Math.max(n.value * k, SLOT);
      n.x = x; n.y = y + (slot - n.h) / 2; y += slot + gap;
    });
  }
  stack(left, xL); stack(right, xR);
  var midH = total * k, midY = top + ((bot - top) - midH) / 2;

  function band(x0, y0a, y0b, x1, y1a, y1b) {
    var c = (x0 + x1) / 2;
    return 'M' + x0 + ',' + y0a + ' C' + c + ',' + y0a + ' ' + c + ',' + y1a + ' ' + x1 + ',' + y1a +
      ' L' + x1 + ',' + y1b + ' C' + c + ',' + y1b + ' ' + c + ',' + y0b + ' ' + x0 + ',' + y0b + ' Z';
  }
  function show(n, ev) {
    tip.textContent = '';
    var b = document.createElement('strong'); b.textContent = n.label; tip.appendChild(b);
    tip.appendChild(document.createTextNode(' ' + opts.fmt(n.value) + (opts.pct ? ' · ' + opts.pct(n.value) : '')));
    tip.hidden = false;
    var r = box.getBoundingClientRect();
    var px = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left, py = (ev.touches ? ev.touches[0].clientY : ev.clientY) - r.top;
    tip.style.left = Math.min(Math.max(px + 12, 4), r.width - 220) + 'px';
    tip.style.top = Math.max(py - 44, 0) + 'px';
  }
  function hook(el, n, group) {
    el.addEventListener('pointerenter', function (e) { group.forEach(function (g) { g.classList.add('is-hot'); }); show(n, e); });
    el.addEventListener('pointermove', function (e) { show(n, e); });
    el.addEventListener('pointerleave', function () { group.forEach(function (g) { g.classList.remove('is-hot'); }); tip.hidden = true; });
  }

  var mOff = midY;
  left.forEach(function (n) {
    var h = n.value * k;
    var p = mk('path', { d: band(n.x + nodeW, n.y, n.y + n.h, xM, mOff, mOff + h), fill: n.fill, class: 'mt-link' });
    var r = mk('rect', { x: n.x, y: n.y, width: nodeW, height: n.h, fill: n.fill, class: 'mt-node' });
    svg.appendChild(p); svg.appendChild(r); hook(p, n, [p]); hook(r, n, [p]);
    mOff += h;
  });
  mOff = midY;
  var midRect = mk('rect', { x: xM, y: midY, width: nodeW, height: midH, fill: opts.midFill || '#182228', class: 'mt-node' });
  right.forEach(function (n) {
    var h = n.value * k;
    var p = mk('path', { d: band(xM + nodeW, mOff, mOff + h, n.x, n.y, n.y + n.h), fill: n.fill, class: 'mt-link' });
    var r = mk('rect', { x: n.x, y: n.y, width: nodeW, height: n.h, fill: n.fill, class: 'mt-node' });
    svg.appendChild(p); svg.appendChild(r); hook(p, n, [p]); hook(r, n, [p]);
    mOff += h;
  });
  svg.appendChild(midRect);

  if (!narrow) {
    var label = function (n, side) {
      var x = side === 'L' ? n.x - 8 : n.x + nodeW + 8, anchor = side === 'L' ? 'end' : 'start';
      var cy = n.y + n.h / 2;
      var t = mk('text', { x: x, y: cy - 2, 'text-anchor': anchor, 'font-size': 14, fill: '#182228' }, n.label);
      var v = mk('text', { x: x, y: cy + 14, 'text-anchor': anchor, 'font-size': 13.5, 'font-weight': 700, fill: n.strong ? '#a8431a' : '#182228' }, opts.fmt(n.value) + (opts.pct ? '  ' + opts.pct(n.value) : ''));
      svg.appendChild(t); svg.appendChild(v);
    };
    // keep labels from colliding on short nodes
    left.forEach(function (n) { label({ x: n.x, y: n.y, h: n.h, label: n.short || n.label, value: n.value, strong: n.strong }, 'L'); });
    right.forEach(function (n) { label({ x: n.x, y: n.y, h: n.h, label: n.short || n.label, value: n.value, strong: n.strong }, 'R'); });
    if (opts.midLabel) {
      svg.appendChild(mk('text', { x: xM + nodeW / 2, y: midY - 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#182228' }, opts.midLabel));
    }
  }
  box.innerHTML = '';
  box.appendChild(svg);
  if (narrow) {
    var ul = document.createElement('ul'); ul.className = 'mt-legend';
    left.concat(right).forEach(function (n) {
      var li = document.createElement('li');
      var sw = document.createElement('span'); sw.className = 'mt-swatch'; sw.style.background = n.fill;
      li.appendChild(sw);
      li.appendChild(document.createTextNode(n.label + ' '));
      var b = document.createElement('strong'); b.textContent = opts.fmt(n.value) + (opts.pct ? ' \u00b7 ' + opts.pct(n.value) : '');
      li.appendChild(b); ul.appendChild(li);
    });
    box.appendChild(ul);
  }
  box.appendChild(tip);
};
