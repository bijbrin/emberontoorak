'use client'
import ReservationManager from './ReservationManager'
import MenuManager from './MenuManager'
import JobManager, { type JobRow } from './JobManager'
import ThemeManager from './ThemeManager'
import type { ThemeSettings } from '@/lib/theme'
import { useAdminStore } from '@/store/adminStore'
import type { Tab } from '@/types'
import type { Reservation, MenuSectionRow, Stats } from '@/types'

const tabs: { id: Tab; label: string; sub: string }[] = [
  { id: 'reservations', label: 'Reservations', sub: 'Bookings & status' },
  { id: 'menu', label: 'Menu Items', sub: 'Visibility & order' },
  { id: 'jobs', label: 'Careers', sub: 'Open positions' },
  { id: 'theme', label: 'Theme', sub: 'Site appearance' },
]

export default function AdminShell({
  reservations,
  sections,
  jobs,
  stats,
  themeSettings,
}: {
  reservations: Reservation[]
  sections: MenuSectionRow[]
  jobs: JobRow[]
  stats: Stats
  themeSettings: ThemeSettings
}) {
  const { activeTab: active, setActiveTab: setActive } = useAdminStore()

  const statItems = [
    { label: 'Total', value: stats.total, color: 'text-foreground' },
    { label: 'Pending', value: stats.pending, color: 'text-accent' },
    { label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-400' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-red-400/70' },
  ]

  return (
    <div className="flex flex-col md:flex-row md:gap-0 min-h-[calc(100vh-6rem)]">
      {/* Sidebar (desktop) / top controls (mobile) */}
      <aside className="md:w-1/4 md:shrink-0 md:border-r md:border-accent/10 md:pr-6 md:pt-2">
        {/* Mobile: scrollable pill tabs + compact stat row */}
        <div className="md:hidden mb-6">
          <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-2">Admin</p>
          <div className="-mx-4 px-4 sm:-mx-8 sm:px-8 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 min-w-max pb-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  className={`shrink-0 px-4 py-2 rounded-full border text-[11px] tracking-[0.15em] uppercase transition-all duration-150 ${
                    active === t.id
                      ? 'bg-accent/15 border-accent/40 text-foreground'
                      : 'border-accent/15 text-foreground/50 hover:text-foreground/80'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {statItems.map((s) => (
              <div key={s.label} className="rounded-lg border border-accent/10 bg-surface/40 px-2 py-2 text-center">
                <span className="block text-[8px] tracking-[0.15em] uppercase text-muted mb-0.5">{s.label}</span>
                <span className={`block font-serif text-lg leading-none ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: vertical nav + stat list */}
        <div className="hidden md:block">
          <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-4">Admin</p>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 group ${
                  active === t.id
                    ? 'bg-accent/10 border-accent/30 text-foreground'
                    : 'border-transparent text-foreground/70 hover:text-foreground hover:bg-surface/60'
                }`}
              >
                <span className="block font-serif text-base leading-tight">{t.label}</span>
                <span className={`block text-[10px] mt-0.5 ${active === t.id ? 'text-muted' : 'text-muted group-hover:text-foreground/70'}`}>
                  {t.sub}
                </span>
              </button>
            ))}
          </nav>

          <div className="mt-10 space-y-3">
            <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-3">Overview</p>
            {statItems.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between">
                <span className="text-[10px] tracking-[0.15em] uppercase text-muted">{s.label}</span>
                <span className={`font-serif text-xl ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Right content */}
      <main className="flex-1 min-w-0 md:pl-8 pt-2">
        {active === 'reservations' && (
          <>
            <div className="mb-6 pb-4 border-b border-accent/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent/70 mb-1">Manage</p>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl">Reservations</h2>
            </div>
            <ReservationManager reservations={reservations} />
          </>
        )}

        {active === 'menu' && (
          <>
            <div className="mb-6 pb-4 border-b border-accent/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent/70 mb-1">Manage</p>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl">Menu Items</h2>
              <p className="text-muted text-sm mt-1">Hide items to remove them from the public menu without deleting.</p>
            </div>
            <MenuManager sections={sections} />
          </>
        )}

        {active === 'jobs' && (
          <>
            <div className="mb-6 pb-4 border-b border-accent/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent/70 mb-1">Manage</p>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl">Careers</h2>
              <p className="text-muted text-sm mt-1">Edit, publish, or remove the roles shown on the public /hire page.</p>
            </div>
            <JobManager jobs={jobs} />
          </>
        )}

        {active === 'theme' && (
          <>
            <div className="mb-6 pb-4 border-b border-accent/10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent/70 mb-1">Appearance</p>
              <h2 className="font-serif text-foreground text-2xl sm:text-3xl">Theme</h2>
              <p className="text-muted text-sm mt-1">
                Pick a fixed theme or let it rotate automatically day by day.
              </p>
            </div>
            <ThemeManager initial={themeSettings} />
          </>
        )}
      </main>
    </div>
  )
}
