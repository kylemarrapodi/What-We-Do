# What-We-Do — Project State

_Last updated: Aug 20, 2026. This file is the cross-session source of truth. Read it (and `git log --oneline -30`) before working on anything here. Keep it updated after major changes._

## Repo / deploy
- Monorepo of sites, remote: https://github.com/kylemarrapodi/What-We-Do (private), branch `main`
- Live via GitHub Pages: https://kylemarrapodi.github.io/What-We-Do/ (root `index.html` is a hub linking all projects; rebuilds ~1 min after push; hard-refresh for cache)
- Collaborator: Kyle + one colleague (GitHub invite)

## Projects
- **concierge/** — the main build. Local-guide platform: country → state (CT/NJ/TX/NY) → city/borough → neighborhood. All data hardcoded static; no backend. "Suggest a place/event" forms are decorative (candidate future feature: real capture + Claude-screened validation pipeline).
- **sea-spray-motel/** — flagship proposal site being demoed to the real motel's owners. Real traced-SVG logo (photos/sign logo best.jpg source), beach video hero (Pixabay, 18s/6MB loop), real OTA+official-site photos, LBI Guide = iframe embed of the Concierge Beach Haven page (`lbi-guide.html`). Brand fonts stay (Kaushan Script logo); © 2026 footer, no disclaimer.
- 6 small-business proposal sites (Cast Iron Grill, Capital Pizza, Casey's Tavern, Izet's, Hudson House Bar, The Shack) — **all six rebuilt Aug 21, 2026** to a common standard: scrolling home page with a photographic hero, three-card feature section, gallery strip, banner, embedded map, and a footer disclaimer. Composition follows the business rather than a template (Hudson House has no kitchen so it leads with the games; Izet's leads with before-and-after repair work). Pending T's design review.
  - **`body.scroll-page` is required** on any page with sections below the hero. The base layout locks `html, body { overflow:hidden }` for the full-screen split; without the class everything below the fold is unreachable. This bug shipped in Capital Pizza and was caught Aug 21.
  - **Inter is now gone from all six** (it was the "standard AI font" flagged in convention 3). Per-site: Capital Pizza still on Inter → *to revisit*; Casey's=Karla, Cast Iron=Archivo, Hudson=Space Grotesk, Izet's=Jost, Shack=Barlow. When changing a font, change it in the stylesheet AND every page's font link — updating one leaves the other falling back to generic sans.
  - Info-row icons are drawn SVG, never emoji, and use each site's LIGHT accent: the primary accent is often the same hue as the dark panel behind it (Casey's green-on-green; The Shack's `--smoke` measured 2.45:1, below the 3:1 floor).

## Concierge — current coverage
- **Connecticut:** Stamford (+ neighborhood subpages), Greenwich, New Canaan. `data/connecticut-places.geojson` (3 towns) on the state map.
- **New Jersey:** Princeton (+4 subpages), Sea Bright, Montgomery Twp, Cape May, LBI: 5 boroughs + Holgate + 3 Long Beach Township community pages (loveladies/, brant-beach/, spray-beach/) — island map tiles gap-free (`data/lbi-towns.geojson`, 10 shapes). NJ state page has top sidebar map (`data/new-jersey-places.geojson`, 14 features).
- **Texas:** Lubbock (+3 district subpages).
- **New York:** Manhattan hub — ALL 42 neighborhoods (single-page hub, sections + anchors; `data/manhattan-neighborhoods.geojson`, OSM relations ~8398xxx; documented fallbacks: Nolita=split of Little Italy relation, Midtown West=Theater District+Midtown union, Sutton Place=Midtown East clip, StuyTown=landuse way, Roosevelt Island=coastline). Queens hub — 10 neighborhoods (NTA2020 boundaries mostly; `data/queens-neighborhoods.geojson`). Brooklyn hub — COMPLETE (10 neighborhoods: Williamsburg, Greenpoint, DUMBO, Brooklyn Heights, Downtown Brooklyn, Fort Greene, Park Slope, Prospect Heights incl. Prospect Park, Bushwick, Coney Island; `data/brooklyn-neighborhoods.geojson` from NTA2020 + the two LPC historic districts for DUMBO since the NTA lumps it with Downtown; borough boundary OSM rel 9691750; PIP quirks documented in the map caption — Barclays/GAP arch sit in the Park Slope NTA, Brooklyn Paramount in Fort Greene, Transit Museum in Bklyn Heights).
- **Home page:** left panel (search tree + "Happening in X" events panel driven by map hover/zoom) + US-wide map (`data/all-places.geojson`, ~16 shapes, hover/click-nav).

## Conventions (non-negotiable)
1. **Zero fabrication.** Every event/venue/date verified against a live web source in-session; closure-check businesses; PIP-test addresses into the right polygon; delete rather than guess. (Fabricated content was caught multiple times early — fake festivals, wrong TTU dates, invented venues.)
2. **Boundaries:** real OSM relations via Overpass where they exist; NYC DCP NTA2020 for outer boroughs; document any fallback in the feature's `source` property and the page's map caption.
3. **Fonts:** Source Sans 3 (body) + Lora (display) site-wide on Concierge. Never Inter/Playfair ("standard AI font" — owner rejected).
4. **Maps:** Leaflet + OSM tiles via shared `concierge/interactive-map.js` (initCityBoundaryMap / initNeighborhoodMap). Ctrl/cmd+scroll zooms toward cursor (setZoomAround); plain scroll scrolls page. Hover=gold highlight+tooltip, click=navigate/scroll.
5. **Page format:** hero with compact right-aligned stat cards → Events first → Dining → Where to Stay → rest; sticky right sidebar with map (Connecticut page = reference); compact one-line listings; breadcrumbs Home › State › Town.
6. **Sea Spray Motel featured first** in lodging wherever listed (Beach Haven + Holgate) — business relationship.
7. **Shared data files** to keep in sync when adding a location: page HTML, `script.js` (SHARED_SEARCH_TREE, flat search index, PANEL_EVENTS, LIVE_MUSIC), `index.html` (LOCATIONS events+pins), relevant `data/*.geojson`, state page, `data/all-places.geojson`. `node --check concierge/script.js` before commit.
8. **Princeton sports feed** (`data/princeton-sports.json`) auto-updates via a scheduled bot that pushes daily — never edit; `git pull --rebase` around it.

## Known open items / next steps
- Brooklyn is done (Aug 20, 2026 — three commits: boundaries / hub page / wiring). Next: Central Park + West Village additions, full gap-audit of all location maps (known gap notes: Rose Hill, Union Square, Pastis strip in Meatpacking, WaHi/Inwood seam holding the Cloisters), category quick-nav buttons (Restaurants/Hotels/Events) under every town page's title. Brooklyn follow-ups worth knowing: Brooklyn Brewery moves to 1 Wythe Ave (Greenpoint card says "opening this fall" — update when open); Music Hall of Williamsburg closes end of 2026 (final-year framing baked into cards + LIVE_MUSIC — needs an update in Jan 2027); home `all-places.geojson` now ~17 shapes.
- CT expansion outward after that (Darien, Norwalk, Westport…).
- Suggestion-form capture pipeline (Formspree-style → later Claude-screened auto-validation) — discussed, not built.
- Sea Spray: possible custom domain + sale/handoff decision (iframe LBI Guide depends on Concierge staying hosted).
  Folder renamed `Sea Spray Motel/` → `sea-spray-motel/` on Aug 22, 2026 so the shareable URL carries no `%20`:
  https://kylemarrapodi.github.io/What-We-Do/sea-spray-motel/ — this is the link sent to the owners. The old
  `/Sea%20Spray%20Motel/` path is dead (GitHub Pages has no redirect layer; the `_redirects` file is Netlify-only
  and does nothing here), so anything already sent out pointing at the old path will 404.
- Apollo Theater listed as under renovation (Amateur Night paused) — recheck when it reopens.

## Practical notes
- Local preview: tiny node static servers; Websites-root server on :8199/:8299 etc. (`.devserver.js` in Sea Spray; agents spin ad-hoc ones — kill stray listeners if a port conflicts).
- OneDrive can transiently lock files ("Invalid argument" on read) — retry.
- The motel's official site seaspraylbi.com only works over plain HTTP (broken HTTPS) — source of its room photos.
- Overnight agent runs get cut by usage limits — resume via the same agent with "git status first; commit finished chunks."
