// Public hire page view
export interface Job {
  id: string
  slug: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  summary: string
  responsibilities: string[]
  requirements: string[]
}

// Admin view
export interface JobRow {
  id: string
  slug: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  published: boolean
  sortOrder: number
}

// In-flight edit shape for JobManager
export interface JobDraft {
  slug: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  responsibilitiesText: string
  requirementsText: string
  sortOrder: number
}

// In-flight edit shape for MenuManager
export interface MenuItemDraft {
  name: string
  description: string
  price: string
}

// API response shape
export interface JobApiResponse {
  id: string
  slug: string
  title: string
  department: string
  type: string
  location: string
  salary: string
  summary: string
  responsibilities: string[]
  requirements: string[]
  published: boolean
  sortOrder: number
}
