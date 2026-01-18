import { apiClient } from '../api/httpClient'

export async function searchLocations({ keyword, countryCode, limit = 20 }) {
  const { data } = await apiClient.get('/v1/reference-data/locations', {
    params: {
      subType: 'AIRPORT,CITY',
      keyword,
      countryCode,
      'page[limit]': limit,
    },
  })
  return data
}
