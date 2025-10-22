import { useEffect, useState } from "react";
import Tabs from "../components/Tabs";
import Checklist from "../components/Checklist";
import BottomNav from "../components/BottomNav";
import CelebrationEffect from "../components/CelebrationEffect";
import StarsCelebration from "../components/StarsCelebration";
import HamburgerNav from "../components/HamburgerNav";

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
  assignee?: string;
}

interface Label {
  _id: string;
  name: string;
}

interface Assignee {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  createdAt: string;
}

const getLabelColor = (label: string): string => {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel.includes("design")) return "design";
  if (lowerLabel.includes("development")) return "development";
  if (lowerLabel.includes("delivery")) return "delivery";
  if (lowerLabel.includes("high")) return "high";
  if (lowerLabel.includes("normal")) return "normal";
  if (lowerLabel.includes("medium")) return "medium";
  if (lowerLabel.includes("low")) return "low";
  return "medium";
};

const getAvatarColor = (index: number): string => {
  const colors = ["avatar-1", "avatar-2", "avatar-3"];
  return colors[index % colors.length];
};

const getInitials = (name: string): string => {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Due Today";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Due Tomorrow";
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `Due ${month} ${String(day).padStart(2, "0")}`;
};

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("Tasks");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [labelFilter, setLabelFilter] = useState<string>("");
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [taskCompletionActive, setTaskCompletionActive] = useState(false);
  const [openAssigneeDropdown, setOpenAssigneeDropdown] = useState<string | null>(null);
  const [assigneeSearchQuery, setAssigneeSearchQuery] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchTasks(storedToken);
      fetchLabels(storedToken);
      loadNotes();
      loadGoals();
      loadAssignees();
      // Apply saved theme
      const appSettings = localStorage.getItem("appSettings");
      if (appSettings) {
        try {
          const settings = JSON.parse(appSettings);
          if (settings.theme === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
          }
        } catch (err) {
          console.error("Error applying theme:", err);
        }
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

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
      } else {
        console.error("Expected array but got:", data);
        setTasks([]);
      }
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      const errorMessage = err.message || "Failed to fetch tasks";
      setError(errorMessage);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabels = async (authToken: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/labels", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setLabels(data);
      } else {
        console.error("Expected array but got:", data);
        setLabels([]);
      }
    } catch (err: any) {
      console.error("Error fetching labels:", err);
      const errorMessage = err.message || "Failed to fetch labels";
      setError(errorMessage);
      setLabels([]);
    }
  };

  const loadNotes = () => {
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch {
        setNotes([]);
      }
    }
  };

  const saveNotes = (newNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const loadGoals = () => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals));
      } catch {
        setGoals([]);
      }
    }
  };

  const saveGoals = (newGoals: Goal[]) => {
    localStorage.setItem("goals", JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const loadAssignees = () => {
    // Always use the new royal names - clear old data
    const defaultAssignees = [
      { id: "1", name: "Queen" },
      { id: "2", name: "King" },
      { id: "3", name: "Princess" },
      { id: "4", name: "Prince" },
    ];
    setAssignees(defaultAssignees);
    localStorage.setItem("assignees", JSON.stringify(defaultAssignees));
  };

  const saveAssignees = (newAssignees: Assignee[]) => {
    localStorage.setItem("assignees", JSON.stringify(newAssignees));
    setAssignees(newAssignees);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Convert deadline to ISO datetime format
    const deadlineDate = formData.get("deadline") as string;
    let deadline = deadlineDate;
    
    // If the deadline is just a date (YYYY-MM-DD), convert it to ISO datetime (YYYY-MM-DDTHH:MM:SS)
    if (deadlineDate && !deadlineDate.includes("T")) {
      deadline = new Date(deadlineDate).toISOString();
    }

    const task = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      priority: formData.get("priority") as string,
      deadline: deadline,
      start_time: formData.get("start_time") as string || null,
      end_time: formData.get("end_time") as string || null,
      labels: [],
      completed: false,
      assignee: selectedAssignee || assignees[0]?.id || "1",
    };

    if (!task.title || !task.priority || !task.deadline) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        fetchTasks(token);
        form.reset();
        setSelectedAssignee("");
        setError("");
      } else {
        const errorData = await res.json();
        const errorMessage = typeof errorData === 'string' ? errorData : 
                           errorData.detail || errorData.message || "Failed to create task";
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create task";
      setError(errorMessage);
    }
  };

  const handleCreateLabel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const labelName = formData.get("name") as string;

    if (!labelName || labelName.trim() === '') {
      setError('Please enter a label name');
      return;
    }

    const label = { name: labelName.trim() };

    try {
      const res = await fetch("http://localhost:8000/api/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(label),
      });

      if (res.ok) {
        fetchLabels(token);
        form.reset();
        setError("");
      } else {
        const errorData = await res.json();
        const errorMessage = typeof errorData === 'string' ? errorData : 
                           errorData.detail || errorData.message || "Failed to create label";
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to create label";
      setError(errorMessage);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      // Trigger celebration only when marking task as complete (not when uncompleting)
      if (completed === false) {
        setTaskCompletionActive(true);
        setTimeout(() => setTaskCompletionActive(false), 3500);
      }

      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });

      if (res.ok) {
        fetchTasks(token);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update task";
      setError(errorMessage);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        fetchTasks(token);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete task";
      setError(errorMessage);
    }
  };

  const handleUpdateAssignee = async (taskId: string, newAssigneeId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignee: newAssigneeId }),
      });

      if (res.ok) {
        fetchTasks(token);
        setOpenAssigneeDropdown(null);
        setAssigneeSearchQuery("");
      } else {
        const errorData = await res.json();
        const errorMessage = typeof errorData === 'string' ? errorData : 
                           errorData.detail || errorData.message || "Failed to update assignee";
        setError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update assignee";
      setError(errorMessage);
    }
  };

  const getFilteredAssignees = (query: string) => {
    return assignees.filter(assignee =>
      assignee.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPriority = priorityFilter === "" || task.priority === priorityFilter;
      const matchesLabel = labelFilter === "" || (task.labels && task.labels.includes(labelFilter));
      
      return matchesSearch && matchesPriority && matchesLabel;
    });
  };

  // Close assignee dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openAssigneeDropdown && !target.closest(".task-card-assignees")) {
        setOpenAssigneeDropdown(null);
      }
    };

    if (openAssigneeDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openAssigneeDropdown]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header" style={{ fontFamily: "'Playfair Display', serif" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
          <HamburgerNav />
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <h1 style={{ 
              fontSize: "1.5rem", 
              fontWeight: 700, 
              color: "var(--color-primary)", 
              letterSpacing: "2px",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              margin: 0
            }}>
              Perspectives
            </h1>
            <p style={{
              fontSize: "0.95rem",
              color: "#20B2AA",
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              margin: 0,
              fontWeight: 400,
              letterSpacing: "0.5px"
            }}>
              I trust the journey and align with sucess & abundance.
            </p>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <button 
            className="header-icon-btn" 
            title="Search" 
            onClick={() => {
              window.location.href = '/dashboard';
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5844 0%, #0F9B9D 100%)",
              border: "2px solid #9CA3AF",
              color: "#fff",
              fontSize: "1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), inset 0 0 10px rgba(32, 178, 170, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          <button 
            className="header-icon-btn" 
            title="Notifications"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5844 0%, #0F9B9D 100%)",
              border: "2px solid #9CA3AF",
              color: "#fff",
              fontSize: "1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), inset 0 0 10px rgba(32, 178, 170, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </button>
          <button 
            className="header-icon-btn" 
            title="Settings"
            onClick={() => {
              window.location.href = '/settings';
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5844 0%, #0F9B9D 100%)",
              border: "2px solid #9CA3AF",
              color: "#fff",
              fontSize: "1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), inset 0 0 10px rgba(32, 178, 170, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="12" r="5"></circle>
              <g strokeWidth="1.5">
                <line x1="12" y1="2" x2="12" y2="4"></line>
                <line x1="12" y1="20" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="4" y2="12"></line>
                <line x1="20" y1="12" x2="22" y2="12"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="19.78" y1="4.22" x2="18.36" y2="5.64"></line>
                <line x1="5.64" y1="18.36" x2="4.22" y2="19.78"></line>
              </g>
            </svg>
          </button>
          <button 
            className="header-icon-btn" 
            title="Logout" 
            onClick={handleLogout}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FF5844 0%, #0F9B9D 100%)",
              border: "2px solid #9CA3AF",
              color: "#fff",
              fontSize: "1.25rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), inset 0 0 10px rgba(32, 178, 170, 0.3)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="dashboard-content">
        {/* Main Content */}
        <div className="dashboard-main">
          {/* Tabs - Centered */}
          <div className="tabs-container" style={{ justifyContent: "center", gap: "1rem" }}>
            <button 
              className={`tab-button ${activeTab === "Tasks" ? "active" : ""}`}
              onClick={() => setActiveTab("Tasks")}
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "0.95rem",
                color: "#20B2AA",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#FF5844";
                (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255, 88, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#20B2AA";
                (e.currentTarget as HTMLElement).style.textShadow = "none";
              }}
            >
              Tasks
            </button>
            <button 
              className={`tab-button ${activeTab === "Checklist" ? "active" : ""}`}
              onClick={() => setActiveTab("Checklist")}
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "0.95rem",
                color: "#20B2AA",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#FF5844";
                (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255, 88, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#20B2AA";
                (e.currentTarget as HTMLElement).style.textShadow = "none";
              }}
            >
              Checklist
            </button>
            <button 
              className={`tab-button ${activeTab === "Notes" ? "active" : ""}`}
              onClick={() => setActiveTab("Notes")}
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "0.95rem",
                color: "#20B2AA",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#FF5844";
                (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255, 88, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#20B2AA";
                (e.currentTarget as HTMLElement).style.textShadow = "none";
              }}
            >
              Notes
            </button>
            <button 
              className={`tab-button ${activeTab === "Goals" ? "active" : ""}`}
              onClick={() => setActiveTab("Goals")}
              style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: "0.95rem",
                color: "#20B2AA",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#FF5844";
                (e.currentTarget as HTMLElement).style.textShadow = "0 0 10px rgba(255, 88, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "#20B2AA";
                (e.currentTarget as HTMLElement).style.textShadow = "none";
              }}
            >
              Goals
            </button>
          </div>

          {/* Content Scroll Area */}
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

            {activeTab === "Notes" && (
              <>
                {/* Create Note Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newNote: Note = {
                    id: Date.now().toString(),
                    title: formData.get("title") as string,
                    content: formData.get("content") as string,
                    createdAt: new Date().toISOString()
                  };
                  const updatedNotes = [newNote, ...notes];
                  setNotes(updatedNotes);
                  localStorage.setItem("notes", JSON.stringify(updatedNotes));
                  form.reset();
                }} className="form" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  border: "1px solid var(--color-border)",
                  transition: "all 0.3s ease"
                }}>
                  <h3 style={{ 
                    marginBottom: "1rem", 
                    color: "var(--color-primary)", 
                    fontSize: "1rem", 
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "0 2px 4px rgba(32, 178, 170, 0.1)"
                  }}>Create New Note</h3>
                  <input 
                    name="title" 
                    placeholder="Note title" 
                    required 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <textarea 
                    name="content" 
                    placeholder="Note content" 
                    required 
                    className="input" 
                    rows={5} 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem",
                      resize: "vertical"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <button 
                    type="submit" 
                    className="button button-primary" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(255, 88, 68, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(255, 88, 68, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(255, 88, 68, 0.3)";
                    }}
                  >
                    Create Note
                  </button>
                </form>

                {/* Notes List */}
                <div className="tasks-list" style={{ marginTop: "1.5rem" }}>
                  {notes.length === 0 ? (
                    <div className="empty-state" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <div className="empty-state-icon" style={{ fontSize: "3rem" }}>📄</div>
                      <div className="empty-state-title">No notes yet</div>
                      <div className="empty-state-description">Create a note using the form above to get started</div>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="task-card" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <div className="task-card-header">
                          <div className="task-card-title">{note.title}</div>
                          <div className="task-card-deadline" style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                            {new Date(note.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p style={{ marginTop: "0.75rem", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>{note.content}</p>
                        <button
                          onClick={() => {
                            const updatedNotes = notes.filter(n => n.id !== note.id);
                            setNotes(updatedNotes);
                            localStorage.setItem("notes", JSON.stringify(updatedNotes));
                          }}
                          style={{
                            marginTop: "0.75rem",
                            padding: "0.5rem 1rem",
                            backgroundColor: "#FEE2E2",
                            color: "#DC2626",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                            fontFamily: "'Playfair Display', serif"
                          }}
                        >
                          Delete Note
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "Tasks" && (
              <>
                {/* Search and Filter Controls */}
                <div style={{ 
                  display: "flex", 
                  gap: "1rem", 
                  marginBottom: "1.5rem", 
                  flexWrap: "wrap", 
                  fontFamily: "'Playfair Display', serif", 
                  alignItems: "center",
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  border: "1px solid var(--color-border)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: "200px", position: "relative" }}>
                    <svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="var(--color-primary)" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ position: "absolute", left: "14px", pointerEvents: "none", transition: "all 0.3s ease" }}
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input"
                      style={{ 
                        flex: 1, 
                        minWidth: "200px", 
                        fontFamily: "'Playfair Display', serif",
                        paddingLeft: "44px",
                        backgroundColor: "white",
                        border: "2px solid var(--color-border)",
                        borderRadius: "8px",
                        padding: "0.875rem 0.875rem 0.875rem 44px",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                      }}
                    />
                  </div>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="input"
                    style={{ 
                      flex: 1, 
                      minWidth: "150px", 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      cursor: "pointer"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select
                    value={labelFilter}
                    onChange={(e) => setLabelFilter(e.target.value)}
                    className="input"
                    style={{ 
                      flex: 1, 
                      minWidth: "150px", 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      cursor: "pointer"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  >
                    <option value="">All Labels</option>
                    {labels.map(label => (
                      <option key={label._id} value={label.name}>{label.name}</option>
                    ))}
                  </select>
                </div>

                <form 
                  className="form" 
                  onSubmit={handleCreateTask} 
                  style={{ 
                    fontFamily: "'Playfair Display', serif",
                    backgroundColor: "var(--color-bg-light)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                    border: "1px solid var(--color-border)",
                    transition: "all 0.3s ease"
                  }}
                >
                  <h3 style={{ 
                    marginBottom: "1rem", 
                    color: "var(--color-primary)", 
                    fontSize: "1rem", 
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "0 2px 4px rgba(32, 178, 170, 0.1)"
                  }}>Create New Task</h3>
                  <input 
                    name="title" 
                    placeholder="Task title" 
                    required 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <input 
                    name="description" 
                    placeholder="Description" 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <div className="input-group">
                    <select 
                      name="priority" 
                      required 
                      className="input" 
                      style={{ 
                        flex: 1, 
                        fontFamily: "'Playfair Display', serif",
                        backgroundColor: "white",
                        border: "2px solid var(--color-border)",
                        borderRadius: "8px",
                        padding: "0.875rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        cursor: "pointer"
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                      }}
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <input 
                    name="deadline" 
                    type="date" 
                    required 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid var(--color-border)",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem",
                      marginTop: "1rem"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <div className="input-group">
                    <select 
                      name="assignee" 
                      required 
                      value={selectedAssignee}
                      onChange={(e) => setSelectedAssignee(e.target.value)}
                      className="input" 
                      style={{ 
                        flex: 1, 
                        fontFamily: "'Playfair Display', serif",
                        backgroundColor: "white",
                        border: "2px solid var(--color-border)",
                        borderRadius: "8px",
                        padding: "0.875rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                        cursor: "pointer"
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                      }}
                    >
                      <option value="">Assign to</option>
                      {assignees.map(assignee => (
                        <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <input 
                      name="start_time" 
                      type="time" 
                      placeholder="Start Time" 
                      className="input" 
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        backgroundColor: "white",
                        border: "2px solid var(--color-border)",
                        borderRadius: "8px",
                        padding: "0.875rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                      }}
                    />
                    <input 
                      name="end_time" 
                      type="time" 
                      placeholder="End Time" 
                      className="input" 
                      style={{ 
                        fontFamily: "'Playfair Display', serif",
                        backgroundColor: "white",
                        border: "2px solid var(--color-border)",
                        borderRadius: "8px",
                        padding: "0.875rem",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
                      }}
                      onFocus={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                      }}
                      onBlur={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="button button-primary" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      marginTop: "1rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(255, 88, 68, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(255, 88, 68, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(255, 88, 68, 0.3)";
                    }}
                  >
                    Create Task
                  </button>
                </form>

                {/* Tasks List */}
                <div className="tasks-list" style={{ marginTop: "1.5rem", fontFamily: "'Playfair Display', serif" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)", fontFamily: "'Playfair Display', serif" }}>
                      Loading tasks...
                    </div>
                  ) : getFilteredTasks().length === 0 ? (
                    <div className="empty-state" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <div className="empty-state-icon"></div>
                      <div className="empty-state-title">No tasks yet</div>
                      <div className="empty-state-description">Create a task using the form above to get started</div>
                    </div>
                  ) : (
                    getFilteredTasks().map((task) => (
                      <div key={task._id} className="task-card" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <div className="task-card-header">
                          <div className="task-card-title">{task.title}</div>
                          <div className="task-card-deadline">
                            <span className="task-card-deadline-label">
                              {formatDate(task.deadline).split(" ")[0]}
                            </span>
                            {formatDate(task.deadline).replace("Due ", "")}
                          </div>
                        </div>

                        {/* Labels */}
                        {task.labels && task.labels.length > 0 && (
                          <div className="task-card-labels">
                            <span className={`label-tag ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                            {task.labels.map((label, idx) => (
                              <span key={idx} className={`label-tag ${getLabelColor(label)}`}>
                                {label}
                              </span>
                            ))}
                          </div>
                        )}

                        {task.labels && task.labels.length === 0 && (
                          <div className="task-card-labels">
                            <span className={`label-tag ${task.priority.toLowerCase()}`}>
                              {task.priority}
                            </span>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="task-card-footer">
                          <div className="task-card-meta">
                            <div className="task-card-comment">
                              <span className="task-card-comment-icon">💬</span>
                              <span>1</span>
                            </div>
                          </div>
                          <div className="task-card-assignees" style={{ position: "relative" }}>
                            <button
                              onClick={() => {
                                setOpenAssigneeDropdown(openAssigneeDropdown === task._id ? null : task._id);
                                setAssigneeSearchQuery("");
                              }}
                              title={assignees.find(a => a.id === task.assignee)?.name || "Unassigned"}
                              style={{
                                cursor: "pointer",
                                background: "none",
                                border: "none",
                                fontSize: "1.5rem",
                                padding: "4px",
                                lineHeight: "1",
                                transition: "all 0.3s ease",
                                transform: openAssigneeDropdown === task._id ? "scale(1.2)" : "scale(1)",
                                filter: openAssigneeDropdown === task._id ? "drop-shadow(0 0 8px rgba(32, 178, 170, 0.6))" : "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                              onMouseEnter={(e) => {
                                if (openAssigneeDropdown !== task._id) {
                                  (e.currentTarget as HTMLElement).style.transform = "scale(1.15)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (openAssigneeDropdown !== task._id) {
                                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                                }
                              }}
                            >
                              <svg width="32" height="32" viewBox="0 0 32 32" style={{
                                borderRadius: "50%",
                                backgroundColor: "#20B2AA"
                              }}>
                                {/* Lotus Flower */}
                                <g fill="white">
                                  {/* Outer petals (5) */}
                                  <ellipse cx="16" cy="8" rx="2.5" ry="4" fill="white" opacity="0.9"/>
                                  <ellipse cx="24" cy="12" rx="2.5" ry="4" transform="rotate(72 24 12)" fill="white" opacity="0.9"/>
                                  <ellipse cx="22" cy="22" rx="2.5" ry="4" transform="rotate(144 22 22)" fill="white" opacity="0.9"/>
                                  <ellipse cx="10" cy="22" rx="2.5" ry="4" transform="rotate(216 10 22)" fill="white" opacity="0.9"/>
                                  <ellipse cx="8" cy="12" rx="2.5" ry="4" transform="rotate(288 8 12)" fill="white" opacity="0.9"/>
                                  
                                  {/* Inner petals (5) */}
                                  <ellipse cx="16" cy="12" rx="1.8" ry="3" fill="white"/>
                                  <ellipse cx="21.5" cy="15.5" rx="1.8" ry="3" transform="rotate(72 21.5 15.5)" fill="white"/>
                                  <ellipse cx="19.5" cy="22" rx="1.8" ry="3" transform="rotate(144 19.5 22)" fill="white"/>
                                  <ellipse cx="12.5" cy="22" rx="1.8" ry="3" transform="rotate(216 12.5 22)" fill="white"/>
                                  <ellipse cx="10.5" cy="15.5" rx="1.8" ry="3" transform="rotate(288 10.5 15.5)" fill="white"/>
                                  
                                  {/* Center stamen */}
                                  <circle cx="16" cy="16" r="2.5" fill="white"/>
                                  <circle cx="16" cy="16" r="1.5" fill="#20B2AA"/>
                                </g>
                              </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {openAssigneeDropdown === task._id && (
                              <div style={{
                                position: "absolute",
                                right: 0,
                                top: "100%",
                                marginTop: "0.5rem",
                                backgroundColor: "var(--color-bg-light)",
                                border: "1px solid var(--color-border)",
                                borderRadius: "8px",
                                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                                zIndex: 1000,
                                minWidth: "200px",
                                overflow: "hidden",
                                animation: "slideInUp 0.2s ease-out"
                              }}>
                                {/* Search Input */}
                                <div style={{
                                  padding: "0.75rem",
                                  borderBottom: "1px solid var(--color-border)",
                                  backgroundColor: "var(--color-bg-light)"
                                }}>
                                  <input
                                    type="text"
                                    placeholder="Search assignees..."
                                    value={assigneeSearchQuery}
                                    onChange={(e) => setAssigneeSearchQuery(e.target.value)}
                                    autoFocus
                                    style={{
                                      width: "100%",
                                      padding: "0.5rem 0.75rem",
                                      border: "1px solid var(--color-border)",
                                      borderRadius: "6px",
                                      fontSize: "0.875rem",
                                      fontFamily: "'Playfair Display', serif",
                                      boxSizing: "border-box",
                                      transition: "all 0.3s ease"
                                    }}
                                    onFocus={(e) => {
                                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 8px rgba(32, 178, 170, 0.3)";
                                    }}
                                    onBlur={(e) => {
                                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                    }}
                                  />
                                </div>

                                {/* Assignee List */}
                                <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                                  {getFilteredAssignees(assigneeSearchQuery).length === 0 ? (
                                    <div style={{
                                      padding: "1rem",
                                      textAlign: "center",
                                      color: "var(--color-text-tertiary)",
                                      fontSize: "0.875rem",
                                      fontFamily: "'Playfair Display', serif"
                                    }}>
                                      No assignees found
                                    </div>
                                  ) : (
                                    getFilteredAssignees(assigneeSearchQuery).map((assignee, idx) => (
                                      <button
                                        key={assignee.id}
                                        onClick={() => {
                                          handleUpdateAssignee(task._id, assignee.id);
                                        }}
                                        style={{
                                          width: "100%",
                                          padding: "0.75rem",
                                          border: "none",
                                          backgroundColor: task.assignee === assignee.id ? "rgba(32, 178, 170, 0.1)" : "transparent",
                                          color: "var(--color-text-primary)",
                                          cursor: "pointer",
                                          textAlign: "left",
                                          transition: "all 0.2s ease",
                                          fontFamily: "'Playfair Display', serif",
                                          fontSize: "0.875rem",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "0.75rem",
                                          borderBottom: idx < getFilteredAssignees(assigneeSearchQuery).length - 1 ? "1px solid var(--color-border)" : "none"
                                        }}
                                        onMouseEnter={(e) => {
                                          (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(32, 178, 170, 0.15)";
                                        }}
                                        onMouseLeave={(e) => {
                                          (e.currentTarget as HTMLElement).style.backgroundColor = task.assignee === assignee.id ? "rgba(32, 178, 170, 0.1)" : "transparent";
                                        }}
                                      >
                                        <div className={`avatar avatar-${(idx % 3) + 1}`} style={{
                                          width: "24px",
                                          height: "24px",
                                          minWidth: "24px",
                                          fontSize: "0.65rem"
                                        }}>
                                          {getInitials(assignee.name)}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                          <div style={{ fontWeight: 500 }}>{assignee.name}</div>
                                        </div>
                                        {task.assignee === assignee.id && (
                                          <span style={{ color: "#20B2AA", fontWeight: "bold" }}>Selected</span>
                                        )}
                                      </button>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Task Actions */}
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleToggleTask(task._id, task.completed || false)}
                            className="button button-secondary button-small"
                            style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                          >
                            {task.completed ? "Undo" : "Complete"}
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="button button-small"
                            style={{
                              flex: 1,
                              backgroundColor: "#DC2626",
                              color: "white",
                              cursor: "pointer",
                              border: "none",
                              fontFamily: "'Playfair Display', serif"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "Checklist" && <Checklist />}

            {activeTab === "Goals" && (
              <>
                {/* Create Goal Form */}
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const newGoal: Goal = {
                    id: Date.now().toString(),
                    title: formData.get("title") as string,
                    description: formData.get("description") as string,
                    category: formData.get("category") as string,
                    progress: 0,
                    createdAt: new Date().toISOString()
                  };
                  const updatedGoals = [newGoal, ...goals];
                  saveGoals(updatedGoals);
                  form.reset();
                }} className="form" style={{ 
                  fontFamily: "'Playfair Display', serif",
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  border: "1px solid var(--color-border)",
                  transition: "all 0.3s ease"
                }}>
                  <h3 style={{ 
                    marginBottom: "1rem", 
                    color: "var(--color-primary)", 
                    fontSize: "1rem", 
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "0 2px 4px rgba(32, 178, 170, 0.1)"
                  }}>Create New Goal</h3>
                  <input 
                    name="title" 
                    placeholder="Goal title" 
                    required 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid #20B2AA",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 0 12px rgba(32, 178, 170, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem",
                      color: "#20B2AA"
                    } as React.CSSProperties & {
                      "&::placeholder": React.CSSProperties;
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), 0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(32, 178, 170, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <style>{`
                    input[name="title"]::placeholder {
                      color: #20B2AA;
                      opacity: 0.7;
                      text-shadow: 0 0 8px rgba(32, 178, 170, 0.3);
                    }
                    textarea[name="description"]::placeholder {
                      color: #20B2AA;
                      opacity: 0.7;
                      text-shadow: 0 0 8px rgba(32, 178, 170, 0.3);
                    }
                    select[name="category"] option {
                      color: #20B2AA;
                    }
                  `}</style>
                  <textarea 
                    name="description" 
                    placeholder="Goal description" 
                    required 
                    className="input" 
                    rows={3} 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid #20B2AA",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 0 12px rgba(32, 178, 170, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem",
                      resize: "vertical",
                      color: "#20B2AA"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(32, 178, 170, 0.6), 0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(32, 178, 170, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  />
                  <select 
                    name="category" 
                    required 
                    className="input" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      backgroundColor: "white",
                      border: "2px solid #20B2AA",
                      borderRadius: "8px",
                      padding: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 0 12px rgba(32, 178, 170, 0.4), 0 2px 8px rgba(0, 0, 0, 0.04)",
                      marginBottom: "1rem",
                      cursor: "pointer",
                      color: "#20B2AA"
                    }}
                    onFocus={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(32, 178, 170, 0.15)";
                    }}
                    onBlur={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Career">Career</option>
                    <option value="Education">Education</option>
                    <option value="Personal">Personal</option>
                    <option value="Project">Project</option>
                  </select>
                  <button 
                    type="submit" 
                    className="button button-primary" 
                    style={{ 
                      fontFamily: "'Playfair Display', serif",
                      transition: "all 0.3s ease",
                      boxShadow: "0 4px 12px rgba(255, 88, 68, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(255, 88, 68, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 12px rgba(255, 88, 68, 0.3)";
                    }}
                  >
                    Create Goal
                  </button>
                </form>

                {/* Goals List */}
                <div className="tasks-list" style={{ marginTop: "1.5rem" }}>
                  {goals.length === 0 ? (
                    <div className="empty-state" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <div className="empty-state-icon" style={{ fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                          {/* Outer petals - back layer */}
                          <path d="M 12 2 Q 14 5 14 8 Q 14 10 12 10 Q 10 10 10 8 Q 10 5 12 2"></path>
                          <path d="M 12 2 Q 16 6 19 8 Q 20 9 19 11 Q 17 12 15 10 Q 13 7 12 2"></path>
                          <path d="M 12 2 Q 8 6 5 8 Q 4 9 5 11 Q 7 12 9 10 Q 11 7 12 2"></path>
                          <path d="M 18 8 Q 20 10 21 14 Q 21 16 19 17 Q 17 16 16 13 Q 16 10 18 8"></path>
                          <path d="M 6 8 Q 4 10 3 14 Q 3 16 5 17 Q 7 16 8 13 Q 8 10 6 8"></path>
                          {/* Middle petals */}
                          <path d="M 18 14 Q 20 16 20 20 Q 20 22 18 22 Q 16 21 16 18 Q 17 16 18 14"></path>
                          <path d="M 6 14 Q 4 16 4 20 Q 4 22 6 22 Q 8 21 8 18 Q 7 16 6 14"></path>
                          {/* Inner petals - front layer */}
                          <path d="M 12 6 Q 13 8 13 10 Q 13 11 12 11 Q 11 11 11 10 Q 11 8 12 6"></path>
                          {/* Center circle */}
                          <circle cx="12" cy="14" r="2"></circle>
                          {/* Stem */}
                          <line x1="12" y1="16" x2="12" y2="23"></line>
                        </svg>
                      </div>
                      <div className="empty-state-title">No Goals Yet</div>
                      <div className="empty-state-description">Create a goal to get started on achieving your dreams</div>
                    </div>
                  ) : (
                    goals.map((goal) => (
                      <div key={goal.id} className="task-card" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <div style={{ marginBottom: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "0.5rem" }}>
                            <h4 style={{ color: "var(--color-primary)", margin: "0", fontFamily: "'Playfair Display', serif" }}>{goal.title}</h4>
                            <span style={{ 
                              backgroundColor: goal.category === "Health" ? "#FFE5CC" :
                                             goal.category === "Finance" ? "#D1F2EB" :
                                             goal.category === "Career" ? "#E0E7FF" :
                                             goal.category === "Education" ? "#FEE2E2" :
                                             goal.category === "Personal" ? "#F3E8FF" : "#E0E7FF",
                              color: goal.category === "Health" ? "#FFA500" :
                                    goal.category === "Finance" ? "#26C7A0" :
                                    goal.category === "Career" ? "#6366F1" :
                                    goal.category === "Education" ? "#DC2626" :
                                    goal.category === "Personal" ? "#A855F7" : "#6366F1",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "20px",
                              fontSize: "0.75rem",
                              fontWeight: "600",
                              fontFamily: "'Playfair Display', serif"
                            }}>
                              {goal.category}
                            </span>
                          </div>
                          <p style={{ color: "var(--color-text-secondary)", margin: "0 0 1rem 0", fontFamily: "'Playfair Display', serif" }}>{goal.description}</p>
                          
                          {/* Progress Bar */}
                          <div style={{ marginBottom: "0.75rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem", fontSize: "0.875rem", fontFamily: "'Playfair Display', serif" }}>
                              <span>Progress</span>
                              <span>{goal.progress}%</span>
                            </div>
                            <div style={{
                              width: "100%",
                              height: "8px",
                              backgroundColor: "var(--color-border)",
                              borderRadius: "4px",
                              overflow: "hidden"
                            }}>
                              <div style={{
                                width: `${goal.progress}%`,
                                height: "100%",
                                backgroundColor: "#20B2AA",
                                transition: "width 0.3s ease"
                              }}></div>
                            </div>
                          </div>
                        </div>

                        {/* Goal Actions */}
                        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => {
                              const updated = goals.map(g => {
                                if (g.id === goal.id) {
                                  const newProgress = Math.min(g.progress + 10, 100);
                                  if (newProgress === 100 && g.progress < 100) {
                                    // Trigger celebration when reaching 100%
                                    setCelebrationActive(true);
                                    setTimeout(() => setCelebrationActive(false), 3500);
                                  }
                                  return { ...g, progress: newProgress };
                                }
                                return g;
                              });
                              saveGoals(updated);
                            }}
                            className="button button-secondary button-small"
                            style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
                          >
                            +10%
                          </button>
                          <button
                            onClick={() => {
                              const updated = goals.filter(g => g.id !== goal.id);
                              saveGoals(updated);
                            }}
                            className="button button-small"
                            style={{
                              flex: 1,
                              backgroundColor: "#DC2626",
                              color: "white",
                              cursor: "pointer",
                              border: "none",
                              fontFamily: "'Playfair Display', serif"
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Effect */}
      <CelebrationEffect trigger={celebrationActive} />

      {/* Task Completion Stars */}
      <StarsCelebration trigger={taskCompletionActive} />

      {/* FAB */}
      <button className="button-fab" title="Add new task" onClick={() => {
        const titleInput = document.querySelector("input[name='title']") as HTMLInputElement;
        if (titleInput) {
          titleInput.focus();
          titleInput.scrollIntoView({ behavior: "smooth" });
        }
      }}>
        +
      </button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}


