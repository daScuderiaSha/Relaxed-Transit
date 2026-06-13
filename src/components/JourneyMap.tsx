import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Station } from '../types/station'
import { interpolatePosition } from '../utils/journey'
import 'leaflet/dist/leaflet.css'

interface JourneyMapProps {
  from: Station
  to: Station
  progress: number
}

function FitBounds({ from, to }: { from: Station; to: Station }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds(
      [from.lat, from.lng],
      [to.lat, to.lng],
    ).pad(0.35)
    map.fitBounds(bounds, { animate: true })
  }, [map, from, to])

  return null
}

function createStationIcon(label: string, variant: 'origin' | 'destination') {
  const bg = variant === 'origin' ? '#3d8b7a' : '#c45c3e'
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <div style="
          width:14px;height:14px;border-radius:50%;
          background:${bg};border:3px solid #f4efe6;
          box-shadow:0 2px 8px rgba(0,0,0,0.4);
        "></div>
        <span style="
          font:600 10px/1 Instrument Sans, sans-serif;
          color:#f4efe6;background:rgba(15,27,45,0.85);
          padding:2px 6px;border-radius:4px;white-space:nowrap;
        ">${label}</span>
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 7],
  })
}

function createTrainIcon() {
  return L.divIcon({
    className: 'train-marker',
    html: `
      <div style="
        width:36px;height:36px;border-radius:50%;
        background:linear-gradient(135deg,#5cb8a4,#3d8b7a);
        border:3px solid #f4efe6;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 16px rgba(61,139,122,0.5);
        font-size:18px;
      ">🚆</div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  })
}

export function JourneyMap({ from, to, progress }: JourneyMapProps) {
  const route: [number, number][] = useMemo(
    () => [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
    [from, to],
  )

  const trainPos = interpolatePosition(from, to, progress)
  const completedRoute: [number, number][] = useMemo(() => {
    const points: [number, number][] = [[from.lat, from.lng]]
    for (let i = 1; i <= 20; i++) {
      const t = (progress * 20) / 20
      if (i / 20 <= t) {
        points.push(interpolatePosition(from, to, i / 20))
      }
    }
    if (progress > 0) points.push(trainPos)
    return points
  }, [from, to, progress, trainPos])

  const center = interpolatePosition(from, to, 0.5)

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl">
      <MapContainer
        center={center}
        zoom={7}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <FitBounds from={from} to={to} />
        <Polyline
          positions={route}
          pathOptions={{
            color: '#3d5270',
            weight: 4,
            opacity: 0.6,
            dashArray: '8 12',
          }}
        />
        <Polyline
          positions={completedRoute}
          pathOptions={{
            color: '#5cb8a4',
            weight: 5,
            opacity: 0.95,
          }}
        />
        <Marker
          position={[from.lat, from.lng]}
          icon={createStationIcon(from.crs, 'origin')}
        />
        <Marker
          position={[to.lat, to.lng]}
          icon={createStationIcon(to.crs, 'destination')}
        />
        <Marker position={trainPos} icon={createTrainIcon()} />
      </MapContainer>
    </div>
  )
}
