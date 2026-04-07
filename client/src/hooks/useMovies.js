import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api';

export function useMovies() {
  const [items, setItems]           = useState([]);
  const [genres, setGenres]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery]           = useState('');
  const [genre, setGenre]           = useState('');
  const [media, setMedia]           = useState('movie');
  const debounceRef                 = useRef(null);

  // Load genres whenever media type changes
  useEffect(() => {
    api.genres(media)
      .then(d => setGenres(d.genres || []))
      .catch(console.error);
  }, [media]);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (query) {
        data = await api.search(media, query, pg);
      } else {
        data = await api.discover(media, pg, genre);
      }
      setItems(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setPage(pg);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [media, query, genre]);

  // Reload on filter/query changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(1), query ? 420 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [load]);

  const changeMedia = useCallback((m) => {
    setMedia(m);
    setQuery('');
    setGenre('');
    setPage(1);
  }, []);

  return {
    items, genres, loading, error,
    page, totalPages,
    query, setQuery,
    genre, setGenre,
    media, changeMedia,
    goTo: load,
  };
}
