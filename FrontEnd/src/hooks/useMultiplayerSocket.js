import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * useMultiplayerSocket — Custom React hook for managing real-time WebSocket / STOMP communication.
 *
 * Keeps single-player and multiplayer state separate and handles:
 * - Connecting via SockJS to http://localhost:8080/ws
 * - Subscribing to /topic/game/{roomId}
 * - Publishing join message to /app/game.join
 * - Publishing move messages to /app/game.move
 * - Reconnection logic on temporary connection drops
 * - Prevention of duplicate connections across React re-renders using useRef
 * - Unsubscribing and disconnecting cleanly when component unmounts
 *
 * @param {string | null} roomId - Active multiplayer room ID
 * @param {string} username - Current logged-in user's username
 * @param {function} onGameUpdate - Callback fired when backend broadcasts a game update
 * @param {function} onError - Callback fired when STOMP / WS error occurs
 *
 * @returns {object} { isConnected, isConnecting, connectionError, sendMove, disconnect }
 */
export function useMultiplayerSocket(roomId, username, onGameUpdate, onError) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Use refs to hold STOMP client instance and subscriptions across re-renders
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const onGameUpdateRef = useRef(onGameUpdate);
  const onErrorRef = useRef(onError);

  // Always keep callback refs current so callbacks inside subscription get latest closures
  useEffect(() => {
    onGameUpdateRef.current = onGameUpdate;
    onErrorRef.current = onError;
  }, [onGameUpdate, onError]);

  useEffect(() => {
    // Only attempt connection if roomId and username are both present
    if (!roomId || !username) {
      return;
    }

    // Prevent re-connecting if client exists and is already active for this room
    if (clientRef.current && clientRef.current.active) {
      return;
    }

    setIsConnecting(true);
    setConnectionError(null);

    // Factory function to initialize SockJS connection
    // Backend endpoint: http://localhost:8080/ws
    const socketFactory = () => new SockJS(`${WS_BASE_URL}/ws`);

    // Create STOMP client instance
    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 3000, // Auto-reconnect after 3 seconds if connection drops
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP Debug]:', str);
        }
      },
    });

    // Callback fired when STOMP connection is successfully established
    client.onConnect = () => {
      console.log(`[STOMP Connected] Joined WebSocket room: ${roomId}`);
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);

      // 1. Subscribe to backend topic for real-time game updates: /topic/game/{roomId}
      subscriptionRef.current = client.subscribe(`/topic/game/${roomId}`, (message) => {
        try {
          const gameUpdate = JSON.parse(message.body);
          if (onGameUpdateRef.current) {
            onGameUpdateRef.current(gameUpdate);
          }
        } catch (err) {
          console.error('[STOMP Update Error] Failed to parse payload:', err);
        }
      });

      // 2. Send join message to backend destination: /app/game.join
      // Payload: { roomId, username }
      client.publish({
        destination: '/app/game.join',
        body: JSON.stringify({
          roomId,
          username,
        }),
      });
    };

    // Callback fired on STOMP protocol errors (e.g. room full or room not found)
    client.onStompError = (frame) => {
      const msg = frame.headers['message'] || 'WebSocket connection error';
      console.error('[STOMP Error Frame]:', msg, frame.body);
      setConnectionError(msg);
      setIsConnecting(false);
      if (onErrorRef.current) {
        onErrorRef.current(msg);
      }
    };

    // Callback fired when underlying WebSocket connection closes
    client.onWebSocketClose = () => {
      console.log('[STOMP] Connection closed.');
      setIsConnected(false);
    };

    // Activate connection
    client.activate();
    clientRef.current = client;

    // Cleanup logic: unsubscribe and deactivate STOMP client when component unmounts or roomId changes
    return () => {
      console.log(`[STOMP Cleanup] Unsubscribing and closing socket for room: ${roomId}`);
      if (subscriptionRef.current) {
        try {
          subscriptionRef.current.unsubscribe();
        } catch (_e) {
          // Ignore cleanup errors — STOMP may already be closed at this point
        }
        subscriptionRef.current = null;
      }
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
    };
  }, [roomId, username]);

  /**
   * sendMove — Send a move to /app/game.move via STOMP WebSocket.
   * Do NOT update local board state here; wait for backend broadcast on /topic/game/{roomId}.
   *
   * @param {object} move - { row, col, value }
   */
  const sendMove = useCallback(
    (move) => {
      if (!clientRef.current || !clientRef.current.connected) {
        console.warn('[STOMP Warning] Cannot send move: Client not connected.');
        return false;
      }

      // Publish move payload: { roomId, username, row, col, value }
      // username is required by the backend MultiplayerMove DTO to attribute scores correctly.
      clientRef.current.publish({
        destination: '/app/game.move',
        body: JSON.stringify({
          roomId,
          username: move.username || '',
          row: move.row,
          col: move.col,
          value: move.value,
        }),
      });

      return true;
    },
    [roomId]
  );

  /**
   * Disconnect cleanly from room
   */
  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  return {
    isConnected,
    isConnecting,
    connectionError,
    sendMove,
    disconnect,
  };
}
