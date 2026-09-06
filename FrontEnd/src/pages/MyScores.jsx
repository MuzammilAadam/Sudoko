import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  AlertTriangle,
  User,
  Gamepad2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Award,
  Percent,
  Zap,
  Check,
  Flame,
  Swords,
  Layers,
} from 'lucide-react';
import {
  fetchMyScores,
  fetchAllAchievements,
  fetchUserAchievements,
} from '../services/sudokuApi';
import {
  getUsername,
  getUserId,
  getUserXP,
  getUserLevel,
  fetchCurrentUser,
} from '../services/authApi';
import AchievementCard from '../components/AchievementCard';
import LevelProgress from '../components/LevelProgress';

const DIFF_COLORS = {
  EASY: '#22C55E',
  MEDIUM: '#3B82F6',
  HARD: '#F97316',
  EXPERT: '#EF4444',
  MASTER: '#7C3AED',
  EXTREME: '#0A0A0A',
};

// ── Backend standard achievements fallback matching AchievementType.java ──
const BACKEND_STANDARD_ACHIEVEMENTS = [
  {
    code: 'FIRST_GAME',
    name: 'First Step',
    description: 'Complete your first Sudoku puzzle.',
    xpReward: 50,
    rarity: 'COMMON',
    category: 'SKILL',
  },
  {
    code: 'FIRST_WIN',
    name: 'First Victory',
    description: 'Win your first Sudoku game.',
    xpReward: 100,
    rarity: 'COMMON',
    category: 'SKILL',
  },
  {
    code: 'PERFECT_GAME',
    name: 'Perfect Solver',
    description: 'Complete a Sudoku with zero mistakes.',
    xpReward: 300,
    rarity: 'RARE',
    category: 'SKILL',
  },
  {
    code: 'HARD_SOLVER',
    name: 'Sharp Mind',
    description: 'Complete a Hard difficulty Sudoku.',
    xpReward: 400,
    rarity: 'RARE',
    category: 'SKILL',
  },
  {
    code: 'MASTER_SOLVER',
    name: 'Master Solver',
    description: 'Complete a Master difficulty Sudoku.',
    xpReward: 700,
    rarity: 'EPIC',
    category: 'SKILL',
  },
  {
    code: 'EXTREME_SOLVER',
    name: 'Extreme Mind',
    description: 'Complete an Extreme difficulty Sudoku.',
    xpReward: 1000,
    rarity: 'LEGENDARY',
    category: 'SKILL',
  },
  {
    code: 'THREE_WIN_STREAK',
    name: 'On Fire',
    description: 'Win 3 games in a row.',
    xpReward: 200,
    rarity: 'RARE',
    category: 'STREAK',
  },
  {
    code: 'MULTIPLAYER_FIRST_WIN',
    name: 'Arena Winner',
    description: 'Win your first multiplayer game.',
    xpReward: 250,
    rarity: 'RARE',
    category: 'MULTIPLAYER',
  },
];

function inferCategory(code = '', name = '') {
  const key = `${code} ${name}`.toUpperCase();
  if (key.includes('SPEED') || key.includes('FAST') || key.includes('TIME')) return 'SPEED';
  if (key.includes('STREAK') || key.includes('ROW') || key.includes('FIRE')) return 'STREAK';
  if (key.includes('MULTI') || key.includes('ARENA')) return 'MULTIPLAYER';
  return 'SKILL';
}

export default function MyScores() {
  const [scores, setScores] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userProfile, setUserProfile] = useState({
    totalXP: getUserXP(),
    level: getUserLevel(),
    gamesPlayed: 0,
    gamesWon: 0,
    totalScore: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNLOCKED' | 'LOCKED'
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'SKILL' | 'SPEED' | 'STREAK' | 'MULTIPLAYER'
  const [diffFilter, setDiffFilter] = useState('ALL');

  const username = getUsername() || 'Player';

  const loadProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch user profile from backend (GET /api/auth/me)
      const freshUser = await fetchCurrentUser();
      let activeUserId = freshUser?.id || getUserId();

      if (freshUser) {
        setUserProfile({
          totalXP: freshUser.totalXP ?? getUserXP(),
          level: freshUser.level ?? getUserLevel(),
          gamesPlayed: freshUser.gamesPlayed ?? 0,
          gamesWon: freshUser.gamesWon ?? 0,
          totalScore: freshUser.totalScore ?? 0,
        });
      }

      // 2. Fetch user's scores history (GET /api/scores/me)
      const scoresData = await fetchMyScores().catch(() => []);
      const scoresList = Array.isArray(scoresData) ? scoresData : [];
      setScores(scoresList);

      // 3. Fetch achievements: definitions and unlocked entries from backend
      // Calls GET /api/achievements and GET /api/achievements/user/{userId}
      const [allDefs, unlockedEntries] = await Promise.all([
        fetchAllAchievements().catch(() => []),
        fetchUserAchievements(activeUserId).catch(() => []),
      ]);

      // Base list: use backend definitions if returned, else use standard fallback
      const baseList = Array.isArray(allDefs) && allDefs.length > 0
        ? allDefs
        : BACKEND_STANDARD_ACHIEVEMENTS;

      // Extract set of unlocked codes/ids from UserAchievement records
      const unlockedMap = new Map();
      if (Array.isArray(unlockedEntries)) {
        unlockedEntries.forEach((ua) => {
          const ach = ua.achievement || ua;
          const codeKey = (ach.code || '').toUpperCase();
          const nameKey = (ach.name || '').toUpperCase();
          unlockedMap.set(codeKey, ua.unlockedAt || true);
          if (nameKey) unlockedMap.set(nameKey, ua.unlockedAt || true);
        });
      }

      const mergedAchievements = baseList.map((item) => {
        const codeKey = (item.code || '').toUpperCase();
        const nameKey = (item.name || '').toUpperCase();
        const isUnlocked = unlockedMap.has(codeKey) || unlockedMap.has(nameKey);
        const unlockedAt = unlockedMap.get(codeKey) || unlockedMap.get(nameKey);

        return {
          ...item,
          category: item.category || inferCategory(item.code, item.name),
          unlocked: Boolean(isUnlocked),
          unlockedAt: typeof unlockedAt === 'string' ? unlockedAt : null,
        };
      });

      setAchievements(mergedAchievements);
    } catch (err) {
      setError(err.message || 'Failed to load user profile data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Player Statistics Calculations (fallback to scores list if user entity fields are 0)
  const gamesPlayed = userProfile.gamesPlayed > 0 ? userProfile.gamesPlayed : scores.length;
  const gamesWon = userProfile.gamesWon > 0 ? userProfile.gamesWon : scores.length;
  const totalScore = userProfile.totalScore > 0
    ? userProfile.totalScore
    : scores.reduce((sum, s) => sum + (s.score || 0), 0);
  const perfectGamesCount = scores.filter((s) => (s.mistakes || 0) === 0).length;
  const winRate = gamesPlayed > 0
    ? Math.round(((gamesWon > 0 ? gamesWon : perfectGamesCount) / gamesPlayed) * 100)
    : 100;

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Achievements filtering
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  const filteredAchievements = achievements.filter((a) => {
    if (statusFilter === 'UNLOCKED' && !a.unlocked) return false;
    if (statusFilter === 'LOCKED' && a.unlocked) return false;
    if (categoryFilter !== 'ALL' && a.category !== categoryFilter) return false;
    return true;
  });

  // Recent scores filtering
  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];
  const filteredScores = diffFilter === 'ALL'
    ? scores
    : scores.filter((s) => (s.difficulty || '').toUpperCase() === diffFilter);

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '1040px', margin: '0 auto' }}>

        {/* ── 1. USER PROFILE HEADER ── */}
        <div
          className="neo-card"
          style={{
            background: 'white',
            padding: '24px 28px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                border: '3.5px solid #0A0A0A',
                background: '#FFD60A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '4px 4px 0 #0A0A0A',
                flexShrink: 0,
              }}
            >
              <User size={34} color="#0A0A0A" />
            </div>

            <div>
              <div
                style={{
                  display: 'inline-block',
                  background: '#FF3CAC',
                  color: 'white',
                  border: '2px solid #0A0A0A',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  marginBottom: '4px',
                  boxShadow: '2px 2px 0 #0A0A0A',
                  textTransform: 'uppercase',
                }}
              >
                ★ USER PROFILE
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
                  margin: 0,
                  lineHeight: 1.15,
                  color: '#0A0A0A',
                  letterSpacing: '-0.5px',
                }}
              >
                {username}
              </h1>
              <p style={{ color: '#6B7280', fontSize: '13.5px', margin: '4px 0 0', fontWeight: 600 }}>
                Level progress, achievement mastery, and game history
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="profile-refresh-btn"
              onClick={loadProfileData}
              disabled={loading}
              style={{
                padding: '10px 16px',
                border: '2.5px solid #0A0A0A',
                borderRadius: '8px',
                background: 'white',
                fontWeight: 800,
                fontSize: '13px',
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '3px 3px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <Link
              to="/classic"
              style={{
                padding: '10px 18px',
                border: '2.5px solid #0A0A0A',
                borderRadius: '8px',
                background: '#FF3CAC',
                color: 'white',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '3px 3px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
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
              <Gamepad2 size={16} />
              Play Sudoku
            </Link>
          </div>
        </div>

        {/* ── Error Banner ── */}
        {error && (
          <div
            style={{
              background: '#FEE2E2',
              border: '3px solid #EF4444',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#B91C1C',
              fontWeight: 700,
              boxShadow: '3px 3px 0 #EF4444',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* ── 2. XP & LEVEL BANNER ── */}
        <LevelProgress
          totalXP={userProfile.totalXP}
          level={userProfile.level}
          unlockedCount={unlockedCount}
          totalAchievements={totalCount}
        />

        {/* ── 3. USER PROFILE STATS GRID ── */}
        <section style={{ marginBottom: '36px' }} aria-label="Player Statistics">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '14px',
            }}
          >
            <StatCard
              icon={<Zap size={22} color="#0A0A0A" />}
              title="Level"
              value={`LVL ${userProfile.level}`}
              bg="#FFFBF0"
            />
            <StatCard
              icon={<Zap size={22} color="#0A0A0A" />}
              title="Current XP"
              value={userProfile.totalXP.toLocaleString()}
              bg="#FEF9C3"
            />
            <StatCard
              icon={<Gamepad2 size={22} color="#0A0A0A" />}
              title="Games Played"
              value={gamesPlayed}
              bg="#FFFBF0"
            />
            <StatCard
              icon={<CheckCircle2 size={22} color="#0A0A0A" />}
              title="Games Won"
              value={gamesWon}
              bg="#F0FDF4"
            />
            <StatCard
              icon={<Trophy size={22} color="#0A0A0A" />}
              title="Total Score"
              value={totalScore.toLocaleString()}
              bg="#FFD60A"
            />
            <StatCard
              icon={<Percent size={22} color="#0A0A0A" />}
              title="Win Rate"
              value={`${winRate}%`}
              bg="#EFF6FF"
            />
          </div>
        </section>

        {/* ── 4. ACHIEVEMENTS SECTION ── */}
        <section style={{ marginBottom: '44px' }} aria-label="Achievements">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: '#0A0A0A',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textTransform: 'uppercase',
                }}
              >
                <Award size={22} color="#0A0A0A" /> ACHIEVEMENTS
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
                {unlockedCount} / {totalCount} Unlocked
              </p>
            </div>

            {/* Status Filter Tabs (ALL / UNLOCKED / LOCKED) */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'UNLOCKED', label: `Unlocked (${unlockedCount})` },
                { id: 'LOCKED', label: `Locked (${totalCount - unlockedCount})` },
              ].map((tab) => {
                const active = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
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
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Category Filter Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginRight: '4px' }}>
              Category:
            </span>
            {[
              { id: 'ALL', label: 'All Categories', icon: Layers },
              { id: 'SKILL', label: 'Skill', icon: Award },
              { id: 'STREAK', label: 'Streak', icon: Flame },
              { id: 'MULTIPLAYER', label: 'Multiplayer', icon: Swords },
            ].map((cat) => {
              const active = categoryFilter === cat.id;
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    border: '1.5px solid #0A0A0A',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    background: active ? '#0A0A0A' : 'white',
                    color: active ? '#FFD60A' : '#0A0A0A',
                    boxShadow: active ? '2px 2px 0 #FFD60A' : '1.5px 1.5px 0 #0A0A0A',
                    transition: 'all 0.1s',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  <IconComp size={12} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Achievement Cards Grid */}
          {loading ? (
            <div
              className="neo-card"
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                background: 'white',
              }}
            >
              <Loader2 size={36} className="animate-spin" color="#FF3CAC" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1rem', margin: 0 }}>
                Loading achievements...
              </p>
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div
              className="neo-card"
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: 'white',
              }}
            >
              <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>🎯</p>
              <h3 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1.2rem', margin: '0 0 6px' }}>
                No Achievements Found
              </h3>
              <p style={{ color: '#6B7280', fontSize: '13px', margin: 0, fontWeight: 600 }}>
                No achievements match your selected filter.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '18px',
              }}
            >
              {filteredAchievements.map((ach) => (
                <AchievementCard key={ach.code || ach.id} achievement={ach} />
              ))}
            </div>
          )}
        </section>

        {/* ── 5. RECENT GAMES SECTION ── */}
        <section aria-label="Recent Games">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: '#0A0A0A',
                  margin: 0,
                  textTransform: 'uppercase',
                }}
              >
                RECENT GAMES
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
                Solved puzzles history ({filteredScores.length})
              </p>
            </div>

            {/* Difficulty Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  style={{
                    padding: '5px 12px',
                    border: '2px solid #0A0A0A',
                    borderRadius: '6px',
                    fontWeight: 800,
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    background: diffFilter === d ? (DIFF_COLORS[d] || '#FF3CAC') : 'white',
                    color: diffFilter === d ? (d === 'EXTREME' ? '#FFD60A' : 'white') : '#0A0A0A',
                    boxShadow: diffFilter === d ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
                    transition: 'all 0.1s',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div
              className="neo-card"
              style={{
                padding: '48px 20px',
                textAlign: 'center',
                background: 'white',
              }}
            >
              <Loader2 size={36} className="animate-spin" color="#FF3CAC" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800 }}>Loading game history...</p>
            </div>
          ) : filteredScores.length === 0 ? (
            <div
              className="neo-card"
              style={{
                padding: '44px 20px',
                textAlign: 'center',
                background: 'white',
              }}
            >
              <p style={{ fontSize: '2.5rem', margin: '0 0 10px' }}>🎮</p>
              <h3 style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1.2rem', margin: '0 0 6px' }}>
                No Games Recorded Yet
              </h3>
              <p style={{ color: '#6B7280', fontSize: '13.5px', maxWidth: '380px', margin: '0 auto 20px', fontWeight: 600 }}>
                {diffFilter !== 'ALL'
                  ? `No completed games recorded on ${diffFilter} difficulty.`
                  : 'Play and solve your first Sudoku puzzle to earn score and XP!'}
              </p>
              <Link
                to="/classic"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '8px',
                  background: '#FF3CAC',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 #0A0A0A',
                }}
              >
                <Gamepad2 size={16} />
                Start Playing
              </Link>
            </div>
          ) : (
            <div className="neo-card" style={{ overflow: 'hidden', background: 'white' }}>
              {/* Header: Difficulty | Time | Mistakes | Score */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(100px, 1fr) minmax(100px, 1fr) minmax(110px, 1.2fr) minmax(90px, 1fr)',
                  padding: '12px 18px',
                  borderBottom: '3px solid #0A0A0A',
                  background: '#0A0A0A',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '11.5px',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                }}
              >
                <span>Difficulty</span>
                <span>Time</span>
                <span>Mistakes</span>
                <span style={{ textAlign: 'right' }}>Score</span>
              </div>

              {/* Rows */}
              {filteredScores.map((item, idx) => {
                const diffKey = (item.difficulty || 'MEDIUM').toUpperCase();

                return (
                  <div
                    key={item.id || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(100px, 1fr) minmax(100px, 1fr) minmax(110px, 1.2fr) minmax(90px, 1fr)',
                      padding: '14px 18px',
                      borderBottom: idx < filteredScores.length - 1 ? '1.5px solid #E5E7EB' : 'none',
                      background: idx % 2 === 0 ? 'white' : '#FFFBF0',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          background: DIFF_COLORS[diffKey] || '#6B7280',
                          color: diffKey === 'EXTREME' ? '#FFD60A' : 'white',
                          border: '2px solid #0A0A0A',
                          borderRadius: '6px',
                          padding: '3px 9px',
                          fontSize: '11px',
                          fontWeight: 900,
                          boxShadow: '1.5px 1.5px 0 #0A0A0A',
                          display: 'inline-block',
                        }}
                      >
                        {diffKey}
                      </span>
                    </div>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13.5px', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                      <Clock size={14} color="#6B7280" /> {formatTime(item.timeTaken)}
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        color: (item.mistakes || 0) > 0 ? '#EF4444' : '#22C55E',
                      }}
                    >
                      {(item.mistakes || 0) > 0 ? (
                        <AlertTriangle size={14} />
                      ) : (
                        <Check size={14} strokeWidth={3} />
                      )}
                      {item.mistakes || 0} {(item.mistakes === 1 ? 'mistake' : 'mistakes')}
                    </span>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          color: '#FF3CAC',
                        }}
                      >
                        {(item.score ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

function StatCard({ icon, title, value, bg }) {
  return (
    <div
      style={{
        border: '2.5px solid #0A0A0A',
        borderRadius: '12px',
        padding: '14px 16px',
        boxShadow: '4px 4px 0 #0A0A0A',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '10px',
          border: '2px solid #0A0A0A',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 2px 0 #0A0A0A',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.7, margin: '0 0 2px', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '1.25rem', margin: 0, lineHeight: 1.1, color: '#0A0A0A' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
