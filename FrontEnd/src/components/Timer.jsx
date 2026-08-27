import { useEffect, useRef } from 'react';

/**
 * Timer — displays elapsed time in mm:ss format.
 * Props:
 *  seconds  - total elapsed seconds (controlled by parent)
 *  running  - boolean; parent controls start/stop
 */
export default function Timer({ seconds = 0 }) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '1.1rem',
        letterSpacing: '2px',
        color: '#0A0A0A',
      }}
    >
      {mm}:{ss}
    </span>
  );
}
