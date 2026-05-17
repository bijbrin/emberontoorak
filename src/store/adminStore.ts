import { create } from 'zustand'
import type { Tab } from '@/types'

interface AdminStore {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export const useAdminStore = create<AdminStore>((set) => ({
  activeTab: 'reservations',
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
