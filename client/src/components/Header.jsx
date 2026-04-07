import React from 'react';
import styles from './Header.module.css';

export default function Header({ query, onQuery, media, onMedia, genre, onGenre, genres, onClear }) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <span>MP</span>
          <div className={styles.logoPulse} />
        </div>
        <div>
          <h1 className={styles.title}>Movie Pulse</h1>
          <p className={styles.tagline}>Feel the heartbeat of cinema</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.search}
            type="search"
            placeholder="Search movies or TV shows…"
            value={query}
            onChange={e => onQuery(e.target.value)}
          />
        </div>

        <select
          className={styles.select}
          value={media}
          onChange={e => onMedia(e.target.value)}
        >
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>

        <select
          className={styles.select}
          value={genre}
          onChange={e => onGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <button className={styles.clearBtn} onClick={onClear}>
          ✕ Clear
        </button>
      </div>
    </header>
  );
}
