import { useEffect, useRef, useState } from 'react'
import { ChevronDown, MapPin, Search, X } from 'lucide-react'
import { searchStations } from '../data/ukStations'
import type { Station } from '../types/station'

interface StationSelectorProps {
  label: string
  value: Station | null
  onChange: (station: Station) => void
  exclude?: Station | null
  placeholder?: string
  onOpen?: () => void
}

export function StationSelector({
  label,
  value,
  onChange,
  exclude,
  placeholder = 'Search stations…',
  onOpen,
}: StationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const results = searchStations(query).filter((s) => s.crs !== exclude?.crs)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(station: Station) {
    onChange(station)
    setQuery('')
    setOpen(false)
  }

  function clear() {
    setQuery('')
    setOpen(true)
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-rail-muted">
        {label}
      </label>

      <button
        type="button"
        onClick={() => {
          onOpen?.()
          setOpen((o) => !o)
        }}
        className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-rail-deep/80 px-4 py-3.5 text-left transition hover:border-rail-accent/40 hover:bg-rail-panel/80"
      >
        <MapPin className="h-4 w-4 shrink-0 text-rail-accent-light" />
        <span className="min-w-0 flex-1">
          {value ? (
            <>
              <span className="block truncate font-medium text-rail-cream">{value.name}</span>
              <span className="text-xs text-rail-muted">
                {value.crs} · {value.region}
              </span>
            </>
          ) : (
            <span className="text-rail-muted">{placeholder}</span>
          )}
        </span>
        {value && open ? (
          <X
            className="h-4 w-4 shrink-0 text-rail-muted hover:text-rail-cream"
            onClick={(e) => {
              e.stopPropagation()
              clear()
            }}
          />
        ) : (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-rail-muted transition ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-rail-deep shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
            <Search className="h-4 w-4 text-rail-muted" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Station name or code…"
              className="w-full bg-transparent text-sm text-rail-cream outline-none placeholder:text-rail-muted/70"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {results.length === 0 ? (
              <li className="px-4 py-3 text-sm text-rail-muted">No stations found</li>
            ) : (
              results.map((station) => (
                <li key={station.crs}>
                  <button
                    type="button"
                    onClick={() => select(station)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-rail-panel"
                  >
                    <span className="flex h-8 w-10 shrink-0 items-center justify-center rounded-md bg-rail-panel text-xs font-bold text-rail-accent-light">
                      {station.crs}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{station.name}</span>
                      <span className="text-xs text-rail-muted">{station.region}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
