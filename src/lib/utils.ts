export function formatPrice(price: string | number): string {
  const n = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(n)) return String(price)
  return `$${n.toFixed(0)}`
}

export function to24h(t: string): string {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!m) return t
  let h = parseInt(m[1], 10)
  const period = m[3].toUpperCase()
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${m[2]}`
}

export function str(data: FormData, k: string): string | undefined {
  const v = data.get(k)
  const s = typeof v === 'string' ? v.trim() : ''
  return s.length ? s : undefined
}

export const ALLOWED_MIME = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

export const MAX_FILE_BYTES = 5 * 1024 * 1024

export function validateFile(f: File | null, required: boolean, field: string): string | null {
  if (!f || f.size === 0) return required ? `${field} is required` : null
  if (f.size > MAX_FILE_BYTES) return `${field} must be 5 MB or smaller`
  if (!ALLOWED_MIME.has(f.type)) return `${field} must be a PDF or Word document`
  return null
}
