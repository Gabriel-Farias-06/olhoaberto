import { API_URL } from "@/constants";
import axios from "axios";

const isBrowser = typeof window !== "undefined";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (isBrowser) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token.replaceAll('"', "")}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isBrowser &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      window.location.href = "/login";
    }
    console.error("Axios error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
