import axios from "axios";
import ENV from "../configs";

const apiClient = axios.create({
  baseURL: ENV.API_URL,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
