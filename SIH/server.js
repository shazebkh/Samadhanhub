const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const adminRouter = require('./admin-routes');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'problems.json');

app.use(cors());
app.use(express.json({ limit: '10mb' })); // support large image data URLs

// -------------------------------------------------------------------
// Explicit routes — declared BEFORE express.static so they take priority
// -------------------------------------------------------------------

// Admin API — protected routes
app.use('/api/admin', adminRouter);

// Unified entry point: role selector (local user vs admin)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Main SamadhanHub community app
app.get(['/app', '/app.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'app.html'));
});

// Admin dashboard page
app.get(['/admin', '/admin.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve all other static assets (CSS, JS, images, etc.)
app.use(express.static(__dirname, { index: false }));

// Seed problems if DB file doesn't exist
const INITIAL_SEED = [
  {
    id: "prob-001",
    caption: "Large pothole in the middle of the road causing traffic blockages and minor falls for scooterists.",
    caption_hi: "सड़क के बीच में बड़ा गड्ढा होने से ट्रैफिक जाम हो रहा है और दुपहिया चालक गिर रहे हैं।",
    category: "road",
    locationName: "Rajiv Nagar Cross Road",
    locationName_hi: "राजीव नगर चौराहा",
    lat: 28.6139,
    lng: 77.2090,
    mediaUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop",
    mediaType: "image",
    likes: 24,
    dislikes: 2,
    suggestions: [
      { text: "We need immediate barricading here before accidents happen.", text_hi: "दुर्घटना से बचने के लिए यहां तुरंत बैरिकेड लगाने की जरूरत है।" },
      { text: "Reported to ward office but no action yet. Verified genuine.", text_hi: "वार्ड कार्यालय को रिपोर्ट किया गया लेकिन अभी तक कोई कार्रवाई नहीं हुई। सत्यापित है।" }
    ],
    solved: false,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: "prob-002",
    caption: "Open high-voltage fuse box near primary school playground. Extremely dangerous for toddlers.",
    caption_hi: "प्राइमरी स्कूल के खेल के मैदान के पास बिजली का खुला हाई-वोल्टेज फ्यूज बॉक्स। बच्चों के लिए बेहद खतरनाक।",
    category: "electricity",
    locationName: "Vidyasagar Public School, G-Block",
    locationName_hi: "विद्यासागर पब्लिक स्कूल, जी-ब्लॉक",
    lat: 28.6180,
    lng: 77.2200,
    mediaUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop",
    mediaType: "image",
    likes: 45,
    dislikes: 1,
    suggestions: [
      { text: "This is a disaster waiting to happen! Please lock it up.", text_hi: "यह एक बड़ा हादसा हो सकता है! कृपया इसे बंद करें।" }
    ],
    solved: false,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "prob-003",
    caption: "Plastic waste accumulating near the forest sanctuary boundary, posing danger to wild deer.",
    caption_hi: "वन अभयारण्य की सीमा के पास प्लास्टिक कचरा जमा हो रहा है, जिससे जंगली हिरणों को खतरा है।",
    category: "wildlife",
    locationName: "Aravali Forest Border Path",
    locationName_hi: "अरावली वन सीमा मार्ग",
    lat: 28.6050,
    lng: 77.2150,
    mediaUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop",
    mediaType: "image",
    likes: 12,
    dislikes: 0,
    suggestions: [
      { text: "Organizing an NGO clean-up drive this Sunday. Join us!", text_hi: "इस रविवार को एक एनजीओ सफाई अभियान आयोजित कर रहा है। हमसे जुड़ें!" }
    ],
    solved: true,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2));
      return INITIAL_SEED;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading DB file:", error);
    return [];
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing to DB file:", error);
  }
}

// API Routes

const GOOGLE_API_KEY = "AIzaSyDQHmQdfxzw6bPRvUScyf_cgBeW6jWvK_g";

// Geocode Proxy Endpoint using the secured Google key
app.get('/api/geocode', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter 'q'" });
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${GOOGLE_API_KEY}`;
    console.log(`[Proxy Geocode] Querying: "${q}" using Google API...`);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(`[Proxy Geocode] Google API response status: "${data.status}"`);
    if (data.status !== 'OK') {
      console.warn(`[Proxy Geocode] Warning/Error from Google API:`, data.error_message || 'None');
    }

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const lat = result.geometry.location.lat;
      const lng = result.geometry.location.lng;
      console.log(`[Proxy Geocode] Location resolved: "${result.formatted_address}" -> [${lat}, ${lng}]`);
      res.json({ lat, lng, name: result.formatted_address });
    } else {
      res.status(404).json({ error: `Location not found via Google API. Status: ${data.status}` });
    }
  } catch (error) {
    console.error("Google Geocoding API proxy error:", error);
    res.status(500).json({ error: "Internal server error during geocoding" });
  }
});

// 1. Get all problems
app.get('/api/problems', (req, res) => {
  const problems = readDB();
  res.json(problems);
});

// 2. Post a new problem
app.post('/api/problems', (req, res) => {
  const problems = readDB();
  const newProblem = req.body;
  problems.unshift(newProblem);
  writeDB(problems);
  res.status(201).json(newProblem);
});

// 3. Vote on a problem (absolute values count override)
app.post('/api/problems/:id/vote', (req, res) => {
  const { id } = req.params;
  const { likes, dislikes } = req.body;
  const problems = readDB();
  const problemIndex = problems.findIndex(p => p.id === id);

  if (problemIndex !== -1) {
    if (likes !== undefined) problems[problemIndex].likes = likes;
    if (dislikes !== undefined) problems[problemIndex].dislikes = dislikes;
    writeDB(problems);
    return res.json(problems[problemIndex]);
  }
  res.status(404).json({ error: "Problem report not found" });
});

// 4. Add suggestion
app.post('/api/problems/:id/suggestion', (req, res) => {
  const { id } = req.params;
  const { suggestion } = req.body;
  const problems = readDB();
  const problemIndex = problems.findIndex(p => p.id === id);

  if (problemIndex !== -1) {
    if (!problems[problemIndex].suggestions) {
      problems[problemIndex].suggestions = [];
    }
    problems[problemIndex].suggestions.push(suggestion);
    writeDB(problems);
    return res.json(problems[problemIndex]);
  }
  res.status(404).json({ error: "Problem report not found" });
});

// 5. Toggle solved status
app.post('/api/problems/:id/solve', (req, res) => {
  const { id } = req.params;
  const problems = readDB();
  const problemIndex = problems.findIndex(p => p.id === id);

  if (problemIndex !== -1) {
    problems[problemIndex].solved = !problems[problemIndex].solved;
    writeDB(problems);
    return res.json(problems[problemIndex]);
  }
  res.status(404).json({ error: "Problem report not found" });
});

// Serve frontend client (fallback for assets)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 SamadhanHub Server Running on http://localhost:${PORT}`);
  console.log(`📂 DB File Path: ${DB_FILE}`);
  console.log(`==================================================`);
});
