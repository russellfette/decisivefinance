// og-generate.mjs
// Regenerates post OG PNGs (1200x630) from blog frontmatter titles.
// Layout matches public/og/default.svg. Claim line is canon v2.7.
// Usage: node scripts/og-generate.mjs [slug ...]   (no args = all posts)

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const CLAIM = 'Put in $7,500. At least $22,500 named in 14 days, or it is free.';
const SUB = 'Field notes from inside stalled funded-tech engagements.';
const BLOG = 'src/content/blog';

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Greedy word-wrap sized for 52px Inter ExtraBold across 1040px.
const wrap = (title, max = 38) => {
  const words = title.split(' ');
  const lines = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length > max && cur) lines.push(w);
    else lines[lines.length - 1] = (cur + ' ' + w).trim();
  }
  return lines.slice(0, 3);
};

const svgFor = (title) => {
  const lines = wrap(title);
  const text = lines
    .map(
      (l, i) =>
        `<text x="80" y="${240 + i * 65}" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="800" font-size="52" fill="#ffffff" letter-spacing="-1.5">${esc(l)}</text>`
    )
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="g1" cx="85%" cy="10%" r="55%">
      <stop offset="0%" stop-color="#e3632b" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#e3632b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="10%" cy="100%" r="65%">
      <stop offset="0%" stop-color="#214c52" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#214c52" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#182228"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>
  <g transform="translate(80, 80)">
    <rect width="56" height="56" rx="10" fill="#ffffff" fill-opacity="0.12"/>
    <circle cx="28" cy="28" r="10" fill="#e3632b"/>
  </g>
  <text x="152" y="118" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="28" fill="#ffffff">Decisive Finance</text>
  <text x="1120" y="118" text-anchor="end" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="24" fill="#ffffff" fill-opacity="0.45">Perspectives</text>
  ${text}
  <text x="80" y="500" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="500" font-size="24" fill="#ffffff" fill-opacity="0.75">${esc(SUB)}</text>
  <text x="80" y="548" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="24" fill="#e3632b">${esc(CLAIM)}</text>
</svg>`;
};

const fm = (file) => {
  const s = readFileSync(`${BLOG}/${file}`, 'utf8');
  const title = s.match(/^title:\s*"(.+)"/m)?.[1];
  const og = s.match(/^ogImage:\s*"\/og\/(.+)\.png"/m)?.[1];
  return { title, og };
};

const only = process.argv.slice(2);
const posts = readdirSync(BLOG).filter((f) => f.endsWith('.md'));
for (const f of posts) {
  const { title, og } = fm(f);
  if (!title || !og) continue;
  if (only.length && !only.includes(og)) continue;
  const png = await sharp(Buffer.from(svgFor(title)), { density: 96 })
    .resize(1200, 630)
    .png()
    .toBuffer();
  writeFileSync(`public/og/${og}.png`, png);
  console.log(`og: ${og}.png  (${title.length} chars)`);
}
