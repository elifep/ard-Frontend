import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";
import { toast } from "react-toastify";

const useCaseStore = create((set) => ({
  cases: [], // Tüm davalar
  caseDetails: null, // Tek bir dava
  loading: false,
  error: null,
  message: null, // Bilgilendirme mesajı

  // Tüm Davaları Getir
  fetchCases: async () => {
    set({ loading: true, error: null, message: null });
    // Yardımcı Fonksiyon: Signed URL İşleme
    const processSignedUrls = (documents) => {
      const processed = {};
      Object.entries(documents).forEach(([key, value]) => {
        processed[key] = value.map((url) => url); // Gelen URL'ler Signed olarak işlenir
      });
      return processed;
    };
    try {
      const response = await axios.get(`${VITE_API_URL}/api/cases`);
      console.log("fetchcases", response.data);
      const casesWithSignedUrls = response.data.map((caseItem) => ({
        ...caseItem,
        documents: caseItem.documents
          ? processSignedUrls(caseItem.documents)
          : {},
      }));
      console.log("casesWithSignedUrls", casesWithSignedUrls);
      set({
        cases: casesWithSignedUrls || [],
        message: null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching cases",
        loading: false,
      });
    }
  },

  // Tek Dava Getir
  fetchCaseById: async (id) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/cases/${id}`);
      console.log("fetchcasebyid", response.data);
      set({
        caseDetails: response.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching case details",
        loading: false,
      });
    }
  },

  // Yeni Dava Oluştur
  createCase: async (caseData, files) => {
    set({ loading: true, error: null, message: null });
    try {
      const formData = new FormData();

      // Append case fields (excluding documents)
      Object.entries(caseData).forEach(([key, value]) => {
        if (key !== "documents") {
          formData.append(key, value);
        }
      });

      // Append files for each document type
      if (files) {
        Object.entries(files).forEach(([fieldName, fileList]) => {
          if (Array.isArray(fileList)) {
            fileList.forEach((file) => {
              formData.append(fieldName, file);
            });
          } else {
            console.error(`Invalid file list for ${fieldName}:`, fileList);
          }
        });
      }

      // Send POST request to create a new case
      const response = await axios.post(`${VITE_API_URL}/api/cases`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        cases: [...state.cases, response.data],
        message: "Case created successfully.",
        loading: false,
      }));
      toast.success("Dava başarıyla oluşturuldu!");
    } catch (error) {
      toast.error("Dava oluşturulurken bir hata oluştu!");
      set({
        error: error.response?.data?.error || "Error creating case",
        loading: false,
      });
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
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error updating case",
        loading: false,
      });
    }
  },

  // Dava Sil
  deleteCase: async (id) => {
    set({ loading: true, error: null, message: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/cases/${id}`);
      set((state) => ({
        cases: state.cases.filter((c) => c._id !== id),
        message: "Case deleted successfully.",
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error deleting case",
        loading: false,
      });
    }
  },
}));

export default useCaseStore;
