import Timer from './Timer';
import ChancesDisplay from './ChancesDisplay';
import { Clock, AlertTriangle, Zap } from 'lucide-react';

const DIFFICULTY_COLORS = {
  EASY: '#22C55E',
  MEDIUM: '#3B82F6',
  HARD: '#F97316',
  EXPERT: '#EF4444',
  MASTER: '#7C3AED',
  EXTREME: '#0A0A0A',
};

/**
 * GameInfo — top info bar showing mistakes, chances, timer, difficulty.
 * Props:
 *  mistakes         - number
 *  remainingChances - number
 *  timerSeconds     - number
 *  difficulty       - string
 *  gameStatus       - 'IDLE' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'GAME_OVER'
 *  paused           - boolean
 */
export default function GameInfo({
  mistakes = 0,
  remainingChances = 3,
  timerSeconds = 0,
  difficulty = 'MEDIUM',
  gameStatus = 'IDLE',
  paused = false,
}) {
  const diffColor = DIFFICULTY_COLORS[difficulty] || '#3B82F6';

  return (
    <div
      className="neo-card"
      style={{ padding: '16px', marginBottom: '12px' }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Difficulty badge */}
        <div
          style={{
            background: diffColor,
            color: difficulty === 'EXTREME' ? '#FFD60A' : 'white',
            border: '2px solid #0A0A0A',
            borderRadius: '6px',
            padding: '4px 12px',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '1px',
            boxShadow: '2px 2px 0 #0A0A0A',
          }}
        >
          {difficulty}
        </div>

        {/* Mistakes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={16} color="#EF4444" />
          <span style={{ fontWeight: 700, fontSize: '13px' }}>
            Mistakes:{' '}
            <span style={{ color: mistakes > 0 ? '#EF4444' : '#0A0A0A' }}>
              {mistakes}/3
            </span>
          </span>
        </div>

        {/* Chances */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ChancesDisplay remaining={remainingChances} />
        </div>

        {/* Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={16} />
          {paused ? (
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '1rem',
                color: '#9CA3AF',
              }}
            >
              --:--
            </span>
          ) : (
            <Timer seconds={timerSeconds} />
          )}
        </div>

        {/* Status */}
        {gameStatus === 'PAUSED' && (
          <span
            style={{
              background: '#FFD60A',
              border: '2px solid #0A0A0A',
              borderRadius: '6px',
              padding: '3px 10px',
              fontWeight: 700,
              fontSize: '12px',
              boxShadow: '2px 2px 0 #0A0A0A',
            }}
          >
            ⏸ PAUSED
          </span>
        )}
      </div>
    </div>
  );
}
