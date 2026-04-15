// Central API base URL — import this in every file that makes a backend request.
// Set VITE_API_BASE_URL in client/.env to override for local development.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://rent-a-ride-ufjq.onrender.com";

export default API_BASE_URL;
