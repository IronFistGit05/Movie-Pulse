import React, { useEffect, useState } from 'react';
import { api, IMG, IMG_BIG } from '../api';
import styles from './Modal.module.css';

export default function Modal({ media, id, onClose }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setData(null);
    setError(null);
    api.details(media, id)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [media, id]);

  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const det    = data?.details;
  const videos = (data?.videos?.results || []).filter(v => v.site === 'YouTube');
  const similar = (data?.similar?.results || []).slice(0, 10);

  const score = det?.vote_average || 0;
  const ratingColor =
    score >= 7.5 ? '#4ade80' :
    score >= 6   ? '#e8c96d' :
    score >= 4   ? '#fb923c' : '#f87171';

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.card} role="dialog" aria-modal="true">
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

        {loading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerRing} />
            <span>Loading…</span>
          </div>
        )}

        {error && <div className={styles.errorMsg}>⚠ {error}</div>}

        {det && (
          <>
            {det.backdrop_path && (
              <div className={styles.backdropWrap}>
                <img
                  className={styles.backdrop}
                  src={IMG_BIG + det.backdrop_path}
                  alt=""
                  loading="lazy"
                />
                <div className={styles.backdropGradient} />
              </div>
            )}

            <div className={styles.body}>
              <div className={styles.top}>
                {det.poster_path && (
                  <img
                    className={styles.poster}
                    src={IMG + det.poster_path}
                    alt={det.title || det.name}
                  />
                )}
                <div className={styles.meta}>
                  <h2 className={styles.modalTitle}>{det.title || det.name}</h2>
                  {det.tagline && <p className={styles.tagline}>"{det.tagline}"</p>}

                  <div className={styles.chips}>
                    {det.status && <span className={styles.chip}>{det.status}</span>}
                    {(det.release_date || det.first_air_date) && (
                      <span className={styles.chip}>
                        {(det.release_date || det.first_air_date).slice(0, 4)}
                      </span>
                    )}
                    {det.runtime ? (
                      <span className={styles.chip}>{det.runtime}m</span>
                    ) : det.number_of_seasons ? (
                      <span className={styles.chip}>{det.number_of_seasons} season{det.number_of_seasons !== 1 ? 's' : ''}</span>
                    ) : null}
                    {score > 0 && (
                      <span className={styles.chip} style={{ color: ratingColor }}>
                        ⭐ {score.toFixed(1)} <span style={{ color: 'var(--muted)', fontSize: 12 }}>({det.vote_count?.toLocaleString()})</span>
                      </span>
                    )}
                  </div>

                  {(det.genres || []).length > 0 && (
                    <div className={styles.genres}>
                      {det.genres.map(g => (
                        <span key={g.id} className={styles.genre}>{g.name}</span>
                      ))}
                    </div>
                  )}

                  {det.overview && <p className={styles.overview}>{det.overview}</p>}
                </div>
              </div>

              {videos.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Videos</h3>
                  <div className={styles.videos}>
                    {videos.slice(0, 2).map(v => (
                      <div key={v.key} className={styles.videoWrap}>
                        <p className={styles.videoLabel}>{v.type} — {v.name}</p>
                        <iframe
                          src={`https://www.youtube.com/embed/${v.key}`}
                          allowFullScreen
                          loading="lazy"
                          title={v.name}
                          className={styles.iframe}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {similar.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Similar</h3>
                  <div className={styles.similar}>
                    {similar.map(s => (
                      <SimilarCard key={s.id} item={s} media={media} onOpen={(newMedia, newId) => {
                        // Trigger re-open by changing parent state
                        onClose();
                        setTimeout(() => window.__openDetails?.(newMedia, newId), 50);
                      }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SimilarCard({ item, media, onOpen }) {
  const title = item.title || item.name || 'Untitled';
  return (
    <button className={styles.miniCard} onClick={() => onOpen(media, item.id)}>
      {item.poster_path
        ? <img src={IMG + item.poster_path} alt={title} loading="lazy" />
        : <div className={styles.miniPlaceholder}>{title[0]}</div>
      }
      <span>{title}</span>
    </button>
  );
}
