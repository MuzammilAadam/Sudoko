import { Skull, RotateCcw } from 'lucide-react';

/**
 * GameOverModal — fullscreen overlay shown when the player runs out of chances.
 * Props:
 *  mistakes    - number
 *  timerSeconds - number
 *  onNewGame   - () => void
 */
export default function GameOverModal({ mistakes = 3, timerSeconds = 0, onNewGame }) {
  const mm = String(Math.floor(timerSeconds / 60)).padStart(2, '0');
  const ss = String(timerSeconds % 60).padStart(2, '0');

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
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            border: '4px solid #0A0A0A',
            borderRadius: '50%',
            background: '#EF4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '5px 5px 0 #0A0A0A',
          }}
        >
          <Skull size={40} color="white" />
        </div>

        <h2
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: '2rem',
            marginBottom: '8px',
            color: '#EF4444',
          }}
        >
          GAME OVER
        </h2>

        <p style={{ color: '#6B7280', marginBottom: '24px', fontWeight: 500 }}>
          You made <strong style={{ color: '#0A0A0A' }}>{mistakes} mistake{mistakes !== 1 ? 's' : ''}</strong> and ran out of chances.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              padding: '12px 20px',
              boxShadow: '4px 4px 0 #0A0A0A',
              background: '#FEE2E2',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Mistakes</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.5rem', color: '#EF4444' }}>{mistakes}/3</p>
          </div>
          <div
            style={{
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              padding: '12px 20px',
              boxShadow: '4px 4px 0 #0A0A0A',
              background: '#F5EED8',
            }}
          >
            <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Time</p>
            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.5rem' }}>{mm}:{ss}</p>
          </div>
        </div>

        <button
          onClick={onNewGame}
          style={{
            width: '100%',
            padding: '14px',
            border: '3px solid #0A0A0A',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '16px',
            cursor: 'pointer',
            background: '#FF3CAC',
            color: 'white',
            boxShadow: '5px 5px 0 #0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.1s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0,0)';
            e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
          }}
        >
          <RotateCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
