import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface UserProfile {
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile>({
    username: "User",
    email: "user@example.com",
    avatar: "👤",
    bio: "Add a bio about yourself"
  });
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>(profile);

  const avatarOptions = ["👤", "😀", "🧑", "👨", "👩", "🐱", "🐶", "⭐", "🎯", "🚀"];

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedProfile = localStorage.getItem("userProfile");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setEditForm(parsed);
      } catch (err) {
        console.error("Error parsing profile:", err);
      }
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarSelect = (avatar: string) => {
    setEditForm(prev => ({
      ...prev,
      avatar
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(editForm));
      setProfile(editForm);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    router.push("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic"
        }}>PROFILE</h1>
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
          <button className="header-icon-btn" title="Logout" onClick={handleLogout}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-main" style={{ padding: "2rem" }}>
          <div className="content-scroll" style={{ paddingBottom: "120px" }}>
            {error && (
              <div style={{
                backgroundColor: "#FEE2E2",
                color: "#DC2626",
                padding: "0.75rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                border: "1px solid #FECACA",
                fontFamily: "'Playfair Display', serif"
              }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                backgroundColor: "#DCFCE7",
                color: "#166534",
                padding: "0.75rem",
                borderRadius: "6px",
                marginBottom: "1rem",
                border: "1px solid #86EFAC",
                fontFamily: "'Playfair Display', serif"
              }}>
                {success}
              </div>
            )}

            {/* Profile Card */}
            <div className="form" style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "'Playfair Display', serif" }}>
              {!isEditing ? (
                <>
                  <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <div style={{
                      fontSize: "4rem",
                      marginBottom: "1rem",
                      animation: "bounce 2s ease-in-out infinite"
                    }}>
                      {profile.avatar}
                    </div>
                    <h2 style={{ 
                      color: "var(--color-primary)", 
                      marginBottom: "0.5rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {profile.username}
                    </h2>
                    <p style={{ 
                      color: "var(--color-text-secondary)", 
                      marginBottom: "1rem",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {profile.email}
                    </p>
                    <p style={{ 
                      color: "var(--color-text-secondary)", 
                      fontStyle: "italic",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      {profile.bio}
                    </p>
                  </div>

                  <button 
                    className="button button-primary"
                    onClick={() => setIsEditing(true)}
                    style={{ width: "100%", fontFamily: "'Playfair Display', serif" }}
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <h3 style={{ 
                    marginBottom: "1.5rem", 
                    color: "var(--color-primary)",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Edit Profile
                  </h3>

                  {/* Avatar Selection */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "0.75rem", 
                      fontWeight: "600",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Select Avatar
                    </label>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: "0.75rem"
                    }}>
                      {avatarOptions.map(avatar => (
                        <button
                          key={avatar}
                          onClick={() => handleAvatarSelect(avatar)}
                          style={{
                            fontSize: "2rem",
                            padding: "1rem",
                            border: editForm.avatar === avatar ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                            borderRadius: "8px",
                            backgroundColor: editForm.avatar === avatar ? "rgba(255, 88, 68, 0.1)" : "transparent",
                            cursor: "pointer",
                            transition: "all 0.3s ease"
                          }}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Username */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "0.5rem", 
                      fontWeight: "600",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={editForm.username}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Your username"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    />
                  </div>

                  {/* Email */}
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "0.5rem", 
                      fontWeight: "600",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="your@email.com"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    />
                  </div>

                  {/* Bio */}
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label style={{ 
                      display: "block", 
                      marginBottom: "0.5rem", 
                      fontWeight: "600",
                      fontFamily: "'Playfair Display', serif"
                    }}>
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editForm.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: "1px solid var(--color-border)",
                        borderRadius: "6px",
                        fontFamily: "'Playfair Display', serif",
                        resize: "vertical",
                        minHeight: "100px"
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "1rem", fontFamily: "'Playfair Display', serif" }}>
                    <button
                      className="button button-primary"
                      onClick={handleSaveProfile}
                      disabled={loading}
                      style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                    >
                      {loading ? "Saving..." : "Save Profile"}
                    </button>
                    <button
                      className="button button-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(profile);
                      }}
                      style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Additional Stats */}
            <div style={{ 
              marginTop: "3rem", 
              padding: "2rem", 
              backgroundColor: "var(--color-bg-light)",
              border: "1px solid var(--color-border)",
              borderRadius: "8px",
              fontFamily: "'Playfair Display', serif"
            }}>
              <h3 style={{ 
                marginBottom: "1rem", 
                color: "var(--color-primary)",
                fontFamily: "'Playfair Display', serif"
              }}>
                Account Information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                <div>
                  <p style={{ 
                    fontSize: "0.875rem", 
                    color: "var(--color-text-secondary)",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Member Since
                  </p>
                  <p style={{ 
                    fontWeight: "600",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p style={{ 
                    fontSize: "0.875rem", 
                    color: "var(--color-text-secondary)",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Account Status
                  </p>
                  <p style={{ 
                    fontWeight: "600", 
                    color: "var(--color-success)",
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Active ✓
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
