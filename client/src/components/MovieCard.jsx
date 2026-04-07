import React, { useState } from 'react';
import { IMG } from '../api';
import styles from './MovieCard.module.css';

export default function MovieCard({ item, media, onClick }) {
  const [imgError, setImgError] = useState(false);
  const title   = item.title || item.name || 'Untitled';
  const poster  = item.poster_path && !imgError ? IMG + item.poster_path : null;
  const release = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating  = item.vote_average ? item.vote_average.toFixed(1) : null;
  const score   = item.vote_average || 0;

  const ratingColor =
    score >= 7.5 ? '#4ade80' :
    score >= 6   ? '#e8c96d' :
    score >= 4   ? '#fb923c' : '#f87171';

  return (
    <article className={styles.card} onClick={() => onClick(media, item.id)} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick(media, item.id)}>
      <div className={styles.posterWrap}>
        {poster
          ? <img className={styles.poster} src={poster} alt={title} loading="lazy" onError={() => setImgError(true)} />
          : <div className={styles.posterFallback}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" width="32" height="32">
                <rect x="2" y="3" width="20" height="14" rx="2"/>
                <path d="M8 21h8M12 17v4"/>
              </svg>
              <span>{title}</span>
            </div>
        }
        {rating && (
          <div className={styles.badge} style={{ color: ratingColor }}>
            ⭐ {rating}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.cardTitle}>{title}</div>
        {release && <div className={styles.year}>{release}</div>}
      </div>
    </article>
  );
}
