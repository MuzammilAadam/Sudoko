// ============================================================
// Multiplayer REST API Service
// Handles REST API calls for online multiplayer Sudoku rooms.
// ============================================================

import { getToken, clearAuth } from './authApi';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * POST /api/multiplayer/create
 * Creates a new multiplayer game room on the Spring Boot backend.
 * Sends the logged-in user's JWT token from localStorage in the Authorization header.
 *
 * @returns {Promise<{ roomId: string, board: number[][] }>}
 */
export async function createMultiplayerRoom() {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}/api/multiplayer/create`, {
      method: 'POST',
      headers,
    });
  } catch (err) {
    throw new Error(err.message || 'Network error connecting to multiplayer server.');
  }

  // Handle unauthorized responses (401 / 403)
  if (response.status === 401 || response.status === 403) {
    clearAuth();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again to play multiplayer.');
  }

  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // ignore parse errors
    }
    const message = errorData?.message || errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    roomId: data.roomId,
    board: data.board,
  };
}
