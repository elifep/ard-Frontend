import axios from "axios";
import useAuthStore from "../stores/authStore";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Cookies'i backend'e otomatik gönderir
});

// Request Interceptor
instance.interceptors.request.use(
  async (config) => {
    const { ensureTokenValidity, token } = useAuthStore.getState();

    // Token yenileme işlemi
    await ensureTokenValidity();

    // Token varsa Authorization başlığı eklenir
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // FormData kontrolü
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]; // FormData için Content-Type başlığını kaldır
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, logoutAdmin } = useAuthStore.getState();

    if (error.response) {
      if (error.response.status === 401) {
        try {
          await refreshToken(); // Token yenileme işlemi
          const config = error.config;
          return instance(config); // İsteği yeniden gönder
        } catch {
          await logoutAdmin();
          window.location.href = "/admin-login";
        }
      } else if (error.response.status === 403) {
        window.location.href = "/forbidden"; // Forbidden durumunda yönlendirme
      }
    }
    return Promise.reject(error);
  }
);

export default instance;