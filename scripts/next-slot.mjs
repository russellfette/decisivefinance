#!/usr/bin/env node
// next-slot.mjs
// Picks the next publish slot and the pillar that is due, from repo state only.
// No dependency on OneDrive, the editorial calendar, or any doc outside this repo.
//
// Why this exists: the content-engine planning docs in the canon repo
// (Decisive-Editorial-Calendar-v1, CONTENT-PILLAR-STRATEGY-v1, and the
// content schedule) are not listed CURRENT in CANON-INDEX v2.2. They are
// flagged there as built on the retired funded-tech ICP. Slot and pillar
// selection therefore comes from the live corpus, which is trigger-first.
//
// Usage:
//   node scripts/next-slot.mjs              pick from today
//   node scripts/next-slot.mjs --date 2026-09-14   pick as if today were that date
//   node scripts/next-slot.mjs --json       machine-readable only
//
// Selection rules, in order:
//   1. Slot: the first Tuesday strictly after today with no post already dated to it.
//   2. If content-queue.md holds a row for that slot, its pillar and working
//      title win. A hand-written row always beats the computed pick.
//   3. Otherwise pillar = the pillar with the fewest posts still ahead of
//      today. Ties break to whichever of them was covered longest ago.
//      Recency alone is not the rule: it overweights whichever pillar is
//      already deepest.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = join(REPO, 'src/content/blog');
const QUEUE_FILE = join(REPO, 'content-queue.md');

// Pillar 5 is the Industry band, not part of the Tuesday rotation.
const PILLARS = {
  1: 'Sellable numbers',
  2: 'Worth more',
  3: 'Surviving diligence',
  4: 'The exit clock',
};

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');
const dateArg = args.includes('--date') ? args[args.indexOf('--date') + 1] : null;

const iso = (d) => d.toISOString().slice(0, 10);
const parseISO = (s) => new Date(`${s}T00:00:00Z`);

const today = dateArg ? parseISO(dateArg) : parseISO(iso(new Date()));

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    out[kv[1]] = v;
  }
  return out;
}

const posts = [];
for (const f of readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))) {
  const fm = frontmatter(readFileSync(join(BLOG_DIR, f), 'utf8'));
  if (!fm || !fm.pubDate) continue;
  posts.push({
    file: f,
    slug: fm.slug || f.replace(/\.md$/, ''),
    title: fm.title || '',
    pubDate: fm.pubDate.slice(0, 10),
    pillar: fm.pillar ? Number(fm.pillar) : null,
    archived: fm.archived === 'true',
    hub: fm.pillarHub === 'true',
  });
}

const live = posts.filter((p) => !p.archived);
const taken = new Set(live.map((p) => p.pubDate));

// 1. Next open Tuesday after today.
let slot = new Date(today);
slot.setUTCDate(slot.getUTCDate() + 1);
while (slot.getUTCDay() !== 2) slot.setUTCDate(slot.getUTCDate() + 1);
while (taken.has(iso(slot))) slot.setUTCDate(slot.getUTCDate() + 7);
const slotISO = iso(slot);

// 2. Queue override, if a row names this slot.
let override = null;
if (existsSync(QUEUE_FILE)) {
  for (const line of readFileSync(QUEUE_FILE, 'utf8').split(/\r?\n/)) {
    const row = line.match(/^\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*([1-4])\s*\|\s*([^|]*)\|/);
    if (row && row[1] === slotISO) {
      override = { pillar: Number(row[2]), workingTitle: row[3].trim() };
      break;
    }
  }
}

// 3. Balance by forward count, tie-break to the stalest.
const forward = live.filter((p) => p.pubDate > iso(today) && p.pillar && PILLARS[p.pillar]);
const stats = Object.keys(PILLARS).map((k) => {
  const n = Number(k);
  const mine = live.filter((p) => p.pillar === n && !p.hub);
  const dates = mine.map((p) => p.pubDate).sort();
  return {
    pillar: n,
    name: PILLARS[n],
    ahead: forward.filter((p) => p.pillar === n).length,
    total: mine.length,
    lastCovered: dates.length ? dates[dates.length - 1] : 'never',
  };
});

const computed = [...stats].sort(
  (a, b) => a.ahead - b.ahead || (a.lastCovered < b.lastCovered ? -1 : 1),
)[0];

const chosen = override ? stats.find((s) => s.pillar === override.pillar) : computed;

const result = {
  slot: slotISO,
  pillar: chosen.pillar,
  pillarName: chosen.name,
  source: override ? 'content-queue.md' : 'computed from repo state',
  workingTitle: override?.workingTitle || null,
  asOf: iso(today),
  pillarStats: stats,
};

if (jsonOnly) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Slot:   ${result.slot} (next open Tuesday)`);
  console.log(`Pillar: ${result.pillar}, ${result.pillarName}`);
  console.log(`Source: ${result.source}`);
  if (result.workingTitle) console.log(`Title:  ${result.workingTitle}`);
  console.log('');
  console.log('Pillar  Ahead  Total  Last covered  Name');
  for (const s of stats) {
    const mark = s.pillar === chosen.pillar ? '>' : ' ';
    console.log(
      `${mark} ${s.pillar}     ${String(s.ahead).padStart(3)}    ${String(s.total).padStart(3)}   ${s.lastCovered}    ${s.name}`,
    );
  }
  console.log('');
  console.log(JSON.stringify({ slot: result.slot, pillar: result.pillar, source: result.source }));
}
