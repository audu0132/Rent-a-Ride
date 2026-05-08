// Central API base URL — import this in every file that makes a backend request.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://rent-a-ride-ufjq.onrender.com");

export default API_BASE_URL;