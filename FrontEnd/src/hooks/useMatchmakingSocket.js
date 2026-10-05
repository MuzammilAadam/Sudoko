import { useState, useRef, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * useMatchmakingSocket — Dedicated custom hook for random matchmaking via STOMP / WebSocket.
 *
 * Responsibilities:
 * - Connects to SockJS endpoint ${WS_BASE_URL}/ws
 * - Subscribes to /topic/matchmaking/{username}
 * - Publishes join request to /app/matchmaking.join
 * - Publishes cancellation request to /app/matchmaking.cancel
 * - Handles WAITING, MATCH_FOUND, CANCELLED, and ERROR messages
 * - Clean disconnect and unmount handling without accidental cancel on MATCH_FOUND
 *
 * @param {string} username - Logged-in user's username
 * @param {object} callbacks - { onMatchFound, onWaiting, onCancelled, onError }
 */
export function useMatchmakingSocket(username, { onMatchFound, onWaiting, onCancelled, onError } = {}) {
  // States: 'IDLE' | 'SEARCHING' | 'MATCH_FOUND' | 'STARTING_GAME' | 'ERROR'
  const [matchState, setMatchState] = useState('IDLE');
  const [matchData, setMatchData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const isMatchFoundRef = useRef(false);

  // Keep latest callbacks in ref to avoid stale closures
  const callbacksRef = useRef({ onMatchFound, onWaiting, onCancelled, onError });
  useEffect(() => {
    callbacksRef.current = { onMatchFound, onWaiting, onCancelled, onError };
  }, [onMatchFound, onWaiting, onCancelled, onError]);

  // Cleanly teardown socket client and subscription
  const disconnectSocket = useCallback(() => {
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch {
        // ignore errors if already closed
      }
      subscriptionRef.current = null;
    }
    if (clientRef.current) {
      try {
        clientRef.current.deactivate();
      } catch {
        // ignore errors during deactivation
      }
      clientRef.current = null;
    }
  }, []);

  // Cancel matchmaking queue
  const cancelQueue = useCallback(() => {
    console.log('[Matchmaking] Cancelling queue for user:', username);
    if (clientRef.current && clientRef.current.connected && username) {
      try {
        clientRef.current.publish({
          destination: '/app/matchmaking.cancel',
          body: JSON.stringify({ username }),
        });
      } catch (err) {
        console.warn('[Matchmaking] Failed to publish cancel frame:', err);
      }
    }

    disconnectSocket();
    setMatchState('IDLE');
    setMatchData(null);
    setErrorMessage(null);

    if (callbacksRef.current.onCancelled) {
      callbacksRef.current.onCancelled();
    }
  }, [username, disconnectSocket]);

  // Join matchmaking queue
  const joinQueue = useCallback(() => {
    if (!username || username === 'Player') {
      setErrorMessage('Please log in with a valid account to play online.');
      setMatchState('ERROR');
      return;
    }

    console.log('[Matchmaking] Starting matchmaking search for user:', username);
    isMatchFoundRef.current = false;
    setMatchState('SEARCHING');
    setMatchData(null);
    setErrorMessage(null);

    // Close any previous lingering client
    disconnectSocket();

    const socketFactory = () => new SockJS(`${WS_BASE_URL}/ws`);

    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 0, // Do not auto-reconnect silently if connection drops during matchmaking
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[Matchmaking STOMP]:', str);
        }
      },
    });

    client.onConnect = () => {
      console.log(`[Matchmaking STOMP Connected] Subscribing to /topic/matchmaking/${username}`);

      // 1. Subscribe to personal matchmaking topic: /topic/matchmaking/{username}
      subscriptionRef.current = client.subscribe(`/topic/matchmaking/${username}`, (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log('[Matchmaking Response Received]:', response);

          if (response.type === 'WAITING') {
            setMatchState('SEARCHING');
            if (callbacksRef.current.onWaiting) {
              callbacksRef.current.onWaiting(response);
            }
          } else if (response.type === 'MATCH_FOUND') {
            isMatchFoundRef.current = true;
            setMatchState('MATCH_FOUND');
            setMatchData(response);

            // Cleanly close matchmaking STOMP connection since game will use useMultiplayerSocket
            disconnectSocket();

            if (callbacksRef.current.onMatchFound) {
              callbacksRef.current.onMatchFound(response);
            }
          } else if (response.type === 'CANCELLED' || response.type === 'NOT_WAITING') {
            setMatchState('IDLE');
            setMatchData(null);
            disconnectSocket();

            if (callbacksRef.current.onCancelled) {
              callbacksRef.current.onCancelled(response);
            }
          } else if (response.type === 'ERROR') {
            setMatchState('ERROR');
            setErrorMessage('Unable to find an opponent right now.');
            disconnectSocket();

            if (callbacksRef.current.onError) {
              callbacksRef.current.onError(response);
            }
          }
        } catch (err) {
          console.error('[Matchmaking] Failed to parse message:', err);
        }
      });

      // 2. Publish join message to /app/matchmaking.join
      client.publish({
        destination: '/app/matchmaking.join',
        body: JSON.stringify({ username }),
      });
    };

    client.onStompError = (frame) => {
      console.error('[Matchmaking STOMP Error Frame]:', frame);
      disconnectSocket();
      setMatchState('ERROR');
      setErrorMessage('Unable to connect to matchmaking server.');
      if (callbacksRef.current.onError) {
        callbacksRef.current.onError('Connection error');
      }
    };

    client.onWebSocketClose = () => {
      console.log('[Matchmaking] WebSocket closed.');
      // If closed because a match was found and we're starting game, ignore
      if (isMatchFoundRef.current) return;

      // If closed unexpectedly while searching, mark as connection error
      setMatchState((current) => {
        if (current === 'SEARCHING') {
          setErrorMessage('Connection lost.');
          return 'ERROR';
        }
        return current;
      });
    };

    client.activate();
    clientRef.current = client;
  }, [username, disconnectSocket]);

  // Reset to idle helper
  const resetToIdle = useCallback(() => {
    disconnectSocket();
    setMatchState('IDLE');
    setMatchData(null);
    setErrorMessage(null);
  }, [disconnectSocket]);

  // Cleanup on unmount: if actively searching and match wasn't found, notify backend and disconnect
  useEffect(() => {
    return () => {
      if (!isMatchFoundRef.current && clientRef.current && clientRef.current.connected && username) {
        try {
          clientRef.current.publish({
            destination: '/app/matchmaking.cancel',
            body: JSON.stringify({ username }),
          });
        } catch {
          // ignore
        }
      }
      disconnectSocket();
    };
  }, [username, disconnectSocket]);

  return {
    matchState,
    matchData,
    errorMessage,
    joinQueue,
    cancelQueue,
    resetToIdle,
    setMatchState,
  };
}
