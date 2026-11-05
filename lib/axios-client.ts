import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://booknook-backend-teal.vercel.app",
});

export default axiosClient;
