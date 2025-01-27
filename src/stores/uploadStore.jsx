import { create } from "zustand";
import axios from "../config/axios.config";
import { VITE_API_URL } from "../config/environment";

const useS3Store = create((set) => ({
  files: [], // List of files fetched from S3
  loading: false, // Indicates whether an operation is in progress
  error: null, // Stores any errors encountered during operations

  // **Upload Files to S3**
  uploadFiles: async (formData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        `${VITE_API_URL}/api/uploads`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Update the file list with newly uploaded files
      set((state) => ({
        files: [...state.files, ...response.data.files],
        loading: false,
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
      set({
        error: error.response?.data?.error || "Error uploading files",
        loading: false,
      });
    }
  },

  // **Fetch Files from S3**
  fetchFiles: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/uploads/list`);
      set({ files: response.data, loading: false });
    } catch (error) {
      console.error("Error fetching files:", error);
      set({
        error: error.response?.data?.error || "Error fetching files",
        loading: false,
      });
    }
  },

  // **Delete a File from S3**
  deleteFile: async (key) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${VITE_API_URL}/api/uploads/delete/${key}`);
      set((state) => ({
        files: state.files.filter((file) => file.key !== key), // Remove the deleted file
        loading: false,
      }));
    } catch (error) {
      console.error("Error deleting file:", error);
      set({
        error: error.response?.data?.error || "Error deleting file",
        loading: false,
      });
    }
  },

  // **Get File Details**
  getFile: async (key) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${VITE_API_URL}/api/uploads/${key}`);
      return response.data; // Return the file details (e.g., content, type)
    } catch (error) {
      console.error("Error fetching file:", error);
      set({
        error: error.response?.data?.error || "Error fetching file details",
        loading: false,
      });
      return null;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useS3Store;