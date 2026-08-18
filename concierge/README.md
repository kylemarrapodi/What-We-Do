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

## The left panel

Both layouts — the home page's split view and the injected side panel on every
other page — share one collapsible left panel, driven by `initPanelCollapse()`
in `script.js`.

The width lives in two CSS variables: `--panel-w-open` never changes (panel
children are sized against it so text doesn't reflow mid-slide), and `--panel-w`
is what the layout reads, dropping to `0px` when `body.panel-collapsed` is set.
That means collapsing is a single class on `<body>`, and both the home grid and
the fixed side panel respond to it.

The choice is stored in `localStorage` under `concierge:panel-collapsed`, so it
carries from page to page instead of resetting on every navigation. A remembered
collapsed state is applied behind a `panel-no-anim` class for one frame, so the
panel doesn't animate shut in front of you on each load.

Below 900px the home page already drops the map and the panel becomes the whole
page, so the toggle is hidden there and the panel is forced open.

Below 768px the panel on every other page becomes an off-canvas drawer: the
content keeps the full width, the drawer floats over it, and a backdrop closes
it on tap. It starts closed, and toggling on a phone deliberately doesn't write
to `localStorage`, so a phone visit can't overwrite the preference set on a
desktop.

## Phones

The site is checked at 390px as well as at desktop width. Things that were
fixed rather than assumed:

- **The nav search bar used to be `display: none` below 768px**, which left a
  phone with no visible way to search — the main entry point to the whole site.
  It now stays, with the logo shrunk to make room and the suggestion dropdown
  spanning the screen instead of a squeezed column.
- **Tap targets** are floored at 36–44px on phones. Several links were 17–21px.
- **Panel type** was sized for a 320px desktop column; on a phone that column is
  the whole screen, and 9–11px text was too small. Those rules carry a `body`
  prefix so they also beat the home page's inline copies of the same classes.
- `.two-col` didn't collapse on the Connecticut and Texas pages, so they
  rendered a squeezed two-column layout on phones.

The audit that found these is worth re-running after layout changes: load each
page at 390px and report any interactive element under 36px, any text under
12px, and any element extending past the viewport.

## Favorites

Anyone can pin the town they live in: every place page carries a **☆ Favorite**
button in the breadcrumb, and favorited places appear under **Your Places** at
the top of the left panel on every page, including the home page.

It's `initFavorites()` in `script.js`, stored in `localStorage` under
`concierge:favorites`. There's no backend and no accounts, so a favorite lives
in the browser that set it — clearing site data loses it, and it doesn't follow
you from your phone to your laptop.

No page markup declares anything. The place a page represents is derived by
matching the page's own path against `SHARED_SEARCH_TREE`, which is also where
the label and its parent ("Beach Haven", "Long Beach Island") come from. Add a
town to the tree and it becomes favoritable automatically.

The home page has no Favorite button, because it isn't a place — it just shows
the list.

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
- `cal` — a link straight to the venue's own events page, which is always more
  current than this site. **This is the most important field.** Nearly every bar
  and venue publishes its own live-music calendar — birdandbettys.com/events,
  tiernansbar.com/happenings, nardistavern.com/band-schedule, joepops.com/events,
  theaandb.com/local-events.html — and that page is the authority. This site's job
  is to tell you the room exists, what nights it books, and to hand you the link.
  Only four entries have no `cal`: Sunset Park (a municipal park), the Witherspoon
  Street church (not a booked venue), and the Ivy Inn, which publishes nothing at
  all — noted as such on the card rather than left blank.

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

Two errors caught on a second pass, both worth knowing about as a pattern:
Nardi's Tavern was placed in Harvey Cedars on the strength of a roundup article
that listed it next to Harvey Cedars venues — it's actually at 11801 Long Beach
Blvd in North Beach Haven, and now sits on the Beach Haven page. And the Surf
City Hotel's site is surfcityhotel.com, not the surfcityhotelnj.com that got
guessed at from the venue name. Roundup articles are fine for finding rooms and
bad for pinning down where they are; domains should come from a search result,
never from the name.

## Fidelity to the original

The Word doc contained the full source of all 26 files with original indentation
intact, so the original import was a verbatim recreation — nothing reformatted or
rewritten. Princeton and the live-music layer were added afterward, in the same
style as the existing pages.

All files parse, and every page is loaded in a headless browser as a check: no
JavaScript errors, no broken local links, no broken images.
