import { useState, useCallback } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { DayGrid } from './components/DayGrid';
import { ByStageGrid } from './components/ByStageGrid';
import { CompactGrid } from './components/CompactGrid';
import { ScheduleGrid } from './components/ScheduleGrid';

export default function App() {
  const [activeDay, setActiveDay] = useState('SCHEDULE');
  const [query, setQuery] = useState('');
  const [activeStages, setActiveStages] = useState(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const [activeFilterDays, setActiveFilterDays] = useState(new Set());
  const [compactMode, setCompactMode] = useState(false);
  const { favorites, toggle: toggleFavorite } = useFavorites();

  const handleStageToggle = useCallback(stage => {
    setActiveStages(prev => {
      const next = new Set(prev);
      next.has(stage) ? next.delete(stage) : next.add(stage);
      return next;
    });
  }, []);

  const handleFilterDayToggle = useCallback(day => {
    setActiveFilterDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveStages(new Set());
    setFavOnly(false);
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
        compactMode={compactMode}
        onCompactToggle={() => setCompactMode(v => !v)}
      />

      <main style={isScheduleView ? { overflow: 'hidden' } : undefined}>
        {activeDay === 'SCHEDULE' ? (
          <ScheduleGrid activeFilterDays={activeFilterDays} {...gridProps} />
        ) : activeDay === 'BY_STAGE' ? (
          <ByStageGrid visibleDays={visibleDays} {...gridProps} />
        ) : compactMode ? (
          <CompactGrid visibleDays={visibleDays} {...gridProps} />
        ) : (
          visibleDays.map(day => (
            <DayGrid key={day} day={day} showDayHeader={visibleDays.length > 1} {...gridProps} />
          ))
        )}
      </main>
    </>
  );
}
