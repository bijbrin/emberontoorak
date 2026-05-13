import { prisma } from '@/lib/prisma'
import AdminShell from './AdminShell'

export default async function AdminPage() {
  const [pending, confirmed, cancelled, menuSections, reservations] = await Promise.all([
    prisma.reservation.count({ where: { status: 'PENDING' } }),
    prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
    prisma.reservation.count({ where: { status: 'CANCELLED' } }),
    prisma.menuSection.findMany({
      include: { items: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.reservation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
  ])

  const serialisedSections = menuSections.map((s: (typeof menuSections)[number]) => ({
    id: s.id,
    slug: s.slug,
    label: s.label,
    subtitle: s.subtitle,
    items: s.items.map((item: (typeof s.items)[number]) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price.toNumber().toLocaleString('en-AU'),
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

  return (
    <main className="min-h-screen bg-obsidian pt-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
        <AdminShell
          reservations={serialisedReservations}
          sections={serialisedSections}
          stats={{ total: pending + confirmed + cancelled, pending, confirmed, cancelled }}
        />
      </div>
    </main>
  )
}
