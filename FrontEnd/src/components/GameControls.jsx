import { Undo2, Eraser, PenLine, Lightbulb, Pause, Play, RotateCcw } from 'lucide-react';

const CONTROLS = [
  { id: 'undo', label: 'Undo', icon: <Undo2 size={18} /> },
  { id: 'erase', label: 'Erase', icon: <Eraser size={18} /> },
  { id: 'notes', label: 'Notes', icon: <PenLine size={18} /> },
  { id: 'hint', label: 'Hint', icon: <Lightbulb size={18} /> },
];

/**
 * GameControls — undo, erase, notes, hint, pause buttons.
 * Props:
 *  onUndo      - () => void
 *  onErase     - () => void
 *  onNotes     - () => void
 *  onHint      - () => void
 *  onPause     - () => void
 *  onNewGame   - () => void
 *  notesActive - boolean
 *  paused      - boolean
 *  disabled    - boolean (game over or completed)
 */
export default function GameControls({
  onUndo,
  onErase,
  onNotes,
  onHint,
  onPause,
  onNewGame,
  notesActive = false,
  paused = false,
  disabled = false,
}) {
  const handlers = { undo: onUndo, erase: onErase, notes: onNotes, hint: onHint };
  const active = { notes: notesActive };

  return (
    <div
      className="neo-card"
      style={{ padding: '16px', marginBottom: '12px' }}
    >
      <p
        style={{
          fontWeight: 800,
          fontSize: '11px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          marginBottom: '12px',
          opacity: 0.6,
        }}
      >
        Controls
      </p>

      {/* Action controls */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        {CONTROLS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={handlers[id]}
            disabled={disabled && id !== 'notes'}
            aria-label={label}
            title={label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '10px 6px',
              border: '2px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              cursor: (disabled && id !== 'notes') ? 'not-allowed' : 'pointer',
              background: active[id] ? '#FFD60A' : 'white',
              color: '#0A0A0A',
              boxShadow: active[id] ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A',
              opacity: (disabled && id !== 'notes') ? 0.4 : 1,
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={(e) => {
              if (!disabled || id === 'notes') {
                e.currentTarget.style.transform = 'translate(-2px,-2px)';
                e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0,0)';
              e.currentTarget.style.boxShadow = active[id] ? '3px 3px 0 #0A0A0A' : '2px 2px 0 #0A0A0A';
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Pause / New Game */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onPause}
          disabled={disabled}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            border: '2px solid #0A0A0A',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: paused ? '#FFD60A' : 'white',
            boxShadow: '3px 3px 0 #0A0A0A',
            opacity: disabled ? 0.4 : 1,
            transition: 'all 0.1s ease',
          }}
        >
          {paused ? <Play size={16} /> : <Pause size={16} />}
          {paused ? 'Resume' : 'Pause'}
        </button>

        <button
          onClick={onNewGame}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            border: '2px solid #0A0A0A',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            background: '#FF3CAC',
            color: 'white',
            boxShadow: '3px 3px 0 #0A0A0A',
            transition: 'all 0.1s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '5px 5px 0 #0A0A0A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0,0)';
            e.currentTarget.style.boxShadow = '3px 3px 0 #0A0A0A';
          }}
        >
          <RotateCcw size={16} />
          New Game
        </button>
      </div>
    </div>
  );
}
