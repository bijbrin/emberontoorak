export type Tab = 'reservations' | 'menu' | 'jobs' | 'theme'

export type MenuType = 'A_LA_CARTE' | 'LUNCH' | 'DRINKS'

export interface Stats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

export interface MenuItemRow {
  id: string
  name: string
  description: string
  price: string
  priceNote: string
  highlight: boolean
  available: boolean
  sortOrder: number
}

export interface MenuSectionRow {
  id: string
  slug: string
  label: string
  subtitle: string
  menuType: MenuType
  parentSlug: string | null
  items: MenuItemRow[]
}
