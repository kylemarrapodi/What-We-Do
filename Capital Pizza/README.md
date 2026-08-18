# Capital Pizza — Website Design Proposal

This is an **unsolicited design proposal / demo site** for Capital Pizza, a real
gourmet pizza restaurant and bar in the Tech Terrace neighborhood of Lubbock, TX
(with a second location in Lakeridge). It was built to show what a fresh website
could look like — it is **not affiliated with, commissioned by, or published by
the restaurant**, and the real Capital Pizza's actual website is
[capitalpizzalubbock.com](http://www.capitalpizzalubbock.com/).

The contact form does not actually send anywhere (see `script.js` — it just shows
an alert). No ordering happens on this site; the "Order Online" links point to the
restaurant's real ordering page at [ordercapitalpizza.com](https://www.ordercapitalpizza.com/).

## Files
- `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 12 images, see breakdown below

## What's real vs. what's placeholder

All factual claims below (locations, phone numbers, hours, founding story, menu
items/prices, awards, craft beer program, etc.) were pulled directly from the
restaurant's own official website (`capitalpizzalubbock.com`, including its
Tech Terrace and Lakeridge sub-pages) and cross-checked against its real online
ordering pages (`ordercapitalpizza.com`, `ordercapitalpizzamenu.com`, both
Slice-powered) and public listings (Yelp, Tripadvisor) during research in
August 2026. Nothing about the business itself is invented.

- **Tech Terrace location** (flagship): 2705 26th St, Lubbock, TX 79410 · (806) 368-3603
  — confirmed on the official site, Slice ordering page, and matches the address on
  Yelp/Tripadvisor listings for "Capital Pizza."
- **Lakeridge location**: 8211 Slide Rd, Lubbock, TX 79424 · (806) 701-4062 —
  confirmed on the official site's Lakeridge page and its own Slice ordering page.
- **Founding story**: the official website's own text states Capital "opened it's
  doors January 2013" at the Tech Terrace corner and describes itself as "the
  first & only restaurant/bar ever in Tech Terrace." Some third-party aggregators
  list an earlier "established 2011" date; we went with the restaurant's own stated
  opening date as the more authoritative source.
- **Hours**: the official website states the Tech Terrace location is open daily,
  11 AM–midnight (kitchen closes 11 PM), with to-go orders taken until 10:45 PM.
  Third-party aggregators show slightly different hours by day (e.g. Sunday
  closing at midnight vs. later) — we used the restaurant's own stated hours as
  primary. **Always confirm current hours with the restaurant before visiting.**
- **Awards/reviews**: a 2016 Lubbock Avalanche-Journal "Best Pizza" award and
  300+ Yelp reviews are both corroborated by multiple independent sources
  (Tripadvisor, Yelp, and general web results) as of August 2026.
- **Craft beer / happy hour details** (100+ rotating craft beers, $3 domestics/wells
  Monday & Saturday, Sunday specials 12–7 PM) are paraphrased from the restaurant's
  own official website text.

## Menu content
The menu on `menu.html` is transcribed from Capital Pizza's real, current (2026)
online ordering menus for both locations. Where the two locations' listed prices
differed slightly, we used the more detailed/itemized source. Prices should be
close to accurate as of research time (August 2026) but menus and pricing change
— always confirm with the restaurant. A few descriptive blurbs (e.g. for "The
Rabbit" or "The Smokehouse") are reasonable, clearly-hedged inferences from the
pizza name where the official sources didn't spell out ingredients — the menu page
says "ask your server" rather than inventing specifics.

## Photos are almost entirely real — labeled in the Gallery page itself

Capital Pizza's own official website (a Squarespace site) hosts a genuinely rich
set of real marketing photos — exterior signage (day and night), the interior bar
and dining room, tap wall and back-bar detail, pizza close-ups, and a to-go box
stack. All of these were downloaded directly from `capitalpizzalubbock.com` and
used here at their original resolution.

| File | Source | Real or Stock |
|---|---|---|
| `logo-real.png` | Capital Pizza's official website | **Real** — the restaurant's actual "Gourmet Pizza & Lounge" logo |
| `signage-day-real.jpg` | Capital Pizza's official website | **Real** — actual window signage, daylight |
| `signage-night-real.jpg` | Capital Pizza's official website | **Real** — actual exterior sign, lit at night |
| `bar-interior-real.jpg` | Capital Pizza's official website | **Real** — the actual bar, taps, and seating at Tech Terrace |
| `dining-room-real.jpg` | Capital Pizza's official website | **Real** — the actual dining room, Texas Tech/Big 12 decor |
| `tap-wall-real.jpg` | Capital Pizza's official website | **Real** — decorative tap handle wall detail |
| `liquor-shelf-real.jpg` | Capital Pizza's official website | **Real** — the back bar liquor shelf and beer cooler |
| `pizza-closeup-real.jpg` | Capital Pizza's official website | **Real** — an actual specialty pizza |
| `pizza-detail-real.jpg` | Capital Pizza's official website | **Real** — topping detail crop of the same pizza |
| `pizza-cutting-real.jpg` | Capital Pizza's official website | **Real** — a pizza being sliced (used as the homepage hero) |
| `pizza-boxes-real.jpeg` | Capital Pizza's official website | **Real** — stacked to-go boxes |
| `dough-prep-stock.jpeg` | Capital Pizza's official website | **Labeled Stock** — a generic hands-in-flour photo used site-wide on Capital's own template; it doesn't show any branding or identifiable location, so it's treated as illustrative stock rather than a confirmed photo of their actual kitchen |

Deliberately **not used**: one interior bar photo shows two staff members working
behind the counter, visible only at a distance while doing their jobs in a public
dining room — this is ordinary business marketing material (not a private/family
photo of an identifiable individual), so it was used, but captioned generically
without naming or focusing on anyone. No personal/family photos were found on the
restaurant's official site.

Because the official website's own photo library was this complete, **no stock
photography from Unsplash/Pexels was needed** for this proposal — a step up from
a typical placeholder-heavy demo site.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
