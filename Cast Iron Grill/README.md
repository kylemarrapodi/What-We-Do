# Cast Iron Grill — Website Design Proposal

This is an **unsolicited design proposal / demo site** for Cast Iron Grill, a real
family-owned breakfast & lunch diner in downtown Lubbock, TX. It was built to show
what a fresh website could look like — it is **not affiliated with, commissioned by,
or published by the restaurant**, and the real Cast Iron Grill's actual website is
[castirongrilllubbock.com](http://www.castirongrilllubbock.com/).

The contact form does not actually send anywhere (see `script.js` — it just shows an
alert). No booking/ordering happens on this site; the "Order Online" links point to
the restaurant's real ChowNow ordering page.

## Files
- `index.html`, `about.html`, `menu.html`, `gallery.html`, `contact.html`
- `styles.css`, `script.js`
- `photos/` — 7 images, see breakdown below

## What's real vs. what's stock

All factual claims below (address, phone, hours, founding story, menu items/prices,
food truck, pies, etc.) were pulled directly from the restaurant's own official
website (`castirongrilllubbock.com`) and cross-checked against public listings
(Yelp, Tripadvisor, YellowPages) during research. Nothing about the business itself
is invented.

**Photos are a mix — clearly labeled in the Gallery page itself:**

| File | Source | Real or Stock |
|---|---|---|
| `logo-real.jpg` | Cast Iron Grill's official website | **Real** — the restaurant's actual logo |
| `foodtruck-real.jpg` | Cast Iron Grill's official website | **Real** — their actual food truck |
| `about-story-real.png` | Cast Iron Grill's official website | **Real** — their own promotional graphic, includes their real founding story text and logo |
| `burger-stock.jpg` | Pexels (free stock) | Stock — illustrative only, not an actual dish photo |
| `chicken-tenders-stock.jpg` | Pexels (free stock) | Stock — illustrative only |
| `coffee-stock.jpg` | Pexels (free stock) | Stock — illustrative only |
| `pie-stock.jpg` | Pexels (free stock) | Stock — illustrative only |

Deliberately **not used**: several personal/family photos of the owner's relatives
(including a baby and other private individuals) turned up while pulling assets from
the restaurant's `uploads/` folder. Those are private photos of identifiable people,
not restaurant marketing material, so they were excluded on privacy grounds even
though they were technically fetchable.

**No real photos of the restaurant's interior, exterior/storefront, or actual plated
food were found or used.** Every food shot in the gallery/menu pages is a labeled
stock photo standing in for the real thing — swap these out with real photos of the
space and dishes whenever available, same filenames so no HTML changes needed.

## Menu content
The menu on `menu.html` is transcribed directly from the restaurant's real, current
(2025) printed menu, which is posted as photographed menu-board images on their
official site. Prices should be close to accurate as of research time (August 2026)
but menus change — always confirm with the restaurant before relying on this for
pricing. Pie flavors/prices are not listed anywhere publicly, so the Pies section
intentionally has no invented prices — it just points people to ask in person.

## About page content
The founding story (Teresa & Shelby Stephens, 2007 opening at 18th & Ave K, the 2013
move to 620 19th St, the boots-on-the-rafters décor, the "boots, pie, and chicken
fry" motto, the Jeremiah 29:11 faith angle) is paraphrased/summarized from the
restaurant's own "About Teresa" page and its "Our Story" promotional graphic — not
copied verbatim.

## Running locally
No build step needed — open `index.html` in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000
