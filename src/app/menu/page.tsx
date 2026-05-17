import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import MenuPageClient from './MenuPageClient'
import type { MenuSectionData } from '@/types/menu'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Menu',
  description:
    'Explore the Ember on Toorak menus — à la carte, lunch, and an extensive drinks list. Fire-roasted dishes, premium steaks, signature cocktails, and curated cellar pours.',
  openGraph: {
    title: 'Menu — Ember on Toorak',
    description: 'À la carte, lunch, and drinks at Ember on Toorak.',
    url: 'https://www.emberontoorak.com.au/menu',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/menu' },
}

function formatPrice(price: { toNumber(): number } | null): string | null {
  if (!price) return null
  return price.toNumber().toLocaleString('en-AU')
}

export default async function MenuPage() {
  const sections = await prisma.menuSection.findMany({
    include: {
      items: { where: { available: true }, orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  })

  const menuSections: MenuSectionData[] = sections.map((s) => ({
    id: s.slug,
    label: s.label,
    subtitle: s.subtitle,
    note: s.note ?? undefined,
    menuType: s.menuType,
    parentSlug: s.parentSlug ?? undefined,
    items: s.items.map((item) => ({
      name: item.name,
      description: item.description,
      price: formatPrice(item.price),
      priceNote: item.priceNote ?? undefined,
      highlight: item.highlight,
    })),
  }))

  return <MenuPageClient sections={menuSections} />
}
