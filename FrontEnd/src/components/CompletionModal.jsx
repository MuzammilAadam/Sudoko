import { Trophy, RotateCcw, BarChart2, Star, Loader2, User, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * CompletionModal — shown when puzzle is solved.
 *
 * Props:
 *  score        - number | null
 *  scoreLoading - boolean
 *  scoreError   - string | null
 *  totalXP      - number | null
 *  level        - number | null
 *  mistakes     - number
 *  timerSeconds - number
 *  difficulty   - string
 *  onNewGame    - () => void
 */
export default function CompletionModal({
  score = null,
  scoreLoading = false,
  scoreError = null,
  totalXP = null,
  level = null,
  mistakes = 0,
  timerSeconds = 0,
  difficulty = 'MEDIUM',
  onNewGame,
}) {
  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const ss = String(timerSeconds % 60).padStart(2, '0');
  const perfect = mistakes === 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        className="neo-card animate-bounce-in"
        style={{
          background: 'white',
          padding: '36px 28px',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '3.5px solid #0A0A0A',
          boxShadow: '8px 8px 0 #0A0A0A',
        }}
      >
        {/* Top colorful stripe decoration */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'repeating-linear-gradient(90deg, #FF3CAC 0 20px, #FFD60A 20px 40px, #2563EB 40px 60px, #22C55E 60px 80px)',
          }}
        />

        {/* Trophy Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            border: '3.5px solid #0A0A0A',
            borderRadius: '50%',
            background: '#FFD60A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '5px 5px 0 #0A0A0A',
          }}
        >
          <Trophy size={40} color="#0A0A0A" />
        </div>

        <h2
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '1.65rem',
            marginBottom: '4px',
            color: '#0A0A0A',
            textTransform: 'uppercase',
            letterSpacing: '-0.5px',
          }}
        >
          {perfect ? 'PERFECT GAME!' : 'PUZZLE SOLVED!'}
        </h2>

        <p style={{ color: '#6B7280', marginBottom: '20px', fontWeight: 600, fontSize: '13.5px' }}>
          {perfect
            ? 'Completed the puzzle with zero mistakes!'
            : `Completed with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}.`}
        </p>

        {/* Final Score Banner */}
        <div
          style={{
            background: '#FFD60A',
            border: '3px solid #0A0A0A',
            borderRadius: '12px',
            padding: '14px',
            boxShadow: '4px 4px 0 #0A0A0A',
            marginBottom: '16px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#0A0A0A',
              opacity: 0.85,
              marginBottom: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
            }}
          >
            <Star size={14} fill="#0A0A0A" color="#0A0A0A" /> FINAL SCORE
          </p>

          {scoreLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '6px 0' }}>
              <Loader2 size={24} className="animate-spin" color="#0A0A0A" />
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.1rem' }}>
                Calculating Score...
              </span>
            </div>
          ) : scoreError ? (
            <p style={{ color: '#DC2626', fontWeight: 700, fontSize: '13px', margin: '4px 0 0' }}>
              ⚠ Score saved locally ({scoreError})
            </p>
          ) : (
            <p
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '2.4rem',
                color: '#0A0A0A',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              {score !== null && score !== undefined ? score.toLocaleString() : 'N/A'}
            </p>
          )}
        </div>

        {/* XP & Level Status Bar if available */}
        {(totalXP !== null || level !== null) && !scoreLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 14px',
              background: '#FFFBF0',
              border: '2px solid #0A0A0A',
              borderRadius: '8px',
              boxShadow: '2px 2px 0 #0A0A0A',
              marginBottom: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={16} color="#FF3CAC" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A0A0A' }}>
                Total XP: {totalXP !== null ? totalXP.toLocaleString() : '—'}
              </span>
            </div>
            {level !== null && (
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  fontWeight: 800,
                  background: '#FFD60A',
                  border: '1.5px solid #0A0A0A',
                  borderRadius: '4px',
                  padding: '2px 6px',
                }}
              >
                LVL {level}
              </span>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            justifyContent: 'center',
            marginBottom: '22px',
            flexWrap: 'wrap',
          }}
        >
          <StatBadge label="Time" value={`${mm}:${ss}`} bg="#F0FDF4" />
          <StatBadge label="Mistakes" value={`${mistakes}/3`} bg={perfect ? '#F0FDF4' : '#FEF2F2'} />
          <StatBadge label="Difficulty" value={difficulty} bg="#EFF6FF" />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            id="completion-play-again-btn"
            onClick={onNewGame}
            style={{
              width: '100%',
              padding: '14px',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              background: '#FF3CAC',
              color: 'white',
              boxShadow: '4px 4px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'transform 0.1s, box-shadow 0.1s',
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
            <RotateCcw size={18} />
            Play Again
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/my-scores"
              style={{
                flex: 1,
                padding: '12px',
                border: '3px solid #0A0A0A',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                background: '#FFD60A',
                color: '#0A0A0A',
                boxShadow: '3px 3px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
              }}
            >
              <User size={16} />
              My Profile
            </Link>
            <Link
              to="/leaderboard"
              style={{
                flex: 1,
                padding: '12px',
                border: '3px solid #0A0A0A',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                background: 'white',
                color: '#0A0A0A',
                boxShadow: '3px 3px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px, -2px)';
                e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
              }}
            >
              <BarChart2 size={16} />
              Leaderboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, bg }) {
  return (
    <div
      style={{
        border: '2.5px solid #0A0A0A',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '3px 3px 0 #0A0A0A',
        background: bg,
        flex: 1,
        minWidth: '85px',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 800, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
        {label}
      </p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1.1rem', margin: 0, color: '#0A0A0A' }}>
        {value}
      </p>
    </div>
  );
}
