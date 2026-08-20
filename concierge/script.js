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
            },
            {
              label: 'Princeton', aliases: ['princeton'], status: 'live', url: 'princeton/index.html',
              children: [
                { label:'Palmer Square',       aliases:['palmer square','nassau street','downtown princeton'], status:'live', url:'princeton/palmer-square/index.html',       children:[] },
                { label:'Witherspoon-Jackson', aliases:['witherspoon jackson','witherspoon','jackson'],        status:'live', url:'princeton/witherspoon-jackson/index.html', children:[] },
                { label:'University Campus',   aliases:['university','princeton university','campus'],         status:'live', url:'princeton/university/index.html',         children:[] },
                { label:'Western Section',     aliases:['western section','battlefield','stockton street'],    status:'live', url:'princeton/western-section/index.html',     children:[] },
              ]
            },
            { label: 'Sea Bright', aliases: ['sea bright'], status: 'live', url: 'sea-bright/index.html', children: [] },
            { label: 'Montgomery Township', aliases: ['montgomery','montgomery township','skillman','belle mead','blawenburg'], status: 'live', url: 'montgomery/index.html', children: [] },
            { label: 'Cape May', aliases: ['cape may','cape may city','cape may nj'], status: 'live', url: 'cape-may/index.html', children: [] },
          ]
        },
        {
          label: 'New York', aliases: ['new york','ny','new york state','empire state'], status: 'live', url: 'new-york/index.html',
          children: [
            {
              label: 'Manhattan', aliases: ['manhattan','new york city','nyc'], status: 'live', url: 'manhattan/index.html',
              children: [
                { label:'Tribeca',            aliases:['tribeca'],                                          status:'live', url:'manhattan/index.html#tribeca',            children:[] },
                { label:'SoHo',               aliases:['soho','south of houston'],                          status:'live', url:'manhattan/index.html#soho',               children:[] },
                { label:'Greenwich Village',  aliases:['greenwich village','the village','stonewall'],      status:'live', url:'manhattan/index.html#greenwich-village',  children:[] },
                { label:'East Village',       aliases:['east village','st marks','st marks place','alphabet city'], status:'live', url:'manhattan/index.html#east-village', children:[] },
                { label:'Chelsea',            aliases:['chelsea','high line','chelsea market'],             status:'live', url:'manhattan/index.html#chelsea',            children:[] },
                { label:'Upper West Side',    aliases:['upper west side','uws','lincoln center'],           status:'live', url:'manhattan/index.html#upper-west-side',    children:[] },
                { label:'Harlem',             aliases:['harlem','apollo theater'],                          status:'live', url:'manhattan/index.html#harlem',             children:[] },
                { label:'Financial District', aliases:['financial district','fidi','wall street'],          status:'live', url:'manhattan/index.html#financial-district', children:[] },
              ]
            },
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
    { label:'Chowderfest',       sub:'Oct 3–4 · Taylor Ave · Beach Haven',     type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['chowderfest','chowder','chowder cook-off','lbi festival','beach haven festival'] },
    { label:'HopSauce Festival', sub:'Jun (annual) · Taylor Ave · Beach Haven',type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['hopsauce','hop sauce','craft beer','hot sauce','beach haven beer'] },
    { label:'Lighthouse International Film Festival', sub:'Jun (annual) · island-wide · LBI', type:'event', url: p+'lbi/beach-haven/index.html', keywords:['lighthouse film festival','lbi film festival','film festival','indie film'] },
    { label:'Coquina Jam',       sub:'Jul (annual) · Brant Beach · LBI',       type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['coquina jam','surf competition','lbi surf','surfing competition','jetty'] },
    { label:'LBI FLY Kite Festival', sub:'Oct 9–10 · Ship Bottom Beach',       type:'event',  url: p+'lbi/ship-bottom/index.html',  keywords:['kite festival','lbi kite','lbi fly','ship bottom kite','kite flying'] },
    { label:'LBI 18 Mile Run & 12K', sub:'Oct 11 · starts Holgate · 52nd annual', type:'event', url: p+'lbi/holgate/index.html',   keywords:['18 mile run','lbi run','12k','race lbi','commemorative run'] },
    { label:'Concerts on the Green', sub:'Jul–Aug Wednesdays · Beach Haven',  type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['concerts on the green','free concert','beach haven concert','lbi music'] },
    { label:'Ghost: The Musical at Surflight', sub:'Sep 1–20 · Surflight Theatre · Beach Haven', type:'event', url: p+'lbi/beach-haven/index.html', keywords:['ghost the musical','surflight show','beach haven theatre','lbi theatre'] },
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
    { label:'Beer Wine Spirits Fest',      sub:'Aug 29 · Mill River Park · 1–4:30 PM',   type:'event',  url: p+'stamford/downtown/index.html',    keywords:['beer','wine','spirits','beer fest','stamford beer'] },
    { label:'Labyrinth in Concert',        sub:'Sep 19 · Palace Theatre · Stamford',     type:'event',  url: p+'stamford/downtown/index.html',    keywords:['labyrinth','bowie','david bowie','palace theatre','stamford show'] },
    { label:'Jesse McCartney at the Palace',sub:'Sep 4 · Palace Theatre · Stamford',     type:'event',  url: p+'stamford/downtown/index.html',    keywords:['jesse mccartney','weightless tour','palace concert','stamford concert'] },
    { label:"Stayin' Alive — Bee Gees Tribute", sub:'Oct 2 · Palace Theatre · Stamford', type:'event',  url: p+'stamford/downtown/index.html',    keywords:['stayin alive','bee gees','tribute','palace theatre'] },
    { label:'America — The Happy Trails Tour', sub:'Oct 30 · Palace Theatre · Stamford', type:'event',  url: p+'stamford/downtown/index.html',    keywords:['america band','horse with no name','happy trails','palace theatre'] },
    { label:"That's Amore Italian Festival",sub:'Oct (2026 dates TBA) · Mill River Park',type:'event',  url: p+'stamford/index.html',             keywords:['italian festival','italian','that\'s amore','mill river park'] },
    { label:'Stamford Downtown Parade Spectacular', sub:'Nov 22 · Downtown Stamford',    type:'event',  url: p+'stamford/downtown/index.html',    keywords:['parade spectacular','thanksgiving parade','balloon parade','stamford parade'] },
    { label:'Downtown Farmers Market',     sub:'Saturdays 9 AM–1 PM · Veterans Memorial Park', type:'event', url: p+'stamford/downtown/index.html', keywords:['farmers market','market','stamford market','saturday market'] },
    { label:'Honey Harvest Festival',      sub:'Aug 30 · Bartlett Arboretum',            type:'event',  url: p+'stamford/north-stamford/index.html',keywords:['honey harvest','bartlett','arboretum','honey'] },
    // ── Events — Lubbock ──
    { label:'TTU Football Season Opener',  sub:'Sep 5 · vs Abilene Christian · Jones AT&T Stadium', type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech football','ttu football','red raiders football','football game','football','jones stadium','lubbock football','abilene christian','season opener'] },
    { label:'TTU vs. Houston',             sub:'Sep 18 · Jones AT&T Stadium · Big 12 home opener', type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['houston','texas tech','big 12','home opener','football game','college football'] },
    { label:'Texas Tech Homecoming',       sub:'Oct 17 · vs Arizona State · Jones AT&T Stadium',   type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['homecoming','texas tech homecoming','ttu homecoming','football','arizona state'] },
    { label:'TTU vs. TCU — Thanksgiving',  sub:'Nov 26 · Jones AT&T Stadium · 8 PM',    type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['tcu','texas tech','thanksgiving football','battle for the saddle','rivalry game','college football'] },
    { label:'TTU Basketball Season Opener',sub:'Nov 2 · vs Jackson State · United Supermarkets Arena', type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech basketball','ttu basketball','red raiders basketball','basketball','college basketball','lubbock basketball','jackson state'] },
    { label:'TTU Baseball',                sub:'Feb–May · Rip Griffin Park',            type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['texas tech baseball','ttu baseball','baseball','college baseball','lubbock baseball'] },
    { label:'Buddy Holly 90th Birthday Bash', sub:'Sep 7 · Buddy Holly Center · Lubbock', type:'event', url: p+'lubbock/index.html',              keywords:['buddy holly','birthday bash','buddy holly center','lubbock festival','free concert','family event'] },
    { label:"Mo's Sunset Market",          sub:'Saturdays 6–9 PM · 1712 Buddy Holly Ave', type:'event', url: p+'lubbock/depot-district/index.html', keywords:['mos sunset market','sunset market','depot district market','lubbock market','night market'] },
    { label:'Live Music at Blue Light',    sub:'Every Fri & Sat · Depot District',      type:'event',  url: p+'lubbock/depot-district/index.html', keywords:['blue light','blue light live','live music lubbock','red dirt','country music','texas music'] },
    { label:'Game Day on The Strip',       sub:'Home game Saturdays · University Ave',  type:'sports', url: p+'lubbock/tech-district/index.html', keywords:['game day','the strip','university ave','lubbock game day','football saturday'] },
    { label:'First Friday Art Trail',      sub:'1st Fri monthly 6–9 PM · Cultural District · Lubbock', type:'event', url: p+'lubbock/historic-district/index.html', keywords:['first friday','art trail','ffat','lhuca','lubbock art','gallery night','cultural district'] },
    { label:'Panhandle South Plains Fair', sub:'Sep 25 – Oct 3 · South Plains Fairgrounds · Lubbock', type:'event', url: p+'lubbock/index.html', keywords:['south plains fair','panhandle fair','lubbock fair','fairgrounds','carnival lubbock','rides'] },
    { label:'Randy Rogers Band at Buddy Holly Hall', sub:'Sep 19 · Buddy Holly Hall · Lubbock', type:'event', url: p+'lubbock/historic-district/index.html', keywords:['randy rogers','randy rogers band','texas country concert','buddy holly hall concert','hank weaver'] },
    { label:'Elevation Nights',            sub:'Oct 14 · United Supermarkets Arena · Lubbock', type:'event', url: p+'lubbock/tech-district/index.html', keywords:['elevation worship','elevation nights','steven furtick','worship concert','usa arena concert'] },
    { label:'Carol of Lights',             sub:'Dec 6 · Texas Tech Campus · 68th annual', type:'event', url: p+'lubbock/tech-district/index.html', keywords:['carol of lights','texas tech christmas','holiday lights lubbock','ttu tradition','memorial circle lights'] },
    { label:'Waitress — Broadway at Buddy Holly Hall', sub:'Nov 20–22 · Buddy Holly Hall · Lubbock', type:'event', url: p+'lubbock/historic-district/index.html', keywords:['waitress','broadway lubbock','broadway at buddy holly hall','american theatre guild','touring broadway'] },
    // ── Venues ──
    { label:'Jones AT&T Stadium',          sub:'Texas Tech · Lubbock',                  type:'place',  url: p+'lubbock/tech-district/index.html', keywords:['jones','jones stadium','ttu stadium','football stadium','lubbock stadium'] },
    { label:'United Supermarkets Arena',   sub:'Texas Tech · Lubbock',                  type:'place',  url: p+'lubbock/tech-district/index.html', keywords:['united supermarkets arena','usa arena','lubbock arena','ttu arena'] },
    { label:'Buddy Holly Hall',            sub:'Performing Arts · Lubbock',             type:'place',  url: p+'lubbock/historic-district/index.html',keywords:['buddy holly hall','performing arts','lubbock concert hall','lubbock theatre'] },
    { label:'Palace Theatre',              sub:'Downtown Stamford',                      type:'place',  url: p+'stamford/downtown/index.html',    keywords:['palace theatre','palace','stamford theatre','stamford concert'] },
    // ── Princeton ──
    { label:'Princeton, NJ',      sub:'New Jersey',            type:'place',  url: p+'princeton/index.html',                  keywords:['princeton','princeton nj','nassau street','mercer county'] },
    { label:'Palmer Square',      sub:'Princeton, NJ',         type:'place',  url: p+'princeton/palmer-square/index.html',    keywords:['palmer square','nassau street','downtown princeton','nassau inn'] },
    { label:'Witherspoon-Jackson',sub:'Princeton, NJ',         type:'place',  url: p+'princeton/witherspoon-jackson/index.html', keywords:['witherspoon jackson','witherspoon','jackson','historic district princeton'] },
    { label:'University Campus',  sub:'Princeton, NJ',         type:'place',  url: p+'princeton/university/index.html',       keywords:['princeton university','campus','richardson auditorium','mccarter','art museum'] },
    { label:'Western Section',    sub:'Princeton, NJ',         type:'place',  url: p+'princeton/western-section/index.html',  keywords:['western section','morven','drumthwacket','battlefield','institute woods'] },
    // ── Music venues ──
    { label:"Bird & Betty's",     sub:'Music Hall · Beach Haven, LBI',       type:'place', url: p+'lbi/beach-haven/index.html',      keywords:['bird and bettys','bird & bettys','birds and bettys','live music lbi','beach haven music','dock road'] },
    { label:'The Sea Shell Resort',sub:'Tiki Bar · Beach Haven, LBI',        type:'place', url: p+'lbi/beach-haven/index.html',      keywords:['sea shell','seashell','tiki bar','thunder thursday','beach club lbi'] },
    { label:'The Marlin',         sub:'Live Music · Beach Haven, LBI',       type:'place', url: p+'lbi/beach-haven/index.html',      keywords:['the marlin','marlin lbi','dance floor lbi','beach haven bands'] },
    { label:"Buckalew's",         sub:'Tavern · Beach Haven, LBI',           type:'place', url: p+'lbi/beach-haven/index.html',      keywords:['buckalews','buckalew','bay avenue','acoustic lbi'] },
    { label:'Black Whale Bar',    sub:'Beach Haven, LBI',                    type:'place', url: p+'lbi/beach-haven/index.html',      keywords:['black whale','fish house','year round music lbi'] },
    { label:"Joe Pop's Shore Bar",sub:'Ship Bottom, LBI',                    type:'place', url: p+'lbi/ship-bottom/index.html',      keywords:['joe pops','joe pop','shore bar','ship bottom music'] },
    { label:'Surf City Hotel',    sub:'Surf City, LBI',                      type:'place', url: p+'lbi/surf-city/index.html',        keywords:['surf city hotel','beach club','shorty long','jersey horns','north end nightlife'] },
    { label:"Nardi's Tavern",     sub:'Harvey Cedars, LBI',                  type:'place', url: p+'lbi/harvey-cedars/index.html',    keywords:['nardis','nardi','party bus','harvey cedars music','live music every night'] },
    { label:"Kubel's",            sub:'Barnegat Light, LBI',                 type:'place', url: p+'lbi/barnegat-light/index.html',   keywords:['kubels','kubel','barnegat light bar','bayview'] },
    { label:"Tiernan's Bar",      sub:'Downtown Stamford',                   type:'place', url: p+'stamford/downtown/index.html',    keywords:['tiernans','tiernan','main street stamford','live bands stamford','friday saturday bands'] },
    { label:'Tigin Irish Pub',    sub:'Downtown Stamford',                   type:'place', url: p+'stamford/downtown/index.html',    keywords:['tigin','irish pub stamford','trivia stamford'] },
    { label:'Half Full Brewery',  sub:'Stamford, CT',                        type:'place', url: p+'stamford/harbor-point/index.html',keywords:['half full','third place','brewery stamford','beer garden'] },
    { label:'Beer Garden at Shippan Landing', sub:'Shippan · Stamford, CT',  type:'place', url: p+'stamford/shippan-point/index.html',keywords:['beer garden','shippan landing','harbor drive','food trucks stamford'] },
    { label:'The Blue Light Live',sub:'Depot District · Lubbock, TX',        type:'place', url: p+'lubbock/depot-district/index.html',keywords:['blue light','bluelight','buddy holly ave','red dirt','texas country','listening room'] },
    { label:"Jake's Backroom",    sub:'Depot District · Lubbock, TX',        type:'place', url: p+'lubbock/depot-district/index.html',keywords:['jakes backroom','jakes','rock club lubbock','metal lubbock'] },
    { label:"Cook's Garage",      sub:'Lubbock, TX',                         type:'place', url: p+'lubbock/depot-district/index.html',keywords:['cooks garage','outdoor venue lubbock','beer hall lubbock'] },
    { label:'The Alchemist & Barrister', sub:'Palmer Square · Princeton',    type:'place', url: p+'princeton/palmer-square/index.html',keywords:['alchemist and barrister','alchemist','barrister','witherspoon street','cheers of princeton','princeton bands'] },
    { label:'Triumph Brewing Company', sub:'20 Palmer Square E · Princeton', type:'place', url: p+'princeton/palmer-square/index.html',keywords:['triumph brewing','triumph','brewpub princeton','palmer square bar'] },
    { label:'Princeton Farmers Market', sub:'Thursdays 10 AM–3 PM · Hinds Plaza', type:'event', url: p+'princeton/palmer-square/index.html', keywords:['princeton farmers market','hinds plaza','farmers market princeton','thursday market'] },
    { label:'Palmer Square Fall Music Series', sub:'Saturdays 1–3 PM thru Oct 3 · Palmer Square', type:'event', url: p+'princeton/palmer-square/index.html', keywords:['palmer square music','fall music series','free music princeton','green concerts'] },
    { label:'Ivy Inn',            sub:'Princeton, NJ',                       type:'place', url: p+'princeton/palmer-square/index.html',keywords:['ivy inn','dive bar princeton','pool tables princeton'] },
    { label:'Richardson Auditorium', sub:'Princeton University',             type:'place', url: p+'princeton/university/index.html', keywords:['richardson auditorium','alexander hall','princeton university concerts','chamber music','new jersey symphony'] },
    { label:'McCarter Theatre Center', sub:'Princeton, NJ',                  type:'place', url: p+'princeton/university/index.html', keywords:['mccarter','mccarter theatre','princeton theatre','princeton ballet'] },
    // ── Sea Bright ──
    { label:'Sea Bright, NJ',     sub:'New Jersey',            type:'place',  url: p+'sea-bright/index.html',                 keywords:['sea bright','sea bright nj','monmouth county','jersey shore','barrier peninsula'] },
    { label:"Anjelica's Restaurant", sub:'Sea Bright, NJ',      type:'place',  url: p+'sea-bright/index.html',                 keywords:['anjelicas','angelicas','italian restaurant sea bright','ocean ave'] },
    { label:"Tommy's Tavern + Tap", sub:'Sea Bright, NJ',       type:'place',  url: p+'sea-bright/index.html',                 keywords:['tommys tavern','tommys tap','sports bar sea bright'] },
    { label:'Drifthouse',         sub:'Sea Bright, NJ',         type:'place',  url: p+'sea-bright/index.html',                 keywords:['drifthouse','driftwood cabana club','seafood sea bright'] },
    { label:"Donovan's Reef",     sub:'Sea Bright, NJ',         type:'place',  url: p+'sea-bright/index.html',                 keywords:['donovans reef','beach bar sea bright','cocktails in the sand'] },
    { label:'Sea Bright Fall Festival', sub:'Sep · Municipal Complex · Sea Bright', type:'event', url: p+'sea-bright/index.html', keywords:['sea bright fall festival','sea bright festival','bonfire'] },
    { label:'Sea Bright Farm & Artisan Market', sub:'Wed · Jun–Oct · Sea Bright', type:'event', url: p+'sea-bright/index.html', keywords:['sea bright farmers market','farm and artisan market','sea bright market'] },
    { label:'Shrewsbury Riverfront Park', sub:'Sea Bright, NJ', type:'place',  url: p+'sea-bright/index.html',                 keywords:['shrewsbury riverfront park','fishing sea bright','kayak launch sea bright'] },
    // ── Montgomery Township ──
    { label:'Montgomery Township, NJ', sub:'New Jersey',        type:'place',  url: p+'montgomery/index.html',                 keywords:['montgomery township','montgomery nj','somerset county','skillman','belle mead','blawenburg'] },
    { label:'Skillman',           sub:'Montgomery Township, NJ',type:'place',  url: p+'montgomery/index.html',                 keywords:['skillman nj','skillman village','route 601'] },
    { label:'Belle Mead',         sub:'Montgomery Township, NJ',type:'place',  url: p+'montgomery/index.html',                 keywords:['belle mead nj','belle mead village','route 206'] },
    { label:'Blawenburg',         sub:'Montgomery Township, NJ',type:'place',  url: p+'montgomery/index.html',                 keywords:['blawenburg nj','blawenburg village','blawenburg historic district'] },
    { label:'Skillman Park',      sub:'Montgomery Township, NJ',type:'place',  url: p+'montgomery/index.html',                 keywords:['skillman park','somerset county park','dog park montgomery'] },
    { label:'Montgomery Park',    sub:'Montgomery Township, NJ',type:'place',  url: p+'montgomery/index.html',                 keywords:['montgomery park','harlingen road park','9/11 memorial montgomery'] },
    { label:'Blawenburg Historic District', sub:'Montgomery Township, NJ', type:'place', url: p+'montgomery/index.html',      keywords:['blawenburg historic district','reformed dutch church','national register montgomery'] },
    { label:'Blawenburg Bistro',  sub:'Blawenburg, Montgomery Township', type:'place', url: p+'montgomery/index.html',        keywords:['blawenburg bistro','blawenburg cafe','breakfast montgomery'] },
    { label:'206 Corner Deli',    sub:'Belle Mead, Montgomery Township', type:'place', url: p+'montgomery/index.html',        keywords:['206 corner deli','deli belle mead','route 206 deli'] },
    { label:'New World Pizza & Cafe', sub:'Skillman, Montgomery Township', type:'place', url: p+'montgomery/index.html',      keywords:['new world pizza','pizza skillman','route 601 pizza'] },
    { label:'Montgomery Farmers\' Market', sub:'Sat · Municipal Complex · Skillman', type:'event', url: p+'montgomery/index.html', keywords:['montgomery farmers market','farmers market skillman','montgomery friends of open space'] },
    { label:'Montgomery FunFest', sub:'Annual · Montgomery Township', type:'event', url: p+'montgomery/index.html',           keywords:['montgomery funfest','funfest','rotary club montgomery'] },
    { label:'The Blawenburg Band',sub:'Since 1890 · Montgomery Township', type:'place', url: p+'montgomery/index.html',       keywords:['blawenburg band','community band montgomery','concert band nj'] },
    // ── Cape May ──
    { label:'Cape May, NJ',       sub:'New Jersey',            type:'place',  url: p+'cape-may/index.html',                   keywords:['cape may','cape may city','cape may county','victorian','national historic landmark'] },
    { label:'Washington Street Mall', sub:'Cape May, NJ',      type:'place',  url: p+'cape-may/index.html',                   keywords:['washington street mall','downtown cape may','pedestrian mall'] },
    { label:'Emlen Physick Estate', sub:'Cape May, NJ',        type:'place',  url: p+'cape-may/index.html',                   keywords:['emlen physick estate','physick estate','cape may mac','victorian mansion'] },
    { label:'Congress Hall',      sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['congress hall','blue pig tavern','boiler room cape may'] },
    { label:'The Promenade',      sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['cape may promenade','cape may beach','cape may boardwalk'] },
    { label:'The Ebbitt Room',    sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['ebbitt room','virginia hotel cape may','fine dining cape may'] },
    { label:'The Mad Batter',     sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['mad batter','breakfast cape may','jackson street cape may'] },
    { label:'The Lobster House',  sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['lobster house','fishermans wharf cape may','seafood cape may'] },
    { label:'Rusty Nail',         sub:'Cape May, NJ',          type:'place',  url: p+'cape-may/index.html',                   keywords:['rusty nail','beach shack cape may','surfer bar cape may'] },
    { label:'Cape May Music Festival', sub:'May–Jun · Cape May', type:'event', url: p+'cape-may/index.html',                  keywords:['cape may music festival','cape may mac','classical music festival'] },
    { label:'Exit Zero Jazz Festival', sub:'Fall edition Oct 22–25 · Cape May', type:'event', url: p+'cape-may/index.html',    keywords:['exit zero jazz festival','jazz festival cape may','exit 0'] },
    { label:'Victorian Weekend',       sub:'Oct 9–12 · Cape May MAC',           type:'event', url: p+'cape-may/index.html',    keywords:['victorian weekend','house tours cape may','cape may mac','victorian festival'] },
    { label:'Cape May Food & Wine Celebration', sub:'Sep · Cape May', type:'event', url: p+'cape-may/index.html',            keywords:['cape may food and wine','food wine celebration','wine festival cape may'] },
    { label:'Christmas in Cape May', sub:'Nov–Jan · Cape May',  type:'event', url: p+'cape-may/index.html',                  keywords:['christmas in cape may','holiday lights cape may','victorian christmas'] },
    // ── New York ──
    { label:'New York',           sub:'United States',         type:'place',  url: p+'new-york/index.html',                   keywords:['new york','new york state','empire state','ny'] },
    // ── Manhattan ──
    { label:'Manhattan, NY',      sub:'New York',              type:'place',  url: p+'manhattan/index.html',                  keywords:['manhattan','new york city','nyc','new york county'] },
    { label:'Tribeca',            sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#tribeca',          keywords:['tribeca','triangle below canal','lower manhattan'] },
    { label:'SoHo',               sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#soho',             keywords:['soho','south of houston','cast iron historic district'] },
    { label:'Greenwich Village',  sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#greenwich-village',keywords:['greenwich village','the village','washington square park','stonewall inn'] },
    { label:'East Village',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#east-village',     keywords:['east village','st marks place','tompkins square park','alphabet city'] },
    { label:'Chelsea',            sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#chelsea',          keywords:['chelsea','high line','chelsea market','chelsea galleries'] },
    { label:'Upper West Side',    sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#upper-west-side',  keywords:['upper west side','uws','lincoln center','natural history museum'] },
    { label:'Harlem',             sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#harlem',           keywords:['harlem','apollo theater','studio museum in harlem','malcolm x blvd'] },
    { label:'Financial District', sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#financial-district',keywords:['financial district','fidi','wall street','stone street','9/11 memorial'] },
    { label:'The Odeon',          sub:'Tribeca, Manhattan',    type:'place',  url: p+'manhattan/index.html#tribeca',          keywords:['the odeon','odeon','tribeca brasserie'] },
    { label:"Bubby's",            sub:'Tribeca, Manhattan',    type:'place',  url: p+'manhattan/index.html#tribeca',          keywords:['bubbys','bubby','tribeca breakfast'] },
    { label:'Balthazar',          sub:'SoHo, Manhattan',       type:'place',  url: p+'manhattan/index.html#soho',             keywords:['balthazar','soho brasserie','french restaurant soho'] },
    { label:'Dominique Ansel Bakery', sub:'SoHo, Manhattan',   type:'place',  url: p+'manhattan/index.html#soho',             keywords:['dominique ansel','cronut','soho bakery'] },
    { label:'The Red Lion',       sub:'Greenwich Village, Manhattan', type:'place', url: p+'manhattan/index.html#greenwich-village', keywords:['red lion','red lion nyc','bleecker street bar','live music bar'] },
    { label:'Village Vanguard',   sub:'Greenwich Village, Manhattan', type:'place', url: p+'manhattan/index.html#greenwich-village', keywords:['village vanguard','jazz club','oldest jazz club nyc'] },
    { label:'Blue Note',          sub:'Greenwich Village, Manhattan', type:'place', url: p+'manhattan/index.html#greenwich-village', keywords:['blue note','blue note jazz club','jazz greenwich village'] },
    { label:'NYU Skirball Center',sub:'Greenwich Village, Manhattan', type:'place', url: p+'manhattan/index.html#greenwich-village', keywords:['nyu skirball','skirball center','nyu performing arts','university concert hall'] },
    { label:'Veselka',            sub:'East Village, Manhattan', type:'place', url: p+'manhattan/index.html#east-village',     keywords:['veselka','ukrainian diner','east village restaurant'] },
    { label:'Webster Hall',       sub:'East Village, Manhattan', type:'place', url: p+'manhattan/index.html#east-village',     keywords:['webster hall','concert venue east village'] },
    { label:'The High Line',      sub:'Chelsea, Manhattan',    type:'place',  url: p+'manhattan/index.html#chelsea',          keywords:['high line','elevated park','chelsea park'] },
    { label:'Chelsea Market',     sub:'Chelsea, Manhattan',    type:'place',  url: p+'manhattan/index.html#chelsea',          keywords:['chelsea market','food hall chelsea','nabisco factory'] },
    { label:'Madison Square Garden', sub:'Chelsea, Manhattan', type:'place',  url: p+'manhattan/index.html#chelsea',          keywords:['madison square garden','msg','the garden','knicks','rangers','arena'] },
    { label:"Zabar's",            sub:'Upper West Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-west-side', keywords:['zabars','appetizing store','upper west side food'] },
    { label:'Levain Bakery',      sub:'Upper West Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-west-side', keywords:['levain bakery','levain cookie','upper west side bakery'] },
    { label:'Beacon Theatre',     sub:'Upper West Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-west-side', keywords:['beacon theatre','beacon theater','upper west side concert hall'] },
    { label:"Sylvia's Restaurant",sub:'Harlem, Manhattan',     type:'place',  url: p+'manhattan/index.html#harlem',           keywords:['sylvias','soul food harlem','queen of soul food'] },
    { label:'Red Rooster',        sub:'Harlem, Manhattan',     type:'place',  url: p+'manhattan/index.html#harlem',           keywords:['red rooster','marcus samuelsson','harlem restaurant'] },
    { label:'Fraunces Tavern',    sub:'Financial District, Manhattan', type:'place', url: p+'manhattan/index.html#financial-district', keywords:['fraunces tavern','oldest building manhattan','washington farewell'] },
    { label:"Delmonico's",        sub:'Financial District, Manhattan', type:'place', url: p+'manhattan/index.html#financial-district', keywords:['delmonicos','steakhouse fidi','wall street restaurant'] },
    { label:'9/11 Memorial & Museum', sub:'Financial District, Manhattan', type:'place', url: p+'manhattan/index.html#financial-district', keywords:['9/11 memorial','world trade center','ground zero museum'] },
    { label:'Tribeca Festival',   sub:'Jun · Tribeca',         type:'event',  url: p+'manhattan/index.html#tribeca',          keywords:['tribeca festival','tribeca film festival','robert de niro film festival'] },
    { label:'Village Halloween Parade', sub:'Oct 31 · Greenwich Village', type:'event', url: p+'manhattan/index.html#greenwich-village', keywords:['village halloween parade','halloween parade nyc','sixth avenue parade'] },
    { label:'Harlem Week',        sub:'Aug 1–16 · Harlem',     type:'event',  url: p+'manhattan/index.html#harlem',           keywords:['harlem week','harlem day','a great day in harlem'] },
    { label:'Gorillaz at Madison Square Garden', sub:'Sep 29 · Chelsea', type:'event', url: p+'manhattan/index.html#chelsea', keywords:['gorillaz','the mountain tour','msg concert','madison square garden concert'] },
    { label:'Doja Cat at Madison Square Garden', sub:'Dec 1 · Chelsea',  type:'event', url: p+'manhattan/index.html#chelsea', keywords:['doja cat','tour ma vie','msg concert','madison square garden concert'] },
    { label:'Open House New York Weekend', sub:'Oct 16–18 · 300+ sites citywide', type:'event', url: p+'manhattan/index.html', keywords:['open house new york','ohny','ohny weekend','architecture tours','behind the scenes nyc'] },
    { label:'TCS New York City Marathon', sub:'Nov 1 · 50th five-borough running', type:'event', url: p+'manhattan/index.html', keywords:['nyc marathon','new york city marathon','tcs marathon','marathon sunday','central park finish'] },
    { label:"Macy's Thanksgiving Day Parade", sub:'Nov 26 · steps off W 77th & Central Park West', type:'event', url: p+'manhattan/index.html#upper-west-side', keywords:['macys parade','thanksgiving parade','thanksgiving day parade','balloons','herald square parade','100th parade'] },
    { label:'The Chicks at Beacon Theatre', sub:'Oct 10, 12 & 13 · Upper West Side', type:'event', url: p+'manhattan/index.html#upper-west-side', keywords:['the chicks','dixie chicks','taking the long way tour','beacon concert','beacon theatre concert'] },
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

    // Tree nodes first (location drill-down), then flat events/places.
    // Places are kept so individual venues — bars, music rooms, theatres —
    // are findable by name; only the ones the tree already lists are dropped,
    // so a location doesn't appear twice in the same dropdown.
    const treeNodes = searchTree(q);
    const treeUrls = new Set(treeNodes.filter(n => n.url).map(n => p + n.url));
    const flatResults = searchIndex(q).filter(r =>
      r.type === 'event' || r.type === 'sports' || !treeUrls.has(r.url)
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

// ── Live music ───────────────────────────────────────────────────────
// Venue-level live-music data, keyed by data-music-key on <body>.
//
//   nights  — the recurring pattern (what night the room books music).
//             Stable season to season; safe to leave alone.
//   acts    — bands that play the room regularly, or that it has booked.
//   dated   — specific shows with a date. THESE GO STALE. See README.
//
// Everything here was checked against the venue's own listing, the town's
// site, or a listings service (Bandsintown / JamBase / concertfix). Where a
// room's schedule couldn't be confirmed, it says so rather than guessing.

const LIVE_MUSIC = {

  // ── Long Beach Island ──────────────────────────────────────────────
  'lbi': {
    blurb: 'Music on the Island runs Memorial Day to Columbus Day, with a handful of rooms that stay open year-round. Beach Haven has the most stages; the north end runs through Surf City and Harvey Cedars.',
    venues: [
      { name: "Bird & Betty's", kind: 'Music Hall', where: 'Beach Haven', nights: 'Wed–Sun in season',
        desc: 'The Island\'s biggest booked room. See the Beach Haven guide for the full rundown.', link: 'lbi/beach-haven/index.html' },
      { name: "Joe Pop's Shore Bar", kind: 'Shore Bar', where: 'Ship Bottom', nights: 'Wed–Sat, mid-May to October',
        desc: 'The Island\'s longest-running shore bar, right at the causeway.', link: 'lbi/ship-bottom/index.html' },
      { name: 'Surf City Hotel', kind: 'Hotel Bar & Beach Club', where: 'Surf City', nights: 'Six days a week across two rooms',
        desc: 'The nightlife hub of the north end for over a century.', link: 'lbi/surf-city/index.html' },
      { name: "Nardi's Tavern", kind: 'Tavern', where: 'North Beach Haven', nights: 'Every night of the week',
        desc: 'Music seven nights — and the pink party bus that runs the Boulevard.', link: 'lbi/beach-haven/index.html' },
    ],
    series: []
  },

  'beach-haven': {
    blurb: 'The Island\'s live-music capital. A real music hall, two oceanfront tiki bars, an early-evening tavern circuit and a free town concert series — all inside about a dozen blocks.',
    venues: [
      { name: "Bird & Betty's", kind: 'Music Hall & Restaurant', addr: '529 Dock Rd', phone: '(609) 492-3000',
        nights: 'Shows Wednesday–Sunday in the warm months; closed through the winter',
        acts: ['Chevy Lopez', 'P-Funk North', 'AftershockNJ'],
        desc: 'The Jersey Shore\'s best-known waterfront music room — an actual stage, an actual sound system, and touring regional acts most nights of the summer week. This is the one to check first if you want to see a band rather than hear one.',
        cal: { href: 'https://www.birdandbettys.com/events', label: 'birdandbettys.com/events' } },

      { name: 'The Sea Shell Resort & Beach Club', kind: 'Oceanfront Tiki Bar', addr: '10 S Atlantic Ave', phone: '(609) 492-4611',
        nights: 'Live entertainment seven days in season · DJs on weekends · Thunder Thursday, 10 PM–2 AM',
        desc: 'Music outdoors every day of the season, either at the tiki bar or down by the firepits on the sand. Two tiki bars, a private beach and the only room on the Island where the stage is basically the ocean.',
        cal: { href: 'https://theseashellresort.com/events', label: 'theseashellresort.com/events' } },

      { name: 'The Marlin', kind: 'Bar & Live Music', where: 'Beach Haven',
        nights: 'Every weekend all summer',
        acts: ['Coming Alive', 'Stereo Social Club', 'Changing Lanes'],
        desc: 'A well-sized stage and a spacious dance floor — the room you end up in when you want to dance to a band instead of talk over one. Books top regional acts straight through the season.',
        cal: { href: 'https://themarlinlbi.com/marlinbar', label: 'themarlinlbi.com/marlinbar' } },

      { name: "Buckalew's Restaurant & Tavern", kind: 'Tavern', addr: '101 N Bay Ave',
        nights: 'Thursday, Friday & Saturday, 6–9 PM at the bar',
        acts: ['The Pickles', 'Rob Connolly'],
        desc: 'Early, easygoing sets right at the bar — the acoustic and duo end of the Island circuit, done before the late rooms even get going. Good first stop on a Beach Haven night.',
        cal: { href: 'https://www.buckalews.com/entertainment', label: 'buckalews.com/entertainment' } },

      { name: 'Black Whale Bar & Fish House', kind: 'Bar & Fish House', addr: '100 N Pennsylvania Ave',
        nights: 'Year-round',
        desc: 'One of the few Beach Haven rooms that keeps booking music straight through the off-season, when most of the Boulevard is shuttered.',
        cal: { href: 'https://www.blackwhalebar.com/', label: 'blackwhalebar.com' } },

      { name: "Nardi's Tavern", kind: 'Tavern & Nightclub', addr: '11801 Long Beach Blvd, North Beach Haven', phone: '(609) 492-9538',
        nights: 'Music every night · Sun–Thu at 9:30 PM, Fri & Sat at 10 PM · acoustic sets Fri & Sat from 5 PM · Dave Christopher Band Sundays at 5 PM',
        acts: ['Green Knuckle Material (Tuesdays)', 'The Pickles', 'Big Bang Baby', 'Friend Zone', 'Mike Byrne', 'Matt Pietrucha'],
        desc: 'Tavern by day, nightclub by night, and the only room on the Island with music seven nights a week — plus the pink Nardi\'s party bus running the Boulevard, which is a Long Beach Island landmark in its own right. Just north of Beach Haven proper.',
        cal: { href: 'http://www.nardistavern.com/band-schedule', label: 'nardistavern.com — band schedule' } },
    ],
    series: [
      { name: 'Concerts on the Green', who: 'Beach Haven Community Arts Program',
        when: 'Wednesdays at 7:30 PM through the summer · free',
        where: 'Veterans Bicentennial Park — rain moves it across the street to the LBI Historical Association Museum',
        acts: ['The Pickles', 'Jimmy and the Parrots', 'Rave-Ons', 'Diablo Sandwich Band', 'McLean Avenue Band', 'The Kootz', 'Carnaby Street Band', 'Suyat Band', 'Gypsy Moon'],
        note: 'Those are acts from recent seasons — the Borough posts the current lineup each spring.',
        cal: { href: 'https://beachhavencap.org/summer-concerts/', label: 'beachhavencap.org/summer-concerts' } },
    ]
  },

  'ship-bottom': {
    blurb: 'One serious room, and it happens to be the first thing you hit coming over the causeway.',
    venues: [
      { name: "Joe Pop's Shore Bar + Restaurant", kind: 'Shore Bar', where: 'Ship Bottom', phone: '(609) 494-0558',
        nights: 'Live music daily · shows Wednesday–Saturday nights, mid-May through October',
        desc: 'An Island institution and a genuine booking room — cover bands, tribute acts and regional headliners, with the deck packed from happy hour on. Closed in the dead of winter like most of the Island.',
        cal: { href: 'https://joepops.com/events', label: 'joepops.com/events' } },
    ],
    series: []
  },

  'surf-city': {
    blurb: 'The north end\'s nightlife hub, running music six days a week across two rooms in the same building.',
    venues: [
      { name: 'Surf City Hotel', kind: 'Hotel Bar & Beach Club', where: 'Surf City',
        nights: 'Bistro during dinner hours · Beach Club late night, 21+ — bands Tuesday, Friday, Saturday and select Sundays',
        acts: ['Shorty Long and the Jersey Horns'],
        desc: 'One of the oldest structures on Long Beach Island, putting people up and putting bands on for over a century. Two rooms with separate schedules, so there is something on nearly every night of the week.',
        cal: { href: 'https://surfcityhotel.com/entertainment.html', label: 'surfcityhotel.com — entertainment' } },
    ],
    series: []
  },

  'harvey-cedars': {
    blurb: 'Harvey Cedars keeps its music outdoors and free — bayfront concerts at Sunset Park, with the booked rooms a short drive in either direction.',
    venues: [
      { name: 'Sunset Park', kind: 'Bayfront Concerts', where: 'Harvey Cedars',
        nights: 'Wednesday evenings in July and early August · 6:30–8:30 PM · free',
        desc: 'Free bayfront concerts with the sunset doing most of the production work. Bring a chair. The borough posts each summer\'s lineup in the spring.',
        cal: { href: 'https://www.harveycedars.org/', label: 'harveycedars.org' } },
    ],
    series: [],
    nearest: { text: 'The Surf City Hotel is a few minutes south, and Nardi\'s runs music seven nights a week down in North Beach Haven.', href: 'lbi/surf-city/index.html' }
  },

  'barnegat-light': {
    blurb: 'The quiet end of the Island. One long-standing bar, and music when it happens rather than on a schedule.',
    venues: [
      { name: "Kubel's Bar & Restaurant", kind: 'Bar & Restaurant', addr: '28 W 7th St', phone: '(609) 494-8592',
        nights: 'Open daily from noon, year-round · happy hour 4–6 PM weekdays · music occasional, call ahead',
        desc: 'A north-end institution since long before anyone was printing schedules, and one of the few Island rooms open all year. Music turns up here, but it is not a booked room the way Beach Haven or Surf City are — worth a phone call rather than a drive.',
        cal: { href: 'https://www.kubelsbarnegatlight.com/', label: 'kubelsbarnegatlight.com' } },
    ],
    series: [],
    nearest: { text: 'For a booked room, Surf City and Harvey Cedars are both a short drive south.', href: 'lbi/surf-city/index.html' }
  },

  'holgate': {
    blurb: 'Holgate is the quiet south end — wildlife refuge, surf fishing and not much after dark by design. There are no dedicated music venues down here.',
    venues: [],
    series: [],
    nearest: { text: 'Beach Haven is about five minutes north and has the Island\'s densest run of stages.', href: 'lbi/beach-haven/index.html' }
  },

  // ── Sea Bright ────────────────────────────────────────────────────
  'sea-bright': {
    blurb: 'Sea Bright\'s music runs on the beach — an oceanfront bar with a DJ most summer weekends, and a private beach club that books bands for its members through the season.',
    venues: [
      { name: "Donovan's Reef", kind: 'Oceanfront Beach Bar', addr: '1171 Ocean Ave',
        nights: 'Live music and DJs Friday through Sunday, in season',
        desc: 'A lifeguarded private beach and bar that\'s been serving cocktails in the sand since 1976. Rebuilt after Hurricane Sandy shoved the building off its foundation, and back to running weekend music straight through summer.',
        cal: { href: 'https://www.donovansreefbeachbar.com/', label: 'donovansreefbeachbar.com' } },
      { name: 'Driftwood Cabana Club', kind: 'Beach Club', addr: '1485 Ocean Ave',
        nights: 'Live bands and themed nights through the summer season',
        desc: 'A family beach club on the ocean since 1957, with a tiki bar that books live acts alongside its Oyster Fest and grilling-competition events. Access is generally for members and their guests rather than a walk-up room.',
        cal: { href: 'https://www.driftwoodcc.com/', label: 'driftwoodcc.com' } },
    ],
    series: []
  },

  // ── Montgomery Township ──────────────────────────────────────────────
  'montgomery': {
    blurb: 'Montgomery doesn\'t run a bar-and-venue circuit the way Princeton does — its music tradition is a 130-year-old community band that still plays live, free and outdoors most of the summer.',
    venues: [
      { name: 'The Blawenburg Band', kind: 'Community Concert Band', where: 'Montgomery Township',
        nights: 'Roughly 15 outdoor concerts each summer, at parks and venues around the area',
        desc: 'Founded in the village of Blawenburg in 1890, and one of New Jersey\'s oldest continuously active community concert bands — a genuine piece of township history that still rehearses and performs today, rather than a bar act.',
        cal: { href: 'https://blawenburgband.org/performance-schedule/', label: 'blawenburgband.org/performance-schedule' } },
    ],
    series: [],
    nearest: { text: 'For an actual bar-and-stage circuit, Princeton\'s Palmer Square is about 15 minutes south.', href: 'princeton/palmer-square/index.html' }
  },

  // ── Cape May ──────────────────────────────────────────────────────
  'cape-may': {
    blurb: 'Cape May runs two different rooms — a basement pizza-and-music club with a fixed weekly schedule inside Congress Hall, and the Rusty Nail\'s indoor and outdoor stages down at the Beach Shack.',
    venues: [
      { name: 'The Boiler Room', kind: 'Music Club & Pizzeria', addr: '251 Beach Ave, Congress Hall (basement)',
        nights: 'Live music and DJs Wednesday through Saturday, 9 PM–1 AM, in season',
        desc: 'An artisan-pizza bar and lounge in the basement of Congress Hall, with a regular lineup of bands and DJs running most nights of the week through the season.',
        cal: { href: 'https://www.caperesorts.com/congress-hall/boiler-room', label: 'caperesorts.com/congress-hall/boiler-room' } },
      { name: 'Rusty Nail', kind: 'Surfer Bar', addr: '205 Beach Ave, The Beach Shack',
        nights: 'Regular live acts in season on the indoor and outdoor stages; no fixed weekly night confirmed',
        desc: 'Cape May\'s iconic surfer bar since the \'70s, wrapped around the Beach Shack motel, with local and touring acts booked through the summer.',
        cal: { href: 'https://www.caperesorts.com/beach-shack/calendar', label: 'caperesorts.com/beach-shack/calendar' } },
    ],
    series: []
  },

  // ── Manhattan ─────────────────────────────────────────────────────────
  // Verified Aug 2026 against each venue's own site plus a second source
  // (Yelp, Ticketmaster, Live Nation, or press coverage) where noted below.
  // Columbia University's Miller Theatre (Morningside Heights) turned up in
  // research but sits outside the 8 neighborhoods this page currently
  // covers — noted here rather than added as a linked entry.
  'manhattan': {
    blurb: 'Manhattan\'s music rooms are spread across the neighborhoods covered here — a Bleecker Street rock bar with a band on stage seven nights a week, a basement jazz club that\'s been open since 1935, an upscale room that helped revive New York jazz in the \'80s, a university performing-arts hall, a big-room concert venue in the East Village, the arena that hosts the Knicks, Rangers and the city\'s biggest touring concerts, a Beaux-Arts theatre on the Upper West Side, and the amateur-talent stage that launched Ella Fitzgerald. (Columbia University\'s Miller Theatre, in Morningside Heights, is a real public concert venue too, but it\'s outside the 8 neighborhoods covered on this page.)',
    venues: [
      { name: 'The Red Lion', kind: 'Live Music Bar', addr: '151 Bleecker St, Greenwich Village', phone: '(212) 260-9797',
        nights: 'Live music every night, 7 PM–4 AM · cover charge Friday, Saturday and holidays only',
        desc: 'A Bleecker Street fixture for more than 40 years — a small stage with a band on it seven nights a week, running blues, classic rock, soul, funk and covers until closing. No reservations needed for the music; walk-ins welcome.',
        cal: { href: 'https://www.redlionnyc.com/live-music/', label: 'redlionnyc.com/live-music' },
        link: 'manhattan/index.html#greenwich-village' },
      { name: 'Village Vanguard', kind: 'Jazz Club', addr: '178 Seventh Ave South, Greenwich Village',
        nights: 'Nightly sets · the Vanguard Jazz Orchestra has played every Monday since 1966',
        acts: ['Vanguard Jazz Orchestra', 'touring jazz headliners'],
        desc: 'The oldest operating jazz club in New York City, running in the same basement room since 1935. Bill Evans and John Coltrane both recorded their most famous live albums here.',
        cal: { href: 'https://villagevanguard.com/', label: 'villagevanguard.com' },
        link: 'manhattan/index.html#greenwich-village' },
      { name: 'Blue Note', kind: 'Jazz Club', addr: '131 W 3rd St, Greenwich Village',
        nights: 'Sets nightly, typically two shows a night',
        desc: 'Opened in 1981 and credited with reviving New York\'s jazz-club scene — an intimate, upscale room that\'s hosted Dizzy Gillespie, Chick Corea and Wynton Marsalis.',
        cal: { href: 'https://www.bluenotejazz.com/nyc/', label: 'bluenotejazz.com/nyc' },
        link: 'manhattan/index.html#greenwich-village' },
      { name: 'NYU Skirball Center for the Performing Arts', kind: 'University Performing Arts Center', addr: '566 LaGuardia Pl, Greenwich Village',
        nights: 'Two curated seasons of ticketed shows a year, running fall through spring',
        desc: 'NYU\'s 850-seat theater near Washington Square Park, booking music, dance, theater and comedy for both the university and the neighborhood — not a student-only stage.',
        cal: { href: 'https://nyuskirball.org/events/', label: 'nyuskirball.org/events' },
        link: 'manhattan/index.html#greenwich-village' },
      { name: 'Webster Hall', kind: 'Concert Venue', addr: '125 E 11th St, East Village',
        nights: 'Touring acts and club nights most nights of the week',
        desc: 'A four-story, 2,500-capacity room with a Grand Ballroom and several smaller stages — one of downtown\'s biggest bookings for touring artists.',
        cal: { href: 'https://www.websterhall.com/calendar', label: 'websterhall.com/calendar' },
        link: 'manhattan/index.html#east-village' },
      { name: 'Madison Square Garden', kind: 'Arena', addr: '4 Pennsylvania Plaza, Chelsea',
        nights: 'Year-round — Knicks and Rangers home games plus touring concerts most weeks',
        desc: 'The city\'s marquee arena, 4 Pennsylvania Plaza above Penn Station — home to the Knicks and Rangers and a regular stop for the biggest touring acts. Falls just inside the Chelsea neighborhood boundary used on this site.',
        dated: [
          { date: 'Sep 29, 2026', act: 'Gorillaz — The Mountain Tour, with Little Simz & Deltron 3030' },
          { date: 'Dec 1, 2026', act: 'Doja Cat — Tour Ma Vie World Tour, with Latto' },
        ],
        cal: { href: 'https://www.msg.com/madison-square-garden', label: 'msg.com/madison-square-garden' },
        link: 'manhattan/index.html#chelsea' },
      { name: 'Beacon Theatre', kind: 'Theatre', addr: '2124 Broadway, Upper West Side',
        nights: 'Touring concerts several nights most weeks, year-round',
        desc: 'A 2,894-seat Beaux-Arts movie palace from 1929, now a National Historic Landmark and one of the city\'s best-loved mid-size concert rooms — operated by the same company that runs Madison Square Garden.',
        dated: [
          { date: 'Sep 29–30, 2026', act: 'Tom Jones — Come Gather Round Tour' },
          { date: 'Oct 10, 12 & 13, 2026', act: 'The Chicks — Taking the Long Way 20th Anniversary Tour' },
        ],
        cal: { href: 'https://www.msg.com/beacon-theatre', label: 'msg.com/beacon-theatre' },
        link: 'manhattan/index.html#upper-west-side' },
      { name: 'Apollo Theater', kind: 'Historic Theater', addr: '253 W 125th St, Harlem',
        nights: 'Historic theater closed for renovation · programming continues at the Apollo Stages at the Victoria, 233 W 125th St',
        desc: 'Opened in 1934; Amateur Night has launched acts from Ella Fitzgerald to Lauryn Hill. The historic theater is mid-renovation and Amateur Night is paused until it reopens — in the meantime the Apollo runs shows and events at its Apollo Stages at the Victoria, a block down 125th Street.',
        cal: { href: 'https://www.apollotheater.org/calendar/', label: 'apollotheater.org/calendar' },
        link: 'manhattan/index.html#harlem' },
    ],
    series: []
  },

  // ── Stamford ───────────────────────────────────────────────────────
  'stamford': {
    blurb: 'Stamford\'s music splits three ways: the bar circuit downtown, the summer waterfront programming at Harbor Point, and touring acts at the Palace. Note that Alive@Five — the summer series that ran downtown for 27 years — has ended; what replaced it is spread across Mill River Park, Harbor Point and the arboretum.',
    venues: [
      { name: "Tiernan's Bar & Restaurant", kind: 'Bar & Live Music', addr: '187 Main St', phone: '(203) 353-8566',
        nights: 'Bands every Friday & Saturday, 9:30 PM unless noted · Trivia with MC Caitlin, Wednesdays 7:30 PM',
        desc: 'The anchor of the downtown bar scene and the most dependable place in Stamford to find a band on a weekend night. Doors stay open late.',
        cal: { href: 'https://www.tiernansbar.com/happenings', label: 'tiernansbar.com/happenings' },
        link: 'stamford/downtown/index.html' },
      { name: 'The Palace Theatre', kind: 'Theatre', where: 'Downtown · 61 Atlantic St',
        nights: 'Touring shows year-round',
        desc: 'Stamford Center for the Arts\' main room — touring music, comedy and theatre. Diana Ross played here in August.',
        cal: { href: 'https://palacestamford.org', label: 'palacestamford.org' },
        link: 'stamford/downtown/index.html' },
      { name: "Casey's Tavern", kind: 'Neighborhood Bar', addr: '85 Woodside St', phone: '(203) 363-0804',
        nights: 'Open mic Thursdays · Karaoke Sundays, 9 PM',
        desc: 'An Irish pub off the downtown grid that consistently turns up on Stamford\'s live-music lists. Not a booking room — an open-mic-and-karaoke room, which is its own thing. No website of its own; the Facebook page is where anything gets posted.',
        cal: { href: 'https://www.facebook.com/caseys.stamford/', label: 'facebook.com/caseys.stamford' } },
      { name: 'Harbor Point', kind: 'Waterfront Series', where: 'South End',
        nights: 'Five nights a week through the summer',
        desc: 'The largest single piece of what replaced Alive@Five — free walk-up entertainment on the waterfront most weeknights in season.',
        link: 'stamford/harbor-point/index.html' },
    ],
    series: [
      { name: 'Summer in the Park', who: 'Hey Stamford!, Mill River Park, Parachute Concerts, Stamford Downtown and The Karp Family',
        when: 'Three concert weekends · July 16 – August 2 in 2026', where: 'Mill River Park, downtown',
        acts: ['DaBaby', 'Fat Joe', 'Remy Ma', 'Two Friends', 'Ja Rule', 'Ashanti', 'Jowell & Randy', 'Grupo Niche'],
        note: 'Introduced in June 2026 as part of the programming that succeeded Alive@Five. Those were the 2026 headliners — next summer\'s lineup posts in the spring.',
        cal: { href: 'https://summerinthepark.com/info/', label: 'summerinthepark.com' } },
    ]
  },

  'stamford-downtown': {
    blurb: 'The densest run of rooms in the city — a weekend band bar, a 1,580-seat theatre and a pub circuit, all walkable from Atlantic and Main.',
    venues: [
      { name: "Tiernan's Bar & Restaurant", kind: 'Bar & Live Music', addr: '187 Main St', phone: '(203) 353-8566',
        nights: 'Bands every Friday & Saturday, 9:30 PM unless noted · Trivia with MC Caitlin, Wednesdays 7:30 PM',
        desc: 'The anchor of downtown\'s bar scene: a proper weekend band bar with a deep draft list and a crowd that runs from happy-hour suits to late-night regulars. Bands start at 9:30 unless the room says otherwise.',
        cal: { href: 'https://www.tiernansbar.com/happenings', label: 'tiernansbar.com/happenings' } },

      { name: 'The Palace Theatre', kind: 'Theatre', addr: '61 Atlantic St',
        nights: 'Touring shows year-round',
        desc: 'The Stamford Center for the Arts\' main stage — the room that gets the touring names. Diana Ross played here in August; the season runs music, comedy and theatre straight through the winter.',
        cal: { href: 'https://palacestamford.org', label: 'palacestamford.org' } },

      { name: 'Tigin Irish Pub', kind: 'Irish Pub', addr: '175 Bedford St', phone: '(475) 212-6044',
        nights: 'Pub Quiz Tuesdays at 8 PM · live bands on select weekends · opens early weekends for Premier League',
        desc: 'Whiskey list, big beer selection, and music mixed in among the trivia and the game-night crowd. Reliable rather than headline-driven.',
        cal: { href: 'https://tiginirishpub.com/', label: 'tiginirishpub.com' } },
    ],
    series: [
      { name: 'Summer in the Park', who: 'Hey Stamford!, Mill River Park, Parachute Concerts, Stamford Downtown and The Karp Family',
        when: 'Three concert weekends · July 16 – August 2 in 2026', where: 'Mill River Park, downtown',
        acts: ['DaBaby', 'Fat Joe', 'Remy Ma', 'Two Friends', 'Ja Rule', 'Ashanti', 'Jowell & Randy', 'Grupo Niche'],
        note: 'Alive@Five ran downtown for 27 years and has now ended. This is the series that took its place, alongside the Harbor Point weeknights and a quieter run of concerts in the arboretum.',
        cal: { href: 'https://summerinthepark.com/info/', label: 'summerinthepark.com' } },
    ]
  },

  'harbor-point': {
    blurb: 'The waterfront is where most of Stamford\'s free summer music moved after Alive@Five wound down — five nights a week of it, walk-up, no ticket.',
    venues: [
      { name: 'Harbor Point Summer Programming', kind: 'Waterfront Series', where: 'Harbor Point Square',
        nights: 'Five nights a week through the summer · free live music Tuesday evenings on the waterfront',
        desc: 'The biggest share of the programming that replaced Alive@Five: live entertainment on the waterfront most weeknights in season, free and walk-up, alongside movies in the park, outdoor fitness and the farmers market.',
        cal: { href: 'https://bltliveworkplay.com/apartments/stamford/harbor-point/events/', label: 'harbor point — events calendar' } },
      { name: 'Sign of the Whale', kind: 'Bar & Rooftop', addr: '6 Harbor Point Rd',
        desc: 'A 5,000-square-foot rooftop looking out over Long Island Sound, above an equally large dining room. Live bands, rooftop parties, trivia — the anchor of the Harbor Point night.',
        cal: { href: 'https://www.signofthewhalect.com/whats-goin-on', label: "signofthewhalect.com — what's goin' on" } },
      { name: "Half Full Brewery — Third Place", kind: 'Taproom & Beer Garden', where: 'Stamford',
        nights: 'Live music through the summer',
        desc: 'Part taproom, part coworking, part event space, with a relaxed beer garden that runs live music, lawn games and one-off events across the warm months.',
        cal: { href: 'https://halffullbrewery.com/event-type/live-music/', label: 'halffullbrewery.com' } },
    ],
    series: []
  },

  'shippan-point': {
    blurb: 'Shippan is residential, but the office park on Harbor Drive turns into one of the better casual music spots in the city in season.',
    venues: [
      { name: 'The Beer Garden at Shippan Landing', kind: 'Beer Garden', addr: '290 Harbor Dr',
        nights: 'Wed–Fri 4 PM–midnight · Sat noon–midnight · Sun noon–9 PM, in season',
        desc: 'Seventeen waterfront acres of office park that open up to a rotating craft beer roster, food trucks and live music. Genuinely pleasant, and almost nobody outside Stamford knows it is there.',
        cal: { href: 'https://www.beeratthelanding.com/', label: 'beeratthelanding.com' } },
    ],
    series: [],
    nearest: { text: 'For a booked band on a weekend night, downtown is ten minutes north.', href: 'stamford/downtown/index.html' }
  },

  'waterside': {
    blurb: 'Waterside sits between the South End and Shippan, so its music is really its neighbours\' — the brewery scene on one side, the waterfront series on the other.',
    venues: [
      { name: "Half Full Brewery — Third Place", kind: 'Taproom & Beer Garden', where: 'Stamford',
        nights: 'Live music through the summer',
        desc: 'Taproom, coworking space and beer garden in one, with live music and lawn games across the warm months.',
        cal: { href: 'https://halffullbrewery.com/event-type/live-music/', label: 'halffullbrewery.com' } },
    ],
    series: [],
    nearest: { text: 'Harbor Point runs free waterfront music five nights a week in season, a few minutes away.', href: 'stamford/harbor-point/index.html' }
  },

  'north-stamford': {
    blurb: 'North Stamford is woods and stone walls, not stages — but the arboretum runs the quietest and arguably nicest concert series in the city.',
    venues: [
      { name: 'Bartlett Arboretum & Gardens', kind: 'Outdoor Concerts', where: 'North Stamford',
        nights: 'Summer Concert Series — select Sundays, 5–7 PM on the Great Lawn',
        desc: 'One of the three strands of programming that succeeded Alive@Five — a deliberately quieter concert series among the gardens, a world away from a downtown bar on a Saturday. $5 members, $10 non-members, free for under-12s. The Honey Harvest Festival runs the same lawn in late August.',
        cal: { href: 'https://www.bartlettarboretum.org/events', label: 'bartlettarboretum.org/events' } },
    ],
    series: [],
    nearest: { text: 'The nearest booked rooms are downtown, about fifteen minutes south.', href: 'stamford/downtown/index.html' }
  },

  'cove': {
    blurb: 'Cove and the East Side are residential — beach, park and neighborhood restaurants rather than stages.',
    venues: [],
    series: [],
    nearest: { text: 'Downtown and Harbor Point have the city\'s live music, both under ten minutes away.', href: 'stamford/downtown/index.html' }
  },

  'glenbrook': {
    blurb: 'Glenbrook is a neighborhood of corner restaurants and the train station — no dedicated music rooms.',
    venues: [],
    series: [],
    nearest: { text: 'Downtown is one stop away on the New Canaan branch, and has the bands.', href: 'stamford/downtown/index.html' }
  },

  'springdale': {
    blurb: 'Springdale is quiet by design — family restaurants and the Hope Street strip, not a nightlife district.',
    venues: [],
    series: [],
    nearest: { text: 'For live music, head downtown or to Harbor Point.', href: 'stamford/downtown/index.html' }
  },

  // ── Lubbock ────────────────────────────────────────────────────────
  'lubbock': {
    blurb: 'Buddy Holly\'s hometown still books like it. The Depot District is the center of gravity — songwriter rooms, a restored 1938 theater and an outdoor stage — with a rock club on 50th Street, an outdoor amphitheatre on the south side, and the arena and the performing arts hall handling the big touring nights.',
    venues: [
      { name: 'The Blue Light Live', kind: 'Listening Room', addr: '1806 Buddy Holly Ave',
        acts: ['The Droptines', 'Parker Ryan', 'Scott Allison'],
        desc: 'The heart of the Texas country and red dirt scene in Lubbock.', link: 'lubbock/depot-district/index.html' },
      { name: 'Cactus Theater', kind: 'Historic Theater', addr: '1812 Buddy Holly Ave',
        desc: 'Restored 1938 movie house across from Blue Light — live music, tribute shows and classic cinema.', link: 'lubbock/depot-district/index.html' },
      { name: 'The Garden', kind: 'Outdoor Venue', addr: '1801 Buddy Holly Ave',
        desc: 'String-lit outdoor bar with live music on weekends and rotating food trucks.', link: 'lubbock/depot-district/index.html' },
      { name: "Jake's Backroom", kind: 'Rock Club', addr: '5025 50th St',
        acts: ['Mirrorcell', 'What Lies Below', 'What The Dance'],
        desc: 'The loud end of town — rock, metal and touring package shows, out on 50th Street.', link: 'lubbock/index.html' },
      { name: "Cook's Garage", kind: 'Outdoor Venue', where: 'Lubbock',
        desc: 'Part garage, part beer hall, part outdoor amphitheatre.', link: 'lubbock/depot-district/index.html' },
      { name: 'The Buddy Holly Hall of Performing Arts and Sciences', kind: 'Performing Arts Hall', where: 'Historic District',
        desc: 'The city\'s flagship hall, named for the man himself.', link: 'lubbock/historic-district/index.html' },
    ],
    series: []
  },

  'depot-district': {
    blurb: 'Four blocks of warehouses off Buddy Holly Avenue doing what they have done since the Seventies: putting Texas songwriters on small stages most nights of the week.',
    venues: [
      { name: 'The Blue Light Live', kind: 'Listening Room', addr: '1806 Buddy Holly Ave', phone: '(806) 762-1185',
        nights: 'Weekly songwriter nights, plus album releases and touring bills',
        acts: ['The Droptines', 'Parker Ryan', 'Scott Allison'],
        desc: 'A legendary West Texas listening room and honky-tonk anchoring the Depot District — red dirt, Texas country, and a long history of acts playing here on the way up. If you only get one Depot District night, spend it here.',
        cal: { href: 'https://www.bandsintown.com/v/10003090-the-bluelight-live', label: 'bandsintown.com — The Bluelight Live' } },

      { name: 'Cactus Theater', kind: 'Historic Theater', addr: '1812 Buddy Holly Ave', phone: '(806) 762-3233',
        nights: 'Live music, tribute shows, musicals and a classic cinema series year-round',
        desc: 'A restored 1938 movie house directly across Buddy Holly Avenue from Blue Light — the seated, all-ages end of a Depot District night.',
        cal: { href: 'https://www.cactustheater.com', label: 'cactustheater.com' } },

      { name: 'The Garden', kind: 'Outdoor Venue', addr: '1801 Buddy Holly Ave', phone: '(806) 407-3636',
        nights: 'Live music Friday and Saturday nights',
        desc: 'String-lit outdoor bar and stage with yard games, rotating food trucks and a pet-friendly patio — the open-air room of the Depot District.' },

      { name: "Jake's Backroom", kind: 'Rock Club', addr: '5025 50th St, Lubbock',
        acts: ['Mirrorcell', 'What Lies Below', 'What The Dance'],
        desc: 'Sports cafe out front, live room in back, out on 50th Street rather than in the Depot itself. Where the rock, metal and hardcore touring packages land when they come through West Texas.',
        cal: { href: "https://www.bandsintown.com/v/10034987-jake's-backroom", label: "bandsintown.com — Jake's Backroom" } },

      { name: "Cook's Garage", kind: 'Outdoor Venue', addr: '11002 US-87, Lubbock',
        desc: 'Vintage garage, beer hall and outdoor stage south of the city — the room that gets the bigger country bills that will not fit in a Depot District bar.',
        dated: [
          { date: 'Sep 10, 2026', act: 'Kaitlin Butts' },
          { date: 'Sep 25, 2026', act: 'Pat Green, with The Castellows' },
          { date: 'Oct 30, 2026', act: 'Koe Wetzel' },
        ],
        cal: { href: 'https://www.cooksgarage.com/calendar', label: "cooksgarage.com — calendar" } },
    ],
    series: []
  },

  'tech-district': {
    blurb: 'The Strip runs on Texas Tech\'s calendar — game-day bars and student rooms rather than booked stages, with the arena handling the arena-sized nights.',
    venues: [
      { name: 'United Supermarkets Arena', kind: 'Arena', where: 'Texas Tech Campus',
        desc: 'Where the touring names play when they come to Lubbock — 15,300 seats on the Texas Tech campus, sharing a calendar with Red Raider basketball.',
        cal: { href: 'https://www.unitedssa.com', label: 'unitedssa.com' } },
    ],
    series: [],
    nearest: { text: 'The Depot District is five minutes north and is where the bands actually are most nights.', href: 'lubbock/depot-district/index.html' }
  },

  'historic-district': {
    blurb: 'Downtown Lubbock\'s music is anchored by one very serious building.',
    venues: [
      { name: 'The Buddy Holly Hall of Performing Arts and Sciences', kind: 'Performing Arts Hall', where: 'Downtown Lubbock',
        desc: 'The city\'s flagship performing arts complex, opened in 2021 and named for Lubbock\'s most famous son. Touring concerts, comedy, Broadway and community programming across two halls.',
        dated: [
          { date: 'Sep 19, 2026', act: 'Randy Rogers Band, with Hank Weaver' },
          { date: 'Nov 20–22, 2026', act: 'Waitress — Broadway at Buddy Holly Hall season opener' },
        ],
        cal: { href: 'https://buddyhollyhall.org/events-tickets/', label: 'buddyhollyhall.org — events & tickets' } },
    ],
    series: [],
    nearest: { text: 'For bar-sized rooms and local bills, the Depot District is a few blocks away.', href: 'lubbock/depot-district/index.html' }
  },

  // ── Princeton ──────────────────────────────────────────────────────
  'princeton': {
    blurb: 'Princeton\'s music runs on two tracks that barely touch: a small, stubborn bar circuit that plays local bands until 2 AM, and one of the best university concert series in the country, four blocks away.',
    venues: [
      { name: 'The Alchemist & Barrister', kind: 'Tavern', addr: '28 Witherspoon St',
        nights: 'Live local bands Wednesday, Thursday & Sunday',
        desc: 'The "Cheers of Princeton" — a landmark in a historic building off Palmer Square, and the most consistent place in town to catch a local band.',
        link: 'princeton/palmer-square/index.html' },
      { name: 'Triumph Brewing Company', kind: 'Brewpub', where: '20 Palmer Square E',
        nights: 'Rotating calendar through the week',
        desc: 'Palmer Square brewpub with a busy bar and a rotating live-music calendar.',
        link: 'princeton/palmer-square/index.html' },
      { name: 'Ivy Inn', kind: 'Dive Bar', where: 'Princeton',
        nights: 'Occasional — open until 2 AM',
        desc: 'Pool tables, cheap drinks, no pretension, and music when it turns up.' },
      { name: 'Richardson Auditorium in Alexander Hall', kind: 'Concert Hall', addr: '68 Nassau St',
        desc: 'Princeton University Concerts and the New Jersey Symphony — chamber music at an international level.',
        link: 'princeton/university/index.html' },
      { name: 'McCarter Theatre Center', kind: 'Theatre', addr: '91 University Pl',
        desc: 'Music, plays, ballet, circus and cabaret on a year-round schedule.',
        link: 'princeton/university/index.html' },
    ],
    series: []
  },

  'palmer-square': {
    blurb: 'Three of the four Princeton bars licensed to serve until 2 AM are within a two-minute walk of each other here — and two of them book bands.',
    venues: [
      { name: 'The Alchemist & Barrister', kind: 'Tavern', addr: '28 Witherspoon St',
        nights: 'Local bands Thursday 10 PM–1 AM and Sunday 9:30–11:30 PM · open mic Wednesday 10 PM–1 AM',
        desc: 'Known around town as the "Cheers of Princeton" — a landmark tavern in a historic building at the heart of downtown, open since 1974, with a dependable midweek run of local bands. One of the handful of Princeton bars that can stay open until 2 AM.',
        cal: { href: 'http://www.theaandb.com/local-events.html', label: 'theaandb.com — local events' } },

      { name: 'Triumph Brewing Company', kind: 'Brewpub', addr: '20 Palmer Square E',
        nights: 'Rotating live-music calendar through the week',
        desc: 'A Palmer Square microbrewery with a genuinely busy bar — students, locals and the corporate crowd in the same room — and music spread through the week rather than parked on the weekend. Also open until 2 AM.',
        cal: { href: 'https://www.triumphbrewing.com/princeton/', label: 'triumphbrewing.com/princeton' } },

      { name: 'Ivy Inn', kind: 'Dive Bar', where: 'Princeton',
        nights: 'Occasional live music · open until 2 AM',
        desc: 'A proper dive: pool tables, cheap drinks, friendly bartenders and music that turns up without much warning. The third of the late-license bars, and the least polished, which is the point. No published calendar — this one you walk past and look in.' },
    ],
    series: []
  },

  'university': {
    blurb: 'The University runs one of the most ambitious concert series of any American campus, and it is open to the town — most of it inside Alexander Hall.',
    venues: [
      { name: 'Richardson Auditorium in Alexander Hall', kind: 'Concert Hall', addr: '68 Nassau St',
        desc: 'Princeton University Concerts\' home room, and where the New Jersey Symphony plays its Princeton dates. The 2026–27 Concert Classics season brings the Brentano, Ébène and Danish String Quartets, cellist Jean-Guihen Queyras with pianist Alexandre Tharaud, violinist Nemanja Radulović with Double Sens, soprano Asmik Grigorian with Lukas Geniušas, pianist Stephen Hough, and a trio of Hilary Hahn, Sheku Kanneh-Mason and Benjamin Grosvenor.',
        acts: ['Brentano String Quartet', 'Danish String Quartet', 'Stephen Hough', 'Hilary Hahn'],
        cal: { href: 'https://concerts.princeton.edu/', label: 'concerts.princeton.edu' } },

      { name: 'Performances Up Close', kind: 'Concert Series', where: 'Alexander Hall',
        desc: 'The University\'s on-stage series — hour-long informal concerts played twice in an evening with the audience seated on the stage. This season: the Sandeep Das Trio, mezzo-soprano Ema Nikolovska with guitarist Sean Shibe, pianist Tony Siqi Yun, the Junction Trio, and violinist Isabelle Faust with harpsichordist Kristian Bezuidenhout.',
        cal: { href: 'https://concerts.princeton.edu/upcoming-season/', label: 'concerts.princeton.edu — season' } },

      { name: 'McCarter Theatre Center', kind: 'Theatre', addr: '91 University Pl', phone: '(609) 258-2787',
        desc: 'The town\'s big year-round house — a nationally regarded independent performing arts center running music alongside theater, dance and spoken word. Programs independently of the University concert series, so it is worth checking both calendars.',
        cal: { href: 'https://www.mccarter.org/events', label: 'mccarter.org/events' } },
    ],
    series: []
  },

  'witherspoon-jackson': {
    blurb: 'Princeton\'s historic Black neighborhood, and the reason the Witherspoon Street corridor sounds the way it does — church music here predates every bar in town by a century.',
    venues: [
      { name: 'Witherspoon Street Presbyterian Church', kind: 'Historic Congregation', where: 'Witherspoon Street',
        desc: 'One of New Jersey\'s oldest Black congregations and the anchor of the neighborhood\'s musical life. Services and programs rather than a booked stage — but this is the oldest continuous music tradition in Princeton.' },
    ],
    series: [],
    nearest: { text: 'The Alchemist & Barrister sits at the bottom of Witherspoon Street, a few minutes\' walk toward Palmer Square.', href: 'princeton/palmer-square/index.html' }
  },

  'western-section': {
    blurb: 'Big houses, historic gardens and the Battlefield. No bars, no stages — this end of Princeton is for daylight.',
    venues: [],
    series: [],
    nearest: { text: 'Palmer Square is a ten-minute walk east and has the town\'s late-night rooms.', href: 'princeton/palmer-square/index.html' }
  },
};

// Renders the live-music section on any page carrying <body data-music-key="…">
// and an empty <section id="live-music"> to drop it into.
function initLiveMusic() {
  const key = document.body.getAttribute('data-music-key');
  const host = document.getElementById('live-music');
  if (!key || !host) return;

  const data = LIVE_MUSIC[key];
  if (!data) return;

  const p = rootPrefix();

  const venueCards = (data.venues || []).map(v => {
    const meta = [v.addr || v.where, v.phone].filter(Boolean).join(' · ');
    const nights = v.nights ? `<p class="music-nights"><span>♪</span> ${v.nights}</p>` : '';
    const acts = (v.acts && v.acts.length)
      ? `<p class="music-acts"><strong>Regulars:</strong> ${v.acts.join(' · ')}</p>` : '';
    const dated = (v.dated && v.dated.length)
      ? `<ul class="music-dated">${v.dated.map(d =>
          `<li><span class="music-date">${d.date}</span> ${d.act}</li>`).join('')}</ul>` : '';
    const cal = v.cal
      ? `<a class="music-cal" href="${v.cal.href}" target="_blank" rel="noopener">${v.cal.label} →</a>` : '';
    const more = v.link
      ? `<a class="music-cal" href="${p}${v.link}">Full guide →</a>` : '';
    return `
      <div class="music-card animate-in">
        <div class="music-card-head">
          <h3 class="music-name">${v.name}</h3>
          <span class="music-kind">${v.kind}</span>
        </div>
        ${meta ? `<p class="music-meta">📍 ${meta}</p>` : ''}
        ${nights}
        <p class="music-desc">${v.desc}</p>
        ${acts}
        ${dated}
        <div class="music-links">${cal}${more}</div>
      </div>`;
  }).join('');

  const seriesCards = (data.series || []).map(s => `
    <div class="music-series animate-in">
      <div class="music-series-tag">Free Series</div>
      <h3 class="music-name">${s.name}</h3>
      ${s.who ? `<p class="music-meta">Presented by ${s.who}</p>` : ''}
      ${s.when ? `<p class="music-nights"><span>♪</span> ${s.when}</p>` : ''}
      ${s.where ? `<p class="music-desc">${s.where}</p>` : ''}
      ${s.acts ? `<p class="music-acts"><strong>Recent lineups:</strong> ${s.acts.join(' · ')}</p>` : ''}
      ${s.note ? `<p class="music-note">${s.note}</p>` : ''}
      ${s.cal ? `<div class="music-links"><a class="music-cal" href="${s.cal.href}" target="_blank" rel="noopener">${s.cal.label} →</a></div>` : ''}
    </div>`).join('');

  const nearest = data.nearest
    ? `<p class="music-nearest">↗ <a href="${p}${data.nearest.href}">${data.nearest.text}</a></p>` : '';

  host.innerHTML = `
    <div class="section-label">Who's Playing</div>
    <h2 class="section-title">Live Music</h2>
    <hr class="section-divider" />
    <p class="music-blurb">${data.blurb}</p>
    ${venueCards ? `<div class="music-grid">${venueCards}</div>` : ''}
    ${seriesCards ? `<div class="music-grid music-grid-series">${seriesCards}</div>` : ''}
    ${nearest}`;
}

// ── Persistent side panel (non-home pages) ──────────────────────────
// Reads data-page-location from <body>, builds the panel HTML, injects
// it into the page, and shifts .page-wrap right by 320px.

const PANEL_EVENTS = {
  default: {
    label: 'Happening Now',
    link: null,
    events: [
      { mo:'AUG', dy:'29', tag:'events',   tagLabel:'Beer & Wine',name:'Beer, Wine & Spirits Fest',   meta:'Mill River Park · Stamford, CT · 1–4:30 PM', url:'stamford/downtown/index.html',   ticket:'https://www.beerwinespiritsfest.com/stamford' },
      { mo:'NOV', dy:'22', tag:'events',   tagLabel:'Parade',     name:'Stamford Downtown Parade Spectacular', meta:'Downtown Stamford · giant balloons', url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SEP', dy:'5',  tag:'events',   tagLabel:'Football',   name:'TTU Football Season Opener',  meta:'vs Abilene Christian · Jones AT&T Stadium · Lubbock, TX', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SEP', dy:'7',  tag:'arts',     tagLabel:'Free Event', name:'Buddy Holly 90th Birthday Bash', meta:'Buddy Holly Center · Lubbock, TX',  url:'lubbock/depot-district/index.html',    ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'19', tag:'arts',     tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · Stamford, CT',        url:'stamford/downtown/index.html',         ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'TBD',tag:'events',   tagLabel:'Festival',   name:"That's Amore Italian Fest",   meta:'Mill River Park · Stamford, CT · 2026 dates TBA', url:'stamford/downtown/index.html', ticket:'https://thatsamorefest.com' },
      { mo:'OCT', dy:'17', tag:'events',   tagLabel:'Homecoming', name:'Texas Tech Homecoming',       meta:'vs Arizona State · Jones AT&T Stadium · Lubbock', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'OCT', dy:'31', tag:'events',   tagLabel:'Parade',     name:'Village Halloween Parade',    meta:'Sixth Ave · Greenwich Village, NYC · 7 PM', url:'manhattan/index.html#greenwich-village', ticket:'https://halloween-nyc.com' },
      { mo:'NOV', dy:'1',  tag:'outdoors', tagLabel:'Race',       name:'TCS New York City Marathon',  meta:'50th five-borough running · NYC',      url:'manhattan/index.html',                 ticket:'https://www.nyrr.org' },
      { mo:'NOV', dy:'2',  tag:'events',   tagLabel:'Basketball', name:'TTU Basketball Opener',       meta:'vs Jackson State · United Supermarkets Arena · Lubbock', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/mens-basketball/schedule' },
      { mo:'NOV', dy:'26', tag:'events',   tagLabel:'Football',   name:'TTU vs. TCU — Thanksgiving',  meta:'Jones AT&T Stadium · Lubbock, TX · 8 PM', url:'lubbock/tech-district/index.html',  ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SAT', dy:'WKL',tag:'outdoors', tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Veterans Memorial Park · Stamford, CT',url:'stamford/index.html',                  ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  Connecticut: {
    label: 'Connecticut Events',
    link: { href: 'connecticut/index.html', text: 'Connecticut Guide →' },
    events: [
      { mo:'AUG', dy:'29', tag:'events', tagLabel:'Beer & Wine',name:'Beer, Wine & Spirits Fest',   meta:'Mill River Park · 1–4:30 PM',    url:'stamford/downtown/index.html', ticket:'https://www.beerwinespiritsfest.com/stamford' },
      { mo:'AUG', dy:'30', tag:'outdoors',tagLabel:'Festival', name:'Honey Harvest Festival',      meta:'Bartlett Arboretum · 11 AM–4 PM',url:'stamford/north-stamford/index.html', ticket:'https://www.bartlettarboretum.org/events' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',   name:'Labyrinth in Concert',        meta:'Palace Theatre · Stamford, CT · 7:30 PM', url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'2',  tag:'arts',   tagLabel:'Tribute',   name:"Stayin' Alive — Bee Gees Tribute", meta:'Palace Theatre · 8 PM',     url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'TBD',tag:'events', tagLabel:'Festival',  name:"That's Amore Italian Fest",   meta:'Mill River Park · 2026 dates TBA', url:'stamford/downtown/index.html', ticket:'https://thatsamorefest.com' },
      { mo:'NOV', dy:'22', tag:'events', tagLabel:'Parade',    name:'Stamford Downtown Parade Spectacular', meta:'Downtown Stamford',     url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
    ]
  },
  Stamford: {
    label: 'Stamford Events',
    link: { href: 'stamford/index.html', text: 'Full Stamford Guide →' },
    events: [
      { mo:'AUG', dy:'29', tag:'events',  tagLabel:'Beer & Wine',name:'Beer, Wine & Spirits Fest',  meta:'Mill River Park · 1–4:30 PM',        url:'stamford/downtown/index.html', ticket:'https://www.beerwinespiritsfest.com/stamford' },
      { mo:'AUG', dy:'30', tag:'outdoors',tagLabel:'Festival',   name:'Honey Harvest Festival',      meta:'Bartlett Arboretum · 11 AM–4 PM',   url:'stamford/north-stamford/index.html', ticket:'https://www.bartlettarboretum.org/events' },
      { mo:'SEP', dy:'4',  tag:'arts',    tagLabel:'Concert',    name:'Jesse McCartney — Weightless Tour', meta:'Palace Theatre',              url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'SEP', dy:'19', tag:'arts',    tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 7:30 PM',          url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'2',  tag:'arts',    tagLabel:'Tribute',    name:"Stayin' Alive — Bee Gees Tribute", meta:'Palace Theatre · 8 PM',        url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'TBD',tag:'events',  tagLabel:'Festival',   name:"That's Amore Italian Fest",   meta:'Mill River Park · 2026 dates TBA',  url:'stamford/downtown/index.html', ticket:'https://thatsamorefest.com' },
      { mo:'NOV', dy:'22', tag:'events',  tagLabel:'Parade',     name:'Stamford Downtown Parade Spectacular', meta:'Downtown · Sun before Thanksgiving', url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Veterans Memorial Park · 9 AM–1 PM · thru Oct 10', url:'stamford/index.html', ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  Downtown: {
    label: 'Downtown Stamford Events',
    link: { href: 'stamford/downtown/index.html', text: 'Full Downtown Guide →' },
    events: [
      { mo:'AUG', dy:'29', tag:'events',  tagLabel:'Beer & Wine',name:'Beer, Wine & Spirits Fest',   meta:'Mill River Park · 1–4:30 PM',  url:'stamford/downtown/index.html', ticket:'https://www.beerwinespiritsfest.com/stamford' },
      { mo:'SEP', dy:'19', tag:'arts',    tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 7:30 PM',     url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'2',  tag:'arts',    tagLabel:'Tribute',    name:"Stayin' Alive — Bee Gees Tribute", meta:'Palace Theatre · 8 PM',   url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'30', tag:'arts',    tagLabel:'Concert',    name:'America — The Happy Trails Tour', meta:'Palace Theatre · 7 PM',    url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'TBD',tag:'events',  tagLabel:'Festival',   name:"That's Amore Italian Fest",   meta:'Mill River Park · 2026 dates TBA', url:'stamford/downtown/index.html', ticket:'https://thatsamorefest.com' },
      { mo:'NOV', dy:'22', tag:'events',  tagLabel:'Parade',     name:'Stamford Downtown Parade Spectacular', meta:'Downtown · Sun before Thanksgiving', url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',     name:'Downtown Farmers Market',     meta:'Veterans Memorial Park · 9 AM–1 PM · thru Oct 10', url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com/markets' },
    ]
  },
  'Harbor Point': {
    label: 'Harbor Point Events', link: { href: 'stamford/harbor-point/index.html', text: 'Harbor Point Guide →' },
    events: [
      { mo:'SEP', dy:'12', tag:'events', tagLabel:'Wellness',   name:'Health Wellness & Lifestyle Expo', meta:'Harbor Point Boardwalk · 10 AM–5 PM', url:'stamford/harbor-point/index.html', ticket:'https://www.hwl-expos.com/' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',    name:'Labyrinth in Concert',        meta:'Palace Theatre · 7:30 PM', url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
    ]
  },
  'North Stamford': {
    label: 'North Stamford Events', link: { href: 'stamford/north-stamford/index.html', text: 'North Stamford Guide →' },
    events: [
      { mo:'AUG', dy:'30', tag:'outdoors', tagLabel:'Festival', name:'Honey Harvest Festival', meta:'Bartlett Arboretum · 11 AM–4 PM · Free', url:'stamford/north-stamford/index.html', ticket:'https://www.bartlettarboretum.org/events' },
    ]
  },
  Texas: {
    label: 'Texas Events', link: { href: 'texas/index.html', text: 'Texas Guide →' },
    events: [
      { mo:'SEP', dy:'5',  tag:'events', tagLabel:'Football',   name:'TTU Football Season Opener',  meta:'vs Abilene Christian · Jones AT&T Stadium · 7 PM', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SEP', dy:'7',  tag:'arts',   tagLabel:'Free Event', name:'Buddy Holly 90th Birthday Bash', meta:'Buddy Holly Center · Lubbock',      url:'lubbock/index.html',                   ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'18', tag:'events', tagLabel:'Football',   name:'TTU vs. Houston',             meta:'Big 12 home opener · Jones AT&T Stadium · 8 PM', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SEP', dy:'25', tag:'events', tagLabel:'Fair',       name:'Panhandle South Plains Fair', meta:'Sep 25 – Oct 3 · South Plains Fairgrounds · Lubbock', url:'lubbock/index.html',   ticket:'https://www.southplainsfair.com' },
      { mo:'NOV', dy:'2',  tag:'events', tagLabel:'Basketball', name:'TTU Basketball Opener',       meta:'vs Jackson State · United Supermarkets Arena', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/mens-basketball/schedule' },
    ]
  },
  Lubbock: {
    label: 'Lubbock Events', link: { href: 'lubbock/index.html', text: 'Full Lubbock Guide →' },
    events: [
      { mo:'SEP', dy:'5',  tag:'events', tagLabel:'Football',   name:'TTU Football Season Opener',   meta:'vs Abilene Christian · Jones AT&T Stadium · 7 PM', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SEP', dy:'7',  tag:'arts',   tagLabel:'Free Event', name:'Buddy Holly 90th Birthday Bash', meta:'Buddy Holly Center · 10 AM–5 PM · Free', url:'lubbock/index.html',              ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'18', tag:'events', tagLabel:'Football',   name:'TTU vs. Houston',              meta:'Big 12 home opener · Jones AT&T Stadium · 8 PM', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',    name:'Randy Rogers Band',            meta:'Buddy Holly Hall · 7:30 PM · w/ Hank Weaver', url:'lubbock/historic-district/index.html', ticket:'https://buddyhollyhall.com' },
      { mo:'SEP', dy:'25', tag:'events', tagLabel:'Fair',       name:'Panhandle South Plains Fair',  meta:'Sep 25 – Oct 3 · South Plains Fairgrounds', url:'lubbock/index.html',              ticket:'https://www.southplainsfair.com' },
      { mo:'OCT', dy:'14', tag:'arts',   tagLabel:'Concert',    name:'Elevation Nights',             meta:'Elevation Worship & Steven Furtick · USA · 7 PM', url:'lubbock/tech-district/index.html', ticket:'https://www.depts.ttu.edu/unitedsupermarketsarena/events/special/2026-Elevation_Worship.php' },
      { mo:'OCT', dy:'17', tag:'events', tagLabel:'Homecoming', name:'Texas Tech Homecoming Game',   meta:'vs Arizona State · Jones AT&T Stadium', url:'lubbock/tech-district/index.html',    ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'NOV', dy:'2',  tag:'events', tagLabel:'Basketball', name:'TTU Basketball Opener',        meta:'vs Jackson State · United Supermarkets Arena', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/mens-basketball/schedule' },
      { mo:'NOV', dy:'26', tag:'events', tagLabel:'Football',   name:'TTU vs. TCU — Thanksgiving',   meta:'Jones AT&T Stadium · 8 PM',            url:'lubbock/tech-district/index.html',     ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'DEC', dy:'6',  tag:'events', tagLabel:'Holiday',    name:'Carol of Lights — 68th Annual',meta:'Science Quadrangle · TTU Campus · 7 PM · Free', url:'lubbock/tech-district/index.html', ticket:'https://www.ttu.edu/campus-events/carol-of-lights/' },
      { mo:'FRI', dy:'1st',tag:'arts',   tagLabel:'Art Walk',   name:'First Friday Art Trail',       meta:'Cultural District · 6–9 PM · Free · monthly', url:'lubbock/historic-district/index.html', ticket:'https://lhuca.org/ffat/' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',    name:"Mo's Sunset Market",           meta:'1712 Buddy Holly Ave · Sat 6–9 PM',    url:'lubbock/depot-district/index.html',    ticket:'https://lubbockculturaldistrict.org' },
    ]
  },
  'Depot District': {
    label: 'Depot District Events', link: { href: 'lubbock/depot-district/index.html', text: 'Full Depot Guide →' },
    events: [
      { mo:'FRI', dy:'WKL', tag:'nightlife', tagLabel:'Live Music', name:'Live Music at Blue Light',    meta:'1806 Buddy Holly Ave · Fri & Sat',  url:'lubbock/depot-district/index.html', ticket:'https://thebluelightlive.com' },
      { mo:'SEP', dy:'7',   tag:'arts',      tagLabel:'Free Event', name:'Buddy Holly 90th Birthday Bash', meta:'Buddy Holly Center · 10 AM–5 PM · Free', url:'lubbock/depot-district/index.html', ticket:'https://buddyhollycenter.org' },
      { mo:'SAT', dy:'WKL', tag:'outdoors',  tagLabel:'Market',     name:"Mo's Sunset Market",             meta:'1712 Buddy Holly Ave · Sat 6–9 PM',      url:'lubbock/depot-district/index.html', ticket:'https://lubbockculturaldistrict.org' },
    ]
  },
  'Tech District': {
    label: 'Tech District Events', link: { href: 'lubbock/tech-district/index.html', text: 'Tech District Guide →' },
    events: [
      { mo:'SEP', dy:'5',  tag:'events', tagLabel:'Football',  name:'TTU Football Season Opener', meta:'vs Abilene Christian · Jones AT&T Stadium · 7 PM', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'SAT', dy:'WKL',tag:'events', tagLabel:'Game Day',  name:'Game Day on The Strip',      meta:'University Ave · Home game Sat',  url:'lubbock/tech-district/index.html', ticket:'https://texastech.com' },
      { mo:'OCT', dy:'14', tag:'arts',   tagLabel:'Concert',   name:'Elevation Nights',           meta:'Elevation Worship & Steven Furtick · USA · 7 PM', url:'lubbock/tech-district/index.html', ticket:'https://www.depts.ttu.edu/unitedsupermarketsarena/events/special/2026-Elevation_Worship.php' },
      { mo:'NOV', dy:'2',  tag:'events', tagLabel:'Basketball',name:'TTU Basketball Opener',      meta:'vs Jackson State · United Supermarkets Arena', url:'lubbock/tech-district/index.html', ticket:'https://texastech.com/sports/mens-basketball/schedule' },
      { mo:'DEC', dy:'6',  tag:'events', tagLabel:'Holiday',   name:'Carol of Lights — 68th Annual', meta:'Science Quadrangle · 7 PM · Free', url:'lubbock/tech-district/index.html', ticket:'https://www.ttu.edu/campus-events/carol-of-lights/' },
    ]
  },
  'Historic District': {
    label: 'Historic District Events', link: { href: 'lubbock/historic-district/index.html', text: 'Historic District Guide →' },
    events: [
      { mo:'SEP', dy:'7',  tag:'arts',   tagLabel:'Free Event', name:'Buddy Holly 90th Birthday Bash', meta:'Buddy Holly Center · 10 AM–5 PM · Free', url:'lubbock/depot-district/index.html', ticket:'https://buddyhollycenter.org' },
      { mo:'SEP', dy:'19', tag:'arts',   tagLabel:'Concert',    name:'Randy Rogers Band',              meta:'Buddy Holly Hall · 7:30 PM · w/ Hank Weaver', url:'lubbock/historic-district/index.html', ticket:'https://buddyhollyhall.com' },
      { mo:'NOV', dy:'20', tag:'arts',   tagLabel:'Broadway',   name:'Waitress — Broadway at BHH',     meta:'Buddy Holly Hall · Nov 20–22',           url:'lubbock/historic-district/index.html', ticket:'https://www.americantheatreguild.com/lubbock' },
      { mo:'NOV', dy:'26', tag:'events', tagLabel:'Football',   name:'TTU vs. TCU — Thanksgiving',     meta:'Jones AT&T Stadium · 8 PM',              url:'lubbock/tech-district/index.html',  ticket:'https://texastech.com/sports/football/schedule/2026' },
      { mo:'FRI', dy:'1st',tag:'arts',   tagLabel:'Art Walk',   name:'First Friday Art Trail',         meta:'Cultural District · 6–9 PM · Free · monthly', url:'lubbock/historic-district/index.html', ticket:'https://lhuca.org/ffat/' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',    name:'Lubbock Downtown Farmers Market',meta:'LHUCA Plaza · 5th & Ave J · Sat 9 AM–1 PM thru Oct 24', url:'lubbock/historic-district/index.html', ticket:'https://lubbockdowntownfarmersmarket.com' },
    ]
  },
  Princeton: {
    label: 'Princeton Live Music',
    link: { href: 'princeton/index.html', text: 'Princeton Guide →' },
    events: [
      { mo:'THU', dy:'WKLY', tag:'outdoors',  tagLabel:'Market',     name:'Princeton Farmers Market',           meta:'Hinds Plaza · Thursdays 10 AM–3 PM',   url:'princeton/palmer-square/index.html', ticket:'https://www.princetonfarmersmarket.com/' },
      { mo:'SAT', dy:'1 PM', tag:'arts',      tagLabel:'Free Music', name:'Palmer Square Fall Music Series',    meta:'On the Green · Sat 1–3 PM thru Oct 3', url:'princeton/palmer-square/index.html', ticket:'https://palmersquare.com/events/' },
      { mo:'WED', dy:'WKLY', tag:'arts',      tagLabel:'Live Band',  name:'Bands at the Alchemist & Barrister', meta:'28 Witherspoon St · Wed, Thu & Sun',   url:'princeton/palmer-square/index.html' },
      { mo:'THU', dy:'WKLY', tag:'nightlife', tagLabel:'Brewpub',    name:'Live Music at Triumph Brewing',      meta:'20 Palmer Square E · rotating calendar', url:'princeton/palmer-square/index.html' },
      { mo:'SEP', dy:'–MAY', tag:'arts',      tagLabel:'Concerts',   name:'Princeton University Concerts',      meta:'Richardson Auditorium · 2026–27 season',url:'princeton/university/index.html',      ticket:'https://concerts.princeton.edu' },
      { mo:'ALL', dy:'YEAR', tag:'arts',      tagLabel:'Theatre',    name:'McCarter Theatre Center',            meta:'University Place · year-round',        url:'princeton/university/index.html' },
      { mo:'WED', dy:'–SUN', tag:'arts',      tagLabel:'Museum',     name:'Morven Museum & Garden',             meta:'Stockton St · 10 AM–4 PM',             url:'princeton/western-section/index.html' },
    ]
  },
  'New Jersey': {
    label: 'New Jersey', link: { href: 'new-jersey/index.html', text: 'New Jersey Guide →' },
    events: [
      { mo:'SEP', dy:'1–20',tag:'arts',    tagLabel:'Theatre',    name:'Ghost: The Musical',    meta:'Surflight Theatre · Beach Haven',     url:'lbi/beach-haven/index.html', ticket:'https://surflight.org' },
      { mo:'SEP', dy:'TBD', tag:'events',  tagLabel:'Festival',   name:'Sea Bright Fall Festival', meta:'Municipal Complex · Sea Bright',   url:'sea-bright/index.html', ticket:null },
      { mo:'OCT', dy:'3–4', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest — Chowder Cook-Off', meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:'https://chowderfest.com' },
      { mo:'OCT', dy:'9–10',tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI FLY Kite Festival', meta:'Ship Bottom Beaches · 18th–27th St',  url:'lbi/ship-bottom/index.html', ticket:'https://lbifly.com' },
      { mo:'OCT', dy:'11',  tag:'outdoors',tagLabel:'Race',       name:'LBI 18 Mile Run & 12K', meta:'52nd annual · starts Holgate · 10 AM',url:'lbi/holgate/index.html', ticket:null },
      { mo:'OCT', dy:'9–12',tag:'events',  tagLabel:'Festival',   name:'Victorian Weekend',     meta:'Cape May MAC · house tours & trolleys', url:'cape-may/index.html', ticket:'https://capemaymac.org/victorian-weekend/' },
      { mo:'OCT', dy:'22–25',tag:'arts',   tagLabel:'Jazz Fest',  name:'Exit Zero Jazz Festival (Fall)', meta:'Cape May · venues citywide',  url:'cape-may/index.html', ticket:'https://www.exitzerojazzfestival.com/' },
      { mo:'SAT', dy:'WKLY',tag:'outdoors',tagLabel:'Market',     name:'Montgomery Farmers\' Market', meta:'Municipal Complex · Montgomery Twp', url:'montgomery/index.html', ticket:null },
      { mo:'SEP', dy:'TBD', tag:'dining',  tagLabel:'Food Fest',  name:'Cape May Food & Wine Celebration', meta:'Restaurants & inns citywide · Cape May', url:'cape-may/index.html', ticket:null },
    ]
  },
  'Sea Bright': {
    label: 'Sea Bright Events', link: { href: 'sea-bright/index.html', text: 'Sea Bright Guide →' },
    events: [
      { mo:'JUN', dy:'–OCT', tag:'outdoors',tagLabel:'Market',    name:'Sea Bright Farm & Artisan Market', meta:'1097 Ocean Ave · Wednesdays 1–6 PM', url:'sea-bright/index.html', ticket:null },
      { mo:'SEP', dy:'TBD',  tag:'events',  tagLabel:'Festival',  name:'Sea Bright Fall Festival',          meta:'Municipal Complex · Late September', url:'sea-bright/index.html', ticket:null },
      { mo:'AUG', dy:'TBD',  tag:'dining',  tagLabel:'Food Fest', name:'Oyster Fest',                       meta:'Driftwood Cabana Club',              url:'sea-bright/index.html', ticket:null },
    ]
  },
  'Montgomery': {
    label: 'Montgomery Township Events', link: { href: 'montgomery/index.html', text: 'Montgomery Guide →' },
    events: [
      { mo:'SAT', dy:'WKLY', tag:'outdoors', tagLabel:'Market',   name:'Montgomery Farmers\' Market', meta:'Municipal Complex · Sat 10 AM–1 PM', url:'montgomery/index.html', ticket:null },
      { mo:'TBA', dy:'—',    tag:'events',   tagLabel:'Festival', name:'Montgomery FunFest',           meta:'Annual · Rotary Club & Business Assoc. · date TBA', url:'montgomery/index.html', ticket:null },
      { mo:'DEC', dy:'TBD',  tag:'events',   tagLabel:'Holiday',  name:'Holiday Tree Lighting',         meta:'Municipal Center, Skillman',         url:'montgomery/index.html', ticket:null },
    ]
  },
  'Cape May': {
    label: 'Cape May Events', link: { href: 'cape-may/index.html', text: 'Cape May Guide →' },
    events: [
      { mo:'SEP', dy:'TBD',  tag:'dining',  tagLabel:'Food Fest',  name:'Cape May Food & Wine Celebration', meta:'Restaurants & inns citywide · Cape May MAC', url:'cape-may/index.html', ticket:'https://capemaymac.org/' },
      { mo:'OCT', dy:'9–12', tag:'events',  tagLabel:'Festival',   name:'Victorian Weekend',                meta:'45th annual · house tours & trolleys', url:'cape-may/index.html', ticket:'https://capemaymac.org/victorian-weekend/' },
      { mo:'OCT', dy:'22–25',tag:'arts',    tagLabel:'Jazz Fest',  name:'Exit Zero Jazz Festival (Fall)',   meta:'Convention Hall & venues citywide',   url:'cape-may/index.html', ticket:'https://www.exitzerojazzfestival.com/' },
      { mo:'NOV', dy:'21',   tag:'events',  tagLabel:'Holiday',    name:'Christmas in Cape May',             meta:'Nov 21 – Dec 31 · Physick Estate & citywide', url:'cape-may/index.html', ticket:'https://capemaymac.org/' },
      { mo:'MAY', dy:'–JUN', tag:'arts',    tagLabel:'Music Fest', name:'Cape May Music Festival',          meta:'Annual each spring · Cape May MAC',   url:'cape-may/index.html', ticket:'https://capemaymac.org/cape-may-music-festival/' },
    ]
  },
  'New York': {
    label: 'New York Events', link: { href: 'new-york/index.html', text: 'New York Guide →' },
    events: [
      { mo:'OCT', dy:'16–18',tag:'arts',   tagLabel:'Open House',name:'Open House New York Weekend', meta:'300+ sites citywide · 24th annual',  url:'manhattan/index.html', ticket:'https://ohny.org/festival' },
      { mo:'OCT', dy:'31',   tag:'events', tagLabel:'Parade',   name:'Village Halloween Parade', meta:'Sixth Ave, Canal to 15th St · 7 PM',  url:'manhattan/index.html#greenwich-village', ticket:'https://halloween-nyc.com' },
      { mo:'NOV', dy:'1',    tag:'outdoors',tagLabel:'Race',    name:'TCS New York City Marathon',meta:'50th five-borough running · finishes Central Park', url:'manhattan/index.html', ticket:'https://www.nyrr.org' },
      { mo:'AUG', dy:'ANN',  tag:'events', tagLabel:'Festival', name:'Harlem Week',              meta:'Annual · each August · citywide, centered on Harlem', url:'manhattan/index.html#harlem', ticket:'https://harlemweek.org' },
      { mo:'JUN', dy:'TBD',  tag:'arts',   tagLabel:'Film Fest',name:'Tribeca Festival',          meta:'Venues across Lower Manhattan',       url:'manhattan/index.html#tribeca', ticket:'https://tribecafilm.com/festival' },
    ]
  },
  'Manhattan': {
    label: 'Manhattan Events', link: { href: 'manhattan/index.html', text: 'Manhattan Guide →' },
    events: [
      { mo:'SEP', dy:'29',   tag:'arts',   tagLabel:'Concert',  name:'Gorillaz — The Mountain Tour', meta:'Madison Square Garden · 8 PM',        url:'manhattan/index.html#chelsea', ticket:'https://www.msg.com/events-tickets/gorillaz-little-simz-deltron-3030-madison-square-garden-september-2026/3B0064599DDAA6E6' },
      { mo:'OCT', dy:'10',   tag:'arts',   tagLabel:'Concert',  name:'The Chicks at the Beacon', meta:'Beacon Theatre · Oct 10, 12 & 13 · 8 PM', url:'manhattan/index.html#upper-west-side', ticket:'https://www.msg.com/beacon-theatre' },
      { mo:'OCT', dy:'16–18',tag:'arts',   tagLabel:'Open House',name:'Open House New York Weekend', meta:'300+ sites citywide · 24th annual',  url:'manhattan/index.html', ticket:'https://ohny.org/festival' },
      { mo:'OCT', dy:'31',   tag:'events', tagLabel:'Parade',   name:'Village Halloween Parade', meta:'Sixth Ave, Canal to 15th St · 7 PM',  url:'manhattan/index.html#greenwich-village', ticket:'https://halloween-nyc.com' },
      { mo:'NOV', dy:'1',    tag:'outdoors',tagLabel:'Race',    name:'TCS New York City Marathon',meta:'50th five-borough running · finishes Central Park', url:'manhattan/index.html', ticket:'https://www.nyrr.org' },
      { mo:'NOV', dy:'26',   tag:'events', tagLabel:'Parade',   name:"Macy's Thanksgiving Day Parade", meta:'100th parade · steps off W 77th & CPW · 8:30 AM', url:'manhattan/index.html#upper-west-side', ticket:'https://www.macys.com/s/parade/' },
      { mo:'DEC', dy:'1',    tag:'arts',   tagLabel:'Concert',  name:'Doja Cat — Tour Ma Vie World Tour', meta:'Madison Square Garden · 7:30 PM', url:'manhattan/index.html#chelsea', ticket:'https://www.msg.com/events-tickets/doja-cat-madison-square-garden-december-2026/3B00633A23FD3029' },
      { mo:'AUG', dy:'ANN',  tag:'events', tagLabel:'Festival', name:'Harlem Week',              meta:'Annual · each August · citywide, centered on Harlem', url:'manhattan/index.html#harlem', ticket:'https://harlemweek.org' },
      { mo:'JUN', dy:'TBD',  tag:'arts',   tagLabel:'Film Fest',name:'Tribeca Festival',          meta:'Venues across Lower Manhattan',       url:'manhattan/index.html#tribeca', ticket:'https://tribecafilm.com/festival' },
    ]
  },
  'Long Beach Island': {
    label: 'LBI Events', link: { href: 'lbi/index.html', text: 'Full LBI Guide →' },
    events: [
      { mo:'WED', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Concerts on the Green', meta:'Veterans Bicentennial Park · Beach Haven · 7:30 PM', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'SEP', dy:'1–20',tag:'arts',    tagLabel:'Theatre',    name:'Ghost: The Musical',    meta:'Surflight Theatre · Beach Haven',     url:'lbi/beach-haven/index.html', ticket:'https://surflight.org' },
      { mo:'OCT', dy:'3–4', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest — Chowder Cook-Off', meta:'Taylor Ave Waterfront · Beach Haven', url:'lbi/beach-haven/index.html', ticket:'https://chowderfest.com' },
      { mo:'OCT', dy:'9–10',tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI FLY Kite Festival', meta:'Ship Bottom Beaches · 18th–27th St',  url:'lbi/ship-bottom/index.html', ticket:'https://lbifly.com' },
      { mo:'OCT', dy:'11',  tag:'outdoors',tagLabel:'Race',       name:'LBI 18 Mile Run & 12K', meta:'52nd annual · starts Holgate · 10 AM',url:'lbi/holgate/index.html', ticket:null },
    ]
  },
  Holgate: {
    label: 'Holgate Notes', link: { href: 'lbi/holgate/index.html', text: 'Holgate Guide →' },
    events: [
      { mo:'SEP', dy:'1',   tag:'outdoors',tagLabel:'Season Opens', name:'Holgate Wilderness Area Reopens', meta:'Walking & 4WD below berm crest · Sep 1–Mar 31 · LBT buggy permit', url:'lbi/holgate/index.html', ticket:null },
      { mo:'OCT', dy:'11',  tag:'outdoors',tagLabel:'Race',         name:'LBI 18 Mile Run & 12K',meta:'52nd annual · starts in Holgate · 10 AM', url:'lbi/holgate/index.html', ticket:null },
      { mo:'OCT', dy:'TBD', tag:'outdoors',tagLabel:'Fishing',      name:'Striped Bass Season',  meta:'Holgate tip · Peak fall run',         url:'lbi/holgate/index.html', ticket:null },
    ]
  },
  'Beach Haven': {
    label: 'Beach Haven Events', link: { href: 'lbi/beach-haven/index.html', text: 'Beach Haven Guide →' },
    events: [
      { mo:'AUG', dy:'–30', tag:'arts',    tagLabel:'Theatre',    name:'1776: The Musical',       meta:'Surflight Theatre · through Aug 30',  url:'lbi/beach-haven/index.html', ticket:'https://surflight.org' },
      { mo:'WED', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Concerts on the Green',   meta:'Veterans Bicentennial Park · Wed 7:30 PM', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'SEP', dy:'1–20',tag:'arts',    tagLabel:'Theatre',    name:'Ghost: The Musical',      meta:'Surflight Theatre',                   url:'lbi/beach-haven/index.html', ticket:'https://surflight.org' },
      { mo:'OCT', dy:'3–4', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest — Chowder Cook-Off', meta:'Taylor Ave Waterfront · Oct 3–4', url:'lbi/beach-haven/index.html', ticket:'https://chowderfest.com' },
    ]
  },
  'Ship Bottom': {
    label: 'Ship Bottom Events', link: { href: 'lbi/ship-bottom/index.html', text: 'Ship Bottom Guide →' },
    events: [
      { mo:'OCT', dy:'9–10',tag:'outdoors',tagLabel:'Kite Fest',  name:'LBI FLY Kite Festival',meta:'Ship Bottom Beaches 18th–27th St · Night Fly Sat', url:'lbi/ship-bottom/index.html', ticket:'https://lbifly.com' },
    ]
  },
  'Surf City': {
    label: 'Surf City Events', link: { href: 'lbi/surf-city/index.html', text: 'Surf City Guide →' },
    events: [
      { mo:'MON', dy:'WKL', tag:'outdoors',tagLabel:'Market',    name:'Surf City Farmers Market', meta:'Surf City Firehouse · 713 Long Beach Blvd · Mon 8 AM–noon · Jun–Sep', url:'lbi/surf-city/index.html', ticket:null },
    ]
  },
  'Harvey Cedars': {
    label: 'Harvey Cedars Events', link: { href: 'lbi/harvey-cedars/index.html', text: 'Harvey Cedars Guide →' },
    events: [
      { mo:'FRI', dy:'WKL', tag:'outdoors',tagLabel:'Market',    name:'Black Eyed Susans Farmers Market', meta:'Harvey Cedars · Fridays 9–11 AM in season', url:'lbi/harvey-cedars/index.html', ticket:null },
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
// ── Collapsible left panel ───────────────────────────────────────────
// Drives both layouts: the home page's .home-split grid and the injected
// .site-left-panel on every other page. Both read --panel-w, so collapsing
// is a single class on <body>. The choice is remembered in localStorage so
// it carries across pages instead of resetting on every navigation.
function initPanelCollapse() {
  const homePanel = document.querySelector('.home-split');
  const sidePanel = document.querySelector('.site-left-panel');
  if (!homePanel && !sidePanel) return;

  if (homePanel) document.body.classList.add('has-home-panel');

  const KEY = 'concierge:panel-collapsed';
  // Below this width the panel is an off-canvas drawer rather than a column.
  const mobile = window.matchMedia('(max-width: 768px)');
  const isDrawer = () => mobile.matches && !homePanel;

  let collapsed = false;
  try { collapsed = localStorage.getItem(KEY) === '1'; } catch (e) { /* private mode */ }
  // A drawer always starts closed — that's the convention, and on a phone the
  // page underneath is what you came for.
  if (isDrawer()) collapsed = true;

  const btn = document.createElement('button');
  btn.className = 'panel-toggle';
  btn.type = 'button';
  document.body.appendChild(btn);

  const backdrop = document.createElement('div');
  backdrop.className = 'panel-backdrop';
  document.body.appendChild(backdrop);

  function apply() {
    const label = collapsed ? 'Show search and events' : 'Hide search and events';
    document.body.classList.toggle('panel-collapsed', collapsed);
    btn.textContent = collapsed ? '\u203A' : '\u2039';
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label', label);
    btn.title = label;
  }

  function set(next) {
    collapsed = next;
    // Only remember the choice on desktop; a phone visit shouldn't overwrite
    // the preference someone set on a wide screen.
    if (!isDrawer()) {
      try { localStorage.setItem(KEY, collapsed ? '1' : '0'); } catch (e) { /* private mode */ }
    }
    apply();
  }

  // Apply the starting state without animating it on first paint.
  document.body.classList.add('panel-no-anim');
  apply();
  requestAnimationFrame(() => document.body.classList.remove('panel-no-anim'));

  btn.addEventListener('click', () => set(!collapsed));
  backdrop.addEventListener('click', () => set(true));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !collapsed && isDrawer()) set(true);
  });

  // Crossing the breakpoint (rotating a phone, resizing a window) changes what
  // the panel *is*, so re-derive the state instead of leaving it half-applied.
  const onBreakpoint = () => {
    if (isDrawer()) { set(true); return; }
    let stored = false;
    try { stored = localStorage.getItem(KEY) === '1'; } catch (e) { /* private mode */ }
    set(stored);
  };
  if (mobile.addEventListener) mobile.addEventListener('change', onBreakpoint);
  else if (mobile.addListener) mobile.addListener(onBreakpoint);
}

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
  initPanelCollapse();
  initLiveMusic();
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
