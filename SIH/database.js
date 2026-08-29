/**
 * SamadhanHub Database Service Client
 * Supports seamless LocalStorage fallback + Cloud API server connection.
 */

const API_BASE_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
  ? 'http://localhost:3000/api'
  : '/api'; // fallback to relative path for cloud deployment

let isOnline = false;

// Sample Initial Problems to wow the user out-of-the-box
const INITIAL_SAMPLE_PROBLEMS = [
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
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
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
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString() // 4 hours ago
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
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
  }
];

// Helper to seed localStorage if empty
function seedLocalStorage() {
  if (!localStorage.getItem('samadhan_problems')) {
    localStorage.setItem('samadhan_problems', JSON.stringify(INITIAL_SAMPLE_PROBLEMS));
  }
}

// Check if Server API is accessible
async function checkOnlineStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/problems`, { method: 'HEAD' });
    isOnline = response.ok;
  } catch (e) {
    isOnline = false;
  }
  console.log(`SamadhanHub Database Mode: ${isOnline ? 'ONLINE (Remote Cloud DB)' : 'OFFLINE (LocalStorage Backup)'}`);
  return isOnline;
}

// Initialize
seedLocalStorage();
checkOnlineStatus();

const Database = {
  // Fetch all problems
  async getProblems() {
    await checkOnlineStatus();
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems`);
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn("Failed fetching from server, falling back to LocalStorage", err);
      }
    }
    // LocalStorage fallback
    return JSON.parse(localStorage.getItem('samadhan_problems')) || [];
  },

  // Save a new problem report
  async addProblem(problemData) {
    const newProblem = {
      id: 'prob-' + Math.random().toString(36).substr(2, 9),
      likes: 0,
      dislikes: 0,
      suggestions: [],
      solved: false,
      timestamp: new Date().toISOString(),
      ...problemData
    };

    await checkOnlineStatus();
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProblem)
        });
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn("Failed saving to cloud database. Saving locally.", err);
      }
    }

    // Save locally
    const problems = JSON.parse(localStorage.getItem('samadhan_problems')) || [];
    problems.unshift(newProblem);
    localStorage.setItem('samadhan_problems', JSON.stringify(problems));
    return newProblem;
  },

  // Vote Like or Dislike on a problem (submits final absolute counts)
  async vote(problemId, likes, dislikes) {
    await checkOnlineStatus();
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems/${problemId}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ likes, dislikes })
        });
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn("Server vote failed, voting locally", err);
      }
    }

    // LocalStorage action
    const problems = JSON.parse(localStorage.getItem('samadhan_problems')) || [];
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      problem.likes = likes;
      problem.dislikes = dislikes;
      localStorage.setItem('samadhan_problems', JSON.stringify(problems));
      return problem;
    }
    return null;
  },

  // Add suggestion response to a problem
  async addSuggestion(problemId, suggestionText, isHindi = false) {
    const newSuggestion = isHindi 
      ? { text: suggestionText, text_hi: suggestionText }
      : { text: suggestionText, text_hi: suggestionText }; // simplified translation mapping

    await checkOnlineStatus();
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems/${problemId}/suggestion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ suggestion: newSuggestion })
        });
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn("Server suggestion failed, adding locally", err);
      }
    }

    // LocalStorage action
    const problems = JSON.parse(localStorage.getItem('samadhan_problems')) || [];
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      if (!problem.suggestions) problem.suggestions = [];
      problem.suggestions.push(newSuggestion);
      localStorage.setItem('samadhan_problems', JSON.stringify(problems));
      return problem;
    }
    return null;
  },

  // Toggle problem solved status (NGO / Officers control)
  async toggleSolved(problemId) {
    await checkOnlineStatus();
    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/problems/${problemId}/solve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) return await response.json();
      } catch (err) {
        console.warn("Server toggle solve failed, setting locally", err);
      }
    }

    // LocalStorage action
    const problems = JSON.parse(localStorage.getItem('samadhan_problems')) || [];
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      problem.solved = !problem.solved;
      localStorage.setItem('samadhan_problems', JSON.stringify(problems));
      return problem;
    }
    return null;
  }
};
window.Database = Database; // expose globally for app.js
