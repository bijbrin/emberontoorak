'use client'
import { useMemo, useState } from 'react'

interface MenuItemRow {
  id: string
  name: string
  description: string
  price: string
  priceNote: string
  highlight: boolean
  available: boolean
  sortOrder: number
}

interface MenuSectionRow {
  id: string
  slug: string
  label: string
  subtitle: string
  menuType: 'A_LA_CARTE' | 'LUNCH' | 'DRINKS'
  parentSlug: string | null
  items: MenuItemRow[]
}

type Draft = { name: string; description: string; price: string }

const TABS: { id: 'A_LA_CARTE' | 'LUNCH' | 'DRINKS'; label: string }[] = [
  { id: 'A_LA_CARTE', label: 'À La Carte' },
  { id: 'LUNCH', label: 'Lunch' },
  { id: 'DRINKS', label: 'Drinks' },
]

export default function MenuManager({ sections: initial }: { sections: MenuSectionRow[] }) {
  const [sections, setSections] = useState(initial)
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'A_LA_CARTE' | 'LUNCH' | 'DRINKS'>('A_LA_CARTE')

  const visibleSections = useMemo(
    () => sections.filter((s) => s.menuType === activeTab),
    [sections, activeTab],
  )

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
      const rawPrice = d.price.trim().replace(/,/g, '')
      const priceValue = rawPrice === '' ? null : Number(rawPrice)
      if (priceValue !== null && (Number.isNaN(priceValue) || priceValue <= 0)) {
        alert('Price must be a positive number, or leave blank for "no fixed price".')
        setSaving(null)
        return
      }
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: d.name, description: d.description, price: priceValue }),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setSections((prev) =>
        prev.map((s) => ({
          ...s,
          items: s.items.map((i) =>
            i.id === item.id ? { ...i, name: updated.name, description: updated.description, price: updated.price ?? '' } : i,
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
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex gap-0 border-b border-accent/15 -mx-2 px-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 px-5 py-3 text-[10px] tracking-[0.3em] uppercase transition-all duration-300 border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-accent border-accent'
                : 'text-foreground/40 border-transparent hover:text-foreground/70 hover:border-accent/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {visibleSections.length === 0 && (
        <p className="text-foreground/40 text-sm">No sections in this menu yet.</p>
      )}

      {visibleSections.map((section) => (
        <div key={section.id}>
          <div className="mb-3">
            <p className="text-[10px] tracking-[0.35em] uppercase text-accent/55">
              {section.subtitle}
              {section.parentSlug && <span className="text-foreground/30"> · sub-group of {section.parentSlug}</span>}
            </p>
            <h3 className="font-serif text-foreground text-xl">{section.label}</h3>
          </div>

          {section.items.length === 0 ? (
            <p className="text-foreground/30 text-xs italic">Header section — items live in sub-groups below.</p>
          ) : (
            <>
              {/* Mobile: stacked cards */}
              <div className="md:hidden space-y-3">
                {section.items.map((item) => {
                  const d = getDraft(item)
                  const dirty = isDirty(item)
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl border bg-smoke/30 p-3 transition-colors ${
                        item.available ? 'border-accent/10' : 'border-foreground/10 opacity-60'
                      }`}
                    >
                      <label className="block text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Name</label>
                      <input
                        value={d.name}
                        onChange={(e) => setField(item.id, 'name', e.target.value)}
                        className="w-full bg-background/40 border border-accent/10 focus:border-accent/40 focus:bg-smoke/60 rounded-md px-2.5 py-2 text-foreground/85 font-serif text-sm outline-none transition-all"
                      />

                      <label className="block text-[9px] tracking-[0.25em] uppercase text-foreground/40 mt-3 mb-1">Description</label>
                      <textarea
                        value={d.description}
                        onChange={(e) => setField(item.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full bg-background/40 border border-accent/10 focus:border-accent/40 focus:bg-smoke/60 rounded-md px-2.5 py-2 text-foreground/65 text-xs outline-none transition-all resize-y leading-relaxed"
                      />

                      <div className="flex items-end gap-3 mt-3">
                        <div className="flex-1 min-w-0">
                          <label className="block text-[9px] tracking-[0.25em] uppercase text-foreground/40 mb-1">Price (AUD)</label>
                          <div className="relative">
                            {d.price && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-foreground/35 text-xs">$</span>}
                            <input
                              value={d.price}
                              onChange={(e) => setField(item.id, 'price', e.target.value)}
                              placeholder="set-price"
                              inputMode="decimal"
                              className={`w-full bg-background/40 border border-accent/10 focus:border-accent/40 focus:bg-smoke/60 rounded-md ${d.price ? 'pl-5' : 'pl-2.5'} pr-2 py-2 text-foreground/80 font-serif text-sm outline-none transition-all placeholder:text-foreground/25 placeholder:not-italic`}
                            />
                          </div>
                          {item.priceNote && (
                            <p className="text-[9px] tracking-wider uppercase text-foreground/30 mt-1 pl-1">{item.priceNote}</p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleAvailability(item)}
                          disabled={toggling === item.id}
                          className={`shrink-0 text-[10px] tracking-[0.15em] uppercase px-3 py-2 rounded-full border transition-all disabled:opacity-40 ${
                            item.available
                              ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                              : 'border-red-500/20 text-red-400/60 hover:bg-red-500/10'
                          }`}
                        >
                          {item.available ? 'Visible' : 'Hidden'}
                        </button>
                      </div>

                      {dirty && (
                        <button
                          onClick={() => save(item)}
                          disabled={saving === item.id}
                          className="mt-3 w-full px-4 py-2 rounded-lg bg-accent/15 border border-accent/40 text-accent text-[11px] tracking-[0.2em] uppercase hover:bg-accent/25 transition-colors disabled:opacity-40"
                        >
                          {saving === item.id ? 'Saving…' : 'Save changes'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop: table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-accent/10">
                      {['Name', 'Description', 'Price (AUD)', 'Visible', ''].map((h) => (
                        <th key={h} className="text-left text-[9px] tracking-[0.25em] uppercase text-foreground/30 pb-3 pr-4 font-normal whitespace-nowrap">
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
                          className={`border-b border-accent/6 transition-colors ${item.available ? '' : 'opacity-45'}`}
                        >
                          <td className="py-2 pr-3 w-40">
                            <input
                              value={d.name}
                              onChange={(e) => setField(item.id, 'name', e.target.value)}
                              className="w-full bg-transparent border border-transparent hover:border-accent/15 focus:border-accent/35 focus:bg-smoke/40 rounded-md px-2 py-1 text-foreground/80 font-serif outline-none transition-all placeholder:text-foreground/20"
                            />
                          </td>

                          <td className="py-2 pr-3">
                            <textarea
                              value={d.description}
                              onChange={(e) => setField(item.id, 'description', e.target.value)}
                              rows={2}
                              className="w-full bg-transparent border border-transparent hover:border-accent/15 focus:border-accent/35 focus:bg-smoke/40 rounded-md px-2 py-1 text-foreground/50 text-xs outline-none transition-all resize-none leading-relaxed"
                            />
                          </td>

                          <td className="py-2 pr-3 w-32">
                            <div className="relative">
                              {d.price && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-foreground/30 text-xs">$</span>}
                              <input
                                value={d.price}
                                onChange={(e) => setField(item.id, 'price', e.target.value)}
                                placeholder="set-price"
                                className={`w-full bg-transparent border border-transparent hover:border-accent/15 focus:border-accent/35 focus:bg-smoke/40 rounded-md ${d.price ? 'pl-5' : 'pl-2'} pr-2 py-1 text-foreground/70 font-serif outline-none transition-all placeholder:text-foreground/20 placeholder:not-italic`}
                              />
                            </div>
                            {item.priceNote && (
                              <p className="text-[9px] tracking-wider uppercase text-foreground/30 mt-1 pl-2">{item.priceNote}</p>
                            )}
                          </td>

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

                          <td className="py-2 whitespace-nowrap">
                            {dirty && (
                              <button
                                onClick={() => save(item)}
                                disabled={saving === item.id}
                                className="px-3 py-1 rounded-lg bg-accent/15 border border-accent/35 text-accent text-[9px] tracking-[0.15em] uppercase hover:bg-accent/25 transition-colors disabled:opacity-40"
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
            </>
          )}
        </div>
      ))}
    </div>
  )
}
