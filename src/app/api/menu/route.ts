import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function formatPrice(price: { toNumber: () => number } | null): string | null {
  if (!price) return null
  return price.toNumber().toLocaleString('en-AU')
}

export async function GET() {
  try {
    const sections = await prisma.menuSection.findMany({
      include: {
        items: { where: { available: true }, orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
    })

    const serialised = sections.map((s) => ({
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

    return NextResponse.json({ sections: serialised })
  } catch (error) {
    console.error('[GET /api/menu]', error)
    return NextResponse.json({ error: 'Failed to load menu' }, { status: 500 })
  }
}
