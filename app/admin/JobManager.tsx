'use client'
import { useState } from 'react'

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

type Draft = Omit<JobRow, 'id' | 'published'> & {
  responsibilitiesText: string
  requirementsText: string
}

const empty: Draft = {
  slug: '',
  title: '',
  department: '',
  type: 'Full-time',
  location: 'Toorak, VIC',
  salary: '',
  summary: '',
  responsibilities: [],
  requirements: [],
  responsibilitiesText: '',
  requirementsText: '',
  sortOrder: 0,
}

function toDraft(j: JobRow): Draft {
  return {
    slug: j.slug,
    title: j.title,
    department: j.department,
    type: j.type,
    location: j.location,
    salary: j.salary,
    summary: j.summary,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
    responsibilitiesText: j.responsibilities.join('\n'),
    requirementsText: j.requirements.join('\n'),
    sortOrder: j.sortOrder,
  }
}

function parseLines(text: string): string[] {
  return text.split('\n').map((s) => s.trim()).filter(Boolean)
}

function draftIsDirty(d: Draft, j: JobRow): boolean {
  if (d.slug !== j.slug) return true
  if (d.title !== j.title) return true
  if (d.department !== j.department) return true
  if (d.type !== j.type) return true
  if (d.location !== j.location) return true
  if (d.salary !== j.salary) return true
  if (d.summary !== j.summary) return true
  if (d.sortOrder !== j.sortOrder) return true
  if (parseLines(d.responsibilitiesText).join('|') !== j.responsibilities.join('|')) return true
  if (parseLines(d.requirementsText).join('|') !== j.requirements.join('|')) return true
  return false
}

const inputClass =
  'w-full bg-obsidian/60 border border-gold/15 rounded-lg px-3 py-2 text-sm text-cream/85 placeholder:text-cream/25 focus:outline-none focus:border-gold/45 focus:bg-obsidian/80 transition-colors'
const labelClass = 'block text-[9px] tracking-[0.25em] uppercase text-cream/35 mb-1.5'

export default function JobManager({ jobs: initial }: { jobs: JobRow[] }) {
  const [jobs, setJobs] = useState<JobRow[]>(initial)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [expanded, setExpanded] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newDraft, setNewDraft] = useState<Draft>(empty)
  const [createError, setCreateError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function getDraft(j: JobRow): Draft {
    return drafts[j.id] ?? toDraft(j)
  }

  function setField<K extends keyof Draft>(id: string, field: K, value: Draft[K]) {
    setDrafts((prev) => {
      const base = prev[id] ?? toDraft(jobs.find((j) => j.id === id)!)
      return { ...prev, [id]: { ...base, [field]: value } }
    })
  }

  async function save(j: JobRow) {
    const d = drafts[j.id]
    if (!d) return
    setSaving(j.id)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${j.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: d.slug,
          title: d.title,
          department: d.department,
          type: d.type,
          location: d.location,
          salary: d.salary,
          summary: d.summary,
          responsibilities: parseLines(d.responsibilitiesText),
          requirements: parseLines(d.requirementsText),
          sortOrder: Number(d.sortOrder) || 0,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error ?? 'Failed to save')
      }
      const updated = await res.json()
      setJobs((prev) => prev.map((x) => (x.id === j.id ? toRow(updated) : x)).sort(bySort))
      setDrafts((prev) => { const next = { ...prev }; delete next[j.id]; return next })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save')
    } finally {
      setSaving(null)
    }
  }

  async function togglePublished(j: JobRow) {
    setToggling(j.id)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${j.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !j.published }),
      })
      if (!res.ok) throw new Error('Failed')
      setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, published: !j.published } : x)))
    } catch {
      setError('Failed to update visibility')
    } finally {
      setToggling(null)
    }
  }

  async function remove(j: JobRow) {
    if (!confirm(`Delete "${j.title}"? This cannot be undone.`)) return
    setDeleting(j.id)
    setError(null)
    try {
      const res = await fetch(`/api/jobs/${j.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed')
      setJobs((prev) => prev.filter((x) => x.id !== j.id))
      setDrafts((prev) => { const next = { ...prev }; delete next[j.id]; return next })
    } catch {
      setError('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  async function create() {
    setCreateError(null)
    if (!newDraft.title.trim() || !newDraft.slug.trim()) {
      setCreateError('Title and slug are required.')
      return
    }
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newDraft.slug.trim(),
          title: newDraft.title.trim(),
          department: newDraft.department.trim() || 'Team',
          type: newDraft.type.trim() || 'Full-time',
          location: newDraft.location.trim() || 'Toorak, VIC',
          salary: newDraft.salary.trim() || 'Competitive',
          summary: newDraft.summary.trim() || 'A new role at Ember.',
          responsibilities: parseLines(newDraft.responsibilitiesText),
          requirements: parseLines(newDraft.requirementsText),
          sortOrder: Number(newDraft.sortOrder) || jobs.length,
          published: true,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCreateError(body?.error ?? 'Failed to create')
        return
      }
      setJobs((prev) => [...prev, toRow(body)].sort(bySort))
      setNewDraft(empty)
      setCreating(false)
    } catch {
      setCreateError('Network error')
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="px-4 py-3 rounded-lg border border-red-500/25 bg-red-500/10 text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* New job */}
      <div className="rounded-2xl border border-gold/15 bg-smoke/30 p-4 sm:p-5">
        {!creating ? (
          <button
            onClick={() => setCreating(true)}
            className="w-full flex items-center justify-between gap-3 text-left group"
          >
            <span>
              <span className="block text-[10px] tracking-[0.3em] uppercase text-gold/55 mb-1">New role</span>
              <span className="block font-serif italic text-cream/90 text-lg">Add a position</span>
            </span>
            <span className="w-9 h-9 rounded-full border border-gold/35 flex items-center justify-center text-gold text-lg group-hover:bg-gold/15 transition-colors">+</span>
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gold/55 mb-1">New role</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={newDraft.title} onChange={(e) => setNewDraft({ ...newDraft, title: e.target.value })} placeholder="Head Chef de Cuisine" />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input className={inputClass} value={newDraft.slug} onChange={(e) => setNewDraft({ ...newDraft, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="head-chef" />
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <input className={inputClass} value={newDraft.department} onChange={(e) => setNewDraft({ ...newDraft, department: e.target.value })} placeholder="Kitchen" />
              </div>
              <div>
                <label className={labelClass}>Type</label>
                <input className={inputClass} value={newDraft.type} onChange={(e) => setNewDraft({ ...newDraft, type: e.target.value })} placeholder="Full-time" />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input className={inputClass} value={newDraft.location} onChange={(e) => setNewDraft({ ...newDraft, location: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Salary</label>
                <input className={inputClass} value={newDraft.salary} onChange={(e) => setNewDraft({ ...newDraft, salary: e.target.value })} placeholder="$95k – $110k + tips" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Summary</label>
              <textarea rows={2} className={`${inputClass} resize-none`} value={newDraft.summary} onChange={(e) => setNewDraft({ ...newDraft, summary: e.target.value })} placeholder="One or two sentences." />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Responsibilities — one per line</label>
                <textarea rows={5} className={`${inputClass} resize-y`} value={newDraft.responsibilitiesText} onChange={(e) => setNewDraft({ ...newDraft, responsibilitiesText: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Requirements — one per line</label>
                <textarea rows={5} className={`${inputClass} resize-y`} value={newDraft.requirementsText} onChange={(e) => setNewDraft({ ...newDraft, requirementsText: e.target.value })} />
              </div>
            </div>
            {createError && <p className="text-[11px] text-red-300/85">{createError}</p>}
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => { setCreating(false); setNewDraft(empty); setCreateError(null) }} className="px-4 py-2 rounded-full border border-cream/15 text-cream/55 text-[10px] tracking-[0.2em] uppercase hover:text-cream/85 transition-colors">Cancel</button>
              <button onClick={create} className="px-5 py-2 rounded-full bg-gold/20 border border-gold/55 text-gold text-[10px] tracking-[0.2em] uppercase hover:bg-gold/30 transition-colors">Create</button>
            </div>
          </div>
        )}
      </div>

      {/* Job list */}
      {jobs.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gold/15 p-8 text-center text-cream/40 text-sm">
          No jobs yet. Add the first role above.
        </div>
      )}

      {jobs.map((j) => {
        const d = getDraft(j)
        const isOpen = expanded === j.id
        const dirty = draftIsDirty(d, j)
        return (
          <article key={j.id} className={`rounded-2xl border transition-colors ${j.published ? 'border-gold/15 bg-surface/30' : 'border-cream/10 bg-smoke/20 opacity-70'}`}>
            <button type="button" onClick={() => setExpanded(isOpen ? null : j.id)} className="w-full text-left px-5 py-4 flex items-center justify-between gap-4" aria-expanded={isOpen}>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[9px] tracking-[0.25em] uppercase text-gold/55">{j.department}</span>
                  <span className="text-cream/20 text-[9px]">·</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-cream/40">{j.type}</span>
                  <span className="text-cream/20 text-[9px]">·</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-cream/40">{j.salary}</span>
                </div>
                <h3 className="font-serif italic text-cream text-lg sm:text-xl leading-tight truncate">{j.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {dirty && <span className="text-[9px] tracking-[0.2em] uppercase text-gold">Unsaved</span>}
                <span className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border ${j.published ? 'border-emerald-500/30 text-emerald-400' : 'border-cream/20 text-cream/40'}`}>
                  {j.published ? 'Live' : 'Hidden'}
                </span>
                <span className={`w-7 h-7 rounded-full border border-gold/25 flex items-center justify-center text-gold text-sm transition-transform ${isOpen ? 'rotate-45' : ''}`} aria-hidden>+</span>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-gold/10 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} value={d.title} onChange={(e) => setField(j.id, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input className={inputClass} value={d.slug} onChange={(e) => setField(j.id, 'slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} />
                  </div>
                  <div>
                    <label className={labelClass}>Department</label>
                    <input className={inputClass} value={d.department} onChange={(e) => setField(j.id, 'department', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Type</label>
                    <input className={inputClass} value={d.type} onChange={(e) => setField(j.id, 'type', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input className={inputClass} value={d.location} onChange={(e) => setField(j.id, 'location', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Salary</label>
                    <input className={inputClass} value={d.salary} onChange={(e) => setField(j.id, 'salary', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Summary</label>
                  <textarea rows={2} className={`${inputClass} resize-none`} value={d.summary} onChange={(e) => setField(j.id, 'summary', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Responsibilities — one per line</label>
                    <textarea rows={6} className={`${inputClass} resize-y`} value={d.responsibilitiesText} onChange={(e) => setField(j.id, 'responsibilitiesText', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Requirements — one per line</label>
                    <textarea rows={6} className={`${inputClass} resize-y`} value={d.requirementsText} onChange={(e) => setField(j.id, 'requirementsText', e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className={labelClass}>Sort order</label>
                    <input type="number" className={inputClass} value={d.sortOrder} onChange={(e) => setField(j.id, 'sortOrder', Number(e.target.value))} />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-gold/8">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => togglePublished(j)}
                      disabled={toggling === j.id}
                      className={`text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 ${
                        j.published
                          ? 'border-cream/20 text-cream/55 hover:bg-cream/10'
                          : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                    >
                      {j.published ? 'Hide' : 'Publish'}
                    </button>
                    <button
                      onClick={() => remove(j)}
                      disabled={deleting === j.id}
                      className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border border-red-500/25 text-red-400/85 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      {deleting === j.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {dirty && (
                      <button
                        onClick={() => setDrafts((prev) => { const next = { ...prev }; delete next[j.id]; return next })}
                        className="text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-full border border-cream/15 text-cream/45 hover:text-cream/85 transition-colors"
                      >
                        Revert
                      </button>
                    )}
                    <button
                      onClick={() => save(j)}
                      disabled={!dirty || saving === j.id}
                      className="text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 rounded-full bg-gold/20 border border-gold/55 text-gold hover:bg-gold/30 transition-colors disabled:opacity-30 disabled:hover:bg-gold/20"
                    >
                      {saving === j.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

function bySort(a: JobRow, b: JobRow) {
  return a.sortOrder - b.sortOrder
}

type JobApiResponse = {
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

function toRow(j: JobApiResponse): JobRow {
  return {
    id: j.id,
    slug: j.slug,
    title: j.title,
    department: j.department,
    type: j.type,
    location: j.location,
    salary: j.salary,
    summary: j.summary,
    responsibilities: j.responsibilities,
    requirements: j.requirements,
    published: j.published,
    sortOrder: j.sortOrder,
  }
}
