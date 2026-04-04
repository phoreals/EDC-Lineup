import { useState, useCallback } from 'react';
import { DAYS } from './data/lineup';
import { useFavorites } from './hooks/useFavorites';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { DayGrid } from './components/DayGrid';
import { ByStageGrid } from './components/ByStageGrid';

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
          <ByStageGrid
            query={normalizedQuery}
            activeStages={activeStages}
            favOnly={favOnly}
            favorites={favorites}
            onToggle={toggleFavorite}
          />
        ) : activeDay === 'ALL_DAYS' ? (
          DAYS.map(day => (
            <DayGrid
              key={day}
              day={day}
              query={normalizedQuery}
              activeStages={activeStages}
              favOnly={favOnly}
              favorites={favorites}
              onToggle={toggleFavorite}
              showDayHeader
            />
          ))
        ) : (
          <DayGrid
            day={activeDay}
            query={normalizedQuery}
            activeStages={activeStages}
            favOnly={favOnly}
            favorites={favorites}
            onToggle={toggleFavorite}
            showDayHeader={false}
          />
        )}
      </main>
    </>
  );
}
