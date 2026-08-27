import { Trophy, RotateCcw, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * CompletionModal — shown when puzzle is solved.
 * Props:
 *  mistakes     - number
 *  timerSeconds - number
 *  difficulty   - string
 *  onNewGame    - () => void
 */
export default function CompletionModal({ mistakes = 0, timerSeconds = 0, difficulty = 'MEDIUM', onNewGame }) {
  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const ss = String(timerSeconds % 60).padStart(2, '0');
  const perfect = mistakes === 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.75)',
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
          padding: '40px 32px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Confetti dots decoration */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'repeating-linear-gradient(90deg, #FF3CAC 0 20px, #FFD60A 20px 40px, #2563EB 40px 60px, #22C55E 60px 80px)' }} />

        {/* Trophy Icon */}
        <div
          style={{
            width: '88px',
            height: '88px',
            border: '4px solid #0A0A0A',
            borderRadius: '50%',
            background: '#FFD60A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '5px 5px 0 #0A0A0A',
          }}
        >
          <Trophy size={44} color="#0A0A0A" />
        </div>

        <h2
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: '1.8rem',
            marginBottom: '4px',
          }}
        >
          {perfect ? '🎉 PERFECT!' : '✅ SOLVED!'}
        </h2>

        <p style={{ color: '#6B7280', marginBottom: '24px', fontWeight: 500 }}>
          {perfect
            ? 'Amazing! You completed the puzzle without any mistakes!'
            : `You solved the puzzle with ${mistakes} mistake${mistakes !== 1 ? 's' : ''}.`}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <StatBadge label="Time" value={`${mm}:${ss}`} bg="#F0FDF4" />
          <StatBadge label="Mistakes" value={`${mistakes}/3`} bg={perfect ? '#F0FDF4' : '#FEF2F2'} />
          <StatBadge label="Difficulty" value={difficulty} bg="#EFF6FF" />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onNewGame}
            style={{
              flex: 1,
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
              gap: '6px',
              transition: 'all 0.1s',
            }}
          >
            <RotateCcw size={16} />
            New Game
          </button>
          <Link
            to="/leaderboard"
            style={{
              flex: 1,
              padding: '14px',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              background: '#FFD60A',
              color: '#0A0A0A',
              boxShadow: '4px 4px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none',
              transition: 'all 0.1s',
            }}
          >
            <BarChart2 size={16} />
            Leaderboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ label, value, bg }) {
  return (
    <div
      style={{
        border: '3px solid #0A0A0A',
        borderRadius: '10px',
        padding: '12px 18px',
        boxShadow: '4px 4px 0 #0A0A0A',
        background: bg,
        minWidth: '90px',
      }}
    >
      <p style={{ fontSize: '10px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.2rem' }}>{value}</p>
    </div>
  );
}
