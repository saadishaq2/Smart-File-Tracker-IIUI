import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/auth/authSlice";


const API = axios.create({
  baseURL: "http://localhost:8000/api",
});

API.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      store.dispatch(logout());
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default API;
