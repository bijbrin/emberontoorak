import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { defaultThemeSettings, type ThemeSettings } from '@/lib/theme'

const KEY = 'theme'

export async function GET() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: KEY } })
    const settings: ThemeSettings = row ? JSON.parse(row.value) : defaultThemeSettings()
    return NextResponse.json(settings)
  } catch {
    return NextResponse.json(defaultThemeSettings())
  }
}

export async function POST(req: Request) {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: ThemeSettings
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.mode !== 'auto' && body.mode !== 'manual') {
    return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
  }

  await prisma.siteSettings.upsert({
    where: { key: KEY },
    create: { key: KEY, value: JSON.stringify(body) },
    update: { value: JSON.stringify(body) },
  })

  revalidatePath('/', 'layout')

  return NextResponse.json(body)
}
