const DIFFICULTIES = ['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER', 'EXTREME'];

const COLORS = {
  EASY: { bg: '#22C55E', label: 'Easy' },
  MEDIUM: { bg: '#3B82F6', label: 'Medium' },
  HARD: { bg: '#F97316', label: 'Hard' },
  EXPERT: { bg: '#EF4444', label: 'Expert' },
  MASTER: { bg: '#7C3AED', label: 'Master' },
  EXTREME: { bg: '#0A0A0A', label: 'Extreme' },
};

export default function DifficultySelector({ selected, onChange, disabled }) {
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
          marginBottom: '10px',
          opacity: 0.6,
        }}
      >
        Difficulty
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        {DIFFICULTIES.map((diff) => {
          const active = selected === diff;
          const c = COLORS[diff];
          return (
            <button
              key={diff}
              onClick={() => !disabled && onChange(diff)}
              disabled={disabled}
              style={{
                padding: '6px 12px',
                border: '2px solid #0A0A0A',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '12px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: active ? c.bg : 'white',
                color: active ? (diff === 'EXTREME' ? '#FFD60A' : 'white') : '#0A0A0A',
                boxShadow: active ? '3px 3px 0 #0A0A0A' : 'none',
                transition: 'all 0.1s ease',
                opacity: disabled && !active ? 0.5 : 1,
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
