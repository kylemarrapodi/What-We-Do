/* viewer.js — partner-site viewer mode, shared by every Concierge town page.
 *
 * A business embeds its town's Concierge page in an iframe on its own site
 * (Sea Spray's "LBI Guide", Capital Pizza's "Explore Lubbock", and so on) and
 * passes ?viewer=<key>. This file does three things when that key is present:
 *
 *   1. Hides the business's own category of listing, so a motel's guide is not
 *      recommending competing motels.
 *   2. Shows a banner naming who you came in through, with a way back.
 *   3. Makes "The Concierge" wordmark break OUT of the iframe to this same page
 *      at top level — so clicking it moves you from the business's site onto
 *      Concierge proper, landing on the town you were already reading.
 *
 * Point 3 is the one that is easy to get wrong. Inside an iframe a normal link
 * navigates the FRAME, which would leave the visitor still inside the motel's
 * chrome and merely reload the guide. target="_top" is what actually moves them.
 *
 * Registered here rather than per page so a new partner is one line, not five
 * copies of a script that will drift.
 */
(function () {
  var VIEWERS = {
    // key            business                     subcat hidden   path back to their site
    'motel':          ['Sea Spray Motel',          'motel',   'sea-spray-motel'],
    'hudson-house':   ['Hudson House',             'bar',     'Hudson%20House%20Bar'],
    'capital-pizza':  ['Capital Pizza',            'pizza',   'Capital%20Pizza'],
    'cast-iron-grill':['Cast Iron Grill',          'diner',   'Cast%20Iron%20Grill'],
    'the-shack':      ['The Shack',                'bbq',     'The%20Shack'],
    'caseys-tavern':  ["Casey's Tavern",           'bar',     "Casey's%20Tavern"],
    'izets':          ["Izet's Leather & Shoe Repair", 'repair', "Izet's%20Leather%20&%20Shoe%20Repair"]
  };

  var key = new URLSearchParams(location.search).get('viewer');
  var v = key && VIEWERS[key];
  if (!v) return;

  var name = v[0], subcat = v[1], dir = v[2];

  // Walk back to the repo root, which may itself sit under a subpath (GitHub
  // Pages serves this at /What-We-Do/). Anchor on the "concierge" segment and
  // count how deep below it we are, rather than assuming a fixed depth:
  //   /concierge/stamford/            -> 1 below -> ../../
  //   /concierge/lbi/beach-haven/     -> 2 below -> ../../../
  var parts = location.pathname.split('/').filter(Boolean);
  parts.pop();                                   // drop index.html
  var ci = parts.indexOf('concierge');
  var below = ci === -1 ? 1 : (parts.length - 1 - ci);
  var back = '../'.repeat(below + 1) + dir + '/index.html';

  document.querySelectorAll('[data-subcat="' + subcat + '"]').forEach(function (card) {
    card.style.display = 'none';
  });

  var slot = document.getElementById('viewer-banner-slot');
  if (slot) {
    slot.innerHTML = '<div class="viewer-banner">Viewing via <strong>' + name +
      '</strong> — curated for our guests &nbsp;·&nbsp; <a href="' + back +
      '" target="_top">← Back to ' + name + '</a></div>';
  }

  // Break the wordmark out of the frame onto this same page.
  var logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.setAttribute('href', location.pathname);
    logo.setAttribute('target', '_top');
    logo.setAttribute('title', 'Open ' + document.title.split('·')[0].trim() + ' on The Concierge');
  }
})();
