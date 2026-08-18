# Hudson House Bar — Website Design Proposal

This is an **unsolicited design proposal / demo site** for Hudson House Bar, a real
dive bar at 19 E 13th St, Beach Haven, NJ, on Long Beach Island — the same shore
town as the separate, unrelated "Sea Spray Motel" project in this repo. It was
built to show what a simple website could look like for a bar that has never had
one — it is **not affiliated with, commissioned by, or published by the bar**.
Hudson House does not have an official website; its primary online presence is
its [Yelp listing](https://www.yelp.com/biz/hudson-house-bar-beach-haven),
[Instagram](https://www.instagram.com/hudsonhouselbi/), and
[Facebook page](https://www.facebook.com/profile.php?id=145017045534144).

The contact form does not actually send anywhere (see `script.js` — it just shows
an alert). No ordering happens on this site; the "Call the Bar" / phone links just
dial the bar's real phone number.

## Files
- `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 8 images (2 real, 6 stock), see breakdown below

## What's real vs. what's placeholder

**Name, address, and phone** — Hudson House Bar, 19 E 13th St, Beach Haven, NJ
08008, (609) 492-9616 — were confirmed via Google Maps' listing (with a matching
Place ID), Yelp's business page title, restaurantji.com, restaurantguru.com, and
general web search, all independently agreeing, during research in August 2026.

**Hours** — sources disagreed somewhat. Two independent aggregators
(restaurantji.com and restaurantguru.com) closely agree on **Sun–Fri 12:00 PM –
1:00 AM, Saturday 12:00 PM – 1:30 AM**, which is what's shown on this site as the
primary figure. Other, less structured sources suggested different windows (e.g.
an 8 PM opening on weekdays, or a 3 AM closing) — since those didn't independently
corroborate against each other the way the two aggregators did, they were treated
as less reliable. **Always call ahead to confirm current hours** — this is a small,
informal bar that does not publish its own hours anywhere authoritative.

**Cash only, no food service** — corroborated by restaurantguru.com ("cash only,"
"no food") and multiple review summaries describing it as a drinks-and-games bar
with no kitchen. This site's Menu page deliberately does **not** invent a food
menu or itemized drink list/prices — Hudson House doesn't publish one anywhere,
so the Bar Menu page describes what's consistently reported (extensive beer
selection, affordable and strong drinks, a fan-favorite Jack & Coke) without
fabricating specific brands or prices.

**History** — "one of the oldest buildings on Long Beach Island" and the
description of the bar's beer-sign-covered walls, shuffleboard table, pool table,
darts, jukebox, and arcade games are corroborated across multiple sources
(973espn.com, general review summaries, Instagram bio). A claim that the building
has **Prohibition-era / speakeasy roots** appeared in one AI-summarized search
result without a clearly primary, citable source — it's presented on the About
page explicitly hedged as "local lore" rather than stated as verified fact.

**Awards** — being named New Jersey's Best Dive Bar, with recognition from
Chowhound and Tasting Table, is corroborated by 973espn.com's write-up
("Hudson House Named New Jersey's Best Dive Bar Again").

**Instagram bio quote** — "a no frills bar lovingly known as 'The Hud'" is quoted
directly (under 15 words) from Hudson House's own Instagram bio
(@hudsonhouselbi), attributed on the About page.

**Rating** — "4.6 on Google" is the figure returned by a general web search
summarizing the bar's Google listing at research time; it wasn't independently
re-verified against a second live source the way the address/phone were, so
treat it as directionally accurate rather than exact.

**Ownership / staff names** — deliberately **not included**, consistent with the
approach used on the other sites in this series: no specific individuals'
names are published on this proposal site.

## Photos — 2 real, 6 stock, labeled in the Gallery page itself

Hudson House has no official website and is not very photographed online beyond
Yelp and Instagram, both of which actively block automated access to their photo
pages. Two real photos were still recovered via a third-party trip-planning site
(Roadtrippers) that embeds and hotlinks the bar's own Yelp business photos at
their original Yelp CDN URLs — both are genuine, unedited photos of the real bar.
The remaining 6 photos are free stock photography from Pexels and Wikimedia
Commons, used only to illustrate the general dive-bar atmosphere (pool table,
shuffleboard, darts, jukebox, a neon sign, a whiskey glass) — **none of them
depict the real Hudson House Bar**, and each is clearly tagged "Stock Photo" in
the Gallery UI itself, matching the labeling convention used on the other sites
in this series.

| File | Depicts | Real or Stock | Source |
|---|---|---|---|
| `exterior-sign-real.jpg` | The bar's real, weathered "Hudson House Bar / Package Goods" sign, lit at night | **Real** | Yelp business photo (via Roadtrippers embed) |
| `bar-interior-drinks-real.jpg` | A Coors Light bottle and shot glass on the real bar counter, with the back bar and patrons visible behind it | **Real** | Yelp business photo (via Roadtrippers embed) |
| `pool-table-stock.jpg` | A pool table mid-game with a drink on the rail | Stock | Pexels |
| `dartboard-stock.jpg` | A dartboard on a pub wall with a chalkboard scoreboard (a real UK pub, not Hudson House) | Stock | Wikimedia Commons (CC BY 2.0) |
| `shuffleboard-stock.jpg` | A wooden shuffleboard table in a lodge lounge (not Hudson House) | Stock | Wikimedia Commons (CC BY-SA 2.0) |
| `jukebox-stock.jpg` | A glowing pink-lit modern jukebox | Stock | Wikimedia Commons (CC BY 4.0) |
| `whiskey-glass-stock.jpg` | A whiskey glass catching warm bar light | Stock | Wikimedia Commons (CC BY 2.0) |
| `neon-bar-sign-stock.jpg` | A neon "Bar" sign with a martini-glass icon | Stock | Wikimedia Commons (CC0) |

**Privacy note:** one candidate real photo (a crowded interior shot with several
patrons' faces in sharp, close focus) was found during research but deliberately
**excluded** — it read more like a candid patron snapshot than official business
marketing material, so it didn't meet the bar set for this project. Only the
exterior signage and a drinks-focused bar-counter shot (with patrons blurred and
in the background, not the subject) were used, consistent with the privacy
approach used on the other sites in this series. No personal or family photos of
any owner or staff member were found or used.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
