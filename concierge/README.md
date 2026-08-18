# The Concierge

Recreated locally from `concierge-project.docx` (exported from the work PC and
pulled out of Google Drive on 2026-08-18).

"Your local intelligence platform" — a multi-level local guide: country → state →
city → neighborhood, with a searchable tree, a live events rail, Google Maps
panels, and per-neighborhood pages covering food, nightlife, and things to do.

## Files

31 files, all static — no build step, no dependencies.

```
index.html                  home (split view: search + events rail | map)
styles.css                  shared stylesheet
script.js                   shared search tree, nav search, side panel,
                            events data, live-music data

new-jersey/index.html       state
lbi/index.html              Long Beach Island + 6 towns:
  lbi/{holgate,beach-haven,ship-bottom,surf-city,harvey-cedars,barnegat-light}/
princeton/index.html        Princeton + 4 neighborhoods:
  princeton/{palmer-square,witherspoon-jackson,university,western-section}/

connecticut/index.html      state
stamford/index.html         city + 8 neighborhoods:
  stamford/{downtown,harbor-point,shippan-point,springdale,glenbrook,
            north-stamford,cove,waterside}/

texas/index.html            state
lubbock/index.html          city + 3 districts:
  lubbock/{depot-district,tech-district,historic-district}/
```

## Running it

Any static server works — from this folder's **parent**:

```
python3 -m http.server 8000
# then open http://localhost:8000/concierge/index.html
```

**The folder must stay named `concierge`.** `getConciergeDepth()` in `script.js`
finds the path segment literally named `concierge` to work out how many `../` to
prefix onto internal links. Rename the folder and every cross-page link on the
sub-pages breaks.

Opening the files directly via `file://` mostly works, but serving over HTTP is
closer to how it'll actually be hosted.

## Needs internet

- **Google Fonts** — Playfair Display + Inter (`fonts.googleapis.com`)
- **Google Maps** — embedded map iframes (`maps.google.com`)

Both are external embeds; offline they degrade to system fonts and an empty map
panel, and nothing else breaks.

## Notes on the data

All content — the location tree, event listings, venue write-ups — is hardcoded
in `script.js` (`SHARED_SEARCH_TREE`, `PANEL_EVENTS`, `LIVE_MUSIC`) and inline in
each page. There's no backend. The "Suggest a Place / Suggest an Event" forms
don't submit anywhere; they just swap in a thank-you message client-side.

## Live music

Every city and neighborhood page carries a **Live Music** section listing the bars
and venues that book bands, who plays them, and what nights. It's driven by the
`LIVE_MUSIC` object in `script.js` and rendered by `initLiveMusic()` — so the venue
data lives in one place rather than being copy-pasted across 25 pages.

To add a page to the feature, give it two things:

```html
<body data-music-key="beach-haven">
...
<section class="section cat-section" data-cat="music" id="live-music"></section>
```

The key must match an entry in `LIVE_MUSIC`. Pages with a category-pill bar also
get a `🎸 Live Music` pill wired to `data-cat="music"`.

Each venue entry has:

- `nights` — the recurring pattern, i.e. what nights the room books music.
  **Stable.** Bird & Betty's runs Wednesday–Sunday in season; Tiernan's does
  Friday and Saturday at 9:30. That stays true season to season.
- `acts` — bands that play the room regularly, or that it has booked recently.
- `dated` — specific shows with a date. **These go stale.** Only a couple of
  entries have them (Cook's Garage in Lubbock), and they want clearing out or
  refreshing every few months.
- `cal` — a link to the venue's own calendar, which is always more current than
  this site.

Neighborhoods with no music venues say so plainly and point at the nearest place
that has some, rather than padding the section out.

### Where this data came from

Venue names, addresses, phone numbers and recurring music nights were checked
against venue sites, town sites and listings services (Bandsintown, JamBase,
concertfix) in August 2026. Anything that couldn't be confirmed is described as
unconfirmed — Kubel's in Barnegat Light says "occasional, call ahead" rather than
inventing a schedule.

Specific dated lineups were deliberately kept to a minimum. Search results for
them are unreliable in a way that's easy to miss: one search returned a "2026"
Beach Haven concert schedule whose dates were all Wednesdays in **2024**. Those
dates were left out, and the series is documented by its recurring pattern
(Wednesdays, 7:30 PM, Veterans Bicentennial Park) with past lineups labeled as
past. The rule for anything added later: publish the pattern and the calendar
link, and only publish a date you can see on the venue's own listing.

## Fidelity to the original

The Word doc contained the full source of all 26 files with original indentation
intact, so the original import was a verbatim recreation — nothing reformatted or
rewritten. Princeton and the live-music layer were added afterward, in the same
style as the existing pages.

All files parse, and every page is loaded in a headless browser as a check: no
JavaScript errors, no broken local links, no broken images.
