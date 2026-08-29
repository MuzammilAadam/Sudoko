import { clearAuth } from './authApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Generic request helper.
 * Automatically attaches the JWT Bearer token from localStorage if present.
 * Redirects to /login if backend returns 401 or 403 unauthorized status.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const token = localStorage.getItem('sudoku_jwt');
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  let response;
  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...authHeader, ...(options.headers || {}) },
      ...options,
    });
  } catch (err) {
    throw new Error(err.message || 'Network error connecting to backend.');
  }

  // Handle unauthorized responses (401 or 403)
  if (response.status === 401 || response.status === 403) {
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
 *
 * @param {Object} scoreData
 * @param {string} scoreData.difficulty
 * @param {number} scoreData.mistakes
 * @param {number} scoreData.timeTaken
 * @returns {Promise<{id: number, username: string, score: number, difficulty: string, mistakes: number, timeTaken: number}>}
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
 * GET /api/awards
 * Fetch player achievements.
 *
 * @returns {Promise<Array>}
 */
export async function fetchAwards() {
  return request('/api/awards');
}
