import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ReservationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName:  z.string().min(1).max(100),
  email:     z.string().email(),
  phone:     z.string().max(30).optional(),
  date:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time:      z.string().regex(/^\d{2}:\d{2}$/),
  guests:    z.number().int().min(1).max(20),
  occasion:  z.string().max(200).optional(),
  dietary:   z.string().max(500).optional(),
  notes:     z.string().max(1000).optional(),
})

export async function GET() {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const reservations = await prisma.reservation.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    reservations.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  )
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ReservationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        ...(process.env.NODE_ENV !== 'production' && { details: z.flattenError(parsed.error).fieldErrors }),
      },
      { status: 422 },
    )
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        firstName: parsed.data.firstName,
        lastName:  parsed.data.lastName,
        email:     parsed.data.email,
        phone:     parsed.data.phone ?? null,
        date:      parsed.data.date,
        time:      parsed.data.time,
        guests:    parsed.data.guests,
        occasion:  parsed.data.occasion ?? null,
        dietary:   parsed.data.dietary ?? null,
        notes:     parsed.data.notes ?? null,
      },
    })

    return NextResponse.json(
      { ...reservation, createdAt: reservation.createdAt.toISOString(), updatedAt: reservation.updatedAt.toISOString() },
      { status: 201 },
    )
  } catch {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 })
  }
}
