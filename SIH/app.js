/**
 * SamadhanHub - Core Frontend Controller
 */

// Category Configurations
const CATEGORIES = [
  { id: 'all', name_en: 'All Topics', name_hi: 'सभी विषय', emoji: '🌟', color: 'var(--accent-blue)' },
  { id: 'road', name_en: 'Roads & Potholes', name_hi: 'सड़कें और गड्ढे', emoji: '🛣️', color: 'var(--accent-yellow)' },
  { id: 'electricity', name_en: 'Electricity', name_hi: 'बिजली', emoji: '⚡', color: 'var(--accent-purple)' },
  { id: 'education', name_en: 'Education', name_hi: 'शिक्षा / स्कूल', emoji: '🎓', color: 'var(--accent-blue)' },
  { id: 'social', name_en: 'Social Issues', name_hi: 'सामाजिक मुद्दे', emoji: '🚸', color: 'var(--accent-violet)' },
  { id: 'transport', name_en: 'Transport', name_hi: 'यातायात / बस', emoji: '🚌', color: 'var(--accent-blue)' },
  { id: 'marine', name_en: 'Water & Marine', name_hi: 'जल और समुद्री', emoji: '🚢', color: 'var(--accent-blue)' },
  { id: 'forest', name_en: 'Forests & Trees', name_hi: 'वन और पेड़', emoji: '🌳', color: 'var(--accent-green)' },
  { id: 'wildlife', name_en: 'Wildlife', name_hi: 'वन्यजीव सुरक्षा', emoji: '🦁', color: 'var(--accent-pink)' },
  { id: 'tribal', name_en: 'Tribal Welfare', name_hi: 'जनजातीय कल्याण', emoji: '🛖', color: 'var(--accent-yellow)' }
];

// Presets for fast reporting without uploading files
const PRESET_GRAPHICS = [
  { label_en: 'Broken Road', label_hi: 'टूटी सड़क', emoji: '🕳️', url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop' },
  { label_en: 'Power Outage', label_hi: 'बिजली संकट', emoji: '💡', url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop' },
  { label_en: 'Garbage Dump', label_hi: 'कचरा ढेर', emoji: '🚯', url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop' },
  { label_en: 'Dry Tap', label_hi: 'सूखा नल', emoji: '🚰', url: 'https://images.unsplash.com/photo-1527181152855-fc03fc7949c8?q=80&w=600&auto=format&fit=crop' }
];

// Translation Mapping System
const TRANSLATIONS = {
  en: {
    'app-logo-text': 'SamadhanHub',
    'btn-add-text': 'Report Problem',
    'txt-select-category': 'Category Filter',
    'txt-selected-count': 'Tap a category to filter nearby problems',
    'txt-map-title': 'Nearby Problems Map',
    'map-search-input': 'Search location...',
    'txt-ngo-dashboard-title': 'NGO & Officer Control Room',
    'lbl-total-reported': 'Reported',
    'lbl-high-priority': 'Critical',
    'lbl-total-solved': 'Solved',
    'txt-timeline-title': 'Problems Timeline',
    'txt-modal-title': 'Share a Local Problem',
    'lbl-form-caption': 'Describe the Problem (Write a Caption)',
    'form-caption-placeholder': "What's happening? E.g., Broken water pipeline leaking water...",
    'lbl-form-category': 'Category',
    'lbl-form-location': 'Location/Area Name',
    'form-location-placeholder': 'E.g., Sector 4 Main Road',
    'txt-coords-hint': 'Auto-picked: Click on the map to set exact spot 📍',
    'lbl-form-media': 'Upload Photo/Video or Choose a Preset Graphic',
    'txt-file-upload': '📷 Click here to upload a photo/video',
    'btn-submit-problem': 'Submit Report 📢',
    'priority-critical': 'Critical Priority 🔥',
    'priority-investigate': 'Active Investigation ⚠️',
    'priority-verified': 'Report Verified 👍',
    'priority-awaiting': 'Awaiting Verification ⏳',
    'txt-solved': 'Solved ✅',
    'btn-solve': 'Mark Solved',
    'btn-unsolve': 'Reopen Case',
    'suggestion-placeholder': 'Suggest a solution/prove genuine...',
    'toast-success': 'Problem reported successfully! 🎉',
    'toast-vote': 'Response recorded! 👍',
    'toast-solved': 'Status updated! ✅'
  },
  hi: {
    'app-logo-text': 'समाधानहब',
    'btn-add-text': 'समस्या दर्ज करें',
    'txt-select-category': 'श्रेणी फिल्टर',
    'txt-selected-count': 'आस-पास की समस्याओं को देखने के लिए श्रेणी दबाएं',
    'txt-map-title': 'आस-पास की समस्याओं का मानचित्र',
    'map-search-input': 'स्थान खोजें...',
    'txt-ngo-dashboard-title': 'एनजीओ और अधिकारी कंट्रोल रूम',
    'lbl-total-reported': 'कुल दर्ज',
    'lbl-high-priority': 'गंभीर',
    'lbl-total-solved': 'सुलझाई गई',
    'txt-timeline-title': 'समस्याओं की समयरेखा (टाइमलाइन)',
    'txt-modal-title': 'स्थानीय समस्या साझा करें',
    'lbl-form-caption': 'समस्या का विवरण (कैप्शन लिखें)',
    'form-caption-placeholder': 'क्या समस्या है? जैसे: पीने के पानी की पाइपलाइन टूट गई है...',
    'lbl-form-category': 'श्रेणी चुनें',
    'lbl-form-location': 'स्थान/क्षेत्र का नाम',
    'form-location-placeholder': 'जैसे: सेक्टर 4 मुख्य सड़क',
    'txt-coords-hint': 'नक्शे पर क्लिक करके सही स्थान चुनें 📍',
    'lbl-form-media': 'फोटो/वीडियो अपलोड करें या कोई चित्र चुनें',
    'txt-file-upload': '📷 फोटो/वीडियो अपलोड करने के लिए क्लिक करें',
    'btn-submit-problem': 'रिपोर्ट जमा करें 📢',
    'priority-critical': 'गंभीर प्राथमिकता 🔥',
    'priority-investigate': 'सक्रिय जांच ⚠️',
    'priority-verified': 'रिपोर्ट सत्यापित 👍',
    'priority-awaiting': 'सत्यापन लंबित ⏳',
    'txt-solved': 'सुलझ गया ✅',
    'btn-solve': 'सुलझा हुआ घोषित करें',
    'btn-unsolve': 'मामला पुनः खोलें',
    'suggestion-placeholder': 'समाधान सुझाएं या समस्या को सही साबित करें...',
    'toast-success': 'समस्या सफलतापूर्वक दर्ज हो गई! 🎉',
    'toast-vote': 'आपकी प्रतिक्रिया दर्ज की गई! 👍',
    'toast-solved': 'स्थिति अपडेट कर दी गई है! ✅'
  }
};

// Global App States
let currentLang = 'en';
let selectedCategory = 'all';
let map = null;
let markers = {};
let tempFormMarker = null;
let currentProblems = [];

// Initialize Page
window.addEventListener('DOMContentLoaded', async () => {
  setupLanguage();
  initMap();
  renderCategories();
  renderPresets();
  await loadProblems();
});

// Setup Localization UI
function setupLanguage() {
  document.body.className = `lang-${currentLang}`;
  
  const translations = TRANSLATIONS[currentLang];
  for (const id in translations) {
    const el = document.getElementById(id);
    if (el) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[id];
      } else {
        el.innerHTML = translations[id];
      }
    }
  }

  // Update dynamic captions/placeholders in form
  const captionTextarea = document.getElementById('form-caption');
  if (captionTextarea) {
    captionTextarea.placeholder = translations['form-caption-placeholder'];
  }
  const locInput = document.getElementById('form-location-name');
  if (locInput) {
    locInput.placeholder = translations['form-location-placeholder'];
  }
}

// Toggle translation English/Hindi
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  setupLanguage();
  renderCategories();
  renderPresets();
  renderFeed();
}

// Render horizontal categories scroll bar
function renderCategories() {
  const container = document.getElementById('category-list');
  if (!container) return;
  container.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const isActive = selectedCategory === cat.id;
    const card = document.createElement('div');
    card.className = `category-card ${isActive ? 'active' : ''}`;
    card.id = `cat-card-${cat.id}`;
    card.onclick = () => selectCategory(cat.id);

    const name = currentLang === 'en' ? cat.name_en : cat.name_hi;

    card.innerHTML = `
      <div class="category-icon-wrapper" style="background: rgba(255, 255, 255, 0.05); color: ${cat.color};">
        ${cat.emoji}
      </div>
      <div class="category-name">${name}</div>
    `;
    container.appendChild(card);
  });

  // Populate form category select element
  const formSelect = document.getElementById('form-category');
  if (formSelect) {
    formSelect.innerHTML = '';
    // Skip 'all' for reports
    CATEGORIES.filter(cat => cat.id !== 'all').forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = (currentLang === 'en' ? cat.name_en : cat.name_hi) + ` ${cat.emoji}`;
      formSelect.appendChild(option);
    });
  }
}

// Preset graphics selectors
function renderPresets() {
  const container = document.getElementById('preset-list');
  if (!container) return;
  container.innerHTML = '';

  PRESET_GRAPHICS.forEach((p, idx) => {
    const img = document.createElement('img');
    img.src = p.url;
    img.alt = p.label_en;
    img.className = 'preset-img';
    img.title = currentLang === 'en' ? p.label_en : p.label_hi;
    img.onclick = () => selectPreset(p.url, img);
    container.appendChild(img);
  });
}

function selectPreset(url, element) {
  document.querySelectorAll('.preset-img').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
  document.getElementById('form-preset-url').value = url;
  
  // Clear file upload preview highlight
  const fileBox = document.querySelector('.file-upload-box');
  fileBox.style.borderColor = 'rgba(255, 255, 255, 0.15)';
  const fileText = document.getElementById('txt-file-upload');
  fileText.textContent = currentLang === 'en' 
    ? `Selected Preset Option! 🎯` 
    : `चयनित चित्र विकल्प! 🎯`;
}

// Category filter selection
function selectCategory(categoryId) {
  selectedCategory = categoryId;
  renderCategories();
  renderFeed();
  renderMarkers();
}

// Initialize Leaflet Map
function initMap() {
  // Delhi center
  const defaultLat = 28.6139;
  const defaultLng = 77.2090;

  map = L.map('map', {
    zoomControl: true,
    minZoom: 2
  }).setView([defaultLat, defaultLng], 12);

  // Dark styled map tiles (works without API key)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // Pick coords on Map click
  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    setCoordinates(lat, lng);
    
    // Animate pin jump on map
    if (tempFormMarker) {
      tempFormMarker.setLatLng(e.latlng);
    } else {
      const pinIcon = L.divIcon({
        html: '<div class="map-marker-emoji">📍</div>',
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 30]
      });
      tempFormMarker = L.marker(e.latlng, { icon: pinIcon }).addTo(map);
    }
    
    // Popup bubble for child-friendliness
    tempFormMarker.bindPopup(`<b>Picked Point!</b><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`).openPopup();
    
    // If reporting modal isn't open, notify user they can report
    showToast(currentLang === 'en' ? "Location locked! Click 'Report Problem' to submit." : "स्थान लॉक हो गया! जमा करने के लिए 'समस्या दर्ज करें' पर क्लिक करें।", '📍');
  });

  // Try fetching current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      map.setView([lat, lng], 13);
      setCoordinates(lat, lng);
    }, () => {
      // Default set to India coordinates
      setCoordinates(defaultLat, defaultLng);
    });
  } else {
    setCoordinates(defaultLat, defaultLng);
  }
}

function setCoordinates(lat, lng) {
  document.getElementById('form-lat').value = lat;
  document.getElementById('form-lng').value = lng;
}

// Search location using OpenStreetMap Nominatim Free Geocoder API (with secure Google API server proxy fallback)
async function searchLocation() {
  const query = document.getElementById('map-search-input').value;
  if (!query) return;

  let latitude = null;
  let longitude = null;
  let name = query;
  let success = false;

  // 1. Try Google Geocoding Proxy via backend server (securely hiding API key)
  try {
    const response = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
    if (response.ok) {
      const data = await response.json();
      latitude = data.lat;
      longitude = data.lng;
      name = data.name;
      success = true;
      console.log("Geocoding success via Google Maps API wrapper.");
    }
  } catch (err) {
    console.warn("Google geocoding proxy failed, trying OpenStreetMap Nominatim fallback...", err);
  }

  // 2. Fallback to OpenStreetMap Nominatim API if Google Proxy fails or offline
  if (!success) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        latitude = parseFloat(lat);
        longitude = parseFloat(lon);
        success = true;
        console.log("Geocoding success via OpenStreetMap Nominatim fallback.");
      }
    } catch (err) {
      console.error("OSM Geocoding failed", err);
    }
  }

  if (success && latitude !== null && longitude !== null) {
    map.setView([latitude, longitude], 14);
    setCoordinates(latitude, longitude);

    if (tempFormMarker) {
      tempFormMarker.setLatLng([latitude, longitude]);
    } else {
      const pinIcon = L.divIcon({
        html: '<div class="map-marker-emoji">📍</div>',
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 30]
      });
      tempFormMarker = L.marker([latitude, longitude], { icon: pinIcon }).addTo(map);
    }
    tempFormMarker.bindPopup(`<b>${name}</b>`).openPopup();
  } else {
    showToast(currentLang === 'en' ? "Location not found!" : "स्थान नहीं मिला!", '🔍');
  }
}

// Fetch and load from database
async function loadProblems() {
  try {
    currentProblems = await window.Database.getProblems();
    renderFeed();
    renderMarkers();
    updateStats();
  } catch (e) {
    console.error("Failed loading problems", e);
  }
}

// Filter problems list based on selectedCategory
function getFilteredProblems() {
  if (selectedCategory === 'all') return currentProblems;
  return currentProblems.filter(p => p.category === selectedCategory);
}

// Render dynamic map pins
function renderMarkers() {
  // Clear old markers
  for (const id in markers) {
    map.removeLayer(markers[id]);
  }
  markers = {};

  const list = getFilteredProblems();
  list.forEach(p => {
    const categoryInfo = CATEGORIES.find(c => c.id === p.category) || { emoji: '❓' };
    const markerHtml = `<div class="map-marker-emoji" title="${p.caption}">${categoryInfo.emoji}</div>`;
    
    const icon = L.divIcon({
      html: markerHtml,
      className: 'custom-div-icon',
      iconSize: [45, 45],
      iconAnchor: [22, 22]
    });

    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
    
    // Popup summary
    const captionText = currentLang === 'en' ? p.caption : (p.caption_hi || p.caption);
    const popupContent = `
      <div style="color:#fff; font-family:var(--font-en); font-size:0.9rem; max-width:200px;">
        <h4 style="margin:0 0 5px; color:var(--accent-blue)">${categoryInfo.emoji} ${p.category.toUpperCase()}</h4>
        <p style="margin:0 0 8px; line-height:1.3;">${captionText.substring(0, 80)}...</p>
        <button onclick="scrollToCard('${p.id}')" style="background:var(--accent-blue); border:none; color:black; font-weight:700; padding:3px 8px; border-radius:4px; cursor:pointer; font-size:0.75rem;">View Timeline ➔</button>
      </div>
    `;
    m.bindPopup(popupContent);
    markers[p.id] = m;
  });
}

// Render Timeline Feed Cards
function renderFeed() {
  const container = document.getElementById('timeline-feed');
  const badge = document.getElementById('problems-count-badge');
  if (!container) return;
  container.innerHTML = '';

  const list = getFilteredProblems();
  badge.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
        <div style="font-size:3rem; margin-bottom:1rem;">🌾</div>
        <h3>${currentLang === 'en' ? 'No reported problems here!' : 'यहाँ कोई समस्या रिपोर्ट नहीं की गई है!'}</h3>
        <p style="margin-top:0.5rem">${currentLang === 'en' ? 'Be the first to report a problem in this category.' : 'इस श्रेणी में समस्या रिपोर्ट करने वाले पहले व्यक्ति बनें।'}</p>
      </div>
    `;
    return;
  }

  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    card.id = `card-${p.id}`;

    const score = calculatePriorityScore(p);
    const { tagClass, label } = getPriorityBadge(score, p.solved);
    const categoryInfo = CATEGORIES.find(c => c.id === p.category) || { emoji: '❓', name_en: 'Other', name_hi: 'अन्य' };
    const categoryName = currentLang === 'en' ? categoryInfo.name_en : categoryInfo.name_hi;

    const captionText = currentLang === 'en' ? p.caption : (p.caption_hi || p.caption);
    const locationText = currentLang === 'en' ? p.locationName : (p.locationName_hi || p.locationName);
    
    // Formatting date
    const dateObj = new Date(p.timestamp);
    const formattedDate = dateObj.toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Likes/dislikes indicators toggle states
    const likeVotedClass = p.likedByUser ? 'voted' : '';
    const dislikeVotedClass = p.dislikedByUser ? 'voted' : '';

    // Render suggestions
    let suggestionsHtml = '';
    if (p.suggestions && p.suggestions.length > 0) {
      suggestionsHtml = `
        <div class="suggestion-box">
          <div class="suggestion-list">
            ${p.suggestions.map(s => {
              const text = currentLang === 'en' ? s.text : (s.text_hi || s.text);
              return `
                <div class="suggestion-item">
                  <div class="suggestion-avatar">💡</div>
                  <div class="suggestion-text">${text}</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="timeline-marker">
        <div class="timeline-dot"></div>
      </div>
      <div class="card-content">
        <div class="card-header">
          <div class="card-meta">
            <span class="card-category-tag">
              <span>${categoryInfo.emoji}</span>
              <span>${categoryName}</span>
            </span>
            <span class="card-time">${formattedDate}</span>
          </div>
          <span class="priority-tag ${tagClass}">${label}</span>
        </div>
        
        <div class="card-caption">${captionText}</div>
        
        <div style="font-size:0.8rem; color:var(--accent-blue); display:flex; align-items:center; gap:0.25rem;">
          <span>📍</span>
          <span>${locationText}</span>
        </div>

        ${p.mediaUrl ? `
          <div class="card-media">
            ${p.mediaType === 'video' 
              ? `<video src="${p.mediaUrl}" controls></video>` 
              : `<img src="${p.mediaUrl}" alt="problem media">`
            }
          </div>
        ` : ''}

        <!-- Actions -->
        <div class="card-actions">
          <div class="voting-buttons">
            <button class="vote-btn vote-btn-like ${likeVotedClass}" onclick="voteProblem('${p.id}', 'like')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              <span>${p.likes}</span>
            </button>
            <button class="vote-btn vote-btn-dislike ${dislikeVotedClass}" onclick="voteProblem('${p.id}', 'dislike')">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 10c1.49 1.46 3 3.21 3 5.5A5.5 5.5 0 0 1 16.5 21c-1.76 0-3-.5-4.5-2-1.5 1.5-2.74 2-4.5 2A5.5 5.5 0 0 1 2 15.5c0-2.3 1.5-4.05 3-5.5l7-7Z"/></svg>
              <span>${p.dislikes}</span>
            </button>
          </div>
          
          <!-- Officer/NGO Solver controls -->
          <div class="solve-controls">
            ${p.solved 
              ? `<div class="solved-placeholder">🎉 ${TRANSLATIONS[currentLang]['txt-solved']}</div>`
              : `<button class="solve-toggle-btn" onclick="toggleProblemSolved('${p.id}')">✔️ ${TRANSLATIONS[currentLang]['btn-solve']}</button>`
            }
          </div>
        </div>

        <!-- Suggestions display -->
        ${suggestionsHtml}

        <!-- Add suggestion response box -->
        <div class="suggestion-input-wrapper">
          <input type="text" id="input-sug-${p.id}" placeholder="${TRANSLATIONS[currentLang]['suggestion-placeholder']}">
          <button class="suggestion-submit-btn" onclick="submitSuggestion('${p.id}')">➔</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Priority score computation logic: (Likes * 1.5) - Dislikes
function calculatePriorityScore(p) {
  return Math.round(((p.likes || 0) * 1.5) - (p.dislikes || 0));
}

// Generate toddler-friendly custom priority tag classes/label
function getPriorityBadge(score, isSolved) {
  if (isSolved) {
    return {
      tagClass: 'priority-verified',
      label: currentLang === 'en' ? 'Solved ✅' : 'हल हो गया ✅'
    };
  }

  if (score >= 15) {
    return {
      tagClass: 'priority-critical',
      label: TRANSLATIONS[currentLang]['priority-critical']
    };
  } else if (score >= 5) {
    return {
      tagClass: 'priority-investigate',
      label: TRANSLATIONS[currentLang]['priority-investigate']
    };
  } else if (score >= 1) {
    return {
      tagClass: 'priority-verified',
      label: TRANSLATIONS[currentLang]['priority-verified']
    };
  } else {
    return {
      tagClass: 'priority-awaiting',
      label: TRANSLATIONS[currentLang]['priority-awaiting']
    };
  }
}

// NGO Control Room Dashboard calculations
function updateStats() {
  const reported = currentProblems.length;
  const solved = currentProblems.filter(p => p.solved).length;
  const critical = currentProblems.filter(p => calculatePriorityScore(p) >= 15 && !p.solved).length;

  document.getElementById('stat-total-reported').textContent = reported;
  document.getElementById('stat-high-priority').textContent = critical;
  document.getElementById('stat-total-solved').textContent = solved;
}

// Vote handling (Like / Dislike toggle undo)
async function voteProblem(id, type) {
  const problem = currentProblems.find(p => p.id === id);
  if (!problem) return;

  if (type === 'like') {
    if (problem.likedByUser) {
      // Toggle off Like
      problem.likedByUser = false;
      problem.likes = Math.max(0, (problem.likes || 0) - 1);
    } else {
      // Toggle on Like
      problem.likedByUser = true;
      problem.likes = (problem.likes || 0) + 1;
      // Undo Dislike if active
      if (problem.dislikedByUser) {
        problem.dislikedByUser = false;
        problem.dislikes = Math.max(0, (problem.dislikes || 0) - 1);
      }
    }
  } else if (type === 'dislike') {
    if (problem.dislikedByUser) {
      // Toggle off Dislike
      problem.dislikedByUser = false;
      problem.dislikes = Math.max(0, (problem.dislikes || 0) - 1);
    } else {
      // Toggle on Dislike
      problem.dislikedByUser = true;
      problem.dislikes = (problem.dislikes || 0) + 1;
      // Undo Like if active
      if (problem.likedByUser) {
        problem.likedByUser = false;
        problem.likes = Math.max(0, (problem.likes || 0) - 1);
      }
    }
  }

  // Submit absolute counts to database
  const updated = await window.Database.vote(id, problem.likes, problem.dislikes);
  if (updated) {
    problem.likes = updated.likes;
    problem.dislikes = updated.dislikes;
  }

  showToast(TRANSLATIONS[currentLang]['toast-vote'], '❤️');
  renderFeed();
  updateStats();
  renderMarkers();
}

// Submit user solution suggestions
async function submitSuggestion(id) {
  const inputEl = document.getElementById(`input-sug-${id}`);
  const val = inputEl.value.trim();
  if (!val) return;

  const updated = await window.Database.addSuggestion(id, val);
  if (updated) {
    const localProb = currentProblems.find(p => p.id === id);
    if (localProb) localProb.suggestions = updated.suggestions;
  }
  
  inputEl.value = '';
  showToast(currentLang === 'en' ? "Suggestion posted!" : "सुझाव दर्ज किया गया!", '💡');
  renderFeed();
}

// Mark Solved toggle
async function toggleProblemSolved(id) {
  const updated = await window.Database.toggleSolved(id);
  if (updated) {
    const localProb = currentProblems.find(p => p.id === id);
    if (localProb) localProb.solved = updated.solved;
  }
  showToast(TRANSLATIONS[currentLang]['toast-solved'], '✅');
  renderFeed();
  updateStats();
}

// Scroll to feed card from map pin
window.scrollToCard = function(id) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'var(--accent-blue)';
    card.style.boxShadow = 'var(--shadow-glow)';
    setTimeout(() => {
      card.style.borderColor = 'var(--border-color)';
      card.style.boxShadow = 'none';
    }, 2000);
  }
};

// Modal Operations
function openReportModal() {
  const modal = document.getElementById('report-modal');
  modal.classList.add('active');
}

function closeReportModal() {
  const modal = document.getElementById('report-modal');
  modal.classList.remove('active');
  // Clear forms
  document.getElementById('problem-form').reset();
  document.getElementById('form-preset-url').value = '';
  document.getElementById('txt-file-upload').textContent = TRANSLATIONS[currentLang]['txt-file-upload'];
  document.querySelectorAll('.preset-img').forEach(el => el.classList.remove('selected'));
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'report-modal') {
    closeReportModal();
  }
}

// Upload Media Helpers (Base64 file loader)
function triggerFileInput() {
  document.getElementById('form-file-input').click();
}

let loadedMediaData = null;
let loadedMediaType = 'image';

function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const fileBox = document.querySelector('.file-upload-box');
  const fileText = document.getElementById('txt-file-upload');
  
  // Clear selected preset
  document.querySelectorAll('.preset-img').forEach(el => el.classList.remove('selected'));
  document.getElementById('form-preset-url').value = '';

  loadedMediaType = file.type.startsWith('video/') ? 'video' : 'image';

  const reader = new FileReader();
  reader.onload = function(evt) {
    loadedMediaData = evt.target.result;
    fileBox.style.borderColor = 'var(--accent-green)';
    fileText.innerHTML = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) <span style="color:var(--accent-green)">Loaded!</span>`;
  };
  reader.readAsDataURL(file);
}

// Form Submit Handler
async function handleProblemSubmit(e) {
  e.preventDefault();
  
  const caption = document.getElementById('form-caption').value;
  const category = document.getElementById('form-category').value;
  const locationName = document.getElementById('form-location-name').value;
  const latVal = parseFloat(document.getElementById('form-lat').value);
  const lngVal = parseFloat(document.getElementById('form-lng').value);
  const presetUrl = document.getElementById('form-preset-url').value;

  // Determine media URL
  let mediaUrl = '';
  let mediaType = 'image';

  if (loadedMediaData) {
    mediaUrl = loadedMediaData;
    mediaType = loadedMediaType;
  } else if (presetUrl) {
    mediaUrl = presetUrl;
    mediaType = 'image';
  }

  const problemReport = {
    caption,
    caption_hi: currentLang === 'hi' ? caption : caption, // fallback
    category,
    locationName,
    locationName_hi: currentLang === 'hi' ? locationName : locationName,
    lat: isNaN(latVal) ? 28.6139 : latVal,
    lng: isNaN(lngVal) ? 77.2090 : lngVal,
    mediaUrl,
    mediaType
  };

  const saved = await window.Database.addProblem(problemReport);
  if (saved) {
    currentProblems.unshift(saved);
  }

  // Visual success notifications
  showToast(TRANSLATIONS[currentLang]['toast-success'], '📢');
  closeReportModal();
  
  // Refresh feed & map views
  renderFeed();
  renderMarkers();
  updateStats();
  
  // Fly map to the new post
  map.flyTo([problemReport.lat, problemReport.lng], 14);

  // Reset variables
  loadedMediaData = null;
}

// Notification system
function showToast(message, emoji = '🎉') {
  const toast = document.getElementById('toast-message');
  const toastText = document.getElementById('toast-text');
  const toastEmoji = toast.querySelector('.toast-emoji');

  if (toast && toastText) {
    toastText.textContent = message;
    if (toastEmoji) toastEmoji.textContent = emoji;
    
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }
}

// Toggle Map maximize/minimize state
function toggleMapMaximize() {
  const wrapper = document.querySelector('.map-wrapper');
  const btn = document.getElementById('btn-map-toggle');
  const isMaximized = wrapper.classList.toggle('maximized');
  
  if (isMaximized) {
    btn.innerHTML = '🗗';
    btn.title = currentLang === 'en' ? 'Minimize Map' : 'नक्शा छोटा करें';
  } else {
    btn.innerHTML = '⛶';
    btn.title = currentLang === 'en' ? 'Maximize Map' : 'नक्शा बड़ा करें';
  }
  
  // Force Leaflet bounds refresh immediately and after transitions
  map.invalidateSize();
  setTimeout(() => {
    map.invalidateSize();
  }, 350);
}
