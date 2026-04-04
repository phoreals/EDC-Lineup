const stages = ["Kinetic Field", "Circuit Grounds", "Cosmic Meadow", "Neon Garden", "Basspod", "Wasteland", "Quantum Valley", "Stereobloom", "Bionic Jungle"];
const lineupData = {
  "FRIDAY": ["Argy", "1991", "Jackie Hollander", "Adriatique", "Adventure Club (Throwback Set)", "Adrián Mills", "Cold Blue", "Abana b2b Juliet Mendoza", "Avalon Emerson", "The Chainsmokers", "BOU", "Max Dean b2b Luke Dean", "ANASTAZJA ", "ATLiens", "Cloudy", "Cosmic Gate", "Josh Baker", "Heidi Lawden b2b Masha Mar", "Charlotte de Witte", "I Hate Models", "MEDUZA³", "DJ Tennis b2b Chloé Caillet", "Culture Shock", "DØM1NA", "Darren Porter", "Luke Dean", "Massimiliano Pagliara", "Chris Lorenzo", "Level Up", "MPH", "Eli Brown", "Cyclops", "DYEN", "Darude", "Luuk van Dijk", "Paramida", "Fisher", "Levity", "Notion", "Joseph Capriati", "Deathpact ∞ Deathpact", "GRAVEDGR", "Gareth Emery", "Max Dean", "Robert Hood", "Korolova", "Nico Moreno", "Roddy Lima", "Mëstiza", "Ghengar", "Johannes Schuster", "Ilan Bluestone", "Obskür", "Salute b2b Chloé Caillet", "Laidback Luke b2b Chuckie", "Ray Volpe", "San Pacho", "Peggy Gou", "GorillaT", "KUKO", "Matty Ralph", "Omar+", "Stacy Christine", "Porter Robinson (DJ Set)", "The Outlaw", "Underworld", "", "HEYZ", "Rebekah", "Paul van Dyk", "Slamm", "The Carry Nation", "Sofi Tukker", "Wooli", "Walker & Royce b2b VNSSA", "", "Kai Wachi", "Serafina", "Pegassi", "Toman", "", "", "", "", "Westend", "", "MUZZ", "Stan Christ", "Sarah de Warren", "", "", "", "", "", "", "Riot", "", "", ""],
  "SATURDAY": ["Above & Beyond (Sunrise Set)", "Boys Noize", "BUNT. (In The Round)", "Ahmed Spins", "Avello b2b Dennett", "Alyssa Jolee", "Andrew Rayel", "Bolo (Sunrise Set)", "Bad Boombox b2b Ollie Lishman", "AR/CO", "DJ Mandy", "DJ Gigola b2b MCR-T", "Josh Baker b2b Kettama b2b Prospa", "Delta Heavy", "Audiofreq b3b Code Black b3b Toneshifterz", "Astrix", "CID", "Bashkka b2b Sedef Adasi", "Hardwell", "Kettama", "Frost Children", "Luciano", "Doctor P b3b Flux Pavilion b3b FuntCase", "Cutdwn", "Billy Gillies", "Discip", "Baugruppe90", "Hayla", "Lilly Palmer", "Hannah Laing", "Mink", "Eptic b2b Space Laces", "Da Tweekaz", "Maddix", "Dreya V", "Benwal", "John Summit", "Peggy Gou b2b KI/KI", "Interplanetary Criminal", "Prospa", "Fallen with MC Dino", "Dead X", "Maria Healy", "HNTR", "Club Angel", "Kaskade", "RØZ", "Malugi", "Silvie Loto", "Getter", "Lady Faith b2b LNY TNZ", "Mathame", "Noizu", "HAAi b2b Luke Alessi", "Steve Aoki", "Sammy Virji", "Snow Strippers", "", "HOL!", "Lil Texas", "Paul Oakenfold", "OMNOM", "MCR-T", "Sub Focus", "Tiësto", "The Prodigy", "", "Hybrid Minds", "Mish", "Superstrings", "Slugg", "Player Dave", "Subtronics", "", "VTSS (In The Round)", "", "Mary Droppinz", "Rob Gee b2b Lenny Dee", "T78", "Wax Motif", "Spray", "", "", "", "", "Viperactive", "The Saints", "Thomas Schumacher", "", "", "", "", "", "", "YDG", "", "", ""],
  "SUNDAY": ["Armin Van Buuren (Sunrise Set)", "ANNA", "Alison Wonderland", "999999999", "A.M.C w/ Phantom", "Clawz", "Cassian", "Chris Lorenzo b2b Bullet Tooth", "Alves", "Cloonee", "Beltran", "Black Tiger Sex Machine", "Adiel", "ÆON:MODE (Sunrise Set)", "DJ Isaac", "Cristoph", "Hamdi", "Beltran b2b Simas", "Funk Tribu", "Chris Stussy", "Dabin", "DJ Gigola", "Ahee b2b Liquid Stranger", "Restricted", "Eli & Fur", "KLO", "DJ Tennis b2b Red Axes", "Griz b2b Wooli", "Kevin de Vries", "Gravagerz", "Frankie Bones", "Boogie T b2b Distinct Motive", "Rooler", "Innellea", "LU.RE", "ISAbella", "Layton Giordani", "Linska", "Nico Moreno b2b Holy Priest", "Indira Paganotto", "Eazybaked", "SIHK", "KREAM", "Morgan Seatree", "Kinahau", "Martin Garrix", "Solomun", "Nostalgix", "KI/KI", "Infekt b2b Samplifire", "Sub Zero Project", "Massano", "Murphy’s Law", "Tiga", "Ship Wrek", "Vintage Culture", "San Holo (Wholesome Riddim Set)", "Klangkuenstler", "Nightstalker with MC Dino", "The Purge", "Rebūke", "Sidney Charles b2b Bushbaby", "", "Trace", "", "Seven Lions", "", "Peekaboo", "Vieze Asbak", "Shingo Nakamura", "Silva Bumpa", "", "Zedd", "", "William Black", "", "Sippy", "Warface", "Tinlicker (DJ Set)", "Skream", "", "", "", "", "", "Virtual Riot", "Yosuf", "Warung", "", "", "", "", "", "", "Whethan", "", "", "" ]
};

let currentDay = "ALL_DAYS", activeFilters = new Set(), showFavoritesOnly = false;
let favorites = new Set(JSON.parse(localStorage.getItem('edcFavorites')) || []);

function init() {
  renderFilters();
  renderBoard();
  updateSearchClearButton();
  updateSearchToggleState();
  document.getElementById('filters-container').addEventListener('scroll', checkScroll);
  window.addEventListener('resize', () => { updateStickyHeight(); checkScroll(); updateSearchToggleState(); });
  setTimeout(() => { updateStickyHeight(); checkScroll(); updateSearchToggleState(); }, 50);
}

function updateSearchToggleState() {
  const top = document.getElementById('top-controls');
  if (!top) return;

  if (window.innerWidth <= 768) {
    top.classList.add('needs-search-toggle');
    return;
  }

  const tabs = top.querySelector('.tabs');
  if (!tabs) return;

  const requiredSearchWidth = 260;
  const availableWidth = top.clientWidth;
  const neededWidth = tabs.scrollWidth + requiredSearchWidth;

  if (neededWidth > availableWidth) {
    top.classList.add('needs-search-toggle');
    top.classList.remove('search-active');
  } else {
    top.classList.remove('needs-search-toggle');
    top.classList.remove('search-active');
  }
}

function toTitleCase(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

function updateStickyHeight() {
  const c = document.getElementById('dashboard-controls');
  if (c) document.documentElement.style.setProperty('--sticky-top', `${c.offsetHeight}px`);
}

function checkScroll() {
  const c = document.getElementById('filters-container'), a = document.getElementById('filters-scroll-area');
  const isScrollable = c.scrollWidth > c.clientWidth;
  const isAtEnd = Math.ceil(c.scrollLeft + c.clientWidth) >= c.scrollWidth - 2;
  document.documentElement.style.setProperty('--fade-opacity', (isScrollable && !isAtEnd) ? '1' : '0');
}

function setDay(day, btn) {
  currentDay = day;
  document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.body.classList.toggle('compact-mode', day === 'COMPACT');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderBoard();
}

function toggleFavorite(name) {
  if (!name) {
    console.warn('toggleFavorite called with invalid name:', name);
    return;
  }
  const isCurrentlyFav = favorites.has(name);
  if (isCurrentlyFav) favorites.delete(name);
  else favorites.add(name);
  localStorage.setItem('edcFavorites', JSON.stringify(Array.from(favorites)));
  renderBoard();
}

function toggleSearch() {
  const top = document.getElementById('top-controls');
  if (!top) return;
  if (window.innerWidth > 768 && !top.classList.contains('needs-search-toggle')) return;

  top.classList.toggle('search-active');
  const input = document.getElementById('search-input');
  if (!input) return;
  if (top.classList.contains('search-active')) {
    input.focus();
  } else {
    input.value = '';
    updateSearchClearButton();
    renderBoard();
  }
  updateStickyHeight();
  checkScroll();
}

function hideSearch() {
  const top = document.getElementById('top-controls');
  if (!top) return;
  top.classList.remove('search-active');
  const input = document.getElementById('search-input');
  if (!input) return;
  input.value = '';
  updateSearchClearButton();
  renderBoard();
  updateStickyHeight();
  checkScroll();
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (!input) return;
  input.value = '';
  input.focus();
  updateSearchClearButton();
  renderBoard();
}

function updateSearchClearButton() {
  const input = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (!input || !clearBtn) return;
  clearBtn.style.display = input.value ? 'inline-flex' : 'none';
}

function createCard(name) {
  const isFav = favorites.has(name);
  const card = document.createElement("div");
  card.className = `artist-card ${isFav ? 'favorited' : ''}`;
  card.onclick = () => toggleFavorite(name);
  card.innerHTML = `<span class="artist-name">${name}</span><button class="fav-btn">${isFav ? '★' : '☆'}</button>`;
  return card;
}

function renderFilters() {
  const gl = document.getElementById('general-filters-list'), sl = document.getElementById('stage-filters-list'), fa = document.getElementById('filter-actions');
  gl.innerHTML = sl.innerHTML = fa.innerHTML = "";

  const fv = document.createElement('button');
  fv.className = 'filter-pill'; fv.innerHTML = '★ Favorited';
  fv.onclick = () => { showFavoritesOnly = !showFavoritesOnly; fv.classList.toggle('active'); updateClearBtn(); renderBoard(); };
  gl.appendChild(fv);

  stages.forEach(s => {
    const b = document.createElement('button');
    b.className = 'filter-pill'; b.textContent = s;
    b.onclick = () => { activeFilters.has(s) ? activeFilters.delete(s) : activeFilters.add(s); b.classList.toggle('active'); updateClearBtn(); renderBoard(); };
    sl.appendChild(b);
  });

  const cl = document.createElement('button');
  cl.id = 'clear-btn'; cl.className = 'clear-filters'; cl.textContent = 'Clear';
  cl.onclick = () => { activeFilters.clear(); showFavoritesOnly = false; document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active')); updateClearBtn(); renderBoard(); };
  fa.appendChild(cl);
}

function updateClearBtn() {
  const cl = document.getElementById('clear-btn');
  (activeFilters.size > 0 || showFavoritesOnly) ? cl.classList.add('show') : cl.classList.remove('show');
  setTimeout(() => { updateStickyHeight(); checkScroll(); }, 10);
}

function getArtists(day) {
  const d = {}; stages.forEach(s => d[s] = []);
  lineupData[day].forEach((a, i) => { if(a) d[stages[i % 9]].push(a); });
  return d;
}

function renderBoard() {
  const main = document.getElementById("main-content"); main.innerHTML = "";
  const q = document.getElementById("search-input").value.toLowerCase();
  if (currentDay === 'COMPACT') {
    renderCompactView(q, main);
  } else if (currentDay === 'ALL_DAYS') {
    ['FRIDAY', 'SATURDAY', 'SUNDAY'].forEach(d => renderGrid(d, q, main, true));
  } else if (currentDay === 'BY_STAGE') {
    renderByStage(q, main);
  } else {
    renderGrid(currentDay, q, main, false);
  }
  setTimeout(updateStickyHeight, 10);
}

function renderCompactView(q, container) {
  ['FRIDAY', 'SATURDAY', 'SUNDAY'].forEach(day => {
    renderGrid(day, q, container, true);
  });

  if (container.children.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No artists';
    container.appendChild(empty);
  }
}

function renderGrid(day, q, container, header) {
  const data = getArtists(day), grid = document.createElement("div");
  grid.className = "grid-board";
  let has = false;

  stages.forEach(s => {
    if (activeFilters.size > 0 && !activeFilters.has(s)) return;
    let artists = data[s];
    if (showFavoritesOnly) artists = artists.filter(a => favorites.has(a));
    if (q) artists = artists.filter(a => a.toLowerCase().includes(q));
    if ((q || showFavoritesOnly) && !artists.length) return;
    has = true;

    const col = document.createElement("div");
    col.className = "stage-column";
    col.innerHTML = `<div class="stage-header">${s}</div>`;

    const list = document.createElement("div");
    list.className = "artist-list";
    artists.length ? artists.forEach(a => list.appendChild(createCard(a))) : list.innerHTML = `<div class="empty-state">No artists</div>`;
    col.appendChild(list);
    grid.appendChild(col);
  });

  if (has) {
    if (header) { const h = document.createElement('div'); h.className = 'day-section-header'; h.textContent = toTitleCase(day); container.appendChild(h); }
    container.appendChild(grid);
  }
}

function renderByStage(q, container) {
  const grid = document.createElement('div'); grid.className = "grid-board"; grid.style.paddingTop = "30px";
  let hasAny = false;

  stages.forEach(s => {
    if (activeFilters.size > 0 && !activeFilters.has(s)) return;
    const col = document.createElement('div'); col.className = "stage-column";
    col.innerHTML = `<div class="stage-header">${s}</div>`;
    const list = document.createElement('div'); list.className = "artist-list";
    let hasS = false, first = true;

    ['FRIDAY', 'SATURDAY', 'SUNDAY'].forEach(day => {
      let artists = getArtists(day)[s];
      if (showFavoritesOnly) artists = artists.filter(a => favorites.has(a));
      if (q) artists = artists.filter(a => a.toLowerCase().includes(q));
      if (artists.length) {
        hasS = true;
        if (!first) list.innerHTML += `<hr class="day-divider">`;
        first = false;
        list.innerHTML += `<div class="day-subheader">${toTitleCase(day)}</div>`;
        artists.forEach(a => list.appendChild(createCard(a)));
      }
    });

    if (hasS || (!q && !showFavoritesOnly)) { col.appendChild(list); grid.appendChild(col); hasAny = true; }
  });

  if (hasAny) container.appendChild(grid);
}

window.onload = init;
