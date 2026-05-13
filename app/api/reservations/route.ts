import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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
  const body = await req.json()

  const reservation = await prisma.reservation.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      date: body.date,
      time: body.time,
      guests: Number(body.guests),
      occasion: body.occasion || null,
      dietary: body.dietary || null,
      notes: body.notes || null,
    },
  })

  return NextResponse.json(
    { ...reservation, createdAt: reservation.createdAt.toISOString(), updatedAt: reservation.updatedAt.toISOString() },
    { status: 201 },
  )
}
