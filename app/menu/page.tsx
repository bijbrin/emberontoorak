import { prisma } from '@/lib/prisma'
import MenuPageClient, { type MenuSectionData, type CellarSectionData } from './MenuPageClient'
function formatPrice(price: { toNumber(): number }): string {
  return price.toNumber().toLocaleString('en-AU')
}

export default async function MenuPage() {
  const [sections, wineSections] = await Promise.all([
    prisma.menuSection.findMany({
      include: {
        items: { where: { available: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.wineSection.findMany({
      include: {
        items: { where: { available: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  const menuSections: MenuSectionData[] = sections.map((s) => ({
    id: s.slug,
    label: s.label,
    subtitle: s.subtitle,
    note: s.note ?? undefined,
    items: s.items.map((item) => ({
      name: item.name,
      description: item.description,
      price: formatPrice(item.price),
      highlight: item.highlight,
    })),
  }))

  const cellarSections: CellarSectionData[] = wineSections.map((s) => ({
    id: s.slug,
    label: s.label,
    items: s.items.map((item) => ({
      name: item.name,
      varietal: item.varietal,
      region: item.region,
      year: item.year,
      price: formatPrice(item.price),
      highlight: item.highlight,
    })),
  }))

  return <MenuPageClient menuSections={menuSections} cellarSections={cellarSections} />
}
