const RULES = [
  {
    emoji: '➡️',
    color: '#FF3CAC',
    title: 'Each Row',
    body: 'Every row must contain the numbers 1 through 9, with no repetition. Each digit appears exactly once.',
  },
  {
    emoji: '⬇️',
    color: '#2563EB',
    title: 'Each Column',
    body: 'Every column must contain the numbers 1 through 9, with no repetition. Each digit appears exactly once.',
  },
  {
    emoji: '⬛',
    color: '#7C3AED',
    title: 'Each 3×3 Box',
    body: 'The 9×9 grid is divided into nine 3×3 boxes. Each box must contain the numbers 1 through 9, with no repetition.',
  },
  {
    emoji: '❤️',
    color: '#EF4444',
    title: '3 Chances',
    body: 'You start with 3 chances (hearts). Each wrong move costs one chance. Run out of chances and the game ends.',
  },
  {
    emoji: '🚫',
    color: '#F97316',
    title: 'Wrong Moves',
    body: "Placing a number that conflicts with the row, column, or 3×3 box's rules counts as a mistake.",
  },
  {
    emoji: '🏁',
    color: '#22C55E',
    title: 'Win Condition',
    body: 'Fill all 81 cells correctly to complete the puzzle. Try to finish with as few mistakes and as little time as possible!',
  },
];

const TIPS = [
  { icon: '🔍', tip: 'Scan rows and columns to eliminate possibilities.' },
  { icon: '✏️', tip: 'Use Notes mode to pencil in candidate numbers.' },
  { icon: '🎯', tip: 'Focus on 3×3 boxes that are almost complete.' },
  { icon: '💡', tip: 'Use Hint when you are totally stuck.' },
  { icon: '⏪', tip: 'Made a mistake? Use Undo (Ctrl+Z) to go back.' },
];

export default function Rules() {
  return (
    <main style={{ minHeight: '100vh', padding: '32px 16px 60px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '8px' }}>📖</div>
          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
              marginBottom: '8px',
            }}
          >
            How To Play
          </h1>
          <p style={{ color: '#6B7280', fontSize: '16px' }}>
            Master the rules, develop your strategy, and conquer every puzzle.
          </p>
        </div>

        {/* Quick summary card */}
        <div
          className="neo-card"
          style={{
            padding: '24px 28px',
            marginBottom: '36px',
            background: '#0A0A0A',
            color: 'white',
          }}
        >
          <p style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: '1rem', color: '#FFD60A', marginBottom: '12px' }}>
            ⚡ TL;DR
          </p>
          <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#E5E7EB' }}>
            Fill the 9×9 grid so every <strong style={{ color: '#FFD60A' }}>row</strong>, every{' '}
            <strong style={{ color: '#FF85D1' }}>column</strong>, and every{' '}
            <strong style={{ color: '#60A5FA' }}>3×3 box</strong> contains{' '}
            <strong style={{ color: 'white' }}>all digits from 1 to 9</strong>, with no repetition.
            You have <strong style={{ color: '#EF4444' }}>3 chances</strong> — use them wisely!
          </p>
        </div>

        {/* Rules grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          {RULES.map((rule) => (
            <div
              key={rule.title}
              className="neo-card"
              style={{
                padding: '24px',
                background: 'white',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-3px,-3px)';
                e.currentTarget.style.boxShadow = '9px 9px 0 #0A0A0A';
                e.currentTarget.style.borderColor = rule.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0,0)';
                e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
                e.currentTarget.style.borderColor = '#0A0A0A';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  border: '3px solid #0A0A0A',
                  borderRadius: '12px',
                  background: rule.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '14px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                }}
              >
                {rule.emoji}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '16px', marginBottom: '8px' }}>
                {rule.title}
              </h3>
              <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.7' }}>{rule.body}</p>
            </div>
          ))}
        </div>

        {/* Mini board illustration */}
        <div
          className="neo-card"
          style={{ padding: '28px', marginBottom: '36px', background: 'white' }}
        >
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px', textAlign: 'center' }}>
            📐 The 9×9 Board Explained
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
            {/* Mini grid visual */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 32px)',
                gridTemplateRows: 'repeat(9, 32px)',
                border: '3px solid #0A0A0A',
                borderRadius: '6px',
                overflow: 'hidden',
                boxShadow: '4px 4px 0 #0A0A0A',
              }}
            >
              {Array.from({ length: 81 }).map((_, idx) => {
                const r = Math.floor(idx / 9);
                const c = idx % 9;
                const boxRow = Math.floor(r / 3);
                const boxCol = Math.floor(c / 3);
                const boxIndex = boxRow * 3 + boxCol;
                const boxColors = ['#FFF5F7', '#FFF', '#F0F7FF', '#FFF', '#FFFBE6', '#FFF', '#F0FFF4', '#FFF', '#FFF0F5'];
                const borderRight = (c + 1) % 3 === 0 && c !== 8 ? '2px solid #0A0A0A' : '1px solid #E5E7EB';
                const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? '2px solid #0A0A0A' : '1px solid #E5E7EB';
                return (
                  <div
                    key={idx}
                    style={{
                      width: '32px',
                      height: '32px',
                      background: boxColors[boxIndex],
                      borderRight,
                      borderBottom,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#9CA3AF',
                    }}
                  />
                );
              })}
            </div>
            <div style={{ maxWidth: '260px' }}>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.8' }}>
                The board has <strong>9 rows</strong>, <strong>9 columns</strong>, and{' '}
                <strong>9 colored 3×3 boxes</strong>. Each region must contain all digits 1-9.
                Pre-filled cells are <strong>given</strong> and cannot be changed.
                The remaining empty cells are yours to fill!
              </p>
            </div>
          </div>
        </div>

        {/* Tips section */}
        <div className="neo-card" style={{ padding: '28px', background: '#F5EED8' }}>
          <h2 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '20px' }}>
            🧠 Strategy Tips
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {TIPS.map((t) => (
              <div
                key={t.tip}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px',
                  background: 'white',
                  border: '2px solid #0A0A0A',
                  borderRadius: '10px',
                  boxShadow: '3px 3px 0 #0A0A0A',
                }}
              >
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{t.icon}</span>
                <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: '1.6', margin: 0 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
