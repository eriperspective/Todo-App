import React, { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState<'error' | 'success' | ''>('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !username) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/signup', {
        email,
        password,
        username,
      });
      
      if (res.data.user_id) {
        setMessage('Account created successfully! Redirecting to login...');
        setMessageType('success');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage('Signup failed');
        setMessageType('error');
      }
    } catch (err: any) {
      let errorMessage = 'Something went wrong';
      if (err.response?.data?.detail) {
        errorMessage = typeof err.response.data.detail === 'string' ? err.response.data.detail : JSON.stringify(err.response.data.detail);
      } else if (err.message) {
        errorMessage = err.message;
      }
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #FF5844 0%, #1F7C7E 50%, #0F9B9D 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Playfair Display', serif"
    }}>
      {/* Animated Background Elements - Floating Spheres */}
      {/* Red Sphere - Top Right */}
      <div style={{
        position: "absolute",
        top: "-100px",
        right: "-100px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 88, 68, 0.15)",
        animation: "float 20s ease-in-out infinite"
      }}></div>
      
      {/* Teal Sphere - Bottom Left */}
      <div style={{
        position: "absolute",
        bottom: "-150px",
        left: "-150px",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        backgroundColor: "rgba(31, 124, 126, 0.15)",
        animation: "float 25s ease-in-out infinite 2s"
      }}></div>

      {/* Red Sphere - Bottom Right */}
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "-80px",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 88, 68, 0.1)",
        animation: "float 22s ease-in-out infinite 1s"
      }}></div>

      {/* Teal Sphere - Top Left */}
      <div style={{
        position: "absolute",
        top: "5%",
        left: "-120px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        backgroundColor: "rgba(15, 155, 157, 0.12)",
        animation: "float 28s ease-in-out infinite 3s"
      }}></div>

      {/* Teal Sphere - Center Background */}
      <div style={{
        position: "absolute",
        top: "20%",
        right: "10%",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        backgroundColor: "rgba(31, 124, 126, 0.08)",
        animation: "float 26s ease-in-out infinite 1.5s"
      }}></div>

      {/* Red Sphere - Center Background */}
      <div style={{
        position: "absolute",
        bottom: "25%",
        left: "5%",
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 88, 68, 0.12)",
        animation: "float 24s ease-in-out infinite 2.5s"
      }}></div>

      {/* Red Sphere - Top Center Left */}
      <div style={{
        position: "absolute",
        top: "15%",
        left: "8%",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: "rgba(255, 88, 68, 0.08)",
        animation: "float 23s ease-in-out infinite 0.5s"
      }}></div>

      {/* Teal Sphere - Bottom Center Right */}
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "8%",
        width: "140px",
        height: "140px",
        borderRadius: "50%",
        backgroundColor: "rgba(15, 155, 157, 0.1)",
        animation: "float 27s ease-in-out infinite 2s"
      }}></div>

      {/* Signup Card */}
      <div style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        maxWidth: "420px",
        padding: "2rem",
        margin: "0 1rem"
      }}>
        {/* Logo/Branding */}
        <div style={{
          textAlign: "center",
          marginBottom: "2rem",
          animation: "slideInUp 0.6s ease-out"
        }}>
          {/* Red-Teal Gradient Blend Circle */}
          <div style={{
            fontSize: "3rem",
            marginBottom: "0.5rem",
            animation: "bounce 2s ease-in-out infinite",
            width: "80px",
            height: "80px",
            margin: "0 auto 0.5rem auto",
            background: "linear-gradient(135deg, #FF5844 0%, #1F7C7E 50%, #0F9B9D 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}></div>
          <h1 style={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "white",
            marginBottom: "0.5rem",
            letterSpacing: "1px",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic"
          }}>
            Perspectives
          </h1>
          <p style={{
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: "500",
            fontFamily: "'Playfair Display', serif"
          }}>
            Join millions organizing their life & goals.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "slideInUp 0.8s ease-out 0.1s backwards"
        }}>
          <h2 style={{
            fontSize: "1.75rem",
            fontWeight: "700",
            color: "#1F2937",
            marginBottom: "0.5rem",
            textAlign: "center",
            fontFamily: "'Playfair Display', serif"
          }}>
            Create Account
          </h2>
          <p style={{
            fontSize: "0.875rem",
            color: "#6B7280",
            textAlign: "center",
            marginBottom: "2rem",
            fontFamily: "'Playfair Display', serif"
          }}>
            Join thousands organizing their goals
          </p>

          {/* Message Alert */}
          {message && (
            <div style={{
              padding: "0.875rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              animation: "slideInUp 0.3s ease-out",
              backgroundColor: messageType === 'error' ? "#FEE2E2" : "#DCFCE7",
              color: messageType === 'error' ? "#DC2626" : "#166534",
              border: messageType === 'error' ? "1px solid #FECACA" : "1px solid #86EFAC",
              fontFamily: "'Playfair Display', serif"
            }}>
              {message}
            </div>
          )}

          {/* Username Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "0.5rem",
              fontFamily: "'Playfair Display', serif"
            }}>
              Username
            </label>
            <input
              type="text"
              placeholder="john_doe"
              value={username}
              onChange={e => {
                setUsername(e.target.value);
                setMessage('');
              }}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontFamily: "'Playfair Display', serif",
                transition: "all 0.3s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#FF5844";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255, 88, 68, 0.1)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#E5E7EB";
                (e.target as HTMLInputElement).style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
              required
            />
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "0.5rem",
              fontFamily: "'Playfair Display', serif"
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setMessage('');
              }}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontFamily: "'Playfair Display', serif",
                transition: "all 0.3s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#FF5844";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255, 88, 68, 0.1)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#E5E7EB";
                (e.target as HTMLInputElement).style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
              required
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "1.75rem" }}>
            <label style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#374151",
              marginBottom: "0.5rem",
              fontFamily: "'Playfair Display', serif"
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setMessage('');
              }}
              style={{
                width: "100%",
                padding: "0.875rem",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontFamily: "'Playfair Display', serif",
                transition: "all 0.3s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#FF5844";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(255, 88, 68, 0.1)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#E5E7EB";
                (e.target as HTMLInputElement).style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
              }}
              required
            />
            <p style={{
              fontSize: "0.75rem",
              color: "#9CA3AF",
              marginTop: "0.5rem",
              fontFamily: "'Playfair Display', serif"
            }}>
              At least 6 characters
            </p>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.875rem",
              backgroundColor: isLoading ? "#E74C3A" : "#FF5844",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "0.9375rem",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(255, 88, 68, 0.3)",
              transform: isLoading ? "scale(0.98)" : "scale(1)",
              fontFamily: "'Playfair Display', serif"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#E74C3A";
                (e.target as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(255, 88, 68, 0.4)";
                (e.target as HTMLButtonElement).style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                (e.target as HTMLButtonElement).style.backgroundColor = "#FF5844";
                (e.target as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(255, 88, 68, 0.3)";
                (e.target as HTMLButtonElement).style.transform = "translateY(0)";
              }
            }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Divider */}
          <div style={{
            margin: "1.75rem 0",
            display: "flex",
            alignItems: "center",
            gap: "1rem"
          }}>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
            <span style={{ color: "#9CA3AF", fontSize: "0.875rem", fontFamily: "'Playfair Display', serif" }}>Have an account?</span>
            <div style={{ flex: 1, height: "1px", backgroundColor: "#E5E7EB" }}></div>
          </div>

          {/* Log In Link */}
          <button
            onClick={() => window.location.href = '/login'}
            style={{
              width: "100%",
              padding: "0.875rem",
              backgroundColor: "transparent",
              color: "#0F9B9D",
              border: "2px solid #FF5844",
              borderRadius: "8px",
              fontSize: "0.9375rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "'Playfair Display', serif"
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "#FF5844";
              (e.target as HTMLButtonElement).style.color = "white";
              (e.target as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(255, 88, 68, 0.2)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
              (e.target as HTMLButtonElement).style.color = "#0F9B9D";
              (e.target as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            Log In
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.75rem",
          color: "rgba(255, 255, 255, 0.7)",
          fontWeight: "500",
          fontFamily: "'Playfair Display', serif"
        }}>
          © 2025 Perspectives. All rights reserved.
        </p>
      </div>
    </div>
  );
}
