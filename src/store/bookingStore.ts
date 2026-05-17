import { create } from 'zustand'

interface BookingStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useBookingStore = create<BookingStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))
