# The Concierge

Recreated locally from `concierge-project.docx` (exported from the work PC and
pulled out of Google Drive on 2026-08-18).

"Your local intelligence platform" — a multi-level local guide: country → state →
city → neighborhood, with a searchable tree, a live events rail, Google Maps
panels, and per-neighborhood pages covering food, nightlife, and things to do.

## Files

26 files, all static — no build step, no dependencies.

```
index.html                  home (split view: search + events rail | map)
styles.css                  shared stylesheet
script.js                   shared search tree, nav search, side panel, events data

new-jersey/index.html       state
lbi/index.html              Long Beach Island + 6 towns:
  lbi/{holgate,beach-haven,ship-bottom,surf-city,harvey-cedars,barnegat-light}/

connecticut/index.html      state
stamford/index.html         city + 7 neighborhoods:
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
in `script.js` (`SHARED_SEARCH_TREE`, `PANEL_EVENTS`) and inline in each page.
There's no backend. The "Suggest a Place / Suggest an Event" forms don't submit
anywhere; they just swap in a thank-you message client-side.

## Fidelity to the original

The Word doc contained the full source of all 26 files with original indentation
intact, so this is a verbatim recreation — nothing was reformatted or rewritten.
All 26 files were verified to parse, and all 24 pages were loaded in a headless
browser: no JavaScript errors, no broken local links, no broken images.
