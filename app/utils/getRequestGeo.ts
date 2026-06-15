import { headers } from 'next/headers'

export type RequestGeo = {
  geoLatitude: number | null
  geoLongitude: number | null
  geoCity: string | null
  geoRegion: string | null
  geoCountry: string | null
}

const EMPTY: RequestGeo = {
  geoLatitude: null,
  geoLongitude: null,
  geoCity: null,
  geoRegion: null,
  geoCountry: null
}

export async function getRequestGeo(): Promise<RequestGeo> {
  try {
    const h = await headers()
    const lat = parseFloat(h.get('x-vercel-ip-latitude') ?? '')
    const lng = parseFloat(h.get('x-vercel-ip-longitude') ?? '')
    const city = h.get('x-vercel-ip-city')

    return {
      geoLatitude: Number.isFinite(lat) ? lat : null,
      geoLongitude: Number.isFinite(lng) ? lng : null,
      geoCity: city ? decodeURIComponent(city) : null,
      geoRegion: h.get('x-vercel-ip-country-region'),
      geoCountry: h.get('x-vercel-ip-country')
    }
  } catch {
    // headers() throws outside a request scope — degrade to nulls, never break a caller
    return EMPTY
  }
}
