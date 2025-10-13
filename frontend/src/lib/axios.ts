import axios from "axios";

const axiosInstance = axios.create({
  baseURL:  process.env.NODE_ENV === "development" ? "http://localhost:8080/api" : "/api",
  withCredentials: true,
});

export default axiosInstance;