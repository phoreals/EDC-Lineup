import { useState, useCallback, useMemo, useEffect } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { MyScheduleToast } from './components/MyScheduleToast';
import { AlphaGrid } from './components/AlphaGrid';
import { ByStageGrid } from './components/ByStageGrid';
import { CompactGrid } from './components/CompactGrid';
import { ScheduleGrid } from './components/ScheduleGrid';
import { MyScheduleGrid } from './components/MyScheduleGrid';

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
  const [mySchedToastDismissed, setMySchedToastDismissed] = useState(false);
  useEffect(() => { if (!favOnly) setMySchedToastDismissed(false); }, [favOnly]);

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
    if (activeDay !== 'SCHEDULE') {
      setActiveFilterDays(new Set());
    }
  }, [activeDay]);

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

  const isMySchedule = activeDay === 'MY_SCHEDULE';

  const tagline = useMemo(() => {
    if (isMySchedule) return 'My Schedule';
    if (activeDay === 'SCHEDULE') {
      const scheduleDay = activeFilterDays.size === 1
        ? [...activeFilterDays][0]
        : 'FRIDAY';
      const verbose = {
        FRIDAY:   'Friday, May 15, 2026',
        SATURDAY: 'Saturday, May 16, 2026',
        SUNDAY:   'Sunday, May 17, 2026',
      };
      return `Timetable for ${verbose[scheduleDay]}`;
    }
    const browseMode = { list: 'alphabetically', compact: 'by day', byStage: 'by stage' };
    return `Browse the lineup ${browseMode[listMode]}`;
  }, [activeDay, isMySchedule, activeFilterDays, listMode]);

  return (
    <>
      <Header tagline={tagline} />

      {!isMySchedule && (
        <>
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

          <MyScheduleToast
            visible={favOnly && !mySchedToastDismissed}
            onSwitch={() => { setActiveDayRaw('MY_SCHEDULE'); setFavOnly(false); setMySchedToastDismissed(true); }}
            onDismiss={() => setMySchedToastDismissed(true)}
          />
        </>
      )}

      <main>
        {isMySchedule ? (
          <MyScheduleGrid
            favorites={favorites}
            onBack={() => setActiveDayRaw('LIST')}
          />
        ) : activeDay === 'SCHEDULE' ? (
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
