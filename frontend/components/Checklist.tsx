import { useState, useEffect } from "react";

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  createdAt: string;
}

export default function Checklist() {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [newItemText, setNewItemText] = useState<{ [key: string]: string }>({});

  // Load checklists from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("checklists");
    if (stored) {
      setChecklists(JSON.parse(stored));
    }
  }, []);

  // Save checklists to localStorage
  const saveChecklists = (data: Checklist[]) => {
    setChecklists(data);
    localStorage.setItem("checklists", JSON.stringify(data));
  };

  // Create new checklist
  const handleCreateChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newChecklist: Checklist = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      items: [],
      createdAt: new Date().toISOString(),
    };

    saveChecklists([...checklists, newChecklist]);
    setFormData({ title: "", description: "" });
    setShowForm(false);
  };

  // Add item to checklist
  const handleAddItem = (checklistId: string) => {
    const itemText = newItemText[checklistId] || "";
    if (!itemText.trim()) return;

    const updated = checklists.map((checklist) => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: [
            ...checklist.items,
            { id: Date.now().toString(), text: itemText, completed: false },
          ],
        };
      }
      return checklist;
    });

    saveChecklists(updated);
    setNewItemText({ ...newItemText, [checklistId]: "" });
  };

  // Toggle item completion
  const handleToggleItem = (checklistId: string, itemId: string) => {
    const updated = checklists.map((checklist) => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      }
      return checklist;
    });

    saveChecklists(updated);
  };

  // Delete item
  const handleDeleteItem = (checklistId: string, itemId: string) => {
    const updated = checklists.map((checklist) => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.filter((item) => item.id !== itemId),
        };
      }
      return checklist;
    });

    saveChecklists(updated);
  };

  // Delete checklist
  const handleDeleteChecklist = (checklistId: string) => {
    saveChecklists(checklists.filter((c) => c.id !== checklistId));
  };

  // Calculate progress
  const getProgress = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completed = checklist.items.filter((item) => item.completed).length;
    return Math.round((completed / checklist.items.length) * 100);
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", padding: "1.5rem" }}>
      {/* Create Checklist Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="button button-primary"
          style={{
            fontFamily: "'Playfair Display', serif",
            marginBottom: "1.5rem",
            width: "100%",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(255, 88, 68, 0.3)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 6px 20px rgba(255, 88, 68, 0.5)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 4px 12px rgba(255, 88, 68, 0.3)";
          }}
        >
          + Create New Checklist
        </button>
      )}

      {/* Create Checklist Form */}
      {showForm && (
        <form
          onSubmit={handleCreateChecklist}
          className="form"
          style={{
            fontFamily: "'Playfair Display', serif",
            backgroundColor: "var(--color-bg-light)",
            padding: "1.5rem",
            marginBottom: "1.5rem",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
          }}
        >
          <h3
            style={{
              color: "var(--color-primary)",
              margin: "0 0 1rem 0",
              fontSize: "1.1rem",
            }}
          >
            Create New Checklist
          </h3>

          <input
            type="text"
            placeholder="Checklist title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input"
            required
            style={{
              fontFamily: "'Playfair Display', serif",
              backgroundColor: "white",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              padding: "0.875rem",
              marginBottom: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(32, 178, 170, 0.15)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0, 0, 0, 0.04)";
            }}
          />

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input"
            rows={3}
            style={{
              fontFamily: "'Playfair Display', serif",
              backgroundColor: "white",
              border: "2px solid var(--color-border)",
              borderRadius: "8px",
              padding: "0.875rem",
              marginBottom: "1rem",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              resize: "vertical",
            }}
            onFocus={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "#20B2AA";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 4px 16px rgba(32, 178, 170, 0.15)";
            }}
            onBlur={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)";
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 2px 8px rgba(0, 0, 0, 0.04)";
            }}
          />

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              className="button button-primary"
              style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
            >
              Create Checklist
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="button button-secondary"
              style={{ flex: 1, fontFamily: "'Playfair Display', serif" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Checklists List */}
      {checklists.length === 0 ? (
        <div
          className="empty-state"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <div className="empty-state-icon" style={{ fontSize: "3rem" }}>
            ☑️
          </div>
          <div
            className="empty-state-title"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            No Checklists Yet
          </div>
          <div
            className="empty-state-description"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Create your first checklist to get started organizing your tasks and
            goals!
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {checklists.map((checklist) => (
            <div
              key={checklist.id}
              className="task-card"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h4
                    style={{
                      color: "var(--color-primary)",
                      margin: 0,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {checklist.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteChecklist(checklist.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DC2626",
                      cursor: "pointer",
                      fontSize: "1rem",
                      padding: "0.5rem",
                    }}
                    title="Delete checklist"
                  >
                    ✕
                  </button>
                </div>

                {checklist.description && (
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      margin: "0 0 0.75rem 0",
                      fontSize: "0.95rem",
                    }}
                  >
                    {checklist.description}
                  </p>
                )}

                {/* Progress Bar */}
                {checklist.items.length > 0 && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <span>Progress</span>
                      <span>{getProgress(checklist)}%</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "var(--color-border)",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${getProgress(checklist)}%`,
                          height: "100%",
                          backgroundColor: "#20B2AA",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist Items */}
              <div style={{ marginBottom: "1rem" }}>
                {checklist.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      backgroundColor: "var(--color-bg)",
                      marginBottom: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() =>
                        handleToggleItem(checklist.id, item.id)
                      }
                      style={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    />
                    <span
                      style={{
                        flex: 1,
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                        color: item.completed
                          ? "var(--color-text-tertiary)"
                          : "var(--color-text-primary)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {item.text}
                    </span>
                    <button
                      onClick={() =>
                        handleDeleteItem(checklist.id, item.id)
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "#DC2626",
                        cursor: "pointer",
                        fontSize: "1rem",
                        padding: "0.25rem 0.5rem",
                      }}
                      title="Delete item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Item Form */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Add item..."
                  value={newItemText[checklist.id] || ""}
                  onChange={(e) =>
                    setNewItemText({
                      ...newItemText,
                      [checklist.id]: e.target.value,
                    })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddItem(checklist.id);
                    }
                  }}
                  className="input"
                  style={{
                    flex: 1,
                    fontFamily: "'Playfair Display', serif",
                    backgroundColor: "white",
                    border: "2px solid var(--color-border)",
                    borderRadius: "6px",
                    padding: "0.75rem",
                    fontSize: "0.875rem",
                  }}
                />
                <button
                  onClick={() => handleAddItem(checklist.id)}
                  className="button button-primary button-small"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

