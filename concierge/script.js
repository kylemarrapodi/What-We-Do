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
            { label:'Greenwich',  aliases:['greenwich','greenwich ct','old greenwich','cos cob','byram','glenville','tods point'], status:'live', url:'greenwich/index.html', children:[] },
            { label:'New Canaan', aliases:['new canaan','new canaan ct','next station to heaven','glass house town'], status:'live', url:'new-canaan/index.html', children:[] },
            { label:'Westport',   aliases:['westport'],  status:'soon', url:null, children:[] },
            { label:'Norwalk',    aliases:['norwalk'],   status:'soon', url:null, children:[] },
          ]
        },
        {
          label: 'New Jersey', aliases: ['new jersey','nj'], status: 'live', url: 'new-jersey/index.html',
          children: [
            {
              label: 'Long Beach Island', aliases: ['long beach island','lbi'], status: 'live', url: 'lbi/index.html',
              children: [
                { label:'Holgate',        aliases:['holgate','beach haven inlet','beach haven heights'], status:'live', url:'lbi/holgate/index.html', children:[] },
                { label:'Beach Haven',    aliases:['beach haven'],          status:'live', url:'lbi/beach-haven/index.html',    children:[] },
                { label:'Spray Beach',    aliases:['spray beach','beach haven terrace','beach haven gardens','bay vista','north beach haven'], status:'live', url:'lbi/spray-beach/index.html', children:[] },
                { label:'Brant Beach',    aliases:['brant beach','beach haven crest','brighton beach lbi','peahala park','beach haven park','haven beach','the dunes'], status:'live', url:'lbi/brant-beach/index.html', children:[] },
                { label:'Ship Bottom',    aliases:['ship bottom'],          status:'live', url:'lbi/ship-bottom/index.html',    children:[] },
                { label:'Surf City',      aliases:['surf city'],            status:'live', url:'lbi/surf-city/index.html',      children:[] },
                { label:'Harvey Cedars',  aliases:['harvey cedars'],        status:'live', url:'lbi/harvey-cedars/index.html',  children:[] },
                { label:'Loveladies',     aliases:['loveladies','north beach lbi','high bar harbor'], status:'live', url:'lbi/loveladies/index.html', children:[] },
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
                { label:'Battery Park City',  aliases:['battery park city','bpc','brookfield place'],       status:'live', url:'manhattan/index.html#battery-park-city',  children:[] },
                { label:'Civic Center',       aliases:['civic center','city hall','foley square'],          status:'live', url:'manhattan/index.html#civic-center',       children:[] },
                { label:'Tribeca',            aliases:['tribeca'],                                          status:'live', url:'manhattan/index.html#tribeca',            children:[] },
                { label:'SoHo',               aliases:['soho','south of houston'],                          status:'live', url:'manhattan/index.html#soho',               children:[] },
                { label:'Greenwich Village',  aliases:['greenwich village','the village','stonewall'],      status:'live', url:'manhattan/index.html#greenwich-village',  children:[] },
                { label:'Meatpacking District', aliases:['meatpacking','meatpacking district','gansevoort'], status:'live', url:'manhattan/index.html#meatpacking-district', children:[] },
                { label:'Chinatown',          aliases:['chinatown','mott street','doyers street'],          status:'live', url:'manhattan/index.html#chinatown',          children:[] },
                { label:'Little Italy',       aliases:['little italy','mulberry street','san gennaro'],     status:'live', url:'manhattan/index.html#little-italy',       children:[] },
                { label:'Nolita',             aliases:['nolita','north of little italy'],                   status:'live', url:'manhattan/index.html#nolita',             children:[] },
                { label:'Lower East Side',    aliases:['lower east side','les','orchard street','delancey'], status:'live', url:'manhattan/index.html#lower-east-side',   children:[] },
                { label:'East Village',       aliases:['east village','st marks','st marks place','alphabet city'], status:'live', url:'manhattan/index.html#east-village', children:[] },
                { label:'Stuyvesant Town',    aliases:['stuyvesant town','stuy town','stuytown','the oval'],   status:'live', url:'manhattan/index.html#stuyvesant-town',   children:[] },
                { label:'NoHo',               aliases:['noho','north of houston','great jones'],            status:'live', url:'manhattan/index.html#noho',               children:[] },
                { label:'Gramercy Park',      aliases:['gramercy','gramercy park','irving place'],          status:'live', url:'manhattan/index.html#gramercy-park',      children:[] },
                { label:'Flatiron District',  aliases:['flatiron','flatiron district','madison square'],    status:'live', url:'manhattan/index.html#flatiron-district',  children:[] },
                { label:'NoMad',              aliases:['nomad','north of madison square'],                  status:'live', url:'manhattan/index.html#nomad',              children:[] },
                { label:'Kips Bay',           aliases:['kips bay','curry hill'],                            status:'live', url:'manhattan/index.html#kips-bay',           children:[] },
                { label:'Murray Hill',        aliases:['murray hill','sniffen court','morgan library'],     status:'live', url:'manhattan/index.html#murray-hill',        children:[] },
                { label:'Chelsea',            aliases:['chelsea','high line','chelsea market'],             status:'live', url:'manhattan/index.html#chelsea',            children:[] },
                { label:'Garment District',   aliases:['garment district','fashion district','fashion avenue'], status:'live', url:'manhattan/index.html#garment-district', children:[] },
                { label:'Hudson Yards',       aliases:['hudson yards','the vessel','edge nyc'],             status:'live', url:'manhattan/index.html#hudson-yards',       children:[] },
                { label:"Hell's Kitchen",     aliases:['hells kitchen',"hell's kitchen",'clinton','restaurant row'], status:'live', url:'manhattan/index.html#hells-kitchen', children:[] },
                { label:'Midtown West',       aliases:['midtown west','times square','theater district','broadway'], status:'live', url:'manhattan/index.html#midtown-west', children:[] },
                { label:'Midtown East',       aliases:['midtown east','grand central','terminal city'],     status:'live', url:'manhattan/index.html#midtown-east',       children:[] },
                { label:'Tudor City',         aliases:['tudor city','tudor city greens'],                   status:'live', url:'manhattan/index.html#tudor-city',         children:[] },
                { label:'Turtle Bay',         aliases:['turtle bay','united nations','un headquarters'],    status:'live', url:'manhattan/index.html#turtle-bay',         children:[] },
                { label:'Sutton Place',       aliases:['sutton place','sutton','riverview terrace'],        status:'live', url:'manhattan/index.html#sutton-place',       children:[] },
                { label:'Roosevelt Island',   aliases:['roosevelt island','the tram','blackwell island'],   status:'live', url:'manhattan/index.html#roosevelt-island',   children:[] },
                { label:'Lincoln Square',     aliases:['lincoln square','lincoln center','met opera'],      status:'live', url:'manhattan/index.html#lincoln-square',     children:[] },
                { label:'Upper West Side',    aliases:['upper west side','uws'],                            status:'live', url:'manhattan/index.html#upper-west-side',    children:[] },
                { label:'Upper East Side',    aliases:['upper east side','ues','museum mile'],              status:'live', url:'manhattan/index.html#upper-east-side',    children:[] },
                { label:'Carnegie Hill',      aliases:['carnegie hill','guggenheim','cooper hewitt'],       status:'live', url:'manhattan/index.html#carnegie-hill',      children:[] },
                { label:'Yorkville',          aliases:['yorkville','gracie mansion','germantown'],          status:'live', url:'manhattan/index.html#yorkville',          children:[] },
                { label:'Harlem',             aliases:['harlem','apollo theater'],                          status:'live', url:'manhattan/index.html#harlem',             children:[] },
                { label:'East Harlem',        aliases:['east harlem','el barrio','spanish harlem'],         status:'live', url:'manhattan/index.html#east-harlem',        children:[] },
                { label:'Morningside Heights', aliases:['morningside heights','columbia','st john the divine'], status:'live', url:'manhattan/index.html#morningside-heights', children:[] },
                { label:'Manhattanville',     aliases:['manhattanville','west harlem','manhattanville campus'], status:'live', url:'manhattan/index.html#manhattanville',  children:[] },
                { label:'Hamilton Heights',   aliases:['hamilton heights','sugar hill','hamilton grange','city college'], status:'live', url:'manhattan/index.html#hamilton-heights', children:[] },
                { label:'Washington Heights', aliases:['washington heights','the heights','little dominican republic','wahi'], status:'live', url:'manhattan/index.html#washington-heights', children:[] },
                { label:'Inwood',             aliases:['inwood','inwood hill','dyckman','shorakkopoch'],    status:'live', url:'manhattan/index.html#inwood',             children:[] },
                { label:'Marble Hill',        aliases:['marble hill','225th street','broadway bridge'],     status:'live', url:'manhattan/index.html#marble-hill',        children:[] },
                { label:'Financial District', aliases:['financial district','fidi','wall street'],          status:'live', url:'manhattan/index.html#financial-district', children:[] },
              ]
            },
            {
              label: 'Queens', aliases: ['queens','queens ny','queens county','the worlds borough'], status: 'live', url: 'queens/index.html',
              children: [
                { label:'Long Island City', aliases:['long island city','lic','hunters point','queens plaza'],     status:'live', url:'queens/index.html#long-island-city', children:[] },
                { label:'Astoria',          aliases:['astoria','ditmars','steinway'],                              status:'live', url:'queens/index.html#astoria',          children:[] },
                { label:'Sunnyside',        aliases:['sunnyside','sunnyside gardens','sunnyside queens'],          status:'live', url:'queens/index.html#sunnyside',        children:[] },
                { label:'Jackson Heights',  aliases:['jackson heights','little india','diversity plaza','74th street'], status:'live', url:'queens/index.html#jackson-heights', children:[] },
                { label:'Elmhurst',         aliases:['elmhurst','newtown','elmhurst queens'],                      status:'live', url:'queens/index.html#elmhurst',         children:[] },
                { label:'Corona',           aliases:['corona','corona queens','flushing meadows','flushing meadows corona park'], status:'live', url:'queens/index.html#corona', children:[] },
                { label:'Flushing',         aliases:['flushing','main street flushing','downtown flushing'],       status:'live', url:'queens/index.html#flushing',         children:[] },
                { label:'Forest Hills',     aliases:['forest hills','forest hills gardens','austin street'],       status:'live', url:'queens/index.html#forest-hills',     children:[] },
                { label:'Ridgewood',        aliases:['ridgewood','ridgewood queens'],                              status:'live', url:'queens/index.html#ridgewood',        children:[] },
                { label:'Rockaway Beach',   aliases:['rockaway beach','rockaway','the rockaways','rockaways'],     status:'live', url:'queens/index.html#rockaway-beach',   children:[] },
              ]
            },
            {
              label: 'Brooklyn', aliases: ['brooklyn','brooklyn ny','kings county','bk'], status: 'live', url: 'brooklyn/index.html',
              children: [
                { label:'Williamsburg',      aliases:['williamsburg','williamsburg brooklyn','bedford avenue','the northside'], status:'live', url:'brooklyn/index.html#williamsburg',      children:[] },
                { label:'Greenpoint',        aliases:['greenpoint','little poland','greenpoint brooklyn'],            status:'live', url:'brooklyn/index.html#greenpoint',        children:[] },
                { label:'DUMBO',             aliases:['dumbo','down under the manhattan bridge','fulton ferry'],      status:'live', url:'brooklyn/index.html#dumbo',             children:[] },
                { label:'Brooklyn Heights',  aliases:['brooklyn heights','the heights brooklyn','the promenade'],     status:'live', url:'brooklyn/index.html#brooklyn-heights',  children:[] },
                { label:'Downtown Brooklyn', aliases:['downtown brooklyn','fulton mall','metrotech','city point'],    status:'live', url:'brooklyn/index.html#downtown-brooklyn', children:[] },
                { label:'Fort Greene',       aliases:['fort greene','fort green','bam district'],                     status:'live', url:'brooklyn/index.html#fort-greene',       children:[] },
                { label:'Park Slope',        aliases:['park slope','the slope','south slope park'],                   status:'live', url:'brooklyn/index.html#park-slope',        children:[] },
                { label:'Prospect Heights',  aliases:['prospect heights','prospect park','grand army plaza','vanderbilt avenue'], status:'live', url:'brooklyn/index.html#prospect-heights', children:[] },
                { label:'Bushwick',          aliases:['bushwick','bushwick brooklyn','the bushwick collective'],      status:'live', url:'brooklyn/index.html#bushwick',          children:[] },
                { label:'Coney Island',      aliases:['coney island','coney','the peoples playground','boardwalk brooklyn'], status:'live', url:'brooklyn/index.html#coney-island', children:[] },
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
    { label:'Greenwich, CT',      sub:'Connecticut',           type:'place',  url: p+'greenwich/index.html',                  keywords:['greenwich','greenwich ct','gold coast','fairfield county','old greenwich','cos cob','byram','riverside ct'] },
    { label:'New Canaan, CT',     sub:'Connecticut',           type:'place',  url: p+'new-canaan/index.html',                 keywords:['new canaan','new canaan ct','next station to heaven','harvard five','fairfield county'] },
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
    { label:'Brant Beach',       sub:'Long Beach Township, LBI', type:'place', url: p+'lbi/brant-beach/index.html',           keywords:['brant beach','beach haven crest','brighton beach','peahala park','beach haven park','haven beach','the dunes','bayview park','68th street'] },
    { label:'Spray Beach',       sub:'Long Beach Township, LBI', type:'place', url: p+'lbi/spray-beach/index.html',           keywords:['spray beach','beach haven terrace','beach haven gardens','bay vista','north beach haven','terrace tavern'] },
    { label:'Loveladies & North Beach', sub:'Long Beach Township, LBI', type:'place', url: p+'lbi/loveladies/index.html',     keywords:['loveladies','north beach','high bar harbor','lbi foundation','lbif','modernist beach houses'] },
    // ── Events — LBI ──
    { label:'Chowderfest',       sub:'Oct 3–4 · Taylor Ave · Beach Haven',     type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['chowderfest','chowder','chowder cook-off','lbi festival','beach haven festival'] },
    { label:'HopSauce Festival', sub:'Jun (annual) · Taylor Ave · Beach Haven',type:'event',  url: p+'lbi/beach-haven/index.html',  keywords:['hopsauce','hop sauce','craft beer','hot sauce','beach haven beer'] },
    { label:'Lighthouse International Film Festival', sub:'Jun (annual) · island-wide · LBI', type:'event', url: p+'lbi/beach-haven/index.html', keywords:['lighthouse film festival','lbi film festival','film festival','indie film'] },
    { label:'Coquina Jam',       sub:'Jul (annual) · 68th St, Brant Beach',    type:'event',  url: p+'lbi/brant-beach/index.html',  keywords:['coquina jam','surf competition','lbi surf','surfing competition','jetty'] },
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
    { label:"Nardi's Tavern",    sub:'Haven Beach, LBI — music nightly',       type:'place',  url: p+'lbi/brant-beach/index.html',  keywords:['nardis','nardis tavern','pink bus','live music lbi','nightclub lbi'] },
    { label:'Terrace Tavern',    sub:'Beach Haven Terrace, LBI',               type:'place',  url: p+'lbi/spray-beach/index.html',  keywords:['terrace tavern','beach haven terrace bar','lbi tavern'] },
    { label:'Daddy O',           sub:'Brant Beach, LBI — hotel & restaurant',  type:'place',  url: p+'lbi/brant-beach/index.html',  keywords:['daddy o','daddyo','rooftop bar lbi','boutique hotel lbi'] },
    { label:'Bayview Park',      sub:'68th St, Brant Beach, LBI',              type:'place',  url: p+'lbi/brant-beach/index.html',  keywords:['bayview park','68th street beach','kayak lbi','paddleboard lbi','playground lbi'] },
    { label:'LBI Foundation of the Arts & Sciences', sub:'Loveladies, LBI',    type:'place',  url: p+'lbi/loveladies/index.html',   keywords:['lbi foundation','lbif','works on paper','art classes lbi','loveladies art'] },
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
    // ── Greenwich ──
    { label:'Bruce Museum',       sub:'Greenwich, CT',         type:'place',  url: p+'greenwich/index.html',                  keywords:['bruce museum','art museum greenwich','science museum','richter art wing','free tuesday museum'] },
    { label:"Greenwich Point Park (Tod's Point)", sub:'Old Greenwich, CT', type:'place', url: p+'greenwich/index.html',       keywords:['tods point','greenwich point','beach greenwich','old greenwich beach','day pass greenwich'] },
    { label:'Greenwich Avenue',   sub:'Downtown Greenwich, CT',type:'place',  url: p+'greenwich/index.html',                  keywords:['greenwich avenue','the avenue','shopping greenwich','luxury shopping ct'] },
    { label:'Greenwich Audubon Center', sub:'Greenwich, CT',   type:'place',  url: p+'greenwich/index.html',                  keywords:['audubon greenwich','greenwich audubon','birding ct','hawk watch','riversville road'] },
    { label:'Putnam Cottage',     sub:'Greenwich, CT',         type:'place',  url: p+'greenwich/index.html',                  keywords:['putnam cottage','knapp tavern','israel putnam','revolutionary war greenwich'] },
    { label:"L'Escale",           sub:'Delamar · Greenwich, CT',type:'place', url: p+'greenwich/index.html',                  keywords:['lescale','l escale','french restaurant greenwich','waterfront dining greenwich','delamar'] },
    { label:'Elm Street Oyster House', sub:'Greenwich, CT',    type:'place',  url: p+'greenwich/index.html',                  keywords:['elm street oyster house','oysters greenwich','seafood greenwich'] },
    { label:'Polpo Restaurant & Saloon', sub:'Greenwich, CT',  type:'place',  url: p+'greenwich/index.html',                  keywords:['polpo','tuscan greenwich','italian greenwich','old post road'] },
    { label:'The Ginger Man',     sub:'Greenwich, CT',         type:'place',  url: p+'greenwich/index.html',                  keywords:['ginger man','pub greenwich','bar greenwich avenue'] },
    { label:'Méli-Mélo',          sub:'Greenwich, CT',         type:'place',  url: p+'greenwich/index.html',                  keywords:['meli melo','melimelo','creperie greenwich','crepes ct','juice bar greenwich'] },
    { label:'Delamar Greenwich Harbor', sub:'Hotel · Greenwich, CT', type:'place', url: p+'greenwich/index.html',             keywords:['delamar','greenwich hotel','harbor hotel ct','boutique hotel greenwich'] },
    { label:'J House Greenwich',  sub:'Hotel · Riverside, CT', type:'place',  url: p+'greenwich/index.html',                  keywords:['j house','jhouse','riverside hotel','boutique hotel ct'] },
    { label:'Hyatt Regency Greenwich', sub:'Hotel · Old Greenwich, CT', type:'place', url: p+'greenwich/index.html',          keywords:['hyatt greenwich','hyatt regency','old greenwich hotel'] },
    { label:'Hawk Watch Fest',    sub:'Sep 26 · Greenwich Audubon Center', type:'event', url: p+'greenwich/index.html',       keywords:['hawk watch','hawkwatch','audubon festival','raptor festival','bird festival ct'] },
    { label:"Puttin' On The Dog", sub:'Sep 27 · Roger Sherman Baldwin Park · Greenwich', type:'event', url: p+'greenwich/index.html', keywords:['puttin on the dog','adopt a dog','dog festival','dog event greenwich'] },
    { label:'Bruce Museum Outdoor Arts Festival', sub:'Oct 10–11 · Greenwich', type:'event', url: p+'greenwich/index.html',   keywords:['outdoor arts festival','bruce museum festival','art festival greenwich','craft festival ct'] },
    { label:'Greenwich Farmers Market', sub:'Sat 9:30 AM–1 PM · Horseneck lot · thru Nov 21', type:'event', url: p+'greenwich/index.html', keywords:['greenwich farmers market','farmers market greenwich','horseneck lot','arch street market'] },
    { label:'Greenwich Town Party', sub:'Annual · May · Roger Sherman Baldwin Park', type:'event', url: p+'greenwich/index.html', keywords:['greenwich town party','gtp','town party','memorial day concert greenwich','dave matthews greenwich'] },
    // ── New Canaan ──
    { label:'The Glass House',    sub:'New Canaan, CT',        type:'place',  url: p+'new-canaan/index.html',                 keywords:['glass house','philip johnson','modern architecture','harvard five','national trust'] },
    { label:'Grace Farms',        sub:'New Canaan, CT',        type:'place',  url: p+'new-canaan/index.html',                 keywords:['grace farms','river building','sanaa','lukes wood road','architecture ct'] },
    { label:'Waveny Park',        sub:'New Canaan, CT',        type:'place',  url: p+'new-canaan/index.html',                 keywords:['waveny','waveny park','waveny house','the castle new canaan','trails new canaan'] },
    { label:'New Canaan Nature Center', sub:'New Canaan, CT',  type:'place',  url: p+'new-canaan/index.html',                 keywords:['nature center new canaan','oenoke ridge','trails ct'] },
    { label:'Elm Restaurant',     sub:'New Canaan, CT',        type:'place',  url: p+'new-canaan/index.html',                 keywords:['elm restaurant','luke venner','new american new canaan','elm street new canaan'] },
    { label:'Solé Ristorante',    sub:'New Canaan, CT',        type:'place',  url: p+'new-canaan/index.html',                 keywords:['sole','sole ristorante','italian new canaan','z hospitality'] },
    { label:'Gates Restaurant & Bar', sub:'New Canaan, CT',    type:'place',  url: p+'new-canaan/index.html',                 keywords:['gates','gates restaurant','forest street bar','new canaan bar'] },
    { label:'Rosie',              sub:'Bakery Café · New Canaan, CT', type:'place', url: p+'new-canaan/index.html',           keywords:['rosie','rosies','bakery new canaan','breakfast new canaan','cafe new canaan'] },
    { label:'Roger Sherman Inn',  sub:'Inn · New Canaan, CT',  type:'place',  url: p+'new-canaan/index.html',                 keywords:['roger sherman inn','inn new canaan','country inn ct','oenoke ridge inn'] },
    { label:'Caffeine & Carburetors', sub:'Oct 18 · Waveny Park · New Canaan', type:'event', url: p+'new-canaan/index.html',  keywords:['caffeine and carburetors','caffeine carburetors','car show','cars and coffee','car meet ct'] },
    { label:'New Canaan Farmers Market', sub:'Sat 10 AM–2 PM · Lumber Yard Lot · thru Dec 19', type:'event', url: p+'new-canaan/index.html', keywords:['new canaan farmers market','farmers market new canaan','lumberyard lot'] },
    { label:'New Canaan Holiday Stroll', sub:'Annual · early Dec · downtown New Canaan', type:'event', url: p+'new-canaan/index.html', keywords:['holiday stroll','new canaan holiday','christmas new canaan','tree lighting new canaan'] },
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
    { label:'Upper West Side',    sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#upper-west-side',  keywords:['upper west side','uws','natural history museum'] },
    { label:'Harlem',             sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#harlem',           keywords:['harlem','apollo theater','studio museum in harlem','malcolm x blvd'] },
    { label:'Financial District', sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#financial-district',keywords:['financial district','fidi','wall street','stone street','9/11 memorial'] },
    { label:'Battery Park City',  sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#battery-park-city',keywords:['battery park city','bpc','brookfield place','hudson river esplanade'] },
    { label:'Civic Center',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#civic-center',     keywords:['civic center','city hall','foley square','african burial ground','woolworth building'] },
    { label:'Chinatown',          sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#chinatown',        keywords:['chinatown','mott street','doyers street','dim sum','columbus park'] },
    { label:'Little Italy',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#little-italy',     keywords:['little italy','mulberry street','san gennaro','ferrara'] },
    { label:'Nolita',             sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#nolita',           keywords:['nolita','north of little italy','elizabeth street','old st patricks'] },
    { label:'Lower East Side',    sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#lower-east-side',  keywords:['lower east side','les','orchard street','delancey street','tenement'] },
    { label:'NoHo',               sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#noho',             keywords:['noho','north of houston','lafayette street','bond street','great jones'] },
    { label:'Gramercy Park',      sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#gramercy-park',    keywords:['gramercy','gramercy park','irving place','private park'] },
    { label:'Flatiron District',  sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#flatiron-district',keywords:['flatiron','flatiron district','flatiron building','madison square park'] },
    { label:'NoMad',              sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#nomad',            keywords:['nomad','north of madison square','broadway hotels'] },
    { label:'Kips Bay',           sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#kips-bay',         keywords:['kips bay','curry hill','lexington avenue spices'] },
    { label:'Murray Hill',        sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#murray-hill',      keywords:['murray hill','east 30s','sniffen court'] },
    { label:'Meatpacking District', sub:'Manhattan, NY',       type:'place',  url: p+'manhattan/index.html#meatpacking-district', keywords:['meatpacking','meatpacking district','gansevoort market','gansevoort street'] },
    { label:'Garment District',   sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#garment-district', keywords:['garment district','fashion district','fashion avenue','herald square'] },
    { label:'Hudson Yards',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#hudson-yards',     keywords:['hudson yards','far west side','west side yards'] },
    { label:"Hell's Kitchen",     sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#hells-kitchen',    keywords:['hells kitchen',"hell's kitchen",'clinton','ninth avenue','restaurant row'] },
    { label:'Midtown West',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#midtown-west',     keywords:['midtown west','times square','theater district','broadway theaters'] },
    { label:'Midtown East',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#midtown-east',     keywords:['midtown east','grand central','terminal city','fifth avenue'] },
    { label:'Stuyvesant Town',    sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#stuyvesant-town',  keywords:['stuyvesant town','stuy town','stuytown','peter cooper village','the oval'] },
    { label:'Tudor City',         sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#tudor-city',       keywords:['tudor city','tudor city place','fred french','east 42nd street'] },
    { label:'Turtle Bay',         sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#turtle-bay',       keywords:['turtle bay','united nations','un headquarters','east river midtown'] },
    { label:'Sutton Place',       sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#sutton-place',     keywords:['sutton place','sutton','queensboro bridge view','riverview terrace'] },
    { label:'Roosevelt Island',   sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#roosevelt-island', keywords:['roosevelt island','blackwell island','tramway','east river island'] },
    { label:'Lincoln Square',     sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#lincoln-square',   keywords:['lincoln square','lincoln center','san juan hill','columbus avenue'] },
    { label:'Upper East Side',    sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#upper-east-side',  keywords:['upper east side','ues','museum mile','fifth avenue museums'] },
    { label:'Carnegie Hill',      sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#carnegie-hill',    keywords:['carnegie hill','carnegie mansion','upper museum mile'] },
    { label:'Yorkville',          sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#yorkville',        keywords:['yorkville','germantown','german broadway','east end avenue'] },
    { label:'East Harlem',        sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#east-harlem',      keywords:['east harlem','el barrio','spanish harlem','italian harlem'] },
    { label:'Morningside Heights', sub:'Manhattan, NY',        type:'place',  url: p+'manhattan/index.html#morningside-heights', keywords:['morningside heights','columbia university','acropolis of new york'] },
    { label:'Manhattanville',     sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#manhattanville',   keywords:['manhattanville','west harlem','manhattanville campus','125th street valley'] },
    { label:'Hamilton Heights',   sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#hamilton-heights', keywords:['hamilton heights','sugar hill','hamilton grange','city college','rowhouse district'] },
    { label:'Washington Heights', sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#washington-heights', keywords:['washington heights','the heights','little dominican republic','in the heights','george washington bridge'] },
    { label:'Inwood',             sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['inwood','inwood hill park','dyckman street','northern manhattan'] },
    { label:'Marble Hill',        sub:'Manhattan, NY',         type:'place',  url: p+'manhattan/index.html#marble-hill',      keywords:['marble hill','manhattan on the mainland','harlem river ship canal','225th street'] },
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
    { label:'Brookfield Place',   sub:'Battery Park City, Manhattan', type:'place', url: p+'manhattan/index.html#battery-park-city', keywords:['brookfield place','le district','hudson eats','winter garden'] },
    { label:'African Burial Ground National Monument', sub:'Civic Center, Manhattan', type:'place', url: p+'manhattan/index.html#civic-center', keywords:['african burial ground','290 broadway','national monument'] },
    { label:'Nom Wah Tea Parlor', sub:'Chinatown, Manhattan',  type:'place',  url: p+'manhattan/index.html#chinatown',        keywords:['nom wah','dim sum doyers','oldest chinatown restaurant'] },
    { label:"Joe's Shanghai",     sub:'Chinatown, Manhattan',  type:'place',  url: p+'manhattan/index.html#chinatown',        keywords:['joes shanghai','soup dumplings','xiao long bao'] },
    { label:'Ferrara Bakery',     sub:'Little Italy, Manhattan', type:'place', url: p+'manhattan/index.html#little-italy',    keywords:['ferrara','ferrara bakery','cannoli little italy','italian bakery 1892'] },
    { label:"Lombardi's",         sub:'Nolita, Manhattan',     type:'place',  url: p+'manhattan/index.html#nolita',           keywords:['lombardis','first pizzeria','coal oven pizza spring street'] },
    { label:"St. Patrick's Old Cathedral", sub:'Nolita, Manhattan', type:'place', url: p+'manhattan/index.html#nolita',       keywords:['old st patricks','basilica mulberry street','catacombs tour'] },
    { label:"Katz's Delicatessen", sub:'Lower East Side, Manhattan', type:'place', url: p+'manhattan/index.html#lower-east-side', keywords:['katzs','katz deli','pastrami on rye','houston street deli'] },
    { label:'Russ & Daughters',   sub:'Lower East Side, Manhattan', type:'place', url: p+'manhattan/index.html#lower-east-side', keywords:['russ and daughters','appetizing','smoked fish','bagels and lox'] },
    { label:'Tenement Museum',    sub:'Lower East Side, Manhattan', type:'place', url: p+'manhattan/index.html#lower-east-side', keywords:['tenement museum','orchard street museum','immigrant history'] },
    { label:'Bowery Ballroom',    sub:'Lower East Side, Manhattan', type:'place', url: p+'manhattan/index.html#lower-east-side', keywords:['bowery ballroom','delancey concert venue','live music les'] },
    { label:'The Public Theater', sub:'NoHo, Manhattan',       type:'place',  url: p+'manhattan/index.html#noho',             keywords:['public theater','joe papp','shakespeare in the park','lafayette street theater'] },
    { label:"Joe's Pub",          sub:'NoHo, Manhattan',       type:'place',  url: p+'manhattan/index.html#noho',             keywords:['joes pub','joe’s pub','cabaret nyc','public theater music'] },
    { label:"Merchant's House Museum", sub:'NoHo, Manhattan',  type:'place',  url: p+'manhattan/index.html#noho',             keywords:['merchants house','historic house museum','east 4th street museum'] },
    { label:'Flatiron Building',  sub:'Flatiron District, Manhattan', type:'place', url: p+'manhattan/index.html#flatiron-district', keywords:['flatiron building','burnham skyscraper','175 fifth avenue'] },
    { label:'Eataly NYC Flatiron',sub:'Flatiron District, Manhattan', type:'place', url: p+'manhattan/index.html#flatiron-district', keywords:['eataly','italian market','italian food hall flatiron'] },
    { label:'Shake Shack (original)', sub:'Flatiron District, Manhattan', type:'place', url: p+'manhattan/index.html#flatiron-district', keywords:['shake shack','madison square park burgers','original shake shack'] },
    { label:'Eleven Madison Park',sub:'Flatiron District, Manhattan', type:'place', url: p+'manhattan/index.html#flatiron-district', keywords:['eleven madison park','emp','daniel humm','tasting menu nyc'] },
    { label:"Pete's Tavern",      sub:'Gramercy Park, Manhattan', type:'place', url: p+'manhattan/index.html#gramercy-park',   keywords:['petes tavern','oldest bar nyc','o henry','1864 tavern'] },
    { label:'Gramercy Tavern',    sub:'Gramercy Park, Manhattan', type:'place', url: p+'manhattan/index.html#gramercy-park',   keywords:['gramercy tavern','danny meyer','michelin star gramercy'] },
    { label:'National Arts Club', sub:'Gramercy Park, Manhattan', type:'place', url: p+'manhattan/index.html#gramercy-park',   keywords:['national arts club','free exhibitions gramercy','gramercy park south'] },
    { label:'The Ned NoMad',      sub:'NoMad, Manhattan',      type:'place',  url: p+'manhattan/index.html#nomad',            keywords:['ned nomad','nomad hotel','johnston building'] },
    { label:'Ace Hotel New York', sub:'NoMad, Manhattan',      type:'place',  url: p+'manhattan/index.html#nomad',            keywords:['ace hotel','lobby bar','stumptown coffee hotel'] },
    { label:'Museum of Sex',      sub:'NoMad, Manhattan',      type:'place',  url: p+'manhattan/index.html#nomad',            keywords:['museum of sex','mosex','fifth avenue museum'] },
    { label:'230 Fifth Rooftop',  sub:'NoMad, Manhattan',      type:'place',  url: p+'manhattan/index.html#nomad',            keywords:['230 fifth','rooftop bar nyc','rooftop igloos'] },
    { label:"Kalustyan's",        sub:'Kips Bay, Manhattan',   type:'place',  url: p+'manhattan/index.html#kips-bay',         keywords:['kalustyans','spice store nyc','curry hill','lexington spices'] },
    { label:'2nd Ave Deli',       sub:'Kips Bay, Manhattan',   type:'place',  url: p+'manhattan/index.html#kips-bay',         keywords:['2nd ave deli','second avenue deli','kosher deli nyc','matzo ball soup'] },
    { label:'AMC Kips Bay 15',    sub:'Kips Bay, Manhattan',   type:'place',  url: p+'manhattan/index.html#kips-bay',         keywords:['amc kips bay','movie theater east side','imax kips bay'] },
    { label:"Paddy Reilly's Music Bar", sub:'Kips Bay, Manhattan', type:'place', url: p+'manhattan/index.html#kips-bay',      keywords:['paddy reillys','irish music bar','live irish music nyc'] },
    { label:'The Morgan Library & Museum', sub:'Murray Hill, Manhattan', type:'place', url: p+'manhattan/index.html#murray-hill', keywords:['morgan library','pierpont morgan','manuscripts museum','madison avenue museum'] },
    { label:'Scandinavia House',  sub:'Murray Hill, Manhattan', type:'place', url: p+'manhattan/index.html#murray-hill',      keywords:['scandinavia house','nordic center','park avenue gallery'] },
    { label:"Sarge's Delicatessen", sub:'Murray Hill, Manhattan', type:'place', url: p+'manhattan/index.html#murray-hill',    keywords:['sarges deli','murray hill deli','pastrami third avenue'] },
    { label:'Sniffen Court',      sub:'Murray Hill, Manhattan', type:'place', url: p+'manhattan/index.html#murray-hill',      keywords:['sniffen court','historic mews','strange days doors cover'] },
    { label:'Whitney Museum of American Art', sub:'Meatpacking District, Manhattan', type:'place', url: p+'manhattan/index.html#meatpacking-district', keywords:['whitney','whitney museum','american art museum','gansevoort museum'] },
    { label:'Little Island',      sub:'Meatpacking District, Manhattan', type:'place', url: p+'manhattan/index.html#meatpacking-district', keywords:['little island','pier 55','floating park','heatherwick park'] },
    { label:'RH Rooftop Restaurant', sub:'Meatpacking District, Manhattan', type:'place', url: p+'manhattan/index.html#meatpacking-district', keywords:['rh rooftop','rh new york','restoration hardware restaurant'] },
    { label:'The Standard, High Line', sub:'Meatpacking District, Manhattan', type:'place', url: p+'manhattan/index.html#meatpacking-district', keywords:['standard high line','le bain','standard hotel meatpacking'] },
    { label:"Macy's Herald Square", sub:'Garment District, Manhattan', type:'place', url: p+'manhattan/index.html#garment-district', keywords:['macys','macy','herald square','wooden escalators','department store'] },
    { label:'Mood Designer Fabrics', sub:'Garment District, Manhattan', type:'place', url: p+'manhattan/index.html#garment-district', keywords:['mood fabrics','project runway store','fabric store nyc'] },
    { label:'The Skylark',        sub:'Garment District, Manhattan', type:'place', url: p+'manhattan/index.html#garment-district', keywords:['skylark','rooftop bar garment district','west 39th rooftop'] },
    { label:'Edge',               sub:'Hudson Yards, Manhattan', type:'place', url: p+'manhattan/index.html#hudson-yards',    keywords:['edge nyc','edge observation deck','city climb','30 hudson yards'] },
    { label:'Vessel',             sub:'Hudson Yards, Manhattan', type:'place', url: p+'manhattan/index.html#hudson-yards',    keywords:['vessel','the vessel','hudson yards staircase','heatherwick vessel'] },
    { label:'The Shed',           sub:'Hudson Yards, Manhattan', type:'place', url: p+'manhattan/index.html#hudson-yards',    keywords:['the shed','shed arts center','bloomberg building'] },
    { label:'Mercado Little Spain', sub:'Hudson Yards, Manhattan', type:'place', url: p+'manhattan/index.html#hudson-yards',  keywords:['mercado little spain','jose andres','spanish food hall'] },
    { label:'Intrepid Museum',    sub:"Hell's Kitchen, Manhattan", type:'place', url: p+'manhattan/index.html#hells-kitchen', keywords:['intrepid','intrepid museum','aircraft carrier museum','space shuttle enterprise','pier 86'] },
    { label:'Birdland',           sub:"Hell's Kitchen, Manhattan", type:'place', url: p+'manhattan/index.html#hells-kitchen', keywords:['birdland','birdland jazz club','jazz corner of the world','charlie parker club'] },
    { label:"Rudy's Bar & Grill", sub:"Hell's Kitchen, Manhattan", type:'place', url: p+'manhattan/index.html#hells-kitchen', keywords:['rudys','rudys bar','free hot dogs bar','hells kitchen dive'] },
    { label:'Restaurant Row',     sub:"Hell's Kitchen, Manhattan", type:'place', url: p+'manhattan/index.html#hells-kitchen', keywords:['restaurant row','west 46th street restaurants','becco','pre theater dining'] },
    { label:'Times Square',       sub:'Midtown West, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-west',    keywords:['times square','tkts','duffy square','crossroads of the world'] },
    { label:'Radio City Music Hall', sub:'Midtown West, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-west', keywords:['radio city','rockettes','christmas spectacular','showplace of the nation'] },
    { label:'Rockefeller Center', sub:'Midtown West, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-west',    keywords:['rockefeller center','top of the rock','30 rock','skylift','the beam'] },
    { label:'Museum of Modern Art', sub:'Midtown West, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-west',  keywords:['moma','museum of modern art','starry night museum'] },
    { label:'Carnegie Hall',      sub:'Midtown West, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-west',    keywords:['carnegie hall','57th street concert hall','berliner philharmoniker'] },
    { label:'Grand Central Terminal', sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east', keywords:['grand central','grand central terminal','whispering gallery','zodiac ceiling'] },
    { label:'The Campbell',       sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east',    keywords:['the campbell','campbell apartment','grand central bar','hidden bar'] },
    { label:'Grand Central Oyster Bar', sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east', keywords:['oyster bar','grand central oyster bar','guastavino tiles'] },
    { label:'Summit One Vanderbilt', sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east', keywords:['summit','one vanderbilt','summit one vanderbilt','mirror observation deck'] },
    { label:'Chrysler Building',  sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east',    keywords:['chrysler building','art deco skyscraper','lexington avenue landmark'] },
    { label:"St. Patrick's Cathedral", sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east', keywords:['st patricks cathedral','saint patricks','fifth avenue cathedral'] },
    { label:"P.J. Clarke's",      sub:'Midtown East, Manhattan', type:'place', url: p+'manhattan/index.html#midtown-east',    keywords:['pj clarkes','pj clarke','third avenue saloon','1884 bar'] },
    { label:'The Oval',           sub:'Stuyvesant Town, Manhattan', type:'place', url: p+'manhattan/index.html#stuyvesant-town', keywords:['the oval','stuyvesant oval','stuy town lawn','oval fountain'] },
    { label:'StuyTown Greenmarket', sub:'Stuyvesant Town, Manhattan', type:'place', url: p+'manhattan/index.html#stuyvesant-town', keywords:['stuytown greenmarket','stuyvesant town farmers market','sunday greenmarket'] },
    { label:'Movies on the Oval', sub:'Stuyvesant Town, Manhattan', type:'event', url: p+'manhattan/index.html#stuyvesant-town', keywords:['movies on the oval','stuy town movies','outdoor movies east village'] },
    { label:'Tudor City Greens',  sub:'Tudor City, Manhattan',  type:'place',  url: p+'manhattan/index.html#tudor-city',       keywords:['tudor city greens','tudor city parks','private park public'] },
    { label:'The 42nd Street Overpass', sub:'Tudor City, Manhattan', type:'place', url: p+'manhattan/index.html#tudor-city',   keywords:['tudor city overpass','tudor city bridge','manhattanhenge spot','chrysler building view'] },
    { label:'Ford Foundation Atrium', sub:'Tudor City, Manhattan', type:'place', url: p+'manhattan/index.html#tudor-city',     keywords:['ford foundation','atrium garden','indoor garden nyc','free gallery midtown'] },
    { label:'Tudor City Steakhouse', sub:'Tudor City, Manhattan', type:'place', url: p+'manhattan/index.html#tudor-city',      keywords:['tudor city steakhouse','steakhouse midtown east','dry aged steak un'] },
    { label:'United Nations Headquarters', sub:'Turtle Bay, Manhattan', type:'place', url: p+'manhattan/index.html#turtle-bay', keywords:['united nations','un headquarters','un tour','general assembly'] },
    { label:'Katharine Hepburn Garden', sub:'Turtle Bay, Manhattan', type:'place', url: p+'manhattan/index.html#turtle-bay',   keywords:['katharine hepburn garden','hepburn garden','dag plaza garden'] },
    { label:'Dag Hammarskjöld Plaza Greenmarket', sub:'Turtle Bay, Manhattan', type:'place', url: p+'manhattan/index.html#turtle-bay', keywords:['dag hammarskjold','dag plaza greenmarket','wednesday greenmarket','47th street market'] },
    { label:'Japan Society',      sub:'Turtle Bay, Manhattan',  type:'place',  url: p+'manhattan/index.html#turtle-bay',       keywords:['japan society','japanese culture nyc','japan society gallery'] },
    { label:'Smith & Wollensky',  sub:'Turtle Bay, Manhattan',  type:'place',  url: p+'manhattan/index.html#turtle-bay',       keywords:['smith and wollensky','smith wollensky','third avenue steakhouse','dry aged steak'] },
    { label:'Turtle Bay Gardens', sub:'Turtle Bay, Manhattan',  type:'place',  url: p+'manhattan/index.html#turtle-bay',       keywords:['turtle bay gardens','historic district','katharine hepburn house','sondheim house'] },
    { label:'Sutton Place Park',  sub:'Sutton Place, Manhattan', type:'place', url: p+'manhattan/index.html#sutton-place',     keywords:['sutton place park','porcellino boar','57th street river park','queensboro bridge view'] },
    { label:'Sutton Square & Riverview Terrace', sub:'Sutton Place, Manhattan', type:'place', url: p+'manhattan/index.html#sutton-place', keywords:['sutton square','riverview terrace','manhattan movie bench','woody allen poster spot'] },
    { label:'Bistro Vendôme',     sub:'Sutton Place, Manhattan', type:'place', url: p+'manhattan/index.html#sutton-place',     keywords:['bistro vendome','french bistro sutton','58th street bistro'] },
    { label:'Roosevelt Island Tramway', sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['roosevelt island tram','tramway','aerial tram nyc','cable car nyc'] },
    { label:'FDR Four Freedoms State Park', sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['four freedoms park','fdr memorial','louis kahn park'] },
    { label:'Blackwell House',    sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['blackwell house','1796 farmhouse','oldest house nyc'] },
    { label:'Roosevelt Island Lighthouse', sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['roosevelt island lighthouse','blackwell island light','lighthouse park'] },
    { label:'Cornell Tech',       sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['cornell tech','cornell campus','passive house campus'] },
    { label:'Roosevelt Island Farmers Market', sub:'Roosevelt Island, Manhattan', type:'place', url: p+'manhattan/index.html#roosevelt-island', keywords:['roosevelt island farmers market','good shepherd plaza','saturday market'] },
    { label:'Metropolitan Opera', sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square',  keywords:['met opera','metropolitan opera','opera nyc','macbeth 2026'] },
    { label:'New York Philharmonic', sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square', keywords:['new york philharmonic','ny phil','david geffen hall','dudamel'] },
    { label:'David H. Koch Theater', sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square', keywords:['koch theater','new york city ballet','nycb','nutcracker nyc'] },
    { label:'The Juilliard School', sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square', keywords:['juilliard','alice tully hall','chamber music society','free student concerts'] },
    { label:'The Smith Lincoln Square', sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square', keywords:['the smith','smith lincoln square','pre theater dinner lincoln center'] },
    { label:'Lincoln Center',     sub:'Lincoln Square, Manhattan', type:'place', url: p+'manhattan/index.html#lincoln-square',  keywords:['lincoln center','performing arts campus','lincoln center plaza'] },
    { label:'Old Homestead Steakhouse', sub:'Chelsea, Manhattan', type:'place', url: p+'manhattan/index.html#chelsea',        keywords:['old homestead','oldest steakhouse','ninth avenue steakhouse'] },
    { label:'The Frick Collection', sub:'Upper East Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-east-side', keywords:['frick','frick collection','frick mansion','old masters museum'] },
    { label:'Bemelmans Bar',      sub:'Upper East Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-east-side', keywords:['bemelmans','bemelmans bar','the carlyle','madeline murals','piano bar nyc'] },
    { label:'Neue Galerie & Café Sabarsky', sub:'Upper East Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-east-side', keywords:['neue galerie','cafe sabarsky','woman in gold','viennese cafe'] },
    { label:'Serendipity 3',      sub:'Upper East Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-east-side', keywords:['serendipity','serendipity 3','frozen hot chocolate','frrrozen hot chocolate'] },
    { label:'J.G. Melon',         sub:'Upper East Side, Manhattan', type:'place', url: p+'manhattan/index.html#upper-east-side', keywords:['jg melon','j.g. melon','melon burger','cottage fries'] },
    { label:'Solomon R. Guggenheim Museum', sub:'Carnegie Hill, Manhattan', type:'place', url: p+'manhattan/index.html#carnegie-hill', keywords:['guggenheim','guggenheim museum','frank lloyd wright spiral','museum mile'] },
    { label:'Cooper Hewitt, Smithsonian Design Museum', sub:'Carnegie Hill, Manhattan', type:'place', url: p+'manhattan/index.html#carnegie-hill', keywords:['cooper hewitt','design museum','carnegie mansion','smithsonian nyc'] },
    { label:'The Jewish Museum',  sub:'Carnegie Hill, Manhattan', type:'place', url: p+'manhattan/index.html#carnegie-hill',  keywords:['jewish museum','warburg mansion','judaica museum'] },
    { label:'The 92nd Street Y',  sub:'Carnegie Hill, Manhattan', type:'place', url: p+'manhattan/index.html#carnegie-hill',  keywords:['92nd street y','92ny','92y','kaufmann concert hall','harkness dance'] },
    { label:'The Corner Bookstore', sub:'Carnegie Hill, Manhattan', type:'place', url: p+'manhattan/index.html#carnegie-hill', keywords:['corner bookstore','madison avenue bookstore','carnegie hill books'] },
    { label:'Gracie Mansion',     sub:'Yorkville, Manhattan',  type:'place',  url: p+'manhattan/index.html#yorkville',        keywords:['gracie mansion','mayors residence','gracie mansion tours'] },
    { label:'Carl Schurz Park',   sub:'Yorkville, Manhattan',  type:'place',  url: p+'manhattan/index.html#yorkville',        keywords:['carl schurz park','john finley walk','hell gate promenade'] },
    { label:'Heidelberg Restaurant', sub:'Yorkville, Manhattan', type:'place', url: p+'manhattan/index.html#yorkville',       keywords:['heidelberg','german restaurant nyc','boot of beer','germantown yorkville'] },
    { label:'Schaller & Weber',   sub:'Yorkville, Manhattan',  type:'place',  url: p+'manhattan/index.html#yorkville',        keywords:['schaller and weber','schaller weber','german butcher','wurst nyc'] },
    { label:'El Museo del Barrio', sub:'East Harlem, Manhattan', type:'place', url: p+'manhattan/index.html#east-harlem',     keywords:['el museo del barrio','el museo','latino museum','puerto rican museum'] },
    { label:"Rao's",              sub:'East Harlem, Manhattan', type:'place', url: p+'manhattan/index.html#east-harlem',      keywords:['raos','rao','impossible reservation','114th street italian'] },
    { label:"Patsy's Pizzeria (original)", sub:'East Harlem, Manhattan', type:'place', url: p+'manhattan/index.html#east-harlem', keywords:['patsys','patsys pizzeria','coal oven pizza harlem','original patsys 1933'] },
    { label:'La Marqueta',        sub:'East Harlem, Manhattan', type:'place', url: p+'manhattan/index.html#east-harlem',      keywords:['la marqueta','park avenue market','el barrio market'] },
    { label:'Graffiti Hall of Fame', sub:'East Harlem, Manhattan', type:'place', url: p+'manhattan/index.html#east-harlem',   keywords:['graffiti hall of fame','106th and park','jackie robinson complex murals'] },
    { label:'Cathedral of St. John the Divine', sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['st john the divine','largest cathedral','vertical tour','cathedral peacocks'] },
    { label:'Columbia University', sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['columbia','columbia university','low steps','low memorial library'] },
    { label:'Riverside Church',   sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['riverside church','carillon','bell tower tour','bourdon bell'] },
    { label:"Grant's Tomb",       sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['grants tomb','general grant national memorial','grant mausoleum'] },
    { label:"Tom's Restaurant",   sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['toms restaurant','toms diner','monks cafe','seinfeld diner','suzanne vega'] },
    { label:'Hungarian Pastry Shop', sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['hungarian pastry shop','amsterdam avenue cafe','columbia writers cafe'] },
    { label:'Miller Theatre',     sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['miller theatre','composer portraits','columbia concert hall'] },
    { label:'Dinosaur Bar-B-Que', sub:'Morningside Heights, Manhattan', type:'place', url: p+'manhattan/index.html#morningside-heights', keywords:['dinosaur bar-b-que','dinosaur bbq','harlem barbecue','125th street bbq'] },
    { label:'The Forum at Columbia', sub:'Manhattanville, Manhattan', type:'place', url: p+'manhattan/index.html#manhattanville', keywords:['the forum','forum columbia','manhattanville campus','renzo piano columbia'] },
    { label:'Wallach Art Gallery', sub:'Manhattanville, Manhattan', type:'place', url: p+'manhattan/index.html#manhattanville', keywords:['wallach art gallery','lenfest center','free gallery uptown'] },
    { label:'Jerome L. Greene Science Center', sub:'Manhattanville, Manhattan', type:'place', url: p+'manhattan/index.html#manhattanville', keywords:['greene science center','zuckerman institute','brain science education lab'] },
    { label:'West Harlem Piers Park', sub:'Manhattanville, Manhattan', type:'place', url: p+'manhattan/index.html#manhattanville', keywords:['west harlem piers','harlem piers park','hudson river piers uptown'] },
    { label:'Hamilton Grange National Memorial', sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['hamilton grange','alexander hamilton house','the grange','hamilton memorial'] },
    { label:'City College & Shepard Hall', sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['city college','ccny','shepard hall','gothic campus','convent avenue'] },
    { label:'Trinity Church Cemetery & Mausoleum', sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['trinity cemetery','audubon grave','only active cemetery manhattan','ed koch grave'] },
    { label:'Riverbank State Park', sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['riverbank state park','denny farrell','rooftop park','state park hudson'] },
    { label:'Harlem Public',      sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['harlem public','burger bar uptown','craft beer hamilton heights'] },
    { label:'The Handpulled Noodle', sub:'Hamilton Heights, Manhattan', type:'place', url: p+'manhattan/index.html#hamilton-heights', keywords:['handpulled noodle','hand pulled noodles','ding ding noodles','cumin lamb'] },
    { label:'The Met Cloisters',  sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['the cloisters','met cloisters','medieval museum','fort tryon museum','unicorn tapestries'] },
    { label:'Fort Tryon Park',    sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['fort tryon park','heather garden','rockefeller park gift','190th street'] },
    { label:'Morris-Jumel Mansion', sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['morris jumel mansion','oldest house in manhattan','washington headquarters 1776','jumel terrace'] },
    { label:'Sylvan Terrace',     sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['sylvan terrace','wooden rowhouses','cobblestone lane','1882 houses'] },
    { label:'United Palace',      sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['united palace','wonder theatre','loews 175th','lin-manuel miranda theater','in the heights premiere'] },
    { label:'Hispanic Society Museum & Library', sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['hispanic society','audubon terrace','sorolla vision of spain','free museum uptown','goya'] },
    { label:'Malecon',            sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['malecon','el malecon','dominican restaurant','pollo al carbon','roast chicken washington heights'] },
    { label:'Word Up Community Bookshop', sub:'Washington Heights, Manhattan', type:'place', url: p+'manhattan/index.html#washington-heights', keywords:['word up','word up books','libreria comunitaria','community bookshop uptown'] },
    { label:'Inwood Hill Park',   sub:'Inwood, Manhattan',     type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['inwood hill park','last natural forest','salt marsh manhattan','glacial caves'] },
    { label:'Shorakkopoch Rock',  sub:'Inwood, Manhattan',     type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['shorakkopoch','peter minuit rock','manhattan purchase 1626','tulip tree marker'] },
    { label:'Dyckman Farmhouse Museum', sub:'Inwood, Manhattan', type:'place', url: p+'manhattan/index.html#inwood',          keywords:['dyckman farmhouse','last farmhouse manhattan','dutch colonial house','1784 farmhouse'] },
    { label:'Indian Road Café',   sub:'Inwood, Manhattan',     type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['indian road cafe','inwood cafe','218th street cafe'] },
    { label:'Tryon Public House', sub:'Inwood, Manhattan',     type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['tryon public house','inwood gastropub','craft beer inwood','dyckman pub'] },
    { label:'Mamajuana Café',     sub:'Inwood, Manhattan',     type:'place',  url: p+'manhattan/index.html#inwood',           keywords:['mamajuana cafe','dyckman restaurant','dominican fusion','dyckman nightlife'] },
    { label:'Broadway Bridge & the Ship Canal', sub:'Marble Hill, Manhattan', type:'place', url: p+'manhattan/index.html#marble-hill', keywords:['broadway bridge','harlem river ship canal','lift bridge','the cut 1895'] },
    { label:'River Plaza & 225th St Strip', sub:'Marble Hill, Manhattan', type:'place', url: p+'manhattan/index.html#marble-hill', keywords:['river plaza','target marble hill','225th street shopping'] },
    { label:'Marble Hill Houses', sub:'Marble Hill, Manhattan', type:'place', url: p+'manhattan/index.html#marble-hill',      keywords:['marble hill houses','nycha marble hill','marble hill nycha 1952'] },
    { label:'Feast of San Gennaro', sub:'Sep 17–27 · Little Italy', type:'event', url: p+'manhattan/index.html#little-italy',  keywords:['san gennaro','feast of san gennaro','little italy festival','mulberry street festival'] },
    { label:'Tribeca Festival',   sub:'Jun · Tribeca',         type:'event',  url: p+'manhattan/index.html#tribeca',          keywords:['tribeca festival','tribeca film festival','robert de niro film festival'] },
    { label:'Village Halloween Parade', sub:'Oct 31 · Greenwich Village', type:'event', url: p+'manhattan/index.html#greenwich-village', keywords:['village halloween parade','halloween parade nyc','sixth avenue parade'] },
    { label:'Harlem Week',        sub:'Aug 1–16 · Harlem',     type:'event',  url: p+'manhattan/index.html#harlem',           keywords:['harlem week','harlem day','a great day in harlem'] },
    { label:'Gorillaz at Madison Square Garden', sub:'Sep 29 · Chelsea', type:'event', url: p+'manhattan/index.html#chelsea', keywords:['gorillaz','the mountain tour','msg concert','madison square garden concert'] },
    { label:'Doja Cat at Madison Square Garden', sub:'Dec 1 · Chelsea',  type:'event', url: p+'manhattan/index.html#chelsea', keywords:['doja cat','tour ma vie','msg concert','madison square garden concert'] },
    { label:'Open House New York Weekend', sub:'Oct 16–18 · 300+ sites citywide', type:'event', url: p+'manhattan/index.html', keywords:['open house new york','ohny','ohny weekend','architecture tours','behind the scenes nyc'] },
    { label:'TCS New York City Marathon', sub:'Nov 1 · 50th five-borough running', type:'event', url: p+'manhattan/index.html', keywords:['nyc marathon','new york city marathon','tcs marathon','marathon sunday','central park finish'] },
    { label:"Macy's Thanksgiving Day Parade", sub:'Nov 26 · steps off W 77th & Central Park West', type:'event', url: p+'manhattan/index.html#upper-west-side', keywords:['macys parade','thanksgiving parade','thanksgiving day parade','balloons','herald square parade','100th parade'] },
    { label:'The Chicks at Beacon Theatre', sub:'Oct 10, 12 & 13 · Upper West Side', type:'event', url: p+'manhattan/index.html#upper-west-side', keywords:['the chicks','dixie chicks','taking the long way tour','beacon concert','beacon theatre concert'] },
    { label:'Christmas Spectacular at Radio City', sub:'Nov 4 – Jan 4 · Midtown West', type:'event', url: p+'manhattan/index.html#midtown-west', keywords:['christmas spectacular','rockettes','radio city christmas','rockettes christmas show'] },
    // ── Queens ──
    { label:'Queens, NY',         sub:'New York',              type:'place',  url: p+'queens/index.html',                     keywords:['queens','queens ny','queens county','worlds borough','most diverse borough'] },
    { label:'Long Island City',   sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#long-island-city',    keywords:['long island city','lic','hunters point','queens plaza','gantry'] },
    { label:'Astoria',            sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#astoria',             keywords:['astoria','ditmars','steinway street','greek queens'] },
    { label:'Sunnyside',          sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#sunnyside',           keywords:['sunnyside','sunnyside gardens','sunnyside queens','skillman avenue'] },
    { label:'Jackson Heights',    sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#jackson-heights',     keywords:['jackson heights','little india','diversity plaza','74th street','roosevelt avenue'] },
    { label:'Elmhurst',           sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#elmhurst',            keywords:['elmhurst','newtown','elmhurst chinatown','little thailand'] },
    { label:'Corona',             sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#corona',              keywords:['corona','flushing meadows','flushing meadows corona park','worlds fair park'] },
    { label:'Flushing',           sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#flushing',            keywords:['flushing','main street flushing','flushing chinatown','downtown flushing'] },
    { label:'Forest Hills',       sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#forest-hills',        keywords:['forest hills','forest hills gardens','austin street','station square'] },
    { label:'Ridgewood',          sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#ridgewood',           keywords:['ridgewood','ridgewood queens','fresh pond road'] },
    { label:'Rockaway Beach',     sub:'Queens, NY',            type:'place',  url: p+'queens/index.html#rockaway-beach',      keywords:['rockaway','rockaway beach','the rockaways','surf nyc','boardwalk queens'] },
    { label:'MoMA PS1',           sub:'Long Island City, Queens', type:'place', url: p+'queens/index.html#long-island-city',  keywords:['moma ps1','ps1','contemporary art queens','free museum 2026'] },
    { label:'Gantry Plaza State Park', sub:'Long Island City, Queens', type:'place', url: p+'queens/index.html#long-island-city', keywords:['gantry plaza','gantry state park','pepsi cola sign','lic waterfront'] },
    { label:'Casa Enrique',       sub:'Long Island City, Queens', type:'place', url: p+'queens/index.html#long-island-city',  keywords:['casa enrique','michelin mexican','cosme aguilar','lic mexican'] },
    { label:'Dutch Kills',        sub:'Cocktail Bar · Long Island City', type:'place', url: p+'queens/index.html#long-island-city', keywords:['dutch kills','dutch kills bar','cocktail bar queens','jackson avenue bar'] },
    { label:'Culture Lab LIC',    sub:'Long Island City, Queens', type:'place', url: p+'queens/index.html#long-island-city',  keywords:['culture lab','culture lab lic','live in the lot','free concerts queens'] },
    { label:'Ravel Hotel',        sub:'Long Island City, Queens', type:'place', url: p+'queens/index.html#long-island-city',  keywords:['ravel hotel','ravel','profundo','lic hotel','queens hotel'] },
    { label:'Museum of the Moving Image', sub:'Astoria, Queens', type:'place', url: p+'queens/index.html#astoria',           keywords:['museum of the moving image','momi','jim henson exhibition','film museum'] },
    { label:'Socrates Sculpture Park', sub:'Astoria, Queens',   type:'place', url: p+'queens/index.html#astoria',            keywords:['socrates sculpture park','outdoor sculpture','vernon boulevard park'] },
    { label:'Astoria Park & Pool', sub:'Astoria, Queens',       type:'place', url: p+'queens/index.html#astoria',            keywords:['astoria park','astoria pool','largest pool nyc','hell gate bridge'] },
    { label:'Bohemian Hall & Beer Garden', sub:'Astoria, Queens', type:'place', url: p+'queens/index.html#astoria',          keywords:['bohemian hall','beer garden astoria','oldest beer garden','czech beer garden'] },
    { label:'Taverna Kyclades',   sub:'Astoria, Queens',        type:'place', url: p+'queens/index.html#astoria',            keywords:['taverna kyclades','kyclades','greek seafood astoria','ditmars restaurant'] },
    { label:'Sunnyside Gardens',  sub:'Sunnyside, Queens',      type:'place', url: p+'queens/index.html#sunnyside',          keywords:['sunnyside gardens','first garden community','planned community queens'] },
    { label:"Philomena's",        sub:'Sunnyside, Queens',      type:'place', url: p+'queens/index.html#sunnyside',          keywords:['philomenas','philomenas pizza','pizza sunnyside','queens pizza'] },
    { label:'Bolivian Llama Party', sub:'Sunnyside, Queens',    type:'place', url: p+'queens/index.html#sunnyside',          keywords:['bolivian llama party','saltenas','bolivian food nyc'] },
    { label:'Diversity Plaza',    sub:'Jackson Heights, Queens', type:'place', url: p+'queens/index.html#jackson-heights',   keywords:['diversity plaza','37th road plaza','jackson heights plaza'] },
    { label:'Arepa Lady',         sub:'Jackson Heights, Queens', type:'place', url: p+'queens/index.html#jackson-heights',   keywords:['arepa lady','arepas queens','maria piedad cano','colombian street food'] },
    { label:"Jahn's",             sub:'Jackson Heights, Queens', type:'place', url: p+'queens/index.html#jackson-heights',   keywords:['jahns','jahns ice cream','kitchen sink sundae','old diner queens'] },
    { label:'Ayada Thai',         sub:'Elmhurst, Queens',       type:'place', url: p+'queens/index.html#elmhurst',           keywords:['ayada','ayada thai','thai elmhurst'] },
    { label:'Zaab Zaab',          sub:'Elmhurst, Queens',       type:'place', url: p+'queens/index.html#elmhurst',           keywords:['zaab zaab','isan thai','larb queens'] },
    { label:'Terraza 7',          sub:'Live Music · Elmhurst, Queens', type:'place', url: p+'queens/index.html#elmhurst',    keywords:['terraza 7','terraza siete','latin jazz queens','live music elmhurst'] },
    { label:'Louis Armstrong House Museum', sub:'Corona, Queens', type:'place', url: p+'queens/index.html#corona',           keywords:['louis armstrong house','armstrong museum','satchmo','armstrong center'] },
    { label:'Lemon Ice King of Corona', sub:'Corona, Queens',   type:'place', url: p+'queens/index.html#corona',             keywords:['lemon ice king','italian ices','king of queens corner','benfaremo'] },
    { label:'Unisphere',          sub:'Flushing Meadows Corona Park', type:'place', url: p+'queens/index.html#corona',       keywords:['unisphere','worlds fair globe','flushing meadows globe'] },
    { label:'Queens Museum',      sub:'Flushing Meadows Corona Park', type:'place', url: p+'queens/index.html#corona',       keywords:['queens museum','panorama of the city of new york','panorama nyc'] },
    { label:'New York Hall of Science', sub:'Corona, Queens',   type:'place', url: p+'queens/index.html#corona',             keywords:['hall of science','nysci','science museum queens'] },
    { label:'USTA Billie Jean King National Tennis Center', sub:'Flushing Meadows', type:'place', url: p+'queens/index.html#corona', keywords:['usta','billie jean king','arthur ashe stadium','tennis center'] },
    { label:'New World Mall Food Court', sub:'Flushing, Queens', type:'place', url: p+'queens/index.html#flushing',          keywords:['new world mall','flushing food court','roosevelt ave mall'] },
    { label:'Nan Xiang Xiao Long Bao', sub:'Flushing, Queens',  type:'place', url: p+'queens/index.html#flushing',           keywords:['nan xiang','xiao long bao','soup dumplings flushing'] },
    { label:'Flushing Town Hall', sub:'Flushing, Queens',       type:'place', url: p+'queens/index.html#flushing',           keywords:['flushing town hall','jazz queens','world music queens'] },
    { label:'Queens Botanical Garden', sub:'Flushing, Queens',  type:'place', url: p+'queens/index.html#flushing',           keywords:['queens botanical garden','qbg','garden flushing'] },
    { label:'Friends Quaker Meeting House', sub:'Flushing, Queens', type:'place', url: p+'queens/index.html#flushing',       keywords:['quaker meeting house','friends meeting house','oldest house of worship nyc','flushing remonstrance'] },
    { label:'Forest Hills Stadium', sub:'Forest Hills, Queens', type:'place', url: p+'queens/index.html#forest-hills',       keywords:['forest hills stadium','tennis stadium concerts','west side tennis club stadium'] },
    { label:"Eddie's Sweet Shop", sub:'Forest Hills, Queens',   type:'place', url: p+'queens/index.html#forest-hills',       keywords:['eddies sweet shop','soda fountain queens','ice cream forest hills'] },
    { label:'Station Square',     sub:'Forest Hills Gardens, Queens', type:'place', url: p+'queens/index.html#forest-hills', keywords:['station square','forest hills gardens','tudor square queens'] },
    { label:'Gottscheer Hall',    sub:'Ridgewood, Queens',      type:'place', url: p+'queens/index.html#ridgewood',          keywords:['gottscheer hall','gottschee','german hall queens','ridgewood hall'] },
    { label:'Nowadays',           sub:'Ridgewood, Queens',      type:'place', url: p+'queens/index.html#ridgewood',          keywords:['nowadays','nowadays club','dance club ridgewood','outdoor club queens'] },
    { label:'TV Eye',             sub:'Ridgewood, Queens',      type:'place', url: p+'queens/index.html#ridgewood',          keywords:['tv eye','tv eye nyc','rock club ridgewood','venue ridgewood'] },
    { label:"Rolo's",             sub:'Ridgewood, Queens',      type:'place', url: p+'queens/index.html#ridgewood',          keywords:['rolos','rolos ridgewood','wood fired queens','onderdonk restaurant'] },
    { label:'Vander Ende-Onderdonk House', sub:'Ridgewood, Queens', type:'place', url: p+'queens/index.html#ridgewood',      keywords:['onderdonk house','vander ende','dutch colonial house','oldest stone house nyc'] },
    { label:'Rockaway Beach Surf Club', sub:'Rockaway Beach, Queens', type:'place', url: p+'queens/index.html#rockaway-beach', keywords:['rockaway beach surf club','tacoway beach','fish tacos rockaway','surf club'] },
    { label:'Rippers',            sub:'Rockaway Beach, Queens', type:'place', url: p+'queens/index.html#rockaway-beach',     keywords:['rippers','rockaway burgers','boardwalk burgers'] },
    { label:"Connolly's",         sub:'Rockaway Beach, Queens', type:'place', url: p+'queens/index.html#rockaway-beach',     keywords:['connollys','pina colada rockaway','beach 95th bar'] },
    { label:'US Open Tennis',     sub:'Aug 23 – Sep 13 · USTA Billie Jean King NTC', type:'event', url: p+'queens/index.html#corona', keywords:['us open','us open tennis','tennis grand slam','arthur ashe','fan week','flushing meadows tennis'] },
    { label:'Queens Night Market', sub:'Saturdays · resumes Sep 19 – Oct 31 · NY Hall of Science', type:'event', url: p+'queens/index.html#corona', keywords:['queens night market','night market','food market queens','flushing meadows food'] },
    { label:'Zac Brown Band at Forest Hills', sub:'Aug 27–28 · Forest Hills Stadium', type:'event', url: p+'queens/index.html#forest-hills', keywords:['zac brown band','zac brown forest hills','country queens'] },
    { label:'Erykah Badu at Forest Hills', sub:'Sep 18 · Forest Hills Stadium', type:'event', url: p+'queens/index.html#forest-hills', keywords:['erykah badu','badu forest hills','neo soul concert'] },
    { label:'David Byrne at Forest Hills', sub:'Sep 19 · Forest Hills Stadium', type:'event', url: p+'queens/index.html#forest-hills', keywords:['david byrne','talking heads','byrne forest hills'] },
    { label:'Queens Jazz Trail Concert Series', sub:'Free Thursdays 7 PM thru August · parks across Queens', type:'event', url: p+'queens/index.html#flushing', keywords:['queens jazz trail','free jazz queens','armstrong jazz series'] },
    { label:'Mets at Citi Field', sub:'Home games thru September · Willets Point', type:'sports', url: p+'queens/index.html#corona', keywords:['mets','new york mets','citi field','mets tickets','baseball queens'] },
    // ── Brooklyn ──
    { label:'Brooklyn, NY',       sub:'New York',              type:'place',  url: p+'brooklyn/index.html',                   keywords:['brooklyn','brooklyn ny','kings county','most populous borough','bk'] },
    { label:'Williamsburg',       sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#williamsburg',      keywords:['williamsburg','bedford avenue','northside brooklyn','southside brooklyn','domino'] },
    { label:'Greenpoint',         sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#greenpoint',        keywords:['greenpoint','little poland','manhattan avenue brooklyn','polish brooklyn'] },
    { label:'DUMBO',              sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#dumbo',             keywords:['dumbo','down under the manhattan bridge','washington street view','fulton ferry','between the bridges'] },
    { label:'Brooklyn Heights',   sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#brooklyn-heights',  keywords:['brooklyn heights','promenade','montague street','americas first suburb'] },
    { label:'Downtown Brooklyn',  sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['downtown brooklyn','borough hall','fulton street brooklyn','city point','albee square'] },
    { label:'Fort Greene',        sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#fort-greene',       keywords:['fort greene','bam district','lafayette avenue brooklyn','fort greene park'] },
    { label:'Park Slope',         sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#park-slope',        keywords:['park slope','fifth avenue brooklyn','seventh avenue brooklyn','the slope'] },
    { label:'Prospect Heights',   sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#prospect-heights',  keywords:['prospect heights','vanderbilt avenue','eastern parkway','museum brooklyn'] },
    { label:'Bushwick',           sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#bushwick',          keywords:['bushwick','murals brooklyn','troutman street','wyckoff avenue'] },
    { label:'Coney Island',       sub:'Brooklyn, NY',          type:'place',  url: p+'brooklyn/index.html#coney-island',      keywords:['coney island','coney','boardwalk','peoples playground','surf avenue'] },
    { label:'Smorgasburg Williamsburg', sub:'Sat 11–6 thru October · Marsha P. Johnson SP', type:'event', url: p+'brooklyn/index.html#williamsburg', keywords:['smorgasburg','food market brooklyn','kent avenue market','marsha p johnson park'] },
    { label:'Brooklyn Brewery',   sub:'Last N 11th St pours Aug 29 · new home 1 Wythe Ave this fall', type:'place', url: p+'brooklyn/index.html#williamsburg', keywords:['brooklyn brewery','brewery williamsburg','1 wythe','north 11th brewery'] },
    { label:'Peter Luger Steak House', sub:'Williamsburg, Brooklyn · Est. 1887', type:'place', url: p+'brooklyn/index.html#williamsburg', keywords:['peter luger','luger steakhouse','porterhouse brooklyn','oldest steakhouse'] },
    { label:'Music Hall of Williamsburg', sub:'Final year — closes end of 2026', type:'place', url: p+'brooklyn/index.html#williamsburg', keywords:['music hall of williamsburg','mhow','bowery presents brooklyn','north 6th venue'] },
    { label:'Domino Park',        sub:'Williamsburg, Brooklyn', type:'place', url: p+'brooklyn/index.html#williamsburg',      keywords:['domino park','domino sugar refinery','kent avenue park'] },
    { label:'National Sawdust',   sub:'Williamsburg, Brooklyn', type:'place', url: p+'brooklyn/index.html#williamsburg',      keywords:['national sawdust','new music brooklyn','experimental music venue'] },
    { label:"Baby's All Right",   sub:'Williamsburg, Brooklyn', type:'place', url: p+'brooklyn/index.html#williamsburg',      keywords:['babys all right','babys alright','indie venue brooklyn','broadway brooklyn venue'] },
    { label:'McCarren Park & Pool', sub:'Williamsburg/Greenpoint line', type:'place', url: p+'brooklyn/index.html#williamsburg', keywords:['mccarren park','mccarren pool','wpa pool brooklyn','lorimer street park'] },
    { label:'WNYC Transmitter Park', sub:'Greenpoint, Brooklyn', type:'place', url: p+'brooklyn/index.html#greenpoint',       keywords:['transmitter park','wnyc park','greenpoint waterfront','fishing pier brooklyn'] },
    { label:'Warsaw',             sub:'Polish National Home · Greenpoint', type:'place', url: p+'brooklyn/index.html#greenpoint', keywords:['warsaw','warsaw concerts','polish national home','pierogi concert venue'] },
    { label:'Karczma',            sub:'Greenpoint, Brooklyn',  type:'place',  url: p+'brooklyn/index.html#greenpoint',        keywords:['karczma','polish tavern brooklyn','greenpoint avenue polish'] },
    { label:'Peter Pan Donut & Pastry Shop', sub:'Greenpoint, Brooklyn · Since 1953', type:'place', url: p+'brooklyn/index.html#greenpoint', keywords:['peter pan donuts','peter pan bakery','donuts greenpoint','manhattan avenue donuts'] },
    { label:'Brooklyn Bridge Park', sub:'Empire Fulton Ferry · DUMBO', type:'place', url: p+'brooklyn/index.html#dumbo',      keywords:['brooklyn bridge park','empire fulton ferry','pier 1 brooklyn','waterfront park brooklyn'] },
    { label:"Jane's Carousel",    sub:'Brooklyn Bridge Park · DUMBO', type:'place', url: p+'brooklyn/index.html#dumbo',       keywords:['janes carousel','carousel brooklyn','dock street carousel'] },
    { label:'Time Out Market New York', sub:'Empire Stores · DUMBO', type:'place', url: p+'brooklyn/index.html#dumbo',        keywords:['time out market','food hall dumbo','empire stores','water street food hall'] },
    { label:"St. Ann's Warehouse", sub:'DUMBO · Fall 2026 season', type:'place', url: p+'brooklyn/index.html#dumbo',          keywords:['st anns warehouse','saint anns warehouse','theater dumbo','kramer fauci'] },
    { label:"Juliana's",          sub:'Pizza · 19 Old Fulton St, DUMBO', type:'place', url: p+'brooklyn/index.html#dumbo',    keywords:['julianas','julianas pizza','patsy grimaldi','coal oven pizza brooklyn'] },
    { label:"Grimaldi's",         sub:'Pizza · 1 Front St, DUMBO', type:'place', url: p+'brooklyn/index.html#dumbo',          keywords:['grimaldis','grimaldis pizza','front street pizza'] },
    { label:'Brooklyn Heights Promenade', sub:'Brooklyn Heights', type:'place', url: p+'brooklyn/index.html#brooklyn-heights', keywords:['promenade','brooklyn heights promenade','esplanade brooklyn','skyline view brooklyn'] },
    { label:'Center for Brooklyn History', sub:'128 Pierrepont St · Wed–Sun', type:'place', url: p+'brooklyn/index.html#brooklyn-heights', keywords:['center for brooklyn history','brooklyn historical society','pierrepont history'] },
    { label:'Plymouth Church',    sub:'Brooklyn Heights · Est. 1847', type:'place', url: p+'brooklyn/index.html#brooklyn-heights', keywords:['plymouth church','henry ward beecher','underground railroad brooklyn','orange street church'] },
    { label:"Sahadi's",           sub:'Atlantic Ave · Since 1948', type:'place', url: p+'brooklyn/index.html#brooklyn-heights', keywords:['sahadis','middle eastern grocer','atlantic avenue grocer','olives nuts spices'] },
    { label:'New York Transit Museum', sub:'99 Schermerhorn St · Brooklyn Heights', type:'place', url: p+'brooklyn/index.html#brooklyn-heights', keywords:['transit museum','subway museum','vintage subway cars','schermerhorn museum'] },
    { label:'Dekalb Market Hall', sub:'Downtown Brooklyn',     type:'place',  url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['dekalb market hall','food hall downtown brooklyn','albee square food'] },
    { label:"Junior's",           sub:'Cheesecake · Flatbush & DeKalb', type:'place', url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['juniors','juniors cheesecake','cheesecake brooklyn','flatbush dekalb'] },
    { label:'Brooklyn Borough Hall', sub:'Downtown Brooklyn',  type:'place',  url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['borough hall','brooklyn borough hall','joralemon street'] },
    { label:'Alamo Drafthouse City Point', sub:'Downtown Brooklyn', type:'place', url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['alamo drafthouse','dine in cinema brooklyn','city point movies'] },
    { label:'Brooklyn Book Festival', sub:'Sep 20–28 · Festival Day Sep 27 at Borough Hall', type:'event', url: p+'brooklyn/index.html#downtown-brooklyn', keywords:['brooklyn book festival','book festival','literary festival brooklyn','festival day'] },
    { label:'Fort Greene Park',   sub:'Fort Greene, Brooklyn', type:'place',  url: p+'brooklyn/index.html#fort-greene',       keywords:['fort greene park','prison ship martyrs monument','martyrs monument','stanford white column'] },
    { label:'BAM',                sub:'Brooklyn Academy of Music · Fort Greene', type:'place', url: p+'brooklyn/index.html#fort-greene', keywords:['bam','brooklyn academy of music','next wave','peter jay sharp','harvey theater'] },
    { label:'Brooklyn Paramount', sub:'Concert hall · Flatbush Ave Ext', type:'place', url: p+'brooklyn/index.html#fort-greene', keywords:['brooklyn paramount','paramount theatre brooklyn','movie palace concerts'] },
    { label:'Greenlight Bookstore', sub:'Fort Greene, Brooklyn', type:'place', url: p+'brooklyn/index.html#fort-greene',      keywords:['greenlight bookstore','bookstore fort greene','fulton street books'] },
    { label:'Habana Outpost',     sub:'Fort Greene, Brooklyn · Seasonal', type:'place', url: p+'brooklyn/index.html#fort-greene', keywords:['habana outpost','cuban fort greene','fulton street cuban'] },
    { label:'Fort Greene Park Greenmarket', sub:'Saturdays year-round 8–4', type:'event', url: p+'brooklyn/index.html#fort-greene', keywords:['fort greene greenmarket','farmers market fort greene','washington park market'] },
    { label:'Barclays Center',    sub:'Atlantic & Flatbush · Nets, Liberty & concerts', type:'place', url: p+'brooklyn/index.html#park-slope', keywords:['barclays center','barclays','nets arena','brooklyn arena','atlantic yards'] },
    { label:'Grand Army Plaza Greenmarket', sub:'Saturdays year-round 8–4', type:'event', url: p+'brooklyn/index.html#park-slope', keywords:['grand army plaza greenmarket','farmers market brooklyn','gap greenmarket'] },
    { label:"Soldiers' & Sailors' Memorial Arch", sub:'Grand Army Plaza · Restored 2025', type:'place', url: p+'brooklyn/index.html#park-slope', keywords:['soldiers and sailors arch','memorial arch brooklyn','grand army plaza arch','triumphal arch'] },
    { label:'Union Hall',         sub:'Park Slope · Bocce & basement stage', type:'place', url: p+'brooklyn/index.html#park-slope', keywords:['union hall','bocce bar brooklyn','union street bar','secret shows'] },
    { label:'al di là Trattoria', sub:'Park Slope · Since 1998', type:'place', url: p+'brooklyn/index.html#park-slope',        keywords:['al di la','aldila trattoria','venetian brooklyn','fifth avenue italian'] },
    { label:'Barbès',             sub:'Park Slope · World music nightly', type:'place', url: p+'brooklyn/index.html#park-slope', keywords:['barbes','barbes brooklyn','world music brooklyn','9th street bar'] },
    { label:'The Old Stone House', sub:'Battle of Brooklyn · Washington Park', type:'place', url: p+'brooklyn/index.html#park-slope', keywords:['old stone house','battle of brooklyn','maryland 400','vechte cortelyou'] },
    { label:'Brooklyn Museum',    sub:'200 Eastern Parkway · First Saturdays', type:'place', url: p+'brooklyn/index.html#prospect-heights', keywords:['brooklyn museum','first saturdays','eastern parkway museum','beaux arts museum'] },
    { label:'Brooklyn Botanic Garden', sub:'Prospect Heights, Brooklyn', type:'place', url: p+'brooklyn/index.html#prospect-heights', keywords:['brooklyn botanic garden','bbg','botanic garden','washington avenue garden'] },
    { label:'Prospect Park',      sub:'526 acres · Olmsted & Vaux', type:'place', url: p+'brooklyn/index.html#prospect-heights', keywords:['prospect park','long meadow','olmsted vaux park','grand army plaza park'] },
    { label:'Central Library',    sub:'Brooklyn Public Library · Grand Army Plaza', type:'place', url: p+'brooklyn/index.html#prospect-heights', keywords:['central library','brooklyn public library','art deco library','grand army plaza library'] },
    { label:'Vanderbilt Avenue Open Street', sub:'Saturdays noon–10 thru September', type:'event', url: p+'brooklyn/index.html#prospect-heights', keywords:['vanderbilt open street','open streets brooklyn','car free vanderbilt'] },
    { label:'West Indian American Day Carnival', sub:'Labor Day Sep 7 · Eastern Parkway', type:'event', url: p+'brooklyn/index.html#prospect-heights', keywords:['west indian day parade','carnival brooklyn','labor day parade','jouvert','eastern parkway carnival'] },
    { label:'The Bushwick Collective', sub:'Street art · Troutman St', type:'place', url: p+'brooklyn/index.html#bushwick',    keywords:['bushwick collective','street art brooklyn','murals bushwick','troutman street murals'] },
    { label:'House of Yes',       sub:'Bushwick, Brooklyn',    type:'place',  url: p+'brooklyn/index.html#bushwick',          keywords:['house of yes','circus nightclub','wyckoff avenue club','aerialists brooklyn'] },
    { label:'Maria Hernandez Park', sub:'Bushwick, Brooklyn',  type:'place',  url: p+'brooklyn/index.html#bushwick',          keywords:['maria hernandez park','bushwick park','knickerbocker park'] },
    { label:'Kings County Brewers Collective', sub:'Bushwick, Brooklyn', type:'place', url: p+'brooklyn/index.html#bushwick',  keywords:['kcbc','kings county brewers','brewery bushwick','troutman taproom'] },
    { label:"Roberta's",          sub:'261 Moore St · East Williamsburg line', type:'place', url: p+'brooklyn/index.html#bushwick', keywords:['robertas','robertas pizza','moore street pizza','wood fired bushwick'] },
    { label:'Luna Park',          sub:'Coney Island · 2026 season', type:'place', url: p+'brooklyn/index.html#coney-island',   keywords:['luna park','amusement park brooklyn','coney island rides'] },
    { label:'The Cyclone',        sub:'1927 coaster · 100 in 2027', type:'place', url: p+'brooklyn/index.html#coney-island',   keywords:['cyclone','coney island cyclone','wooden coaster','roller coaster brooklyn'] },
    { label:"Deno's Wonder Wheel", sub:'Since 1920 · Coney Island', type:'place', url: p+'brooklyn/index.html#coney-island',   keywords:['wonder wheel','denos wonder wheel','ferris wheel coney island'] },
    { label:"Nathan's Famous",    sub:'Surf & Stillwell · Since 1916', type:'place', url: p+'brooklyn/index.html#coney-island', keywords:['nathans','nathans famous','hot dogs coney island','surf stillwell'] },
    { label:'New York Aquarium',  sub:'Coney Island boardwalk', type:'place', url: p+'brooklyn/index.html#coney-island',       keywords:['new york aquarium','aquarium brooklyn','wcs aquarium','sharks coney island'] },
    { label:'Brooklyn Cyclones',  sub:'Final homestand Sep 1–6 · Maimonides Park', type:'sports', url: p+'brooklyn/index.html#coney-island', keywords:['brooklyn cyclones','cyclones baseball','maimonides park','minor league brooklyn'] },
    { label:'Riegelmann Boardwalk', sub:'Coney Island',        type:'place',  url: p+'brooklyn/index.html#coney-island',      keywords:['riegelmann boardwalk','coney island boardwalk','boardwalk beach brooklyn'] },
    { label:'Nets Home Opener',   sub:'Oct 21 vs Charlotte · Barclays Center', type:'sports', url: p+'brooklyn/index.html#park-slope', keywords:['nets','brooklyn nets','nets home opener','nba brooklyn','nets tickets'] },
    { label:'Einstein on the Beach — 50th Anniversary', sub:'Nov 19–21 · BAM', type:'event', url: p+'brooklyn/index.html#fort-greene', keywords:['einstein on the beach','philip glass','bam next wave','glass ensemble'] },
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
      { name: "Nardi's Tavern", kind: 'Tavern', where: 'Haven Beach', nights: 'Every night of the week',
        desc: 'Music seven nights — and the pink party bus that runs the Boulevard.', link: 'lbi/brant-beach/index.html' },
    ],
    series: []
  },

  'beach-haven': {
    blurb: 'The Island\'s live-music capital. A real music hall, two oceanfront tiki bars, an early-evening tavern circuit and a free town concert series — all inside about a dozen blocks.',
    venues: [
      // Booked schedule read off the Nite Club calendar at
      // birdandbettys.com/nite-club on Aug 22, 2026. Late shows start at
      // 10:30 PM and run to 3:30 AM, so the venue's own calendar prints each
      // one on two days — these are the START dates only. The season ends
      // after Oct 3; November is empty on their calendar.
      { name: "Bird & Betty's", kind: 'Music Hall & Restaurant', addr: '529 Dock Rd', phone: '(609) 492-3000',
        nights: 'Shows Wednesday–Sunday in the warm months; closed through the winter',
        desc: 'The Jersey Shore\'s best-known waterfront music room — an actual stage, an actual sound system, and touring regional acts most nights of the summer week. This is the one to check first if you want to see a band rather than hear one.',
        dated: [
          { date: 'Sat Aug 22', act: 'Good Noise · 10:30 PM' },
          { date: 'Wed Aug 26', act: 'Highly Questionable Trivia · 8 PM' },
          { date: 'Fri Aug 28', act: 'The Way Outs · 10:30 PM' },
          { date: 'Sat Aug 29', act: 'Sky City Social · 10:30 PM' },
          { date: 'Wed Sep 2',  act: 'Highly Questionable Trivia · 8 PM' },
          { date: 'Fri Sep 4',  act: 'Gab Cinque Band · 10:30 PM' },
          { date: 'Sat Sep 5',  act: 'Kono Nation · 10:30 PM' },
          { date: 'Fri Sep 11', act: 'The Black Ties · 10:30 PM' },
          { date: 'Sat Sep 12', act: 'Ridgemont Hight · 10:30 PM' },
          { date: 'Fri Sep 25', act: 'The Polish Nannies · 10:30 PM' },
          { date: 'Sat Sep 26', act: '95 Live · 10:30 PM' },
          { date: 'Fri Oct 2',  act: 'Jel & The Kidz · 10:30 PM' },
          { date: 'Sat Oct 3',  act: 'Band of Make Believe · 10:30 PM' },
        ],
        cal: { href: 'https://www.birdandbettys.com/nite-club', label: 'Full Nite Club calendar' } },

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

    ],
    series: [
      { name: 'Concerts on the Green', who: 'Beach Haven Community Arts Program',
        when: 'Wednesdays at 7:30 PM through the summer · free',
        where: 'Veterans Bicentennial Park — rain moves it across the street to the LBI Historical Association Museum',
        acts: ['The Pickles', 'Jimmy and the Parrots', 'Rave-Ons', 'Diablo Sandwich Band', 'McLean Avenue Band', 'The Kootz', 'Carnaby Street Band', 'Suyat Band', 'Gypsy Moon'],
        note: 'Those are acts from recent seasons — the Borough posts the current lineup each spring.',
        cal: { href: 'https://beachhavencap.org/summer-concerts/', label: 'beachhavencap.org/summer-concerts' } },
    ],
    nearest: { text: 'Nardi\'s Tavern — the only room on the Island with music seven nights a week — is two miles north in Haven Beach.', href: 'lbi/brant-beach/index.html' }
  },

  'brant-beach': {
    blurb: 'The mid-island runs on two speeds: free township concerts and fire pits at the 68th Street beach, and the Island\'s only seven-nights-a-week band room a little further down the Boulevard.',
    venues: [
      { name: "Nardi's Tavern", kind: 'Tavern & Nightclub', addr: '11801 Long Beach Blvd, Haven Beach', phone: '(609) 492-9538',
        nights: 'Music every night · Sun–Thu at 9:30 PM, Fri & Sat at 10 PM · acoustic sets Fri & Sat from 5 PM · Dave Christopher Band Sundays at 5 PM',
        acts: ['Green Knuckle Material (Tuesdays)', 'The Pickles', 'Big Bang Baby', 'Friend Zone', 'Mike Byrne', 'Matt Pietrucha'],
        desc: 'Tavern by day, nightclub by night, and the only room on the Island with music seven nights a week — plus the pink Nardi\'s party bus running the Boulevard, which is a Long Beach Island landmark in its own right.',
        cal: { href: 'http://www.nardistavern.com/band-schedule', label: 'nardistavern.com — band schedule' } },
    ],
    series: [
      { name: 'Sunday Concerts at 68th Street', who: 'Long Beach Township Recreation',
        when: 'Sundays 12–2 PM through the summer · free',
        where: 'By Bayview Park, 68th Street in Brant Beach — with Fire Pit Friday Nights on the 68th Street ocean beach, 7–9 PM',
        cal: { href: 'https://www.longbeachtownship.com/recreation/', label: 'longbeachtownship.com/recreation' } },
    ]
  },

  'spray-beach': {
    blurb: 'One genuine music room on this stretch — an early-evening set at the Terrace — with Beach Haven\'s full circuit starting five minutes south.',
    venues: [
      { name: 'The Terrace Tavern', kind: 'Tavern', addr: '13201 Long Beach Blvd, Beach Haven Terrace', phone: '(609) 492-9751',
        nights: 'Live music from 5 PM in season · happy hour Sunday–Thursday 3–5 PM',
        desc: 'The Terrace\'s corner tavern — 20 taps, local seafood, and an early set that fills the gap between the beach and the late rooms in Beach Haven.',
        cal: { href: 'https://terracetavernlbi.com/', label: 'terracetavernlbi.com' } },
    ],
    series: [],
    nearest: { text: 'Beach Haven\'s stages — Bird & Betty\'s, the Sea Shell, the Marlin — start five minutes south.', href: 'lbi/beach-haven/index.html' }
  },

  'loveladies': {
    blurb: 'Loveladies and North Beach keep it quiet on purpose — no bars, no stages. The LBI Foundation runs lectures and events rather than bands; for live music, head a few minutes south.',
    venues: [],
    series: [],
    nearest: { text: 'The Surf City Hotel books bands six days a week, and Harvey Cedars runs free bayfront concerts at Sunset Park.', href: 'lbi/surf-city/index.html' }
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

      { name: 'Northside Bar & Grille', kind: 'Sports Bar', addr: '1500 Long Beach Blvd', phone: '(609) 494-3771',
        nights: 'Live music dates through the season · open daily at noon, year-round',
        desc: 'The Island\'s sports bar, and one of the few Surf City rooms that stays open all winter. The kitchen stops at 9 but the bar runs to last call.',
        cal: { href: 'https://www.northsidelbi.com/', label: 'northsidelbi.com' } },
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
  // Columbia University's Miller Theatre was once noted here as out of scope;
  // Morningside Heights is now a covered neighborhood (its 2960 Broadway
  // address PIP-tests into OSM relation 8398079), so it's a linked entry
  // below. Irving Plaza (17 Irving Pl) was also researched but falls inside
  // OSM's Union Square boundary, outside all covered polygons, so it isn't
  // listed.
  'manhattan': {
    blurb: 'Manhattan\'s music rooms are spread across the neighborhoods covered here — a Bleecker Street rock bar with a band on stage seven nights a week, a basement jazz club that\'s been open since 1935, an upscale room that helped revive New York jazz in the \'80s, a university performing-arts hall, a big-room concert venue in the East Village, the arena that hosts the Knicks, Rangers and the city\'s biggest touring concerts, a Beaux-Arts theatre on the Upper West Side, a famously good-sounding 575-cap room on the Lower East Side, a 184-seat supper club inside the Public Theater, an Irish session bar in Kips Bay with music every night, the Hell\'s Kitchen jazz room named for Charlie Parker, the amateur-talent stage that launched Ella Fitzgerald, Columbia\'s adventurous contemporary-music hall up in Morningside Heights, and — at the top of the island — the 3,300-seat 1930 movie palace in Washington Heights that Lin-Manuel Miranda helped bring back to life.',
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
      { name: 'Miller Theatre at Columbia University', kind: 'Concert Hall', addr: '2960 Broadway at 116th St, Morningside Heights',
        nights: 'Curated fall-through-spring season — Composer Portraits, early music, jazz, and pop-up concerts',
        dated: [
          { date: 'Oct 29, 2026', act: 'Composer Portraits: Suzanne Farrin — "Macabéa" concert premiere with Talea Ensemble' },
        ],
        desc: 'Columbia\'s public concert hall, known for its signature Composer Portraits series — each evening is devoted to one living composer, who joins an onstage conversation. The 2026–27 season also carries early music, jazz, and free student performances.',
        cal: { href: 'https://www.millertheatre.com/', label: 'millertheatre.com' },
        link: 'manhattan/index.html#morningside-heights' },
      { name: 'Bowery Ballroom', kind: 'Music Venue', addr: '6 Delancey St, Lower East Side',
        nights: 'Touring acts most nights — dozens of shows on the calendar through 2026–27',
        desc: 'A 575-capacity room in a 1929 building, booked by Mercury East Presents and widely rated one of the best-sounding small venues in the country.',
        cal: { href: 'https://mercuryeastpresents.com/boweryballroom/', label: 'mercuryeastpresents.com/boweryballroom' },
        link: 'manhattan/index.html#lower-east-side' },
      { name: "Joe's Pub", kind: 'Supper Club', addr: '425 Lafayette St, NoHo',
        nights: 'Shows seven nights a week — often two or three a day, roughly 800 performances a year',
        desc: 'The Public Theater\'s 184-seat cabaret room, named for founder Joe Papp and open since 1998 — rock, jazz, cabaret, comedy and world music, with dinner and drink service through every show.',
        cal: { href: 'https://publictheater.org/', label: 'publictheater.org' },
        link: 'manhattan/index.html#noho' },
      { name: 'Birdland', kind: 'Jazz Club', addr: "315 W 44th St, Hell's Kitchen", phone: '(212) 581-3080',
        nights: 'Sets nightly from 4:30 PM · Birdland Big Band on the calendar most weeks',
        desc: 'Founded in 1949 and named for Charlie "Bird" Parker — "The Jazz Corner of the World" now runs two rooms (the main club and the downstairs Birdland Theater) on West 44th Street, with well over a hundred dated shows on the 2026 calendar.',
        cal: { href: 'https://www.birdlandjazz.com/calendar/', label: 'birdlandjazz.com/calendar' },
        link: 'manhattan/index.html#hells-kitchen' },
      { name: "Paddy Reilly's Music Bar", kind: 'Irish Music Bar', addr: '519 Second Ave at 29th St, Kips Bay',
        nights: 'Live music every night — sessions, singers and open mic',
        desc: 'A beloved Irish session bar known for its Guinness and nightly live music — briefly closed after 36 years, then reopened by new leaseholders who kept the name and the room exactly as they were.',
        cal: { href: 'https://www.paddyreillysmusicbar.com/', label: 'paddyreillysmusicbar.com' },
        link: 'manhattan/index.html#kips-bay' },
      { name: 'Apollo Theater', kind: 'Historic Theater', addr: '253 W 125th St, Harlem',
        nights: 'Historic theater closed for renovation · programming continues at the Apollo Stages at the Victoria, 233 W 125th St',
        desc: 'Opened in 1934; Amateur Night has launched acts from Ella Fitzgerald to Lauryn Hill. The historic theater is mid-renovation and Amateur Night is paused until it reopens — in the meantime the Apollo runs shows and events at its Apollo Stages at the Victoria, a block down 125th Street.',
        cal: { href: 'https://www.apollotheater.org/calendar/', label: 'apollotheater.org/calendar' },
        link: 'manhattan/index.html#harlem' },
      { name: 'United Palace', kind: 'Movie Palace', addr: '4140 Broadway at 175th St, Washington Heights',
        nights: 'Concerts, Latin-music headliners and special events year-round',
        desc: 'Loew\'s 3,300-seat 1930 "Wonder Theatre," still one of the largest rooms in Manhattan — Lin-Manuel Miranda helped fund its return to showing films and premiered "In the Heights" here in 2021. Today it books Latin-music headliners, touring concerts and film events.',
        cal: { href: 'https://www.unitedpalace.org/', label: 'unitedpalace.org' },
        link: 'manhattan/index.html#washington-heights' },
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

  // ── Queens ─────────────────────────────────────────────────────────
  'queens': {
    blurb: 'Queens music runs the full register: a 13,000-seat 1923 tennis stadium booking legends all summer, Latin jazz until 4 AM on an Elmhurst side street, underground rock and marathon DJ sets in Ridgewood, free jazz Fridays on the LIC waterfront, and a global-arts hall in Flushing. This is the borough where Armstrong, Ella and Basie all lived — and it still books like it knows.',
    venues: [
      { name: 'Forest Hills Stadium', kind: 'Concert Stadium', addr: '1 Tennis Pl, Forest Hills',
        nights: '2026 season runs June 6 – October 10',
        desc: 'The 1923 tennis horseshoe where the Beatles played their first stadium shows in 1964, revived as one of the city\'s great open-air rooms. What\'s left of the 2026 season is stacked.',
        dated: [
          { date: 'Aug 27–28, 2026', act: 'Zac Brown Band, with Grace Potter' },
          { date: 'Aug 29, 2026', act: 'Empire of the Sun, with Polo & Pan' },
          { date: 'Sep 16, 2026', act: 'The Hayley Williams Show' },
          { date: 'Sep 18, 2026', act: 'Erykah Badu' },
          { date: 'Sep 19, 2026', act: 'An Evening with David Byrne' },
          { date: 'Sep 29, 2026', act: 'Dermot Kennedy, with Jonah Kagen' },
          { date: 'Oct 2–3, 2026', act: 'Geese' },
          { date: 'Oct 10, 2026', act: 'Foster the People, with Goth Babe — season closer' },
        ],
        cal: { href: 'https://www.foresthillsstadium.com/', label: 'foresthillsstadium.com' },
        link: 'queens/index.html#forest-hills' },

      { name: 'Terraza 7', kind: 'Latin Jazz & World Music', addr: '40-19 Gleane St, Elmhurst',
        nights: 'Performances almost every night around 7 PM · open daily 4 PM–4 AM',
        desc: 'A two-level room with a suspended stage over the bar — Latin jazz, Andean, tango and experimental bookings on the Elmhurst/Jackson Heights line. One of the most distinctive small rooms in New York.',
        cal: { href: 'https://www.terraza7.com/events', label: 'terraza7.com/events' },
        link: 'queens/index.html#elmhurst' },

      { name: 'TV Eye', kind: 'Rock Club', addr: '1647 Weirfield St, Ridgewood',
        nights: 'Shows most nights — bar open even when the back room is quiet',
        desc: 'Venue, bar and discotheque built by alumni of Bowery Ballroom, WFMU and Sacred Bones — where touring underground and punk bills land in Queens.',
        cal: { href: 'https://tveyenyc.com/', label: 'tveyenyc.com' },
        link: 'queens/index.html#ridgewood' },

      { name: 'Nowadays', kind: 'Club & Listening Bar', addr: '56-06 Cooper Ave, Ridgewood',
        nights: 'Friday and Saturday into the early morning · daytime parties outdoors in summer',
        desc: 'Indoor-outdoor dance institution with a serious sound system and a no-photos floor — marathon DJ sets year-round, and one of the best backyards in the city.',
        cal: { href: 'https://nowadays.nyc/', label: 'nowadays.nyc' },
        link: 'queens/index.html#ridgewood' },

      { name: 'Gottscheer Hall', kind: 'Hall & Bar · Since 1924', addr: '657 Fairview Ave, Ridgewood',
        nights: 'Bands, DJ parties and trivia on a rotating calendar',
        desc: 'The Gottscheer community\'s century-old hall — a wood-paneled front bar and a back ballroom that now books indie shows alongside the polka heritage.',
        cal: { href: 'https://donyc.com/venues/gottscheer-hall', label: 'doNYC — Gottscheer Hall calendar' },
        link: 'queens/index.html#ridgewood' },

      { name: 'Culture Lab LIC', kind: 'Free Arts Campus', addr: '5-25 46th Ave, Long Island City',
        nights: 'Culture Lab After Dark — free live jazz every Friday at 8 PM',
        desc: 'Nonprofit gallery and performance space steps from the waterfront — free Friday-night jazz in the gallery, and the Live in The Lot outdoor stage on summer weekends.',
        cal: { href: 'https://www.culturelablic.org/calendar', label: 'culturelablic.org/calendar' },
        link: 'queens/index.html#long-island-city' },

      { name: 'LIC Bar', kind: 'Saloon & Back Room', addr: '45-58 Vernon Blvd, Long Island City',
        nights: 'Singer-songwriters and bands through the week',
        desc: 'An old corner saloon with exposed brick, a garden, and a steady calendar of local songwriters — the low-key end of an LIC night.',
        cal: { href: 'https://www.licbar.com/upcoming-events', label: 'licbar.com — upcoming events' },
        link: 'queens/index.html#long-island-city' },

      { name: 'Flushing Town Hall', kind: 'Global Arts Presenter', addr: '137-35 Northern Blvd, Flushing',
        nights: 'Jazz, world music and exhibitions year-round · monthly all-comers jazz jams',
        desc: 'The borough\'s global-arts anchor — its FTH Presents seasons run from jazz to music from every continent Queens speaks for, plus a monthly jazz jam open to any musician.',
        cal: { href: 'https://www.flushingtownhall.org/events', label: 'flushingtownhall.org/events' },
        link: 'queens/index.html#flushing' },
    ],
    series: [
      { name: 'Queens Jazz Trail Concert Series', who: 'Kupferberg Center, Flushing Town Hall, Louis Armstrong House Museum & NYC Parks',
        when: 'Free Thursdays at 7 PM, July 9 through August',
        where: 'Parks across the borough — honoring the Queens neighborhoods where Armstrong, Ella Fitzgerald, Count Basie and Dizzy Gillespie lived',
        cal: { href: 'https://kupferbergcenter.org/qjt/', label: 'kupferbergcenter.org/qjt' } },
    ]
  },

  // ── Brooklyn ───────────────────────────────────────────────────────
  'brooklyn': {
    blurb: 'Brooklyn plays every room size there is: arena pop at Barclays, a gilded movie palace reborn on Flatbush, a 1914 Polish ballroom that serves pierogi at punk shows, a 330-cap indie stage on the Southside, nightly world music in a French-owned Park Slope dive, and a circus-cabaret nightclub in Bushwick. And it is a borough saying a long goodbye: the Music Hall of Williamsburg plays out its final year through December 2026.',
    venues: [
      { name: 'Barclays Center', kind: 'Arena', addr: '620 Atlantic Ave, at Flatbush',
        nights: 'Concerts, Nets and Liberty basketball year-round',
        desc: 'The borough\'s big room. What\'s left of the 2026 calendar is stacked — and Nets basketball opens at home October 21 vs. Charlotte.',
        dated: [
          { date: 'Aug 21, 2026', act: 'Kehlani' },
          { date: 'Aug 26, 2026', act: 'Asake — In God We Trust Tour' },
          { date: 'Sep 3, 2026', act: 'Ken Carson' },
          { date: 'Sep 4 & 10, 2026', act: 'Robyn — the sexistential tour' },
          { date: 'Sep 6, 2026', act: 'Don Toliver' },
          { date: 'Sep 14–15, 2026', act: 'Charli xcx' },
          { date: 'Sep 19, 2026', act: 'Jungle' },
          { date: 'Sep 24–26, 2026', act: 'Phoebe Bridgers, with Alex G' },
          { date: 'Sep 30, 2026', act: 'Weezer — The Gathering' },
        ],
        cal: { href: 'https://www.barclayscenter.com/events', label: 'barclayscenter.com/events' },
        link: 'brooklyn/index.html#park-slope' },

      { name: 'Brooklyn Paramount', kind: 'Concert Palace', addr: '385 Flatbush Ave Ext',
        nights: 'Shows most nights across every genre',
        desc: 'The restored Paramount movie palace now run as a full-time concert hall — chandeliers, gilt, and a calendar that runs from post-punk to rap.',
        dated: [
          { date: 'Sep 5, 2026', act: 'Peter Hook & The Light' },
          { date: 'Sep 8–9, 2026', act: 'Lucki' },
          { date: 'Oct 5, 2026', act: 'Polyphia' },
        ],
        cal: { href: 'https://www.brooklynparamount.com/shows', label: 'brooklynparamount.com/shows' },
        link: 'brooklyn/index.html#fort-greene' },

      { name: 'Music Hall of Williamsburg', kind: 'Club · Final Year', addr: '66 N 6th St, Williamsburg',
        nights: 'Shows through December 2026 — then the doors close',
        desc: 'The Bowery Presents room that defined a Williamsburg era loses its lease at the end of 2026. The calendar stays full to the last night; go while going is still possible.',
        cal: { href: 'https://www.musichallofwilliamsburg.com/', label: 'musichallofwilliamsburg.com' },
        link: 'brooklyn/index.html#williamsburg' },

      { name: 'Warsaw', kind: 'Ballroom · Polish National Home', addr: '261 Driggs Ave, Greenpoint',
        nights: 'Rock, punk, hip hop and electronic bills through the week',
        desc: 'The 1914 Polish National Home\'s 1,000-capacity ballroom, a venue since 2001 — big-room sound up front, pierogi and kielbasa at the back.',
        cal: { href: 'https://www.warsawconcerts.com/', label: 'warsawconcerts.com' },
        link: 'brooklyn/index.html#greenpoint' },

      { name: "Baby's All Right", kind: 'Indie Club · 330 Cap', addr: '146 Broadway, Williamsburg',
        nights: 'Multiple bills most nights',
        desc: 'The Southside\'s essential small stage — rising acts across every genre in a 330-capacity room with a bar and kitchen up front.',
        cal: { href: 'https://donyc.com/venues/baby-s-all-right', label: 'doNYC — Baby\'s All Right calendar' },
        link: 'brooklyn/index.html#williamsburg' },

      { name: 'Barbès', kind: 'World Music Bar', addr: '376 9th St, Park Slope',
        nights: 'Live music nightly in the back room',
        desc: 'Peruvian psychedelic cumbia, Guinean jazz, Venezuelan harp, Balkan brass — a tiny French-owned bar with one of the most adventurous nightly calendars in New York.',
        cal: { href: 'https://www.barbesbrooklyn.com/events', label: 'barbesbrooklyn.com/events' },
        link: 'brooklyn/index.html#park-slope' },

      { name: 'Union Hall', kind: 'Bar · Basement Stage', addr: '702 Union St, Park Slope',
        nights: 'Comedy and bands downstairs; bocce and fireplaces upstairs',
        desc: 'The library-styled Park Slope institution whose basement has hosted secret shows by St. Vincent, Fleet Foxes and Vampire Weekend — big names in a very small room.',
        cal: { href: 'https://unionhallny.com/', label: 'unionhallny.com' },
        link: 'brooklyn/index.html#park-slope' },

      { name: 'House of Yes', kind: 'Circus Nightclub', addr: '2 Wyckoff Ave, Bushwick',
        nights: 'Theme nights, cabaret and dance parties most of the week',
        desc: 'Performance-fueled nightlife — aerialists over the dance floor, costume themes enforced with love, and DJs until very late.',
        cal: { href: 'https://www.houseofyes.org/', label: 'houseofyes.org' },
        link: 'brooklyn/index.html#bushwick' },

      { name: 'National Sawdust', kind: 'New Music Incubator', addr: '80 N 6th St, Williamsburg',
        nights: 'Premieres, residencies and experimental programming',
        desc: 'A nonprofit chamber-sized room with a Meyer spatial sound system, built for composers and new work — the adventurous end of the borough\'s calendar.',
        cal: { href: 'https://www.nationalsawdust.org/performances', label: 'nationalsawdust.org/performances' },
        link: 'brooklyn/index.html#williamsburg' },
    ],
    series: []
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
      { mo:'SEP', dy:'26', tag:'outdoors',tagLabel:'Festival', name:'Hawk Watch Fest',             meta:'Greenwich Audubon Center · 7 AM–4 PM', url:'greenwich/index.html', ticket:'https://www.audubon.org/greenwich/explore/hawk-watch-fest-greenwich-audubon-center' },
      { mo:'SEP', dy:'27', tag:'events', tagLabel:'Festival',  name:"Puttin' On The Dog",          meta:'Roger Sherman Baldwin Park · Greenwich', url:'greenwich/index.html', ticket:'https://adopt-a-dog.org' },
      { mo:'OCT', dy:'2',  tag:'arts',   tagLabel:'Tribute',   name:"Stayin' Alive — Bee Gees Tribute", meta:'Palace Theatre · 8 PM',     url:'stamford/downtown/index.html', ticket:'https://palacestamford.org' },
      { mo:'OCT', dy:'10', tag:'arts',   tagLabel:'Art Fest',  name:'Bruce Museum Outdoor Arts Festival', meta:'Oct 10–11 · Greenwich · $15', url:'greenwich/index.html', ticket:'https://brucemuseum.org/festivals/' },
      { mo:'OCT', dy:'18', tag:'events', tagLabel:'Car Meet',  name:'Caffeine & Carburetors',      meta:'Waveny Park · New Canaan · 8–11 AM', url:'new-canaan/index.html', ticket:'https://caffeineandcarburetors.com/cc-events/' },
      { mo:'OCT', dy:'TBD',tag:'events', tagLabel:'Festival',  name:"That's Amore Italian Fest",   meta:'Mill River Park · 2026 dates TBA', url:'stamford/downtown/index.html', ticket:'https://thatsamorefest.com' },
      { mo:'NOV', dy:'22', tag:'events', tagLabel:'Parade',    name:'Stamford Downtown Parade Spectacular', meta:'Downtown Stamford',     url:'stamford/downtown/index.html', ticket:'https://stamford-downtown.com' },
    ]
  },
  Greenwich: {
    label: 'Greenwich Events',
    link: { href: 'greenwich/index.html', text: 'Greenwich Guide →' },
    events: [
      { mo:'SEP', dy:'26', tag:'outdoors',tagLabel:'Festival',  name:'Hawk Watch Fest',            meta:'Greenwich Audubon Center · 7 AM–4 PM · advance tickets', url:'greenwich/index.html', ticket:'https://www.audubon.org/greenwich/explore/hawk-watch-fest-greenwich-audubon-center' },
      { mo:'SEP', dy:'27', tag:'events', tagLabel:'Festival',   name:"Puttin' On The Dog — 38th",  meta:'Roger Sherman Baldwin Park · 10 AM–4:30 PM', url:'greenwich/index.html', ticket:'https://adopt-a-dog.org' },
      { mo:'OCT', dy:'10', tag:'arts',   tagLabel:'Art Fest',   name:'Bruce Museum Outdoor Arts Festival', meta:'45th annual · Oct 10–11 · 10 AM–5 PM · $15', url:'greenwich/index.html', ticket:'https://brucemuseum.org/festivals/' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',    name:'Greenwich Farmers Market',   meta:'Horseneck lot, Arch St · Sat 9:30 AM–1 PM · thru Nov 21', url:'greenwich/index.html', ticket:'https://www.greenwichfarmersmarketct.com/' },
      { mo:'MAY', dy:'ANN',tag:'arts',   tagLabel:'Music Fest', name:'Greenwich Town Party',       meta:'Roger Sherman Baldwin Park · Memorial Day weekend Sat', url:'greenwich/index.html', ticket:'https://www.greenwichtownparty.org' },
    ]
  },
  'New Canaan': {
    label: 'New Canaan Events',
    link: { href: 'new-canaan/index.html', text: 'New Canaan Guide →' },
    events: [
      { mo:'OCT', dy:'18', tag:'events', tagLabel:'Car Meet',   name:'Caffeine & Carburetors',     meta:'Waveny Park · 8–11 AM · Free',        url:'new-canaan/index.html', ticket:'https://caffeineandcarburetors.com/cc-events/' },
      { mo:'SAT', dy:'WKL',tag:'outdoors',tagLabel:'Market',    name:'New Canaan Farmers Market',  meta:'Lumber Yard Lot, 244 Elm St · Sat 10 AM–2 PM · thru Dec 19', url:'new-canaan/index.html', ticket:'https://www.newcanaanfarmersmarket.net/' },
      { mo:'APR', dy:'–DEC',tag:'arts',  tagLabel:'Tours',      name:'The Glass House — 2026 Season', meta:'Tours Apr 16–Dec 14 · closed Tue & Wed · from 199 Elm St', url:'new-canaan/index.html', ticket:'https://theglasshouse.org/visit/' },
      { mo:'DEC', dy:'ANN',tag:'events', tagLabel:'Holiday',    name:'Holiday Stroll',             meta:'Downtown · early December · Chamber posts details in fall', url:'new-canaan/index.html', ticket:'https://newcanaanchamber.com' },
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
      { mo:'AUG', dy:'23',   tag:'events', tagLabel:'Tennis',   name:'US Open — Fan Week & Main Draw', meta:'Aug 23 – Sep 13 · Billie Jean King NTC · Flushing Meadows', url:'queens/index.html#corona', ticket:'https://www.usopen.org' },
      { mo:'SEP', dy:'7',    tag:'events', tagLabel:'Carnival', name:'West Indian American Day Carnival', meta:'Labor Day · Eastern Parkway, Brooklyn · from 10 AM', url:'brooklyn/index.html#prospect-heights', ticket:'https://wiadcacarnival.org' },
      { mo:'SEP', dy:'20–28',tag:'arts',   tagLabel:'Book Fest',name:'Brooklyn Book Festival',   meta:'Festival Day Sep 27 · Borough Hall, Downtown Brooklyn', url:'brooklyn/index.html#downtown-brooklyn', ticket:'https://brooklynbookfestival.org' },
      { mo:'SEP', dy:'17–27',tag:'events', tagLabel:'Festival', name:'Feast of San Gennaro',     meta:'100th feast · Mulberry St, Little Italy', url:'manhattan/index.html#little-italy', ticket:'https://sangennaronyc.org' },
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
      { mo:'SEP', dy:'17–27',tag:'events', tagLabel:'Festival', name:'Feast of San Gennaro',     meta:'100th feast · Mulberry St, Little Italy · 11 AM–11 PM', url:'manhattan/index.html#little-italy', ticket:'https://sangennaronyc.org' },
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
  'Queens': {
    label: 'Queens Events', link: { href: 'queens/index.html', text: 'Queens Guide →' },
    events: [
      { mo:'AUG', dy:'23',   tag:'events',  tagLabel:'Tennis',    name:'US Open — Fan Week',        meta:'Aug 23–29 · free grounds admission · Billie Jean King NTC', url:'queens/index.html#corona', ticket:'https://www.usopen.org' },
      { mo:'AUG', dy:'30',   tag:'events',  tagLabel:'Tennis',    name:'US Open — Main Draw',       meta:'Aug 30 – Sep 13 · Arthur Ashe Stadium · Flushing Meadows', url:'queens/index.html#corona', ticket:'https://www.usopen.org' },
      { mo:'AUG', dy:'27',   tag:'arts',    tagLabel:'Concert',   name:'Zac Brown Band',            meta:'Aug 27–28 · w/ Grace Potter · Forest Hills Stadium', url:'queens/index.html#forest-hills', ticket:'https://www.foresthillsstadium.com/' },
      { mo:'AUG', dy:'29',   tag:'arts',    tagLabel:'Concert',   name:'Empire of the Sun',         meta:'w/ Polo & Pan · Forest Hills Stadium', url:'queens/index.html#forest-hills', ticket:'https://www.foresthillsstadium.com/' },
      { mo:'SEP', dy:'4–6',  tag:'events',  tagLabel:'Baseball',  name:'Mets vs. Giants — Labor Day Weekend', meta:'Citi Field · Willets Point', url:'queens/index.html#corona', ticket:'https://www.mlb.com/mets/tickets' },
      { mo:'SEP', dy:'18',   tag:'arts',    tagLabel:'Concert',   name:'Erykah Badu',               meta:'Forest Hills Stadium',                url:'queens/index.html#forest-hills', ticket:'https://www.foresthillsstadium.com/' },
      { mo:'SEP', dy:'19',   tag:'arts',    tagLabel:'Concert',   name:'An Evening with David Byrne', meta:'Forest Hills Stadium',              url:'queens/index.html#forest-hills', ticket:'https://www.foresthillsstadium.com/' },
      { mo:'SEP', dy:'19',   tag:'dining',  tagLabel:'Night Market', name:'Queens Night Market returns', meta:'Saturdays 4 PM–midnight thru Oct 31 · NY Hall of Science', url:'queens/index.html#corona', ticket:'https://queensnightmarket.com' },
      { mo:'THU', dy:'7 PM', tag:'arts',    tagLabel:'Free Jazz', name:'Queens Jazz Trail Concert Series', meta:'Free Thursdays through August · parks across Queens', url:'queens/index.html#flushing', ticket:'https://kupferbergcenter.org/qjt/' },
      { mo:'FRI', dy:'8 PM', tag:'arts',    tagLabel:'Free Jazz', name:'Culture Lab After Dark',    meta:'Free live jazz Fridays · Culture Lab LIC', url:'queens/index.html#long-island-city', ticket:'https://www.culturelablic.org/culturelabafterdark' },
      { mo:'THRU',dy:'SEP 13',tag:'outdoors',tagLabel:'Beach',    name:'Rockaway Beach swim season',meta:'Lifeguarded through Sep 13 · boardwalk concessions in season', url:'queens/index.html#rockaway-beach', ticket:null },
      { mo:'ALL', dy:'2026', tag:'arts',    tagLabel:'Free Museum', name:'MoMA PS1 — free admission', meta:'Free to all through 2028 · Long Island City', url:'queens/index.html#long-island-city', ticket:'https://www.momaps1.org/en/visit' },
      { mo:'OCT', dy:'10',   tag:'arts',    tagLabel:'Concert',   name:'Foster the People — season closer', meta:'w/ Goth Babe · Forest Hills Stadium', url:'queens/index.html#forest-hills', ticket:'https://www.foresthillsstadium.com/' },
    ]
  },
  'Brooklyn': {
    label: 'Brooklyn Events', link: { href: 'brooklyn/index.html', text: 'Brooklyn Guide →' },
    events: [
      { mo:'AUG', dy:'29',   tag:'events',  tagLabel:'Last Call', name:'Brooklyn Brewery — farewell to N 11th St', meta:'Final day at the old home · live music · new home 1 Wythe Ave opens this fall', url:'brooklyn/index.html#williamsburg', ticket:'https://brooklynbrewery.com' },
      { mo:'SEP', dy:'7',    tag:'events',  tagLabel:'Carnival',  name:'West Indian American Day Carnival', meta:'Labor Day · Eastern Parkway from 10 AM · carnival week Aug 27–Sep 7', url:'brooklyn/index.html#prospect-heights', ticket:'https://wiadcacarnival.org' },
      { mo:'SEP', dy:'1–6',  tag:'events',  tagLabel:'Baseball',  name:'Cyclones final homestand',  meta:'vs Frederick Keys · season ends at Maimonides Park', url:'brooklyn/index.html#coney-island', ticket:'https://www.milb.com/brooklyn' },
      { mo:'SEP', dy:'14',   tag:'arts',    tagLabel:'Concert',   name:'Charli xcx',                meta:'Sep 14–15 · Barclays Center',         url:'brooklyn/index.html#park-slope', ticket:'https://www.barclayscenter.com/events' },
      { mo:'SEP', dy:'19',   tag:'arts',    tagLabel:'Puppets',   name:'Buffalo herd parade — St. Ann\'s', meta:'Sep 19–20 · 50 life-size puppets through Downtown Brooklyn', url:'brooklyn/index.html#downtown-brooklyn', ticket:'https://stannswarehouse.org' },
      { mo:'SEP', dy:'20–28',tag:'arts',    tagLabel:'Book Fest', name:'Brooklyn Book Festival',    meta:'Festival Day Sep 27 · eight stages around Borough Hall', url:'brooklyn/index.html#downtown-brooklyn', ticket:'https://brooklynbookfestival.org' },
      { mo:'SEP', dy:'24',   tag:'arts',    tagLabel:'Concert',   name:'Phoebe Bridgers',           meta:'Sep 24–26 · w/ Alex G · Barclays Center', url:'brooklyn/index.html#park-slope', ticket:'https://www.barclayscenter.com/events' },
      { mo:'SEP', dy:'27',   tag:'arts',    tagLabel:'Theater',   name:'Kramer/Fauci — Daniel Fish', meta:'Sep 27 – Oct 24 · St. Ann\'s Warehouse, DUMBO', url:'brooklyn/index.html#dumbo', ticket:'https://stannswarehouse.org' },
      { mo:'OCT', dy:'3',    tag:'arts',    tagLabel:'Free Night',name:'First Saturday at Brooklyn Museum', meta:'Free 5–11 PM · select months (none in Sep)', url:'brooklyn/index.html#prospect-heights', ticket:'https://www.brooklynmuseum.org' },
      { mo:'OCT', dy:'21',   tag:'events',  tagLabel:'Basketball',name:'Nets home opener',          meta:'vs Charlotte Hornets · 7:30 PM · Barclays Center', url:'brooklyn/index.html#park-slope', ticket:'https://www.barclayscenter.com/events' },
      { mo:'NOV', dy:'19',   tag:'arts',    tagLabel:'Next Wave', name:'Einstein on the Beach — 50th anniversary', meta:'Nov 19–21 · Philip Glass Ensemble · BAM', url:'brooklyn/index.html#fort-greene', ticket:'https://www.bam.org' },
      { mo:'SAT', dy:'11 AM',tag:'dining',  tagLabel:'Market',    name:'Smorgasburg Williamsburg',  meta:'Saturdays 11–6 thru October · Marsha P. Johnson SP', url:'brooklyn/index.html#williamsburg', ticket:'https://www.smorgasburg.com' },
      { mo:'SAT', dy:'WKL',  tag:'outdoors',tagLabel:'Market',    name:'Grand Army Plaza Greenmarket', meta:'Saturdays year-round 8–4 · plus Vanderbilt Ave Open Street thru Sep', url:'brooklyn/index.html#park-slope', ticket:'https://www.grownyc.org/locations/grand-army-plaza-greenmarket/' },
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
      { mo:'AUG', dy:'28',  tag:'nightlife',tagLabel:'Live Band', name:'The Way Outs',            meta:"Bird & Betty's · 529 Dock Rd · 10:30 PM", url:'lbi/beach-haven/index.html', ticket:'https://www.birdandbettys.com/nite-club' },
      { mo:'AUG', dy:'29',  tag:'nightlife',tagLabel:'Live Band', name:'Sky City Social',         meta:"Bird & Betty's · 529 Dock Rd · 10:30 PM", url:'lbi/beach-haven/index.html', ticket:'https://www.birdandbettys.com/nite-club' },
      { mo:'AUG', dy:'30',  tag:'arts',    tagLabel:'Theatre',    name:'1776: The Musical — closing',   meta:'Surflight Theatre · runs through Aug 30', url:'lbi/beach-haven/index.html', ticket:'https://surflight.org' },
      { mo:'SEP', dy:'4',   tag:'nightlife',tagLabel:'Live Band', name:'Gab Cinque Band',         meta:"Bird & Betty's · 529 Dock Rd · 10:30 PM", url:'lbi/beach-haven/index.html', ticket:'https://www.birdandbettys.com/nite-club' },
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
      { mo:'TUE', dy:'FRI', tag:'nightlife',tagLabel:'Live Band',name:'Bands at the Beach Club',  meta:'Surf City Hotel · 800 N Long Beach Blvd · Tue, Fri, Sat & select Sun · 21+', url:'lbi/surf-city/index.html', ticket:'https://surfcityhotel.com/' },
      { mo:'DLY', dy:'HH',  tag:'arts',    tagLabel:'Live Music',name:'Live music at the Bistro', meta:'Surf City Hotel · daily at happy hour or over dinner', url:'lbi/surf-city/index.html', ticket:'https://surfcityhotel.com/' },
      { mo:'THU', dy:'WKL', tag:'outdoors',tagLabel:'Night Market',name:'The Night Market',      meta:'The Firefly Gallery · Surf City · Thu 5–8 PM', url:'lbi/surf-city/index.html', ticket:null },
    ]
  },
  'Harvey Cedars': {
    label: 'Harvey Cedars Events', link: { href: 'lbi/harvey-cedars/index.html', text: 'Harvey Cedars Guide →' },
    events: [
      { mo:'FRI', dy:'WKL', tag:'outdoors',tagLabel:'Market',    name:'Black Eyed Susans Farmers Market', meta:'7908 Long Beach Blvd · Fridays 9–11 AM in season', url:'lbi/harvey-cedars/index.html', ticket:null },
      { mo:'FRI', dy:'SUN', tag:'outdoors',tagLabel:'Bazaar',    name:"Birdy's Bazaars",                  meta:"Birdy's · 7801 Long Beach Blvd · Fri–Sun 8 AM–2 PM", url:'lbi/harvey-cedars/index.html', ticket:null },
    ]
  },
  'Barnegat Light': {
    label: 'Barnegat Light', link: { href: 'lbi/barnegat-light/index.html', text: 'Barnegat Light Guide →' },
    events: [
      { mo:'DAI', dy:'LY',  tag:'outdoors',tagLabel:'Landmark', name:'Barnegat Lighthouse',     meta:'217 steps · Panoramic inlet views',   url:'lbi/barnegat-light/index.html', ticket:null },
      { mo:'DAI', dy:'LY',  tag:'outdoors',tagLabel:'Market',   name:'Viking Village Fish Market',meta:'Fresh catch off the boats',         url:'lbi/barnegat-light/index.html', ticket:null },
      { mo:'SUN', dy:'WKL', tag:'outdoors',tagLabel:'Bazaar',   name:'Sunday Bazaar',            meta:'Yaatree Bazaar · Barnegat Light · Sun 10 AM–2 PM', url:'lbi/barnegat-light/index.html', ticket:null },
    ]
  },
  'Brant Beach': {
    label: 'Brant Beach Events', link: { href: 'lbi/brant-beach/index.html', text: 'Brant Beach Guide →' },
    events: [
      { mo:'SUN', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Sunday Concerts at 68th St', meta:'By Bayview Park · 12–2 PM in season', url:'lbi/brant-beach/index.html', ticket:'https://www.longbeachtownship.com/recreation/' },
      { mo:'FRI', dy:'WKL', tag:'outdoors',tagLabel:'Beach Night',name:'Fire Pit Friday Nights',     meta:'68th St ocean beach · 7–9 PM in season', url:'lbi/brant-beach/index.html', ticket:null },
      { mo:'JUL', dy:'ANN', tag:'outdoors',tagLabel:'Surf Contest',name:'Jetty Coquina Jam',         meta:'68th St beach · all-women team contest · 18th annual ran Jul 19', url:'lbi/brant-beach/index.html', ticket:'https://jettyrockfoundation.org/pages/coquina-jam' },
      { mo:'OCT', dy:'11',  tag:'outdoors',tagLabel:'Race',       name:'LBI 18 Mile Run & 12K',      meta:'Benefits St. Francis Center, Brant Beach · 10 AM', url:'lbi/holgate/index.html', ticket:null },
    ]
  },
  'Spray Beach': {
    label: 'Spray Beach Notes', link: { href: 'lbi/spray-beach/index.html', text: 'Spray Beach Guide →' },
    events: [
      { mo:'DAI', dy:'5 PM',tag:'arts',    tagLabel:'Live Music', name:'Music at the Terrace Tavern', meta:'13201 Long Beach Blvd · from 5 PM in season', url:'lbi/spray-beach/index.html', ticket:'https://terracetavernlbi.com/' },
      { mo:'WED', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Concerts on the Green',       meta:'Veterans Bicentennial Park · Beach Haven, 5 min south', url:'lbi/beach-haven/index.html', ticket:null },
      { mo:'OCT', dy:'3–4', tag:'dining',  tagLabel:'Food Fest',  name:'Chowderfest — Chowder Cook-Off', meta:'Taylor Ave Waterfront · Beach Haven',  url:'lbi/beach-haven/index.html', ticket:'https://chowderfest.com' },
    ]
  },
  Loveladies: {
    label: 'Loveladies & North Beach', link: { href: 'lbi/loveladies/index.html', text: 'Loveladies Guide →' },
    events: [
      { mo:'DAI', dy:'LY',  tag:'arts',    tagLabel:'Galleries',  name:'LBI Foundation of the Arts & Sciences', meta:'120 Long Beach Blvd · exhibitions, classes & lectures', url:'lbi/loveladies/index.html', ticket:'https://lbifoundation.org/' },
      { mo:'ANN', dy:'—',   tag:'arts',    tagLabel:'Juried Show',name:'Works on Paper — 28th Annual',  meta:'National juried exhibition at LBIF',   url:'lbi/loveladies/index.html', ticket:'https://lbifoundation.org/' },
      { mo:'WED', dy:'WKL', tag:'arts',    tagLabel:'Free Music', name:'Sunset Park Concerts',          meta:'Harvey Cedars bayfront · Wed evenings in summer', url:'lbi/harvey-cedars/index.html', ticket:null },
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

  containerEl.innerHTML = headerHtml + _eventItemsHtml(data.events, p);
}

// The whole row is the click target — no "More info" button. Each row reads
// type chip / event name / venue · time, so the panel answers "what, where,
// when" without a hover. The line is clamped to two lines and the full string
// stays in the tooltip, so a long venue string can't blow the row height out.
function _eventItemsHtml(events, p) {
  return events.map(ev => {
    const ticket   = ev.ticket || null;
    const href     = ticket || (ev.url ? p + ev.url : null);
    const external = !!ticket;
    const tag      = href ? 'a' : 'div';
    const attrs    = href
      ? ` href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}`
      : '';
    return `
    <${tag} class="home-event-item${href ? ' is-link' : ''}"${attrs} title="${_attr(ev.meta)}">
      <div class="home-event-date"><div class="mo">${ev.mo}</div><div class="dy">${ev.dy}</div></div>
      <div class="home-event-info">
        <div class="home-event-tag ${ev.tag}">${ev.tagLabel}</div>
        <div class="home-event-name">${ev.name}${external ? '<span class="ev-ext" aria-hidden="true">↗</span>' : ''}</div>
        ${ev.meta ? `<div class="home-event-meta">${ev.meta}</div>` : ''}
      </div>
    </${tag}>`;
  }).join('');
}

function _attr(s) {
  return String(s == null ? '' : s).replace(/"/g, '&quot;');
}


function initSidePanel() {
  const loc = document.body.getAttribute('data-page-location');
  if (!loc) return;

  const p = rootPrefix();

  const panel = document.createElement('div');
  panel.className = 'site-left-panel';

  panel.innerHTML = `
    <div class="site-panel-top">
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
