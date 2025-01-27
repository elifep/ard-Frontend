import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";

const usePasswordStore = create((set) => ({
  loading: false,
  error: null,
  message: null,

  // Sistem içindeyken şifre değiştirme
  changePassword: async (oldPassword, newPassword) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/password/change-password`,
        {
          oldPassword,
          newPassword,
        }
      );

      set({
        message: response.data.message || "Password changed successfully.",
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error changing password.",
        loading: false,
      });
    }
  },

  // Şifre sıfırlama talebi (login ekranından)
  requestPasswordReset: async (email) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/password/reset-password/request`,
        {
          email,
        }
      );

      set({
        message:
          response.data.message || "Password reset link sent to your email.",
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error.response?.data?.error || "Error requesting password reset.",
        loading: false,
      });
    }
  },

  // Yeni şifre belirleme (reset token ile)
  confirmPasswordReset: async (token, newPassword) => {
    set({ loading: true, error: null, message: null });

    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/password/reset-password/confirm`,
        {
          token,
          newPassword,
        }
      );

      set({
        message: response.data.message || "Password reset successfully.",
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error resetting password.",
        loading: false,
      });
    }
  },
}));

export default usePasswordStore;