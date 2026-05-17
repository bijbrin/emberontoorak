// Client-facing menu page types
import type { MenuType } from './admin'

export interface MenuItemData {
  name: string
  description: string
  price: string | null
  priceNote?: string
  highlight?: boolean
}

export interface MenuSectionData {
  id: string
  label: string
  subtitle: string
  note?: string
  menuType: MenuType
  parentSlug?: string
  items: MenuItemData[]
}
