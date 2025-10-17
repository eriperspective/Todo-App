import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: string;
  deadline: string;
  start_time?: string;
  end_time?: string;
  labels?: string[];
  completed?: boolean;
}

const americanHolidays: { [key: string]: string } = {
  "1-1": "New Year's Day",
  "1-20": "MLK Day",
  "2-17": "Presidents Day",
  "3-17": "St. Patrick's Day",
  "5-26": "Memorial Day",
  "7-4": "Independence Day",
  "9-1": "Labor Day",
  "10-13": "Columbus Day",
  "11-11": "Veterans Day",
  "11-24": "Thanksgiving",
  "11-25": "Day After Thanksgiving",
  "12-25": "Christmas"
};

export default function Calendar() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [token, setToken] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Add Playfair Display font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    fetchTasks(storedToken);
  }, [router]);

  const fetchTasks = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/tasks", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (day: number) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return taskDate.getDate() === day &&
             taskDate.getMonth() === currentDate.getMonth() &&
             taskDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const getHolidayForDate = (day: number): string | null => {
    const month = currentDate.getMonth() + 1;
    const key = `${month}-${day}`;
    
    // Special handling for moveable holidays
    if (month === 5 && day >= 25 && day <= 31) {
      // Memorial Day - Last Monday of May
      const lastDayOfMay = getDaysInMonth(currentDate);
      let memorialDay = lastDayOfMay;
      while (new Date(currentDate.getFullYear(), 4, memorialDay).getDay() !== 1) {
        memorialDay--;
      }
      if (day === memorialDay) return "Memorial Day";
    }
    
    if (month === 9 && day <= 7) {
      // Labor Day - First Monday of September
      let laborDay = 1;
      while (new Date(currentDate.getFullYear(), 8, laborDay).getDay() !== 1) {
        laborDay++;
      }
      if (day === laborDay) return "Labor Day";
    }
    
    if (month === 10 && day >= 8 && day <= 14) {
      // Columbus Day - Second Monday of October
      let columbusDay = 8;
      while (new Date(currentDate.getFullYear(), 9, columbusDay).getDay() !== 1) {
        columbusDay++;
      }
      if (day === columbusDay) return "Columbus Day";
    }
    
    if (month === 11) {
      // Thanksgiving - Fourth Thursday of November
      let firstThursday = 1;
      while (new Date(currentDate.getFullYear(), 10, firstThursday).getDay() !== 4) {
        firstThursday++;
      }
      const thanksgiving = firstThursday + 21;
      if (day === thanksgiving) return "Thanksgiving";
      if (day === thanksgiving + 1) return "Day After Thanksgiving";
    }
    
    // Fixed holidays
    return americanHolidays[key] || null;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontStyle: "italic"
        }}>CALENDAR</h1>
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
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              {/* Calendar Controls */}
              <div className="form" style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button className="button button-secondary button-small" onClick={handlePrevMonth} style={{
                  fontFamily: "'Playfair Display', serif"
                }}>
                  ← Previous
                </button>
                <h2 style={{ 
                  color: "#20B2AA", 
                  textAlign: "center", 
                  flex: 1,
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic"
                }}>
                  {monthName}
                </h2>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="button button-secondary button-small" onClick={handleToday} style={{
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Today
                  </button>
                  <button className="button button-secondary button-small" onClick={handleNextMonth} style={{
                    fontFamily: "'Playfair Display', serif"
                  }}>
                    Next →
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="form">
                {/* Day Headers */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        fontWeight: "600",
                        padding: "0.75rem",
                        backgroundColor: "#FF6B6B",
                        borderRadius: "6px",
                        color: "white",
                        fontFamily: "'Playfair Display', serif"
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "0.5rem",
                  gridAutoRows: "140px"
                }}>
                  {calendarDays.map((day, index) => {
                    const dayTasks = day ? getTasksForDate(day) : [];
                    const isToday = day === new Date().getDate() &&
                                   currentDate.getMonth() === new Date().getMonth() &&
                                   currentDate.getFullYear() === new Date().getFullYear();

                    return (
                      <div
                        key={index}
                        style={{
                          padding: "0.75rem",
                          backgroundColor: day ? "#E0F5F3" : "transparent",
                          border: `2px solid ${isToday ? "#FF6B6B" : "#B2DFDB"}`,
                          borderRadius: "8px",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          cursor: day ? "pointer" : "default",
                          transition: "all 0.3s ease",
                          opacity: day ? 1 : 0.3,
                          overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                          if (day) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "white";
                            (e.currentTarget as HTMLElement).style.border = "2px solid #FF6B6B";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(255, 107, 107, 0.3)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (day) {
                            (e.currentTarget as HTMLElement).style.backgroundColor = "#E0F5F3";
                            (e.currentTarget as HTMLElement).style.border = `2px solid ${isToday ? "#20B2AA" : "#B2DFDB"}`;
                            (e.currentTarget as HTMLElement).style.boxShadow = "none";
                          }
                        }}
                      >
                        {day && (
                          <>
                            <div style={{
                              fontWeight: "600",
                              color: "#20B2AA",
                              marginBottom: "0.5rem",
                              fontFamily: "'Playfair Display', serif",
                              fontStyle: "italic",
                              fontSize: "1.25rem"
                            }}>
                              {day}
                            </div>
                            {getHolidayForDate(day) && (
                              <div style={{
                                backgroundColor: "#FFE5CC",
                                color: "#FFA500",
                                padding: "0.35rem 0.5rem",
                                borderRadius: "4px",
                                marginBottom: "0.5rem",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                fontFamily: "'Playfair Display', serif",
                                textAlign: "center"
                              }}>
                                {getHolidayForDate(day)}
                              </div>
                            )}
                            <div style={{ 
                              fontSize: "0.875rem",
                              fontFamily: "'Playfair Display', serif",
                              fontStyle: "italic"
                            }}>
                              {dayTasks.slice(0, 2).map((task, idx) => (
                                <div
                                  key={idx}
                                  style={{
                                    backgroundColor: task.priority === "High" ? "#FFE5CC" :
                                                     task.priority === "Medium" ? "#D1F2EB" : "#E0E7FF",
                                    color: task.priority === "High" ? "#FFA500" :
                                           task.priority === "Medium" ? "#26C7A0" : "#6366F1",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    marginBottom: "0.25rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    fontSize: "0.75rem"
                                  }}
                                  title={task.title}
                                >
                                  {task.title}
                                </div>
                              ))}
                              {dayTasks.length > 2 && (
                                <div style={{
                                  fontSize: "0.75rem",
                                  color: "#20B2AA",
                                  marginTop: "0.25rem",
                                  fontFamily: "'Playfair Display', serif",
                                  fontStyle: "italic"
                                }}>
                                  +{dayTasks.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="form" style={{ marginTop: "2rem" }}>
                <h3 style={{ 
                  marginBottom: "1rem", 
                  color: "#20B2AA",
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic"
                }}>Legend</h3>
                <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#FFE5CC",
                      borderRadius: "4px"
                    }}></div>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic"
                    }}>High Priority</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#D1F2EB",
                      borderRadius: "4px"
                    }}></div>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic"
                    }}>Medium Priority</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#E0E7FF",
                      borderRadius: "4px"
                    }}></div>
                    <span style={{
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic"
                    }}>Low Priority</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
