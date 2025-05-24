const API_BASE_URL = process.env.REACT_APP_API_URL || "https://trackflow-jzex.onrender.com/api"

// Generic API function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  }

  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Lead API functions
export const leadAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/leads${queryString ? `?${queryString}` : ""}`)
  },

  getById: (id) => apiCall(`/leads/${id}`),

  create: (leadData) =>
    apiCall("/leads/", {
      method: "POST",
      body: JSON.stringify(leadData),
      headers: {
        'Content-Type': 'application/json'
      }
    }),

  update: (id, leadData) =>
    apiCall(`/leads/${id}`, {
      method: "PUT",
      body: leadData,
    }),

  delete: (id) =>
    apiCall(`/leads/${id}`, {
      method: "DELETE",
    }),
}

// Order API functions
export const orderAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/orders${queryString ? `?${queryString}` : ""}`)
  },

  getById: (id) => apiCall(`/orders/${id}`),

  create: (orderData) =>
    apiCall("/orders/", {
      method: "POST",
      body: orderData,
    }),

  update: (id, orderData) =>
    apiCall(`/orders/${id}`, {
      method: "PUT",
      body: orderData,
    }),
}

// Dashboard API functions
export const dashboardAPI = {
  getStats: () => apiCall("/dashboard/stats"),
}

// Utility function to create seed data
export const createSeedData = () => apiCall("/seed-data", { method: "POST" })
