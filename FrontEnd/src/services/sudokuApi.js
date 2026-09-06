import { clearAuth, getToken } from './authApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Generic request helper.
 * Automatically attaches the JWT Bearer token from localStorage if present.
 * Redirects to /login if backend returns 401 or 403 unauthorized status.
 */
async function request(path, options = {}) {
  const { skipAuthRedirect, ...fetchOptions } = options;
  const url = `${BASE_URL}${path}`;
  // BUG FIX: Use getToken helper from authApi service instead of hardcoding key string
  const token = getToken();
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...authHeader, ...(fetchOptions.headers || {}) },
      ...fetchOptions,
    });
  } catch (err) {
    throw new Error(err.message || 'Network error connecting to backend.');
  }

  // Handle unauthorized responses (401 or 403)
  // BUG FIX: Check !skipAuthRedirect so non-critical or fallback API calls (like fetchAwards)
  // do not wipe the user's stored session and force an unwanted redirect to /login.
  if ((response.status === 401 || response.status === 403) && !skipAuthRedirect) {
    clearAuth();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expired or unauthorized. Please log in again.');
  }

  if (!response.ok) {
    let errorBody = null;
    try {
      errorBody = await response.json();
    } catch {
      // ignore parse errors
    }
    const message = errorBody?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}

/**
 * POST /api/games
 * Create a new Sudoku game.
 *
 * @param {string} difficulty - 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | 'MASTER' | 'EXTREME'
 * @returns {Promise<{gameId: string, puzzle: number[][], currentBoard: number[][], mistakes: number, remainingChances: number, status: string}>}
 */
export async function createGame(difficulty = 'MEDIUM') {
  return request('/api/games', {
    method: 'POST',
    body: JSON.stringify({ difficulty }),
  });
}

/**
 * POST /api/games/:gameId/moves
 * Submit a single cell move for backend validation.
 *
 * @param {string} gameId
 * @param {number} row     - 0-indexed row
 * @param {number} col     - 0-indexed column
 * @param {number} value   - 1-9
 * @returns {Promise<{valid: boolean, message: string, board: number[][], mistakes: number, remainingChances: number, gameOver: boolean, completed: boolean}>}
 */
export async function makeMove(gameId, row, col, value) {
  return request(`/api/games/${gameId}/moves`, {
    method: 'POST',
    body: JSON.stringify({ row, col, value }),
  });
}

/**
 * POST /api/scores
 * Submit completed game score to backend.
 * Returns score, calculated XP, level, and any newly unlocked achievements.
 *
 * @param {Object} scoreData
 * @param {string} scoreData.difficulty
 * @param {number} scoreData.mistakes
 * @param {number} scoreData.timeTaken
 * @returns {Promise<{id: number, username: string, score: number, difficulty: string, mistakes: number, timeTaken: number, totalXP?: number, level?: number, newAchievements?: Array}>}
 */
export async function submitScore({ difficulty, mistakes, timeTaken }) {
  return request('/api/scores', {
    method: 'POST',
    body: JSON.stringify({
      difficulty: (difficulty || 'MEDIUM').toUpperCase(),
      mistakes: Number(mistakes || 0),
      timeTaken: Number(timeTaken || 0),
    }),
  });
}

/**
 * GET /api/scores/me
 * Fetch logged-in user's score history.
 *
 * @returns {Promise<Array<{id: number, username: string, score: number, difficulty: string, mistakes: number, timeTaken: number}>>}
 */
export async function fetchMyScores() {
  return request('/api/scores/me');
}

/**
 * GET /api/leaderboard
 * Fetch leaderboard entries.
 *
 * @returns {Promise<Array>}
 */
export async function fetchLeaderboard() {
  return request('/api/leaderboard');
}

/**
 * GET /api/achievements
 * Fetch all available achievement definitions in the game.
 * Uses skipAuthRedirect: true to prevent unwanted logout on network hiccups.
 *
 * @returns {Promise<Array<{id: number, code: string, name: string, description: string, xpReward: number, rarity: string}>>}
 */
export async function fetchAllAchievements() {
  try {
    return await request('/api/achievements', { skipAuthRedirect: true });
  } catch {
    return [];
  }
}

/**
 * GET /api/achievements/user/{userId}
 * Fetch user's unlocked achievements from backend endpoint.
 * Fallback to /api/achievements/me if userId is missing.
 *
 * @param {number|string} [userId]
 * @returns {Promise<Array<{id: number, achievement: Object, unlockedAt: string}>>}
 */
export async function fetchUserAchievements(userId) {
  try {
    if (userId) {
      return await request(`/api/achievements/user/${userId}`, { skipAuthRedirect: true });
    }
    return await request('/api/achievements/me', { skipAuthRedirect: true });
  } catch {
    return [];
  }
}

/**
 * GET /api/awards
 * Fetch player achievements (legacy / backwards-compatible wrapper).
 *
 * @returns {Promise<Array>}
 */
export async function fetchAwards() {
  try {
    const data = await request('/api/achievements/me', { skipAuthRedirect: true });
    if (Array.isArray(data) && data.length > 0) return data;
    return await request('/api/awards', { skipAuthRedirect: true });
  } catch {
    return [];
  }
}
