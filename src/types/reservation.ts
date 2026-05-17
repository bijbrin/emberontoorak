export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Reservation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  date: string
  time: string
  guests: number
  occasion: string | null
  dietary: string | null
  notes: string | null
  status: ReservationStatus
  createdAt: string
}
