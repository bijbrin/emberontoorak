import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservations',
  description:
    'Book a table at Ember on Toorak. Reserve your fire-dining experience in Toorak Village, Melbourne — available for dinner service Tuesday through Sunday.',
  openGraph: {
    title: 'Book a Table — Ember on Toorak',
    description: 'Reserve your fire-dining experience in Toorak Village, Melbourne.',
    url: 'https://www.emberontoorak.com.au/reservations',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: '/reservations' },
}

export default function ReservationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
