import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
}

export default function CelebrationEffect({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      // Generate confetti particles
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.2,
        duration: 2 + Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // Hide after animation completes
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  if (!show) return null;

  return (
    <div className="celebration-container">
      {/* Confetti */}
      <div className="confetti-wrapper">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="confetti"
            style={{
              left: `${particle.left}%`,
              '--delay': `${particle.delay}s`,
              '--duration': `${particle.duration}s`,
            } as React.CSSProperties & { '--delay': string; '--duration': string }}
          />
        ))}
      </div>

      {/* Sparkles */}
      <div className="sparkles-wrapper">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="sparkle"
            style={{
              '--sparkle-left': `${Math.random() * 100}%`,
              '--sparkle-top': `${Math.random() * 100}%`,
              '--sparkle-delay': `${Math.random() * 0.5}s`,
              '--sparkle-duration': `${1.5 + Math.random() * 0.5}s`,
            } as React.CSSProperties & { '--sparkle-left': string; '--sparkle-top': string; '--sparkle-delay': string; '--sparkle-duration': string }}
          />
        ))}
      </div>

      {/* Success Message */}
      <div className="success-message">
        <span className="success-emoji">🎉</span>
        <h2>Goal Completed!</h2>
        <p>You reached 100%! Amazing work!</p>
      </div>
    </div>
  );
}
