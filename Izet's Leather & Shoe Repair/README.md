# Izet's Leather & Shoe Repair — Website Design Proposal

This is an **unsolicited design proposal / demo site** for Izet's Leather & Shoe
Repair, a real shoe and leather repair shop at 60 Atlantic Street, Stamford, CT.
It was built to show what a fresh website could look like — it is **not
affiliated with, commissioned by, or published by the shop**. Izet's own
current web presence is a minimal single-page site at
[izetsleather.com](https://www.izetsleather.com/) (built on Google Sites, with
no navigation, hours, or services list beyond a "Full Soles" photo caption),
plus its [Yelp listing](https://www.yelp.com/biz/izets-leather-and-shoe-repair-stamford)
and a [Facebook page](https://www.facebook.com/pages/Izet-Leather-Shoe-Repair/160654143957416).

The contact form does not actually send anywhere (see `script.js` — it just
shows an alert). No ordering/booking happens on this site; the "Call for an
Estimate" / phone links just dial the shop's real number.

## Files
- `index.html`, `about.html`, `services.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 8 images: 6 real, 2 stock (see breakdown below)

## What's real vs. what's placeholder

**Address and phone** — 60 Atlantic Street, Stamford, CT 06901 · (203) 323-0319
— appear on Izet's own official website (izetsleather.com) and were
cross-checked against Yelp, Groupon, RepairHit, YellowPages, Loc8NearMe, and
CMac.ws listings, all of which independently agree, during research in August
2026.

**Hours** — Tuesday–Friday 9:00 AM–6:00 PM, Saturday 9:00 AM–3:00 PM, closed
Sunday and Monday — were **not** listed on the shop's own minimal website, so
these are sourced from aggregated Google Business Profile data as surfaced by
three independent listing sites (Loc8NearMe, CMac.ws, and general search
results), which all agree with each other. Always call ahead to confirm, since
hours weren't directly confirmed on the shop's own site.

**Rating** — "4.5 / 5 on Yelp, 61 reviews" is pulled from Yelp's own page
title/metadata as surfaced in search results (Yelp's business page itself
blocks automated fetching, so this couldn't be re-verified by directly loading
the page — it's sourced from Yelp's own indexed page data, not invented).

**Services** — The "Verified" services on the Services page (full sole
replacement, heel repair, sole protectors, cowboy boot repair, leather repair
and restoration, designer footwear restoration, handbag/leather accessory
repair, zipper repair, belt repair, glove restringing) are cross-referenced
across Izet's own website (which explicitly shows "Full Soles" work), its
Groupon and RepairHit listing descriptions, and a Loc8NearMe summary
describing restoration of "designer footwear... heels, doc martens, and
leather accessories like belts and bags." Two commonly-offered cobbler
services — shoe shine/polish and custom orthotics — are called out separately
on the Services page as **not independently confirmed** for this specific
shop, rather than assumed.

**Ownership** — The shop is named for its founder, "Izet," which is public
information baked into the business name itself and referenced directly in
its own reviews (e.g., "Izet is a true craftsman and artist"). No surname or
other personal details about the owner were found or used.

**Review quote** — The About page paraphrases sourced review language
("real, old world, exceptional craftsmanship") rather than reproducing full
review text, in line with keeping quoted material short and attributed.

## Photos — 6 real, 2 clearly-labeled stock

| File | Source | Real or Stock |
|---|---|---|
| `storefront-real.jpg` | Izet's own official website (izetsleather.com) | **Real** — the shop's actual storefront at night, sign lit up |
| `before-after-heels-real.jpg` | Izet's own official website | **Real** — the shop's own before/after photo of a heel and sole rebuild |
| `new-leather-sole-real.jpg` | Izet's own official website | **Real** — a freshly stitched new leather sole from the shop's own portfolio |
| `heel-repair-real.jpg` | Izet's own official website | **Real** — a restored designer heel (red-soled) from the shop's own portfolio |
| `resoled-dress-shoe-real.jpg` | Izet's own official website | **Real** — a resoled brown leather dress shoe from the shop's own portfolio |
| `resoled-pair-real.jpg` | Izet's own official website | **Real** — a pair of leather dress shoes with newly stitched soles from the shop's own portfolio |
| `leather-workshop-stock.jpg` | Pexels (free stock, photographer: Shoreline Vehicles) | **Stock** — an unrelated craftsman hand-stitching leather, used only as illustrative workshop atmosphere |
| `leather-goods-tools-stock.jpg` | Pexels (free stock, photographer: Vlada Karpovich) | **Stock** — leather wallets and hand tools on a workbench, used only as illustrative atmosphere |

All 6 real photos were downloaded directly from Izet's own official website
(images hosted on Google's `lh3.googleusercontent.com` CDN, embedded in the
site's own HTML). None show any identifiable people — they're all
close-up product/craftsmanship shots (a storefront, a before/after pair of
heels, and four close-ups of resoled shoes), so no privacy concerns apply.
Every real and stock photo is clearly labeled in the Gallery page UI itself
with a "Real Photo" or "Stock" tag, matching the pattern used across the
other proposal sites in this series.

**Not used:** A handful of additional images referenced on Izet's own site
returned expired/access-denied links (403 errors) when fetched and could not
be recovered; Yelp's own photo gallery (44 photos) could not be accessed at
all because Yelp blocks automated fetching of its pages. Only images that
downloaded successfully and were verifiably real (matching the shop's own
site content) were used.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
