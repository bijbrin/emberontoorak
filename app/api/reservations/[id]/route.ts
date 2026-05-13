import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ReservationPatchSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
})

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

  const parsed = ReservationPatchSchema.safeParse(body)
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
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: parsed.data.status },
    })

    return NextResponse.json({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      updatedAt: reservation.updatedAt.toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to update reservation' }, { status: 500 })
  }
}
