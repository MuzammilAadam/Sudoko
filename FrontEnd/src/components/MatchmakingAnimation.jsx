import { useState, useEffect } from 'react';
import { User, Shield, Check, Sparkles } from 'lucide-react';

/**
 * 3x3 Mini Sudoku Grid for Matchmaking Search Animation
 * Subtle sequential scan across cells [7, , 3], [ , 5, ], [2, , 9]
 * Neo-Brutalist retro arcade aesthetic with no emojis.
 */
export function SudokuSearchGrid() {
  const [activeCell, setActiveCell] = useState(0);

  // Initial numbers layout inspired by classical Sudoku clues
  const cells = [
    { num: 7, isClue: true },
    { num: '', isClue: false },
    { num: 3, isClue: true },
    { num: '', isClue: false },
    { num: 5, isClue: true },
    { num: '', isClue: false },
    { num: 2, isClue: true },
    { num: '', isClue: false },
    { num: 9, isClue: true },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCell((prev) => (prev + 1) % 9);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 48px)',
          gridTemplateRows: 'repeat(3, 48px)',
          gap: '6px',
          padding: '10px',
          background: '#FFFBF0',
          border: '3px solid #0A0A0A',
          borderRadius: '12px',
          boxShadow: '5px 5px 0 #0A0A0A',
        }}
      >
        {cells.map((cell, index) => {
          const isScanning = activeCell === index;
          return (
            <div
              key={index}
              style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.25rem',
                border: '2px solid #0A0A0A',
                borderRadius: '6px',
                background: isScanning
                  ? '#FFD60A'
                  : cell.isClue
                  ? '#FFFFFF'
                  : '#F5EED8',
                color: '#0A0A0A',
                transform: isScanning ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isScanning ? '2px 2px 0 #0A0A0A' : 'none',
                transition: 'all 0.18s ease-in-out',
                position: 'relative',
              }}
            >
              {cell.isClue ? (
                cell.num
              ) : isScanning ? (
                <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 700 }}>?</span>
              ) : (
                ''
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle pulse scanner bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22C55E',
            border: '1.5px solid #0A0A0A',
            boxShadow: '0 0 8px #22C55E',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: '#4B5563',
          }}
        >
          SCANNING FOR PLAYERS...
        </span>
      </div>
    </div>
  );
}

/**
 * MatchFoundTransition — Short 1-2s transition screen shown when MATCH_FOUND arrives
 * Features strong VS treatment between Player 1 (You) and Player 2 (Opponent)
 */
export function MatchFoundTransition({ currentUsername, opponent }) {
  const readyGrid = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div
      className="animate-bounce-in"
      style={{
        padding: '28px 20px',
        textAlign: 'center',
        background: '#FFFBF0',
        borderRadius: '12px',
        border: '3px solid #0A0A0A',
        boxShadow: '6px 6px 0 #0A0A0A',
      }}
    >
      {/* Top Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#22C55E',
          color: 'white',
          border: '2px solid #0A0A0A',
          padding: '4px 14px',
          borderRadius: '20px',
          fontWeight: 800,
          fontSize: '12px',
          fontFamily: "'Space Mono', monospace",
          boxShadow: '3px 3px 0 #0A0A0A',
          marginBottom: '14px',
        }}
      >
        <Check size={16} strokeWidth={3} /> OPPONENT FOUND
      </div>

      <h2
        style={{
          fontFamily: "'Space Mono', monospace",
          fontWeight: 900,
          fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
          margin: '0 0 6px 0',
          color: '#0A0A0A',
          letterSpacing: '0.5px',
        }}
      >
        MATCH FOUND
      </h2>

      <p style={{ color: '#4B5563', fontSize: '14px', fontWeight: 700, margin: '0 0 24px 0' }}>
        A PLAYER HAS JOINED THE GAME
      </p>

      {/* ── Strong VS Treatment ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '28px',
        }}
      >
        {/* Player 1 Card (You) */}
        <div
          style={{
            flex: '1 1 200px',
            maxWidth: '240px',
            background: 'white',
            border: '3px solid #0A0A0A',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '4px 4px 0 #0A0A0A',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px',
            }}
          >
            PLAYER 1
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <User size={18} color="#FF3CAC" />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#0A0A0A',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {currentUsername}
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              background: '#FF3CAC',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1.5px solid #0A0A0A',
              display: 'inline-block',
            }}
          >
            YOU
          </span>
        </div>

        {/* VS Badge */}
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#FFD60A',
            border: '3px solid #0A0A0A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '4px 4px 0 #0A0A0A',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 900,
            fontSize: '1.3rem',
            color: '#0A0A0A',
            flexShrink: 0,
          }}
        >
          VS
        </div>

        {/* Player 2 Card (Opponent) */}
        <div
          style={{
            flex: '1 1 200px',
            maxWidth: '240px',
            background: 'white',
            border: '3px solid #0A0A0A',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '4px 4px 0 #0A0A0A',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '6px',
            }}
          >
            PLAYER 2
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '8px',
            }}
          >
            <Shield size={18} color="#2563EB" />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#0A0A0A',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {opponent || 'Opponent'}
            </span>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              background: '#2563EB',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '6px',
              border: '1.5px solid #0A0A0A',
              display: 'inline-block',
            }}
          >
            CHALLENGER
          </span>
        </div>
      </div>

      {/* Preparing Puzzle Section */}
      <div
        style={{
          borderTop: '2px dashed #0A0A0A',
          paddingTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '13px',
            color: '#0A0A0A',
          }}
        >
          <Sparkles size={16} color="#FFD60A" /> Preparing the puzzle...
        </div>

        {/* Small ready grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 28px)',
            gap: '3px',
            padding: '6px',
            background: 'white',
            border: '2px solid #0A0A0A',
            borderRadius: '6px',
            boxShadow: '2px 2px 0 #0A0A0A',
          }}
        >
          {readyGrid.map((val, idx) => (
            <div
              key={idx}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 800,
                background: '#FFFBF0',
                border: '1px solid #0A0A0A',
              }}
            >
              {val}
            </div>
          ))}
        </div>

        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, fontWeight: 700 }}>
          Entering game board now...
        </p>
      </div>
    </div>
  );
}
