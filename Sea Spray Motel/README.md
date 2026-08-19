# Sea Spray Motel Website

Recreated locally from `sea-spray-motel-code.docx` (exported from work email on 2026-08-17).

## Files
- index.html, rooms.html, rates.html, amenities.html, contact.html, gallery.html
- The "LBI Guide" nav link now goes straight to `../concierge/lbi/beach-haven/index.html?viewer=motel`
  — the Concierge project's own Beach Haven page — instead of a separate, duplicated guide page.
- styles.css
- script.js
- seaspraylogo_clean.png — real logo, cropped from `photos/sign logo.jpg`
- photos/ — 8 placeholder photos (generated), matching the site's color palette

## About the placeholder images
The original Word doc only contained code, no real photos. I generated simple branded
placeholders (labeled "Bedroom", "Pool", "Exterior", etc.) so the site isn't full of
broken image icons. Swap these out with real photos whenever you have them — same
filenames, so no HTML changes needed:

- `photos/bathroom1.jpg`, `photos/bathroom2.jpg` — still placeholders, no real bathroom photos sourced yet

## Running locally
No build step needed — just open index.html in a browser, or serve the folder:

    python3 -m http.server 8000

then visit http://localhost:8000

## Notes
Verified: JS parses cleanly, CSS braces balance, HTML tags balance, and all emoji
icons (pool, parking, WiFi, dining tags on the LBI guide, etc.) were recovered from
a mojibake encoding issue introduced by the Word export — checked against rendered
screenshots and confirmed correct.
