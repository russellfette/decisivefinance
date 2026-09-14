#!/usr/bin/env node
// next-slot.mjs
// Decides what the weekly content run should do, from repo state only.
// No dependency on OneDrive, the editorial calendar, or any doc outside this repo.
//
// Why this exists: the content-engine planning docs in the canon repo
// (Decisive-Editorial-Calendar-v1, CONTENT-PILLAR-STRATEGY-v1, and the
// content schedule) are not listed CURRENT in CANON-INDEX v2.2. They are
// flagged there as built on the retired funded-tech ICP. Slot and pillar
// selection therefore comes from the live corpus, which is trigger-first.
// That is the design, not a fallback: a run that cannot reach those files
// has lost nothing and should not report a caveat.
//
// Usage:
//   node scripts/next-slot.mjs                     decide from today
//   node scripts/next-slot.mjs --date 2026-09-14   decide as if today were that date
//   node scripts/next-slot.mjs --max-ahead 6       weeks of banked blog before draft mode stops
//   node scripts/next-slot.mjs --force-draft       draft anyway, ignoring the cap
//   node scripts/next-slot.mjs --json              machine-readable only
//
// Modes, decided first:
//   draft      the blog queue has room. Draft the post for the open slot below.
//   repurpose  the blog queue is banked past the cap. Draft the LinkedIn
//              repurpose for the soonest publishing posts that lack one.
//   idle       queue banked past the cap and every publishing post already
//              has a LinkedIn draft. Nothing to write this week.
//
// Draft-mode selection rules, in order:
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
const LI_DIR = join(REPO, 'src/content/linkedin');
const QUEUE_FILE = join(REPO, 'content-queue.md');

// Pillar 5 is the Industry band, not part of the Tuesday rotation.
const PILLARS = {
  1: 'Sellable numbers',
  2: 'Worth more',
  3: 'Surviving diligence',
  4: 'The exit clock',
};

// Weeks of banked blog posts allowed before the run stops drafting new ones.
// Six is deliberate: enough runway that one missed run leaves no gap, short
// enough that no post is written against canon a quarter before it publishes.
const DEFAULT_MAX_AHEAD = 6;

// How many LinkedIn repurposes one repurpose-mode run should produce. Two
// beats one: publishing runs up to two posts a Tuesday, so one a week never
// closes a backlog.
const REPURPOSE_BATCH = 2;

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');
const forceDraft = args.includes('--force-draft');
const dateArg = args.includes('--date') ? args[args.indexOf('--date') + 1] : null;
const maxAhead = args.includes('--max-ahead')
  ? Number(args[args.indexOf('--max-ahead') + 1])
  : DEFAULT_MAX_AHEAD;

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

// The next Tuesday after today, filled or not.
const firstTuesday = new Date(today);
firstTuesday.setUTCDate(firstTuesday.getUTCDate() + 1);
while (firstTuesday.getUTCDay() !== 2) firstTuesday.setUTCDate(firstTuesday.getUTCDate() + 1);

// 1. Next open Tuesday, and how many consecutive Tuesdays are banked before it.
const slot = new Date(firstTuesday);
let weeksBanked = 0;
while (taken.has(iso(slot))) {
  weeksBanked += 1;
  slot.setUTCDate(slot.getUTCDate() + 7);
}
const slotISO = iso(slot);
const bankedThrough = weeksBanked
  ? iso(new Date(slot.getTime() - 7 * 86400000))
  : null;

// LinkedIn backlog: posts that publish from the next Tuesday onward with no
// repurpose drafted. This is the real weekly deficit once the blog is banked.
const haveLI = existsSync(LI_DIR)
  ? new Set(readdirSync(LI_DIR).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, '')))
  : new Set();
const liBacklog = live
  .filter((p) => p.pubDate >= iso(firstTuesday) && !haveLI.has(p.slug))
  .sort((a, b) => (a.pubDate < b.pubDate ? -1 : a.pubDate > b.pubDate ? 1 : 0))
  .map((p) => ({ slug: p.slug, pubDate: p.pubDate, pillar: p.pillar, title: p.title }));

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

// Mode decision. An override row for the open slot is a hand-written
// instruction, so it beats the cap the same way it beats the computed pillar.
const queueDeep = weeksBanked >= maxAhead;
let mode = 'draft';
let modeReason = `blog banked ${weeksBanked} of ${maxAhead} weeks, room to draft`;
if (queueDeep && !forceDraft && !override) {
  if (liBacklog.length) {
    mode = 'repurpose';
    modeReason = `blog banked ${weeksBanked} weeks through ${bankedThrough}, past the ${maxAhead} week cap, and ${liBacklog.length} publishing posts have no LinkedIn draft`;
  } else {
    mode = 'idle';
    modeReason = `blog banked ${weeksBanked} weeks through ${bankedThrough}, past the ${maxAhead} week cap, and every publishing post already has a LinkedIn draft`;
  }
} else if (queueDeep && override) {
  modeReason = `blog banked ${weeksBanked} weeks, past the cap, but content-queue.md names ${slotISO} so the hand-written row wins`;
} else if (queueDeep && forceDraft) {
  modeReason = `blog banked ${weeksBanked} weeks, past the ${maxAhead} week cap, drafting anyway on --force-draft`;
}

const assignment = mode === 'repurpose' ? liBacklog.slice(0, REPURPOSE_BATCH) : [];

const result = {
  mode,
  modeReason,
  weeksBanked,
  maxAhead,
  bankedThrough,
  slot: mode === 'draft' ? slotISO : null,
  pillar: mode === 'draft' ? chosen.pillar : null,
  pillarName: mode === 'draft' ? chosen.name : null,
  source: override ? 'content-queue.md' : 'computed from repo state',
  workingTitle: override?.workingTitle || null,
  repurpose: assignment,
  linkedinBacklog: liBacklog.length,
  asOf: iso(today),
  nextOpenTuesday: slotISO,
  pillarStats: stats,
};

if (jsonOnly) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`Mode:   ${result.mode.toUpperCase()}`);
  console.log(`Why:    ${result.modeReason}`);
  console.log('');
  if (mode === 'draft') {
    console.log(`Slot:   ${result.slot} (next open Tuesday)`);
    console.log(`Pillar: ${result.pillar}, ${result.pillarName}`);
    console.log(`Source: ${result.source}`);
    if (result.workingTitle) console.log(`Title:  ${result.workingTitle}`);
  } else if (mode === 'repurpose') {
    console.log('Draft the LinkedIn repurpose for these, soonest publishing first:');
    for (const r of assignment) {
      console.log(`  ${r.pubDate}  p${r.pillar}  ${r.slug}`);
    }
    console.log('');
    console.log(`LinkedIn backlog: ${liBacklog.length} publishing posts with no repurpose.`);
    console.log(`Next open blog Tuesday, for reference: ${slotISO}.`);
  } else {
    console.log('Nothing to draft. Blog is banked past the cap and the LinkedIn');
    console.log('backlog is clear. Say so in the email and stop.');
  }
  console.log('');
  console.log('Pillar  Ahead  Total  Last covered  Name');
  for (const s of stats) {
    const mark = mode === 'draft' && s.pillar === chosen.pillar ? '>' : ' ';
    console.log(
      `${mark} ${s.pillar}     ${String(s.ahead).padStart(3)}    ${String(s.total).padStart(3)}   ${s.lastCovered}    ${s.name}`,
    );
  }
  console.log('');
  console.log(
    JSON.stringify({
      mode: result.mode,
      slot: result.slot,
      pillar: result.pillar,
      repurpose: assignment.map((r) => r.slug),
      weeksBanked,
    }),
  );
}
