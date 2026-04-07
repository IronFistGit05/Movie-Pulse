const BASE = 'https://movie-pulse-41me.onrender.com/api';
export const IMG = 'https://image.tmdb.org/t/p/w500';
export const IMG_BIG = 'https://image.tmdb.org/t/p/original';

async function get(path, params = {}) {
  const url = new URL(path, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v != null) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  genres: (media)                          => get(`${BASE}/genres/${media}`),
  discover: (media, page, genre, sort_by)  => get(`${BASE}/discover/${media}`, { page, genre, sort_by }),
  search: (media, query, page)             => get(`${BASE}/search/${media}`, { query, page }),
  details: (media, id)                     => get(`${BASE}/details/${media}/${id}`),
  trending: (media, window = 'week')       => get(`${BASE}/trending/${media}`, { window }),
};
