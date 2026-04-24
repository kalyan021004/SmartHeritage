# 🏛️ SmartHeritage

A full-stack web application that lets users explore Indian and global heritage sites with AI-powered information generation, virtual tours, voice narration, interactive quizzes, and trail planning.

Built with **Vite + React** (frontend) and **Node.js + Express** (backend), powered by **Groq AI (free)** and **MongoDB**.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🔍 Smart Search | Search any heritage site. If not in DB, AI generates a full profile instantly |
| 🤖 AI Fallback | Uses Groq (Llama 3.3 70B) to generate history, architecture, culture info |
| 🎥 Virtual Tour | Embeds Google Maps 360°, Google Arts & Culture, and YouTube tour links |
| 🎙️ Voice Narration | AI narrates each tour hotspot — spoken aloud using browser Text-to-Speech |
| 💬 AI Chat Guide | Ask anything about a site — history, myths, architecture, visitor tips |
| 🧠 Quiz Generator | AI generates 6 custom questions per site with scoring and badges |
| 🗺️ Explore Map | Leaflet map showing all heritage sites with clickable pins |
| 📂 Category Browse | Browse sites by type — Temple, Fort, Palace, Cave, Ruins, etc. |
| 🧭 Trail Planner | AI plans a multi-stop heritage route based on your start location |
| 👥 Community | Share and read real visitor stories from heritage sites |

---

## 🗂️ Project Structure

```
heritage-explorer/
│
├── client/                        # Vite + React frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   ├── siteApi.js         # Site search, fetch, generate
│   │   │   ├── quizApi.js         # Quiz generation
│   │   │   └── trailApi.js        # Trail generation
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky navbar with mobile menu
│   │   │   ├── SearchBar.jsx      # Debounced search + AI fallback
│   │   │   ├── SiteCard.jsx       # Card used in category/search results
│   │   │   ├── SiteHero.jsx       # Site name, location, badges
│   │   │   ├── HistorySection.jsx # Historical background + legend
│   │   │   ├── ArchSection.jsx    # Architecture highlights
│   │   │   ├── CultureSection.jsx # Cultural significance
│   │   │   ├── VisitorInfo.jsx    # Timings, fees, directions
│   │   │   ├── AiBadge.jsx        # "AI generated" warning badge
│   │   │   ├── ChatInterface.jsx  # AI chat UI
│   │   │   ├── CategoryGrid.jsx   # Category emoji grid
│   │   │   ├── ExploreMap.jsx     # Leaflet map component
│   │   │   ├── TrailPlanner.jsx   # Trail form + AI result
│   │   │   ├── CommunityFeed.jsx  # Community stories feed
│   │   │   ├── QuizCard.jsx       # Single quiz question card
│   │   │   ├── QuizResult.jsx     # Score + badge display
│   │   │   └── tour/
│   │   │       ├── TourPlayer.jsx        # Detects link type, renders embed
│   │   │       ├── GoogleMapsEmbed.jsx   # Maps 360° embed/link
│   │   │       ├── ArtsEmbed.jsx         # Google Arts & Culture iframe
│   │   │       ├── YoutubeEmbed.jsx      # YouTube embed
│   │   │       ├── NarrationPanel.jsx    # Hotspot list + AI narration
│   │   │       └── HotspotOverlay.jsx    # Clickable hotspot badges
│   │   ├── lib/
│   │   │   └── detectTourType.js  # Detects maps/arts/youtube from URL
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page with search
│   │   │   ├── SiteDetailPage.jsx # Full place detail page
│   │   │   ├── TourPage.jsx       # Virtual tour page
│   │   │   ├── ChatPage.jsx       # AI guide chat page
│   │   │   ├── QuizPage.jsx       # Quiz + scoring page
│   │   │   ├── ExplorePage.jsx    # Map browse page
│   │   │   ├── CategoryPage.jsx   # Browse by category
│   │   │   ├── TrailPage.jsx      # Heritage trail planner
│   │   │   └── CommunityPage.jsx  # Community stories
│   │   ├── tests/
│   │   │   ├── setup.js
│   │   │   ├── SearchBar.test.jsx
│   │   │   ├── SiteDetail.test.jsx
│   │   │   ├── TourPlayer.test.jsx
│   │   │   └── Chat.test.jsx
│   │   ├── App.jsx                # React Router setup
│   │   ├── main.jsx
│   │   └── index.css              # Global reset only
│   ├── vite.config.js             # Vite + proxy to server:5000
│   └── package.json
│
└── server/                        # Node.js + Express backend
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── siteController.js      # Search, fetch, AI generate
    │   ├── tourController.js      # AI hotspot narration
    │   ├── chatController.js      # AI chat with site context
    │   ├── quizController.js      # AI quiz generation
    │   └── trailController.js     # AI trail planning
    ├── lib/
    │   └── openrouter.js          # Groq API wrapper (chatCompletion)
    ├── models/
    │   └── Site.js                # Mongoose schema
    ├── routes/
    │   ├── siteRoutes.js          # /api/sites/*
    │   ├── tourRoutes.js          # /api/tour/*
    │   ├── chatRoutes.js          # /api/chat
    │   ├── quizRoutes.js          # /api/quiz/*
    │   └── trailRoutes.js         # /api/trail/*
    ├── scripts/
    │   └── seedData.js            # Seeds 3 sample heritage sites
    ├── tests/
    │   ├── db.test.js
    │   ├── search.test.js
    │   ├── siteDetail.test.js
    │   ├── tour.test.js
    │   ├── chat.test.js
    │   ├── quiz.test.js
    │   └── trail.test.js
    ├── server.js                  # Express entry point
    ├── .env                       # Environment variables
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
- [Groq API key](https://console.groq.com) (free)

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/heritage-explorer.git
cd heritage-explorer
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

### 4. Configure environment variables

Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/heritageDB
GROQ_API_KEY=gsk_your_groq_key_here
```

> **Get your free Groq API key** → [console.groq.com](https://console.groq.com)  
> **Get free MongoDB URI** → [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

### 5. Seed the database

```bash
cd server
node scripts/seedData.js
```

You should see:
```
MongoDB connected
✓ Seeded 3 sites
```

### 6. Start the backend server

```bash
cd server
npm run dev
```

Server runs at `http://localhost:5000`

### 7. Start the frontend (new terminal)

```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Reference

### Sites

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sites/search?q=` | Search sites by name/location |
| GET | `/api/sites/all` | Get all sites (for map) |
| GET | `/api/sites/:slug` | Get single site by slug |
| POST | `/api/sites/generate` | AI generate site info |

### Tour

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/tour/narrate` | AI narrate a tour hotspot |

### Chat

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI chat with site context |

### Quiz

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/quiz/generate` | AI generate quiz questions |

### Trail

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/trail/generate` | AI plan heritage trail |

---

## 🧪 Running Tests

### Backend tests (Jest + Supertest)

```bash
cd server
npm test
```

### Frontend tests (Vitest + Testing Library)

```bash
cd client
npm test
```

---

## 🤖 AI Model

This project uses **Groq API** with **Llama 3.3 70B Versatile** model.

- **Free tier**: 1,000 requests/day, 12,000 tokens/minute
- **No credit card** required
- **Sign up**: [console.groq.com](https://console.groq.com)

The AI is used for:
- Generating heritage site profiles when not found in DB
- Virtual tour hotspot narration scripts
- AI chat guide responses
- Quiz question generation
- Heritage trail planning

---

## 🗃️ MongoDB Schema

Each heritage site stores:

```js
{
  name, slug, also_known_as,
  location: { city, state, country, lat, lng },
  category,                    // Temple | Fort | Palace | Cave | Ruins ...
  dynasty_or_period,
  year_built, built_by,
  architectural_style,
  historical_background,       // 3-4 sentence paragraph
  cultural_significance,       // 2-3 sentence paragraph
  architectural_highlights,    // array of 4-6 features
  legends_and_stories,
  virtual_tour_links: [{       // your Google links go here
    url, type, label           // type: maps | arts | youtube
  }],
  virtual_tour_hotspots: [{ name, description }],
  visitor_info: {
    timings, entry_fee,
    best_time_to_visit,
    how_to_reach, accessibility
  },
  nearby_sites,
  conservation_status,
  data_source                  // database | ai_generated | mixed
}
```

---

## 🔗 Adding Virtual Tour Links

To add Google tour links to a site, update the `virtual_tour_links` field in MongoDB directly or via the seed script:

```js
virtual_tour_links: [
  {
    url: 'https://www.google.com/maps/@10.7828,79.1318,3a...',
    type: 'maps',       // opens in new tab with full 360° experience
    label: 'Street View — main entrance'
  },
  {
    url: 'https://artsandculture.google.com/story/...',
    type: 'arts',       // embeds as iframe
    label: 'Google Arts & Culture tour'
  },
  {
    url: 'https://www.youtube.com/watch?v=...',
    type: 'youtube',    // auto-converts to embed
    label: 'Aerial drone footage'
  }
]
```

| Link type | How it renders |
|---|---|
| `maps` | Button → opens full 360° on Google Maps in new tab |
| `arts` | Renders as iframe directly in page |
| `youtube` | Auto-converts URL to embed iframe |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 (JSX only, no TypeScript) |
| Routing | React Router v6 |
| HTTP client | Axios |
| Map | Leaflet + React Leaflet |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI | Groq API (Llama 3.3 70B — free) |
| Testing BE | Jest + Supertest |
| Testing FE | Vitest + Testing Library |
| Fonts | Google Fonts (Playfair Display + DM Sans) |

---

## 🌍 Deployment

### Deploy backend (Railway / Render)

1. Push `server/` to GitHub
2. Create new project on [railway.app](https://railway.app) or [render.com](https://render.com)
3. Set environment variables: `MONGODB_URI`, `GROQ_API_KEY`, `PORT`
4. Deploy

### Deploy frontend (Vercel / Netlify)

1. Update `client/vite.config.js` proxy target to your deployed backend URL
2. Push `client/` to GitHub
3. Import on [vercel.com](https://vercel.com)
4. Set `VITE_API_URL` if needed
5. Deploy

---

## 🛠️ Development Scripts

| Command | Description |
|---|---|
| `cd server && npm run dev` | Start backend with nodemon (auto-restart) |
| `cd client && npm run dev` | Start frontend with HMR |
| `cd server && npm test` | Run backend tests |
| `cd client && npm test` | Run frontend tests |
| `cd server && node scripts/seedData.js` | Seed sample heritage sites |

---

## 📋 Phase-wise Build Order

| Phase | What was built |
|---|---|
| Phase 1 | Project init, MongoDB schema, seed data, Vite setup |
| Phase 2 | Search API, AI fallback generation, Home page |
| Phase 3 | Place Detail page — history, architecture, culture, visitor info |
| Phase 4 | Virtual Tour — Google Maps, Arts & Culture, YouTube embeds + AI narration |
| Phase 5 | AI Chat — streaming responses with site context |
| Phase 6 | Quiz, Explore Map, Category Browse, Trail Planner, Community |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and educational projects.

---

## 🙏 Acknowledgements

- [Groq](https://groq.com) — free, blazing fast LLM inference
- [OpenStreetMap](https://openstreetmap.org) — free map tiles via Leaflet
- [Archaeological Survey of India](https://asi.nic.in) — heritage site reference data
- [Google Arts & Culture](https://artsandculture.google.com) — virtual tour content

---

<p align="center">Made with ❤️ for Indian Heritage</p>
