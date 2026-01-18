import { apiClient } from '../api/httpClient'

export async function searchOffers(query) {
  const { data } = await apiClient.get('/v2/shopping/flight-offers', {
    params: query,
  })
  return data
}
