import { useState, useEffect, useCallback, useRef } from 'react';
import SudokuBoard from '../components/SudokuBoard';
import DifficultySelector from '../components/DifficultySelector';
import GameInfo from '../components/GameInfo';
import NumberPad from '../components/NumberPad';
import GameControls from '../components/GameControls';
import GameOverModal from '../components/GameOverModal';
import CompletionModal from '../components/CompletionModal';
import AchievementModal from '../components/AchievementModal';
import LevelUpModal from '../components/LevelUpModal';
import { createGame, makeMove, submitScore } from '../services/sudokuApi';
import { getUserLevel, storeUserXPAndLevel } from '../services/authApi';
import { Loader2, AlertCircle, Zap } from 'lucide-react';

// ─── Initial state ───────────────────────────────────────────
const INITIAL_STATE = {
  gameId: null,
  puzzle: null,        // number[][] original puzzle (determines given cells)
  currentBoard: null,  // number[][] currently displayed board
  selectedRow: null,
  selectedCol: null,
  mistakes: 0,
  remainingChances: 3,
  gameStatus: 'IDLE',  // IDLE | ACTIVE | PAUSED | COMPLETED | GAME_OVER
  timerSeconds: 0,
  difficulty: 'MEDIUM',
  notesMode: false,
  paused: false,
  // Per-cell state
  cellAnims: {},       // { 'r-c': 'animate-pop' | 'animate-shake' }
  cellErrors: new Set(),
  notes: {},           // { 'r-c': Set<number> }
  history: [],         // array of previousBoard snapshots for undo
};

// Compute remaining count for each digit 1-9 on a board
function computeRemainingCounts(board) {
  if (!board) return {};
  const counts = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
  board.forEach((row) => row.forEach((v) => { if (v !== 0) counts[v]--; }));
  return counts;
}

export default function GamePage() {
  const [state, setState] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submittedScore, setSubmittedScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newLevelReached, setNewLevelReached] = useState(null);
  const [gameXP, setGameXP] = useState(null);
  const [gameLevel, setGameLevel] = useState(null);
  const timerRef = useRef(null);

  // ─── Timer management ────────────────────────────────────────
  useEffect(() => {
    if (state.gameStatus === 'ACTIVE' && !state.paused) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({ ...prev, timerSeconds: prev.timerSeconds + 1 }));
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [state.gameStatus, state.paused]);

  // ─── Score submission on game completion ────────────────────
  useEffect(() => {
    if (state.gameStatus === 'COMPLETED' && submittedScore === null && !scoreLoading && !scoreError) {
      let isMounted = true;
      setScoreLoading(true);
      setScoreError(null);

      submitScore({
        difficulty: state.difficulty,
        mistakes: state.mistakes,
        timeTaken: state.timerSeconds,
      })
        .then((data) => {
          if (isMounted) {
            const finalScore = data?.score ?? data?.finalScore ?? data?.points ?? 0;
            setSubmittedScore(finalScore);
            setScoreLoading(false);

            // Backend is the source of truth for XP, level, and achievements
            const prevLevel = getUserLevel();
            const newTotalXP = data?.totalXP !== undefined ? data.totalXP : null;
            const newLevel = data?.level !== undefined ? data.level : null;

            if (newTotalXP !== null || newLevel !== null) {
              storeUserXPAndLevel(newTotalXP, newLevel);
              setGameXP(newTotalXP);
              setGameLevel(newLevel);
            }

            const leveledUp = newLevel && newLevel > prevLevel;
            if (leveledUp) {
              setNewLevelReached(newLevel);
            }

            // Unlocked achievements notification
            const newAchList = data?.newAchievements || data?.unlockedAchievements || [];
            if (Array.isArray(newAchList) && newAchList.length > 0) {
              setUnlockedAchievements(newAchList);
              setShowAchievementModal(true);
            } else if (leveledUp) {
              setShowLevelUpModal(true);
            }
          }
        })
        .catch((err) => {
          if (isMounted) {
            setScoreError(err.message || 'Could not save score');
            setScoreLoading(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [state.gameStatus, state.difficulty, state.mistakes, state.timerSeconds, submittedScore, scoreLoading, scoreError]);

  // ─── Create new game ─────────────────────────────────────────
  const handleNewGame = useCallback(async (difficultyOverride) => {
    setLoading(true);
    setApiError(null);
    setSubmittedScore(null);
    setScoreLoading(false);
    setScoreError(null);
    setUnlockedAchievements([]);
    setShowAchievementModal(false);
    setShowLevelUpModal(false);
    setNewLevelReached(null);
    setGameXP(null);
    setGameLevel(null);
    const diff = difficultyOverride || state.difficulty;
    try {
      const data = await createGame(diff);
      setState({
        ...INITIAL_STATE,
        gameId: data.gameId,
        puzzle: data.puzzle,
        currentBoard: data.currentBoard,
        mistakes: data.mistakes ?? 0,
        remainingChances: data.remainingChances ?? 3,
        gameStatus: 'ACTIVE',
        difficulty: diff,
      });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state.difficulty]);

  // ─── Difficulty change ───────────────────────────────────────
  const handleDifficultyChange = (diff) => {
    setState((prev) => ({ ...prev, difficulty: diff }));
  };

  // ─── Cell selection ──────────────────────────────────────────
  const handleCellClick = useCallback((row, col) => {
    if (state.gameStatus !== 'ACTIVE' || state.paused) return;
    setState((prev) => ({ ...prev, selectedRow: row, selectedCol: col }));
  }, [state.gameStatus, state.paused]);

  // ─── Number input ────────────────────────────────────────────
  const handleNumber = useCallback(async (num) => {
    const { gameId, selectedRow: row, selectedCol: col, puzzle, currentBoard, gameStatus, paused, notesMode } = state;

    if (!gameId || row === null || col === null) return;
    if (gameStatus !== 'ACTIVE' || paused) return;
    if (puzzle[row][col] !== 0) return; // given cell — not editable

    const key = `${row}-${col}`;

    // ── Notes mode: toggle locally without API ─────────────────
    if (notesMode) {
      setState((prev) => {
        const prevNotes = new Set(prev.notes[key] || []);
        if (prevNotes.has(num)) prevNotes.delete(num);
        else prevNotes.add(num);
        return { ...prev, notes: { ...prev.notes, [key]: prevNotes } };
      });
      return;
    }

    // ── Snapshot for undo ──────────────────────────────────────
    const snapshot = currentBoard.map((r) => [...r]);

    setLoading(true);
    try {
      // BUG: Updating the board state locally before calling the backend validation API causes the backend to see the number already present at (row, col), leading to false duplicate errors during row/col/3x3 grid checks.
      // FIX: Send current board, row, col, and value to backend API FIRST. Update the frontend board ONLY after backend returns response.valid === true. If invalid, keep the board unchanged and decrease remaining chances.
      const response = await makeMove(gameId, row, col, num);

      if (response.valid) {
        // Success: update board, play pop animation, clear any error highlight
        setState((prev) => ({
          ...prev,
          currentBoard: response.board,
          mistakes: response.mistakes,
          remainingChances: response.remainingChances,
          gameStatus: response.completed ? 'COMPLETED' : response.gameOver ? 'GAME_OVER' : 'ACTIVE',
          cellAnims: { ...prev.cellAnims, [key]: 'animate-pop' },
          cellErrors: (() => {
            const s = new Set(prev.cellErrors);
            s.delete(key);
            return s;
          })(),
          history: [...prev.history, snapshot],
          notes: { ...prev.notes, [key]: new Set() }, // clear notes on placed value
        }));
      } else {
        // Wrong move: shake, add error highlight, update mistakes/chances without modifying currentBoard
        setState((prev) => ({
          ...prev,
          mistakes: response.mistakes,
          remainingChances: response.remainingChances,
          gameStatus: response.gameOver ? 'GAME_OVER' : 'ACTIVE',
          cellAnims: { ...prev.cellAnims, [key]: 'animate-shake' },
          cellErrors: (() => {
            const s = new Set(prev.cellErrors);
            s.add(key);
            return s;
          })(),
        }));

        // Auto-clear error highlight after 1.5 s
        setTimeout(() => {
          setState((prev) => {
            const s = new Set(prev.cellErrors);
            s.delete(key);
            return { ...prev, cellErrors: s };
          });
        }, 1500);
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  // ─── Erase ───────────────────────────────────────────────────
  const handleErase = useCallback(() => {
    const { selectedRow: row, selectedCol: col, puzzle, currentBoard, gameStatus } = state;
    if (row === null || col === null || gameStatus !== 'ACTIVE') return;
    if (puzzle[row][col] !== 0) return; // can't erase given cells

    const key = `${row}-${col}`;
    const snapshot = currentBoard.map((r) => [...r]);
    const newBoard = currentBoard.map((r) => [...r]);
    newBoard[row][col] = 0;

    setState((prev) => ({
      ...prev,
      currentBoard: newBoard,
      history: [...prev.history, snapshot],
      notes: { ...prev.notes, [key]: new Set() },
      cellErrors: (() => { const s = new Set(prev.cellErrors); s.delete(key); return s; })(),
    }));
  }, [state]);

  // ─── Undo ────────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    setState((prev) => {
      if (prev.history.length === 0) return prev;
      const history = [...prev.history];
      const previousBoard = history.pop();
      return { ...prev, currentBoard: previousBoard, history };
    });
  }, []);

  // ─── Notes toggle ────────────────────────────────────────────
  const handleNotes = useCallback(() => {
    setState((prev) => ({ ...prev, notesMode: !prev.notesMode }));
  }, []);

  // ─── Hint (placeholder) ──────────────────────────────────────
  const handleHint = useCallback(() => {
    // TODO: connect to /api/games/:gameId/hint when backend supports it
    alert('💡 Hint coming soon! The backend endpoint will reveal a safe cell.');
  }, []);

  // ─── Pause ───────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      paused: !prev.paused,
      gameStatus: !prev.paused ? 'PAUSED' : 'ACTIVE',
    }));
  }, []);

  // ─── Keyboard input ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9) handleNumber(num);
      if (e.key === 'Backspace' || e.key === 'Delete') handleErase();
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) handleUndo();
      if (e.key === 'ArrowUp') setState((p) => ({ ...p, selectedRow: p.selectedRow !== null ? Math.max(0, p.selectedRow - 1) : 0 }));
      if (e.key === 'ArrowDown') setState((p) => ({ ...p, selectedRow: p.selectedRow !== null ? Math.min(8, p.selectedRow + 1) : 0 }));
      if (e.key === 'ArrowLeft') setState((p) => ({ ...p, selectedCol: p.selectedCol !== null ? Math.max(0, p.selectedCol - 1) : 0 }));
      if (e.key === 'ArrowRight') setState((p) => ({ ...p, selectedCol: p.selectedCol !== null ? Math.min(8, p.selectedCol + 1) : 0 }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNumber, handleErase, handleUndo]);

  const {
    puzzle, currentBoard, selectedRow, selectedCol,
    mistakes, remainingChances, timerSeconds, difficulty,
    gameStatus, notesMode, paused, cellAnims, cellErrors, notes,
  } = state;

  const boardDisabled = gameStatus === 'GAME_OVER' || gameStatus === 'COMPLETED' || paused;
  const controlsDisabled = gameStatus === 'GAME_OVER' || gameStatus === 'COMPLETED';
  const remainingCounts = computeRemainingCounts(currentBoard);

  return (
    <main style={{ minHeight: '100vh', padding: '24px 16px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── API Error banner ── */}
        {apiError && (
          <div
            style={{
              background: '#FEE2E2',
              border: '3px solid #EF4444',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '4px 4px 0 #EF4444',
              fontWeight: 600,
            }}
          >
            <AlertCircle size={18} color="#EF4444" />
            <span style={{ flex: 1 }}>{apiError}</span>
            <button
              onClick={() => setApiError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Classic Game Setup Screen (IDLE state) ── */}
        {gameStatus === 'IDLE' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div
              style={{
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => window.history.back()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '8px',
                  background: 'white',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '3px 3px 0 #0A0A0A',
                }}
              >
                ← Back to Home
              </button>

              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 800,
                  fontSize: '12px',
                  background: '#FFD60A',
                  border: '2px solid #0A0A0A',
                  borderRadius: '20px',
                  padding: '3px 12px',
                  boxShadow: '2px 2px 0 #0A0A0A',
                }}
              >
                CLASSIC MODE
              </span>
            </div>

            <div
              className="neo-card"
              style={{
                padding: '44px 32px',
                textAlign: 'center',
                marginBottom: '24px',
                background: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  border: '3.5px solid #0A0A0A',
                  background: '#FF3CAC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  fontSize: '2.2rem',
                }}
              >
                🎯
              </div>

              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  marginBottom: '8px',
                  color: '#0A0A0A',
                }}
              >
                Choose Difficulty
              </h1>
              <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px', fontWeight: 600 }}>
                Select your preferred challenge level to generate a new puzzle
              </p>

              {/* Grid of difficulty buttons */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                  gap: '12px',
                  maxWidth: '640px',
                  margin: '0 auto 36px',
                }}
              >
                {[
                  { name: 'EASY', label: 'Easy', color: '#22C55E', hint: 'Beginners' },
                  { name: 'MEDIUM', label: 'Medium', color: '#3B82F6', hint: 'Standard' },
                  { name: 'HARD', label: 'Hard', color: '#F97316', hint: 'Challenging' },
                  { name: 'EXPERT', label: 'Expert', color: '#EF4444', hint: 'Advanced' },
                  { name: 'MASTER', label: 'Master', color: '#7C3AED', hint: 'Very Hard' },
                  { name: 'EXTREME', label: 'Extreme', color: '#0A0A0A', textColor: '#FFD60A', hint: 'Maximum' },
                ].map((item) => {
                  const active = difficulty === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleDifficultyChange(item.name)}
                      style={{
                        padding: '14px 10px',
                        border: '3px solid #0A0A0A',
                        borderRadius: '10px',
                        fontWeight: 900,
                        fontSize: '14px',
                        cursor: 'pointer',
                        background: active ? item.color : 'white',
                        color: active ? (item.textColor || 'white') : '#0A0A0A',
                        boxShadow: active ? '5px 5px 0 #0A0A0A' : '3px 3px 0 #0A0A0A',
                        transform: active ? 'translate(-2px, -2px)' : 'none',
                        transition: 'all 0.1s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                      }}
                    >
                      <span>{item.label}</span>
                      <span style={{ fontSize: '10px', opacity: 0.8, fontWeight: 700 }}>{item.hint}</span>
                    </button>
                  );
                })}
              </div>

              {/* Start Game Action */}
              <button
                id="start-classic-game-btn"
                onClick={() => handleNewGame(difficulty)}
                disabled={loading}
                style={{
                  padding: '18px 56px',
                  border: '3.5px solid #0A0A0A',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '20px',
                  cursor: loading ? 'wait' : 'pointer',
                  background: '#FF3CAC',
                  color: 'white',
                  boxShadow: '6px 6px 0 #0A0A0A',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-3px,-3px)';
                  e.currentTarget.style.boxShadow = '9px 9px 0 #0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0,0)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                }}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Zap size={24} />}
                {loading ? 'Generating Puzzle...' : 'Start Game'}
              </button>
            </div>
          </div>
        )}

        {/* ── Active Game Layout ── */}
        {(gameStatus !== 'IDLE') && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 320px',
              gap: '20px',
              alignItems: 'start',
            }}
            className="game-layout"
          >
            {/* Left: board area */}
            <div>
              {/* Difficulty selector (compact during game) */}
              <DifficultySelector
                selected={difficulty}
                onChange={(d) => { handleDifficultyChange(d); handleNewGame(d); }}
                disabled={loading}
              />

              {/* Game info */}
              <GameInfo
                mistakes={mistakes}
                remainingChances={remainingChances}
                timerSeconds={timerSeconds}
                difficulty={difficulty}
                gameStatus={gameStatus}
                paused={paused}
              />

              {/* Board */}
              <div style={{ position: 'relative' }}>
                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(255,251,240,0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      borderRadius: '12px',
                    }}
                  >
                    <Loader2 size={40} className="animate-spin" color="#FF3CAC" />
                  </div>
                )}

                {paused ? (
                  <div
                    style={{
                      border: '4px solid #0A0A0A',
                      borderRadius: '12px',
                      boxShadow: '8px 8px 0 #0A0A0A',
                      aspectRatio: '1',
                      width: '100%',
                      maxWidth: '520px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#F5EED8',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '4rem' }}>⏸</p>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.5rem' }}>PAUSED</p>
                      <p style={{ color: '#6B7280', marginTop: '8px' }}>Click Resume to continue</p>
                    </div>
                  </div>
                ) : (
                  currentBoard && puzzle && (
                    <SudokuBoard
                      puzzle={puzzle}
                      currentBoard={currentBoard}
                      selectedRow={selectedRow}
                      selectedCol={selectedCol}
                      cellAnims={cellAnims}
                      cellErrors={cellErrors}
                      notes={notes}
                      disabled={boardDisabled}
                      onCellClick={handleCellClick}
                    />
                  )
                )}
              </div>
            </div>

            {/* Right: controls panel */}
            <div>
              <NumberPad
                onNumber={handleNumber}
                disabled={boardDisabled || selectedRow === null || (puzzle && selectedRow !== null && selectedCol !== null && puzzle[selectedRow][selectedCol] !== 0)}
                notesMode={notesMode}
                remainingCounts={remainingCounts}
              />

              <GameControls
                onUndo={handleUndo}
                onErase={handleErase}
                onNotes={handleNotes}
                onHint={handleHint}
                onPause={handlePause}
                onNewGame={() => handleNewGame(difficulty)}
                notesActive={notesMode}
                paused={paused}
                disabled={controlsDisabled}
              />

              {/* Quick tips card */}
              <div
                className="neo-card"
                style={{ padding: '16px', background: '#F5EED8' }}
              >
                <p style={{ fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                  💡 Tips
                </p>
                <ul style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.8', paddingLeft: '16px', margin: 0 }}>
                  <li>Use arrow keys to navigate cells</li>
                  <li>Press 1-9 to place numbers</li>
                  <li>Ctrl+Z to undo</li>
                  <li>Delete/Backspace to erase</li>
                  <li>Toggle Notes to pencil in candidates</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {gameStatus === 'GAME_OVER' && (
        <GameOverModal
          mistakes={mistakes}
          timerSeconds={timerSeconds}
          onNewGame={() => handleNewGame(difficulty)}
        />
      )}

      {/* Achievement Unlocked Notification Modal */}
      {showAchievementModal && unlockedAchievements.length > 0 && (
        <AchievementModal
          achievements={unlockedAchievements}
          onClose={() => {
            setShowAchievementModal(false);
            if (newLevelReached) {
              setShowLevelUpModal(true);
            }
          }}
        />
      )}

      {/* Level Up Notification Modal */}
      {showLevelUpModal && newLevelReached && (
        <LevelUpModal
          newLevel={newLevelReached}
          onClose={() => {
            setShowLevelUpModal(false);
          }}
        />
      )}

      {gameStatus === 'COMPLETED' && (
        <CompletionModal
          score={submittedScore}
          scoreLoading={scoreLoading}
          scoreError={scoreError}
          totalXP={gameXP}
          level={gameLevel}
          mistakes={mistakes}
          timerSeconds={timerSeconds}
          difficulty={difficulty}
          onNewGame={() => handleNewGame(difficulty)}
        />
      )}

      {/* Responsive layout styles injected inline */}
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
