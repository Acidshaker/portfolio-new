import axios from "axios";
import { clearToken } from "../store/sessionsSlice";
import { toast } from "react-toastify";
import { store } from "../store";
import api from "../lib/request";

api.interceptors.request.use((config) => {
  const token = store.getState().session.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message !== "Credenciales inválidas"
    ) {
      store.dispatch(clearToken());
      console.log(error.response?.data?.message);
      // toast.error("Tu sesión ha expirado.");
      // window.location.href = "/login";
    } else if (
      error.response?.status === 403 &&
      error.response?.data?.message === "Token inválido"
    ) {
      store.dispatch(clearToken());
    } else {
      toast.error(
        error.response?.data?.message || "No se pudo completar la solicitud."
      );
    }
    return Promise.reject(error);
  }
);

export default api;
