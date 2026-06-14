import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { UK_STATIONS } from '../data/ukStations'
import type { Station } from '../types/station'
import 'leaflet/dist/leaflet.css'

export type PickMode = 'from' | 'to'

interface StationPickerMapProps {
  from: Station | null
  to: Station | null
  pickMode: PickMode
  onSelect: (station: Station) => void
}

function FitAllStations() {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds(UK_STATIONS.map((s) => [s.lat, s.lng]))
    map.fitBounds(bounds.pad(0.08), { animate: false })
  }, [map])

  return null
}

function FitRoute({ from, to }: { from: Station; to: Station }) {
  const map = useMap()

  useEffect(() => {
    const bounds = L.latLngBounds([from.lat, from.lng], [to.lat, to.lng]).pad(0.4)
    map.fitBounds(bounds, { animate: true, duration: 0.4 })
  }, [map, from, to])

  return null
}

function createPickerStationIcon(
  station: Station,
  role: 'none' | 'from' | 'to' | 'both',
  isActive: boolean,
) {
  let bg = '#3d5270'
  let size = 10
  let border = 2

  if (role === 'from') {
    bg = '#3d8b7a'
    size = 14
    border = 3
  } else if (role === 'to') {
    bg = '#c45c3e'
    size = 14
    border = 3
  } else if (role === 'both') {
    bg = '#5cb8a4'
    size = 14
    border = 3
  } else if (isActive) {
    bg = '#5cb8a4'
    size = 12
    border = 2
  }

  const showLabel = role !== 'none' || isActive

  return L.divIcon({
    className: 'station-picker-marker',
    html: `
      <div class="station-picker-pin ${isActive ? 'station-picker-pin--active' : ''}" style="
        display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;
      ">
        <div style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${bg};border:${border}px solid #f4efe6;
          box-shadow:0 2px 8px rgba(0,0,0,0.45);
          transition:transform 0.15s ease;
        "></div>
        ${
          showLabel
            ? `<span style="
          font:600 9px/1 Instrument Sans,sans-serif;
          color:#f4efe6;background:rgba(15,27,45,0.9);
          padding:2px 5px;border-radius:3px;white-space:nowrap;pointer-events:none;
        ">${station.crs}</span>`
            : ''
        }
      </div>
    `,
    iconSize: showLabel ? [48, 36] : [20, 20],
    iconAnchor: showLabel ? [24, 7] : [10, 10],
  })
}

export function StationPickerMap({ from, to, pickMode, onSelect }: StationPickerMapProps) {
  const hasRoute = from && to && from.crs !== to.crs

  const route: [number, number][] | null = useMemo(
    () => (hasRoute ? [[from.lat, from.lng], [to.lat, to.lng]] : null),
    [hasRoute, from, to],
  )

  function roleFor(station: Station): 'none' | 'from' | 'to' | 'both' {
    const isFrom = from?.crs === station.crs
    const isTo = to?.crs === station.crs
    if (isFrom && isTo) return 'both'
    if (isFrom) return 'from'
    if (isTo) return 'to'
    return 'none'
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[53.5, -2.5]}
        zoom={6}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {hasRoute && from && to ? (
          <FitRoute from={from} to={to} />
        ) : (
          <FitAllStations />
        )}

        {route && (
          <Polyline
            positions={route}
            pathOptions={{
              color: '#5cb8a4',
              weight: 4,
              opacity: 0.85,
              dashArray: '8 12',
            }}
          />
        )}

        {UK_STATIONS.map((station) => {
          const role = roleFor(station)
          const isActive = pickMode === 'from' ? role === 'from' : role === 'to'

          return (
            <Marker
              key={station.crs}
              position={[station.lat, station.lng]}
              icon={createPickerStationIcon(station, role, isActive)}
              zIndexOffset={role !== 'none' ? 500 : 0}
              eventHandlers={{
                click: () => onSelect(station),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -8]}
                opacity={0.95}
                className="station-picker-tooltip"
              >
                <span className="font-medium">{station.name}</span>
                <span className="text-rail-muted"> · {station.crs}</span>
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
