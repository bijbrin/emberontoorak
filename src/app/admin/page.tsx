import { prisma } from '@/lib/prisma'
import AdminShell from './AdminShell'
import { defaultThemeSettings, type ThemeSettings } from '@/lib/theme'

export default async function AdminPage() {
  const [pending, confirmed, cancelled, menuSections, reservations, jobs, themeRow] = await Promise.all([
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.reservation.count({ where: { status: 'CANCELLED' } }),
    prisma.menuSection.findMany({
      include: { items: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.reservation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.job.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] }),
    prisma.siteSettings.findUnique({ where: { key: 'theme' } }),
  ])
  const themeSettings: ThemeSettings = themeRow ? JSON.parse(themeRow.value) : defaultThemeSettings()

  const serialisedSections = menuSections.map((s: (typeof menuSections)[number]) => ({
    id: s.id,
    slug: s.slug,
    label: s.label,
    subtitle: s.subtitle,
    menuType: s.menuType,
    parentSlug: s.parentSlug,
    items: s.items.map((item: (typeof s.items)[number]) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price ? item.price.toNumber().toLocaleString('en-AU') : '',
      priceNote: item.priceNote ?? '',
      highlight: item.highlight,
      available: item.available,
      sortOrder: item.sortOrder,
    })),
  }))

  const serialisedReservations = reservations.map((r: (typeof reservations)[number]) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  const serialisedJobs = jobs.map((j: (typeof jobs)[number]) => ({
    id: j.id,
    slug: j.slug,
    title: j.title,
    department: j.department,
    type: j.type,
    location: j.location,
    salary: j.salary,
    summary: j.summary,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
    published: j.published,
    sortOrder: j.sortOrder,
  }))

  return (
    <main className="min-h-screen bg-obsidian pt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <AdminShell
          reservations={serialisedReservations}
          sections={serialisedSections}
          jobs={serialisedJobs}
          stats={{ total: pending + confirmed + cancelled, pending, confirmed, cancelled }}
          themeSettings={themeSettings}
        />
      </div>
    </main>
  )
}
