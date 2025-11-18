const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = options.headers || {};
  headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export const authSignup = (payload) => request("/auth/signup", { method: "POST", body: JSON.stringify(payload) });
export const authLogin = (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const getTasks = (query = "") => request(`/tasks${query ? "?" + query : ""}`);
export const createTask = (payload) => request("/tasks", { method: "POST", body: JSON.stringify(payload) });
export const updateTask = (id, payload) => request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(payload) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: "DELETE" });
export const getUsers = (query = "") => request(`/users${query ? "?" + query : ""}`);
