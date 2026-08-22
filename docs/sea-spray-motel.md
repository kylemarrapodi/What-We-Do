# Sea Spray Motel Website

Recreated locally from `sea-spray-motel-code.docx` (exported from work email on 2026-08-17).

## Files
- index.html, rooms.html, rates.html, amenities.html, contact.html, gallery.html
- The "LBI Guide" page frames the Concierge's own Beach Haven page. It is loaded by absolute URL
  (`CONCIERGE_GUIDE` in `lbi-guide.html`) and passes `?viewer=motel&home=<this site's base URL>`,
  so the site works deployed on its own domain and the guide's "back" link returns here.
- This file used to live in the site folder. It moved to `docs/` because that folder is a
  deploy root — Netlify publishes everything in it, so only shippable files belong there.
  The unused logo-tracing source photos moved to `docs/sea-spray-source-photos/` for the same reason.
- styles.css
- script.js
- seaspraylogo.svg — hand-built vector logo (inlined directly into index.html's hero), referencing
  the real sign photos in `photos/` (`sign logo.jpg`, `sign logo 3.jpg`). Replaces the earlier
  generated placeholder / raster crop.
- photos/ — real photos throughout:
  - `bedroom1-3.jpg`, `living.jpg`, `exterior.jpg`, `pool.jpg` — original real photos (OTA-sourced)
  - `bathroom1.jpg`, `bathroom2.jpg`, `bathroom3.jpg`, `bathroom4.jpg` — real bathroom photos
    (bathroom1/2 replace what used to be generated placeholders)
  - `room-single1-3.jpg`, `room-double1-2.jpg`, `room-kitchenette1-3.jpg`, `kitchen1.jpg` —
    real room-variety photos
  - `exterior2-3.jpg`, `exterior-aerial.jpg`, `beach-aerial.jpg` — real exterior/aerial photos,
    the last one showing the property and the beach together
  - `pool2.jpg` — real, sharper pool photo (user-provided); now the featured pool photo,
    `pool.jpg` (the older, lower-resolution wide shot) kept in the gallery but shown ~80%
    smaller (`.gallery-item-mini` in styles.css)
  - `sign logo.jpg`, `sign logo 2.jpg`, `sign logo 3.jpg` — real sign photos, used as the
    reference for `seaspraylogo.svg`, not shown in the gallery itself
  - All real photos above (except the local uploads) sourced from the motel's own listing
    on `seaspraymotellongbeach.com`

## Running locally
No build step needed — just open index.html in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000

## Notes
Verified: JS parses cleanly, CSS braces balance, HTML tags balance, and all emoji
icons (pool, parking, WiFi, dining tags on the LBI guide, etc.) were recovered from
a mojibake encoding issue introduced by the Word export — checked against rendered
screenshots and confirmed correct.
