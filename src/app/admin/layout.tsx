import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') redirect('/')
  return (
    <>
      {children}
    </>
  )
}
