import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()

  const data: Record<string, unknown> = {}
  if (body.available !== undefined) data.available = body.available
  if (body.name !== undefined) data.name = String(body.name).trim()
  if (body.description !== undefined) data.description = String(body.description).trim()
  if (body.price !== undefined) data.price = parseFloat(body.price)

  const item = await prisma.menuItem.update({ where: { id }, data })
  revalidatePath('/menu')

  return NextResponse.json({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price.toNumber().toLocaleString('en-AU'),
    available: item.available,
  })
}
