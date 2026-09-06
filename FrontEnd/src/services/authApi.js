// ============================================================
// Auth API Service — Login & Signup
// All auth communication lives here.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ── LocalStorage keys ──────────────────────────────────────
const TOKEN_KEY = 'sudoku_jwt';
const USERNAME_KEY = 'sudoku_username';
const ROLE_KEY = 'sudoku_role';
const USER_ID_KEY = 'sudoku_user_id';
const USER_XP_KEY = 'sudoku_user_xp';
const USER_LEVEL_KEY = 'sudoku_user_level';

// ── Token & User State helpers (exported for use across app) ────────────

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

/** Get stored user ID */
export function getUserId() {
  const id = localStorage.getItem(USER_ID_KEY);
  return id ? Number(id) : null;
}

/** Get cached XP */
export function getUserXP() {
  const xp = localStorage.getItem(USER_XP_KEY);
  return xp !== null ? Number(xp) : 0;
}

/** Get cached Level */
export function getUserLevel() {
  const lvl = localStorage.getItem(USER_LEVEL_KEY);
  return lvl !== null ? Number(lvl) : 1;
}

/** Update cached XP and Level without full login */
export function storeUserXPAndLevel(xp, level) {
  if (xp !== undefined && xp !== null) {
    localStorage.setItem(USER_XP_KEY, String(xp));
  }
  if (level !== undefined && level !== null) {
    localStorage.setItem(USER_LEVEL_KEY, String(level));
  }
}

/** Check if user is authenticated */
export function isAuthenticated() {
  return Boolean(getToken());
}

/** Store auth data after successful login */
export function storeAuth(token, username, role, id = null, totalXP = 0, level = 1) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username || '');
  localStorage.setItem(ROLE_KEY, role || '');
  if (id !== null && id !== undefined) {
    localStorage.setItem(USER_ID_KEY, String(id));
  }
  if (totalXP !== null && totalXP !== undefined) {
    localStorage.setItem(USER_XP_KEY, String(totalXP));
  }
  if (level !== null && level !== undefined) {
    localStorage.setItem(USER_LEVEL_KEY, String(level));
  }
}

/** Remove all auth data (logout) */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_XP_KEY);
  localStorage.removeItem(USER_LEVEL_KEY);
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
 * On success, stores token + username + role + id + totalXP + level in localStorage.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, username: string, role: string, id: number|null, totalXP: number, level: number}>}
 */
export async function login(email, password) {
  const data = await authRequest('/api/auth/login', { email, password });
  // Backend returns: { id, token, username, role, totalXP, level }
  const token = data.token || data.accessToken || data.jwt;
  const username = data.username || data.name || email.split('@')[0];
  const role = data.role || data.roles?.[0] || 'USER';
  const id = data.id ?? null;
  const totalXP = data.totalXP ?? 0;
  const level = data.level ?? 1;

  storeAuth(token, username, role, id, totalXP, level);
  return { token, username, role, id, totalXP, level };
}

/**
 * GET /api/auth/me
 * Fetch and sync authenticated user profile details (id, XP, level, stats).
 * Does NOT redirect or wipe session on failure.
 */
export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;
    const user = await response.json();
    if (user?.id) {
      localStorage.setItem(USER_ID_KEY, String(user.id));
    }
    if (user?.username) {
      localStorage.setItem(USERNAME_KEY, user.username);
    }
    if (user?.totalXP !== undefined) {
      localStorage.setItem(USER_XP_KEY, String(user.totalXP));
    }
    if (user?.level !== undefined) {
      localStorage.setItem(USER_LEVEL_KEY, String(user.level));
    }
    return user;
  } catch {
    return null;
  }
}
