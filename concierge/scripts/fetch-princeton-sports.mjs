#!/usr/bin/env node
// Pulls upcoming HOME games for every Princeton University varsity sport from
// Princeton Athletics' own public JSON API (no key/auth required) and writes
// a normalized events file the Princeton page can fetch at runtime.
//
// Data source, confirmed working 2026-08-18:
//   https://goprincetontigers.com/api/v2/navigation              (sport list + ids)
//   https://goprincetontigers.com/api/v2.1/EventsResults/upcoming?sportId=<id>
//
// Run: node scripts/fetch-princeton-sports.mjs
// (intended to run on a schedule via .github/workflows/update-princeton-sports.yml)

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, '..', 'data', 'princeton-sports.json');
const UA = 'Mozilla/5.0 (compatible; ConciergeEventsBot/1.0)';
const GAMES_PER_SPORT = 3;
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

async function getJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

function collectSports(navItems, out = new Map()) {
  for (const item of navItems || []) {
    if (item.sport && item.sport.id && item.sport.title && !out.has(item.sport.id)) {
      out.set(item.sport.id, { id: item.sport.id, title: item.sport.title });
    }
    if (item.items) collectSports(item.items, out);
  }
  return out;
}

async function main() {
  console.log('Fetching Princeton Athletics sport list…');
  const nav = await getJson('https://goprincetontigers.com/api/v2/navigation');
  const sports = [...collectSports(nav).values()].filter((s) => s.title !== 'General' && s.title !== 'Princeton Tiger Performance');
  console.log(`Found ${sports.length} sports.`);

  const events = [];
  for (const sport of sports) {
    const url = `https://goprincetontigers.com/api/v2.1/EventsResults/upcoming?sportId=${sport.id}&pageIndex=0&pageSize=25`;
    let data;
    try {
      data = await getJson(url);
    } catch (err) {
      console.warn(`  skip ${sport.title}: ${err.message}`);
      continue;
    }
    const homeGames = (data.items || []).filter((g) => g.locationIndicator === 'H');
    for (const g of homeGames.slice(0, GAMES_PER_SPORT)) {
      const d = new Date(g.date);
      events.push({
        sportId: sport.id,
        sport: sport.title,
        date: g.date,
        mo: MONTHS[d.getMonth()],
        dy: String(d.getDate()),
        time: g.time || null,
        opponent: g.opponent ? g.opponent.title : null,
        location: g.location || 'Princeton, N.J.',
        scheduleUrl: g.schedule ? `https://goprincetontigers.com${g.schedule.url}` : null,
        ticketUrl: (g.media && g.media.tickets) || g.ticketLink || null,
      });
    }
  }

  events.sort((a, b) => new Date(a.date) - new Date(b.date));

  await mkdir(path.dirname(OUT_PATH), { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), source: 'goprincetontigers.com/api/v2.1/EventsResults', events }, null, 2),
  );
  console.log(`Wrote ${events.length} home-game events to ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
