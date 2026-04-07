import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_KEY = process.env.TMDB_API_KEY || '60c7adcff566c19c283f58cfcb3ba4b6';
const TMDB_BASE = 'https://api.themoviedb.org/3';

app.use(cors());
app.use(express.json());

// Generic TMDB proxy helper
async function tmdbFetch(path, params = {}) {
  const url = new URL(TMDB_BASE + path);
  url.searchParams.set('api_key', TMDB_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v);
  });
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Routes ──────────────────────────────────────────────

// Genres
app.get('/api/genres/:media', async (req, res) => {
  try {
    const data = await tmdbFetch(`/genre/${req.params.media}/list`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Discover / popular
app.get('/api/discover/:media', async (req, res) => {
  try {
    const { page = 1, genre = '', sort_by = 'popularity.desc' } = req.query;
    const data = await tmdbFetch(`/discover/${req.params.media}`, {
      page,
      sort_by,
      with_genres: genre,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Search
app.get('/api/search/:media', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) return res.status(400).json({ error: 'query is required' });
    const data = await tmdbFetch(`/search/${req.params.media}`, {
      query,
      page,
      include_adult: false,
    });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Details
app.get('/api/details/:media/:id', async (req, res) => {
  try {
    const { media, id } = req.params;
    const [details, videos, similar] = await Promise.all([
      tmdbFetch(`/${media}/${id}`),
      tmdbFetch(`/${media}/${id}/videos`),
      tmdbFetch(`/${media}/${id}/similar`, { page: 1 }),
    ]);
    res.json({ details, videos, similar });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Trending
app.get('/api/trending/:media', async (req, res) => {
  try {
    const { window = 'week' } = req.query;
    const data = await tmdbFetch(`/trending/${req.params.media}/${window}`);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🎬 Movie Pulse server running on http://localhost:${PORT}`);
});
