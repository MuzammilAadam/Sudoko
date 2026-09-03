import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  AlertTriangle,
  User,
  Gamepad2,
  TrendingUp,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Award,
  Percent,
} from 'lucide-react';
import { fetchMyScores, fetchAwards } from '../services/sudokuApi';
import { getUsername } from '../services/authApi';

const DIFF_COLORS = {
  EASY: '#22C55E',
  MEDIUM: '#3B82F6',
  HARD: '#F97316',
  EXPERT: '#EF4444',
  MASTER: '#7C3AED',
  EXTREME: '#0A0A0A',
};

const STATIC_ACHIEVEMENTS = [
  {
    id: 'perfect_game',
    emoji: '🧠',
    title: 'Perfect Game',
    desc: 'Finish a game with zero mistakes',
    color: '#22C55E',
    unlocked: true,
  },
  {
    id: 'speed_solver',
    emoji: '⚡',
    title: 'Speed Solver',
    desc: 'Finish a puzzle under the required time',
    color: '#FF3CAC',
    unlocked: true,
  },
  {
    id: 'winning_streak',
    emoji: '🔥',
    title: 'Winning Streak',
    desc: 'Win multiple games in a row',
    color: '#FFD60A',
    unlocked: true,
  },
  {
    id: 'first_victory',
    emoji: '🏆',
    title: 'First Victory',
    desc: 'Complete your very first Sudoku puzzle.',
    color: '#3B82F6',
    unlocked: true,
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
];

export default function MyScores() {
  const [scores, setScores] = useState([]);
  const [achievements, setAchievements] = useState(STATIC_ACHIEVEMENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('HISTORY'); // 'HISTORY' | 'ACHIEVEMENTS'

  const username = getUsername() || 'Player';

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyScores();
      if (Array.isArray(data)) {
        setScores(data);
      } else {
        setScores([]);
      }

      // Try fetching backend awards if supported
      try {
        const awardsData = await fetchAwards();
        if (Array.isArray(awardsData) && awardsData.length > 0) {
          setAchievements((prev) =>
            prev.map((a) => {
              const match = awardsData.find((d) => d.id === a.id);
              return match ? { ...a, ...match } : a;
            })
          );
        }
      } catch {
        /* fallback to static achievements */
      }
    } catch (err) {
      setError(err.message || 'Failed to load user profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];

  const filteredScores = filter === 'ALL'
    ? scores
    : scores.filter((s) => (s.difficulty || '').toUpperCase() === filter);

  // Player Statistics Calculations
  const gamesPlayed = scores.length;
  const bestScore = gamesPlayed > 0 ? Math.max(...scores.map((s) => s.score || 0)) : 0;
  const perfectGamesCount = scores.filter((s) => (s.mistakes || 0) === 0).length;
  const winRate = gamesPlayed > 0 ? Math.round((perfectGamesCount / gamesPlayed) * 100) : 100;
  const totalTimeSeconds = scores.reduce((sum, s) => sum + (s.timeTaken || 0), 0);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>

        {/* ── User Profile Banner Header ── */}
        <div
          className="neo-card"
          style={{
            background: 'white',
            padding: '28px 24px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
              <User size={36} color="#0A0A0A" />
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
                }}
              >
                ★ PLAYER PROFILE
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 800,
                  fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                  margin: 0,
                  lineHeight: 1.2,
                  color: '#0A0A0A',
                }}
              >
                {username}
              </h1>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0', fontWeight: 600 }}>
                Personal stats, performance metrics, and puzzle history
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="my-scores-refresh-btn"
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
              }}
            >
              <Gamepad2 size={16} />
              Play Game
            </Link>
          </div>
        </div>

        {/* ── Player Statistics Cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <StatCard
            icon={<Gamepad2 size={24} color="#0A0A0A" />}
            title="Games Played"
            value={gamesPlayed}
            bg="#FFFBF0"
          />
          <StatCard
            icon={<Trophy size={24} color="#0A0A0A" />}
            title="Best Score"
            value={bestScore > 0 ? bestScore.toLocaleString() : '0'}
            bg="#FFD60A"
          />
          <StatCard
            icon={<Percent size={24} color="#0A0A0A" />}
            title="Win Rate"
            value={`${winRate}%`}
            bg="#F0FDF4"
          />
          <StatCard
            icon={<Clock size={24} color="#0A0A0A" />}
            title="Total Play Time"
            value={formatTime(totalTimeSeconds)}
            bg="#EFF6FF"
          />
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

        {/* ── Navigation Tabs: History vs Achievements ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            borderBottom: '3px solid #0A0A0A',
            paddingBottom: '12px',
          }}
        >
          <button
            onClick={() => setActiveTab('HISTORY')}
            style={{
              padding: '10px 20px',
              border: '2.5px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              background: activeTab === 'HISTORY' ? '#FF3CAC' : 'white',
              color: activeTab === 'HISTORY' ? 'white' : '#0A0A0A',
              boxShadow: activeTab === 'HISTORY' ? '4px 4px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <TrendingUp size={16} /> Recent Game History
          </button>

          <button
            onClick={() => setActiveTab('ACHIEVEMENTS')}
            style={{
              padding: '10px 20px',
              border: '2.5px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              background: activeTab === 'ACHIEVEMENTS' ? '#FFD60A' : 'white',
              color: '#0A0A0A',
              boxShadow: activeTab === 'ACHIEVEMENTS' ? '4px 4px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <Award size={16} /> Achievements ({achievements.filter((a) => a.unlocked).length}/{achievements.length})
          </button>
        </div>

        {/* ── TAB 1: GAME HISTORY ── */}
        {activeTab === 'HISTORY' && (
          <div>
            {/* Difficulty Filters */}
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
                  fontSize: '1.3rem',
                  margin: 0,
                  color: '#0A0A0A',
                }}
              >
                Puzzles Solved ({filteredScores.length})
              </h2>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {difficulties.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilter(d)}
                    style={{
                      padding: '6px 14px',
                      border: '2px solid #0A0A0A',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      background: filter === d ? (DIFF_COLORS[d] || '#FF3CAC') : 'white',
                      color: filter === d ? (d === 'EXTREME' ? '#FFD60A' : 'white') : '#0A0A0A',
                      boxShadow: filter === d ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
                      transition: 'all 0.1s',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Table Area */}
            {loading ? (
              <div
                className="neo-card"
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: 'white',
                }}
              >
                <Loader2 size={40} className="animate-spin" color="#FF3CAC" style={{ margin: '0 auto 16px' }} />
                <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1.1rem' }}>
                  Loading profile scores...
                </p>
              </div>
            ) : filteredScores.length === 0 ? (
              <div
                className="neo-card"
                style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  background: 'white',
                }}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎯</div>
                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    marginBottom: '8px',
                  }}
                >
                  No Scores Found
                </h3>
                <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '400px', margin: '0 auto 24px', fontWeight: 600 }}>
                  {filter !== 'ALL'
                    ? `You haven't completed any games on ${filter} difficulty yet.`
                    : "You haven't completed any Sudoku puzzles yet. Solve a puzzle to record your first score!"}
                </p>
                <Link
                  to="/classic"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    border: '3px solid #0A0A0A',
                    borderRadius: '10px',
                    background: '#FF3CAC',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '15px',
                    textDecoration: 'none',
                    boxShadow: '4px 4px 0 #0A0A0A',
                  }}
                >
                  <Gamepad2 size={18} />
                  Start Playing Now
                </Link>
              </div>
            ) : (
              <div className="neo-card" style={{ overflow: 'hidden', background: 'white' }}>
                {/* Table Header: Difficulty | Time | Mistakes | Score */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 140px 140px 1fr',
                    padding: '14px 20px',
                    borderBottom: '3.5px solid #0A0A0A',
                    background: '#0A0A0A',
                    color: 'white',
                    fontWeight: 900,
                    fontSize: '12px',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>Difficulty</span>
                  <span>Time</span>
                  <span>Mistakes</span>
                  <span style={{ textAlign: 'right' }}>Score</span>
                </div>

                {/* Table Rows */}
                {filteredScores.map((item, idx) => {
                  const diffKey = (item.difficulty || 'MEDIUM').toUpperCase();

                  return (
                    <div
                      key={item.id || idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '120px 140px 140px 1fr',
                        padding: '16px 20px',
                        borderBottom: idx < filteredScores.length - 1 ? '1.5px solid #E5E7EB' : 'none',
                        background: idx % 2 === 0 ? 'white' : '#FFFBF0',
                        alignItems: 'center',
                      }}
                    >
                      {/* Difficulty */}
                      <div>
                        <span
                          style={{
                            background: DIFF_COLORS[diffKey] || '#6B7280',
                            color: diffKey === 'EXTREME' ? '#FFD60A' : 'white',
                            border: '2px solid #0A0A0A',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 900,
                            boxShadow: '2px 2px 0 #0A0A0A',
                            display: 'inline-block',
                          }}
                        >
                          {diffKey}
                        </span>
                      </div>

                      {/* Time */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
                        <Clock size={15} color="#6B7280" /> {formatTime(item.timeTaken)}
                      </span>

                      {/* Mistakes */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: 800,
                          color: (item.mistakes || 0) > 0 ? '#EF4444' : '#22C55E',
                        }}
                      >
                        {(item.mistakes || 0) > 0 ? (
                          <AlertTriangle size={15} />
                        ) : (
                          <CheckCircle2 size={15} />
                        )}
                        {item.mistakes || 0} {(item.mistakes === 1 ? 'mistake' : 'mistakes')}
                      </span>

                      {/* Score */}
                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: 900,
                            fontSize: '1.2rem',
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
          </div>
        )}

        {/* ── TAB 2: ACHIEVEMENTS ── */}
        {activeTab === 'ACHIEVEMENTS' && (
          <div>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.3rem',
                marginBottom: '20px',
                color: '#0A0A0A',
              }}
            >
              🏅 Unlocked Badges & Achievements
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '20px',
              }}
            >
              {achievements.map((item) => (
                <div
                  key={item.id}
                  className="neo-card"
                  style={{
                    padding: '24px 20px',
                    background: item.unlocked ? 'white' : '#F9FAFB',
                    border: '3px solid #0A0A0A',
                    borderRadius: '14px',
                    boxShadow: item.unlocked ? '5px 5px 0 #0A0A0A' : '3px 3px 0 #0A0A0A',
                    opacity: item.unlocked ? 1 : 0.65,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      border: '3px solid #0A0A0A',
                      background: item.unlocked ? item.color : '#E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2rem',
                      marginBottom: '12px',
                      boxShadow: item.unlocked ? '3px 3px 0 #0A0A0A' : 'none',
                    }}
                  >
                    {item.unlocked ? item.emoji : '🔒'}
                  </div>

                  <h3 style={{ fontWeight: 900, fontSize: '16px', margin: '0 0 6px 0', color: '#0A0A0A' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
                    {item.desc}
                  </p>

                  <div
                    style={{
                      marginTop: '16px',
                      background: item.unlocked ? '#DCFCE7' : '#F3F4F6',
                      border: '1.5px solid #0A0A0A',
                      borderRadius: '20px',
                      padding: '2px 10px',
                      fontSize: '11px',
                      fontWeight: 800,
                      color: item.unlocked ? '#15803D' : '#6B7280',
                    }}
                  >
                    {item.unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

function StatCard({ icon, title, value, bg }) {
  return (
    <div
      style={{
        border: '3px solid #0A0A0A',
        borderRadius: '14px',
        padding: '18px 20px',
        boxShadow: '5px 5px 0 #0A0A0A',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          border: '2.5px solid #0A0A0A',
          background: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '3px 3px 0 #0A0A0A',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', opacity: 0.75, margin: '0 0 2px', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 900, fontSize: '1.5rem', margin: 0, lineHeight: 1.1, color: '#0A0A0A' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
