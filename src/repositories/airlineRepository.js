import { apiClient } from '../api/httpClient'

export async function getAirlines({ airlineCodes }) {
  const { data } = await apiClient.get('/v1/reference-data/airlines', {
    params: { airlineCodes },
  })
  return data
}
