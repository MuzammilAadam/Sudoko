import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Clock,
  AlertTriangle,
  Star,
  User,
  Gamepad2,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { fetchMyScores } from '../services/sudokuApi';
import { getUsername } from '../services/authApi';

const DIFF_COLORS = {
  EASY: '#22C55E',
  MEDIUM: '#3B82F6',
  HARD: '#F97316',
  EXPERT: '#EF4444',
  MASTER: '#7C3AED',
  EXTREME: '#0A0A0A',
};

export default function MyScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const username = getUsername() || 'Player';

  const loadScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyScores();
      if (Array.isArray(data)) {
        setScores(data);
      } else {
        setScores([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load score history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];

  const filteredScores = filter === 'ALL'
    ? scores
    : scores.filter((s) => (s.difficulty || '').toUpperCase() === filter);

  // Statistics
  const totalGames = scores.length;
  const highScore = totalGames > 0 ? Math.max(...scores.map((s) => s.score || 0)) : 0;
  const avgScore = totalGames > 0 ? Math.round(scores.reduce((sum, s) => sum + (s.score || 0), 0) / totalGames) : 0;
  const totalTimeSeconds = scores.reduce((sum, s) => sum + (s.timeTaken || 0), 0);

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatDate = (rawDate) => {
    if (!rawDate) return null;
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  };

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Top Header / User Profile Banner */}
        <div
          className="neo-card"
          style={{
            background: 'white',
            padding: '28px 24px',
            marginBottom: '32px',
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
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid #0A0A0A',
                background: '#FFD60A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '4px 4px 0 #0A0A0A',
                flexShrink: 0,
              }}
            >
              <User size={32} color="#0A0A0A" />
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
                ★ USER PROFILE
              </div>
              <h1
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {username}
              </h1>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: '4px 0 0', fontWeight: 500 }}>
                Sudoku Performance & Personal Game History
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              id="my-scores-refresh-btn"
              onClick={loadScores}
              disabled={loading}
              style={{
                padding: '10px 16px',
                border: '2px solid #0A0A0A',
                borderRadius: '8px',
                background: 'white',
                fontWeight: 700,
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
              to="/"
              style={{
                padding: '10px 18px',
                border: '2px solid #0A0A0A',
                borderRadius: '8px',
                background: '#FF3CAC',
                color: 'white',
                fontWeight: 700,
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

        {/* Summary Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <StatCard
            icon={<Gamepad2 size={24} color="#0A0A0A" />}
            title="Total Games"
            value={totalGames}
            bg="#FFFBF0"
          />
          <StatCard
            icon={<Trophy size={24} color="#0A0A0A" />}
            title="High Score"
            value={highScore > 0 ? highScore.toLocaleString() : '0'}
            bg="#FFD60A"
          />
          <StatCard
            icon={<TrendingUp size={24} color="#0A0A0A" />}
            title="Average Score"
            value={avgScore > 0 ? avgScore.toLocaleString() : '0'}
            bg="#EFF6FF"
          />
          <StatCard
            icon={<Clock size={24} color="#0A0A0A" />}
            title="Total Time"
            value={formatTime(totalTimeSeconds)}
            bg="#F0FDF4"
          />
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: '#FEE2E2',
              border: '3px solid #EF4444',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '4px 4px 0 #EF4444',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertTriangle size={20} color="#EF4444" />
              <span style={{ fontWeight: 700, color: '#991B1B' }}>{error}</span>
            </div>
            <button
              onClick={loadScores}
              style={{
                padding: '6px 14px',
                border: '2px solid #0A0A0A',
                borderRadius: '6px',
                background: 'white',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        )}

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
              fontWeight: 700,
              fontSize: '1.4rem',
              margin: 0,
            }}
          >
            Game History ({filteredScores.length})
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
                  fontWeight: 700,
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

        {/* Content Area */}
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
            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.1rem' }}>
              Loading scores...
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
                fontWeight: 700,
                fontSize: '1.4rem',
                marginBottom: '8px',
              }}
            >
              No Scores Found
            </h3>
            <p style={{ color: '#6B7280', fontSize: '15px', maxWidth: '400px', margin: '0 auto 24px' }}>
              {filter !== 'ALL'
                ? `You haven't completed any games on ${filter} difficulty yet.`
                : "You haven't completed any Sudoku puzzles yet. Solve a puzzle to record your first score!"}
            </p>
            <Link
              to="/"
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
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1fr 120px 100px 100px 110px',
                padding: '14px 20px',
                borderBottom: '3px solid #0A0A0A',
                background: '#0A0A0A',
                color: 'white',
                fontWeight: 800,
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
              className="score-table-header"
            >
              <span>#</span>
              <span>User</span>
              <span>Difficulty</span>
              <span>Score</span>
              <span>Time</span>
              <span>Mistakes</span>
            </div>

            {/* Score List Items */}
            {filteredScores.map((item, idx) => {
              const diffKey = (item.difficulty || 'MEDIUM').toUpperCase();
              const formattedDate = formatDate(item.createdAt || item.date || item.timestamp);

              return (
                <div
                  key={item.id || idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 120px 100px 100px 110px',
                    padding: '14px 20px',
                    borderBottom: idx < filteredScores.length - 1 ? '1px solid #E5E7EB' : 'none',
                    background: idx % 2 === 0 ? 'white' : '#FFFBF0',
                    alignItems: 'center',
                    transition: 'background 0.1s',
                  }}
                  className="score-table-row"
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF5E6')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#FFFBF0')}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      color: '#9CA3AF',
                      fontSize: '13px',
                    }}
                  >
                    #{idx + 1}
                  </span>

                  <div>
                    <span style={{ fontWeight: 700, fontSize: '14px', display: 'block' }}>
                      {item.username || username}
                    </span>
                    {formattedDate && (
                      <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                        <Calendar size={10} /> {formattedDate}
                      </span>
                    )}
                  </div>

                  <div>
                    <span
                      style={{
                        background: DIFF_COLORS[diffKey] || '#6B7280',
                        color: diffKey === 'EXTREME' ? '#FFD60A' : 'white',
                        border: '1.5px solid #0A0A0A',
                        borderRadius: '6px',
                        padding: '3px 10px',
                        fontSize: '11px',
                        fontWeight: 800,
                        boxShadow: '1px 1px 0 #0A0A0A',
                        display: 'inline-block',
                      }}
                    >
                      {diffKey}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 800,
                      fontSize: '16px',
                      color: '#FF3CAC',
                    }}
                  >
                    {(item.score ?? 0).toLocaleString()}
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 600 }}>
                    <Clock size={13} color="#6B7280" /> {formatTime(item.timeTaken)}
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: (item.mistakes || 0) > 0 ? '#EF4444' : '#22C55E',
                    }}
                  >
                    {(item.mistakes || 0) > 0 ? (
                      <AlertTriangle size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    {item.mistakes || 0} {item.mistakes === 1 ? 'err' : 'errs'}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .score-table-header, .score-table-row {
            grid-template-columns: 40px 1fr 90px 80px !important;
          }
          .score-table-header span:nth-child(5),
          .score-table-header span:nth-child(6),
          .score-table-row > div:nth-child(5),
          .score-table-row > span:nth-child(5),
          .score-table-row > span:nth-child(6) {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({ icon, title, value, bg }) {
  return (
    <div
      style={{
        border: '3px solid #0A0A0A',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '4px 4px 0 #0A0A0A',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
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
        <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', opacity: 0.7, margin: '0 0 2px', letterSpacing: '0.5px' }}>
          {title}
        </p>
        <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: '1.4rem', margin: 0, lineHeight: 1.1 }}>
          {value}
        </p>
      </div>
    </div>
  );
}
