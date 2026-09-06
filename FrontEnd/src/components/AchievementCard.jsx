import {
  Trophy,
  Award,
  Sparkles,
  Zap,
  Target,
  Flame,
  Swords,
  Footprints,
  Lock,
  Check,
} from 'lucide-react';

// ── Icon selector based on achievement code or keyword ────────
function getAchievementIcon(code = '', name = '', size = 26) {
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

// ── Subtle, non-gradient rarity badge color styling ───────────
const RARITY_THEMES = {
  COMMON: {
    bg: '#F5EED8',
    text: '#0A0A0A',
    border: '#0A0A0A',
    badgeBg: '#FFFBF0',
    iconBg: '#F5EED8',
  },
  RARE: {
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#0A0A0A',
    badgeBg: '#EFF6FF',
    iconBg: '#BFDBFE',
  },
  EPIC: {
    bg: '#F3E8FF',
    text: '#6B21A8',
    border: '#0A0A0A',
    badgeBg: '#FAF5FF',
    iconBg: '#E9D5FF',
  },
  LEGENDARY: {
    bg: '#FEF08A',
    text: '#854D0E',
    border: '#0A0A0A',
    badgeBg: '#FEF9C3',
    iconBg: '#FDE047',
  },
};

/**
 * Clean Neo-Brutalist Achievement Card
 *
 * Props:
 *  achievement: {
 *    code: string,
 *    name: string,
 *    description: string,
 *    xpReward: number,
 *    rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY',
 *    unlocked: boolean,
 *    unlockedAt?: string
 *  }
 */
export default function AchievementCard({ achievement }) {
  const {
    code = '',
    name = 'Achievement',
    description = '',
    xpReward = 100,
    rarity = 'COMMON',
    unlocked = false,
    unlockedAt = null,
  } = achievement;

  const rarityKey = (rarity || 'COMMON').toUpperCase();
  const theme = RARITY_THEMES[rarityKey] || RARITY_THEMES.COMMON;

  const formattedDate = unlockedAt
    ? new Date(unlockedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div
      style={{
        background: unlocked ? 'white' : '#F9FAFB',
        border: '3px solid #0A0A0A',
        borderRadius: '14px',
        boxShadow: unlocked ? '4px 4px 0 #0A0A0A' : '3px 3px 0 rgba(10,10,10,0.4)',
        padding: '20px 18px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: unlocked ? 1 : 0.7,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'default',
        minHeight: '210px',
      }}
      onMouseEnter={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = 'translate(-2px, -2px)';
          e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
        }
      }}
      onMouseLeave={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
        }
      }}
    >
      {/* ── Top Row: Rarity Tag & XP Badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '8px',
        }}
      >
        {/* Rarity badge */}
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            fontSize: '11px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            padding: '3px 9px',
            border: '2px solid #0A0A0A',
            borderRadius: '6px',
            background: unlocked ? theme.bg : '#E5E7EB',
            color: unlocked ? theme.text : '#4B5563',
            boxShadow: '2px 2px 0 #0A0A0A',
          }}
        >
          {rarityKey}
        </span>

        {/* XP reward */}
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '12px',
            padding: '3px 8px',
            border: '2px solid #0A0A0A',
            borderRadius: '6px',
            background: unlocked ? '#FFD60A' : '#E5E7EB',
            color: '#0A0A0A',
            boxShadow: '2px 2px 0 #0A0A0A',
            whiteSpace: 'nowrap',
          }}
        >
          +{xpReward} XP
        </span>
      </div>

      {/* ── Center: Icon and Info ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, marginBottom: '16px' }}>
        {/* Geometric Icon Badge */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            border: '2.5px solid #0A0A0A',
            background: unlocked ? theme.iconBg : '#E5E7EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: unlocked ? '3px 3px 0 #0A0A0A' : 'none',
            flexShrink: 0,
            filter: unlocked ? 'none' : 'grayscale(100%)',
          }}
        >
          {unlocked ? (
            getAchievementIcon(code, name, 24)
          ) : (
            <Lock size={22} color="#6B7280" />
          )}
        </div>

        {/* Name and Description */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 800,
              fontSize: '14px',
              color: '#0A0A0A',
              margin: '0 0 4px',
              lineHeight: '1.25',
              textTransform: 'uppercase',
              letterSpacing: '-0.3px',
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12.5px',
              color: unlocked ? '#4B5563' : '#6B7280',
              lineHeight: '1.4',
              margin: 0,
              fontWeight: 600,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* ── Footer: Status Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '2px dashed #0A0A0A',
          paddingTop: '10px',
          marginTop: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {unlocked ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#15803D',
                background: '#DCFCE7',
                border: '1.5px solid #0A0A0A',
                borderRadius: '4px',
                padding: '2px 6px',
              }}
            >
              <Check size={12} strokeWidth={3} /> UNLOCKED
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#6B7280',
                background: '#F3F4F6',
                border: '1.5px solid #0A0A0A',
                borderRadius: '4px',
                padding: '2px 6px',
              }}
            >
              <Lock size={11} strokeWidth={2.5} /> LOCKED
            </span>
          )}
        </div>

        {unlocked && formattedDate && (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10.5px',
              color: '#6B7280',
              fontWeight: 700,
            }}
          >
            {formattedDate}
          </span>
        )}
      </div>
    </div>
  );
}
