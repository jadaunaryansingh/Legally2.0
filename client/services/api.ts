/**
 * API Service
 * Centralized API endpoint management for all backend calls
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const API_PREFIX = import.meta.env.VITE_API_PREFIX || "/api/v1";

// Helper function for making API calls
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const token = localStorage.getItem("authToken");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// ============ AUTHENTICATION ENDPOINTS ============

export const authAPI = {
  login: (email: string, password: string) =>
    apiCall(`${API_PREFIX}/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (email: string, password: string, name?: string) =>
    apiCall(`${API_PREFIX}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    }),

  logout: () =>
    apiCall(`${API_PREFIX}/auth/logout`, {
      method: "POST",
    }),

  refresh: () =>
    apiCall(`${API_PREFIX}/auth/refresh`, {
      method: "POST",
    }),

  verify: () =>
    apiCall(`${API_PREFIX}/auth/verify`, {
      method: "GET",
    }),
};

// ============ CHAT/AI LEGAL ASSISTANT ENDPOINTS ============

export const chatAPI = {
  sendMessage: (message: string, conversationId?: string) =>
    apiCall(`${API_PREFIX}/chat/message`, {
      method: "POST",
      body: JSON.stringify({ message, conversationId }),
    }),

  getHistory: (conversationId?: string) =>
    apiCall(`${API_PREFIX}/chat/history${conversationId ? `?id=${conversationId}` : ""}`, {
      method: "GET",
    }),

  clearHistory: (conversationId?: string) =>
    apiCall(`${API_PREFIX}/chat/clear`, {
      method: "POST",
      body: JSON.stringify({ conversationId }),
    }),

  search: (query: string) =>
    apiCall(`${API_PREFIX}/chat/search`, {
      method: "POST",
      body: JSON.stringify({ query }),
    }),
};

// ============ LEGAL INFORMATION ENDPOINTS ============

export const lawsAPI = {
  search: (query: string, filters?: Record<string, any>) =>
    apiCall(`${API_PREFIX}/laws/search`, {
      method: "POST",
      body: JSON.stringify({ query, filters }),
    }),

  get: (lawId: string) =>
    apiCall(`${API_PREFIX}/laws/get?id=${lawId}`, {
      method: "GET",
    }),

  explain: (lawId: string, plainLanguage: boolean = true) =>
    apiCall(`${API_PREFIX}/laws/explain`, {
      method: "POST",
      body: JSON.stringify({ lawId, plainLanguage }),
    }),

  getSections: (act: string) =>
    apiCall(`${API_PREFIX}/laws/sections?act=${act}`, {
      method: "GET",
    }),

  crimeAnalysis: (scenario: string) =>
    apiCall(`${API_PREFIX}/laws/crime-analysis`, {
      method: "POST",
      body: JSON.stringify({ scenario }),
    }),

  getIPCList: () =>
    apiCall(`${API_PREFIX}/laws/ipc/list`, {
      method: "GET",
    }),

  getCRPCList: () =>
    apiCall(`${API_PREFIX}/laws/crpc/list`, {
      method: "GET",
    }),
};

// ============ USER PROFILE ENDPOINTS ============

export const userAPI = {
  getProfile: () =>
    apiCall(`${API_PREFIX}/user/profile`, {
      method: "GET",
    }),

  updateProfile: (profileData: Record<string, any>) =>
    apiCall(`${API_PREFIX}/user/update`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  getSettings: () =>
    apiCall(`${API_PREFIX}/user/settings`, {
      method: "GET",
    }),

  updateSettings: (settings: Record<string, any>) =>
    apiCall(`${API_PREFIX}/user/settings`, {
      method: "PUT",
      body: JSON.stringify(settings),
    }),

  deleteAccount: (password: string) =>
    apiCall(`${API_PREFIX}/user/delete`, {
      method: "DELETE",
      body: JSON.stringify({ password }),
    }),
};

// ============ BROWSE & SEARCH ENDPOINTS ============

export const browseAPI = {
  laws: (page: number = 1, limit: number = 10) =>
    apiCall(`${API_PREFIX}/browse/laws?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  acts: (page: number = 1, limit: number = 10) =>
    apiCall(`${API_PREFIX}/browse/acts?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  cases: (page: number = 1, limit: number = 10) =>
    apiCall(`${API_PREFIX}/browse/cases?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  sections: (act: string, page: number = 1, limit: number = 10) =>
    apiCall(
      `${API_PREFIX}/browse/sections?act=${act}&page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    ),
};

// ============ ANALYTICS & LOGGING ENDPOINTS ============

export const analyticsAPI = {
  track: (event: string, data?: Record<string, any>) =>
    apiCall(`${API_PREFIX}/analytics/track`, {
      method: "POST",
      body: JSON.stringify({ event, data }),
    }),

  logError: (error: string, context?: Record<string, any>) =>
    apiCall(`${API_PREFIX}/logs/error`, {
      method: "POST",
      body: JSON.stringify({ error, context }),
    }),
};

// ============ UTILITY FUNCTIONS ============

/**
 * Get all available API endpoints
 */
export const getApiConfig = () => ({
  baseUrl: BASE_URL,
  prefix: API_PREFIX,
  auth: authAPI,
  chat: chatAPI,
  laws: lawsAPI,
  user: userAPI,
  browse: browseAPI,
  analytics: analyticsAPI,
});

/**
 * Set auth token for future requests
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

/**
 * Clear auth token
 */
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

/**
 * Get current auth token
 */
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
