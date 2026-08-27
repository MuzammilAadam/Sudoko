/**
 * NumberPad — 1-9 buttons for placing numbers.
 * Props:
 *  onNumber       - (n: number) => void
 *  disabled       - boolean; disable all buttons
 *  notesMode      - boolean; show visual indicator
 *  remainingCounts - { [1-9]: number } how many of each digit remain (optional)
 */
export default function NumberPad({ onNumber, disabled = false, notesMode = false, remainingCounts = {} }) {
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
        {notesMode ? '✏️ Notes Mode' : 'Numbers'}
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px',
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
          const rem = remainingCounts[n] ?? 5; // assume some remaining if not provided
          const exhausted = rem === 0;
          return (
            <button
              key={n}
              onClick={() => !disabled && !exhausted && onNumber(n)}
              disabled={disabled || exhausted}
              aria-label={`Place ${n}`}
              style={{
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #0A0A0A',
                borderRadius: '10px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(16px, 2vw, 22px)',
                cursor: disabled || exhausted ? 'not-allowed' : 'pointer',
                background: notesMode ? '#EDE9FE' : 'white',
                color: exhausted ? '#D1D5DB' : (notesMode ? '#7C3AED' : '#0A0A0A'),
                boxShadow: disabled || exhausted ? 'none' : '4px 4px 0 #0A0A0A',
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.1s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!disabled && !exhausted) {
                  e.currentTarget.style.background = notesMode ? '#7C3AED' : '#FF3CAC';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !exhausted) {
                  e.currentTarget.style.background = notesMode ? '#EDE9FE' : 'white';
                  e.currentTarget.style.color = exhausted ? '#D1D5DB' : (notesMode ? '#7C3AED' : '#0A0A0A');
                  e.currentTarget.style.transform = 'translate(0,0)';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
                }
              }}
              onMouseDown={(e) => {
                if (!disabled && !exhausted) {
                  e.currentTarget.style.transform = 'translate(2px,2px)';
                  e.currentTarget.style.boxShadow = '2px 2px 0 #0A0A0A';
                }
              }}
              onMouseUp={(e) => {
                if (!disabled && !exhausted) {
                  e.currentTarget.style.transform = 'translate(-2px,-2px)';
                  e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                }
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
}
