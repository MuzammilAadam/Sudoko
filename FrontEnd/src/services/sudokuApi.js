// ============================================================
// API Service — All backend communication lives here.
// Components should NEVER make fetch/axios calls directly.
// ============================================================

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Generic request helper.
 */
async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

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
 * GET /api/leaderboard
 * Fetch leaderboard entries.
 * Modular — backend integration can be completed later.
 *
 * @returns {Promise<Array>}
 */
export async function fetchLeaderboard() {
  return request('/api/leaderboard');
}

/**
 * GET /api/awards
 * Fetch player achievements.
 * Modular — backend integration can be completed later.
 *
 * @returns {Promise<Array>}
 */
export async function fetchAwards() {
  return request('/api/awards');
}
