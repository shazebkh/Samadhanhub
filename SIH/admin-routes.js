/**
 * SamadhanHub — Admin API Routes
 * ================================
 * Mounted at /api/admin by server.js
 *
 * Endpoints:
 *   POST   /api/admin/login             → authenticate admin, return session token
 *   GET    /api/admin/problems          → list all problems (admin view, auth required)
 *   DELETE /api/admin/problems/:id      → hard-delete a problem (auth required)
 *   POST   /api/admin/problems/:id/solve → toggle solved status (auth required)
 *   GET    /api/admin/verify            → verify token is still valid
 *
 * Auth: Bearer token stored in-memory with 4-hour TTL.
 * NOTE: This is a demo implementation. In production, use signed JWTs + bcrypt.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const router = express.Router();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const ADMIN_USERNAME = 'admin.samadhan';
const ADMIN_PASSWORD = '1234';
const TOKEN_TTL_MS   = 4 * 60 * 60 * 1000; // 4 hours

const DB_FILE = path.join(__dirname, 'problems.json');

// In-memory token store: token → { username, expiresAt }
const activeTokens = new Map();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read the JSON database */
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('[Admin] Error reading DB:', err);
    return [];
  }
}

/** Write back to the JSON database */
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Admin] Error writing DB:', err);
  }
}

/** Generate a cryptographically random session token */
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

/** Clean up expired tokens */
function pruneTokens() {
  const now = Date.now();
  for (const [token, meta] of activeTokens.entries()) {
    if (now > meta.expiresAt) activeTokens.delete(token);
  }
}

// ---------------------------------------------------------------------------
// Middleware — require valid admin token
// ---------------------------------------------------------------------------
function requireAdminAuth(req, res, next) {
  pruneTokens();
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized — valid admin token required.' });
  }
  req.adminUser = activeTokens.get(token).username;
  next();
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/**
 * POST /api/admin/login
 * Body: { username, password }
 * Response: { token, expiresAt }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    console.warn(`[Admin] Failed login attempt for username: "${username}"`);
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const token     = generateToken();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  activeTokens.set(token, { username, expiresAt });

  console.log(`[Admin] ✅ Admin login successful. Token issued (expires in 4h).`);
  res.json({ token, expiresAt, username });
});

/**
 * GET /api/admin/verify
 * Verifies the bearer token is still valid.
 * Response: { valid: true, username }
 */
router.get('/verify', requireAdminAuth, (req, res) => {
  res.json({ valid: true, username: req.adminUser });
});

/**
 * GET /api/admin/problems
 * Returns all problems with extra admin metadata (count, newest first).
 * Response: { problems: [...], meta: { total, solved, critical, pending } }
 */
router.get('/problems', requireAdminAuth, (req, res) => {
  const problems = readDB();

  // Sort newest first
  const sorted = [...problems].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const total    = sorted.length;
  const solved   = sorted.filter(p => p.solved).length;
  const critical = sorted.filter(p => (p.likes || 0) >= 30).length;
  const pending  = total - solved;

  res.json({
    problems: sorted,
    meta: { total, solved, critical, pending, lastUpdated: new Date().toISOString() }
  });
});

/**
 * DELETE /api/admin/problems/:id
 * Hard-deletes a problem from the JSON database.
 * Response: { success: true, deletedId }
 */
router.delete('/problems/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const problems = readDB();
  const index    = problems.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Problem "${id}" not found.` });
  }

  problems.splice(index, 1);
  writeDB(problems);

  console.log(`[Admin] 🗑️  Problem "${id}" deleted by ${req.adminUser}`);
  res.json({ success: true, deletedId: id });
});

/**
 * POST /api/admin/problems/:id/solve
 * Toggles the solved status of a problem.
 * Response: updated problem object
 */
router.post('/problems/:id/solve', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const problems = readDB();
  const problem  = problems.find(p => p.id === id);

  if (!problem) {
    return res.status(404).json({ error: `Problem "${id}" not found.` });
  }

  problem.solved = !problem.solved;
  writeDB(problems);

  console.log(`[Admin] ✅ Problem "${id}" solved=${problem.solved} by ${req.adminUser}`);
  res.json(problem);
});

/**
 * POST /api/admin/logout
 * Invalidates the current session token.
 */
router.post('/logout', requireAdminAuth, (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.slice(7);
  activeTokens.delete(token);
  console.log(`[Admin] 👋 Admin "${req.adminUser}" logged out.`);
  res.json({ success: true });
});

module.exports = router;
