export interface Station {
  crs: string
  name: string
  lat: number
  lng: number
  region: string
}

export interface Journey {
  from: Station
  to: Station
  durationMinutes: number
}

export type SessionStatus = 'idle' | 'running' | 'paused' | 'complete'
