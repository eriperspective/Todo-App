import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

const affirmations = [
  "You are capable of amazing things.",
  "Today is full of possibilities and blessings.",
  "Your potential is limitless.",
  "You are worthy of love and respect.",
  "Every challenge is an opportunity to grow.",
  "You are stronger than you think.",
  "Your dreams are within reach.",
  "You bring light to this world.",
  "You are deserving of success and happiness.",
  "Your voice matters and your presence is valued.",
  "You are a beacon of positivity.",
  "Every day brings new hope and opportunities.",
  "You are capable of achieving great things.",
  "Your spirit is unbreakable.",
  "You are blessed with endless potential.",
  "Peace and joy flow through you.",
  "You are a warrior of light.",
  "Your future is bright and beautiful.",
  "You deserve all the good things coming your way.",
  "You are loved, valued, and appreciated.",
  "Trust in your journey and believe in yourself.",
  "You are a source of inspiration to others.",
  "Your kindness creates positive ripples in the world.",
  "You are exactly where you need to be.",
  "Your faith will guide you through anything.",
  "You are a masterpiece of creation.",
  "Every breath you take is a blessing.",
  "You have the power to transform your life.",
  "Your heart is pure and your intentions are true.",
  "You are protected and guided by the universe.",
];

export default function Affirmations() {
  const router = useRouter();
  const [affirmation, setAffirmation] = useState("");
  const [usedIndices, setUsedIndices] = useState<number[]>([]);

  const displayNewAffirmation = useCallback(() => {
    let availableIndices = Array.from({ length: affirmations.length }, (_, i) => i);
    
    // If we've used all affirmations, reset
    if (usedIndices.length === affirmations.length) {
      setUsedIndices([]);
      availableIndices = Array.from({ length: affirmations.length }, (_, i) => i);
    } else {
      availableIndices = availableIndices.filter(i => !usedIndices.includes(i));
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setAffirmation(affirmations[randomIndex]);
    setUsedIndices(prev => [...prev, randomIndex]);
  }, [usedIndices]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }

    displayNewAffirmation();
  }, [router, displayNewAffirmation]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic"
        }}>AFFIRMATIONS</h1>
        <div className="dashboard-header-actions">
          <button 
            className="header-icon-btn" 
            title="Back to Dashboard"
            onClick={() => router.push("/dashboard")}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              color: "#4A4A4A"
            }}
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-main" style={{ padding: "2rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 200px)" }}>
          <div className="content-scroll" style={{ paddingBottom: "120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%" }}>
            <div style={{
              maxWidth: "600px",
              width: "100%",
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              {/* Decorative element - Prayer hands icon */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "2rem",
                animation: "pulse 2s infinite"
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21V9c0-1.105.895-2 2-2s2 .895 2 2v12" />
                  <path d="M7 21V9c0-1.105-.895-2-2-2s-2 .895-2 2v12" />
                  <path d="M12 21V3m0 18H7m5 0h5M12 3l-2 4m4 0l-2-4" />
                </svg>
              </div>

              {/* Affirmation Display - Fixed height to prevent glitching */}
              <div style={{
                backgroundColor: "var(--color-bg-secondary)",
                border: "2px solid var(--color-primary)",
                borderRadius: "16px",
                padding: "3rem 2rem",
                marginBottom: "3rem",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 10px 30px rgba(32, 178, 170, 0.1)",
                animation: "fadeIn 0.5s ease-in",
                wordWrap: "break-word",
                overflowWrap: "break-word",
                width: "100%"
              }}>
                <p style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: "var(--color-primary)",
                  lineHeight: "1.8",
                  margin: 0,
                  fontFamily: "'Playfair Display', serif",
                  wordWrap: "break-word",
                  overflowWrap: "break-word"
                }}>
                  {affirmation}
                </p>
              </div>

              {/* Button Container - Properly centered */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginBottom: "2rem"
              }}>
                <button
                  onClick={displayNewAffirmation}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "1rem 2rem",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "50px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "'Playfair Display', serif",
                    boxShadow: "0 4px 15px rgba(32, 178, 170, 0.3)",
                    minWidth: "fit-content"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(32, 178, 170, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(32, 178, 170, 0.3)";
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21V9c0-1.105.895-2 2-2s2 .895 2 2v12" />
                    <path d="M7 21V9c0-1.105-.895-2-2-2s-2 .895-2 2v12" />
                    <path d="M12 21V3m0 18H7m5 0h5M12 3l-2 4m4 0l-2-4" />
                  </svg>
                  <span>New Affirmation</span>
                </button>
              </div>

              {/* Info text */}
              <p style={{
                marginTop: "2rem",
                fontSize: "0.95rem",
                color: "var(--color-text-secondary)",
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic"
              }}>
                Take a moment to reflect and embrace this positive affirmation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
