import { Trophy, RotateCcw, LogOut, Award, Users } from 'lucide-react';

/**
 * MultiplayerResultModal — Modal shown when gameFinished === true in online multiplayer mode.
 * Matches existing playful neo-brutalist design system.
 *
 * Props:
 *  playerScores - { [player: string]: number }
 *  roomId       - string
 *  currentUsername - string
 *  onPlayAgain  - () => void
 *  onExit       - () => void
 */
export default function MultiplayerResultModal({
  playerScores = {},
  roomId = '',
  currentUsername = '',
  onPlayAgain,
  onExit,
}) {
  const players = Object.keys(playerScores);
  let winner = null;
  let isTie = false;

  if (players.length > 0) {
    let maxScore = -Infinity;
    players.forEach((p) => {
      if (playerScores[p] > maxScore) {
        maxScore = playerScores[p];
        winner = p;
        isTie = false;
      } else if (playerScores[p] === maxScore) {
        isTie = true;
      }
    });
  }

  const isCurrentUserWinner = winner === currentUsername && !isTie;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10,10,10,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        className="neo-card animate-bounce-in"
        style={{
          background: 'white',
          padding: '36px 28px',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top colorful neo stripe */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'repeating-linear-gradient(90deg, #FF3CAC 0 20px, #FFD60A 20px 40px, #2563EB 40px 60px, #22C55E 60px 80px)',
          }}
        />

        {/* Trophy icon */}
        <div
          style={{
            width: '80px',
            height: '80px',
            border: '4px solid #0A0A0A',
            borderRadius: '50%',
            background: isCurrentUserWinner ? '#FFD60A' : isTie ? '#3B82F6' : '#FF3CAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '6px 6px 0 #0A0A0A',
          }}
        >
          <Trophy size={42} color={isCurrentUserWinner ? '#0A0A0A' : 'white'} />
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 800,
            fontSize: '1.8rem',
            marginBottom: '6px',
            color: '#0A0A0A',
          }}
        >
          {isTie ? "IT'S A TIE! 🤝" : isCurrentUserWinner ? 'YOU WON! 🎉' : `${winner || 'Opponent'} WON! 🏆`}
        </h2>

        <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '20px', fontWeight: 600 }}>
          {isTie
            ? 'Both players finished with identical scores!'
            : isCurrentUserWinner
            ? 'Awesome match! You scored the highest points.'
            : 'Great effort! Challenge them again to claim victory.'}
        </p>

        {/* Room ID Badge */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            border: '2px solid #0A0A0A',
            borderRadius: '20px',
            background: '#F5EED8',
            fontWeight: 700,
            fontSize: '12px',
            boxShadow: '2px 2px 0 #0A0A0A',
            marginBottom: '20px',
            fontFamily: "'Space Mono', monospace",
          }}
        >
          ROOM CODE: {roomId}
        </div>

        {/* Scores Table */}
        <div
          style={{
            border: '3px solid #0A0A0A',
            borderRadius: '12px',
            background: '#FFFBF0',
            padding: '16px',
            boxShadow: '4px 4px 0 #0A0A0A',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#6B7280',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Award size={14} /> FINAL SCOREBOARD
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {players.map((p) => {
              const isWinnerRow = p === winner;
              const isMe = p === currentUsername;
              const score = playerScores[p];

              return (
                <div
                  key={p}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    padding: '10px 14px',
                    border: '2px solid #0A0A0A',
                    borderRadius: '8px',
                    background: isWinnerRow ? '#FFD60A' : 'white',
                    boxShadow: '3px 3px 0 #0A0A0A',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'left' }}>
                    {isWinnerRow ? <Trophy size={16} color="#0A0A0A" /> : <Users size={16} color="#6B7280" />}
                    <span style={{ fontWeight: 800, fontSize: '15px', color: '#0A0A0A' }}>
                      {p} {isMe && '(You)'}
                    </span>
                    {isWinnerRow && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          background: '#0A0A0A',
                          color: '#FFD60A',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        WINNER
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 800,
                      fontSize: '1.3rem',
                      color: '#0A0A0A',
                    }}
                  >
                    {score} pts
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onPlayAgain}
            style={{
              flex: 1,
              padding: '14px',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              background: '#FF3CAC',
              color: 'white',
              boxShadow: '4px 4px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px,-2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0,0)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
            }}
          >
            <RotateCcw size={18} />
            Play Again
          </button>

          <button
            onClick={onExit}
            style={{
              flex: 1,
              padding: '14px',
              border: '3px solid #0A0A0A',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '15px',
              cursor: 'pointer',
              background: '#FFD60A',
              color: '#0A0A0A',
              boxShadow: '4px 4px 0 #0A0A0A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
              transition: 'all 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translate(-2px,-2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #0A0A0A';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translate(0,0)';
              e.currentTarget.style.boxShadow = '4px 4px 0 #0A0A0A';
            }}
          >
            <LogOut size={18} />
            Exit Game
          </button>
        </div>
      </div>
    </div>
  );
}
