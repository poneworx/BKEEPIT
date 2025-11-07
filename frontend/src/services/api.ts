import axios from "axios";
import { getConfig } from "../utils/config";
import { attachAuthInterceptors } from "../middleware/axiosAuthInterceptor";

// Pull config and resolve baseURL
const { apiBaseUrl } = getConfig();

const baseURL =
  apiBaseUrl ||
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://localhost:3000";

// Create Axios instance
export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

// Attach authentication interceptors (token attach/refresh)
attachAuthInterceptors(api);

export default api;
