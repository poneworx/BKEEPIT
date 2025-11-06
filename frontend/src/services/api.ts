import axios from "axios";
import { getConfig } from "../utils/config";
import { attachAuthInterceptors } from "../middleware/axiosAuthInterceptor";

const { apiBaseUrl } = getConfig();
export const api = axios.create({ baseURL: apiBaseUrl, timeout: 15000 });

attachAuthInterceptors(api);
export default api;