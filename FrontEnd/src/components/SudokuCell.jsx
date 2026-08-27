import { useEffect, useRef } from 'react';

/**
 * SudokuCell — renders a single cell in the 9×9 board.
 *
 * Props:
 *  value        - number 0-9 (0 = empty)
 *  isGiven      - boolean; original puzzle cell (non-editable)
 *  isSelected   - boolean; currently selected cell
 *  isHighlighted - boolean; same row/col/box as selected cell
 *  isSameValue  - boolean; same digit as selected cell
 *  isError      - boolean; wrong move highlight
 *  notes        - Set of note numbers for pencil mode
 *  onClick      - handler
 *  animClass    - 'animate-pop' | 'animate-shake' | ''
 *  row, col     - position (for border logic)
 */
export default function SudokuCell({
  value,
  isGiven,
  isSelected,
  isHighlighted,
  isSameValue,
  isError,
  notes = new Set(),
  onClick,
  animClass = '',
  row,
  col,
}) {
  const ref = useRef(null);

  // Remove animation class after it finishes
  useEffect(() => {
    if (animClass && ref.current) {
      const el = ref.current;
      el.classList.add(animClass);
      const onEnd = () => el.classList.remove(animClass);
      el.addEventListener('animationend', onEnd, { once: true });
    }
  }, [animClass]);

  // ── Border logic: thicker on 3×3 box boundaries ──
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? '3px solid #0A0A0A' : '1px solid #d4c9a8';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? '3px solid #0A0A0A' : '1px solid #d4c9a8';

  // ── Cell background ──
  let bg = 'white';
  if (isSelected) bg = '#FFD60A';
  else if (isError) bg = '#FEE2E2';
  else if (isSameValue && value !== 0) bg = 'rgba(255, 60, 172, 0.18)';
  else if (isHighlighted) bg = 'rgba(255, 214, 10, 0.22)';
  else if (isGiven) bg = '#F5EED8';

  // ── Text color ──
  let color = '#0A0A0A';
  if (!isGiven && value !== 0 && !isError) color = '#2563EB';
  if (isError) color = '#EF4444';

  // ── Font size (responsive) ──
  const fontSize = 'clamp(14px, 2.2vw, 22px)';

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isGiven ? 'default' : 'pointer',
        background: bg,
        borderRight,
        borderBottom,
        borderLeft: col === 0 ? 'none' : 'none',
        borderTop: row === 0 ? 'none' : 'none',
        position: 'relative',
        transition: 'background 0.12s ease',
        userSelect: 'none',
      }}
      role="button"
      tabIndex={isGiven ? -1 : 0}
      aria-label={`Row ${row + 1}, Column ${col + 1}, ${value || 'empty'}${isGiven ? ', given' : ''}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      {/* Notes grid */}
      {value === 0 && notes.size > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
            width: '100%',
            height: '100%',
            padding: '2px',
            gap: 0,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <span
              key={n}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(6px, 1vw, 10px)',
                fontWeight: 700,
                color: notes.has(n) ? '#7C3AED' : 'transparent',
                lineHeight: 1,
              }}
            >
              {n}
            </span>
          ))}
        </div>
      ) : (
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: isGiven ? 800 : 700,
            fontSize,
            color,
            lineHeight: 1,
          }}
        >
          {value !== 0 ? value : ''}
        </span>
      )}
    </div>
  );
}
