/**
 * SamadhanHub Database Service
 * =============================
 * Cloud mode  → Firebase Firestore (shared, real-time across all users)
 * Offline mode → localStorage fallback (when Firebase not yet configured)
 *
 * The Database API is identical in both modes, so app.js needs zero changes.
 */

// ---------------------------------------------------------------------------
// Sample seed data — written to Firestore on very first run (empty collection)
// ---------------------------------------------------------------------------
const INITIAL_SAMPLE_PROBLEMS = [
  {
    id: 'prob-001',
    caption: 'Large pothole in the middle of the road causing traffic blockages and minor falls for scooterists.',
    caption_hi: 'सड़क के बीच में बड़ा गड्ढा होने से ट्रैफिक जाम हो रहा है और दुपहिया चालक गिर रहे हैं।',
    category: 'road',
    locationName: 'Rajiv Nagar Cross Road',
    locationName_hi: 'राजीव नगर चौराहा',
    lat: 28.6139, lng: 77.2090,
    mediaUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop',
    mediaType: 'image',
    likes: 24, dislikes: 2,
    suggestions: [
      { text: 'We need immediate barricading here before accidents happen.', text_hi: 'दुर्घटना से बचने के लिए यहां तुरंत बैरिकेड लगाने की जरूरत है।' },
      { text: 'Reported to ward office but no action yet. Verified genuine.', text_hi: 'वार्ड कार्यालय को रिपोर्ट किया गया लेकिन अभी तक कोई कार्रवाई नहीं हुई। सत्यापित है।' }
    ],
    solved: false,
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'prob-002',
    caption: 'Open high-voltage fuse box near primary school playground. Extremely dangerous for toddlers.',
    caption_hi: 'प्राइमरी स्कूल के खेल के मैदान के पास बिजली का खुला हाई-वोल्टेज फ्यूज बॉक्स। बच्चों के लिए बेहद खतरनाक।',
    category: 'electricity',
    locationName: 'Vidyasagar Public School, G-Block',
    locationName_hi: 'विद्यासागर पब्लिक स्कूल, जी-ब्लॉक',
    lat: 28.6180, lng: 77.2200,
    mediaUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=600&auto=format&fit=crop',
    mediaType: 'image',
    likes: 45, dislikes: 1,
    suggestions: [
      { text: 'This is a disaster waiting to happen! Please lock it up.', text_hi: 'यह एक बड़ा हादसा हो सकता है! कृपया इसे बंद करें।' }
    ],
    solved: false,
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'prob-003',
    caption: 'Plastic waste accumulating near the forest sanctuary boundary, posing danger to wild deer.',
    caption_hi: 'वन अभयारण्य की सीमा के पास प्लास्टिक कचरा जमा हो रहा है, जिससे जंगली हिरणों को खतरा है।',
    category: 'wildlife',
    locationName: 'Aravali Forest Border Path',
    locationName_hi: 'अरावली वन सीमा मार्ग',
    lat: 28.6050, lng: 77.2150,
    mediaUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=600&auto=format&fit=crop',
    mediaType: 'image',
    likes: 12, dislikes: 0,
    suggestions: [
      { text: 'Organizing an NGO clean-up drive this Sunday. Join us!', text_hi: 'इस रविवार को एक एनजीओ सफाई अभियान आयोजित कर रहा है। हमसे जुड़ें!' }
    ],
    solved: true,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

// ---------------------------------------------------------------------------
// Firebase initialisation
// ---------------------------------------------------------------------------
let db = null;          // Firestore instance
let firebaseReady = false;

function initFirebase() {
  try {
    // Guard: is the config present and filled in by the user?
    if (
      typeof FIREBASE_CONFIG === 'undefined' ||
      !FIREBASE_CONFIG.projectId ||
      FIREBASE_CONFIG.projectId.startsWith('REPLACE_ME')
    ) {
      console.warn(
        '%cSamadhanHub ⚠️  Firebase not configured yet.\n' +
        'Open SIH/firebase-config.js and follow the instructions inside to enable the shared cloud database.\n' +
        'Running in LOCAL-STORAGE mode (data is only visible on THIS device).',
        'color: #fbbf24; font-weight: bold;'
      );
      seedLocalStorage();
      return false;
    }

    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    firebaseReady = true;
    console.log('%cSamadhanHub ✅  Firebase Firestore connected — SHARED DATABASE ACTIVE', 'color: #14b8a6; font-weight: bold;');
    return true;
  } catch (e) {
    console.warn('Firebase init failed, falling back to localStorage:', e);
    seedLocalStorage();
    return false;
  }
}

// ---------------------------------------------------------------------------
// localStorage helpers (offline fallback)
// ---------------------------------------------------------------------------
function seedLocalStorage() {
  if (!localStorage.getItem('samadhan_problems')) {
    localStorage.setItem('samadhan_problems', JSON.stringify(INITIAL_SAMPLE_PROBLEMS));
  }
}

function lsGetProblems() {
  return JSON.parse(localStorage.getItem('samadhan_problems')) || [];
}

function lsSaveProblems(problems) {
  localStorage.setItem('samadhan_problems', JSON.stringify(problems));
}

// ---------------------------------------------------------------------------
// Firestore helpers
// ---------------------------------------------------------------------------
const COLLECTION = 'problems';

/** Convert a Firestore DocumentSnapshot to a plain JS object */
function docToObj(doc) {
  return { id: doc.id, ...doc.data() };
}

/**
 * Seed the Firestore collection with sample data on first ever run.
 * Only runs if the collection has zero documents.
 */
async function seedFirestoreIfEmpty() {
  const snap = await db.collection(COLLECTION).limit(1).get();
  if (snap.empty) {
    console.log('SamadhanHub: Seeding Firestore with sample problems...');
    const batch = db.batch();
    INITIAL_SAMPLE_PROBLEMS.forEach(p => {
      const ref = db.collection(COLLECTION).doc(p.id);
      batch.set(ref, p);
    });
    await batch.commit();
    console.log('SamadhanHub: Seed complete.');
  }
}

// ---------------------------------------------------------------------------
// Public Database API  (identical shape in both Firebase & localStorage modes)
// ---------------------------------------------------------------------------
const Database = {

  /** Fetch all problems, sorted newest first */
  async getProblems() {
    if (firebaseReady) {
      try {
        await seedFirestoreIfEmpty();
        const snap = await db.collection(COLLECTION).orderBy('timestamp', 'desc').get();
        return snap.docs.map(docToObj);
      } catch (err) {
        console.warn('Firestore getProblems failed, falling back to localStorage:', err);
      }
    }
    return lsGetProblems();
  },

  /** Save a new problem report */
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

    if (firebaseReady) {
      try {
        await db.collection(COLLECTION).doc(newProblem.id).set(newProblem);
        return newProblem;
      } catch (err) {
        console.warn('Firestore addProblem failed, saving to localStorage:', err);
      }
    }

    // localStorage fallback
    const problems = lsGetProblems();
    problems.unshift(newProblem);
    lsSaveProblems(problems);
    return newProblem;
  },

  /** Update vote counts on a problem */
  async vote(problemId, likes, dislikes) {
    if (firebaseReady) {
      try {
        const ref = db.collection(COLLECTION).doc(problemId);
        await ref.update({ likes, dislikes });
        const snap = await ref.get();
        return docToObj(snap);
      } catch (err) {
        console.warn('Firestore vote failed, voting locally:', err);
      }
    }

    // localStorage fallback
    const problems = lsGetProblems();
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      problem.likes = likes;
      problem.dislikes = dislikes;
      lsSaveProblems(problems);
      return problem;
    }
    return null;
  },

  /** Append a suggestion to a problem */
  async addSuggestion(problemId, suggestionText, isHindi = false) {
    const newSuggestion = {
      text: suggestionText,
      text_hi: suggestionText
    };

    if (firebaseReady) {
      try {
        const ref = db.collection(COLLECTION).doc(problemId);
        await ref.update({
          suggestions: firebase.firestore.FieldValue.arrayUnion(newSuggestion)
        });
        const snap = await ref.get();
        return docToObj(snap);
      } catch (err) {
        console.warn('Firestore addSuggestion failed, adding locally:', err);
      }
    }

    // localStorage fallback
    const problems = lsGetProblems();
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      if (!problem.suggestions) problem.suggestions = [];
      problem.suggestions.push(newSuggestion);
      lsSaveProblems(problems);
      return problem;
    }
    return null;
  },

  /** Toggle solved / unsolved status */
  async toggleSolved(problemId) {
    if (firebaseReady) {
      try {
        const ref = db.collection(COLLECTION).doc(problemId);
        const snap = await ref.get();
        if (snap.exists) {
          const current = snap.data().solved || false;
          await ref.update({ solved: !current });
          const updated = await ref.get();
          return docToObj(updated);
        }
      } catch (err) {
        console.warn('Firestore toggleSolved failed, toggling locally:', err);
      }
    }

    // localStorage fallback
    const problems = lsGetProblems();
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      problem.solved = !problem.solved;
      lsSaveProblems(problems);
      return problem;
    }
    return null;
  },

  /** Hard-delete a problem report (Admin operation) */
  async deleteProblem(problemId) {
    if (firebaseReady) {
      try {
        await db.collection(COLLECTION).doc(problemId).delete();
        return true;
      } catch (err) {
        console.warn('Firestore deleteProblem failed, deleting locally:', err);
      }
    }

    // localStorage fallback
    const problems = lsGetProblems();
    const filtered = problems.filter(p => p.id !== problemId);
    lsSaveProblems(filtered);
    return true;
  }
};

// Expose globally so app.js can call window.Database.*
window.Database = Database;

// Kick off Firebase — must happen before app.js DOMContentLoaded fires
initFirebase();
