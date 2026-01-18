import axios from 'axios'
import { getToken, clearToken } from './tokenManager'

const BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL

// Create a single axios instance for API calls
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
})

// Attach auth token before each request
apiClient.interceptors.request.use(async (config) => {
  const token = await getToken()
  config.headers = {
    ...(config.headers || {}),
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  }
  return config
})

// On 401 once: clear token and retry
let isRefreshing = false
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error
    if (response?.status === 401 && !config.__isRetry) {
      if (!isRefreshing) {
        isRefreshing = true
        clearToken()
      }
      try {
        config.__isRetry = true
        const token = await getToken()
        config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` }
        return apiClient(config)
      } catch (e) {
        return Promise.reject(e)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
