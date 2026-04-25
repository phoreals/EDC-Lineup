import { useState, useCallback, useMemo } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
// Copy-to-clipboard toast for favorites — hidden for now, see FavToast.jsx
// import { FavToast } from './components/FavToast';
import { AlphaGrid } from './components/AlphaGrid';
import { ByStageGrid } from './components/ByStageGrid';
import { CompactGrid } from './components/CompactGrid';
import { ScheduleGrid } from './components/ScheduleGrid';

export default function App() {
  const [activeDay, setActiveDayRaw] = useState('SCHEDULE');

  const setActiveDay = useCallback(day => {
    setActiveDayRaw(day);
    if (day === 'SCHEDULE') {
      setActiveFilterDays(prev =>
        prev.size <= 1 ? prev : new Set([prev.values().next().value])
      );
    }
  }, []);
  const [query, setQuery] = useState('');
  const [activeStages, setActiveStages] = useState(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [activeFilterDays, setActiveFilterDays] = useState(new Set());
  const [listMode, setListMode] = useState('list');
  const [colSize, setColSize] = useState('md');
  const [listLayout, setListLayout] = useState('grid');
  const { favorites, toggle: toggleFavorite } = useFavorites();
  // Copy-to-clipboard toast state — hidden for now, see FavToast.jsx
  // const [toastDismissed, setToastDismissed] = useState(false);
  // useEffect(() => { if (!favOnly) setToastDismissed(false); }, [favOnly]);

  const handleStageToggle = useCallback(stage => {
    setActiveStages(prev => {
      const next = new Set(prev);
      next.has(stage) ? next.delete(stage) : next.add(stage);
      return next;
    });
  }, []);

  const handleFilterDayToggle = useCallback((day, singleSelect) => {
    if (singleSelect) {
      setActiveFilterDays(new Set([day]));
    } else {
      setActiveFilterDays(prev => {
        const next = new Set(prev);
        next.has(day) ? next.delete(day) : next.add(day);
        return next;
      });
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setQuery('');
    setActiveStages(new Set());
    setFavOnly(false);
    setActiveFilterDays(new Set());
  }, []);

  const normalizedQuery = query.toLowerCase().trim();

  const gridProps = {
    query: normalizedQuery,
    activeStages,
    favOnly,
    favorites,
    onToggle: toggleFavorite,
  };

  const visibleDays = activeFilterDays.size > 0
    ? DAYS.filter(d => activeFilterDays.has(d))
    : DAYS;

  // const isScheduleView = activeDay === 'SCHEDULE';
  // const showFavToast = favOnly && !toastDismissed &&
  //   (isScheduleView || (activeDay === 'LIST' && listMode === 'compact'));

  const tagline = useMemo(() => {
    if (activeDay === 'SCHEDULE') {
      const scheduleDay = activeFilterDays.size === 1
        ? [...activeFilterDays][0]
        : 'FRIDAY';
      const verbose = {
        FRIDAY:   'Friday, May 15, 2026',
        SATURDAY: 'Saturday, May 16, 2026',
        SUNDAY:   'Sunday, May 17, 2026',
      };
      return `Schedule for ${verbose[scheduleDay]}`;
    }
    const browseMode = { list: 'alphabetically', compact: 'by day', byStage: 'by stage' };
    return `Browse the lineup ${browseMode[listMode]}`;
  }, [activeDay, activeFilterDays, listMode]);

  return (
    <>
      <Header tagline={tagline} />

      <Controls
        activeDay={activeDay}
        onDayChange={setActiveDay}
        query={query}
        onQueryChange={setQuery}
        activeStages={activeStages}
        onStageToggle={handleStageToggle}
        favOnly={favOnly}
        onFavToggle={() => setFavOnly(v => !v)}
        onClearFilters={handleClearFilters}
        activeFilterDays={activeFilterDays}
        onFilterDayToggle={handleFilterDayToggle}
        listMode={listMode}
        onListModeChange={setListMode}
        colSize={colSize}
        onColSizeChange={setColSize}
        listLayout={listLayout}
        onListLayoutChange={setListLayout}
      />

      {/* Copy-to-clipboard toast — hidden for now, see FavToast.jsx
      <FavToast
        visible={showFavToast}
        favorites={favorites}
        activeFilterDays={activeFilterDays}
        onDismiss={() => setToastDismissed(true)}
      /> */}

      <main>
        {activeDay === 'SCHEDULE' ? (
          <ScheduleGrid activeFilterDays={activeFilterDays} colSize={colSize} {...gridProps} />
        ) : listMode === 'byStage' ? (
          <ByStageGrid visibleDays={visibleDays} listLayout={listLayout} {...gridProps} />
        ) : listMode === 'compact' ? (
          <CompactGrid visibleDays={visibleDays} listLayout={listLayout} {...gridProps} />
        ) : (
          <AlphaGrid visibleDays={visibleDays} listLayout={listLayout} {...gridProps} />
        )}
      </main>
    </>
  );
}
