import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Grid3x3, Users, Zap, Trophy, Play, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    navigate(`/multiplayer?code=${joinCode.trim().toUpperCase()}`);
  };

  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── HERO / LANDING SECTION ── */}
        <section
          style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: '48px',
            padding: '40px 20px',
          }}
        >
          {/* Subtle Decorative Background Sudoku Grid (Non-functional Visual Pattern) */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-3deg)',
              width: '100%',
              maxWidth: '650px',
              height: '240px',
              opacity: 0.07,
              pointerEvents: 'none',
              zIndex: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(9, 1fr)',
              gap: '2px',
              background: '#0A0A0A',
              border: '4px solid #0A0A0A',
              borderRadius: '16px',
              padding: '2px',
            }}
            aria-hidden="true"
          >
            {[
              5, 3, 4, 6, 7, 8, 9, 1, 2,
              6, 7, 2, 1, 9, 5, 3, 4, 8,
              1, 9, 8, 3, 4, 2, 5, 6, 7,
              8, 5, 9, 7, 6, 1, 4, 2, 3,
              4, 2, 6, 8, 5, 3, 7, 9, 1,
              7, 1, 3, 9, 2, 4, 8, 5, 6,
              9, 6, 1, 5, 3, 7, 2, 8, 4,
              2, 8, 7, 4, 1, 9, 6, 3, 5,
              3, 4, 5, 2, 8, 6, 1, 7, 9,
            ].map((n, idx) => (
              <div
                key={idx}
                style={{
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '14px',
                  color: '#0A0A0A',
                }}
              >
                {n}
              </div>
            ))}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Small Neo Brutalist Platform Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFD60A',
                border: '2.5px solid #0A0A0A',
                borderRadius: '30px',
                padding: '4px 16px',
                fontWeight: 800,
                fontSize: '12px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                boxShadow: '3px 3px 0 #0A0A0A',
                marginBottom: '16px',
              }}
            >
              <Sparkles size={14} color="#0A0A0A" /> NEO-BRUTALIST SUDOKU ARENA
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(3rem, 8vw, 5.5rem)',
                letterSpacing: '-2px',
                margin: '0 0 8px 0',
                color: '#0A0A0A',
                lineHeight: 1,
              }}
            >
              <span style={{ color: '#FF3CAC' }}>SUDO</span>
              <span style={{ color: '#0A0A0A' }}>KU</span>
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#0A0A0A',
                marginBottom: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              Think. Solve. Compete.
            </p>

            <p
              style={{
                color: '#4B5563',
                fontSize: 'clamp(14px, 2vw, 16px)',
                maxWidth: '560px',
                margin: '0 auto',
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              Master single-player logic puzzles or test your speed against real players in live online multiplayer battles.
            </p>
          </div>
        </section>

        {/* ── PRIMARY QUESTION & MODE SELECTION ── */}
        <section>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
                margin: '0 0 6px 0',
                color: '#0A0A0A',
              }}
            >
              How do you want to play?
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', fontWeight: 600 }}>
              Select a game mode below to jump into the action
            </p>
          </div>

          {/* ── TWO LARGE GAME MODE CARDS ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              alignItems: 'stretch',
            }}
          >
            {/* CARD 1: CLASSIC */}
            <div
              className="neo-card-interactive"
              style={{
                background: 'white',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: '8px 8px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Card Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#FFFBF0',
                  border: '2px solid #0A0A0A',
                  borderRadius: '20px',
                  padding: '2px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  boxShadow: '2px 2px 0 #0A0A0A',
                }}
              >
                SINGLE PLAYER
              </div>

              <div>
                {/* Mode Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    border: '3px solid #0A0A0A',
                    background: '#FF3CAC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0 #0A0A0A',
                    marginBottom: '20px',
                  }}
                >
                  <Grid3x3 size={32} color="white" />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '2rem',
                    margin: '0 0 10px 0',
                    color: '#0A0A0A',
                  }}
                >
                  CLASSIC
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '15px',
                    color: '#4B5563',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Solve Sudoku at your own pace and improve your skills.
                </p>

                {/* Visual hint about difficulty */}
                <div style={{ marginBottom: '32px' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '1px',
                      marginBottom: '8px',
                    }}
                  >
                    Difficulty Range: <span style={{ color: '#0A0A0A' }}>Easy → Extreme</span>
                  </div>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {[
                      { name: 'Easy', bg: '#22C55E' },
                      { name: 'Medium', bg: '#3B82F6' },
                      { name: 'Hard', bg: '#F97316' },
                      { name: 'Expert', bg: '#EF4444' },
                      { name: 'Master', bg: '#7C3AED' },
                      { name: 'Extreme', bg: '#0A0A0A', color: '#FFD60A' },
                    ].map((d) => (
                      <span
                        key={d.name}
                        style={{
                          background: d.bg,
                          color: d.color || 'white',
                          border: '1.5px solid #0A0A0A',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          boxShadow: '1.5px 1.5px 0 #0A0A0A',
                        }}
                      >
                        {d.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                id="play-classic-card-btn"
                onClick={() => navigate('/classic')}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: '#FF3CAC',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '17px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '5px 5px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.1s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
                }}
              >
                <Play size={20} fill="white" />
                PLAY CLASSIC
                <ArrowRight size={20} />
              </button>
            </div>

            {/* CARD 2: MULTIPLAYER */}
            <div
              className="neo-card-interactive"
              style={{
                background: 'white',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '32px 28px',
                boxShadow: '8px 8px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Card Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#FFD60A',
                  border: '2px solid #0A0A0A',
                  borderRadius: '20px',
                  padding: '2px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  boxShadow: '2px 2px 0 #0A0A0A',
                }}
              >
                REAL-TIME MATCH
              </div>

              <div>
                {/* Mode Icon */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    border: '3px solid #0A0A0A',
                    background: '#FFD60A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '4px 4px 0 #0A0A0A',
                    marginBottom: '20px',
                  }}
                >
                  <Users size={32} color="#0A0A0A" />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '2rem',
                    margin: '0 0 10px 0',
                    color: '#0A0A0A',
                  }}
                >
                  MULTIPLAYER
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontSize: '15px',
                    color: '#4B5563',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Challenge another player and compete in real time.
                </p>

                {/* Small Indicators */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#DCFCE7',
                      border: '2px solid #0A0A0A',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#15803D',
                      boxShadow: '2px 2px 0 #0A0A0A',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#22C55E',
                        display: 'inline-block',
                      }}
                      className="animate-pulse"
                    />
                    ⚡ Live WebSocket
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: '#FEF3C7',
                      border: '2px solid #0A0A0A',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      fontWeight: 800,
                      color: '#B45309',
                      boxShadow: '2px 2px 0 #0A0A0A',
                    }}
                  >
                    <Trophy size={14} color="#B45309" /> 🏆 Competitive
                  </div>
                </div>

                {/* Join Code Input Form */}
                <form onSubmit={handleJoinSubmit} style={{ marginBottom: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      color: '#6B7280',
                      letterSpacing: '0.5px',
                      marginBottom: '6px',
                    }}
                  >
                    Enter Room Code to Join:
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. ABC123"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '2.5px solid #0A0A0A',
                        borderRadius: '8px',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 800,
                        fontSize: '15px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        outline: 'none',
                        background: '#FFFBF0',
                        boxShadow: '2px 2px 0 #0A0A0A',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!joinCode.trim()}
                      style={{
                        padding: '10px 16px',
                        border: '2.5px solid #0A0A0A',
                        borderRadius: '8px',
                        background: '#FFD60A',
                        fontWeight: 800,
                        fontSize: '14px',
                        cursor: !joinCode.trim() ? 'not-allowed' : 'pointer',
                        boxShadow: '2px 2px 0 #0A0A0A',
                        opacity: !joinCode.trim() ? 0.5 : 1,
                        fontFamily: "'Space Grotesk', sans-serif",
                        transition: 'all 0.1s ease',
                      }}
                    >
                      JOIN ROOM
                    </button>
                  </div>
                </form>
              </div>

              {/* Action: Create Room Button */}
              <button
                id="create-room-card-btn"
                onClick={() => navigate('/multiplayer?action=create')}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: '#0A0A0A',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '17px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '5px 5px 0 #FFD60A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.1s ease',
                  marginTop: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '7px 7px 0 #FFD60A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '5px 5px 0 #FFD60A';
                }}
              >
                <Zap size={20} color="#FFD60A" />
                CREATE ROOM
                <ArrowRight size={20} color="#FFD60A" />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Hover effect styles */}
      <style>{`
        .neo-card-interactive:hover {
          transform: translateY(-4px);
        }
      `}</style>
    </main>
  );
}
