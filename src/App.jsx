import { useEffect, useMemo, useState } from 'react';

const stages = [
  'Kinetic Field',
  'Circuit Grounds',
  'Cosmic Meadow',
  'Neon Garden',
  'Basspod',
  'Wasteland',
  'Quantum Valley',
  'Stereobloom',
  'Bionic Jungle'
];

const lineupData = {
  FRIDAY: [
    'Argy', '1991', 'Jackie Hollander', 'Adriatique', 'Adventure Club (Throwback Set)', 'Adrián Mills', 'Cold Blue',
    'Abana b2b Juliet Mendoza', 'Avalon Emerson', 'The Chainsmokers', 'BOU', 'Max Dean b2b Luke Dean', 'ANASTAZJA ',
    'ATLiens', 'Cloudy', 'Cosmic Gate', 'Josh Baker', 'Heidi Lawden b2b Masha Mar', 'Charlotte de Witte', 'I Hate Models',
    'MEDUZA³', 'DJ Tennis b2b Chloé Caillet', 'Culture Shock', 'DØM1NA', 'Darren Porter', 'Luke Dean', 'Massimiliano Pagliara',
    'Chris Lorenzo', 'Level Up', 'MPH', 'Eli Brown', 'Cyclops', 'DYEN', 'Darude', 'Luuk van Dijk', 'Paramida', 'Fisher',
    'Levity', 'Notion', 'Joseph Capriati', 'Deathpact ∞ Deathpact', 'GRAVEDGR', 'Gareth Emery', 'Max Dean', 'Robert Hood',
    'Korolova', 'Nico Moreno', 'Roddy Lima', 'Mëstiza', 'Ghengar', 'Johannes Schuster', 'Ilan Bluestone', 'Obskür',
    'Salute b2b Chloé Caillet', 'Laidback Luke b2b Chuckie', 'Ray Volpe', 'San Pacho', 'Peggy Gou', 'GorillaT', 'KUKO',
    'Matty Ralph', 'Omar+', 'Stacy Christine', 'Porter Robinson (DJ Set)', 'The Outlaw', 'Underworld', 'HEYZ', 'Rebekah',
    'Paul van Dyk', 'Slamm', 'The Carry Nation', 'Sofi Tukker', 'Wooli', 'Walker & Royce b2b VNSSA', 'Kai Wachi', 'Serafina',
    'Pegassi', 'Toman', 'Westend', 'MUZZ', 'Stan Christ', 'Sarah de Warren', 'Riot'
  ],

  SATURDAY: [
    'Above & Beyond (Sunrise Set)', 'Boys Noize', 'BUNT. (In The Round)', 'Ahmed Spins', 'Avello b2b Dennett', 'Alyssa Jolee',
    'Andrew Rayel', 'Bolo (Sunrise Set)', 'Bad Boombox b2b Ollie Lishman', 'AR/CO', 'DJ Mandy', 'DJ Gigola b2b MCR-T',
    'Josh Baker b2b Kettama b2b Prospa', 'Delta Heavy', 'Audiofreq b3b Code Black b3b Toneshifterz', 'Astrix', 'CID',
    'Bashkka b2b Sedef Adasi', 'Hardwell', 'Kettama', 'Frost Children', 'Luciano', 'Doctor P b3b Flux Pavilion b3b FuntCase',
    'Cutdwn', 'Billy Gillies', 'Discip', 'Baugruppe90', 'Hayla', 'Lilly Palmer', 'Hannah Laing', 'Mink', 'Eptic b2b Space Laces',
    'Da Tweekaz', 'Maddix', 'Dreya V', 'Benwal', 'John Summit', 'Peggy Gou b2b KI/KI', 'Interplanetary Criminal', 'Prospa',
    'Fallen with MC Dino', 'Dead X', 'Maria Healy', 'HNTR', 'Club Angel', 'Kaskade', 'RØZ', 'Malugi', 'Silvie Loto', 'Getter',
    'Lady Faith b2b LNY TNZ', 'Mathame', 'Noizu', 'HAAi b2b Luke Alessi', 'Steve Aoki', 'Sammy Virji', 'Snow Strippers', 'HOL!',
    'Lil Texas', 'Paul Oakenfold', 'OMNOM', 'MCR-T', 'Sub Focus', 'Tiësto', 'The Prodigy', 'Hybrid Minds', 'Mish', 'Superstrings',
    'Slugg', 'Player Dave', 'Subtronics', 'VTSS (In The Round)', 'Mary Droppinz', 'Rob Gee b2b Lenny Dee', 'T78', 'Wax Motif',
    'Spray', 'Viperactive', 'The Saints', 'Thomas Schumacher', 'YDG'
  ],

  SUNDAY: [
    'Armin Van Buuren (Sunrise Set)', 'ANNA', 'Alison Wonderland', '999999999', 'A.M.C w/ Phantom', 'Clawz', 'Cassian',
    'Chris Lorenzo b2b Bullet Tooth', 'Alves', 'Cloonee', 'Beltran', 'Black Tiger Sex Machine', 'Adiel',
    'ÆON:MODE (Sunrise Set)', 'DJ Isaac', 'Cristoph', 'Hamdi', 'Beltran b2b Simas', 'Funk Tribu', 'Chris Stussy', 'Dabin',
    'DJ Gigola', 'Ahee b2b Liquid Stranger', 'Restricted', 'Eli & Fur', 'KLO', 'DJ Tennis b2b Red Axes', 'Griz b2b Wooli',
    'Kevin de Vries', 'Gravagerz', 'Frankie Bones', 'Boogie T b2b Distinct Motive', 'Rooler', 'Innellea', 'LU.RE', 'ISAbella',
    'Layton Giordani', 'Linska', 'Nico Moreno b2b Holy Priest', 'Indira Paganotto', 'Eazybaked', 'SIHK', 'KREAM', 'Morgan Seatree',
    'Kinahau', 'Martin Garrix', 'Solomun', 'Nostalgix', 'KI/KI', 'Infekt b2b Samplifire', 'Sub Zero Project', 'Massano',
    'Murphy’s Law', 'Tiga', 'Ship Wrek', 'Vintage Culture', 'San Holo (Wholesome Riddim Set)', 'Klangkuenstler',
    'Nightstalker with MC Dino', 'The Purge', 'Rebūke', 'Sidney Charles b2b Bushbaby', 'Trace', 'Seven Lions', 'Peekaboo',
    'Vieze Asbak', 'Shingo Nakamura', 'Silva Bumpa', 'Zedd', 'William Black', 'Sippy', 'Warface', 'Tinlicker (DJ Set)', 'Skream',
    'Virtual Riot', 'Yosuf', 'Warung', 'Whethan'
  ]
};

const DAY_LABELS = [
  { key: 'ALL_DAYS', label: 'All Days' },
  { key: 'FRIDAY', label: 'Friday' },
  { key: 'SATURDAY', label: 'Saturday' },
  { key: 'SUNDAY', label: 'Sunday' },
  { key: 'BY_STAGE', label: 'By Stage' },
  { key: 'COMPACT', label: 'Compact View' }
];

const getArtists = (day) => {
  const buckets = {};
  stages.forEach((stage) => {
    buckets[stage] = [];
  });

  (lineupData[day] || []).forEach((artist, idx) => {
    if (!artist) return;
    const stage = stages[idx % stages.length];
    buckets[stage].push(artist);
  });

  return buckets;
};

const filterArtists = ({ artist, query, favorites, stageFilters, showFavoritesOnly }) => {
  if (!artist) return false;
  if (query && !artist.toLowerCase().includes(query.toLowerCase())) return false;
  if (showFavoritesOnly && !favorites.has(artist)) return false;
  return true;
};

const keyedClass = (condition, className) => (condition ? className : '');

export default function App() {
  const [currentDay, setCurrentDay] = useState('ALL_DAYS');
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => new Set(JSON.parse(localStorage.getItem('edcFavorites') || '[]')));
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('edcFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const needsSearchToggle = windowWidth <= 768;

  const dayKeys = currentDay === 'ALL_DAYS' || currentDay === 'COMPACT' ? ['FRIDAY', 'SATURDAY', 'SUNDAY'] : [currentDay];

  const boardData = useMemo(() => {
    const result = {};

    if (currentDay === 'BY_STAGE') {
      stages.forEach((stage) => {
        const stageArtists = [];
        ['FRIDAY', 'SATURDAY', 'SUNDAY'].forEach((day) => {
          let artists = getArtists(day)[stage] || [];
          artists = artists.filter((a) => filterArtists({ artist: a, query: searchTerm, favorites, showFavoritesOnly }));
          if (artists.length > 0) {
            stageArtists.push({ day, artists });
          }
        });

        if (stageArtists.length > 0 && (activeFilters.size === 0 || activeFilters.has(stage))) {
          result[stage] = stageArtists;
        }
      });

      return result;
    }

    dayKeys.forEach((day) => {
      const stageMap = getArtists(day);
      result[day] = Object.fromEntries(
        stages
          .filter((stage) => activeFilters.size === 0 || activeFilters.has(stage))
          .map((stage) => [
            stage,
            (stageMap[stage] || []).filter((artist) => filterArtists({ artist, query: searchTerm, favorites, showFavoritesOnly }))
          ])
      );
    });

    return result;
  }, [currentDay, dayKeys, searchTerm, favorites, showFavoritesOnly, activeFilters]);

  const renderedArtists = useMemo(() => {
    if (currentDay === 'BY_STAGE') {
      return Object.values(boardData).flatMap((stageGroups) => stageGroups.flatMap((g) => g.artists));
    }

    return dayKeys.flatMap((day) => Object.values(boardData[day] || []).flat());
  }, [boardData, currentDay, dayKeys]);

  const toggleFavorite = (name) => {
    if (!name) return;
    setFavorites((prev) => {
      const copy = new Set(prev);
      if (copy.has(name)) copy.delete(name);
      else copy.add(name);
      return copy;
    });
  };

  const clearFilters = () => {
    setActiveFilters(new Set());
    setShowFavoritesOnly(false);
  };

  const renderArtistCard = (artist) => (
    <div
      key={`${artist}-${Math.random().toString(36).substring(2, 8)}`}
      className={`artist-card ${favorites.has(artist) ? 'favorited' : ''}`}
      onClick={() => toggleFavorite(artist)}
    >
      <span className="artist-name">{artist}</span>
      <button className="fav-btn" aria-label={`Favorite ${artist}`}>
        {favorites.has(artist) ? '★' : '☆'}
      </button>
    </div>
  );

  const renderStageColumn = (stage, artists) => (
    <div key={stage} className="stage-column">
      <div className="stage-header">{stage}</div>
      <div className="artist-list">
        {artists.length > 0 ? artists.map(renderArtistCard) : <div className="empty-state">No artists</div>}
      </div>
    </div>
  );

  return (
    <div className={`app ${currentDay === 'COMPACT' ? 'compact-mode' : ''}`}>
      <div className="header-title">
        <h1>EDC 2026 Lineup</h1>
        <p className="subtitle">Filter stages, search artists, and favorite your must-see sets.</p>
      </div>

      <div className="dashboard-controls" id="dashboard-controls">
        <div className={`top-controls ${needsSearchToggle ? 'needs-search-toggle' : ''} ${isSearchActive ? 'search-active' : ''}`}>
          <div className="tabs" id="day-tabs">
            {DAY_LABELS.map((day) => (
              <button
                key={day.key}
                className={`tab-btn ${currentDay === day.key ? 'active' : ''}`}
                onClick={() => {
                  setCurrentDay(day.key);
                  setIsSearchActive(false);
                  setSearchTerm('');
                }}
              >
                {day.label}
              </button>
            ))}
          </div>

          <button
            className="search-toggle"
            id="search-toggle"
            aria-label="Toggle search"
            onClick={() => setIsSearchActive((v) => !v)}
          >
            🔍
          </button>

          <div className="search-container" id="search-container">
            <button
              className="search-back"
              id="search-back"
              onClick={() => {
                setIsSearchActive(false);
                setSearchTerm('');
              }}
              aria-label="Back"
            >
              ←
            </button>
            <div className="search-input-wrap">
              <span className="search-icon-inline">🔎</span>
              <input
                type="text"
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search artists..."
              />
              <button
                className="search-clear"
                id="search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Clear"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="filters-wrapper">
          <div className="filters-scroll-area" id="filters-scroll-area">
            <div className="filters-container" id="filters-container">
              <button
                className={`filter-pill ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => {
                  setShowFavoritesOnly((v) => !v);
                }}
              >
                ★ Favorited
              </button>

              {stages.map((stage) => (
                <button
                  key={stage}
                  className={`filter-pill ${activeFilters.has(stage) ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilters((prev) => {
                      const copy = new Set(prev);
                      if (copy.has(stage)) copy.delete(stage);
                      else copy.add(stage);
                      return copy;
                    });
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-actions" id="filter-actions">
            <button className={`clear-filters ${activeFilters.size > 0 || showFavoritesOnly ? 'show' : ''}`} onClick={clearFilters}>
              Clear
            </button>
          </div>
        </div>
      </div>

      <div id="main-content">
        {currentDay === 'BY_STAGE' ? (
          <div className="grid-board">
            {Object.entries(boardData).map(([stage, dayGroups]) => (
              <div key={stage} className="stage-column">
                <div className="stage-header">{stage}</div>
                <div className="artist-list">
                  {dayGroups.flatMap((g) => [
                    <div key={`${stage}-${g.day}-label`} className="day-subheader">
                      {g.day}
                    </div>,
                    ...g.artists.map((artist) => renderArtistCard(artist))
                  ])}
                </div>
              </div>
            ))}
          </div>
        ) : (
          dayKeys.map((day) => {
            const stageMap = boardData[day] || {};
            const hasNonEmptyStage = Object.values(stageMap).some((artists) => artists.length > 0);
            if (!hasNonEmptyStage) return null;
            return (
              <div key={day}>
                <div className="day-section-header">{day.toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase())}</div>
                <div className="grid-board">
                  {Object.entries(stageMap).map(([stage, artists]) => renderStageColumn(stage, artists))}
                </div>
              </div>
            );
          })
        )}

        {renderedArtists.length === 0 && <div className="empty-state">No artists</div>}
      </div>
    </div>
  );
}
