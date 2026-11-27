import axios from "axios";

// Two deployment modes are supported:
//  1) Default: requests go to "/api" on this site and are proxied to the
//     backend by Vercel (see vercel.json) or by Vite in development.
//  2) Direct: set VITE_API_URL to the backend origin, e.g.
//     https://ecohand-api.onrender.com  (the /api suffix is added for you).
const configuredUrl = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const backendOrigin = configuredUrl.replace(/\/api$/, "");
const baseURL = backendOrigin ? `${backendOrigin}/api` : "/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach token from localStorage as a fallback (in addition to httpOnly cookie)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ecohand_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler -> clear auth state
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("ecohand_token");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("ecohand:unauthorized"));
      }
    }
    return Promise.reject(err);
  }
);

export default api;
