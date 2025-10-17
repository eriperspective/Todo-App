import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tabs from "./Tabs";
import Checklist from "./Checklist";
import BottomNav from "./BottomNav";
import CelebrationEffect from "./CelebrationEffect";
import StarsCelebration from "./StarsCelebration";
import HamburgerNav from "./HamburgerNav";

interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: string;
  deadline: string;
  completed?: boolean;
  assignee?: string;
  labels?: string[];
}

interface Label {
  _id: string;
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

export default function DashboardContent() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("Tasks");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [labelFilter, setLabelFilter] = useState("");
  const [celebrationActive, setCelebrationActive] = useState(false);
  const [taskCompletionActive, setTaskCompletionActive] = useState(false);

  // Check auth and load data
  useEffect(() => {
    setMounted(true);
    const storedToken = localStorage.getItem("token");
    
    if (!storedToken) {
      router.push("/login");
      return;
    }

    setToken(storedToken);
    fetchTasks(storedToken);
    fetchLabels(storedToken);
    loadNotes();
    loadGoals();
    
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
  }, []);

  const fetchTasks = async (authToken: string) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/tasks", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching tasks:", err);
      setError(err.message || "Failed to fetch tasks");
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
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      setLabels(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching labels:", err);
      setLabels([]);
    }
  };

  const loadNotes = () => {
    try {
      const storedNotes = localStorage.getItem("notes");
      setNotes(storedNotes ? JSON.parse(storedNotes) : []);
    } catch {
      setNotes([]);
    }
  };

  const saveNotes = (newNotes: Note[]) => {
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setNotes(newNotes);
  };

  const loadGoals = () => {
    try {
      const storedGoals = localStorage.getItem("goals");
      setGoals(storedGoals ? JSON.parse(storedGoals) : []);
    } catch {
      setGoals([]);
    }
  };

  const saveGoals = (newGoals: Goal[]) => {
    localStorage.setItem("goals", JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const task = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || null,
      priority: formData.get("priority") as string,
      deadline: formData.get("deadline") as string,
      completed: false,
      labels: [],
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
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to create task");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
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

      if (res.ok) fetchTasks(token);
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) fetchTasks(token);
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    router.push("/login");
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

  if (!mounted || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading Dashboard...</h1>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

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
              fontFamily: "'Playfair Display', serif",
              margin: 0
            }}>
              Perspectives
            </h1>
          </div>
        </div>
        <button 
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
          }}
        >
          ↪️
        </button>
      </header>

      {/* Content */}
      <div className="dashboard-content">
        <div className="dashboard-main">
          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            {["Tasks", "Checklist", "Notes", "Goals"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "0.95rem",
                  color: activeTab === tab ? "#FF5844" : "#20B2AA",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
              >
                {tab}
              </button>
            ))}
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
              }}>
                {error}
              </div>
            )}

            {activeTab === "Tasks" && (
              <>
                {/* Search and Filter */}
                <div style={{ 
                  display: "flex", 
                  gap: "1rem", 
                  marginBottom: "1.5rem", 
                  flexWrap: "wrap", 
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                }}>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ 
                      flex: 1, 
                      minWidth: "200px", 
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                    }}
                  />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    style={{ 
                      flex: 1, 
                      minWidth: "150px", 
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                    }}
                  >
                    <option value="">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Create Task Form */}
                <form onSubmit={handleCreateTask} style={{ 
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem"
                }}>
                  <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>Create New Task</h3>
                  <input 
                    name="title" 
                    placeholder="Task title" 
                    required 
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <input 
                    name="description" 
                    placeholder="Description" 
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <select 
                      name="priority" 
                      required 
                      style={{ 
                        flex: 1, 
                        padding: "0.875rem",
                        borderRadius: "8px",
                        border: "2px solid var(--color-border)",
                      }}
                    >
                      <option value="">Select Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                    <input 
                      name="deadline" 
                      type="date" 
                      required 
                      style={{ 
                        flex: 1,
                        padding: "0.875rem",
                        borderRadius: "8px",
                        border: "2px solid var(--color-border)",
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{
                      width: "100%",
                      padding: "0.875rem",
                      backgroundColor: "#FF5844",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Create Task
                  </button>
                </form>

                {/* Tasks List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {loading ? (
                    <p>Loading tasks...</p>
                  ) : getFilteredTasks().length === 0 ? (
                    <p style={{ textAlign: "center", color: "var(--color-text-secondary)" }}>No tasks yet</p>
                  ) : (
                    getFilteredTasks().map((task) => (
                      <div key={task._id} style={{
                        backgroundColor: "var(--color-bg-light)",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <div>
                            <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>{task.title}</h4>
                            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                              {task.description}
                            </p>
                            <span style={{
                              display: "inline-block",
                              backgroundColor: task.priority === "High" ? "#FEE2E2" : "#D1F2EB",
                              color: task.priority === "High" ? "#DC2626" : "#26C7A0",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "4px",
                              fontSize: "0.75rem"
                            }}>
                              {task.priority}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleToggleTask(task._id, task.completed || false)}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#20B2AA",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.875rem"
                              }}
                            >
                              {task.completed ? "Undo" : "Complete"}
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#DC2626",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.875rem"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {activeTab === "Checklist" && <Checklist />}

            {activeTab === "Notes" && (
              <>
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
                  saveNotes([newNote, ...notes]);
                  form.reset();
                }} style={{ 
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem"
                }}>
                  <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>Create Note</h3>
                  <input 
                    name="title" 
                    placeholder="Note title" 
                    required 
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <textarea 
                    name="content" 
                    placeholder="Note content" 
                    required 
                    rows={5}
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <button type="submit" style={{
                    width: "100%",
                    padding: "0.875rem",
                    backgroundColor: "#FF5844",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}>
                    Create Note
                  </button>
                </form>
                
                {notes.map((note) => (
                  <div key={note.id} style={{
                    backgroundColor: "var(--color-bg-light)",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>{note.title}</h4>
                    <p style={{ margin: "0", color: "var(--color-text-secondary)" }}>{note.content}</p>
                  </div>
                ))}
              </>
            )}

            {activeTab === "Goals" && (
              <>
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
                  saveGoals([newGoal, ...goals]);
                  form.reset();
                }} style={{ 
                  backgroundColor: "var(--color-bg-light)",
                  padding: "1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem"
                }}>
                  <h3 style={{ marginBottom: "1rem", color: "var(--color-primary)" }}>Create Goal</h3>
                  <input 
                    name="title" 
                    placeholder="Goal title" 
                    required 
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <textarea 
                    name="description" 
                    placeholder="Description" 
                    required 
                    rows={3}
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  />
                  <select 
                    name="category" 
                    required 
                    style={{ 
                      width: "100%",
                      padding: "0.875rem",
                      borderRadius: "8px",
                      border: "2px solid var(--color-border)",
                      marginBottom: "1rem",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Select Category</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Career">Career</option>
                  </select>
                  <button type="submit" style={{
                    width: "100%",
                    padding: "0.875rem",
                    backgroundColor: "#FF5844",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}>
                    Create Goal
                  </button>
                </form>

                {goals.map((goal) => (
                  <div key={goal.id} style={{
                    backgroundColor: "var(--color-bg-light)",
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>{goal.title}</h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
                      {goal.description}
                    </p>
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
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>{goal.progress}%</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Celebration Effect */}
      <CelebrationEffect trigger={celebrationActive} />
      <StarsCelebration trigger={taskCompletionActive} />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
