import type { Station } from '../types/station'

const EARTH_RADIUS_KM = 6371

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

export function haversineDistanceKm(a: Station, b: Station): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

/** Rough National Rail journey estimate: ~90 km/h average including stops */
export function estimateJourneyMinutes(from: Station, to: Station): number {
  const km = haversineDistanceKm(from, to)
  const hours = km / 90
  const minutes = Math.round(hours * 60)
  return Math.max(15, Math.min(180, minutes))
}

export function interpolatePosition(
  from: Station,
  to: Station,
  progress: number,
): [number, number] {
  const t = Math.max(0, Math.min(1, progress))
  return [from.lat + (to.lat - from.lat) * t, from.lng + (to.lng - from.lng) * t]
}

export function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} hr ${m} min` : `${h} hr`
}
