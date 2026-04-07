# 🎬 Movie Pulse

> **Feel the heartbeat of cinema** — a full-stack movie & TV browser built with React + Express.
>
## 🌐 Live Demo
[Movie Pulse](https://movie-pulse-theta-nu.vercel.app/)

![Stack](https://img.shields.io/badge/stack-React%20%2B%20Express-blueviolet)
![TMDB](https://img.shields.io/badge/data-TMDB%20API-01b4e4)

---

## ✨ Features

- 🎥 Browse popular **movies** and **TV shows**
- 🔍 Live **search** with debounce
- 🏷️ Filter by **genre**
- 📄 **Pagination** (up to 500 pages)
- 🎞️ **Detail modal** with backdrop, trailers, and similar titles
- 📱 Fully **responsive** — mobile to desktop
- ⚡ Express **proxy backend** — API key stays server-side
- 🌗 Cinematic dark theme with grain texture and smooth animations

---

## 🗂️ Project Structure

```
movie-pulse/
├── package.json          ← root scripts (concurrently)
│
├── server/               ← Express backend
│   ├── index.js          ← API routes + TMDB proxy
│   ├── package.json
│   ├── .env              ← your API key goes here
│   └── .env.example
│
└── client/               ← React frontend (Vite)
    ├── index.html
    ├── vite.config.js    ← proxies /api → localhost:5000
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.module.css
        ├── index.css
        ├── api.js              ← fetch helpers
        ├── hooks/
        │   └── useMovies.js    ← all state & data logic
        └── components/
            ├── Header.jsx / .module.css
            ├── MovieCard.jsx / .module.css
            ├── Pagination.jsx / .module.css
            └── Modal.jsx / .module.css
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** v18+
- A free [TMDB API key](https://www.themoviedb.org/settings/api)

### 2. Clone & Install

```bash
git clone <your-repo-url>
cd movie-pulse

# Install root dev tools
npm install

# Install server + client dependencies
npm run install:all
```

### 3. Configure Environment

```bash
cp server/.env.example server/.env
```

Open `server/.env` and add your TMDB API key:

```env
PORT=5000
TMDB_API_KEY=your_actual_key_here
```

### 4. Run in Development

```bash
# Start both server (port 5000) and client (port 3000) together
npm run dev
```

Then open **http://localhost:3000** in your browser.

> Vite proxies all `/api/*` requests to the Express server automatically — no CORS issues.

---

## 🔌 API Endpoints (Express)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/genres/:media` | Fetch genre list for `movie` or `tv` |
| GET | `/api/discover/:media` | Browse/discover with pagination & genre filter |
| GET | `/api/search/:media` | Search by query string |
| GET | `/api/details/:media/:id` | Full details + videos + similar titles |
| GET | `/api/trending/:media` | Trending this day or week |
| GET | `/health` | Health check |

**Query parameters:**
- `page` — page number (default: 1)
- `genre` — TMDB genre ID
- `sort_by` — e.g. `popularity.desc`
- `query` — search term (search endpoint)
- `window` — `day` or `week` (trending endpoint)

---

## 🏗️ Production Build

```bash
# Build React app
npm run build

# Serve with Express (serve the dist folder)
npm start
```

To serve the built client from Express, add to `server/index.js`:

```js
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// After your API routes:
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (_, res) =>
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
);
```

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Express 5, node-fetch |
| Data | TMDB API v3 |
| Dev tooling | concurrently, nodemon |
| Fonts | Bebas Neue (display), DM Sans (body) |

---

## 📝 Notes

- The TMDB API key is **only ever used server-side** — it's never exposed to the browser.
- All API calls from React go to `/api/*`, which Vite proxies in dev and Express handles in production.
- Pagination is capped at 500 pages (TMDB limit).

---

*Built with ❤️ and the TMDB API. Not affiliated with TMDB.*
