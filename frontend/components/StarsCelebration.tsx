import { useState, useEffect } from 'react';

interface Star {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function StarsCelebration({ trigger }: { trigger: boolean }) {
  const [stars, setStars] = useState<Star[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      // Generate star particles
      const newStars = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 2 + Math.random() * 0.8,
        size: 8 + Math.random() * 12,
      }));
      setStars(newStars);

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
      {/* Stars */}
      <div className="stars-wrapper">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              '--star-delay': `${star.delay}s`,
              '--star-duration': `${star.duration}s`,
              '--star-size': `${star.size}px`,
            } as React.CSSProperties & { '--star-delay': string; '--star-duration': string; '--star-size': string }}
          />
        ))}
      </div>

      {/* Task Complete Message */}
      <div className="task-complete-message">
        <span className="complete-emoji"></span>
        <h2>Task Completed!</h2>
        <p>Great job! You're making progress!</p>
      </div>
    </div>
  );
}
