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
  PENDING: 'bg-gold/15 text-gold border border-gold/30',
  CONFIRMED: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  CANCELLED: 'bg-red-500/10 text-red-400/70 border border-red-500/20',
}

export default function ReservationManager({ reservations: initial }: { reservations: Reservation[] }) {
  const [reservations, setReservations] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)

  async function updateStatus(id: string, status: Status) {
    setLoading(id)
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed')
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch {
      alert('Failed to update status')
    } finally {
      setLoading(null)
    }
  }

  if (reservations.length === 0) {
    return <p className="text-cream/30 text-sm py-12 text-center">No reservations yet.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-gold/10">
            {['Guest', 'Date', 'Time', 'Guests', 'Occasion', 'Contact', 'Notes', 'Status', ''].map((h) => (
              <th key={h} className="text-left text-[9px] tracking-[0.25em] uppercase text-cream/30 pb-3 pr-4 font-normal whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id} className="border-b border-gold/6 hover:bg-smoke/30 transition-colors group">
              <td className="py-3 pr-4 whitespace-nowrap">
                <span className="font-serif italic text-cream/80">
                  {r.firstName} {r.lastName}
                </span>
              </td>
              <td className="py-3 pr-4 text-cream/50 whitespace-nowrap">{r.date}</td>
              <td className="py-3 pr-4 text-cream/50 whitespace-nowrap">{r.time}</td>
              <td className="py-3 pr-4 text-cream/50 text-center">{r.guests}</td>
              <td className="py-3 pr-4 text-cream/40 whitespace-nowrap">{r.occasion ?? '—'}</td>
              <td className="py-3 pr-4 whitespace-nowrap">
                <a href={`mailto:${r.email}`} className="text-cream/40 hover:text-gold transition-colors text-xs">
                  {r.email}
                </a>
                {r.phone && <span className="block text-cream/25 text-[10px]">{r.phone}</span>}
              </td>
              <td className="py-3 pr-4 max-w-[160px]">
                <span className="text-cream/30 text-[11px] italic truncate block">
                  {[r.dietary, r.notes].filter(Boolean).join(' · ') || '—'}
                </span>
              </td>
              <td className="py-3 pr-4 whitespace-nowrap">
                <span className={`text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full ${statusStyles[r.status]}`}>
                  {r.status}
                </span>
              </td>
              <td className="py-3 whitespace-nowrap">
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {r.status !== 'CONFIRMED' && (
                    <button
                      onClick={() => updateStatus(r.id, 'CONFIRMED')}
                      disabled={loading === r.id}
                      className="px-2 py-1 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[9px] tracking-[0.1em] uppercase hover:bg-emerald-500/25 transition-colors disabled:opacity-40"
                    >
                      Confirm
                    </button>
                  )}
                  {r.status !== 'CANCELLED' && (
                    <button
                      onClick={() => updateStatus(r.id, 'CANCELLED')}
                      disabled={loading === r.id}
                      className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400/70 text-[9px] tracking-[0.1em] uppercase hover:bg-red-500/20 transition-colors disabled:opacity-40"
                    >
                      Cancel
                    </button>
                  )}
                  {r.status !== 'PENDING' && (
                    <button
                      onClick={() => updateStatus(r.id, 'PENDING')}
                      disabled={loading === r.id}
                      className="px-2 py-1 rounded bg-gold/10 border border-gold/20 text-gold/60 text-[9px] tracking-[0.1em] uppercase hover:bg-gold/20 transition-colors disabled:opacity-40"
                    >
                      Pending
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
