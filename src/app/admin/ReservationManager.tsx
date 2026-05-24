'use client'
import { useState } from 'react'

type Status = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

interface Reservation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  date: string
  time: string
  guests: number
  occasion: string | null
  dietary: string | null
  notes: string | null
  status: Status
  createdAt: string
}

const statusStyles: Record<Status, string> = {
  PENDING:   'bg-gold/15 text-gold border border-gold/30',
  CONFIRMED: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  CANCELLED: 'bg-red-500/10 text-red-400/70 border border-red-500/20',
}

const statusDot: Record<Status, string> = {
  PENDING:   'bg-gold',
  CONFIRMED: 'bg-emerald-400',
  CANCELLED: 'bg-red-400/70',
}

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-AU', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-AU', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

function formatCreated(isoStr: string) {
  return new Date(isoStr).toLocaleString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true,
  })
}

export default function ReservationManager({ reservations: initial }: { reservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL')

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  async function updateStatus(id: string, status: Status) {
    setLoading(id)
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      const label = status === 'CONFIRMED' ? 'Confirmed' : status === 'CANCELLED' ? 'Cancelled' : 'set to Pending'
      const emailNote = status === 'CONFIRMED' || status === 'CANCELLED' ? ' — email sent to guest' : ''
      showToast(`${label}${emailNote}`)
    } catch {
      showToast('Failed to update status')
    } finally {
      setLoading(null)
    }
  }

  const filtered = filterStatus === 'ALL'
    ? reservations
    : reservations.filter((r) => r.status === filterStatus)

  const counts = {
    ALL:       reservations.length,
    PENDING:   reservations.filter((r) => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter((r) => r.status === 'CONFIRMED').length,
    CANCELLED: reservations.filter((r) => r.status === 'CANCELLED').length,
  }

  if (reservations.length === 0) {
    return <p className="text-cream/30 text-sm py-12 text-center">No reservations yet.</p>
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-surface border border-gold/30 text-cream/80 text-sm shadow-2xl backdrop-blur-sm animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 flex-wrap">
        {(['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] tracking-[0.15em] uppercase transition-all duration-150 ${
              filterStatus === s
                ? 'bg-gold/15 border border-gold/35 text-gold'
                : 'border border-transparent text-cream/35 hover:text-cream/55 hover:border-gold/15'
            }`}
          >
            {s !== 'ALL' && <span className={`w-1.5 h-1.5 rounded-full ${statusDot[s as Status]}`} />}
            {s}
            <span className={`ml-0.5 ${filterStatus === s ? 'text-gold/60' : 'text-cream/20'}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-cream/30 text-sm py-8 text-center">No {filterStatus.toLowerCase()} reservations.</p>
      )}

      {/* Cards */}
      <div className="space-y-2">
        {filtered.map((r) => {
          const isExpanded = expandedId === r.id
          const isLoading  = loading === r.id

          return (
            <div
              key={r.id}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'border-gold/30 bg-smoke/60'
                  : 'border-gold/8 bg-smoke/20 hover:border-gold/20 hover:bg-smoke/40'
              }`}
            >
              {/* Summary row — click to expand */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
                className="w-full text-left px-4 sm:px-5 py-3 sm:py-3.5"
              >
                {/* Mobile layout: two rows */}
                <div className="sm:hidden">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-serif italic text-cream/85 text-[15px] leading-tight block truncate">
                        {r.firstName} {r.lastName}
                      </span>
                      <span className="text-cream/35 text-[11px] block truncate">{r.email}</span>
                    </div>
                    <svg
                      className={`shrink-0 w-4 h-4 mt-1 text-cream/30 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-cream/55">
                    <span className="whitespace-nowrap">{formatDate(r.date)}</span>
                    <span className="text-cream/20">·</span>
                    <span className="whitespace-nowrap">{formatTime(r.time)}</span>
                    <span className="text-cream/20">·</span>
                    <span className="whitespace-nowrap">{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</span>
                    <span className={`ml-auto text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                </div>

                {/* Desktop layout: single grid row */}
                <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-x-5 items-center">
                  <div className="min-w-0">
                    <span className="font-serif italic text-cream/85 text-base leading-tight block truncate">
                      {r.firstName} {r.lastName}
                    </span>
                    <span className="text-cream/35 text-[11px] block truncate">{r.email}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-cream/60 text-[13px] whitespace-nowrap">{formatDate(r.date)}</span>
                    <span className="block text-cream/35 text-[11px]">{formatTime(r.time)}</span>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-cream/50 text-[13px]">{r.guests}</span>
                    <span className="text-cream/25 text-[10px] block">guests</span>
                  </div>
                  <div className="shrink-0">
                    <span className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                      {r.status}
                    </span>
                  </div>
                  <div className="shrink-0">
                    <svg
                      className={`w-4 h-4 text-cream/25 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Expanded detail panel */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 border-t border-gold/10 pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Full Name</p>
                      <p className="text-cream/75 text-sm">{r.firstName} {r.lastName}</p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Email</p>
                      <a href={`mailto:${r.email}`} className="text-steel hover:text-gold transition-colors text-sm break-all">
                        {r.email}
                      </a>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Phone</p>
                      <p className="text-cream/75 text-sm">
                        {r.phone
                          ? <a href={`tel:${r.phone}`} className="hover:text-gold transition-colors">{r.phone}</a>
                          : <span className="text-cream/25">—</span>
                        }
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Date</p>
                      <p className="text-cream/75 text-sm">{formatDate(r.date)}</p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Time</p>
                      <p className="text-cream/75 text-sm">{formatTime(r.time)}</p>
                    </div>

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Party Size</p>
                      <p className="text-cream/75 text-sm">{r.guests} {r.guests === 1 ? 'guest' : 'guests'}</p>
                    </div>

                    {r.occasion && (
                      <div>
                        <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Occasion</p>
                        <p className="text-cream/75 text-sm">{r.occasion}</p>
                      </div>
                    )}

                    {r.dietary && (
                      <div>
                        <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Dietary</p>
                        <p className="text-cream/75 text-sm">{r.dietary}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1">Booked</p>
                      <p className="text-cream/50 text-[11px]">{formatCreated(r.createdAt)}</p>
                    </div>
                  </div>

                  {r.notes && (
                    <div className="mb-5 p-3 rounded-lg bg-obsidian/40 border border-gold/10">
                      <p className="text-[9px] tracking-[0.25em] uppercase text-cream/30 mb-1.5">Notes</p>
                      <p className="text-cream/65 text-sm leading-relaxed">{r.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] tracking-[0.2em] uppercase text-cream/25 mr-1">Change status:</span>

                    {r.status !== 'CONFIRMED' && (
                      <button
                        onClick={() => updateStatus(r.id, 'CONFIRMED')}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] tracking-[0.12em] uppercase hover:bg-emerald-500/25 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {isLoading ? '…' : (
                          <>
                            <span>Confirm</span>
                            <span className="text-emerald-400/50 text-[9px]">· emails guest</span>
                          </>
                        )}
                      </button>
                    )}

                    {r.status !== 'CANCELLED' && (
                      <button
                        onClick={() => updateStatus(r.id, 'CANCELLED')}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400/70 text-[10px] tracking-[0.12em] uppercase hover:bg-red-500/20 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                      >
                        {isLoading ? '…' : (
                          <>
                            <span>Cancel</span>
                            <span className="text-red-400/40 text-[9px]">· emails guest</span>
                          </>
                        )}
                      </button>
                    )}

                    {r.status !== 'PENDING' && (
                      <button
                        onClick={() => updateStatus(r.id, 'PENDING')}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-gold/8 border border-gold/20 text-gold/60 text-[10px] tracking-[0.12em] uppercase hover:bg-gold/15 transition-colors disabled:opacity-40"
                      >
                        {isLoading ? '…' : 'Set Pending'}
                      </button>
                    )}
                  </div>

                  {(r.status === 'CONFIRMED' || r.status === 'CANCELLED') && (
                    <p className="mt-2 text-[10px] text-cream/25">
                      An email was sent to the guest when this status was last set.
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
