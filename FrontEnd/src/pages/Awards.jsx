import { useEffect, useState } from 'react';
import { fetchAwards } from '../services/sudokuApi';

// ── Static award definitions ─────────────────────────────────
const STATIC_AWARDS = [
  {
    id: 'first_victory',
    emoji: '🏆',
    title: 'First Victory',
    desc: 'Complete your very first Sudoku puzzle.',
    color: '#FFD60A',
    unlocked: true,
  },
  {
    id: 'speed_solver',
    emoji: '⚡',
    title: 'Speed Solver',
    desc: 'Finish a Medium puzzle in under 5 minutes.',
    color: '#FF3CAC',
    unlocked: true,
  },
  {
    id: 'perfect_game',
    emoji: '✨',
    title: 'Perfect Game',
    desc: 'Complete a puzzle with zero mistakes.',
    color: '#22C55E',
    unlocked: true,
  },
  {
    id: 'no_mistakes',
    emoji: '🎯',
    title: 'No Mistakes',
    desc: 'Finish 5 games in a row without any errors.',
    color: '#3B82F6',
    unlocked: false,
  },
  {
    id: 'hard_solver',
    emoji: '💪',
    title: 'Hard Solver',
    desc: 'Complete your first Hard difficulty puzzle.',
    color: '#F97316',
    unlocked: true,
  },
  {
    id: 'sudoku_master',
    emoji: '🧠',
    title: 'Sudoku Master',
    desc: 'Complete a Master difficulty puzzle.',
    color: '#7C3AED',
    unlocked: false,
  },
  {
    id: 'ten_games',
    emoji: '🔟',
    title: '10 Games Completed',
    desc: 'Play and complete 10 Sudoku puzzles.',
    color: '#EF4444',
    unlocked: false,
  },
  {
    id: 'night_owl',
    emoji: '🦉',
    title: 'Night Owl',
    desc: 'Solve a puzzle between midnight and 4 AM.',
    color: '#0A0A0A',
    unlocked: false,
  },
  {
    id: 'extreme_beast',
    emoji: '👹',
    title: 'Extreme Beast',
    desc: 'Conquer an Extreme difficulty puzzle.',
    color: '#DC2626',
    unlocked: false,
  },
  {
    id: 'comeback_kid',
    emoji: '🔄',
    title: 'Comeback Kid',
    desc: 'Win with only 1 chance remaining.',
    color: '#059669',
    unlocked: false,
  },
];

export default function Awards() {
  const [awards, setAwards] = useState(STATIC_AWARDS);

  useEffect(() => {
    // Try to merge backend data with static definitions
    fetchAwards()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAwards((prev) =>
            prev.map((a) => {
              const match = data.find((d) => d.id === a.id);
              return match ? { ...a, ...match } : a;
            })
          );
        }
      })
      .catch(() => { /* backend not ready */ });
  }, []);

  const unlocked = awards.filter((a) => a.unlocked);
  const locked = awards.filter((a) => !a.unlocked);

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎖️</div>
          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              marginBottom: '8px',
            }}
          >
            Awards & Badges
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Earn badges by playing, solving, and mastering Sudoku.
          </p>
        </div>

        {/* Progress bar */}
        <div
          className="neo-card"
          style={{ padding: '20px 24px', marginBottom: '32px', background: 'white' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 800 }}>Your Progress</span>
            <span style={{ fontWeight: 700, color: '#FF3CAC' }}>
              {unlocked.length} / {awards.length} Unlocked
            </span>
          </div>
          <div
            style={{
              background: '#E5E7EB',
              border: '2px solid #0A0A0A',
              borderRadius: '100px',
              height: '16px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#FF3CAC',
                width: `${(unlocked.length / awards.length) * 100}%`,
                borderRadius: '100px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <>
            <h2
              style={{
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ✅ Unlocked Badges
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '40px',
              }}
            >
              {unlocked.map((award) => (
                <AwardCard key={award.id} award={award} />
              ))}
            </div>
          </>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <>
            <h2
              style={{
                fontWeight: 800,
                fontSize: '1.1rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: 0.6,
              }}
            >
              🔒 Locked Badges
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              {locked.map((award) => (
                <AwardCard key={award.id} award={award} locked />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function AwardCard({ award, locked = false }) {
  return (
    <div
      className="neo-card"
      style={{
        padding: '20px 16px',
        textAlign: 'center',
        background: locked ? '#F9FAFB' : 'white',
        opacity: locked ? 0.65 : 1,
        transition: 'all 0.15s ease',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (!locked) {
          e.currentTarget.style.transform = 'translate(-3px,-3px)';
          e.currentTarget.style.boxShadow = '9px 9px 0 #0A0A0A';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translate(0,0)';
        e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
      }}
    >
      {/* Badge circle */}
      <div
        style={{
          width: '72px',
          height: '72px',
          border: '3px solid #0A0A0A',
          borderRadius: '50%',
          background: locked ? '#E5E7EB' : award.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px',
          boxShadow: locked ? 'none' : '4px 4px 0 #0A0A0A',
          fontSize: '2rem',
          filter: locked ? 'grayscale(100%)' : 'none',
        }}
      >
        {locked ? '🔒' : award.emoji}
      </div>

      <p style={{ fontWeight: 800, fontSize: '14px', marginBottom: '6px' }}>{award.title}</p>
      <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: '1.5' }}>{award.desc}</p>

      {/* Unlocked ribbon */}
      {!locked && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: '#22C55E',
            border: '1px solid #0A0A0A',
            borderRadius: '20px',
            padding: '2px 8px',
            fontSize: '9px',
            fontWeight: 800,
            color: 'white',
          }}
        >
          ✓ EARNED
        </div>
      )}
    </div>
  );
}
