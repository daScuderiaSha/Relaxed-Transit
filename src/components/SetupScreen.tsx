import { useState } from 'react'
import { ArrowRight, Train, Clock } from 'lucide-react'
import { StationSelector } from './StationSelector'
import { UK_STATIONS } from '../data/ukStations'
import type { Journey, Station } from '../types/station'
import { estimateJourneyMinutes, formatMinutes, haversineDistanceKm } from '../utils/journey'

interface SetupScreenProps {
  onStart: (journey: Journey) => void
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [from, setFrom] = useState<Station | null>(UK_STATIONS.find((s) => s.crs === 'PAD') ?? null)
  const [to, setTo] = useState<Station | null>(UK_STATIONS.find((s) => s.crs === 'OXF') ?? null)
  const [customDuration, setCustomDuration] = useState<number | null>(null)

  const estimated =
    from && to && from.crs !== to.crs ? estimateJourneyMinutes(from, to) : null
  const duration = customDuration ?? estimated
  const distance =
    from && to && from.crs !== to.crs ? haversineDistanceKm(from, to) : null

  const canStart = from && to && from.crs !== to.crs && duration

  function handleStart() {
    if (!canStart) return
    onStart({ from, to, durationMinutes: duration })
  }

  function swapStations() {
    setFrom(to)
    setTo(from)
    setCustomDuration(null)
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-10">
      <div className="mb-10 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rail-accent/30 bg-rail-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-rail-accent-light">
          <Train className="h-3.5 w-3.5" />
          National Rail · UK
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-rail-cream sm:text-5xl">
          Relaxed Transit
        </h1>
        <p className="mt-3 max-w-md text-rail-muted">
          Your focus session is a train journey. Pick your route, board, and study until you arrive.
        </p>
      </div>

      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-white/10 bg-rail-deep/60 p-6 backdrop-blur-sm sm:p-8">
          <div className="space-y-4">
            <StationSelector
              label="Departing from"
              value={from}
              onChange={(s) => {
                setFrom(s)
                setCustomDuration(null)
              }}
              exclude={to}
            />

            <div className="flex justify-center">
              <button
                type="button"
                onClick={swapStations}
                className="rounded-lg border border-white/10 px-3 py-1 text-xs text-rail-muted transition hover:border-rail-accent/40 hover:text-rail-cream"
                aria-label="Swap stations"
              >
                ⇅ Swap
              </button>
            </div>

            <StationSelector
              label="Arriving at"
              value={to}
              onChange={(s) => {
                setTo(s)
                setCustomDuration(null)
              }}
              exclude={from}
            />
          </div>

          {from && to && from.crs === to.crs && (
            <p className="mt-4 text-sm text-rail-track">Choose two different stations.</p>
          )}

          {estimated !== null && distance !== null && (
            <div className="mt-6 rounded-xl bg-rail-panel/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-rail-muted">Estimated journey</span>
                <span className="font-semibold text-rail-cream">
                  {formatMinutes(estimated)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-rail-muted">Distance</span>
                <span className="text-rail-cream">{Math.round(distance)} km</span>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4">
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-rail-muted">
                  <Clock className="h-3.5 w-3.5" />
                  Focus duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {[estimated, 25, 45, 60, 90].filter(
                    (v, i, arr) => arr.indexOf(v) === i,
                  ).map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setCustomDuration(mins === estimated ? null : mins)}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                        (customDuration ?? estimated) === mins
                          ? 'bg-rail-accent text-white'
                          : 'border border-white/10 text-rail-muted hover:border-rail-accent/40 hover:text-rail-cream'
                      }`}
                    >
                      {formatMinutes(mins)}
                      {mins === estimated && ' (route)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-rail-accent py-4 text-base font-semibold text-white transition hover:bg-rail-accent-light disabled:cursor-not-allowed disabled:opacity-40"
          >
            Board train
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-rail-muted/70">
          UI preview — live timetables and real routes coming soon.
        </p>
      </div>
    </div>
  )
}
