import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatPrice(price: { toNumber: () => number }): string {
  const num = price.toNumber()
  return num.toLocaleString('en-AU')
}

export async function GET() {
  try {
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

    const menuSections = sections.map((s) => ({
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

    const cellarSections = wineSections.map((s) => ({
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

    return NextResponse.json({ menuSections, cellarSections })
  } catch (error) {
    console.error('[GET /api/menu]', error)
    return NextResponse.json({ error: 'Failed to load menu' }, { status: 500 })
  }
}
