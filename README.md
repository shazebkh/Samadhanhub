# SamadhanHub 🤝 (समाधानहब)

**SamadhanHub** is a visual, interactive community problem-reporting and resolution platform. The key concept is to gather local infrastructure and civil issues from residents (using photos, videos, timelines, and geo-locations) and broadcast them to nearby community feeds, allowing citizens to validate reports (via likes/dislikes) and offer suggestions. Local NGOs and government officers can then view a prioritized control room dashboard sorting critical issues first.

To make the system accessible to everyone, the interface is designed with toddler-friendly visual layouts, colored status tags, category emojis, translation toggles, and an interactive map with maximize controls.

---

## 🎨 Design System & Visuals
*   **Palette:** Premium deep-dark theme accented with a rich **Teal** (`#14b8a6`), **Lavender** (`#d8b4fe`), **Coral** (`#ff7f50`), and **Yellow** (`#fbbf24`) palette.
*   **Tactility:** Large touch targets, hover scaling triggers, floating click animations, and glowing alerts.
*   **Bilingual Translation:** Real-time localized interface toggle between English and Hindi (`EN` / `हिं`) affecting headers, place tags, form text, and comments.

---

## 🚀 Key Features

1. **Interactive Geographic Map**:
   - Built on **Leaflet.js** utilizing dark-themed **CartoDB** tile layers.
   - Pins problems with specific category emojis. Clicking a pin opens a summary bubble pointing to the timeline card.
   - Pick coordinates by clicking on the map, or type a location (e.g. "Delhi") into the search box.
   - **Maximize Map:** Click the scaling icon (`⛶` / `🗗`) next to the search input to overlay the map fullscreen for detailed navigation.

2. **Social Timeline & Priority Tags**:
   - Chronological dotted timeline linking reported problems.
   - **Dynamic Upvote/Downvote Undo:** standard voting behavior where tapping Like increments the counter (glows green) and tapping again decrements it (dims). Handles crossovers instantly.
   - **Priority Tags:** Auto-computed based on engagement score `(Likes * 1.5) - Dislikes`:
     - 🔥 **Critical Priority** (Score >= 15)
     - ⚠️ **Active Investigation** (Score 5-14)
     - 👍 **Report Verified** (Score 1-4)
     - ⏳ **Awaiting Verification** (Score <= 0)
   - **Suggestion Box:** Text area to submit solutions or confirm validity.

3. **Secure API Key Geocoder Wrapper**:
   - The developer's Google Maps API key `AIzaSyDQHmQdfxzw6bPRvUScyf_cgBeW6jWvK_g` is stored on the backend server, preventing users or hackers from extracting it.
   - The client requests `/api/geocode`, and the Node backend proxies the Google Geocoding request securely.
   - **Double-Layered Fallback:** If the backend proxy fails (or Google returns a GCP project billing restriction `REQUEST_DENIED`), the client automatically calls OpenStreetMap's Nominatim geocoder, keeping searches active anywhere.

4. **Zero-Setup Local Database Fallback**:
   - Client database client (`database.js`) checks server connectivity.
   - If the backend is running, it queries Express REST routes.
   - If offline, it switches to `localStorage`, meaning double-clicking `index.html` runs a fully interactive mock prototype.

---



