import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import MenuPageClient, { type MenuSectionData, type CellarSectionData } from './MenuPageClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Explore the Ember on Toorak menu — fire-roasted dishes, 28-day dry-aged beef, seasonal sides, and a curated wine cellar from the finest Australian and international producers.',
  openGraph: {
    title: 'Menu — Ember on Toorak',
    description: 'Fire-roasted dishes, dry-aged beef, and a curated wine cellar.',
    url: 'https://www.emberontoorak.com.au/menu',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/menu' },
}
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
