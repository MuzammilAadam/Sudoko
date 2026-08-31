import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Medal, Crown, Clock, AlertTriangle, Star, Loader2 } from 'lucide-react';
import { fetchLeaderboard } from '../services/sudokuApi';
import { clearAuth } from '../services/authApi';

const PODIUM_COLORS = ['#FFD60A', '#C0C0C0', '#CD7F32'];
const PODIUM_ICONS = [<Crown size={28} key="crown" />, <Medal size={24} key="m1" />, <Medal size={22} key="m2" />];
const DIFF_COLORS = { EASY: '#22C55E', MEDIUM: '#3B82F6', HARD: '#F97316', EXPERT: '#EF4444', MASTER: '#7C3AED', EXTREME: '#0A0A0A' };

const formatTime = (seconds) => {
  if (seconds === undefined || seconds === null) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const navigate = useNavigate();

  const loadLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeaderboard();
      if (Array.isArray(data)) {
        setEntries(data);
      } else {
        setEntries([]);
      }
    } catch (err) {
      if (
        err.status === 401 ||
        err.status === 403 ||
        err.message?.includes('Session expired') ||
        err.message?.includes('unauthorized') ||
        err.message?.includes('401') ||
        err.message?.includes('403')
      ) {
        clearAuth();
        localStorage.removeItem('sudoku_jwt');
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load leaderboard data.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];
  const filtered = filter === 'ALL'
    ? entries
    : entries.filter((e) => e.difficulty && e.difficulty.toUpperCase() === filter);

  const top3 = filtered.slice(0, 3);

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* ── Page Title ── */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              marginBottom: '8px',
            }}
          >
            Leaderboard
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            The fastest, the boldest, the best puzzle solvers.
          </p>
        </div>

        {/* ── Filter tabs ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '28px',
            justifyContent: 'center',
          }}
        >
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              style={{
                padding: '8px 16px',
                border: '2px solid #0A0A0A',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer',
                background: filter === d ? (DIFF_COLORS[d] || '#FF3CAC') : 'white',
                color: filter === d ? 'white' : '#0A0A0A',
                boxShadow: filter === d ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
                transition: 'all 0.1s',
              }}
            >
              {d}
            </button>
          ))}
        </div>

        {/* ── Error Alert ── */}
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
              onClick={loadLeaderboard}
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

        {/* ── Loading State ── */}
        {loading ? (
          <div
            className="neo-card"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: 'white',
              marginBottom: '28px',
            }}
          >
            <Loader2 size={40} className="animate-spin" color="#FF3CAC" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1.1rem' }}>
              Loading leaderboard data...
            </p>
          </div>
        ) : (
          <>
            {/* ── Top 3 Podium ── */}
            {top3.length >= 3 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  marginBottom: '28px',
                }}
              >
                {/* Rearrange: 2nd left, 1st center, 3rd right */}
                {[top3[1], top3[0], top3[2]].map((entry, idx) => {
                  const defaultRank = [2, 1, 3][idx];
                  const rankVal = entry?.rank ?? defaultRank;
                  const height = ['160px', '200px', '140px'][idx];
                  const bg = PODIUM_COLORS[(rankVal - 1) % 3] || PODIUM_COLORS[0];
                  const username = entry?.username || entry?.player || 'Player';
                  const score = entry?.score ?? 0;

                  return (
                    <div
                      key={rankVal + '-' + username}
                      className="neo-card"
                      style={{
                        padding: '20px 12px',
                        textAlign: 'center',
                        background: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        minHeight: height,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          border: '3px solid #0A0A0A',
                          borderRadius: '50%',
                          background: bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '8px',
                          boxShadow: '3px 3px 0 #0A0A0A',
                          color: rankVal === 2 ? '#0A0A0A' : 'white',
                        }}
                      >
                        {PODIUM_ICONS[(rankVal - 1) % 3] || PODIUM_ICONS[0]}
                      </div>
                      <p style={{ fontWeight: 800, fontSize: '14px', marginBottom: '2px' }}>{username}</p>
                      <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '18px', color: '#FF3CAC' }}>
                        {score.toLocaleString()}
                      </p>
                      {(entry?.timeTaken != null || entry?.time) && (
                        <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>
                          {formatTime(entry.timeTaken) || entry.time} · {entry.mistakes ?? 0} err
                        </p>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: bg,
                          border: '2px solid #0A0A0A',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '12px',
                        }}
                      >
                        #{rankVal}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Full Table ── */}
            <div className="neo-card" style={{ overflow: 'hidden' }}>
              {/* Table header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '50px 1fr 100px 90px 80px 90px',
                  padding: '14px 20px',
                  borderBottom: '3px solid #0A0A0A',
                  background: '#0A0A0A',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '11px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <span>#</span>
                <span>Player</span>
                <span>Difficulty</span>
                <span>Time</span>
                <span>Mistakes</span>
                <span>Score</span>
              </div>

              {filtered.map((entry, i) => {
                const rankVal = entry.rank ?? (i + 1);
                const username = entry.username || entry.player || 'Player';
                const score = entry.score ?? 0;

                return (
                  <div
                    key={entry.id || username + '-' + rankVal}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50px 1fr 100px 90px 80px 90px',
                      padding: '14px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid #E5E7EB' : 'none',
                      background: i % 2 === 0 ? 'white' : '#FFFBF0',
                      alignItems: 'center',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF5E6')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#FFFBF0')}
                  >
                    <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: rankVal <= 3 ? (PODIUM_COLORS[rankVal - 1] || '#FFD60A') : '#9CA3AF' }}>
                      #{rankVal}
                    </span>
                    <span style={{ fontWeight: 700 }}>{username}</span>
                    <span>
                      {entry.difficulty ? (
                        <span
                          style={{
                            background: DIFF_COLORS[entry.difficulty] || '#6B7280',
                            color: 'white',
                            border: '1px solid #0A0A0A',
                            borderRadius: '4px',
                            padding: '2px 8px',
                            fontSize: '10px',
                            fontWeight: 700,
                          }}
                        >
                          {entry.difficulty}
                        </span>
                      ) : (
                        <span style={{ color: '#9CA3AF', fontSize: '12px' }}>—</span>
                      )}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                      {(entry.timeTaken != null || entry.time) ? <><Clock size={12} /> {formatTime(entry.timeTaken) || entry.time}</> : <span style={{ color: '#9CA3AF' }}>—</span>}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: (entry.mistakes || 0) > 0 ? '#EF4444' : '#22C55E' }}>
                      {entry.mistakes !== undefined ? <><AlertTriangle size={12} /> {entry.mistakes}</> : <span style={{ color: '#9CA3AF' }}>—</span>}
                    </span>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#FF3CAC' }}>
                      {score.toLocaleString()}
                    </span>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
                  No leaderboard entries found.
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </main>
  );
}

