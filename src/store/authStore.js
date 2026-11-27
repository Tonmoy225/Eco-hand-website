import { create } from "zustand";
import { loginApi, registerApi, logoutApi, getMeApi } from "../api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  isAuthModalOpen: false,
  authModalView: "login", // 'login' | 'signup'

  openAuthModal: (view = "login") => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthView: (view) => set({ authModalView: view }),

  init: async () => {
    const token = localStorage.getItem("ecohand_token");
    if (!token) return set({ loading: false });
    try {
      const { data } = await getMeApi();
      set({ user: data, loading: false });
    } catch (err) {
      // Only discard the token when the server explicitly rejected it.
      // A network error (e.g. a sleeping free-tier backend) must not log the
      // user out permanently — the token can still be reused on next load.
      if (err.response && [401, 403].includes(err.response.status)) {
        localStorage.removeItem("ecohand_token");
      }
      set({ user: null, loading: false });
    }
  },

  // Login/register responses from older backends omit `role`, so fetch the
  // full profile to make admin navigation appear immediately after sign-in.
  resolveUser: async (data) => {
    try {
      const { data: me } = await getMeApi();
      return me;
    } catch {
      return data;
    }
  },

  login: async (email, password) => {
    const { data } = await loginApi({ email, password });
    localStorage.setItem("ecohand_token", data.token);
    const full = await get().resolveUser(data);
    set({ user: full, isAuthModalOpen: false });
    return full;
  },

  register: async (name, email, password) => {
    const { data } = await registerApi({ name, email, password });
    localStorage.setItem("ecohand_token", data.token);
    const full = await get().resolveUser(data);
    set({ user: full, isAuthModalOpen: false });
    return full;
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("ecohand_token");
    set({ user: null });
  },

  updateUserLocal: (patch) => set({ user: { ...get().user, ...patch } }),
}));

// Keep UI in sync when any API call reports an expired/invalid token.
if (typeof window !== "undefined") {
  window.addEventListener("ecohand:unauthorized", () => {
    useAuthStore.setState({ user: null });
  });
}
