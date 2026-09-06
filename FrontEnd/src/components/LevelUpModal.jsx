import { Zap, ArrowRight } from 'lucide-react';
import { getLevelTitle } from './LevelProgress';

/**
 * Small Professional Level-Up Modal
 *
 * Props:
 *  newLevel: number
 *  onClose: () => void
 */
export default function LevelUpModal({ newLevel = 2, onClose }) {
  const title = getLevelTitle(newLevel);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 10, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 115,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-up-modal-title"
    >
      <div
        className="neo-card"
        style={{
          background: 'white',
          border: '3.5px solid #0A0A0A',
          borderRadius: '16px',
          boxShadow: '8px 8px 0 #0A0A0A',
          maxWidth: '380px',
          width: '100%',
          textAlign: 'center',
          padding: '32px 24px 24px',
          position: 'relative',
          overflow: 'hidden',
          animation: 'levelUpPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top Accent Stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#FF3CAC',
            borderBottom: '2px solid #0A0A0A',
          }}
        />

        {/* Level Up Badge Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '16px',
            border: '3px solid #0A0A0A',
            background: '#FFD60A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '4px 4px 0 #0A0A0A',
          }}
        >
          <Zap size={34} color="#0A0A0A" />
        </div>

        {/* Tag */}
        <span
          style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#FF3CAC',
            marginBottom: '4px',
          }}
        >
          RANK UPGRADE
        </span>

        {/* Title */}
        <h2
          id="level-up-modal-title"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '1.6rem',
            color: '#0A0A0A',
            margin: '0 0 6px',
            lineHeight: 1.2,
          }}
        >
          LEVEL UP
        </h2>

        {/* Body message */}
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14.5px',
            color: '#4B5563',
            margin: '0 0 16px',
            fontWeight: 600,
          }}
        >
          You reached <strong style={{ color: '#0A0A0A' }}>Level {newLevel}</strong>.
        </p>

        {/* New Title Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '6px 14px',
            border: '2px solid #0A0A0A',
            borderRadius: '8px',
            background: '#FFFBF0',
            fontSize: '13px',
            fontWeight: 800,
            color: '#0A0A0A',
            boxShadow: '2px 2px 0 #0A0A0A',
            marginBottom: '24px',
          }}
        >
          Title unlocked: <span style={{ color: '#FF3CAC' }}>{title}</span>
        </div>

        {/* Continue button */}
        <button
          id="level-up-continue-btn"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px 18px',
            border: '2.5px solid #0A0A0A',
            borderRadius: '8px',
            background: '#FFD60A',
            color: '#0A0A0A',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 #0A0A0A',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
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
          <span>Continue</span>
          <ArrowRight size={15} />
        </button>
      </div>

      <style>{`
        @keyframes levelUpPop {
          from {
            transform: scale(0.9) translateY(12px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
