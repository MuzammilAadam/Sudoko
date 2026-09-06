import { useEffect, useState, useCallback } from 'react';
import { Award, Trophy, Loader2 } from 'lucide-react';
import { fetchAllAchievements, fetchUserAchievements } from '../services/sudokuApi';
import { getUserId, fetchCurrentUser } from '../services/authApi';
import AchievementCard from '../components/AchievementCard';

// ── Backend standard definitions fallback ──────────────────────
const BACKEND_STANDARD_ACHIEVEMENTS = [
  {
    code: 'FIRST_GAME',
    name: 'First Step',
    description: 'Complete your first Sudoku puzzle.',
    xpReward: 50,
    rarity: 'COMMON',
  },
  {
    code: 'FIRST_WIN',
    name: 'First Victory',
    description: 'Win your first Sudoku game.',
    xpReward: 100,
    rarity: 'COMMON',
  },
  {
    code: 'PERFECT_GAME',
    name: 'Perfect Solver',
    description: 'Complete a Sudoku with zero mistakes.',
    xpReward: 300,
    rarity: 'RARE',
  },
  {
    code: 'HARD_SOLVER',
    name: 'Sharp Mind',
    description: 'Complete a Hard difficulty Sudoku.',
    xpReward: 400,
    rarity: 'RARE',
  },
  {
    code: 'MASTER_SOLVER',
    name: 'Master Solver',
    description: 'Complete a Master difficulty Sudoku.',
    xpReward: 700,
    rarity: 'EPIC',
  },
  {
    code: 'EXTREME_SOLVER',
    name: 'Extreme Mind',
    description: 'Complete an Extreme difficulty Sudoku.',
    xpReward: 1000,
    rarity: 'LEGENDARY',
  },
  {
    code: 'THREE_WIN_STREAK',
    name: 'On Fire',
    description: 'Win 3 games in a row.',
    xpReward: 200,
    rarity: 'RARE',
  },
  {
    code: 'MULTIPLAYER_FIRST_WIN',
    name: 'Arena Winner',
    description: 'Win your first multiplayer game.',
    xpReward: 250,
    rarity: 'RARE',
  },
];

export default function Awards() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const user = await fetchCurrentUser();
      const userId = user?.id || getUserId();

      const [allDefs, userEntries] = await Promise.all([
        fetchAllAchievements().catch(() => []),
        fetchUserAchievements(userId).catch(() => []),
      ]);

      const baseList = Array.isArray(allDefs) && allDefs.length > 0
        ? allDefs
        : BACKEND_STANDARD_ACHIEVEMENTS;

      const unlockedMap = new Map();
      if (Array.isArray(userEntries)) {
        userEntries.forEach((ua) => {
          const ach = ua.achievement || ua;
          const codeKey = (ach.code || '').toUpperCase();
          const nameKey = (ach.name || '').toUpperCase();
          unlockedMap.set(codeKey, ua.unlockedAt || true);
          if (nameKey) unlockedMap.set(nameKey, ua.unlockedAt || true);
        });
      }

      const merged = baseList.map((item) => {
        const codeKey = (item.code || '').toUpperCase();
        const nameKey = (item.name || '').toUpperCase();
        const isUnlocked = unlockedMap.has(codeKey) || unlockedMap.has(nameKey);
        const unlockedAt = unlockedMap.get(codeKey) || unlockedMap.get(nameKey);

        return {
          ...item,
          unlocked: Boolean(isUnlocked),
          unlockedAt: typeof unlockedAt === 'string' ? unlockedAt : null,
        };
      });

      setAchievements(merged);
    } catch {
      setAchievements(BACKEND_STANDARD_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: false })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAchievements();
  }, [loadAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const filtered = achievements.filter((a) => {
    if (filter === 'UNLOCKED') return a.unlocked;
    if (filter === 'LOCKED') return !a.unlocked;
    return true;
  });

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              border: '3px solid #0A0A0A',
              background: '#FFD60A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '4px 4px 0 #0A0A0A',
            }}
          >
            <Trophy size={32} color="#0A0A0A" />
          </div>

          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              margin: '0 0 6px',
              color: '#0A0A0A',
              letterSpacing: '-0.5px',
              textTransform: 'uppercase',
            }}
          >
            AWARDS & ACHIEVEMENTS
          </h1>
          <p style={{ color: '#6B7280', fontSize: '15px', margin: 0, fontWeight: 600 }}>
            Unlock badges and earn XP rewards by solving Sudoku puzzles.
          </p>
        </div>

        {/* Progress Card */}
        <div
          className="neo-card"
          style={{ padding: '22px 24px', marginBottom: '32px', background: 'white' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 800, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={18} color="#FF3CAC" />
              <span>OVERALL MASTERY</span>
            </span>
            <span style={{ fontWeight: 800, fontFamily: "'Space Mono', monospace", color: '#FF3CAC' }}>
              {unlockedCount} / {totalCount} UNLOCKED ({progressPercent}%)
            </span>
          </div>

          <div
            style={{
              background: '#F3F4F6',
              border: '2.5px solid #0A0A0A',
              borderRadius: '10px',
              height: '18px',
              boxShadow: '2px 2px 0 #0A0A0A',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: '#FF3CAC',
                width: `${progressPercent}%`,
                borderRadius: '6px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 800,
              fontSize: '1.25rem',
              margin: 0,
              color: '#0A0A0A',
              textTransform: 'uppercase',
            }}
          >
            BADGES ({filtered.length})
          </h2>

          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'UNLOCKED', label: `Unlocked (${unlockedCount})` },
              { id: 'LOCKED', label: `Locked (${totalCount - unlockedCount})` },
            ].map((t) => {
              const active = filter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  style={{
                    padding: '6px 14px',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    background: active ? '#FFD60A' : 'white',
                    color: '#0A0A0A',
                    boxShadow: active ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
                    transition: 'all 0.1s',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div
            className="neo-card"
            style={{ padding: '60px 20px', textAlign: 'center', background: 'white' }}
          >
            <Loader2 size={36} className="animate-spin" color="#FF3CAC" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>Loading achievements...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '18px',
            }}
          >
            {filtered.map((ach) => (
              <AchievementCard key={ach.code || ach.id} achievement={ach} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
