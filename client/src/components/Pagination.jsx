import React from 'react';
import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onGoTo }) {
  if (totalPages <= 1) return null;

  const span  = 5;
  let start   = Math.max(1, page - Math.floor(span / 2));
  let end     = Math.min(totalPages, start + span - 1);
  if (end - start < span - 1) start = Math.max(1, end - span + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <button className={styles.btn} onClick={() => onGoTo(1)}     disabled={page === 1}          aria-label="First page">«</button>
      <button className={styles.btn} onClick={() => onGoTo(page-1)} disabled={page === 1}         aria-label="Previous page">‹</button>

      {start > 1 && <span className={styles.ellipsis}>…</span>}

      {pages.map(p => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => onGoTo(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {end < totalPages && <span className={styles.ellipsis}>…</span>}

      <button className={styles.btn} onClick={() => onGoTo(page+1)} disabled={page === totalPages} aria-label="Next page">›</button>
      <button className={styles.btn} onClick={() => onGoTo(totalPages)} disabled={page === totalPages} aria-label="Last page">»</button>
    </nav>
  );
}
