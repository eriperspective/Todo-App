import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Settings {
  theme: "light" | "dark";
  emailNotifications: boolean;
  taskReminders: boolean;
  compactView: boolean;
  soundEnabled: boolean;
}

export default function Settings() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({
    theme: "light",
    emailNotifications: true,
    taskReminders: true,
    compactView: false,
    soundEnabled: true,
  });
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    
    const storedSettings = localStorage.getItem("appSettings");
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
        applyTheme(JSON.parse(storedSettings).theme);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    }
  }, [router]);

  const applyTheme = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    setSettings(prev => ({
      ...prev,
      theme
    }));
    applyTheme(theme);
  };

  const handleToggleSetting = (key: keyof Settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    try {
      localStorage.setItem("appSettings", JSON.stringify(settings));
      setSuccess("Settings saved successfully!");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("appSettings");
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
        }}>SETTINGS</h1>
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

            <div style={{ maxWidth: "600px", margin: "0 auto", fontFamily: "'Playfair Display', serif" }}>
              {/* Theme Settings */}
              <div className="form" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)", fontFamily: "'Playfair Display', serif" }}>
                  🎨 Theme
                </h3>
                
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <button
                    onClick={() => handleThemeChange("light")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      border: settings.theme === "light" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      borderRadius: "8px",
                      backgroundColor: settings.theme === "light" ? "rgba(255, 88, 68, 0.1)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      color: "var(--color-text-primary)",
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>☀️</div>
                    Light
                  </button>
                  <button
                    onClick={() => handleThemeChange("dark")}
                    style={{
                      flex: 1,
                      padding: "1rem",
                      border: settings.theme === "dark" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
                      borderRadius: "8px",
                      backgroundColor: settings.theme === "dark" ? "rgba(255, 88, 68, 0.1)" : "transparent",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      color: "var(--color-text-primary)",
                      fontFamily: "'Playfair Display', serif"
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🌙</div>
                    Dark
                  </button>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="form" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)", fontFamily: "'Playfair Display', serif" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }}>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                  Notifications
                </h3>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Email Notifications */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "6px", backgroundColor: "var(--color-bg)", fontFamily: "'Playfair Display', serif" }}>
                    <label style={{ cursor: "pointer", flex: 1 }}>
                      <p style={{ fontWeight: "600", marginBottom: "0.25rem", fontFamily: "'Playfair Display', serif" }}>Email Notifications</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontFamily: "'Playfair Display', serif" }}>
                        Receive updates via email
                      </p>
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={() => handleToggleSetting("emailNotifications")}
                      style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                    />
                  </div>

                  {/* Task Reminders */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "6px", backgroundColor: "var(--color-bg)", fontFamily: "'Playfair Display', serif" }}>
                    <label style={{ cursor: "pointer", flex: 1 }}>
                      <p style={{ fontWeight: "600", marginBottom: "0.25rem", fontFamily: "'Playfair Display', serif" }}>Task Reminders</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontFamily: "'Playfair Display', serif" }}>
                        Get reminded about upcoming tasks
                      </p>
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.taskReminders}
                      onChange={() => handleToggleSetting("taskReminders")}
                      style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                    />
                  </div>

                  {/* Sound */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "6px", backgroundColor: "var(--color-bg)", fontFamily: "'Playfair Display', serif" }}>
                    <label style={{ cursor: "pointer", flex: 1 }}>
                      <p style={{ fontWeight: "600", marginBottom: "0.25rem", fontFamily: "'Playfair Display', serif" }}>Sound Notifications</p>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontFamily: "'Playfair Display', serif" }}>
                        Play sound on task events
                      </p>
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.soundEnabled}
                      onChange={() => handleToggleSetting("soundEnabled")}
                      style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Display Settings */}
              <div className="form" style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)", fontFamily: "'Playfair Display', serif" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline", marginRight: "0.5rem", verticalAlign: "middle" }}>
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  Display
                </h3>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", borderRadius: "6px", backgroundColor: "var(--color-bg)", fontFamily: "'Playfair Display', serif" }}>
                  <label style={{ cursor: "pointer", flex: 1 }}>
                    <p style={{ fontWeight: "600", marginBottom: "0.25rem", fontFamily: "'Playfair Display', serif" }}>Compact View</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontFamily: "'Playfair Display', serif" }}>
                      Show tasks in a more compact format
                    </p>
                  </label>
                  <input
                    type="checkbox"
                    checked={settings.compactView}
                    onChange={() => handleToggleSetting("compactView")}
                    style={{ width: "20px", height: "20px", cursor: "pointer", accentColor: "var(--color-primary)" }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "1rem", fontFamily: "'Playfair Display', serif" }}>
                <button
                  className="button button-primary"
                  onClick={handleSaveSettings}
                  disabled={saving}
                  style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => router.push("/dashboard")}
                  style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
