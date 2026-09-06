import { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Zap,
  Target,
  Flame,
  Swords,
  Footprints,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

function getModalIcon(code = '', name = '', size = 38) {
  const key = `${code} ${name}`.toUpperCase();
  if (key.includes('FIRST_WIN') || key.includes('FIRST VICTORY')) return <Trophy size={size} color="#0A0A0A" />;
  if (key.includes('PERFECT') || key.includes('ZERO MISTAKE')) return <Sparkles size={size} color="#0A0A0A" />;
  if (key.includes('EXTREME')) return <Zap size={size} color="#0A0A0A" />;
  if (key.includes('MASTER')) return <Award size={size} color="#0A0A0A" />;
  if (key.includes('HARD') || key.includes('SHARP MIND')) return <Target size={size} color="#0A0A0A" />;
  if (key.includes('STREAK') || key.includes('FIRE')) return <Flame size={size} color="#0A0A0A" />;
  if (key.includes('MULTI') || key.includes('ARENA')) return <Swords size={size} color="#0A0A0A" />;
  if (key.includes('FIRST_GAME') || key.includes('FIRST STEP')) return <Footprints size={size} color="#0A0A0A" />;
  return <Award size={size} color="#0A0A0A" />;
}

const RARITY_COLORS = {
  COMMON: { bg: '#F5EED8', text: '#0A0A0A', badgeBg: '#FFFBF0' },
  RARE: { bg: '#DBEAFE', text: '#1E40AF', badgeBg: '#BFDBFE' },
  EPIC: { bg: '#F3E8FF', text: '#6B21A8', badgeBg: '#E9D5FF' },
  LEGENDARY: { bg: '#FEF08A', text: '#854D0E', badgeBg: '#FDE047' },
};

/**
 * Polished Achievement Unlocked Notification Modal
 *
 * Props:
 *  achievements: Array<{ name: string, description: string, xpReward: number, rarity: string, code?: string }>
 *  onClose: () => void
 */
export default function AchievementModal({ achievements = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!achievements || achievements.length === 0) return null;

  const current = achievements[currentIndex] || achievements[0];
  const isLast = currentIndex >= achievements.length - 1;

  const rarityKey = (current.rarity || 'COMMON').toUpperCase();
  const theme = RARITY_COLORS[rarityKey] || RARITY_COLORS.COMMON;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 10, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 110,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievement-modal-title"
    >
      <div
        className="neo-card"
        style={{
          background: 'white',
          border: '3.5px solid #0A0A0A',
          borderRadius: '16px',
          boxShadow: '8px 8px 0 #0A0A0A',
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center',
          padding: '36px 28px 28px',
          position: 'relative',
          overflow: 'hidden',
          animation: 'achievementSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top colored accent stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: '#FFD60A',
            borderBottom: '2px solid #0A0A0A',
          }}
        />

        {/* Counter tag if multiple achievements unlocked */}
        {achievements.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '14px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: "'Space Mono', monospace",
              background: '#F5EED8',
              border: '1.5px solid #0A0A0A',
              borderRadius: '4px',
              padding: '2px 8px',
            }}
          >
            {currentIndex + 1} of {achievements.length}
          </div>
        )}

        {/* Header Ribbon */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFD60A',
            border: '2px solid #0A0A0A',
            borderRadius: '20px',
            padding: '4px 14px',
            fontSize: '11px',
            fontWeight: 900,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            boxShadow: '2px 2px 0 #0A0A0A',
          }}
        >
          <CheckCircle2 size={14} color="#0A0A0A" /> ACHIEVEMENT UNLOCKED
        </div>

        {/* Achievement Badge Icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            border: '3.5px solid #0A0A0A',
            background: theme.badgeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '5px 5px 0 #0A0A0A',
          }}
        >
          {getModalIcon(current.code, current.name, 40)}
        </div>

        {/* Achievement Name */}
        <h2
          id="achievement-modal-title"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '1.45rem',
            color: '#0A0A0A',
            margin: '0 0 8px',
            lineHeight: 1.2,
            letterSpacing: '-0.5px',
            textTransform: 'uppercase',
          }}
        >
          {current.name}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            color: '#4B5563',
            margin: '0 0 20px',
            lineHeight: '1.5',
            fontWeight: 600,
          }}
        >
          {current.description}
        </p>

        {/* Details row: Rarity + XP reward */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '26px',
          }}
        >
          <span
            style={{
              padding: '4px 12px',
              border: '2px solid #0A0A0A',
              borderRadius: '6px',
              background: theme.bg,
              color: theme.text,
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              boxShadow: '2px 2px 0 #0A0A0A',
            }}
          >
            {rarityKey}
          </span>

          <span
            style={{
              padding: '4px 12px',
              border: '2px solid #0A0A0A',
              borderRadius: '6px',
              background: '#FFD60A',
              color: '#0A0A0A',
              fontSize: '12px',
              fontWeight: 800,
              fontFamily: "'Space Mono', monospace",
              boxShadow: '2px 2px 0 #0A0A0A',
            }}
          >
            +{current.xpReward || 100} XP
          </span>
        </div>

        {/* Continue Button */}
        <button
          id="achievement-modal-continue-btn"
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '14px 20px',
            border: '3px solid #0A0A0A',
            borderRadius: '10px',
            background: '#FF3CAC',
            color: 'white',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #0A0A0A',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: "'Space Grotesk', sans-serif",
            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
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
          <span>{isLast ? 'Continue' : 'Next Achievement'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes achievementSlideUp {
          from {
            transform: scale(0.92) translateY(20px);
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
