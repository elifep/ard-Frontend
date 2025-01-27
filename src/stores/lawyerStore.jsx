import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";
import { toast } from "react-toastify";

const useLawyerStore = create((set, get) => ({
  cases: [],
  requests: [],
  singleCase: null,
  loading: false,
  error: null,
  message: null,

  // Tüm Davaları Getir
  fetchCases: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/lawyers/cases`);
      console.log("fetchcases", response.data);
      const casesWithSignedUrls = response.data.map((caseItem) => ({
        ...caseItem,
        documents: caseItem.documents
          ? processSignedUrls(caseItem.documents)
          : {},
      }));

      // Gelen veriyi konsolda kontrol edin
      console.log("Cases Response:", response.data);

      // cases listesini state'e doğrudan aktar
      set({
        cases: casesWithSignedUrls,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching cases:", error);
      set({
        error: error.response?.data?.error || "Error fetching cases.",
        loading: false,
      });
    }
  },
  // Dava sil
  deleteCase: async (caseId) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/cases/${caseId}`);
      set((state) => ({
        cases: state.cases.filter((c) => c._id !== caseId), // Silinen davayı kaldır
        loading: false,
      }));
      toast.success("Dava başarıyla silindi.");
    } catch (error) {
      set({ error: error.response?.data?.error || "Error deleting case", loading: false });
    }
  },
  // Dava Güncelle
  updateCase: async (caseId, updateData, files) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();

      // Append updated fields
      Object.entries(updateData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append updated files
      if (files) {
        Object.entries(files).forEach(([fieldName, fileList]) => {
          if (Array.isArray(fileList)) {
            fileList.forEach((file) => {
              formData.append(fieldName, file);
            });
          }
        });
      }
      // Log FormData içeriği
      for (const [key, value] of formData.entries()) {
        console.log(`FormData içeriği: ${key}:`, value);
      }

      const response = await axios.put(
        `${VITE_API_URL}/api/cases/${caseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      set((state) => ({
        cases: state.cases.map((c) => (c._id === caseId ? response.data : c)),
        loading: false,
      }));
      toast.success("Dava başarıyla güncellendi!");
    } catch (error) {
      toast.error("Dava güncellenemedi!");
      set({
        error: error.response?.data?.error || "Error updating case",
        loading: false,
      });
    }
  },

  // Tekil Dava Getir
  fetchCaseById: async (caseId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${VITE_API_URL}/api/lawyers/cases/${caseId}`
      );
      const caseWithSignedUrls = {
        ...response.data,
        documents: response.data.documents
          ? processSignedUrls(response.data.documents)
          : {},
      };

      set({
        singleCase: caseWithSignedUrls,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching case details.",
        loading: false,
      });
    }
  },

  // Tüm Başvuruları Getir
  fetchRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/lawyers/requests`);
      console.log("Requests Response:", response.data);

      // Gelen verileri işleyerek requests'e atıyoruz
      const formattedRequests = response.data.map((req) => ({
        ...req,
        caseDetailsSummary: req.caseDetails
          ? `${req.caseDetails.caseSubject || "No Subject"} - ${req.caseDetails.fileNumber || "No File"
          }`
          : "No Case Details",
        assignedLawyerName: req.assignedLawyer?.fullName || "N/A", // Avukat adı burada doğru çekilmeli
      }));

      // Requests state'i güncelleniyor
      set({
        requests: formattedRequests,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      set({
        error: error.response?.data?.error || "Error fetching requests.",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  resetState: () => {
    set({
      cases: [],
      requests: [],
      singleCase: null,
      loading: false,
      error: null,
      message: null,
    });
  },
}));

// Yardımcı Fonksiyon: Signed URL İşleme
const processSignedUrls = (documents) => {
  const processed = {};
  Object.entries(documents).forEach(([key, value]) => {
    processed[key] = value.map((url) => url); // Gelen URL'ler Signed olarak işlenir
  });
  return processed;
};

export default useLawyerStore;