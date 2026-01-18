import axios from 'axios'

const BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL
const CLIENT_ID = import.meta.env.VITE_AMADEUS_CLIENT_ID
const CLIENT_SECRET = import.meta.env.VITE_AMADEUS_CLIENT_SECRET

let token = null
let expiresAt = 0 // epoch ms
let inflightPromise = null

async function fetchToken() {
  if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Amadeus env vars. Define VITE_AMADEUS_BASE_URL, VITE_AMADEUS_CLIENT_ID, VITE_AMADEUS_CLIENT_SECRET')
  }
  const url = `${BASE_URL}/v1/security/oauth2/token`
  const params = new URLSearchParams()
  params.append('grant_type', 'client_credentials')
  params.append('client_id', CLIENT_ID)
  params.append('client_secret', CLIENT_SECRET)

  const { data } = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 10000,
  })

  token = data.access_token
  // Add 30s buffer
  expiresAt = Date.now() + (data.expires_in - 30) * 1000
  return token
}

export async function getToken() {
  const now = Date.now()
  if (token && now < expiresAt) return token
  if (!inflightPromise) inflightPromise = fetchToken().finally(() => { inflightPromise = null })
  return inflightPromise
}

export function clearToken() {
  token = null
  expiresAt = 0
}
