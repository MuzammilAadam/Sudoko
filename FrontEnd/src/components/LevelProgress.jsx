import { Zap, Award, Sparkles } from 'lucide-react';

/** Map level number to a gaming solver title */
export function getLevelTitle(level = 1) {
  if (level <= 1) return 'Novice Solver';
  if (level <= 3) return 'Apprentice Solver';
  if (level <= 6) return 'Keen Solver';
  if (level <= 9) return 'Tactical Solver';
  if (level <= 14) return 'Skilled Solver';
  if (level <= 19) return 'Expert Solver';
  if (level <= 29) return 'Master Mind';
  return 'Grandmaster';
}

/**
 * Neo-Brutalist Level & XP Progress Banner
 *
 * Props:
 *  totalXP: number
 *  level: number
 *  unlockedCount: number
 *  totalAchievements: number
 */
export default function LevelProgress({
  totalXP = 0,
  level = 1,
  unlockedCount = 0,
  totalAchievements = 0,
}) {
  const currentLevel = Math.max(1, Number(level) || 1);
  const currentXP = Math.max(0, Number(totalXP) || 0);

  // 500 XP per level based on backend formula: (totalXP / 500) + 1
  const XP_PER_LEVEL = 500;
  const levelFloorXP = (currentLevel - 1) * XP_PER_LEVEL;
  const nextLevelXP = currentLevel * XP_PER_LEVEL;
  const xpInCurrentLevel = Math.max(0, currentXP - levelFloorXP);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / XP_PER_LEVEL) * 100)));

  const title = getLevelTitle(currentLevel);

  return (
    <section
      className="neo-card"
      style={{
        background: 'white',
        padding: '24px 24px',
        marginBottom: '28px',
        border: '3px solid #0A0A0A',
        borderRadius: '16px',
        boxShadow: '6px 6px 0 #0A0A0A',
      }}
      aria-label="Player Level and XP Progress"
    >
      {/* ── Top Header: Level Badge & Quick Stats ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Level Circle */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '14px',
              border: '3px solid #0A0A0A',
              background: '#FFD60A',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '3px 3px 0 #0A0A0A',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '10px',
                fontWeight: 900,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                lineHeight: 1,
              }}
            >
              LVL
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '1.6rem',
                fontWeight: 800,
                lineHeight: 1,
                color: '#0A0A0A',
              }}
            >
              {currentLevel}
            </span>
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px',
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  color: '#0A0A0A',
                  margin: 0,
                  lineHeight: 1.1,
                  letterSpacing: '-0.5px',
                  textTransform: 'uppercase',
                }}
              >
                LEVEL {currentLevel}
              </h2>
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '11px',
                  fontWeight: 800,
                  background: '#F5EED8',
                  border: '1.5px solid #0A0A0A',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  color: '#0A0A0A',
                }}
              >
                {title}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
              {xpInCurrentLevel.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP towards Level {currentLevel + 1}
            </p>
          </div>
        </div>

        {/* Badges on Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Total XP Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#FFFBF0',
              border: '2px solid #0A0A0A',
              borderRadius: '8px',
              boxShadow: '2px 2px 0 #0A0A0A',
            }}
          >
            <Zap size={16} color="#FF3CAC" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
              Total XP:
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 800, color: '#0A0A0A' }}>
              {currentXP.toLocaleString()}
            </span>
          </div>

          {/* Achievements Unlocked Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#FFD60A',
              border: '2px solid #0A0A0A',
              borderRadius: '8px',
              boxShadow: '2px 2px 0 #0A0A0A',
            }}
          >
            <Award size={16} color="#0A0A0A" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0A0A0A', textTransform: 'uppercase' }}>
              Achievements:
            </span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '14px', fontWeight: 900, color: '#0A0A0A' }}>
              {unlockedCount} / {totalAchievements} Unlocked
            </span>
          </div>
        </div>
      </div>

      {/* ── XP Progress Bar ── */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: 800,
          }}
        >
          <span style={{ color: '#0A0A0A', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#FF3CAC" /> XP PROGRESS
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", color: '#FF3CAC' }}>
            {progressPercent}% COMPLETE
          </span>
        </div>

        <div
          style={{
            width: '100%',
            height: '18px',
            background: '#F3F4F6',
            border: '2.5px solid #0A0A0A',
            borderRadius: '10px',
            boxShadow: '2px 2px 0 #0A0A0A',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: '#FF3CAC',
              borderRadius: '6px',
              transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </div>
      </div>
    </section>
  );
}
