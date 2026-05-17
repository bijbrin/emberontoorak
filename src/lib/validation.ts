import { z } from 'zod'

export const ReservationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.number().int().min(1).max(20),
  occasion: z.string().max(200).optional(),
  dietary: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
})

export const ReservationPatchSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED']),
})

export const MenuItemPatchSchema = z.object({
  available: z.boolean().optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  price: z.number().positive().max(9999).optional(),
}).refine((v) => Object.keys(v).length > 0, { message: 'At least one field required' })

export const JobCreateSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(80),
  title: z.string().min(1).max(120),
  department: z.string().min(1).max(80),
  type: z.string().min(1).max(80),
  location: z.string().min(1).max(120),
  salary: z.string().min(1).max(120),
  summary: z.string().min(1).max(600),
  responsibilities: z.array(z.string().min(1).max(400)).max(20).default([]),
  requirements: z.array(z.string().min(1).max(400)).max(20).default([]),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
})

export const JobPatchSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/).min(1).max(80).optional(),
  title: z.string().min(1).max(120).optional(),
  department: z.string().min(1).max(80).optional(),
  type: z.string().min(1).max(80).optional(),
  location: z.string().min(1).max(120).optional(),
  salary: z.string().min(1).max(120).optional(),
  summary: z.string().min(1).max(600).optional(),
  responsibilities: z.array(z.string().min(1).max(400)).max(20).optional(),
  requirements: z.array(z.string().min(1).max(400)).max(20).optional(),
  published: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
}).refine((v) => Object.keys(v).length > 0, { message: 'At least one field required' })

export const ApplicationSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
  position: z.string().min(1).max(120),
  experience: z.string().max(40),
  rightToWork: z.enum(['yes', 'sponsorship', 'no']),
  message: z.string().max(2000).optional(),
})

export const IdSchema = z.string().regex(/^c[a-z0-9]{24}$/)
