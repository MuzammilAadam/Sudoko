import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import MultiplayerResultModal from '../components/MultiplayerResultModal';
import { SudokuSearchGrid, MatchFoundTransition } from '../components/MatchmakingAnimation';
import { createMultiplayerRoom } from '../services/multiplayerApi';
import { useMultiplayerSocket } from '../hooks/useMultiplayerSocket';
import { useMatchmakingSocket } from '../hooks/useMatchmakingSocket';
import { getUsername } from '../services/authApi';
import {
  Users,
  PlusCircle,
  LogIn,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Zap,
  ArrowLeft,
  Info,
  Swords,
  XCircle,
  Gamepad2,
  RotateCcw,
  Play,
  X,
  Radio,
} from 'lucide-react';

export default function MultiplayerPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const username = getUsername() || 'Player';

  // ─── Room & Board State ─────────────────────────────────────
  const [roomId, setRoomId] = useState(null);
  const [joinInput, setJoinInput] = useState('');
  const [initialBoard, setInitialBoard] = useState(null); // original puzzle snapshot (determines given cells)
  const [currentBoard, setCurrentBoard] = useState(null); // latest board from backend
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  // ─── Multiplayer Feedback State ─────────────────────────────
  const [playerScores, setPlayerScores] = useState({});
  const [lastMessage, setLastMessage] = useState(null);
  const [lastPlayer, setLastPlayer] = useState(null);
  const [lastValid, setLastValid] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);

  // ─── UI & Error States ──────────────────────────────────────
  const [apiLoading, setApiLoading] = useState(false);
  const [roomError, setRoomError] = useState(null);
  const [copied, setCopied] = useState(false);
  const EMPTY_SET = new Set();
  const EMPTY_OBJ = {};

  // ─── Matchmaking State & Sockets ─────────────────────────────
  const matchTransitionTimeoutRef = useRef(null);
  const resetToIdleRef = useRef(null);

  const handleMatchFound = useCallback((response) => {
    console.log('[Multiplayer] Match found! Transitioning to game in 1.8s:', response);
    matchTransitionTimeoutRef.current = setTimeout(() => {
      if (response.roomId) {
        setRoomId(response.roomId);
        if (response.board) {
          setInitialBoard(response.board);
          setCurrentBoard(response.board);
        }
        setPlayerScores({
          [username]: 0,
          [response.opponent || 'Opponent']: 0,
        });
        setGameFinished(false);
        setLastMessage(`Match started with ${response.opponent || 'Opponent'}!`);
        setLastValid(true);
        if (resetToIdleRef.current) {
          resetToIdleRef.current();
        }
      }
    }, 1800);
  }, [username]);

  const {
    matchState,
    matchData,
    errorMessage: matchmakingError,
    joinQueue,
    cancelQueue,
    resetToIdle,
  } = useMatchmakingSocket(username, {
    onMatchFound: handleMatchFound,
  });

  useEffect(() => {
    resetToIdleRef.current = resetToIdle;
    return () => {
      if (matchTransitionTimeoutRef.current) {
        clearTimeout(matchTransitionTimeoutRef.current);
      }
    };
  }, [resetToIdle]);

  // ─── Create Room Handler ────────────────────────────────────
  const handleCreateRoom = useCallback(async () => {
    setApiLoading(true);
    setRoomError(null);
    try {
      const data = await createMultiplayerRoom();
      setRoomId(data.roomId);
      setInitialBoard(data.board);
      setCurrentBoard(data.board);
      setPlayerScores({ [username]: 0 });
      setGameFinished(false);
      setLastMessage('Room created! Share code with your opponent.');
      setLastValid(true);
    } catch (err) {
      setRoomError(err.message || 'Failed to create room.');
    } finally {
      setApiLoading(false);
    }
  }, [username]);

  // ─── Handle URL Query Params Auto Action ───────────────────
  /*
   * =========================================================================================
   * BUG LOCATION & ROOT CAUSE:
   * When navigating to "/multiplayer?action=create", searchParams contained action='create'.
   * On initial mount, handleCreateRoom() was called and roomId was set.
   * BUT searchParams was NEVER cleared from the URL!
   * When the user clicked "Exit Room", handleExitRoom() set roomId to null.
   * Because 'roomId' was in this useEffect's dependency array, setting roomId to null
   * immediately re-triggered this useEffect!
   * In the re-triggered effect:
   *   action === 'create' was still in searchParams, and !roomId was true again!
   * This caused handleCreateRoom() to be called AGAIN, automatically creating a brand
   * new room with a new ID!
   *
   * FIX:
   * 1. Call setSearchParams({}, { replace: true }) as soon as the action ('create' or 'code')
   *    is consumed so it does not linger in the URL.
   * 2. In handleExitRoom(), also call setSearchParams({}, { replace: true }) and notify the backend
   *    via leaveRoom() before disconnecting.
   * =========================================================================================
   */
  useEffect(() => {
    const action = searchParams.get('action');
    const code = searchParams.get('code');

    if (action === 'create' && !roomId && !apiLoading && matchState === 'IDLE') {
      // Clear URL params immediately to avoid re-triggering on exit
      setSearchParams({}, { replace: true });
      handleCreateRoom();
    } else if (action === 'matchmake' && !roomId && matchState === 'IDLE') {
      setSearchParams({}, { replace: true });
      joinQueue();
    } else if (code && !roomId) {
      const formatted = code.trim().toUpperCase();
      // Clear URL params immediately
      setSearchParams({}, { replace: true });
      setJoinInput(formatted);
      setRoomId(formatted);
      setInitialBoard(null);
      setCurrentBoard(null);
      setGameFinished(false);
      setLastMessage(`Connecting to room ${formatted}...`);
    }
  }, [searchParams, setSearchParams, handleCreateRoom, joinQueue, roomId, apiLoading, matchState]);

  // ─── WebSocket Update Handler ───────────────────────────────
  const handleGameUpdate = useCallback(
    (update) => {
      console.log('[Multiplayer Update Received]:', update);

      if (update.board) {
        setInitialBoard((prev) => prev || update.board.map((row) => [...row]));
        setCurrentBoard(update.board);
      }

      if (update.playerScores) {
        setPlayerScores(update.playerScores);
      }

      if (update.message) {
        setLastMessage(update.message);
      }

      if (update.player) {
        setLastPlayer(update.player);
      }

      if (typeof update.valid === 'boolean') {
        setLastValid(update.valid);
      }

      if (typeof update.gameFinished === 'boolean') {
        setGameFinished(update.gameFinished);
      }
    },
    []
  );

  // ─── WebSocket Error Handler ────────────────────────────────
  const handleSocketError = useCallback((errMsg) => {
    setRoomError(errMsg || 'WebSocket error. Room may be full or invalid.');
  }, []);

  // ─── WebSocket Hook Initialization ─────────────────────────
  const { isConnected, isConnecting, connectionError, sendMove, leaveRoom, disconnect } = useMultiplayerSocket(
    roomId,
    username,
    handleGameUpdate,
    handleSocketError
  );

  // ─── Join Room Handler ──────────────────────────────────────
  const handleJoinRoom = (e) => {
    e?.preventDefault();
    const code = joinInput.trim().toUpperCase();
    if (!code) {
      setRoomError('Please enter a valid 6-character room code.');
      return;
    }
    setRoomError(null);
    setRoomId(code);
    setInitialBoard(null);
    setCurrentBoard(null);
    setGameFinished(false);
    setLastMessage(`Connecting to room ${code}...`);
  };

  // ─── Exit Room Handler ──────────────────────────────────────
  /*
   * BUG FIX:
   * 1. Send /app/game.leave message to backend over WebSocket so backend removes player
   *    from active room and notifies opponent.
   * 2. Clear searchParams to prevent URL query re-triggering new room creation.
   * 3. Disconnect WebSocket cleanly and reset all room/board states.
   */
  const handleExitRoom = () => {
    leaveRoom();
    disconnect();
    resetToIdle();
    setSearchParams({}, { replace: true });
    setRoomId(null);
    setInitialBoard(null);
    setCurrentBoard(null);
    setSelectedRow(null);
    setSelectedCol(null);
    setPlayerScores({});
    setLastMessage(null);
    setLastPlayer(null);
    setLastValid(null);
    setGameFinished(false);
    setRoomError(null);
  };

  // ─── Copy Room Code Helper ──────────────────────────────────
  const handleCopyCode = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── Cell Selection Handler ─────────────────────────────────
  const handleCellClick = (row, col) => {
    if (gameFinished || !isConnected) return;
    if (initialBoard && initialBoard[row][col] !== 0) return;
    setSelectedRow(row);
    setSelectedCol(col);
  };

  // ─── Move Submission Handler (WebSocket) ─────────────────────
  const handleNumberInput = useCallback((value) => {
    if (selectedRow === null || selectedCol === null) return;
    if (gameFinished || !isConnected) return;
    if (initialBoard && initialBoard[selectedRow][selectedCol] !== 0) return;

    sendMove({
      row: selectedRow,
      col: selectedCol,
      value,
      username,
    });
  }, [selectedRow, selectedCol, gameFinished, isConnected, initialBoard, sendMove, username]);

  // ─── Keyboard Input Listener ────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!roomId || gameFinished) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) {
        handleNumberInput(num);
      } else if (e.key === 'ArrowUp') {
        setSelectedRow((r) => (r !== null ? Math.max(0, r - 1) : 0));
      } else if (e.key === 'ArrowDown') {
        setSelectedRow((r) => (r !== null ? Math.min(8, r + 1) : 0));
      } else if (e.key === 'ArrowLeft') {
        setSelectedCol((c) => (c !== null ? Math.max(0, c - 1) : 0));
      } else if (e.key === 'ArrowRight') {
        setSelectedCol((c) => (c !== null ? Math.min(8, c + 1) : 0));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [roomId, gameFinished, handleNumberInput]);

  // Compute remaining counts for NumberPad
  const computeRemainingCounts = (board) => {
    if (!board) return {};
    const counts = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
    board.forEach((r) => r.forEach((v) => { if (v !== 0) counts[v]--; }));
    return counts;
  };

  const playersList = Object.keys(playerScores);
  const waitingForOpponent = playersList.length < 2;
  const boardDisabled = gameFinished || !isConnected || waitingForOpponent;

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Room Error Banner ── */}
        {(roomError || connectionError) && (
          <div
            style={{
              background: '#FEE2E2',
              border: '3px solid #EF4444',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '4px 4px 0 #EF4444',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={20} color="#EF4444" />
            <span style={{ flex: 1, fontSize: '14px' }}>{roomError || connectionError}</span>
            <button
              onClick={() => {
                setRoomError(null);
                handleExitRoom();
              }}
              style={{
                background: 'white',
                border: '2px solid #0A0A0A',
                borderRadius: '6px',
                padding: '4px 10px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Back to Lobby
            </button>
          </div>
        )}

        {/* ── LOBBY VIEW (No Active Room) ── */}
        {!roomId && (
          <div style={{ maxWidth: '780px', margin: '20px auto 0' }}>
            {/* Header Card */}
            <div
              className="neo-card"
              style={{
                padding: '28px 24px',
                background: 'white',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '56px',
                  height: '56px',
                  background: '#FFD60A',
                  border: '3px solid #0A0A0A',
                  borderRadius: '50%',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  marginBottom: '12px',
                }}
              >
                <Swords size={28} color="#0A0A0A" />
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 900,
                  fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                  marginBottom: '6px',
                  color: '#0A0A0A',
                }}
              >
                MULTIPLAYER SUDOKU
              </h1>
              <p style={{ color: '#4B5563', fontSize: '15px', margin: 0, fontWeight: 600 }}>
                Compete head-to-head in real time on identical Sudoku boards.
              </p>
            </div>

            {/* Option 1: PLAY ONLINE (Random Matchmaking) Hero Card */}
            <div
              className="neo-card"
              style={{
                padding: '28px 24px',
                background:
                  matchState === 'MATCH_FOUND'
                    ? '#FFFBF0'
                    : matchState === 'SEARCHING'
                    ? '#FFFBF0'
                    : '#FFF9D2',
                border: '3px solid #0A0A0A',
                boxShadow: '6px 6px 0 #0A0A0A',
                marginBottom: '20px',
                textAlign: 'center',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              {matchState === 'IDLE' && (
                <div>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: '#FF3CAC',
                      color: 'white',
                      border: '2px solid #0A0A0A',
                      padding: '3px 12px',
                      borderRadius: '20px',
                      fontWeight: 800,
                      fontSize: '11px',
                      fontFamily: "'Space Mono', monospace",
                      boxShadow: '2px 2px 0 #0A0A0A',
                      marginBottom: '12px',
                    }}
                  >
                    <Radio size={14} /> LIVE MATCHMAKING
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.8rem',
                      color: '#0A0A0A',
                      margin: '0 0 8px 0',
                    }}
                  >
                    PLAY ONLINE
                  </h2>

                  <p
                    style={{
                      fontSize: '15px',
                      color: '#4B5563',
                      fontWeight: 600,
                      maxWidth: '460px',
                      margin: '0 auto 20px',
                      lineHeight: 1.5,
                    }}
                  >
                    Find a random opponent and compete in real time.
                  </p>

                  <button
                    id="play-online-btn"
                    onClick={joinQueue}
                    disabled={apiLoading}
                    style={{
                      padding: '16px 36px',
                      border: '3px solid #0A0A0A',
                      borderRadius: '12px',
                      background: '#FFD60A',
                      color: '#0A0A0A',
                      fontWeight: 900,
                      fontSize: '17px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      cursor: 'pointer',
                      boxShadow: '4px 4px 0 #0A0A0A',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)';
                      e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                    }}
                  >
                    <Play size={20} fill="#0A0A0A" />
                    PLAY ONLINE
                  </button>
                </div>
              )}

              {matchState === 'SEARCHING' && (
                <div>
                  <h2
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.8rem',
                      color: '#0A0A0A',
                      margin: '0 0 6px 0',
                    }}
                  >
                    FINDING OPPONENT
                  </h2>

                  <p style={{ color: '#4B5563', fontSize: '14px', fontWeight: 600, margin: '0 0 16px 0' }}>
                    Searching for another player...
                  </p>

                  <SudokuSearchGrid />

                  <button
                    id="cancel-matchmaking-btn"
                    onClick={cancelQueue}
                    style={{
                      padding: '12px 28px',
                      border: '3px solid #0A0A0A',
                      borderRadius: '10px',
                      background: '#FEE2E2',
                      color: '#EF4444',
                      fontWeight: 800,
                      fontSize: '14px',
                      fontFamily: "'Space Mono', monospace",
                      cursor: 'pointer',
                      boxShadow: '4px 4px 0 #0A0A0A',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate(-2px, -2px)';
                      e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                      e.currentTarget.style.background = '#EF4444';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0, 0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                      e.currentTarget.style.background = '#FEE2E2';
                      e.currentTarget.style.color = '#EF4444';
                    }}
                  >
                    <X size={16} strokeWidth={3} />
                    CANCEL SEARCH
                  </button>
                </div>
              )}

              {matchState === 'MATCH_FOUND' && (
                <MatchFoundTransition currentUsername={username} opponent={matchData?.opponent} />
              )}

              {matchState === 'ERROR' && (
                <div style={{ padding: '10px 0' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '52px',
                      height: '52px',
                      background: '#FEE2E2',
                      border: '3px solid #EF4444',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                    }}
                  >
                    <AlertCircle size={28} color="#EF4444" />
                  </div>

                  <h2
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.5rem',
                      color: '#0A0A0A',
                      margin: '0 0 6px 0',
                    }}
                  >
                    MATCHMAKING FAILED
                  </h2>

                  <p style={{ color: '#4B5563', fontSize: '14px', fontWeight: 600, margin: '0 0 20px 0' }}>
                    {matchmakingError || 'Unable to find an opponent right now.'}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={joinQueue}
                      style={{
                        padding: '12px 24px',
                        border: '3px solid #0A0A0A',
                        borderRadius: '10px',
                        background: '#FFD60A',
                        color: '#0A0A0A',
                        fontWeight: 800,
                        fontSize: '14px',
                        fontFamily: "'Space Grotesk', sans-serif",
                        cursor: 'pointer',
                        boxShadow: '4px 4px 0 #0A0A0A',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <RotateCcw size={16} />
                      TRY AGAIN
                    </button>
                    <button
                      onClick={resetToIdle}
                      style={{
                        padding: '12px 20px',
                        border: '3px solid #0A0A0A',
                        borderRadius: '10px',
                        background: 'white',
                        color: '#0A0A0A',
                        fontWeight: 800,
                        fontSize: '14px',
                        fontFamily: "'Space Grotesk', sans-serif",
                        cursor: 'pointer',
                        boxShadow: '4px 4px 0 #0A0A0A',
                      }}
                    >
                      BACK TO LOBBY
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Options 2 & 3: CREATE ROOM & JOIN ROOM */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                textAlign: 'left',
                opacity: matchState === 'SEARCHING' || matchState === 'MATCH_FOUND' ? 0.45 : 1,
                pointerEvents: matchState === 'SEARCHING' || matchState === 'MATCH_FOUND' ? 'none' : 'auto',
                transition: 'opacity 0.2s',
              }}
            >
              {/* Option 2: Create Game */}
              <div
                style={{
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  background: '#FFFBF0',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <PlusCircle size={22} color="#FF3CAC" />
                    <h3 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.2rem' }}>
                      Create Room
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                    Host a new multiplayer match and generate a room code to invite a friend.
                  </p>
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={apiLoading || matchState === 'SEARCHING'}
                  style={{
                    width: '100%',
                    padding: '14px',
                    border: '3px solid #0A0A0A',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '15px',
                    cursor: apiLoading ? 'wait' : 'pointer',
                    background: '#FF3CAC',
                    color: 'white',
                    boxShadow: '4px 4px 0 #0A0A0A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translate(0,0)';
                    e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                  }}
                >
                  {apiLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                  {apiLoading ? 'Creating Room...' : 'Create Multiplayer Game'}
                </button>
              </div>

              {/* Option 3: Join Game */}
              <div
                style={{
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  padding: '24px 20px',
                  background: '#F0FDF4',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <LogIn size={22} color="#22C55E" />
                    <h3 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.2rem' }}>
                      Join Room
                    </h3>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
                    Enter an existing 6-character room ID shared by your friend.
                  </p>
                </div>

                <form onSubmit={handleJoinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. ABC123"
                    value={joinInput}
                    onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                    disabled={matchState === 'SEARCHING'}
                    style={{
                      padding: '12px',
                      border: '3px solid #0A0A0A',
                      borderRadius: '8px',
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 800,
                      fontSize: '16px',
                      textAlign: 'center',
                      letterSpacing: '2px',
                      outline: 'none',
                      textTransform: 'uppercase',
                      background: 'white',
                      boxShadow: '2px 2px 0 #0A0A0A',
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!joinInput.trim() || matchState === 'SEARCHING'}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '3px solid #0A0A0A',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: !joinInput.trim() ? 'not-allowed' : 'pointer',
                      background: '#FFD60A',
                      color: '#0A0A0A',
                      boxShadow: '4px 4px 0 #0A0A0A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: "'Space Grotesk', sans-serif",
                      opacity: !joinInput.trim() ? 0.6 : 1,
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (joinInput.trim()) {
                        e.currentTarget.style.transform = 'translate(-2px,-2px)';
                        e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate(0,0)';
                      e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                    }}
                  >
                    <Users size={18} />
                    Join Game Room
                  </button>
                </form>
              </div>
            </div>

            {/* Quick Rules Card */}
            <div
              className="neo-card"
              style={{
                padding: '16px 20px',
                background: '#F5EED8',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <Info size={24} color="#0A0A0A" />
              <div style={{ fontSize: '13px', color: '#0A0A0A', lineHeight: '1.4' }}>
                <strong>Multiplayer Scoring Rules:</strong> Correct move = <strong>+10 pts</strong> | Wrong move ={' '}
                <strong>-5 pts</strong>. Board updates in real-time for both players!
              </div>
            </div>
          </div>
        )}

        {/* ── IN-GAME MULTIPLAYER VIEW (Active Room) ── */}
        {roomId && (
          <div>
            {/* Top Room Banner & Scoreboard */}
            <div
              style={{
                border: '3px solid #0A0A0A',
                borderRadius: '12px',
                background: 'white',
                padding: '16px 20px',
                boxShadow: '6px 6px 0 #0A0A0A',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              {/* Room Code Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={handleExitRoom}
                  style={{
                    padding: '8px 12px',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    background: '#F5EED8',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '2px 2px 0 #0A0A0A',
                  }}
                >
                  <ArrowLeft size={16} /> Exit
                </button>

                <div
                  style={{
                    border: '3px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    background: '#FFD60A',
                    boxShadow: '3px 3px 0 #0A0A0A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>ROOM:</span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 800,
                      fontSize: '1.2rem',
                      letterSpacing: '1px',
                    }}
                  >
                    {roomId}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    title="Copy Room Code"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {copied ? <Check size={18} color="#0A0A0A" /> : <Copy size={18} color="#0A0A0A" />}
                  </button>
                </div>
              </div>

              {/* Player Score Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {playersList.length === 0 ? (
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#6B7280' }}>
                    <Loader2 size={16} className="animate-spin inline mr-2" /> Connecting to room...
                  </div>
                ) : (
                  playersList.map((p) => {
                    const isMe = p === username;
                    const score = playerScores[p];
                    return (
                      <div
                        key={p}
                        style={{
                          border: '2px solid #0A0A0A',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          background: isMe ? '#FF3CAC' : '#FFFBF0',
                          color: isMe ? 'white' : '#0A0A0A',
                          boxShadow: '3px 3px 0 #0A0A0A',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontWeight: 700,
                          fontSize: '14px',
                        }}
                      >
                        <span>
                          {p} {isMe && '(You)'}
                        </span>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            background: isMe ? 'white' : '#FFD60A',
                            color: '#0A0A0A',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            border: '1px solid #0A0A0A',
                          }}
                        >
                          {score} pts
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Waiting for Player 2 Notice */}
            {waitingForOpponent && isConnected && (
              <div
                style={{
                  background: '#FEF3C7',
                  border: '3px solid #0A0A0A',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '4px 4px 0 #0A0A0A',
                }}
              >
                <Loader2 size={22} className="animate-spin" color="#D97706" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 800, fontSize: '14px', margin: 0, color: '#92400E' }}>
                    Waiting for Player 2 to join...
                  </p>
                  <p style={{ fontSize: '12px', margin: 0, color: '#B45309' }}>
                    Share room code <strong style={{ fontFamily: "'Space Mono', monospace" }}>{roomId}</strong> with a friend to begin!
                  </p>
                </div>
              </div>
            )}

            {/* Live Move Feedback Banner */}
            {lastMessage && (
              <div
                style={{
                  border: '3px solid #0A0A0A',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  marginBottom: '20px',
                  background: lastValid === false ? '#FEE2E2' : lastValid === true ? '#DCFCE7' : '#EFF6FF',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {lastValid === false ? (
                    <XCircle size={18} color="#EF4444" />
                  ) : lastValid === true ? (
                    <Zap size={18} color="#22C55E" />
                  ) : (
                    <Info size={18} color="#2563EB" />
                  )}
                  <span>
                    {lastPlayer ? <strong>{lastPlayer}: </strong> : ''}
                    {lastMessage}
                  </span>
                </div>
                {isConnected && (
                  <span
                    style={{
                      fontSize: '11px',
                      background: '#22C55E',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid #0A0A0A',
                    }}
                  >
                    ● LIVE
                  </span>
                )}
              </div>
            )}

            {/* Active Game Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 320px',
                gap: '20px',
                alignItems: 'start',
              }}
              className="game-layout"
            >
              {/* Left Column: Sudoku Board */}
              <div>
                <div style={{ position: 'relative' }}>
                  {(isConnecting || !currentBoard) && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(255,251,240,0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        borderRadius: '12px',
                        border: '4px solid #0A0A0A',
                        boxShadow: '8px 8px 0 #0A0A0A',
                      }}
                    >
                      <Loader2 size={42} className="animate-spin" color="#FF3CAC" />
                      <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, marginTop: '12px' }}>
                        Loading Multiplayer Board...
                      </p>
                    </div>
                  )}

                  {currentBoard && (
                    <SudokuBoard
                      puzzle={initialBoard || currentBoard}
                      currentBoard={currentBoard}
                      selectedRow={selectedRow}
                      selectedCol={selectedCol}
                      cellAnims={EMPTY_OBJ}
                      cellErrors={EMPTY_SET}
                      notes={EMPTY_OBJ}
                      disabled={boardDisabled}
                      onCellClick={handleCellClick}
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Controls & Info */}
              <div>
                <NumberPad
                  onNumber={handleNumberInput}
                  disabled={
                    boardDisabled ||
                    selectedRow === null ||
                    (initialBoard && selectedRow !== null && selectedCol !== null && initialBoard[selectedRow][selectedCol] !== 0)
                  }
                  notesMode={false}
                  remainingCounts={computeRemainingCounts(currentBoard)}
                />

                {/* Info Card */}
                <div className="neo-card" style={{ padding: '16px', background: '#F5EED8', marginTop: '16px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                      color: '#0A0A0A',
                    }}
                  >
                    <Gamepad2 size={16} color="#0A0A0A" /> Multiplayer Controls
                  </div>
                  <ul style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
                    <li>Click cell or use Arrow Keys to select</li>
                    <li>Press 1-9 to submit move to server</li>
                    <li>Backend validates moves in real-time</li>
                    <li>Correct move: +10 points | Wrong move: -5 points</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Game Finish Result Modal ── */}
      {gameFinished && (
        <MultiplayerResultModal
          playerScores={playerScores}
          roomId={roomId || ''}
          currentUsername={username}
          onPlayAgain={handleExitRoom}
          onExit={() => {
            handleExitRoom();
            navigate('/');
          }}
        />
      )}

      {/* Inline styles for responsive layout */}
      <style>{`
        @media (max-width: 768px) {
          .game-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}
