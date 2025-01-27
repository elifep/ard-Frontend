import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";
import { toast } from "react-toastify";

const useUserStore = create((set, get) => ({
  users: [],
  adminUsers: [], // Admin kullanıcılarını saklamak için
  lawyerUsers: [], // Lawyer kullanıcılarını saklamak için
  cachedRoles: {}, // Cached roles burada saklanıyor
  loading: false,
  error: null,

  // Fetch all users
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/users`);
      console.log("Users Response:", response.data);
      set({ users: response.data, loading: false });
    } catch (err) {
      console.error("Fetch Users Error:", err);
      set({
        error:
          err.response?.data?.error ||
          "An error occurred while fetching users.",
        loading: false,
      });
    }
  },

  // Admin kullanıcılarını çek
  fetchAdminUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/users/role`, {
        params: { role: "admin" },
      });
      set({ adminUsers: response.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching admin users.",
        loading: false,
      });
      console.error(err);
    }
  },

  // Lawyer kullanıcılarını çek
  fetchLawyerUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/users/role`, {
        params: { role: "lawyer" },
      });
      set({ lawyerUsers: response.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching lawyer users.",
        loading: false,
      });
      console.error(err);
    }
  },

  // Fetch users by role with caching
  fetchUsersByRole: async (role) => {
    const { cachedRoles } = get(); // Mevcut cache'yi alıyoruz

    if (cachedRoles[role]) {
      set({ users: cachedRoles[role], loading: false });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/users/role`, {
        params: { role },
      });
      set((state) => ({
        users: response.data,
        cachedRoles: { ...state.cachedRoles, [role]: response.data }, // Yeni role ekleniyor
        loading: false,
      }));
    } catch (err) {
      set({
        error:
          err.response?.data?.error ||
          "An error occurred while fetching users by role.",
        loading: false,
      });
      console.error(err);
    }
  },

  // Fetch user by ID
  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/users/${id}`);
      return response.data;
    } catch (err) {
      set({
        error: err.response?.data?.error || "Error fetching user details.",
        loading: false,
      });
      throw err; // Hatanın üst bileşenlere ulaşabilmesi için fırlatılıyor
    }
  },

  // Create a new user
  createUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${VITE_API_URL}/api/users`, userData);
      set((state) => ({
        users: [...state.users, response.data],
        loading: false,
      }));
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Error creating the user.";
      set({
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage); // Hatanın üst bileşenlere ulaşabilmesi için
    }
  },

  // Update user by ID
  updateUserById: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(
        `${VITE_API_URL}/api/users/${id}`,
        userData
      );
      set((state) => ({
        users: state.users.map((user) =>
          user._id === id ? response.data : user
        ),
        loading: false,
      }));
      toast.success("Kullanıcı bilgileri başarıyla güncellendi!");
    } catch (err) {
      set({
        error:
          err.response?.data?.error ||
          "Kullanıcı güncellenirken bir hata oluştu.",
        loading: false,
      });
      console.error(err);
      toast.error("Kullanıcı bilgileri güncellenirken bir hata oluştu.");
    }
  },

  // Delete user by ID
  deleteUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/users/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user._id !== id),
        loading: false,
      }));
      toast.success("Kullanıcı başarıyla silindi!");
    } catch (err) {
      toast.error("Kullanıcı silinirken bir hata oluştu.");
      set({
        error: err.response?.data?.error || "Error deleting the user.",
        loading: false,
      });
      console.error(err);
    }
  },
}));

export default useUserStore;