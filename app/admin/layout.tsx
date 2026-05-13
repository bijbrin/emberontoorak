import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BookingProvider } from '../contexts/BookingContext'
import Header from '../components/Header'
import BookingPanel from '../components/BookingPanel'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser()
  if (!user || user.publicMetadata?.role !== 'admin') redirect('/')
  return (
    <BookingProvider>
      <Header />
      <BookingPanel />
      {children}
    </BookingProvider>
  )
}
