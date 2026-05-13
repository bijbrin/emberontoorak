'use client'
import { useState } from 'react'

interface MenuItemRow {
  id: string
  name: string
  description: string
  price: string
  highlight: boolean
  available: boolean
  sortOrder: number
}

interface MenuSectionRow {
  id: string
  slug: string
  label: string
  subtitle: string
  items: MenuItemRow[]
}

type Draft = { name: string; description: string; price: string }

export default function MenuManager({ sections: initial }: { sections: MenuSectionRow[] }) {
  const [sections, setSections] = useState(initial)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  function getDraft(item: MenuItemRow): Draft {
    return drafts[item.id] ?? { name: item.name, description: item.description, price: item.price }
  }

  function setField(id: string, field: keyof Draft, value: string) {
    setDrafts((prev) => ({ ...prev, [id]: { ...getDraftById(id), [field]: value } }))
  }

  function getDraftById(id: string): Draft {
    const item = sections.flatMap((s) => s.items).find((i) => i.id === id)!
    return drafts[id] ?? { name: item.name, description: item.description, price: item.price }
  }

  function isDirty(item: MenuItemRow): boolean {
    const d = drafts[item.id]
    if (!d) return false
    return d.name !== item.name || d.description !== item.description || d.price !== item.price
  }

  async function save(item: MenuItemRow) {
    const d = drafts[item.id]
    if (!d) return
    setSaving(item.id)
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, description: d.description, price: d.price }),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, name: updated.name, description: updated.description, price: updated.price } : i,
          ),
        })),
      )
      setDrafts((prev) => { const next = { ...prev }; delete next[item.id]; return next })
    } catch {
      alert('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  async function toggleAvailability(item: MenuItemRow) {
    setToggling(item.id)
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !item.available }),
      })
      if (!res.ok) throw new Error('Failed')
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) => (i.id === item.id ? { ...i, available: !item.available } : i)),
        })),
      )
    } catch {
      alert('Failed to update')
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <div key={section.id}>
          <div className="mb-3">
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold/55">{section.subtitle}</p>
            <h3 className="font-serif italic text-cream text-xl">{section.label}</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gold/10">
                  {['Name', 'Description', 'Price (AUD)', 'Visible', ''].map((h) => (
                    <th key={h} className="text-left text-[9px] tracking-[0.25em] uppercase text-cream/30 pb-3 pr-4 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.items.map((item) => {
                  const d = getDraft(item)
                  const dirty = isDirty(item)
                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-gold/6 transition-colors ${item.available ? '' : 'opacity-45'}`}
                    >
                      {/* Name */}
                      <td className="py-2 pr-3 w-40">
                        <input
                          value={d.name}
                          onChange={(e) => setField(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent border border-transparent hover:border-gold/15 focus:border-gold/35 focus:bg-smoke/40 rounded-md px-2 py-1 text-cream/80 font-serif italic outline-none transition-all placeholder:text-cream/20"
                        />
                      </td>

                      {/* Description */}
                      <td className="py-2 pr-3">
                        <textarea
                          value={d.description}
                          onChange={(e) => setField(item.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full bg-transparent border border-transparent hover:border-gold/15 focus:border-gold/35 focus:bg-smoke/40 rounded-md px-2 py-1 text-cream/50 text-xs outline-none transition-all resize-none leading-relaxed"
                        />
                      </td>

                      {/* Price */}
                      <td className="py-2 pr-3 w-28">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-cream/30 text-xs">$</span>
                          <input
                            value={d.price}
                            onChange={(e) => setField(item.id, 'price', e.target.value)}
                            className="w-full bg-transparent border border-transparent hover:border-gold/15 focus:border-gold/35 focus:bg-smoke/40 rounded-md pl-5 pr-2 py-1 text-cream/70 font-serif italic outline-none transition-all"
                          />
                        </div>
                      </td>

                      {/* Visible toggle */}
                      <td className="py-2 pr-3 whitespace-nowrap">
                        <button
                          onClick={() => toggleAvailability(item)}
                          disabled={toggling === item.id}
                          className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full border transition-all disabled:opacity-40 ${
                            item.available
                              ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                              : 'border-red-500/20 text-red-400/60 hover:bg-red-500/10'
                          }`}
                        >
                          {item.available ? 'Visible' : 'Hidden'}
                        </button>
                      </td>

                      {/* Save */}
                      <td className="py-2 whitespace-nowrap">
                        {dirty && (
                          <button
                            onClick={() => save(item)}
                            disabled={saving === item.id}
                            className="px-3 py-1 rounded-lg bg-gold/15 border border-gold/35 text-gold text-[9px] tracking-[0.15em] uppercase hover:bg-gold/25 transition-colors disabled:opacity-40"
                          >
                            {saving === item.id ? 'Saving…' : 'Save'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
