import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const JobPatchSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(80).optional(),
  title: z.string().min(1).max(120).optional(),
  department: z.string().min(1).max(80).optional(),
  type: z.string().min(1).max(80).optional(),
  location: z.string().min(1).max(120).optional(),
  salary: z.string().min(1).max(120).optional(),
  summary: z.string().min(1).max(600).optional(),
  responsibilities: z.array(z.string().min(1).max(400)).max(20).optional(),
  requirements: z.array(z.string().min(1).max(400)).max(20).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
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

  const parsed = JobPatchSchema.safeParse(body)
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
    const job = await prisma.job.update({ where: { id }, data: parsed.data })
    revalidatePath('/hire')
    return NextResponse.json({
      ...job,
      createdAt: job.createdAt.toISOString(),
      updatedAt: job.updatedAt.toISOString(),
    })
  } catch (e) {
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Slug already in use' : 'Failed to update job'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await currentUser()
  if (user?.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  if (!IdSchema.safeParse(id).success) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  try {
    await prisma.job.delete({ where: { id } })
    revalidatePath('/hire')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 })
  }
}
