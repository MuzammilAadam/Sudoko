import { Heart, HeartCrack } from 'lucide-react';

/**
 * ChancesDisplay — shows remaining chances as hearts.
 * Props:
 *  remaining - number (0-3)
 *  total     - number (default 3)
 */
export default function ChancesDisplay({ remaining = 3, total = 3 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const alive = i < remaining;
        return alive ? (
          <Heart
            key={i}
            size={22}
            fill="#FF3CAC"
            color="#FF3CAC"
            style={{ filter: 'drop-shadow(1px 1px 0 #0A0A0A)' }}
          />
        ) : (
          <HeartCrack
            key={i}
            size={22}
            fill="#E5E7EB"
            color="#9CA3AF"
          />
        );
      })}
    </div>
  );
}
