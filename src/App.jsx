import { useState, useCallback } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { DayGrid } from './components/DayGrid';
import { ByStageGrid } from './components/ByStageGrid';
import { CompactGrid } from './components/CompactGrid';

export default function App() {
  const [activeDay, setActiveDay] = useState('ALL_DAYS');
  const [query, setQuery] = useState('');
  const [activeStages, setActiveStages] = useState(new Set());
  const [favOnly, setFavOnly] = useState(false);
  const { favorites, toggle: toggleFavorite } = useFavorites();

  const handleStageToggle = useCallback(stage => {
    setActiveStages(prev => {
      const next = new Set(prev);
      next.has(stage) ? next.delete(stage) : next.add(stage);
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
      />

      <main>
        {activeDay === 'BY_STAGE' ? (
          <ByStageGrid {...gridProps} />
        ) : activeDay === 'COMPACT' ? (
          <CompactGrid {...gridProps} />
        ) : activeDay === 'ALL_DAYS' ? (
          DAYS.map(day => (
            <DayGrid key={day} day={day} showDayHeader {...gridProps} />
          ))
        ) : (
          <DayGrid day={activeDay} {...gridProps} />
        )}
      </main>
    </>
  );
}
