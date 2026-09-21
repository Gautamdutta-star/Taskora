import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:8000"
    : "https://taskora-w9s0.onrender.com");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// =========================
// AUTH
// =========================

export const registerUser = async (data) => {
  const response = await api.post("/register", data);

  if (response.data.access_token) {
    localStorage.setItem(
      "access_token",
      response.data.access_token
    );
  }

  return response.data;
};


export const loginUser = async (data) => {
  const response = await api.post("/login", data);

  if (response.data.access_token) {
    localStorage.setItem(
      "access_token",
      response.data.access_token
    );
  }

  return response.data;
};


export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};


export const logoutUser = async () => {
  try {
    await api.post("/logout");
  } finally {
    localStorage.removeItem("access_token");
  }
};


// =========================
// USERS
// =========================

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};


export const createUser = async (data) => {
  const response = await api.post("/users", data);
  return response.data;
};


export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};


export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};


// =========================
// PROJECTS
// =========================

export const getProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};


export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};


export const getProject = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};


export const updateProject = async (id, data) => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data;
};


export const deleteProject = async (id) => {
  const response = await api.delete(`/projects/${id}`);
  return response.data;
};


// =========================
// TASKS
// =========================

export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};


export const createTask = async (data) => {
  const response = await api.post("/tasks", data);
  return response.data;
};


export const getTask = async (id) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};


export const updateTask = async (id, data) => {
  const response = await api.put(`/tasks/${id}`, data);
  return response.data;
};


export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};


// =========================
// AI TASK GENERATOR
// =========================

export const generateAITasks = async (goal) => {
  const response = await api.post(
    "/ai/generate-tasks",
    {
      goal: goal,
    }
  );

  return response.data;
};


export default api;
