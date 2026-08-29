// ============================================================
// Auth API Service — Login & Signup
// All auth communication lives here.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ── LocalStorage keys ──────────────────────────────────────
const TOKEN_KEY = 'sudoku_jwt';
const USERNAME_KEY = 'sudoku_username';
const ROLE_KEY = 'sudoku_role';

// ── Token helpers (exported for use across app) ────────────

/** Get stored JWT token */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/** Get stored username */
export function getUsername() {
  return localStorage.getItem(USERNAME_KEY);
}

/** Get stored role */
export function getRole() {
  return localStorage.getItem(ROLE_KEY);
}

/** Check if user is authenticated */
export function isAuthenticated() {
  return Boolean(getToken());
}

/** Store auth data after successful login */
function storeAuth(token, username, role) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username || '');
  localStorage.setItem(ROLE_KEY, role || '');
}

/** Remove all auth data (logout) */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLE_KEY);
}

// ── API helpers ────────────────────────────────────────────

async function authRequest(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // ignore parse errors
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return data;
}

// ── Auth API calls ─────────────────────────────────────────

/**
 * POST /api/auth/signup
 * @param {string} username
 * @param {string} email
 * @param {string} password
 */
export async function signup(username, email, password) {
  return authRequest('/api/auth/signup', { username, email, password });
}

/**
 * POST /api/auth/login
 * On success, stores token + username + role in localStorage.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, username: string, role: string}>}
 */
export async function login(email, password) {
  const data = await authRequest('/api/auth/login', { email, password });
  // Backend returns: { token, username, role }
  const token = data.token || data.accessToken || data.jwt;
  const username = data.username || data.name || email.split('@')[0];
  const role = data.role || data.roles?.[0] || 'USER';
  storeAuth(token, username, role);
  return { token, username, role };
}
