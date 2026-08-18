/* =====================================================
   CONCIERGE — Shared JavaScript
   ===================================================== */

// Hamburger menu
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Search handler (hero page tiered search — now uses same index as nav search)
function handleSearch(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('main-search');
  if (!input) return;
  const val = input.value.trim().toLowerCase();
  if (!val) return;
  const results = searchIndex(val);
  if (results.length) {
    window.location.href = results[0].url;
  } else if (val.includes('lbi') || val.includes('long beach island') || val.includes('beach haven')) {
    alert('LBI coming soon!');
  } else {
    alert("We're expanding fast — '" + input.value + "' is coming soon!");
  }
}

// ── Path helpers ─────────────────────────────────────────────────────
function getConciergeDepth() {
  const path = window.location.pathname;
  const parts = path.replace(/\/index\.html$/, '').split('/').filter(Boolean);
  const idx = parts.findIndex(p => p === 'concierge');
  return idx >= 0 ? parts.length - idx - 1 : 0;
}
function rootPrefix() {
  const d = getConciergeDepth();
  return d > 0 ? '../'.repeat(d) : '';
}

// ── Shared SEARCH_TREE ───────────────────────────────────────────────
// Single source of truth used by both the left-panel search (index.html)
// and the nav search bar on every page.
const SHARED_SEARCH_TREE = {
  label: 'root', children: [
    {
      label: 'United States', aliases: ['usa','us','united states','america'], status: null, url: null,
      children: [
        {
          label: 'Connecticut', aliases: ['connecticut','ct'], status: 'live', url: 'connecticut/index.html',
          children: [
            {
              label: 'Stamford', aliases: ['stamford'], status: 'live', url: 'stamford/index.html',
              children: [
                { label:'Downtown',       aliases:['downtown'],                          status:'live', url:'stamford/downtown/index.html',      children:[] },
                { label:'Harbor Point',   aliases:['harbor point'],                      status:'live', url:'stamford/harbor-point/index.html',   children:[] },
                { label:'Shippan Point',  aliases:['shippan point','shippan'],           status:'live', url:'stamford/shippan-point/index.html',  children:[] },
                { label:'Springdale',     aliases:['springdale'],                        status:'live', url:'stamford/springdale/index.html',     children:[] },
                { label:'Glenbrook',      aliases:['glenbrook'],                         status:'live', url:'stamford/glenbrook/index.html',      children:[] },
                { label:'North Stamford', aliases:['north stamford'],                    status:'live', url:'stamford/north-stamford/index.html', children:[] },
                { label:'Cove',           aliases:['cove','east side','cove east side'], status:'live', url:'stamford/cove/index.html',           children:[] },
                { label:'Waterside',      aliases:['waterside'],                         status:'live', url:'stamford/waterside/index.html',      children:[] },
              ]
            },
            { label:'Greenwich', aliases:['greenwich'], status:'soon', url:null, children:[] },
            { label:'Westport',  aliases:['westport'],  status:'soon', url:null, children:[] },
            { label:'Norwalk',   aliases:['norwalk'],   status:'soon', url:null, children:[] },
          ]
        },
        {
          label: 'New Jersey', aliases: ['new jersey','nj'], status: 'live', url: 'new-jersey/index.html',
          children: [
            {
              label: 'Long Beach Island', aliases: ['long beach island','lbi'], status: 'live', url: 'lbi/index.html',
              children: [
                { label:'Holgate',        aliases:['holgate'],              status:'live', url:'lbi/holgate/index.html',        children:[] },
                { label:'Beach Haven',    aliases:['beach haven'],          status:'live', url:'lbi/beach-haven/index.html',    children:[] },
                { label:'Ship Bottom',    aliases:['ship bottom'],          status:'live', url:'lbi/ship-bottom/index.html',    children:[] },
                { label:'Surf City',      aliases:['surf city'],            status:'live', url:'lbi/surf-city/index.html',      children:[] },
                { label:'Harvey Cedars',  aliases:['harvey cedars'],        status:'live', url:'lbi/harvey-cedars/index.html',  children:[] },
                { label:'Barnegat Light', aliases:['barnegat light','old barney'], status:'live', url:'lbi/barnegat-light/index.html', children:[] },
              ]
            }
          ]
        },
        {
          label: 'New York', aliases: ['new york','ny'], status: null, url: null,
          children: [
            { label:'New York City', aliases:['new york city','nyc','manhattan'], status:'soon', url:null, children:[] },
          ]
        },
        {
          label: 'Texas', aliases: ['texas','tx'], status: 'live', url: 'texas/index.html',
          children: [
            {
              label: 'Lubbock', aliases: ['lubbock'], status: 'live', url: 'lubbock/index.html',
              children: [
                { label:'Depot District',    aliases:['depot district','depot'],                           status:'live', url:'lubbock/depot-district/index.html',   children:[] },
                { label:'Tech District',     aliases:['tech district','the strip','university ave'],        status:'live', url:'lubbock/tech-district/index.html',    children:[] },
                { label:'Historic District', aliases:['historic district','downtown lubbock'],              status:'live', url:'lubbock/historic-district/index.html', children:[] },
              ]
            },
          ]
        }
      ]
    }
  ]
};

// ── Tree helpers ─────────────────────────────────────────────────────
function _norm(s) { return s.trim().toLowerCase(); }

function _allDescendants(node) {
  const out = [];
  (node.children || []).forEach(c => { out.push(c); _allDescendants(c).forEach(d => out.push(d)); });
  return out;
}

// ── Master flat search index ──────────────────────────────────────────
// Each entry: { label, sub, type, url, keywords[] }
// URLs are root-relative; rootPrefix() is prepended at render time.
function buildSearchIndex() {
  const p = rootPrefix();
  return [
    // ── Cities ──
    { label:'Stamford, CT',       sub:'Connecticut',           type:'place',  url: p+'stamford/index.html',                   keywords:['stamford','connecticut','ct'] },
    { label:'Lubbock, TX',        sub:'Texas',                 type:'place',  url: p+'lubbock/index.html',                    keywords:['lubbock','texas','tx','hub city'] },
    // ── States ──
    { label:'Connecticut',        sub:'United States',         type:'place',  url: p+'connecticut/index.html',                keywords:['connecticut','ct','new england'] },
    { label:'Texas',              sub:'United States',         type:'place',  url: p+'texas/index.html',                      keywords:['texas','tx','lone star'] },
    { label:'New Jersey',         sub:'United States',         type:'place',  url: p+'new-jersey/index.html',                 keywords:['new jersey','nj','jersey'] },
    // ── LBI ──
    { label:'Long Beach Island', sub:'New Jersey',             type:'place',  url: p+'lbi/index.html',                        keywords:['long beach island','lbi','jersey shore','barnegat bay'] },
    { label:'Holgate',           sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/holgate/index.html',                keywords:['holgate','forsythe refuge','wilderness beach','surf fishing'] },
    { label:'Beach Haven',       sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/beach-haven/index.html',            keywords:['beach haven','fantasy island','thundering surf','surflight theatre','chowderfest','hopsauce'] },
    { label:'Ship Bottom',       sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/ship-bottom/index.html',            keywords:['ship bottom','ship bottom brewery','kite festival','the arlington','gateway lbi'] },
    { label:'Surf City',         sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/surf-city/index.html',              keywords:['surf city','surf city hotel','scojos','farmers market lbi','bay beach'] },
    { label:'Harvey Cedars',     sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/harvey-cedars/index.html',          keywords:['harvey cedars','black eyed susans','harvey cedars shellfish','marigold coffee','birdys'] },
    { label:'Barnegat Light',    sub:'Long Beach Island, NJ',  type:'place',  url: p+'lbi/barnegat-light/index.html',         keywords:['barnegat light','old barney','lighthouse','viking village','kubels','wallys','daymark'] },
    // ── Events — LBI ──
    { label:'Chowderfest',       sub:'Oct · Taylor Ave · Beach Haven',         type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['chowderfest','chowder','lbi festival','beach haven festival'] },
    { label:'HopSauce Festival', sub:'Jun · Taylor Ave · Beach Haven',         type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['hopsauce','hop sauce','craft beer','hot sauce','beach haven beer'] },
    { label:'LBI Film Festival', sub:'Sep · Beach Haven',                      type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['lbi film festival','film festival','indie film','beach haven film'] },
    { label:'Coquina Jam',       sub:'Aug · Beach Haven Ocean Beach',          type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['coquina jam','surf competition','lbi surf','surfing competition'] },
    { label:'LBI Kite Festival', sub:'Oct · Ship Bottom Beach',                type:'event',  url: p+'lbi/ship-bottom/index.html',  keywords:['kite festival','lbi kite','ship bottom kite','kite flying'] },
    { label:'Concerts on the Green', sub:'Jul–Aug Wednesdays · Beach Haven',  type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['concerts on the green','free concert','beach haven concert','lbi music'] },
    // ── Venues — LBI ──
    { label:'Fantasy Island',    sub:'Beach Haven, LBI',                       type:'place',  url: p+'lbi/beach-haven/index.html',  keywords:['fantasy island','amusement park','lbi amusement','rides lbi'] },
    { label:'Thundering Surf Waterpark', sub:'Beach Haven, LBI',              type:'place',  url: p+'lbi/beach-haven/index.html',  keywords:['thundering surf','waterpark','flowrider','lbi waterpark'] },
    { label:'Surflight Theatre', sub:'Beach Haven, LBI',                       type:'place',  url: p+'lbi/beach-haven/index.html',  keywords:['surflight','surflight theatre','theater lbi','summer theater'] },
    { label:'Viking Village',    sub:'Barnegat Light, LBI',                    type:'place',  url: p+'lbi/barnegat-light/index.html',keywords:['viking village','fishing fleet','fishing village','barnegat light fishing'] },
    { label:'Barnegat Lighthouse', sub:'Barnegat Light, LBI',                 type:'place',  url: p+'lbi/barnegat-light/index.html',keywords:['barnegat lighthouse','old barney','lighthouse climb','state park'] },
    { label:'Ship Bottom Brewery',sub:'Ship Bottom, LBI',                      type:'place',  url: p+'lbi/ship-bottom/index.html',  keywords:['ship bottom brewery','lbi brewery','craft beer lbi','brewery lbi'] },
    // ── Stamford neighborhoods ──
    { label:'Downtown Stamford',  sub:'Stamford, CT',          type:'place',  url: p+'stamford/downtown/index.html',          keywords:['downtown stamford','palace theatre','mill river'] },
    { label:'Harbor Point',       sub:'Stamford, CT',          type:'place',  url: p+'stamford/harbor-point/index.html',      keywords:['harbor point','waterfront','marina'] },
    { label:'Shippan Point',      sub:'Stamford, CT',          type:'place',  url: p+'stamford/shippan-point/index.html',     keywords:['shippan','shippan point','cove island'] },
    { label:'Springdale',         sub:'Stamford, CT',          type:'place',  url: p+'stamford/springdale/index.html',        keywords:['springdale'] },
    { label:'Glenbrook',          sub:'Stamford, CT',          type:'place',  url: p+'stamford/glenbrook/index.html',         keywords:['glenbrook'] },
    { label:'North Stamford',     sub:'Stamford, CT',          type:'place',  url: p+'stamford/north-stamford/index.html',    keywords:['north stamford','bartlett'] },
    { label:'Cove / East Side',   sub:'Stamford, CT',          type:'place',  url: p+'stamford/cove/index.html',              keywords:['cove','east side'] },
    { label:'Waterside',          sub:'Stamford, CT',          type:'place',  url: p+'stamford/waterside/index.html',         keywords:['waterside','half full'] },
    // ── Lubbock neighborhoods ──
    { label:'Depot District',     sub:'Lubbock, TX',           type:'place',  url: p+'lubbock/depot-district/index.html',     keywords:['depot district','depot','blue light','buddy holly ave'] },
    { label:'Tech District',      sub:'Lubbock, TX — Campus',  type:'place',  url: p+'lubbock/tech-district/index.html',      keywords:['tech district','the strip','university ave','texas tech campus','jones stadium'] },
    { label:'Historic District',  sub:'Lubbock, TX — Downtown',type:'place',  url: p+'lubbock/historic-district/index.html',  keywords:['historic district','downtown lubbock','buddy holly hall','courthouse'] },
    // ── Events — Stamford ──
    { label:'Ja Rule & Ashanti',           sub:'Jul 30 · Mill River Park · Stamford',    type:'event',  url: p+'stamford/index.html',             keywords:['ja rule','ashanti','r&b','concert','stamford concert'] },
    { label:'Hey Stamford! Food Festival', sub:'Aug 1–2 · Mill River Park',              type:'event',  url: p+'stamford/downtown/index.html',    keywords:['hey stamford','food festival','food fest','stamford food'] },
    { label:'Beer Wine Spirits Fest',      sub:'Aug 29 · Mill River Park',               type:'event',  url: p+'stamford/downtown/index.html',    keywords:['beer','wine','spirits','beer fest','stamford beer'] },
    { label:'Summer St Block Party',       sub:'Aug 13 · Downtown Stamford',             type:'event',  url: p+'stamford/downtown/index.html',    keywords:['block party','summer street','stamford block'] },
    { label:'Labyrinth in Concert',        sub:'Sep 19 · Palace Theatre · Stamford',     type:'event',  url: p+'stamford/downtown/index.html',    keywords:['labyrinth','bowie','david bowie','palace theatre','stamford show'] },
    { label:"That's Amore Italian Festival",sub:'Oct 11–12 · Columbus Park',             type:'event',  url: p+'stamford/index.html',             keywords:['italian festival','italian','that\'s amore','columbus park'] },
    { label:'Downtown Farmers Market',     sub:'Every Saturday · Veterans Memorial Park',type:'event',  url: p+'stamford/downtown/index.html',    keywords:['farmers market','market','stamford market','saturday market'] },
    { label:'Honey Harvest Festival',      sub:'Aug 30 · Bartlett Arboretum',            type:'event',  url: p+'stamford/north-stamford/index.html',keywords:['honey harvest','bartlett','arboretum','honey'] },
    // ── Events — Lubbock ──
    { label:'TTU Football Season Opener',  sub:'Aug 30 · Jones AT&T Stadium · Lubbock', type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech football','ttu football','red raiders football','football game','football','jones stadium','lubbock football'] },
    { label:'TTU vs. Oklahoma State',      sub:'Sep 20 · Jones AT&T Stadium',           type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['oklahoma state','osu','texas tech','big 12','football game','college football'] },
    { label:'Texas Tech Homecoming',       sub:'Oct 11 · Texas Tech Campus',            type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['homecoming','texas tech homecoming','ttu homecoming','football'] },
    { label:'TTU Basketball Season Opener',sub:'Nov 8 · United Supermarkets Arena',     type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech basketball','ttu basketball','red raiders basketball','basketball','college basketball','lubbock basketball'] },
    { label:'TTU Baseball',                sub:'Feb–May · Rip Griffin Park',            type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech baseball','ttu baseball','baseball','college baseball','lubbock baseball'] },
    { label:'Buddy Holly Music Festival',  sub:'Sep 13 · Depot District · Lubbock',     type:'event',  url: p+'lubbock/index.html',              keywords:['buddy holly','music festival','lubbock festival','free concert'] },
    { label:'Reba McEntire at USA',        sub:'Sep 26 · United Supermarkets Arena',    type:'event',  url: p+'lubbock/historic-district/index.html',keywords:['reba','reba mcentire','country concert','lubbock concert','united supermarkets arena','usa arena'] },
    { label:'Lubbock on the Square',       sub:'Oct 18 · Courthouse Square',            type:'event',  url: p+'lubbock/historic-district/index.html',keywords:['lubbock on the square','food wine','lubbock food','downtown lubbock event'] },
    { label:'Depot District Music Crawl',  sub:'Nov 15 · All Depot Venues',             type:'event',  url: p+'lubbock/depot-district/index.html', keywords:['music crawl','bar crawl','depot crawl','lubbock bar crawl'] },
    { label:'Live Music at Blue Light',    sub:'Every Fri & Sat · Depot District',      type:'event',  url: p+'lubbock/depot-district/index.html', keywords:['blue light','blue light live','live music lubbock','red dirt','country music','texas music'] },
    { label:'Game Day on The Strip',       sub:'Home game Saturdays · University Ave',  type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['game day','the strip','university ave','lubbock game day','football saturday'] },
    // ── Venues ──
    { label:'Jones AT&T Stadium',          sub:'Texas Tech · Lubbock',                  type:'place',  url: p+'lubbock/tech-district/index.html', keywords:['jones','jones stadium','ttu stadium','football stadium','lubbock stadium'] },
    { label:'United Supermarkets Arena',   sub:'Texas Tech · Lubbock',                  type:'place',  url: p+'lubbock/tech-district/index.html', keywords:['united supermarkets arena','usa arena','lubbock arena','ttu arena'] },
    { label:'Buddy Holly Hall',            sub:'Performing Arts · Lubbock',             type:'place',  url: p+'lubbock/historic-district/index.html',keywords:['buddy holly hall','performing arts','lubbock concert hall','lubbock theatre'] },
    { label:'Palace Theatre',              sub:'Downtown Stamford',                      type:'place',  url: p+'stamford/downtown/index.html',    keywords:['palace theatre','palace','stamford theatre','stamford concert'] },
  ];
}

// ── Nav suggestion engine (flat index) ───────────────────────────────
let _navSearchIndex = null;

function getNavIndex() {
  if (!_navSearchIndex) _navSearchIndex = buildSearchIndex();
  return _navSearchIndex;
}

function searchIndex(query) {
  if (!query || query.length < 2) return [];
  const q = query.trim().toLowerCase();
  const index = getNavIndex();
  const scored = [];

  for (const item of index) {
    let score = 0;
    const labelLow = item.label.toLowerCase();
    if (labelLow.startsWith(q)) score += 10;
    else if (labelLow.includes(q)) score += 6;
    for (const kw of item.keywords) {
      if (kw.startsWith(q)) score += 5;
      else if (kw.includes(q)) score += 3;
    }
    if (score > 0) scored.push({ item, score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map(s => s.item);
}

// ── Tree-aware nav search ─────────────────────────────────────────────
// Search the SHARED_SEARCH_TREE by alias, returning scored nodes.
function searchTree(query) {
  if (!query || query.length < 2) return [];
  const q = _norm(query);
  const all = _allDescendants(SHARED_SEARCH_TREE);
  const scored = [];
  for (const node of all) {
    let score = 0;
    const labelLow = node.label.toLowerCase();
    if (labelLow.startsWith(q)) score += 10;
    else if (labelLow.includes(q)) score += 6;
    for (const alias of (node.aliases || [])) {
      if (alias.startsWith(q)) score += 5;
      else if (alias.includes(q)) score += 3;
    }
    if (score > 0) scored.push({ node, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 8).map(s => s.node);
}

// ── Nav suggestion dropdown ──────────────────────────────────────────
// Renders a mixed dropdown: tree nodes (with Live/Soon badges) + flat
// event/venue results — giving the nav search full feature parity with
// the left-panel search.
function initNavSearch(formEl) {
  if (!formEl) return;
  const input = formEl.querySelector('input');
  if (!input) return;

  // Create suggestion dropdown container — scoped to the form element
  // so positioning works regardless of which panel the form lives in.
  let dropdown = formEl.querySelector('.nav-suggestions');
  if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.className = 'nav-suggestions';
    formEl.style.position = 'relative';
    formEl.appendChild(dropdown);
  }

  let focusedIdx = -1;
  const p = rootPrefix();

  // Tracks the current drill-down node for the panel search on non-home pages.
  let _panelCurrentNode = null;

  // On the home page, drive the left-panel search via window._commitNode.
  // On other pages: navigate if live, drill into children, coming-soon only as last resort.
  // Suggestions stay open after selection so the user can keep drilling.
  function handleNodeSelect(node) {
    if (typeof window._commitNode === 'function') {
      // Home page: drive the left-panel tiered search (commitNode handles re-render)
      window._commitNode(node);
      input.value = '';
      // Re-show nav suggestions reflecting the new home panel state
      showDefaultNavSuggestions();
    } else if (node.url) {
      window.location.href = p + node.url;
    } else if (node.children && node.children.length) {
      // Drill down — show children, Go button appears at bottom
      _panelCurrentNode = node;
      _goNode = node;
      input.value = '';
      input.placeholder = node.label + ' › …';
      renderNavSuggestions({ nodes: node.children, flat: [] });
    } else {
      showNavComingSoon(node.label);
    }
  }

  let _goNode = null;

  function showNavComingSoon(label) {
    input.placeholder = label + ' is coming soon…';
    setTimeout(() => { input.placeholder = 'Search cities, events, sports…'; }, 2800);
  }

  // ── Show default suggestions: next tier from SHARED_SEARCH_TREE ──
  // On the home page, mirrors the left panel's current node's children.
  // On other pages, shows the currently-drilled node's children, or top-level if none drilled.
  function showDefaultNavSuggestions() {
    let children;
    if (typeof window._getCurrentNode === 'function') {
      const node = window._getCurrentNode();
      children = node.children || [];
    } else if (_panelCurrentNode) {
      children = _panelCurrentNode.children || [];
    } else {
      children = SHARED_SEARCH_TREE.children || [];
    }
    if (children.length) renderNavSuggestions({ nodes: children, flat: [] });
    else closeSuggestions();
  }

  // ── Render the dropdown ──────────────────────────────────────────
  // Layout: scrollable list (max 5 items visible) + Go button pinned at bottom.
  function renderNavSuggestions({ nodes, flat }) {
    focusedIdx = -1;
    const hasNodes = nodes && nodes.length > 0;
    const hasFlat  = flat && flat.length > 0;
    if (!hasNodes && !hasFlat && !_goNode) { closeSuggestions(); return; }

    // Sort location nodes alphabetically
    const sortedNodes = hasNodes ? [...nodes].sort((a, b) => a.label.localeCompare(b.label)) : [];

    // Group flat results by type
    const places  = (flat || []).filter(r => r.type === 'place');
    const events  = (flat || []).filter(r => r.type === 'event');
    const sports  = (flat || []).filter(r => r.type === 'sports');

    let listHtml = '';

    if (hasNodes) {
      listHtml += `<div class="nav-sug-section">Locations</div>`;
      sortedNodes.forEach(node => {
        const badge = node.status === 'live'
          ? '<span class="nav-sug-badge live">Live</span>'
          : node.status === 'soon'
            ? '<span class="nav-sug-badge soon">Soon</span>'
            : '';
        listHtml += `<div class="nav-sug-item nav-sug-node" data-label="${node.label}">
          <div><div class="nav-sug-label">${node.label}</div></div>
          ${badge}
        </div>`;
      });
    }

    if (places.length) {
      listHtml += `<div class="nav-sug-section">Places &amp; Neighborhoods</div>`;
      places.forEach(r => {
        listHtml += `<a class="nav-sug-item" href="${r.url}">
          <div><div class="nav-sug-label">${r.label}</div><div class="nav-sug-sub">${r.sub}</div></div>
          <span class="nav-sug-badge live">Live</span>
        </a>`;
      });
    }
    if (events.length) {
      listHtml += `<div class="nav-sug-section">Events</div>`;
      events.forEach(r => {
        listHtml += `<a class="nav-sug-item" href="${r.url}">
          <div><div class="nav-sug-label">${r.label}</div><div class="nav-sug-sub">${r.sub}</div></div>
          <span class="nav-sug-badge event">Event</span>
        </a>`;
      });
    }
    if (sports.length) {
      listHtml += `<div class="nav-sug-section">Sports</div>`;
      sports.forEach(r => {
        listHtml += `<a class="nav-sug-item" href="${r.url}">
          <div><div class="nav-sug-label">${r.label}</div><div class="nav-sug-sub">${r.sub}</div></div>
          <span class="nav-sug-badge sports">Sports</span>
        </a>`;
      });
    }

    // Go button row — pinned at the bottom, outside the scroll container
    let goHtml = '';
    if (_goNode) {
      const goUrl = _goNode.url ? (p + _goNode.url) : null;
      goHtml = `<div class="nav-sug-go-row">
        <div class="nav-sug-go-context">In: <strong>${_goNode.label}</strong></div>
        ${goUrl
          ? `<a href="${goUrl}" class="nav-sug-go-btn">Go to ${_goNode.label} →</a>`
          : `<button class="nav-sug-go-btn nav-sug-go-back">← Back</button>`
        }
      </div>`;
    }

    dropdown.innerHTML = `<div class="nav-sug-list">${listHtml}</div>${goHtml}`;
    dropdown.classList.add('open');

    // Wire up tree-node clicks (non-anchor items)
    dropdown.querySelectorAll('.nav-sug-node').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        const node = _allDescendants(SHARED_SEARCH_TREE).find(n => n.label === item.dataset.label);
        if (node) handleNodeSelect(node);
      });
    });

    // Wire up "back" button
    const backBtn = dropdown.querySelector('.nav-sug-go-back');
    if (backBtn) {
      backBtn.addEventListener('mousedown', e => {
        e.preventDefault();
        _panelCurrentNode = null;
        _goNode = null;
        input.value = '';
        input.placeholder = 'Search cities, events…';
        showDefaultNavSuggestions();
      });
    }
  }

  function closeSuggestions() {
    dropdown.classList.remove('open');
    focusedIdx = -1;
    _goNode = null;
    _panelCurrentNode = null;
    input.placeholder = 'Search cities, events, sports…';
  }

  // ── Input events ─────────────────────────────────────────────────
  input.addEventListener('focus', () => {
    if (!input.value.trim()) showDefaultNavSuggestions();
  });

  input.addEventListener('click', () => {
    if (!input.value.trim()) showDefaultNavSuggestions();
  });

  input.addEventListener('input', () => {
    const q = input.value.trim();
    if (!q) { showDefaultNavSuggestions(); return; }

    // Tree nodes first (location drill-down), then flat events/places
    const treeNodes = searchTree(q);
    const flatResults = searchIndex(q).filter(r =>
      r.type === 'event' || r.type === 'sports'
    );
    renderNavSuggestions({ nodes: treeNodes, flat: flatResults });
  });

  input.addEventListener('keydown', (e) => {
    const items = dropdown.querySelectorAll('.nav-sug-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      focusedIdx = Math.min(focusedIdx + 1, items.length - 1);
      items.forEach((el, i) => el.classList.toggle('focused', i === focusedIdx));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      focusedIdx = Math.max(focusedIdx - 1, -1);
      items.forEach((el, i) => el.classList.toggle('focused', i === focusedIdx));
    } else if (e.key === 'Escape') {
      closeSuggestions();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIdx >= 0) {
        const focused = items[focusedIdx];
        if (focused) {
          if (focused.classList.contains('nav-sug-node')) {
            const node = _allDescendants(SHARED_SEARCH_TREE).find(n => n.label === focused.dataset.label);
            if (node) handleNodeSelect(node);
          } else if (focused.href) {
            window.location.href = focused.href;
          }
        }
      } else {
        // Submit with top result
        const q = input.value.trim();
        if (!q) return;
        const treeNodes = searchTree(q);
        if (treeNodes.length) { handleNodeSelect(treeNodes[0]); return; }
        const flat = searchIndex(q);
        if (flat.length) { window.location.href = flat[0].url; return; }
        closeSuggestions();
        showNavComingSoon(input.value.trim());
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!formEl.parentElement.contains(e.target)) closeSuggestions();
  });

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    const treeNodes = searchTree(q);
    if (treeNodes.length) { handleNodeSelect(treeNodes[0]); return; }
    const flat = searchIndex(q);
    if (flat.length) {
      window.location.href = flat[0].url;
    } else {
      closeSuggestions();
      alert("We're expanding fast — '" + q + "' is coming soon!");
    }
  });
}

// Legacy handleNavSearch kept for inline onsubmit handlers on existing pages
function handleNavSearch(e) {
  if (e) e.preventDefault();
  const input = e ? e.target.querySelector('input') : null;
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;
  const p = rootPrefix();
  const treeNodes = searchTree(val);
  if (treeNodes.length) {
    const node = treeNodes[0];
    if (typeof window._commitNode === 'function') {
      window._commitNode(node);
    } else if (node.url) {
      window.location.href = p + node.url;
    } else {
      alert(node.label + ' is coming soon!');
    }
    return;
  }
  const results = searchIndex(val);
  if (results.length) {
    window.location.href = results[0].url;
  } else {
    alert("We're expanding fast — '" + val + "' is coming soon!");
  }
}

// Category filter (neighborhood pages)
function initCategoryFilter() {
  const pills = document.querySelectorAll('.pill[data-cat]');
  const sections = document.querySelectorAll('.cat-section');
  if (!pills.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (cat === 'all') {
        sections.forEach(s => s.style.display = '');
      } else {
        sections.forEach(s => {
          s.style.display = s.dataset.cat === cat ? '' : 'none';
        });
      }
      if (cat !== 'all') {
        const target = document.querySelector(`.cat-section[data-cat="${cat}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ── Persistent side panel (non-home pages) ──────────────────────────
// Reads data-page-location from <body>, builds the panel HTML, injects
// it into the page, and shifts .page-wrap right by 320px.

const PANEL_EVENTS = {
  default: {
    label: 'Happening Now',
    link: null,
    events: [
      { mo:'JUL', dy:'30', tag:'events',   tagLabel:'Concert',    name:'Ja Rule & Ashanti',           meta:'Mill River Park · Stamford, CT',       url:'stamford/downtown/index.html',         ticket:'https://palacestamford.org' },
      { mo:'AUG', dy:'1',  tag:'events',   tagLabel:'Food Fest',  name:'Hey Stamford! Food Festival', meta:'Mill River Park · Stamford, CT',       url:'stamford/downtown/index.html',         ticket:'https://heystamford.com' },
      { mo:'AUG', dy:'30', tag:'events',   tagLabel:'Football',   name:'TTU Football Season Opener',  meta:'Jones AT&T Stadium · Lubbock, TX',     url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/football' },
      { mo:'SEP', dy:'13', tag:'arts',     tagLabel:'Music Fest', name:'Buddy Holly Music Festival',  meta:'Depot District · Lubbock, TX',         url:'lubbock/depot-district/index.html',    ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'19', tag:'arts',     tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · Stamford, CT',        url:'stamford/downtown/index.html',         ticket:'https://palacestamford.org' },
      { mo:'SEP', dy:'26', tag:'events',   tagLabel:'Concert',    name:'Reba McEntire',               meta:'United Supermarkets Arena · Lubbock',  url:'lubbock/historic-district/index.html', ticket:'https://www.unitedssa.com' },
      { mo:'OCT', dy:'11', tag:'events',   tagLabel:'Festival',   name:"That's Amore Italian Fest",   meta:'Columbus Park · Stamford, CT',         url:'stamford/downtown/index.html',         ticket:'https://stamford-downtown.com' },
      { mo:'OCT', dy:'18', tag:'dining',   tagLabel:'Food Fest',  name:'Lubbock on the Square',       meta:'Courthouse Square · Lubbock, TX',      url:'lubbock/historic-district/index.html', ticket:'https://downtownlubbock.org' },
      { mo:'NOV', dy:'8',  tag:'events',   tagLabel:'Basketball', name:'TTU Basketball Opener',       meta:'United Supermarkets Arena · Lubbock',  url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/mens-basketball' },
      { mo:'SAT', dy:'WKL',tag:'outdoors', tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Veterans Memorial Park · Stamford, CT',url:'stamford/index.html',                  ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  Connecticut: {
    label: 'Connecticut Events',
    link: { href: 'connecticut/index.html', text: 'Connecticut Guide →' },
    events: [
      { mo:'JUL', dy:'30', tag:'events', tagLabel:'Concert',   name:'Ja Rule & Ashanti',          meta:'Mill River Park · Stamford, CT', url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'AUG', dy:'1',  tag:'events', tagLabel:'Food Fest', name:'Hey Stamford! Food Festival', meta:'Mill River Park · Aug 1–2',      url:'stamford/downtown/index.html', ticket:'https://heystamford.com' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',   name:'Labyrinth in Concert',        meta:'Palace Theatre · Stamford, CT',  url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'11', tag:'events', tagLabel:'Festival',  name:"That's Amore Italian Fest",   meta:'Columbus Park · Oct 11–12',      url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
    ]
  },
  Stamford: {
    label: 'Stamford Events',
    link: { href: 'stamford/index.html', text: 'Full Stamford Guide →' },
    events: [
      { mo:'JUL', dy:'30', tag:'events',  tagLabel:'Concert',    name:'Ja Rule & Ashanti',          meta:'Mill River Park · 5 PM',             url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'AUG', dy:'1',  tag:'events',  tagLabel:'Food Fest',  name:'Hey Stamford! Food Festival', meta:'Mill River Park · Aug 1–2',          url:'stamford/downtown/index.html', ticket:'https://heystamford.com' },
      { mo:'AUG', dy:'13', tag:'events',  tagLabel:'Block Party',name:'Summer St Block Party',      meta:'Summer St · Downtown · 5 PM',        url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'AUG', dy:'29', tag:'events',  tagLabel:'Beer & Wine',name:'Beer, Wine & Spirits Fest',  meta:'Mill River Park · 1:30 PM',          url:'stamford/downtown/index.html', ticket:'https://stamfordbeerwinespirits.com' },
      { mo:'SEP', dy:'19', tag:'arts',    tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 8 PM',             url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'11', tag:'events',  tagLabel:'Festival',   name:"That's Amore Italian Fest",   meta:'Columbus Park · Oct 11–12',         url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Veterans Memorial Park · Sat AM',   url:'stamford/index.html', ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  Downtown: {
    label: 'Downtown Stamford Events',
    link: { href: 'stamford/downtown/index.html', text: 'Full Downtown Guide →' },
    events: [
      { mo:'AUG', dy:'1',  tag:'events',  tagLabel:'Food Fest',  name:'Hey Stamford! Food Festival', meta:'Mill River Park · Noon–8 PM',  url:'stamford/downtown/index.html', ticket:'https://heystamford.com' },
      { mo:'AUG', dy:'13', tag:'events',  tagLabel:'Block Party',name:'Summer St Block Party',       meta:'Summer St · 5 PM–9 PM',        url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SEP', dy:'19', tag:'arts',    tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 8 PM',        url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'11', tag:'events',  tagLabel:'Festival',   name:'Italian Festival',            meta:'Columbus Park · Noon–9 PM',    url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Columbus Park · 9 AM–1 PM',    url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  'Harbor Point': {
    label: 'Harbor Point Events', link: { href: 'stamford/harbor-point/index.html', text: 'Harbor Point Guide →' },
    events: [
      { mo:'AUG', dy:'1',  tag:'events', tagLabel:'Food Fest',  name:'Hey Stamford! Food Festival', meta:'Mill River Park · Aug 1–2', url:'stamford/downtown/index.html', ticket:'https://heystamford.com' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 8 PM',    url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
    ]
  },
  'North Stamford': {
    label: 'North Stamford Events', link: { href: 'stamford/north-stamford/index.html', text: 'North Stamford Guide →' },
    events: [
      { mo:'AUG', dy:'30', tag:'outdoors', tagLabel:'Festival', name:'Honey Harvest Festival', meta:'Bartlett Arboretum · North Stamford', url:'stamford/north-stamford/index.html', ticket:'https://bartlettarboretum.org' },
    ]
  },
  Texas: {
    label: 'Texas Events', link: { href: 'texas/index.html', text: 'Texas Guide →' },
    events: [
      { mo:'AUG', dy:'30', tag:'events', tagLabel:'Football',   name:'TTU Football Season Opener',  meta:'Jones AT&T Stadium · Lubbock',         url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/football' },
      { mo:'SEP', dy:'13', tag:'arts',   tagLabel:'Music Fest', name:'Buddy Holly Music Festival',  meta:'Depot District · Lubbock',             url:'lubbock/index.html',                   ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'26', tag:'events', tagLabel:'Concert',    name:'Reba McEntire at USA',        meta:'United Supermarkets Arena · Lubbock',  url:'lubbock/historic-district/index.html', ticket:'https://www.unitedssa.com' },
      { mo:'NOV', dy:'8',  tag:'events', tagLabel:'Basketball', name:'TTU Basketball Opener',       meta:'United Supermarkets Arena · Lubbock',  url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/mens-basketball' },
    ]
  },
  Lubbock: {
    label: 'Lubbock Events', link: { href: 'lubbock/index.html', text: 'Full Lubbock Guide →' },
    events: [
      { mo:'AUG', dy:'30', tag:'events', tagLabel:'Football',   name:'TTU Football Season Opener',   meta:'Jones AT&T Stadium · 60K fans',        url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/football' },
      { mo:'SEP', dy:'13', tag:'arts',   tagLabel:'Music Fest', name:'Buddy Holly Music Festival',   meta:'Depot District · Free stages',         url:'lubbock/index.html',                   ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'20', tag:'events', tagLabel:'Football',   name:'TTU vs. Oklahoma State',       meta:'Jones AT&T Stadium · Big 12',          url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/football' },
      { mo:'SEP', dy:'26', tag:'events', tagLabel:'Concert',    name:'Reba McEntire at USA',         meta:'United Supermarkets Arena',            url:'lubbock/historic-district/index.html', ticket:'https://www.unitedssa.com' },
      { mo:'OCT', dy:'11', tag:'events', tagLabel:'Homecoming', name:'Texas Tech Homecoming Game',   meta:'Jones AT&T Stadium',                   url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com' },
      { mo:'OCT', dy:'18', tag:'dining', tagLabel:'Food Fest',  name:'Lubbock on the Square',        meta:'Courthouse Square · Downtown',         url:'lubbock/historic-district/index.html', ticket:'https://downtownlubbock.org' },
      { mo:'NOV', dy:'8',  tag:'events', tagLabel:'Basketball', name:'TTU Basketball Opener',        meta:'United Supermarkets Arena',            url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/mens-basketball' },
    ]
  },
  'Depot District': {
    label: 'Depot District Events', link: { href: 'lubbock/depot-district/index.html', text: 'Full Depot Guide →' },
    events: [
      { mo:'FRI', dy:'WKL', tag:'nightlife', tagLabel:'Live Music', name:'Live Music at Blue Light',    meta:'1806 Buddy Holly Ave · Fri & Sat',  url:'lubbock/depot-district/index.html', ticket:'https://thebluelightlive.com' },
      { mo:'SEP', dy:'13',  tag:'arts',      tagLabel:'Music Fest', name:'Buddy Holly Music Festival',  meta:'Depot District · Free stages',      url:'lubbock/depot-district/index.html', ticket:'https://buddyhollycenter.org' },
      { mo:'NOV', dy:'15',  tag:'nightlife', tagLabel:'Bar Crawl',  name:'Depot District Music Crawl',  meta:'All venues · $15 wristband',        url:'lubbock/depot-district/index.html', ticket:'https://lubbockdepotdistrict.com' },
    ]
  },
  'Tech District': {
    label: 'Tech District Events', link: { href: 'lubbock/tech-district/index.html', text: 'Tech District Guide →' },
    events: [
      { mo:'AUG', dy:'30', tag:'events', tagLabel:'Football',  name:'TTU Football Season Opener', meta:'Jones AT&T Stadium · 60K fans',   url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football' },
      { mo:'SAT', dy:'WKL',tag:'events', tagLabel:'Game Day',  name:'Game Day on The Strip',      meta:'University Ave · Home game Sat',  url:'lubbock/tech-district/index.html', ticket:'https://texastech.com' },
      { mo:'NOV', dy:'8',  tag:'events', tagLabel:'Basketball',name:'TTU Basketball Opener',      meta:'United Supermarkets Arena',       url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/mens-basketball' },
    ]
  },
  'Historic District': {
    label: 'Historic District Events', link: { href: 'lubbock/historic-district/index.html', text: 'Historic District Guide →' },
    events: [
      { mo:'SEP', dy:'26', tag:'events', tagLabel:'Concert',  name:'Reba McEntire at USA',  meta:'United Supermarkets Arena',            url:'lubbock/historic-district/index.html', ticket:'https://www.unitedssa.com' },
      { mo:'OCT', dy:'18', tag:'dining', tagLabel:'Food Fest',name:'Lubbock on the Square', meta:'Courthouse Square · Downtown',         url:'lubbock/historic-district/index.html', ticket:'https://downtownlubbock.org' },
    ]
  },
  'New Jersey': {
    label: 'New Jersey', link: { href: 'new-jersey/index.html', text: 'New Jersey Guide →' },
    events: [
      { mo:'JUN', dy:'14',  tag:'events',  tagLabel:'Food Fest',  name:'HopSauce Festival',    meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'AUG', dy:'TBD', tag:'outdoors',tagLabel:'Surf Comp',  name:'Coquina Jam',           meta:'Beach Haven Ocean Beach · LBI',       url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest',           meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI Kite Festival',     meta:'Ship Bottom Beach · LBI',             url:'lbi/ship-bottom/index.html', ticket:null },
    ]
  },
  'Long Beach Island': {
    label: 'LBI Events', link: { href: 'lbi/index.html', text: 'Full LBI Guide →' },
    events: [
      { mo:'JUN', dy:'14',  tag:'events',  tagLabel:'Food Fest',  name:'HopSauce Festival',    meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'JUL', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Concerts on the Green', meta:'Centre St · Beach Haven · Wednesdays',url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'AUG', dy:'TBD', tag:'outdoors',tagLabel:'Surf Comp',  name:'Coquina Jam',           meta:'Beach Haven Ocean Beach · LBI',       url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'SEP', dy:'TBD', tag:'arts',    tagLabel:'Film Fest',  name:'LBI Film Festival',     meta:'Beach Haven venues · LBI',            url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest',           meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI Kite Festival',     meta:'Ship Bottom Beach · LBI',             url:'lbi/ship-bottom/index.html', ticket:null },
    ]
  },
  Holgate: {
    label: 'Holgate Notes', link: { href: 'lbi/holgate/index.html', text: 'Holgate Guide →' },
    events: [
      { mo:'SEP', dy:'1',   tag:'outdoors',tagLabel:'Season Opens', name:'Beach Driving Opens',  meta:'Holgate · 4WD permitted berm crest',  url:'lbi/holgate/index.html', ticket:null },
      { mo:'SEP', dy:'1',   tag:'outdoors',tagLabel:'Clamming',     name:'Clamming Trail Opens', meta:'Bay side · Sep 1–Mar 15',             url:'lbi/holgate/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'outdoors',tagLabel:'Fishing',      name:'Striped Bass Season',  meta:'Holgate tip · Peak fall run',         url:'lbi/holgate/index.html', ticket:null },
    ]
  },
  'Beach Haven': {
    label: 'Beach Haven Events', link: { href: 'lbi/beach-haven/index.html', text: 'Beach Haven Guide →' },
    events: [
      { mo:'JUN', dy:'14',  tag:'events',  tagLabel:'Food Fest',  name:'HopSauce Festival',       meta:'Taylor Ave Waterfront',               url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'JUL', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Concerts on the Green',   meta:'Centre St · Wednesdays in July',      url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'AUG', dy:'TBD', tag:'outdoors',tagLabel:'Surf Comp',  name:'Coquina Jam Surf Comp',   meta:'Beach Haven Ocean Beach',             url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'SEP', dy:'TBD', tag:'arts',    tagLabel:'Film Fest',  name:'LBI Film Festival',        meta:'Multiple Beach Haven venues',         url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest',              meta:'Taylor Ave Waterfront · Oct',         url:'lbi/beach-haven/index.html', ticket:null },
    ]
  },
  'Ship Bottom': {
    label: 'Ship Bottom Events', link: { href: 'lbi/ship-bottom/index.html', text: 'Ship Bottom Guide →' },
    events: [
      { mo:'OCT', dy:'TBD', tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI Kite Festival',    meta:'Ship Bottom Beach · LBI',             url:'lbi/ship-bottom/index.html', ticket:null },
    ]
  },
  'Surf City': {
    label: 'Surf City Events', link: { href: 'lbi/surf-city/index.html', text: 'Surf City Guide →' },
    events: [
      { mo:'SAT', dy:'WKL', tag:'outdoors',tagLabel:'Market',    name:'Saturday Farmers Market', meta:'Municipal Complex · 8am–1pm',         url:'lbi/surf-city/index.html', ticket:null },
    ]
  },
  'Harvey Cedars': {
    label: 'Harvey Cedars Events', link: { href: 'lbi/harvey-cedars/index.html', text: 'Harvey Cedars Guide →' },
    events: [
      { mo:'FRI', dy:'WKL', tag:'outdoors',tagLabel:'Market',    name:'Friday Farmers Market',  meta:'Veterans Memorial Park · Jun–Sep',    url:'lbi/harvey-cedars/index.html', ticket:null },
    ]
  },
  'Barnegat Light': {
    label: 'Barnegat Light', link: { href: 'lbi/barnegat-light/index.html', text: 'Barnegat Light Guide →' },
    events: [
      { mo:'DAI', dy:'LY',  tag:'outdoors',tagLabel:'Landmark', name:'Barnegat Lighthouse',     meta:'217 steps · Panoramic inlet views',   url:'lbi/barnegat-light/index.html', ticket:null },
      { mo:'DAI', dy:'LY',  tag:'outdoors',tagLabel:'Market',   name:'Viking Village Fish Market',meta:'Fresh catch off the boats',         url:'lbi/barnegat-light/index.html', ticket:null },
    ]
  },
};

function _renderPanelEvents(locationKey, p, containerEl) {
  const data = PANEL_EVENTS[locationKey] || PANEL_EVENTS.default;
  const linkHtml = data.link
    ? `<a href="${p}${data.link.href}" style="font-size:0.72rem;color:var(--gold);font-weight:600;">${data.link.text}</a>`
    : '';
  const headerHtml = `
    <div class="home-events-header">
      <span>${data.label}</span>
      ${linkHtml}
    </div>`;

  if (!data.events.length) {
    containerEl.innerHTML = headerHtml + `
      <div style="padding:1.5rem 0;text-align:center;">
        <div style="font-size:1.5rem;margin-bottom:0.5rem;">🗺️</div>
        <p style="font-size:0.82rem;color:rgba(255,255,255,0.4);line-height:1.6;">Coming soon — check back for events.</p>
      </div>`;
    return;
  }

  const evHtml = data.events.map(ev => `
    <div class="home-event-item">
      <div class="home-event-date"><div class="mo">${ev.mo}</div><div class="dy">${ev.dy}</div></div>
      <div class="home-event-info">
        <div class="home-event-tag ${ev.tag}">${ev.tagLabel}</div>
        <div class="home-event-name">${ev.name}</div>
        <div class="home-event-meta">${ev.meta}</div>
        <div class="home-event-actions">
          ${ev.url ? `<a href="${p}${ev.url}" class="home-event-action-link">More info</a>` : ''}
          ${ev.ticket ? `<a href="${ev.ticket}" target="_blank" rel="noopener" class="home-event-action-link ticket">Tickets / Info →</a>` : ''}
        </div>
      </div>
    </div>`).join('');

  containerEl.innerHTML = headerHtml + evHtml;
}

function initSidePanel() {
  const loc = document.body.getAttribute('data-page-location');
  if (!loc) return;

  const p = rootPrefix();

  const panel = document.createElement('div');
  panel.className = 'site-left-panel';

  panel.innerHTML = `
    <div class="site-panel-top">
      <div class="home-eyebrow">The Concierge</div>
      <div class="home-title">Your Local<br><span>Guide</span></div>
      <form class="nav-search-form site-panel-search" onsubmit="handleNavSearch(event)" autocomplete="off">
        <input type="text" placeholder="Search cities, events…" />
        <button type="submit" aria-label="Search">⌕</button>
      </form>
    </div>
    <div class="site-panel-middle" id="site-panel-events"></div>
    <div class="site-panel-bottom">
      <p style="font-size:0.72rem;color:rgba(255,255,255,0.35);margin-bottom:0.6rem;">Know something we missed?</p>
      <a href="${p}index.html#suggest" style="display:block;text-align:center;background:rgba(201,168,76,0.12);border:1px solid rgba(201,168,76,0.3);border-radius:var(--radius);padding:0.55rem 1rem;font-size:0.78rem;font-weight:600;color:var(--gold-lt);text-decoration:none;transition:background 0.2s;">+ Suggest a Place or Event</a>
    </div>`;

  document.body.insertBefore(panel, document.body.firstChild);

  const evContainer = document.getElementById('site-panel-events');
  _renderPanelEvents(loc, p, evContainer);

  const pageWrap = document.querySelector('.page-wrap');
  if (pageWrap) pageWrap.classList.add('page-wrap-with-panel');

  // Init nav search on the panel's search form
  const panelForm = panel.querySelector('.site-panel-search');
  if (panelForm) initNavSearch(panelForm);
}

// Submit suggestion form
function handleSubmit(e) {
  if (e) e.preventDefault();
  const form = e ? e.target : document.getElementById('suggest-form');
  if (!form) return;
  form.innerHTML = `
    <div style="text-align:center;padding:2rem 1rem;">
      <div style="font-size:2.5rem;margin-bottom:0.75rem;">✓</div>
      <h3 style="color:var(--navy);margin-bottom:0.5rem;">Thanks for the tip!</h3>
      <p style="color:var(--sub);font-size:0.9rem;">Our team will review your suggestion and verify it. If it checks out, it'll appear on the site within 24–48 hours.</p>
    </div>`;
}

// Scroll animations
function initScrollAnimations() {
  const els = document.querySelectorAll('.animate-in');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  initSidePanel();
  initCategoryFilter();
  initScrollAnimations();

  const searchForm = document.getElementById('search-form');
  if (searchForm) searchForm.addEventListener('submit', handleSearch);

  const suggestForm = document.getElementById('suggest-form');
  if (suggestForm) suggestForm.addEventListener('submit', handleSubmit);

  // Init suggestion dropdown on the top nav search bar
  // (panel search bar is inited inside initSidePanel)
  const navForm = document.querySelector('.nav-search-form:not(.site-panel-search)');
  if (navForm) initNavSearch(navForm);
});
