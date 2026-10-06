import axios from "axios";

// Helper to detect if running in browser client
const isClient = typeof window !== "undefined";

// Helper to detect if running in local environment (development)
export const isLocalEnvironment = isClient
  ? (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "::1")
  : (process.env.NODE_ENV !== "production");

const rawEnvApiUrl = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/+$/, "");
const rawEnvBackendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").trim().replace(/\/+$/, "");

/**
 * Dynamically resolves the API base URL.
 * CRITICAL FIX: If running on a hosted URL (e.g. *.vercel.app), NEVER default to http://localhost:5000.
 * Calling localhost from an HTTPS hosted site causes modern browsers to trigger the security popup:
 * "Allow [website] to access the system app / devices on your local network".
 */
export const getApiBaseUrl = () => {
  if (rawEnvApiUrl) {
    // If hosted on Vercel but user accidentally put localhost in env
    if (isClient && !isLocalEnvironment && (rawEnvApiUrl.includes("localhost") || rawEnvApiUrl.includes("127.0.0.1"))) {
      console.warn(
        "[Dropsync Warning] NEXT_PUBLIC_API_URL contains 'localhost' on a hosted website (" +
        window.location.origin +
        "). Localhost requests blocked to prevent browser security popups."
      );
      return "";
    }
    return rawEnvApiUrl;
  }

  // Safe fallback only for local development
  if (isLocalEnvironment) {
    return "http://localhost:5000/api";
  }

  // Hosted production without NEXT_PUBLIC_API_URL configured yet
  return "";
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Dynamically resolves the Root Backend URL (without trailing /api)
 */
export const getBackendUrl = () => {
  if (rawEnvBackendUrl) {
    if (isClient && !isLocalEnvironment && (rawEnvBackendUrl.includes("localhost") || rawEnvBackendUrl.includes("127.0.0.1"))) {
      return "";
    }
    return rawEnvBackendUrl;
  }

  const base = getApiBaseUrl();
  if (base) {
    return base.replace(/\/api\/?$/, "");
  }

  if (isLocalEnvironment) {
    return "http://localhost:5000";
  }

  return "";
};

export const BACKEND_URL = getBackendUrl();

/**
 * Normalizes an image path to a full accessible URL.
 * Handles:
 * - relative paths (/uploads/products/xyz.jpg)
 * - previous hardcoded localhost URLs (http://localhost:5000/uploads/products/xyz.jpg)
 * - data URIs and full URLs
 */
export const getImageUrl = (path) => {
  if (!path || typeof path !== "string") return "/placeholder-product.svg";

  // If base64 or blob URL
  if (path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const backend = getBackendUrl();

  // If running on hosted production and image has localhost, rewrite with active backend or fallback
  if (isClient && !isLocalEnvironment) {
    if (path.includes("localhost:5000") || path.includes("127.0.0.1:5000")) {
      if (backend) {
        return path.replace(/http:\/\/(localhost|127\.0\.0\.1):5000/g, backend);
      }
      return "/placeholder-product.svg";
    }
  }

  // If contains legacy localhost:5000, substitute with current BACKEND_URL
  if (path.includes("localhost:5000")) {
    return path.replace(/http:\/\/localhost:5000/g, backend || "http://localhost:5000");
  }

  // If relative upload path
  if (path.startsWith("/uploads") || path.startsWith("uploads/")) {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return backend ? `${backend}${cleanPath}` : cleanPath;
  }

  // If already an absolute http/https URL
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If local public asset
  if (path.startsWith("/")) {
    return path;
  }

  return backend ? `${backend}/${path}` : `/${path}`;
};

/**
 * Extracts a clear, user-friendly error message from an axios error.
 * Prevents misleading "Invalid credentials" messages when the backend is sleeping or unreachable.
 */
export const getErrorMessage = (error, defaultMsg = "An error occurred") => {
  if (!error) return defaultMsg;

  if (error.isConfigError) {
    return error.message;
  }

  // Network error (backend is sleeping on Render or unreachable)
  if (!error.response && (error.code === "ERR_NETWORK" || error.message === "Network Error" || !error.status)) {
    return "Cannot connect to server. If the backend is waking up on Render, please wait 30-45 seconds and try again.";
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  if (error.message) {
    return error.message;
  }

  return defaultMsg;
};

// Configured Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for Render free tier spin-up
});

// Automatically inject JWT token into requests and protect against calling localhost from hosted origins
api.interceptors.request.use(
  (config) => {
    const activeBase = getApiBaseUrl();
    config.baseURL = activeBase;

    if (isClient && !isLocalEnvironment) {
      // In production, block empty base or localhost requests so browser doesn't prompt for local system access
      if (!activeBase || activeBase.includes("localhost") || activeBase.includes("127.0.0.1")) {
        const error = new Error(
          "Backend API URL is not configured. Please set NEXT_PUBLIC_API_URL in your Vercel Project Settings."
        );
        error.isConfigError = true;
        return Promise.reject(error);
      }
    }

    if (isClient) {
      let token = localStorage.getItem("dropsync_token");
      if (token) {
        token = token.replace(/^["']|["']$/g, "").trim();
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to format error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userFriendlyMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;
