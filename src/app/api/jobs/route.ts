import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const JobCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(80),
  title: z.string().min(1).max(120),
  department: z.string().min(1).max(80),
  type: z.string().min(1).max(80),
  location: z.string().min(1).max(120),
  salary: z.string().min(1).max(120),
  summary: z.string().min(1).max(600),
  responsibilities: z.array(z.string().min(1).max(400)).max(20).default([]),
  requirements: z.array(z.string().min(1).max(400)).max(20).default([]),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export async function GET(req: NextRequest) {
  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  const includeUnpublished = isAdmin && req.nextUrl.searchParams.get('all') === '1'

  const jobs = await prisma.job.findMany({
    where: includeUnpublished ? {} : { published: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })

  return NextResponse.json(
    jobs.map((j) => ({
      ...j,
      createdAt: j.createdAt.toISOString(),
      updatedAt: j.updatedAt.toISOString(),
    })),
  )
}

export async function POST(req: NextRequest) {
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

  const parsed = JobCreateSchema.safeParse(body)
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
    const job = await prisma.job.create({ data: parsed.data })
    revalidatePath('/hire')
    return NextResponse.json(
      { ...job, createdAt: job.createdAt.toISOString(), updatedAt: job.updatedAt.toISOString() },
      { status: 201 },
    )
  } catch (e) {
    const msg = e instanceof Error && e.message.includes('Unique') ? 'Slug already in use' : 'Failed to create job'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
