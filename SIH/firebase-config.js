/**
 * SamadhanHub - Firebase Configuration
 * =====================================
 * SETUP INSTRUCTIONS (one-time, ~5 minutes):
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Click "Add project" → name it "SamadhanHub" → Continue → Create project
 * 3. On the project dashboard, click the "</>" (Web) icon to register a web app.
 *    - App nickname: "SamadhanHub Web" → Register app
 *    - Copy the firebaseConfig object shown and paste the values below.
 * 4. In the left sidebar, go to Build → Firestore Database
 *    - Click "Create database" → Start in TEST MODE → Choose a region → Enable
 * 5. Replace EVERY "REPLACE_ME_..." placeholder below with your actual values.
 * 6. Save this file, commit, and push to GitHub. The site will auto-redeploy.
 *
 * Your live site will then have a fully shared, real-time database! 🎉
 */

const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_ME_apiKey",
  authDomain:        "REPLACE_ME_projectId.firebaseapp.com",
  projectId:         "REPLACE_ME_projectId",
  storageBucket:     "REPLACE_ME_projectId.appspot.com",
  messagingSenderId: "REPLACE_ME_messagingSenderId",
  appId:             "REPLACE_ME_appId"
};
