import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Grid3x3,
  Users,
  Zap,
  Trophy,
  Play,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Timer,
  Award,
  Layers,
  Activity,
  Plus,
  HelpCircle,
  BarChart3,
  Swords,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [selectedHeroCell, setSelectedHeroCell] = useState(40); // center cell highlighted in hero

  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    navigate(`/multiplayer?code=${joinCode.trim().toUpperCase()}`);
  };

  // Sample static 9x9 board layout for the hero visual display
  const heroBoard = [
    5, 3, 0, 0, 7, 0, 0, 0, 0,
    6, 0, 0, 1, 9, 5, 0, 0, 0,
    0, 9, 8, 0, 0, 0, 0, 6, 0,
    8, 0, 0, 0, 6, 0, 0, 0, 3,
    4, 0, 0, 8, 5, 3, 0, 0, 1,
    7, 0, 0, 0, 2, 0, 0, 0, 6,
    0, 6, 0, 0, 0, 0, 2, 8, 0,
    0, 0, 0, 4, 1, 9, 0, 0, 5,
    0, 0, 0, 0, 8, 0, 0, 7, 9,
  ];

  // Selected row & col calculation for hero interactive grid
  const selectedRow = Math.floor(selectedHeroCell / 9);
  const selectedCol = selectedHeroCell % 9;

  return (
    <div style={{ minHeight: '100vh', background: '#FFFBF0', color: '#0A0A0A' }}>
      
      {/* Container wrapper */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px 64px' }}>

        {/* ============================================================ */}
        {/* 1. HERO SECTION                                              */}
        {/* ============================================================ */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'center',
            marginBottom: '64px',
            padding: '24px 0',
          }}
        >
          {/* Hero Content Left */}
          <div>
            {/* Tag Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFD60A',
                border: '3px solid #0A0A0A',
                borderRadius: '30px',
                padding: '6px 18px',
                fontWeight: 900,
                fontSize: '12px',
                letterSpacing: '1px',
                boxShadow: '3.5px 3.5px 0 #0A0A0A',
                marginBottom: '20px',
                transform: 'rotate(-1deg)',
              }}
            >
              <Sparkles size={16} color="#0A0A0A" strokeWidth={2.5} />
              <span>NEO-BRUTALIST SUDOKU ARENA</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                letterSpacing: '-2px',
                lineHeight: 1.05,
                margin: '0 0 16px 0',
                color: '#0A0A0A',
              }}
            >
              CRACK THE <br />
              <span
                style={{
                  background: '#FF3CAC',
                  color: 'white',
                  padding: '0 12px',
                  border: '3.5px solid #0A0A0A',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'inline-block',
                  transform: 'rotate(1deg)',
                  marginTop: '4px',
                }}
              >
                GRID.
              </span>
            </h1>

            {/* Subtitle Line */}
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                color: '#0A0A0A',
                marginBottom: '14px',
                lineHeight: 1.3,
              }}
            >
              Think fast. Fill the grid. Beat the clock.
            </p>

            {/* Secondary Description */}
            <p
              style={{
                fontSize: '16px',
                color: '#4B5563',
                fontWeight: 600,
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '32px',
              }}
            >
              Master single-player logic puzzles across 6 difficulty tiers or compete against real opponents in live online 1v1 Sudoku battles.
            </p>

            {/* Quick Hero Badge Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <div
                style={{
                  background: 'white',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: 800,
                  fontSize: '13px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Layers size={16} color="#F97316" strokeWidth={2.5} />
                <span>6 DIFFICULTIES</span>
              </div>

              <div
                style={{
                  background: 'white',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: 800,
                  fontSize: '13px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Zap size={16} color="#22C55E" strokeWidth={2.5} />
                <span>LIVE WEBSOCKET 1v1</span>
              </div>

              <div
                style={{
                  background: 'white',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: 800,
                  fontSize: '13px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Trophy size={16} color="#2563EB" strokeWidth={2.5} />
                <span>GLOBAL RANKINGS</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Sudoku Board Right */}
          <div style={{ position: 'relative' }}>
            {/* Card Background Container */}
            <div
              style={{
                background: 'white',
                border: '4px solid #0A0A0A',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '10px 10px 0 #0A0A0A',
                position: 'relative',
              }}
            >
              {/* Top Board Card Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  paddingBottom: '12px',
                  borderBottom: '3px solid #0A0A0A',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#FF3CAC',
                      border: '1.5px solid #0A0A0A',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#FFD60A',
                      border: '1.5px solid #0A0A0A',
                    }}
                  />
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#22C55E',
                      border: '1.5px solid #0A0A0A',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 800,
                      fontSize: '12px',
                      marginLeft: '6px',
                      color: '#0A0A0A',
                    }}
                  >
                    PUZZLE #804
                  </span>
                </div>

                <div
                  style={{
                    background: '#FFD60A',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '2px 10px',
                    fontSize: '11px',
                    fontWeight: 900,
                    boxShadow: '2px 2px 0 #0A0A0A',
                  }}
                >
                  MEDIUM
                </div>
              </div>

              {/* 9x9 Sudoku Grid Display */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(9, 1fr)',
                  gap: '2px',
                  background: '#0A0A0A',
                  border: '3.5px solid #0A0A0A',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  aspectRatio: '1',
                }}
              >
                {heroBoard.map((val, idx) => {
                  const r = Math.floor(idx / 9);
                  const c = idx % 9;
                  const isSelected = idx === selectedHeroCell;
                  const isRowColHighlight = !isSelected && (r === selectedRow || c === selectedCol);

                  // Color accent rules for decorative visual variety
                  let cellBg = 'white';
                  let textColor = '#0A0A0A';
                  let isGiven = val > 0;

                  if (isSelected) {
                    cellBg = '#FFD60A';
                  } else if (isRowColHighlight) {
                    cellBg = '#FFFBF0';
                  } else if (idx === 12 || idx === 60) {
                    cellBg = 'rgba(255, 60, 172, 0.15)'; // pink tint
                    textColor = '#FF3CAC';
                  } else if (idx === 30 || idx === 48) {
                    cellBg = 'rgba(37, 99, 235, 0.15)'; // blue tint
                    textColor = '#2563EB';
                  } else if (idx === 3 || idx === 75) {
                    cellBg = 'rgba(34, 197, 94, 0.15)'; // green tint
                    textColor = '#166534';
                  }

                  // 3x3 Block Border styles
                  const borderRight = (c === 2 || c === 5) ? '2.5px solid #0A0A0A' : 'none';
                  const borderBottom = (r === 2 || r === 5) ? '2.5px solid #0A0A0A' : 'none';

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedHeroCell(idx)}
                      style={{
                        background: cellBg,
                        color: textColor,
                        fontWeight: isGiven ? 900 : 700,
                        fontSize: 'clamp(12px, 2.5vw, 18px)',
                        fontFamily: isGiven ? "'Space Mono', monospace" : "'Space Grotesk', sans-serif",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight,
                        borderBottom,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'background 0.1s ease',
                      }}
                      title={`Cell (${r+1}, ${c+1})`}
                    >
                      {val > 0 ? val : (idx === 40 ? 5 : '')}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Card Game Status Info */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  paddingTop: '12px',
                  borderTop: '2.5px solid #0A0A0A',
                  fontSize: '12px',
                  fontWeight: 800,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Timer size={15} color="#0A0A0A" strokeWidth={2.5} />
                  <span>TIME: 02:45</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#22C55E" strokeWidth={2.5} />
                  <span>ERRORS: 0/3</span>
                </div>

                <div
                  style={{
                    background: '#F97316',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    border: '1.5px solid #0A0A0A',
                    boxShadow: '1.5px 1.5px 0 #0A0A0A',
                  }}
                >
                  SCORE: 1,450
                </div>
              </div>

              {/* Decorative Sticker Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  background: '#FF3CAC',
                  color: 'white',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  padding: '6px 14px',
                  fontWeight: 900,
                  fontSize: '12px',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  transform: 'rotate(4deg)',
                }}
              >
                INTERACTIVE PREVIEW
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. PRIMARY GAME ACTIONS                                      */}
        {/* ============================================================ */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                margin: '0 0 8px 0',
                color: '#0A0A0A',
              }}
            >
              SELECT GAME MODE
            </h2>
            <p style={{ color: '#4B5563', fontSize: '15px', fontWeight: 700 }}>
              Jump straight into single-player puzzle solving or real-time multiplayer challenges
            </p>
          </div>

          {/* 3 Chunky Main Action Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* BUTTON 1: PLAY SOLO */}
            <div
              style={{
                background: 'white',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '7px 7px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              className="neo-action-card"
            >
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    border: '3px solid #0A0A0A',
                    background: '#FF3CAC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '3.5px 3.5px 0 #0A0A0A',
                    marginBottom: '20px',
                  }}
                >
                  <Grid3x3 size={28} color="white" strokeWidth={2.5} />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#FF3CAC',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}
                >
                  SINGLE PLAYER
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.75rem',
                    margin: '0 0 10px 0',
                    color: '#0A0A0A',
                  }}
                >
                  PLAY SOLO
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#4B5563',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Classic Sudoku puzzle mode. Pick your difficulty tier, track your solve time, and practice your logic.
                </p>
              </div>

              <button
                id="home-play-solo-btn"
                onClick={() => navigate('/classic')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: '#FF3CAC',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                }}
              >
                <Play size={18} fill="white" strokeWidth={2.5} />
                <span>START SOLO GAME</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* BUTTON 2: PLAY ONLINE */}
            <div
              style={{
                background: 'white',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '7px 7px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              className="neo-action-card"
            >
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    border: '3px solid #0A0A0A',
                    background: '#FFD60A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '3.5px 3.5px 0 #0A0A0A',
                    marginBottom: '20px',
                  }}
                >
                  <Swords size={28} color="#0A0A0A" strokeWidth={2.5} />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#B45309',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}
                >
                  LIVE MULTIPLAYER
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.75rem',
                    margin: '0 0 10px 0',
                    color: '#0A0A0A',
                  }}
                >
                  PLAY ONLINE
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#4B5563',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Enter the live multiplayer arena to challenge another player online with real-time WebSocket board synchronization.
                </p>
              </div>

              <button
                id="home-play-online-btn"
                onClick={() => navigate('/multiplayer')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: '#FFD60A',
                  color: '#0A0A0A',
                  fontWeight: 900,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                }}
              >
                <Users size={18} color="#0A0A0A" strokeWidth={2.5} />
                <span>FIND OPPONENT</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* BUTTON 3: CREATE ROOM */}
            <div
              style={{
                background: 'white',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '28px 24px',
                boxShadow: '7px 7px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              className="neo-action-card"
            >
              <div>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    border: '3px solid #0A0A0A',
                    background: '#0A0A0A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '3.5px 3.5px 0 #FFD60A',
                    marginBottom: '20px',
                  }}
                >
                  <Zap size={28} color="#FFD60A" strokeWidth={2.5} />
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#2563EB',
                    letterSpacing: '1px',
                    marginBottom: '4px',
                  }}
                >
                  PRIVATE MATCH
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.75rem',
                    margin: '0 0 10px 0',
                    color: '#0A0A0A',
                  }}
                >
                  CREATE ROOM
                </h3>

                <p
                  style={{
                    fontSize: '14px',
                    color: '#4B5563',
                    fontWeight: 600,
                    lineHeight: 1.5,
                    marginBottom: '24px',
                  }}
                >
                  Generate a custom game room code and invite a friend to compete head-to-head on the same puzzle.
                </p>
              </div>

              <button
                id="home-create-room-btn"
                onClick={() => navigate('/multiplayer?action=create')}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: '#0A0A0A',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '16px',
                  cursor: 'pointer',
                  boxShadow: '4px 4px 0 #FFD60A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.1s ease',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translate(-2px, -2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #FFD60A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translate(0, 0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #FFD60A';
                }}
              >
                <Plus size={18} color="#FFD60A" strokeWidth={2.5} />
                <span>CREATE PRIVATE ROOM</span>
                <ArrowRight size={18} color="#FFD60A" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. GAME MODE COLOR-BLOCK CARDS                               */}
        {/* ============================================================ */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#FF3CAC',
                color: 'white',
                border: '2.5px solid #0A0A0A',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '12px',
                fontWeight: 900,
                boxShadow: '2.5px 2.5px 0 #0A0A0A',
                marginBottom: '8px',
              }}
            >
              FEATURED MODES
            </div>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                margin: 0,
                color: '#0A0A0A',
              }}
            >
              EXPLORE GAME MODES
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {/* CARD 1: SOLO MODE (Orange) */}
            <div
              style={{
                background: '#FFF7ED',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '6px 6px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#F97316',
                    color: 'white',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: '2px 2px 0 #0A0A0A',
                    marginBottom: '16px',
                  }}
                >
                  <Grid3x3 size={14} color="white" strokeWidth={2.5} />
                  <span>SOLO</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    margin: '0 0 8px 0',
                  }}
                >
                  BEAT YOUR BEST TIME.
                </h3>

                <p style={{ fontSize: '13.5px', color: '#4B5563', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>
                  Progress through 6 logic difficulties from Easy to Extreme with real-time error checking and move timers.
                </p>

                {/* Difficulty badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {['Easy', 'Medium', 'Hard', 'Expert', 'Master', 'Extreme'].map((d) => (
                    <span
                      key={d}
                      style={{
                        background: 'white',
                        border: '1.5px solid #0A0A0A',
                        borderRadius: '6px',
                        padding: '2px 7px',
                        fontSize: '10.5px',
                        fontWeight: 800,
                      }}
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/classic"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: '#F97316',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'transform 0.1s ease',
                }}
              >
                <span>PLAY SOLO NOW</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* CARD 2: ONLINE (Yellow) */}
            <div
              style={{
                background: '#FEFCE8',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '6px 6px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FFD60A',
                    color: '#0A0A0A',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: '2px 2px 0 #0A0A0A',
                    marginBottom: '16px',
                  }}
                >
                  <Swords size={14} color="#0A0A0A" strokeWidth={2.5} />
                  <span>ONLINE MATCH</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    margin: '0 0 8px 0',
                  }}
                >
                  CHALLENGE ANOTHER PLAYER.
                </h3>

                <p style={{ fontSize: '13.5px', color: '#4B5563', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>
                  Race head-to-head against another player in real time. Watch their grid fill up live on your screen.
                </p>
              </div>

              <Link
                to="/multiplayer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: '#FFD60A',
                  color: '#0A0A0A',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'transform 0.1s ease',
                }}
              >
                <span>MATCHMAKING</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* CARD 3: PRIVATE ROOM (Blue) */}
            <div
              style={{
                background: '#EFF6FF',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '6px 6px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#2563EB',
                    color: 'white',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: '2px 2px 0 #0A0A0A',
                    marginBottom: '16px',
                  }}
                >
                  <Users size={14} color="white" strokeWidth={2.5} />
                  <span>PRIVATE ROOM</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    margin: '0 0 8px 0',
                  }}
                >
                  INVITE A FRIEND.
                </h3>

                <p style={{ fontSize: '13.5px', color: '#4B5563', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>
                  Create a custom room with a unique 6-character code and share it with a friend for a 1v1 duel.
                </p>
              </div>

              <Link
                to="/multiplayer?action=create"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: '#2563EB',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'transform 0.1s ease',
                }}
              >
                <span>CREATE PRIVATE ROOM</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>

            {/* CARD 4: LEADERBOARD & AWARDS (Pink) */}
            <div
              style={{
                background: '#FDF2F8',
                border: '3.5px solid #0A0A0A',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '6px 6px 0 #0A0A0A',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FF3CAC',
                    color: 'white',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontWeight: 900,
                    fontSize: '11px',
                    boxShadow: '2px 2px 0 #0A0A0A',
                    marginBottom: '16px',
                  }}
                >
                  <Trophy size={14} color="white" strokeWidth={2.5} />
                  <span>RANKINGS & XP</span>
                </div>

                <h3
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    margin: '0 0 8px 0',
                  }}
                >
                  TRACK YOUR PROGRESS.
                </h3>

                <p style={{ fontSize: '13.5px', color: '#4B5563', fontWeight: 600, lineHeight: 1.5, marginBottom: '20px' }}>
                  Earn XP for every solved puzzle, unlock unique achievements, and climb the global Sudoku leaderboards.
                </p>
              </div>

              <Link
                to="/leaderboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '10px',
                  background: '#FF3CAC',
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '13.5px',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  transition: 'transform 0.1s ease',
                }}
              >
                <span>VIEW LEADERBOARD</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. LIVE MULTIPLAYER SECTION (VS DISPLAY & ROOM JOIN)          */}
        {/* ============================================================ */}
        <section
          style={{
            background: 'white',
            border: '4px solid #0A0A0A',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '10px 10px 0 #0A0A0A',
            marginBottom: '64px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#FFD60A',
                border: '2.5px solid #0A0A0A',
                borderRadius: '20px',
                padding: '4px 14px',
                fontWeight: 900,
                fontSize: '12px',
                boxShadow: '2.5px 2.5px 0 #0A0A0A',
                marginBottom: '10px',
              }}
            >
              <Zap size={14} color="#0A0A0A" strokeWidth={2.5} />
              <span>REAL-TIME STOMP WEBSOCKETS</span>
            </div>

            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                margin: '0 0 8px 0',
                color: '#0A0A0A',
              }}
            >
              READY TO CHALLENGE SOMEONE?
            </h2>

            <p style={{ color: '#4B5563', fontSize: '15px', fontWeight: 600, maxWidth: '560px', margin: '0 auto' }}>
              Face off in live 1v1 battles. Solvers see each other&apos;s progress in real-time as cells are completed!
            </p>
          </div>

          {/* VS Boards Visual Comparison */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              gap: '20px',
              alignItems: 'center',
              maxWidth: '850px',
              margin: '0 auto 36px',
            }}
            className="neo-vs-container"
          >
            {/* Player 1 Card */}
            <div
              style={{
                background: '#FFFBF0',
                border: '3px solid #0A0A0A',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '4px 4px 0 #0A0A0A',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#22C55E',
                  color: 'white',
                  border: '2px solid #0A0A0A',
                  borderRadius: '6px',
                  padding: '2px 10px',
                  fontSize: '11px',
                  fontWeight: 900,
                  marginBottom: '10px',
                }}
              >
                <CheckCircle2 size={12} strokeWidth={2.5} />
                PLAYER 1 (YOU)
              </div>

              {/* Mini Grid representation */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '3px',
                  background: '#0A0A0A',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '8px',
                  padding: '3px',
                  maxWidth: '150px',
                  margin: '0 auto 12px',
                }}
              >
                {[5, 3, 4, 6, 7, 2, 1, 9, 8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      background: i < 7 ? '#DCFCE7' : 'white',
                      fontWeight: 900,
                      fontSize: '13px',
                      padding: '8px 0',
                      color: i < 7 ? '#15803D' : '#0A0A0A',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {n}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ fontSize: '12px', fontWeight: 900, marginBottom: '4px' }}>
                78% COMPLETED
              </div>
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: '#E5E7EB',
                  border: '2px solid #0A0A0A',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '78%', height: '100%', background: '#22C55E' }} />
              </div>
            </div>

            {/* VS Badge */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#FF3CAC',
                color: 'white',
                border: '3.5px solid #0A0A0A',
                boxShadow: '4px 4px 0 #0A0A0A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontFamily: "'Space Mono', monospace",
                fontSize: '1.25rem',
                transform: 'rotate(-4deg)',
                margin: '0 auto',
              }}
            >
              VS
            </div>

            {/* Player 2 Card */}
            <div
              style={{
                background: '#FFFBF0',
                border: '3px solid #0A0A0A',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '4px 4px 0 #0A0A0A',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#3B82F6',
                  color: 'white',
                  border: '2px solid #0A0A0A',
                  borderRadius: '6px',
                  padding: '2px 10px',
                  fontSize: '11px',
                  fontWeight: 900,
                  marginBottom: '10px',
                }}
              >
                <Users size={12} strokeWidth={2.5} />
                PLAYER 2 (OPPONENT)
              </div>

              {/* Mini Grid representation */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '3px',
                  background: '#0A0A0A',
                  border: '2.5px solid #0A0A0A',
                  borderRadius: '8px',
                  padding: '3px',
                  maxWidth: '150px',
                  margin: '0 auto 12px',
                }}
              >
                {[5, 3, 4, 6, 0, 2, 1, 0, 8].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      background: n > 0 ? '#DBEAFE' : 'white',
                      fontWeight: 900,
                      fontSize: '13px',
                      padding: '8px 0',
                      color: n > 0 ? '#1E40AF' : '#0A0A0A',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {n > 0 ? n : ''}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div style={{ fontSize: '12px', fontWeight: 900, marginBottom: '4px' }}>
                64% COMPLETED
              </div>
              <div
                style={{
                  width: '100%',
                  height: '10px',
                  background: '#E5E7EB',
                  border: '2px solid #0A0A0A',
                  borderRadius: '10px',
                  overflow: 'hidden',
                }}
              >
                <div style={{ width: '64%', height: '100%', background: '#3B82F6' }} />
              </div>
            </div>
          </div>

          {/* Join Code Input Form */}
          <div
            style={{
              background: '#FFFBF0',
              border: '3.5px solid #0A0A0A',
              borderRadius: '14px',
              padding: '24px',
              boxShadow: '5px 5px 0 #0A0A0A',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <form onSubmit={handleJoinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label
                style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  color: '#0A0A0A',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Zap size={16} color="#F97316" strokeWidth={2.5} />
                ENTER MULTIPLAYER ROOM CODE TO JOIN:
              </label>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="E.G. ABC123"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    padding: '12px 16px',
                    border: '3px solid #0A0A0A',
                    borderRadius: '10px',
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 900,
                    fontSize: '16px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    outline: 'none',
                    background: 'white',
                    boxShadow: '3px 3px 0 #0A0A0A',
                  }}
                />

                <button
                  type="submit"
                  disabled={!joinCode.trim()}
                  style={{
                    padding: '12px 24px',
                    border: '3px solid #0A0A0A',
                    borderRadius: '10px',
                    background: '#FFD60A',
                    color: '#0A0A0A',
                    fontWeight: 900,
                    fontSize: '15px',
                    cursor: !joinCode.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: '3px 3px 0 #0A0A0A',
                    opacity: !joinCode.trim() ? 0.5 : 1,
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'all 0.1s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>JOIN MATCH</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '2px dashed #0A0A0A' }}>
              <button
                onClick={() => navigate('/multiplayer?action=create')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563EB',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Or click here to create a new multiplayer room
              </button>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. FEATURES SECTION                                          */}
        {/* ============================================================ */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 900,
                fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
                margin: '0 0 8px 0',
                color: '#0A0A0A',
              }}
            >
              BUILT FOR PUZZLE MASTERS
            </h2>
            <p style={{ color: '#4B5563', fontSize: '15px', fontWeight: 600 }}>
              Packed with powerful features designed for both solo speed-solvers and competitive players
            </p>
          </div>

          {/* 6 Feature Blocks Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              {
                icon: Zap,
                color: '#FFD60A',
                title: 'REAL-TIME MULTIPLAYER',
                desc: 'WebSocket STOMP protocol enables split-second board synchronization and live game status during 1v1 matches.',
              },
              {
                icon: ShieldCheck,
                color: '#22C55E',
                title: 'SMART VALIDATION',
                desc: 'Instant backend validation checks move validity without spoiling solutions, tracking allowed mistakes.',
              },
              {
                icon: Layers,
                color: '#F97316',
                title: 'DIFFERENT DIFFICULTIES',
                desc: 'From Easy warmup puzzles to extreme Master challenges built for seasoned Sudoku tacticians.',
              },
              {
                icon: Timer,
                color: '#3B82F6',
                title: 'TIME-BASED CHALLENGES',
                desc: 'Precision stopwatch timing rewards fast solves with maximum XP and high leaderboard rankings.',
              },
              {
                icon: Activity,
                color: '#FF3CAC',
                title: 'LIVE GAME STATE',
                desc: 'Observe your opponent&apos;s active board progress, total mistakes, and completion rate in real time.',
              },
              {
                icon: Award,
                color: '#7C3AED',
                title: 'SCORE & XP TRACKING',
                desc: 'Earn experience points, level up your profile, unlock badges, and claim your place on global leaderboards.',
              },
            ].map((feat, index) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '3px solid #0A0A0A',
                    borderRadius: '14px',
                    padding: '24px',
                    boxShadow: '5px 5px 0 #0A0A0A',
                    transition: 'transform 0.15s ease',
                  }}
                  className="neo-feature-card"
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      border: '2.5px solid #0A0A0A',
                      background: feat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '3px 3px 0 #0A0A0A',
                      marginBottom: '16px',
                    }}
                  >
                    <IconComp size={24} color="#0A0A0A" strokeWidth={2.5} />
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      margin: '0 0 8px 0',
                      color: '#0A0A0A',
                    }}
                  >
                    {feat.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '13.5px',
                      color: '#4B5563',
                      fontWeight: 600,
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* ============================================================ */}
      {/* 6. FOOTER                                                     */}
      {/* ============================================================ */}
      <footer
        style={{
          background: 'white',
          borderTop: '4px solid #0A0A0A',
          padding: '48px 16px 32px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              paddingBottom: '32px',
              borderBottom: '3px solid #0A0A0A',
            }}
          >
            {/* Footer Brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#FFD60A',
                  border: '3px solid #0A0A0A',
                  borderRadius: '10px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Grid3x3 size={22} color="#0A0A0A" strokeWidth={2.5} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      color: '#FF3CAC',
                    }}
                  >
                    SUDO
                  </span>
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 900,
                      fontSize: '1.3rem',
                      color: '#0A0A0A',
                    }}
                  >
                    KU
                  </span>
                </div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280' }}>
                  NEO-BRUTALIST PUZZLE ARENA
                </div>
              </div>
            </div>

            {/* Quick Footer Nav Links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <Link
                to="/classic"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                PLAY SOLO
              </Link>

              <Link
                to="/multiplayer"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                MULTIPLAYER
              </Link>

              <Link
                to="/leaderboard"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                LEADERBOARD
              </Link>

              <Link
                to="/rules"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                HOW TO PLAY
              </Link>

              <Link
                to="/my-scores"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                MY SCORES
              </Link>

              <Link
                to="/awards"
                style={{ color: '#0A0A0A', fontWeight: 800, fontSize: '13.5px', textDecoration: 'none' }}
              >
                ACHIEVEMENTS
              </Link>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              fontSize: '13px',
              color: '#6B7280',
              fontWeight: 700,
            }}
          >
            <div>
              &copy; {new Date().getFullYear()} Sudoku Arena. All rights reserved. Neo-Brutalist Game UI.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>Think fast. Fill the grid.</span>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22C55E',
                  border: '1.5px solid #0A0A0A',
                }}
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Hover Effects CSS */}
      <style>{`
        .neo-action-card:hover {
          transform: translateY(-4px);
          box-shadow: 10px 10px 0 #0A0A0A !important;
        }
        .neo-feature-card:hover {
          transform: translateY(-3px);
          box-shadow: 7px 7px 0 #0A0A0A !important;
        }
        @media (max-width: 768px) {
          .neo-vs-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

