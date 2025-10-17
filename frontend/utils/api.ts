const API_BASE_URL = 'http://localhost:8000';

export const api = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  signup: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });
    return response.json();
  },

  // Task endpoints
  getTasks: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createTask: async (task: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    return response.json();
  },

  updateTask: async (taskId: string, updates: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  },

  deleteTask: async (taskId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Label endpoints
  getLabels: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/labels`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  createLabel: async (label: any, token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/labels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(label),
    });
    return response.json();
  },

  assignLabelsToTask: async (taskId: string, labels: string[], token: string) => {
    const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/labels`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(labels),
    });
    return response.json();
  },
};
