import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";
import { toast } from "react-toastify";

const useRequestStore = create((set, get) => ({
  requests: [],
  request: null,
  cachedRequests: null, // Tüm requestlerin cache'i
  cachedRequestsById: {}, // Tekil requestlerin cache'i
  loading: false,
  error: null,
  message: null, // Bilgilendirme mesajı

  // Tüm Başvuruları Getir
  fetchRequests: async () => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/requests`);
      const requests = response.data.map((req) => ({
        ...req,
        assignedLawyer: req.assignedLawyer || {
          _id: null,
          fullName: "Not Assigned",
        },
        receivedBy: req.receivedBy || { _id: null, fullName: "Not Assigned" },
      }));

      set({
        requests,
        cachedRequests: requests, // Cache'i güncelle
        message: null,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error fetching requests.",
        message: null,
        loading: false,
      });
    }
  },

  // Tek Başvuru Getir
  fetchRequestById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/requests/${id}`);
      set((state) => ({
        request: response.data,
        cachedRequestsById: {
          ...state.cachedRequestsById,
          [id]: response.data,
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Error fetching request:", error);
      set({ error: "Error fetching request.", loading: false });
    }
  },

  // Yeni Başvuru Oluştur
  createRequest: async (requestData) => {
    set({ loading: true, error: null, message: null, validationErrors: null });
    try {
      const formData = new FormData();

      // Submissions Dosyaları
      if (requestData.submissions) {
        requestData.submissions.forEach((submission, index) => {
          formData.append(`submissions`, submission.document); // Belge
          formData.append(
            `submissions[${index}][documentDescription]`,
            submission.documentDescription // Açıklama
          );
        });
      }

      // Incident Dosyaları
      if (requestData.Incidents?.files) {
        requestData.Incidents.files.forEach((file) => {
          formData.append("incidentFiles", file.document);
        });
      }

      // Incident Verileri
      if (requestData.Incidents) {
        formData.append("Incidents", JSON.stringify(requestData.Incidents));
      }

      // Diğer Veriler
      Object.keys(requestData).forEach((key) => {
        if (key !== "submissions" && key !== "Incidents") {
          formData.append(key, requestData[key]);
        }
      });

      const response = await axios.post(
        `${VITE_API_URL}/api/requests`,
        formData
      );

      set((state) => ({
        requests: [...state.requests, response.data],
        message: "Request created successfully.",
        loading: false,
        validationErrors: null,
      }));
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.errors) {
        // Backend validation errors
        set({
          validationErrors: error.response.data.errors,
          loading: false,
        });
      } else {
        set({
          error: error.response?.data?.error || "Error creating request.",
          loading: false,
        });
      }
    }
  },

  // Başvuru Güncelle
  updateRequest: async (id, requestData, newFiles) => {
    set({ loading: true, error: null, validationErrors: null });
    try {
      const formData = new FormData();

      // 1. Mevcut verileri formData'ya ekle
      Object.keys(requestData).forEach((key) => {
        if (key === "submissions" || key === "Incidents") return; // Bu alanlar ayrı ele alınacak
        formData.append(key, requestData[key]);
      });

      // 2. Submissions: Mevcut ve yeni dosyalar
      if (requestData.submissions) {
        requestData.submissions.forEach((file) => {
          if (typeof file === "object" && file.document) {
            formData.append(
              "submissions[]",
              JSON.stringify({
                document: file.document,
                documentDescription: file.documentDescription || "",
              })
            );
          }
        });
      }

      // Yeni dosyalar
      if (newFiles?.submissions) {
        newFiles.submissions.forEach((file) => {
          formData.append("newSubmissions", file);
        });
      }

      // Silinen dosyalar
      if (requestData.removedFiles) {
        formData.append(
          "removedFiles",
          JSON.stringify(requestData.removedFiles)
        );
      }

      // 3. Incident: Mevcut ve yeni dosyalar
      if (requestData.Incidents) {
        formData.append(
          "Incidents",
          JSON.stringify({
            ...requestData.Incidents,
            uploadedFile: requestData.Incidents.uploadedFile || [],
          })
        );
      }

      // Yeni Incident dosyalar
      if (newFiles?.incidentFiles) {
        newFiles.incidentFiles.forEach((file) => {
          formData.append("newIncidentFiles", file);
        });
      }

      // Silinen Incident dosyalar
      if (requestData.removedIncidentFiles) {
        formData.append(
          "removedIncidentFiles",
          JSON.stringify(requestData.removedIncidentFiles)
        );
      }

      // Backend'e güncelleme isteği gönder
      const response = await axios.put(
        `${VITE_API_URL}/api/requests/${id}`,
        formData
      );

      // Yerel durumu güncelle
      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === id ? response.data : req
        ),
        message: "Request updated successfully.",
        loading: false,
        validationErrors: null,
      }));

      console.log("Updated Requests:", get().requests);
      toast.success("Request updated successfully.");
    } catch (error) {
      toast.error("Request update failed.");
      if (error.response?.status === 400 && error.response.data.errors) {
        set({
          validationErrors: error.response.data.errors,
          loading: false,
        });
      } else {
        console.error("Error updating request:", error);
        set({
          error: error.response?.data?.error || "Error updating request.",
          loading: false,
        });
      }
    }
  },

  // Başvuru Sil
  deleteRequest: async (id) => {
    set({ loading: true, error: null, message: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/requests/${id}`);
      set((state) => ({
        requests: state.requests.filter((req) => req._id !== id),
        cachedRequests: state.requests.filter((req) => req._id !== id), // Cache'i güncelle
        cachedRequestsById: Object.fromEntries(
          Object.entries(state.cachedRequestsById).filter(([key]) => key !== id)
        ),
        message: "Request deleted successfully.",
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error deleting request.",
        message: null,
        loading: false,
      });
    }
  },

  // Status Güncelleme
  updateRequestStatus: async (id, status) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await axios.patch(
        `${VITE_API_URL}/api/requests/${id}/status`,
        {
          status,
        }
      );
      const updatedRequest = response.data.request;

      set((state) => ({
        requests: state.requests.map((req) =>
          req._id === id ? { ...req, status: updatedRequest.status } : req
        ),
        message: "Status updated successfully.",
        loading: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.error || "Error updating status.",
        loading: false,
      });
    }
  },

  // Yeni Status Güncelleme Yardımcı Metodu
  changeStatus: async (id, newStatus) => {
    const { updateRequestStatus } = get();

    try {
      await updateRequestStatus(id, newStatus);

      alert("Status successfully updated!");
    } catch (error) {
      console.error("Error updating status:", error);

      alert("Failed to update status.");
    }
  },
}));

export default useRequestStore;
