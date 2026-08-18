# Casey's Tavern — Website Design Proposal

This is an **unsolicited design proposal / demo site** for Casey's Tavern, a real
Irish pub and neighborhood bar at 85 Woodside St, Stamford, CT. It was built to
show what a fresh website could look like — it is **not affiliated with,
commissioned by, or published by the bar**. Casey's Tavern does not appear to have
its own dedicated website; its primary online presence is its
[Yelp listing](https://www.yelp.com/biz/caseys-tavern-stamford) and
[Facebook page](https://www.facebook.com/caseys.stamford/).

The contact form does not actually send anywhere (see `script.js` — it just shows
an alert). No ordering happens on this site; the "Call to Order" / "Call Us" links
just dial the bar's real phone number.

## Files
- `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 15 images, all real, see breakdown below

## What's real vs. what's placeholder

**Address, phone, and hours** — 85 Woodside St, Stamford, CT 06902 · (203) 363-0804 —
were confirmed live on Casey's Tavern's Yelp business page (yelp.com/biz/caseys-tavern-stamford)
during research in August 2026, and cross-checked against restaurantji.com and other
listing aggregators (Tripadvisor, allmenus, Seamless/Grubhub restaurant pages), which
all independently agree. Hours: Mon–Thu 11:00 AM–1:00 AM, Fri–Sat 11:00 AM–2:00 AM,
Sunday 11:00 AM–1:00 AM.

**Weekly events** — Thursday open mic night and Sunday karaoke at 9 PM — are
corroborated across multiple independent sources (Tripadvisor attraction listing,
restaurantji reviews, general web results) as of research time.

**Rating** — "3.9 / 5 on Yelp, 60+ reviews" is the live figure pulled directly from
the bar's Yelp page. A separate aggregator (restaurantji) shows a higher 4.4/5 across
125 reviews; we used Yelp's own live number as the primary, directly-verified source.

**Ownership / founding story** — deliberately **not included**. A single low-confidence
web result named specific individuals as owners; since that couldn't be
cross-verified against an authoritative source, we chose not to publish real people's
names on a proposal site with no connection to the business. The About page describes
the bar's character and offerings without attributing them to named owners.

## Menu content

The menu on `menu.html` is transcribed directly from a photograph of Casey's Tavern's
own current printed menu, sourced from the bar's Yelp photo gallery (research
conducted August 2026). Its pricing lines up closely with the numbers shown on the
bar's live Yelp business-page header photos (e.g. "Casey's Burger 17," "Buffalo
Tenders or Wings 15"), which we treated as the best signal of current pricing.

During research we also found photos of an **older, more extensive laminated menu**
(also real, also from the bar) with additional items — wraps, a full lunch-specials
program, corned beef and cabbage, bangers and mash, a 12oz sirloin steak, penne a la
vodka, and a children's menu — at noticeably lower prices. Rather than guess which
items are still offered, we left those exclusive-to-the-older-menu items off
`menu.html` entirely. Photos of that older menu are still shown, clearly labeled, on
the Gallery page for reference/atmosphere.

**Bar & Drinks**: no itemized drink list with prices was found anywhere in research.
The "On Tap & Behind the Bar" section on the menu page is a factual description built
from what's visible in the real photos — Guinness, Harp, and Blue Moon tap handles,
a Samuel Adams pint glass, a Jameson bar mat, and a well-stocked backbar — not an
invented cocktail list or pricing.

## Photos are entirely real — labeled in the Gallery page itself

All 15 photos were downloaded at original resolution directly from Casey's Tavern's
own public photo listing on Yelp (yelp.com/biz_photos/caseys-tavern-stamford), which
is populated with the bar's own uploaded business photos. No stock photography from
Unsplash/Pexels was needed for this proposal.

| File | Depicts | Real or Stock |
|---|---|---|
| `exterior-real.jpg` | The real storefront signage on Woodside Street | **Real** |
| `bar-interior-bw-real.jpg` | The real bar and tap line, black-and-white | **Real** |
| `interior-1-real.jpg` | Inside the bar on a busy night | **Real** |
| `interior-2-real.jpg` | The back-room pool table and darts | **Real** |
| `grilled-chicken-wrap-real.jpg` | A plated grilled chicken wrap and fries | **Real** |
| `fish-and-chips-real.jpg` | Beer-battered fish and chips | **Real** |
| `philly-cheesesteak-wrap-real.jpg` | A Philly steak wrap and fries | **Real** |
| `perfect-pint-real.jpg` | A freshly poured pint at the bar | **Real** |
| `dark-beer-pint-real.jpg` | A dark beer in a Samuel Adams pint glass | **Real** |
| `beer-bottle-shelf-real.jpg` | The "Caseys" bar sign over bottled beer | **Real** |
| `menu-and-guinness-real.jpg` | A Guinness next to the printed menu | **Real** |
| `menu-appetizers-salads-real.jpg` | Current printed menu, page 1 | **Real** |
| `menu-sandwiches-entrees-real.jpg` | Current printed menu, page 2 | **Real** |
| `menu-board-1-real.jpg` | Older/extended printed menu, page 1 | **Real** (archival) |
| `menu-board-2-real.jpg` | Older/extended printed menu, page 2 | **Real** (archival) |

**Privacy note:** two interior photos (`interior-1-real.jpg`, `interior-2-real.jpg`)
show patrons in the public bar area — playing pool, sitting at the bar — captured at a
normal candid distance as part of the bar's own public atmosphere photos, not private
or family photos of the owners or staff. No personal/family photos of identifiable
individuals were found or used, consistent with the privacy approach used on the
other sites in this series.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
