import axios, { AxiosInstance } from "axios";

// Criação da instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  withCredentials: true,
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
