import { create } from "zustand";
import axios from "../config/axios.config";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  tokenExpiresAt: null,
  isTokenChecked: false, // Token kontrol edildi mi?

  // Kullanıcının kimlik doğrulama durumunu kontrol et
  verifyUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/auth/verify", {
        withCredentials: true,
      });
      console.log("User verified:", response.data);

      set({ user: response.data, loading: false, isTokenChecked: true });
      return response.data;
    } catch (error) {
      set({ user: null, loading: false, isTokenChecked: true });
      throw error;
    }
  },

  // Login başarılı olduğunda token zamanını izleyin
  loginAdmin: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Token bitiş zamanı
      set({
        user,
        token,
        tokenExpiresAt: decodedToken.exp * 1000,
        loading: false,
        isTokenChecked: true,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Login failed.",
        loading: false,
      });
      throw error;
    }
  },

  // Token yenileme işlemi
  refreshToken: async () => {
    try {
      const response = await axios.post(
        "/api/auth/refresh-token",
        {},
        { withCredentials: true }
      );
      const { accessToken } = response.data;
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      set({
        token: accessToken,
        tokenExpiresAt: decodedToken.exp * 1000,
        isTokenChecked: true,
      });
    } catch (error) {
      set({
        error: "Failed to refresh token.",
        user: null,
        token: null,
        isTokenChecked: true,
      });
    }
  },

  // Logout
  logoutAdmin: async () => {
    set({ loading: true });
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      set({
        user: null,
        token: null,
        tokenExpiresAt: null,
        loading: false,
        isTokenChecked: false,
      });
    } catch (error) {
      set({ error: "Logout failed.", loading: false });
    }
  },

  // Token geçerliliğini kontrol et
  ensureTokenValidity: async () => {
    const { tokenExpiresAt } = useAuthStore.getState();
    if (!tokenExpiresAt || Date.now() < tokenExpiresAt - 60000) return;
    try {
      await useAuthStore.getState().refreshToken();
    } catch (error) {
      console.error("Token yenileme başarısız:", error.message);
    }
  },
}));

export default useAuthStore;