import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const MenuItemPatchSchema = z.object({
  available:   z.boolean().optional(),
  name:        z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price:       z.number().positive().max(9999).nullable().optional(),
  priceNote:   z.string().max(60).nullable().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: 'At least one field required' })

const IdSchema = z.string().regex(/^c[a-z0-9]{24}$/)

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = MenuItemPatchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        ...(process.env.NODE_ENV !== 'production' && { details: z.flattenError(parsed.error).fieldErrors }),
      },
      { status: 422 },
    )
  }

  const { id } = await params

  if (!IdSchema.safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    const item = await prisma.menuItem.update({ where: { id }, data: parsed.data })
    revalidatePath('/menu')

    return NextResponse.json({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price ? item.price.toNumber().toLocaleString('en-AU') : null,
      priceNote: item.priceNote,
      available: item.available,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}
