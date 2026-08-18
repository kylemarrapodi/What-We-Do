# The Shack BBQ — Website Design Proposal

This is an **unsolicited design proposal / demo site** for The Shack BBQ, a real
pecan-wood-smoked barbecue restaurant and bar at 2309 N Frankford Ave, Lubbock, TX
79416. It was built to show what a fresh website could look like — it is **not
affiliated with, commissioned by, or published by the restaurant**. The Shack does
not appear to have an official website of its own (a domain called
`the-shack-bbq.site` shows up in search results but doesn't resolve/load, and
looks like a third-party menu-aggregator artifact rather than the restaurant's
real site); its real online presence is its
[Google Business listing](https://www.google.com/maps/place/The+Shack,+BBQ),
[Facebook page](https://www.facebook.com/theshacklubbockbbq/), and
[Instagram](https://www.instagram.com/theshackbbq_lubbock/).

**Business identification note:** "The Shack" is a very generic name, and Lubbock
has other unrelated businesses using it. The business identified and used here is
specifically **The Shack BBQ / "The Shack, BBQ"**, a barbecue restaurant and bar
at 2309 N Frankford Ave — confirmed as a single, consistent business (same address,
same phone family, same ~1,400 Google reviews at 4.6 stars) across Google Maps,
Yelp, Tripadvisor, Wanderlog, RestaurantGuru, and several Lubbock news/radio outlets
(KCBD, KFMX, KFYO, EverythingLubbock.com). It was chosen as the clear, prominent,
well-reviewed match for "The Shack" in Lubbock, TX.

The contact form does not actually send anywhere (see `script.js` — it just shows
an alert). No ordering happens on this site.

## Files
- `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 8 images (1 real, 7 stock), see breakdown below

## What's real vs. what's placeholder

**Name, address, and phone** — The Shack BBQ, 2309 N Frankford Ave, Lubbock, TX
79416 — confirmed independently across Google Maps (live listing, checked August
2026: 4.6★, ~1,400 reviews, "$10–20"), Yelp (`+18064161283`), Wanderlog, and
RestaurantGuru. **(806) 416-1283** is the number listed on Yelp and Google and is
used as the primary contact number on this site. Note: the phone number
hand-painted on the actual building (visible in the real exterior photo used on
this site) reads **747-1810** — an older number that still appears on some
listings (Wanderlog, the building signage itself). Both numbers point to the same
restaurant; 416-1283 was used here as the more consistently-cited current number.

**Hours** — sources disagreed somewhat, likely reflecting real changes over time.
Older aggregators (Wanderlog, RestaurantGuru) list Sun–Mon 11 AM–9 PM, Tue closed,
Wed–Thu 11 AM–9 PM, Fri–Sat 11 AM–10 PM. A more recent (2025) local radio article
(KFYO) describes an announced hours expansion to **Wednesday–Sunday 11 AM–10 PM,
Tuesday 11 AM–3 PM** with a complimentary bar 4–10 PM Wed–Sun — which is what's
shown as primary on this site, flagged with a "call ahead to confirm" note since
hours have clearly shifted more than once recently.

**History** — the founding story (Kyle Farris and wife Kelly opening in March
2014 after Farris's 2013 motorcycle accident and recovery), the 2020 pandemic-era
closure (cited reasons: brisket costs exceeding $7/lb and supply chain problems),
and the 2021 reopening under new owner Scott Stephenson (who kept the original
pitmaster, cook, and menu) are sourced from a
[Texas Monthly BBQ writeup](https://www.texasmonthly.com/bbq/the-shack-bar-b-q-2015/)
(referenced via search; the live page returned a 403 on direct fetch) and a
[KCBD News story](https://www.kcbd.com/2021/04/14/shack-bbq-keep-legacy-alive-under-new-owner/)
on the 2021 reopening. The 2025 service changes (table service, complimentary bar,
extended hours) and the September 2025 pit-area fire are sourced from local radio
station articles ([KFYO](https://kfyo.com/the-shack-bbq-in-lubbock-makes-a-major-announcement-about-their-future/),
[KFMX](https://kfmx.com/shack-bbq-fire/) and
[KFMX](https://kfmx.com/shack-bbq-open-2025/)).

**Menu items and prices** are transcribed from a public listing on
[allmenus.com](https://www.allmenus.com/tx/lubbock/729461-the-shack-bbq/menu/),
cross-checked for item names against Wanderlog's and RestaurantGuru's
descriptions of the food (brisket, turkey, pulled pork, ribs, sausage, collard
greens, banana pudding, etc.). This snapshot likely predates the 2025 move to
table service and the bar addition, so pricing may be out of date — the menu page
calls this out explicitly and points people to confirm before ordering.

**Rating** (4.6★, ~1,400 Google reviews) was read directly off The Shack's live
Google Maps listing during research (August 2026).

**Photos are a mix — clearly labeled in the Gallery page itself:**

| File | Depicts | Real or Stock | Source |
|---|---|---|---|
| `exterior-sign-real.jpg` | The Shack's real storefront — hand-painted "THE SHACK BBQ" sign, corrugated tin siding, the 747-1810 phone placard, and a handwritten hours sign | **Real** | The Shack's Google Business listing (Google Maps photo, Oct 2020) |
| `brisket-stock.jpg` | Sliced smoked brisket with a peppery bark | Stock | Wikimedia Commons (CC BY-SA 4.0) |
| `pulled-pork-stock.jpg` | Pulled pork sandwich | Stock | Wikimedia Commons (CC BY 2.0) |
| `ribs-stock.jpg` | A rack of glazed BBQ ribs | Stock | Wikimedia Commons (CC BY 4.0) |
| `collard-greens-stock.jpg` | Collard greens simmering with bacon on a stovetop | Stock | Wikimedia Commons (CC BY-SA 4.0) |
| `banana-pudding-stock.jpg` | A pan of banana pudding with vanilla wafers | Stock | Wikimedia Commons (CC0) |
| `sweet-tea-stock.jpg` | A glass of sweet tea on an outdoor rail | Stock | Wikimedia Commons (CC0) |
| `string-lights-stock.jpg` | String lights glowing at dusk on a patio railing | Stock | Pexels (free license) |

None of these stock photos depict the real Shack BBQ, and each is clearly tagged
"Stock Photo" in the Gallery UI itself, matching the labeling convention used on
the other sites in this series.

**Privacy note:** Several candidate photos were deliberately **not used**. Google's
photo gallery for this listing and a RestaurantGuru photo collection both turned
up genuine customer photos of the restaurant's interior, bar, and food — but the
RestaurantGuru images were low-quality four-panel collages carrying a cartoon
mascot watermark, and several (both there and on Google) clearly showed
identifiable patrons' faces, including a child in one shot. Since those are
photos of real people who didn't consent to appearing in a stranger's demo
website, and the collages weren't usable/clean regardless, none of them were
used. The one real photo used (`exterior-sign-real.jpg`) is a clean, people-free
storefront shot.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
