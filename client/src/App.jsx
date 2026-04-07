import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import MovieCard from './components/MovieCard';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import { useMovies } from './hooks/useMovies';
import styles from './App.module.css';

export default function App() {
  const {
    items, genres, loading, error,
    page, totalPages,
    query, setQuery,
    genre, setGenre,
    media, changeMedia,
    goTo,
  } = useMovies();

  const [selected, setSelected] = useState(null); // { media, id }

  // Expose globally so Modal's similar cards can trigger re-open
  window.__openDetails = (m, id) => setSelected({ media: m, id });

  const handleOpen = useCallback((m, id) => setSelected({ media: m, id }), []);
  const handleClose = useCallback(() => setSelected(null), []);

  const handleClear = () => {
    setQuery('');
    setGenre('');
  };

  const sectionTitle = query
    ? `Results for "${query}"`
    : genre
      ? `${genres.find(g => String(g.id) === String(genre))?.name ?? ''} ${media === 'movie' ? 'Movies' : 'TV Shows'}`
      : `Popular ${media === 'movie' ? 'Movies' : 'TV Shows'}`;

  return (
    <div className={styles.app}>
      <Header
        query={query}
        onQuery={setQuery}
        media={media}
        onMedia={changeMedia}
        genre={genre}
        onGenre={setGenre}
        genres={genres}
        onClear={handleClear}
      />

      <main className={styles.main}>
        <div className={styles.titleRow}>
          <h2 className={styles.sectionTitle}>{sectionTitle}</h2>
          {!loading && !error && (
            <span className={styles.count}>{items.length} titles</span>
          )}
        </div>

        {error && (
          <div className={styles.errorBanner}>
            ⚠ {error}
          </div>
        )}

        {loading ? (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className={styles.skeleton} style={{ animationDelay: `${i * 0.04}s` }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="48" height="48">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p>No results found</p>
            <span>Try a different search or genre</span>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((item, i) => (
              <MovieCard
                key={item.id}
                item={item}
                media={media}
                onClick={handleOpen}
                style={{ animationDelay: `${i * 0.03}s` }}
              />
            ))}
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onGoTo={goTo} />
      </main>

      {selected && (
        <Modal
          media={selected.media}
          id={selected.id}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
