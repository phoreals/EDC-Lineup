import { useState, useCallback } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
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
  const { favorites, toggle: toggleFavorite } = useFavorites();

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

  const isScheduleView = activeDay === 'SCHEDULE';

  return (
    <>
      <Header />

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
      />

      <main style={isScheduleView ? { overflow: 'hidden' } : undefined}>
        {activeDay === 'SCHEDULE' ? (
          <ScheduleGrid activeFilterDays={activeFilterDays} colSize={colSize} {...gridProps} />
        ) : listMode === 'byStage' ? (
          <ByStageGrid visibleDays={visibleDays} {...gridProps} />
        ) : listMode === 'compact' ? (
          <CompactGrid visibleDays={visibleDays} {...gridProps} />
        ) : (
          <AlphaGrid visibleDays={visibleDays} {...gridProps} />
        )}
      </main>
    </>
  );
}
