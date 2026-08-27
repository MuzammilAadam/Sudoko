import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Clock, AlertTriangle, Star } from 'lucide-react';
import { fetchLeaderboard } from '../services/sudokuApi';

// ── Placeholder data for UI demonstration ────────────────────
const PLACEHOLDER_ENTRIES = [
  { rank: 1, player: 'xoxo_pixel', difficulty: 'EXTREME', time: '04:12', mistakes: 0, score: 9850 },
  { rank: 2, player: 'sudoku_witch', difficulty: 'MASTER', time: '05:33', mistakes: 0, score: 8700 },
  { rank: 3, player: 'neo_solver', difficulty: 'EXPERT', time: '06:50', mistakes: 1, score: 7600 },
  { rank: 4, player: 'gridmaster99', difficulty: 'HARD', time: '08:14', mistakes: 0, score: 6400 },
  { rank: 5, player: 'puzzlequeen', difficulty: 'EXTREME', time: '09:02', mistakes: 2, score: 6100 },
  { rank: 6, player: 'byte_ninja', difficulty: 'MASTER', time: '10:05', mistakes: 1, score: 5800 },
  { rank: 7, player: 'the_logician', difficulty: 'HARD', time: '11:20', mistakes: 0, score: 5400 },
  { rank: 8, player: 'inkdrop_7', difficulty: 'MEDIUM', time: '07:45', mistakes: 0, score: 4900 },
  { rank: 9, player: 'ciphercat', difficulty: 'EXPERT', time: '12:30', mistakes: 2, score: 4500 },
  { rank: 10, player: 'retro_geek', difficulty: 'HARD', time: '13:00', mistakes: 1, score: 4200 },
];

const PODIUM_COLORS = ['#FFD60A', '#C0C0C0', '#CD7F32'];
const PODIUM_ICONS = [<Crown size={28} />, <Medal size={24} />, <Medal size={22} />];
const DIFF_COLORS = { EASY: '#22C55E', MEDIUM: '#3B82F6', HARD: '#F97316', EXPERT: '#EF4444', MASTER: '#7C3AED', EXTREME: '#0A0A0A' };

export default function Leaderboard() {
  const [entries, setEntries] = useState(PLACEHOLDER_ENTRIES);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    // Attempt to fetch real data; fall back to placeholder
    setLoading(true);
    fetchLeaderboard()
      .then((data) => { if (Array.isArray(data) && data.length > 0) setEntries(data); })
      .catch(() => { /* backend not ready; placeholder stays */ })
      .finally(() => setLoading(false));
  }, []);

  const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];
  const filtered = filter === 'ALL' ? entries : entries.filter((e) => e.difficulty === filter);
  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

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
              const realRank = [2, 1, 3][idx];
              const height = ['160px', '200px', '140px'][idx];
              const bg = PODIUM_COLORS[realRank - 1];
              return (
                <div
                  key={realRank}
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
                      color: realRank === 2 ? '#0A0A0A' : 'white',
                    }}
                  >
                    {PODIUM_ICONS[realRank - 1]}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '14px', marginBottom: '2px' }}>{entry?.player}</p>
                  <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '18px', color: '#FF3CAC' }}>
                    {entry?.score?.toLocaleString()}
                  </p>
                  <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{entry?.time} · {entry?.mistakes} err</p>
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
                    #{realRank}
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

          {filtered.map((entry, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '50px 1fr 100px 90px 80px 90px',
                padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid #E5E7EB' : 'none',
                background: i % 2 === 0 ? 'white' : '#FFFBF0',
                alignItems: 'center',
                transition: 'background 0.1s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#FFF5E6'}
              onMouseLeave={(e) => e.currentTarget.style.background = i % 2 === 0 ? 'white' : '#FFFBF0'}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: entry.rank <= 3 ? PODIUM_COLORS[entry.rank - 1] : '#9CA3AF' }}>
                #{entry.rank}
              </span>
              <span style={{ fontWeight: 700 }}>{entry.player}</span>
              <span>
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
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                <Clock size={12} /> {entry.time}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: entry.mistakes > 0 ? '#EF4444' : '#22C55E' }}>
                <AlertTriangle size={12} /> {entry.mistakes}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: '#FF3CAC' }}>
                {entry.score?.toLocaleString()}
              </span>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>
              No entries for this difficulty yet.
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '16px' }}>
          * Leaderboard data shown is demo data. Live backend integration coming soon.
        </p>
      </div>
    </main>
  );
}
