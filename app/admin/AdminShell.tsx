'use client'
import { useState } from 'react'
import ReservationManager from './ReservationManager'
import MenuManager from './MenuManager'
import JobManager, { type JobRow } from './JobManager'

type Tab = 'reservations' | 'menu' | 'jobs'

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
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  createdAt: string
}

interface MenuItemRow {
  id: string
  name: string
  description: string
  price: string
  highlight: boolean
  available: boolean
  sortOrder: number
}

interface MenuSectionRow {
  id: string
  slug: string
  label: string
  subtitle: string
  items: MenuItemRow[]
}

interface Stats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

const tabs: { id: Tab; label: string; sub: string }[] = [
  { id: 'reservations', label: 'Reservations', sub: 'Bookings & status' },
  { id: 'menu', label: 'Menu Items', sub: 'Visibility & order' },
  { id: 'jobs', label: 'Careers', sub: 'Open positions' },
]

export default function AdminShell({
  reservations,
  sections,
  jobs,
  stats,
}: {
  reservations: Reservation[]
  sections: MenuSectionRow[]
  jobs: JobRow[]
  stats: Stats
}) {
  const [active, setActive] = useState<Tab>('reservations')

  const statItems = [
    { label: 'Total', value: stats.total, color: 'text-cream' },
    { label: 'Pending', value: stats.pending, color: 'text-gold' },
    { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400/70' },
  ]

  return (
    <div className="flex gap-0 min-h-[calc(100vh-6rem)]">
      {/* Left nav — 1/4 */}
      <aside className="w-1/4 shrink-0 border-r border-gold/10 pr-6 pt-2">
        <p className="text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-4">Admin</p>
        <nav className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 group ${
                active === t.id
                  ? 'bg-gold/10 border-gold/30 text-cream'
                  : 'border-transparent text-cream/45 hover:text-cream/75 hover:bg-smoke/50'
              }`}
            >
              <span className="block font-serif italic text-base leading-tight">{t.label}</span>
              <span className={`block text-[10px] mt-0.5 ${active === t.id ? 'text-cream/40' : 'text-cream/25 group-hover:text-cream/35'}`}>
                {t.sub}
              </span>
            </button>
          ))}
        </nav>

        {/* Stats */}
        <div className="mt-10 space-y-3">
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-3">Overview</p>
          {statItems.map((s) => (
            <div key={s.label} className="flex items-baseline justify-between">
              <span className="text-[10px] tracking-[0.15em] uppercase text-cream/30">{s.label}</span>
              <span className={`font-serif italic text-xl ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Right content — 3/4 */}
      <main className="flex-1 min-w-0 pl-8 pt-2">
        {active === 'reservations' && (
          <>
            <div className="mb-6 pb-4 border-b border-gold/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/55 mb-1">Manage</p>
              <h2 className="font-serif italic text-cream text-3xl">Reservations</h2>
            </div>
            <ReservationManager reservations={reservations} />
          </>
        )}

        {active === 'menu' && (
          <>
            <div className="mb-6 pb-4 border-b border-gold/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/55 mb-1">Manage</p>
              <h2 className="font-serif italic text-cream text-3xl">Menu Items</h2>
              <p className="text-cream/30 text-sm mt-1">Hide items to remove them from the public menu without deleting.</p>
            </div>
            <MenuManager sections={sections} />
          </>
        )}

        {active === 'jobs' && (
          <>
            <div className="mb-6 pb-4 border-b border-gold/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-gold/55 mb-1">Manage</p>
              <h2 className="font-serif italic text-cream text-3xl">Careers</h2>
              <p className="text-cream/30 text-sm mt-1">Edit, publish, or remove the roles shown on the public /hire page.</p>
            </div>
            <JobManager jobs={jobs} />
          </>
        )}
      </main>
    </div>
  )
}
