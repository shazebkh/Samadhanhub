# Implementation Plan - SamadhanHub

We will build **SamadhanHub**, a highly visual, dark-themed, community problem-reporting application. It will allow local residents to post community issues (infrastructure, education, transport, forest, etc.) with photos, videos, timelines, and locations. Nearby users can verify if the problem is genuine via likes, and offer solutions via suggestions. Officers and NGOs will see a prioritized dashboard based on community validation.

To make the UI "toddler-understandable," we will use rich graphical representations, large visual category buttons with intuitive icons, simple color-coded priority levels, and an interactive map.

---

## User Review Required

> [!IMPORTANT]
> **Key Architectural Choices:**
> 1. **Zero-Setup Database with Cloud Integration:** We will write a unified `database.js` client. Out of the box, it uses browser-based `localStorage` (so the app works instantly when opened anywhere). It also supports synchronization with a free REST API (like MockAPI or a Node.js backend).
> 2. **Interactive Map:** We will use **Leaflet.js** (an open-source, free map library) with **OpenStreetMap** tiles. This allows users to drop a pin on their exact location to report a problem and search nearby problems.
> 3. **Toddler-Friendly Design**: Big, visual, tactile cards, large colored emojis, smooth animated transitions, and simplified language.

---

## Proposed Changes

We will create a clean, modern frontend structure in the root directory:

```
SIH/
├── index.html          # Main HTML structure, responsive layout, SEO metadata
├── index.css           # Premium Dark-themed styling, Glassmorphism, Animations
├── app.js              # Application controller: view routing, filters, map integration, translation
├── database.js         # Unified database manager (LocalStorage + Server API Sync)
└── server.js           # Lightweight Node/Express backend with file-based DB (for cloud deployment)
```

---

### Component: Frontend UI & Styles

#### [NEW] [index.html](file:///d:/sih/SIH/index.html)
- Dynamic layout containing:
  - Header: App logo, Hindi/English toggle, "Add Post" quick button, and Profile/Location status.
  - Category Selector: A prominent, horizontally scrollable bar with large custom icons/emojis representing categories: Social, Education, Transport, Road, Marine, Forest, Wildlife, Electricity, Tribal.
  - Interactive Map (`#map`): Displays pins of reported problems, color-coded by urgency. Clicking a pin opens a toddler-friendly summary bubble.
  - Main Feed / Timeline: Visual timeline of reported problems showing category badge, user caption, photo/video preview, location, time, likes/dislikes counters, priority status (e.g. High 🔥, Medium ⚠️, Solved ✅), and a suggestion container.
  - Problem Creation Modal: Simple graphical form where users can upload an image/video (simulated via file picker / URL / preset sample drawings), write a caption, choose a category, and select their location.
  - Officer/NGO Dashboard: Summary metrics represented as simple circular progress charts (problems reported, solved, pending).

#### [NEW] [index.css](file:///d:/sih/SIH/index.css)
- Deep space dark theme palette:
  - Background: `#0a0f1d`
  - Cards: Glassmorphic borders with background `#131930b3`, backdrop-filter blur.
  - Primary Accent (Sky Blue): `#38bdf8`
  - Urgent Alert (Coral Pink): `#f43f5e`
  - Hindi Accent (Golden/Saffron): `#f59e0b`
- Custom scrollbar, responsive flex/grid layouts.
- Toddler-friendly tactile buttons: large sizing, hover scaling (`transform: scale(1.05)`), elastic tap effect, glowing borders.
- Timeline custom styling: vertical dotted connector lines, animated nodes.

---

### Component: Application Logic & Database

#### [NEW] [app.js](file:///d:/sih/SIH/app.js)
- Manages Hindi-English localization dictionary:
  - Dynamic translation of buttons, categories, placeholders, and UI elements.
- Handles Leaflet map initialization, center navigation, custom markers, and geocoding via OpenStreetMap Nominatim.
- Manages the visual timeline renderer and category filters.
- Implements the toddler-friendly Priority Scoring System:
  - Score = (Likes * 1.5) - Dislikes
  - Tags:
    - **Critical Priority 🔥** (Score >= 15)
    - **Active Investigation ⚠️** (Score 5-14)
    - **Report Verified 👍** (Score 1-4)
    - **Awaiting Verification ⏳** (Score <= 0)
- Manages simple file loading: reads files uploaded by the user as data URLs so they display as real uploaded images/videos.

#### [NEW] [database.js](file:///d:/sih/SIH/database.js)
- Functions for `getProblems()`, `addProblem(problem)`, `likeProblem(id, type)`, `addSuggestion(id, text)`.
- Connects to `localStorage` as standard backup storage.
- Auto-detects if a server REST backend is active on a port (e.g., local server or a hosted REST API on Render/Glitch) and forwards requests to it.

#### [NEW] [server.js](file:///d:/sih/SIH/server.js)
- Simple Express server with a local JSON file database (`database.json`).
- Exposes routes: `GET /api/problems`, `POST /api/problems`, `POST /api/problems/:id/vote`, `POST /api/problems/:id/suggestion`.
- Solves the backend persistence requirement for production deployment.

---

## Verification Plan

### Automated Verification
- Verify running the local node server using `node server.js` to ensure the server starts and listens correctly.
- Test endpoint operations via curl/fetch checks.

### Manual Verification
1. Open `index.html` in browser using local development hosting or file opening.
2. Toggle English <-> Hindi translation to verify all static texts and placeholders adapt correctly.
3. Select different categories (Road, Electricity, Tribal, etc.) to verify dynamic feed filtering.
4. Add a test problem: upload an image, select a category, write a caption, pin it on the map, and check if it gets saved in the timeline and map.
5. Upvote/Downvote problems to witness the Priority tag upgrade in real time (e.g. changing from "Awaiting Verification" to "Critical Priority").
6. Type suggestions and verify they persist on refresh.
