import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";

const useIncidentStore = create((set) => ({
  categories: [], // Başlangıç değeri boş bir dizi
  incidents: [],
  incident: null,
  loading: false,
  error: null,
  message: null, // Bilgilendirme mesajı ekledik

  // Fetch all incidents
  fetchIncidents: async () => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/incidents`);
      console.log("response", response.data);
      if (response.data.length === 0) {
        set({
          incidents: [],
          message: "No incidents found.", // Veri yoksa bilgi mesajı
          loading: false,
        });
      } else {
        set({
          incidents: response.data,
          message: null, // Veri varsa mesajı sıfırlıyoruz
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching incidents",
        message: null, // Hata varsa bilgi mesajını sıfırlıyoruz
        loading: false,
      });
    }
  },

  // Fetch a single incident by ID
  fetchIncidentById: async (id) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/incidents/${id}`);
      if (!response.data) {
        set({
          incident: null,
          message: "Incident not found.", // Veri yoksa bilgi mesajı
          loading: false,
        });
      } else {
        set({
          incident: response.data,
          message: null, // Veri varsa mesajı sıfırlıyoruz
          loading: false,
        });
      }
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching incident",
        message: null, // Hata varsa bilgi mesajını sıfırlıyoruz
        loading: false,
      });
    }
  },

  // Fetch all categories
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(
        `${VITE_API_URL}/api/incidents/categories`
      );
      set({ categories: response.data, loading: false });
    } catch (error) {
      set({ categories: [], loading: false, error: "Kategoriler yüklenemedi" });
    }
  },

  // Create a new incident
  createIncident: async (incidentData) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/incidents`,
        incidentData
      );
      set((state) => ({
        incidents: [...state.incidents, response.data],
        message: "Incident created successfully.", // Başarılı oluşturma mesajı
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error creating incident",
        message: null,
        loading: false,
      });
    }
  },

  // Update an incident by ID
  updateIncident: async (id, updatedData) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.put(
        `${VITE_API_URL}/api/incidents/${id}`,
        updatedData
      );
      set((state) => ({
        incidents: state.incidents.map((incident) =>
          incident._id === id ? response.data : incident
        ),
        message: "Incident updated successfully.", // Başarılı güncelleme mesajı
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error updating incident",
        message: null,
        loading: false,
      });
    }
  },

  // Delete an incident by ID
  deleteIncident: async (id) => {
    set({ loading: true, error: null, message: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/incidents/${id}`);
      set((state) => ({
        incidents: state.incidents.filter((incident) => incident._id !== id),
        message: "Incident deleted successfully.", // Başarılı silme mesajı
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error deleting incident",
        message: null,
        loading: false,
      });
    }
  },
}));

export default useIncidentStore;
