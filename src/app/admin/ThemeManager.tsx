'use client'
import { useState } from 'react'
import type { ThemeSettings } from '@/lib/theme'

export interface ThemeDef {
  id: string
  name: string
  subtitle: string
  type: 'dark' | 'light'
  bg: string
  fg: string
  muted: string
  accent: string
  accent2: string
  surface: string
  surfaceBorder: string
  nav: string
  smoke: string
}

export const THEMES: ThemeDef[] = [
  {
    id: 'ember',
    name: 'Ember',
    subtitle: 'Warm Gold on Charcoal',
    type: 'dark',
    bg: '#0A0A0A',
    fg: '#FFFFFF',
    muted: '#8A8A8A',
    accent: '#D4A853',
    accent2: '#C17F4E',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceBorder: 'rgba(255, 255, 255, 0.06)',
    nav: 'rgba(10, 10, 10, 0.9)',
    smoke: '#111111',
  },
  {
    id: 'noir',
    name: 'Noir',
    subtitle: 'Pure Monochrome',
    type: 'dark',
    bg: '#000000',
    fg: '#FFFFFF',
    muted: '#666666',
    accent: '#FFFFFF',
    accent2: '#AAAAAA',
    surface: 'rgba(255, 255, 255, 0.02)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    nav: 'rgba(0, 0, 0, 0.95)',
    smoke: '#0A0A0A',
  },
  {
    id: 'wine',
    name: 'Wine',
    subtitle: 'Velvet Rose',
    type: 'dark',
    bg: '#1A0A0E',
    fg: '#F2E8E8',
    muted: '#9B6B7B',
    accent: '#C97B8B',
    accent2: '#A8546A',
    surface: 'rgba(201, 123, 139, 0.04)',
    surfaceBorder: 'rgba(201, 123, 139, 0.1)',
    nav: 'rgba(26, 10, 14, 0.92)',
    smoke: '#241016',
  },
  {
    id: 'copper',
    name: 'Copper',
    subtitle: 'Burnt Amber Dark',
    type: 'dark',
    bg: '#14100C',
    fg: '#F0E8E0',
    muted: '#8B7D6B',
    accent: '#B87333',
    accent2: '#8B5A2B',
    surface: 'rgba(184, 115, 51, 0.04)',
    surfaceBorder: 'rgba(184, 115, 51, 0.1)',
    nav: 'rgba(20, 16, 12, 0.92)',
    smoke: '#1E1812',
  },
  {
    id: 'truffle',
    name: 'Truffle',
    subtitle: 'Champagne on Black',
    type: 'dark',
    bg: '#0C0A08',
    fg: '#F5F0E8',
    muted: '#8C8276',
    accent: '#CBB78F',
    accent2: '#A8946E',
    surface: 'rgba(203, 183, 143, 0.04)',
    surfaceBorder: 'rgba(203, 183, 143, 0.1)',
    nav: 'rgba(12, 10, 8, 0.92)',
    smoke: '#14110C',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    subtitle: 'Cocoa & Caramel',
    type: 'dark',
    bg: '#120D0A',
    fg: '#EFE4D8',
    muted: '#8A7A68',
    accent: '#C9A06A',
    accent2: '#9E7B4A',
    surface: 'rgba(201, 160, 106, 0.04)',
    surfaceBorder: 'rgba(201, 160, 106, 0.1)',
    nav: 'rgba(18, 13, 10, 0.92)',
    smoke: '#1C150F',
  },
  {
    id: 'aubergine',
    name: 'Aubergine',
    subtitle: 'Deep Plum & Mauve',
    type: 'dark',
    bg: '#140A18',
    fg: '#EFE6F2',
    muted: '#8A7592',
    accent: '#B98AC9',
    accent2: '#946AA6',
    surface: 'rgba(185, 138, 201, 0.04)',
    surfaceBorder: 'rgba(185, 138, 201, 0.1)',
    nav: 'rgba(20, 10, 24, 0.92)',
    smoke: '#1E1024',
  },
  {
    id: 'slate',
    name: 'Slate',
    subtitle: 'Steel Blue & Brass',
    type: 'dark',
    bg: '#0D1117',
    fg: '#E6EAF0',
    muted: '#7A8696',
    accent: '#A8895E',
    accent2: '#846A46',
    surface: 'rgba(168, 137, 94, 0.04)',
    surfaceBorder: 'rgba(168, 137, 94, 0.1)',
    nav: 'rgba(13, 17, 23, 0.92)',
    smoke: '#141A22',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    subtitle: 'Deep Malachite',
    type: 'dark',
    bg: '#08140F',
    fg: '#E4F0E9',
    muted: '#6F8A7E',
    accent: '#4FA77E',
    accent2: '#3A7D5E',
    surface: 'rgba(79, 167, 126, 0.04)',
    surfaceBorder: 'rgba(79, 167, 126, 0.1)',
    nav: 'rgba(8, 20, 15, 0.92)',
    smoke: '#0E2018',
  },
  {
    id: 'sapphire',
    name: 'Sapphire',
    subtitle: 'Navy & Champagne',
    type: 'dark',
    bg: '#0A0E1C',
    fg: '#E6E8F2',
    muted: '#707A96',
    accent: '#C7A95C',
    accent2: '#9C8344',
    surface: 'rgba(199, 169, 92, 0.04)',
    surfaceBorder: 'rgba(199, 169, 92, 0.1)',
    nav: 'rgba(10, 14, 28, 0.92)',
    smoke: '#10162A',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    subtitle: 'Oxblood & Brass',
    type: 'dark',
    bg: '#160A0A',
    fg: '#F0E4E0',
    muted: '#8C7068',
    accent: '#C0894A',
    accent2: '#97672F',
    surface: 'rgba(192, 137, 74, 0.04)',
    surfaceBorder: 'rgba(192, 137, 74, 0.1)',
    nav: 'rgba(22, 10, 10, 0.92)',
    smoke: '#20100E',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    subtitle: 'Cool Silver Monochrome',
    type: 'dark',
    bg: '#0B0D10',
    fg: '#EDF0F3',
    muted: '#828A94',
    accent: '#B9C2CC',
    accent2: '#8A949E',
    surface: 'rgba(185, 194, 204, 0.03)',
    surfaceBorder: 'rgba(185, 194, 204, 0.09)',
    nav: 'rgba(11, 13, 16, 0.94)',
    smoke: '#12151A',
  },
]

function resolveActiveThemeId(settings: ThemeSettings): string | undefined {
  if (settings.mode === 'manual') {
    return settings.manual || undefined
  }
  const day = new Date().toLocaleString('en-US', { timeZone: 'Australia/Melbourne' })
  const d = String(new Date(day).getDay())
  return settings.schedule?.[d] || undefined
}

const DAYS = [
  { index: '1', label: 'Monday' },
  { index: '2', label: 'Tuesday' },
  { index: '3', label: 'Wednesday' },
  { index: '4', label: 'Thursday' },
  { index: '5', label: 'Friday' },
  { index: '6', label: 'Saturday' },
  { index: '0', label: 'Sunday' },
]

function ThemeSwatch({ themeId, size = 'md' }: { themeId: string; size?: 'sm' | 'md' }) {
  const t = THEMES.find(x => x.id === themeId)
  if (!t) return null
  const swatchH = size === 'sm' ? 'h-3' : 'h-4'
  return (
    <span className="inline-flex gap-0.5 items-center">
      <span className={`inline-block w-3 ${swatchH} rounded-sm border border-foreground/10`} style={{ background: t.bg }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm border border-foreground/10`} style={{ background: t.smoke }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm border border-foreground/10`} style={{ background: t.surface }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm border border-foreground/10`} style={{ background: t.accent }} />
    </span>
  )
}

export default function ThemeManager({ initial }: { initial: ThemeSettings }) {
  const [settings, setSettings] = useState<ThemeSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const activeThemeId = resolveActiveThemeId(settings) ?? 'ember'
  const activeTheme = THEMES.find(t => t.id === activeThemeId)

  async function save() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      const nextId = resolveActiveThemeId(settings)
      if (nextId) {
        document.documentElement.setAttribute('data-theme', nextId)
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Could not save — try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Current theme pill */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-accent/15 bg-surface/30">
        <span className="text-[9px] tracking-[0.3em] uppercase text-accent/60">Active now</span>
        {activeTheme ? (
          <>
            <ThemeSwatch themeId={activeTheme.id} size="sm" />
            <span className="font-serif text-foreground/80 text-sm">{activeTheme.name}</span>
            <span className="text-muted text-[11px]">— {activeTheme.subtitle}</span>
          </>
        ) : (
          <span className="text-muted text-sm">Default</span>
        )}
      </div>

      {/* Mode toggle */}
      <div>
        <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-3">Mode</p>
        <div className="flex gap-2">
          {(['auto', 'manual'] as const).map(m => (
            <button
              key={m}
              onClick={() => setSettings(s => ({ ...s, mode: m }))}
              className={`px-5 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
                settings.mode === m
                  ? 'bg-accent/15 border-accent/35 text-foreground font-medium'
                  : 'border-foreground/10 text-foreground/40 hover:text-foreground/65 hover:border-foreground/20'
              }`}
            >
              {m === 'auto' ? 'Auto Rotate' : 'Manual'}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted mt-2">
          {settings.mode === 'auto'
            ? 'Theme changes automatically each day of the week.'
            : 'A single theme is applied permanently until you change it.'}
        </p>
      </div>

      {/* Auto schedule */}
      {settings.mode === 'auto' && (
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-4">Weekly schedule</p>
          <div className="space-y-4 sm:space-y-2">
            {DAYS.map(({ index, label }) => {
              const selectedId = settings.schedule?.[index] ?? 'ember'
              return (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="sm:w-24 text-[10px] tracking-[0.15em] uppercase text-muted sm:shrink-0">
                    {label}
                  </span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        title={t.name}
                        onClick={() =>
                          setSettings(s => ({
                            ...s,
                            schedule: { ...s.schedule, [index]: t.id },
                          }))
                        }
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] transition-all duration-100 ${
                          selectedId === t.id
                            ? 'border-accent/40 bg-accent/10 text-foreground'
                            : 'border-foreground/8 text-foreground/50 hover:text-foreground/75 hover:border-foreground/25'
                        }`}
                      >
                        <ThemeSwatch themeId={t.id} size="sm" />
                        <span className={selectedId === t.id ? 'text-foreground/80' : ''}>
                          {t.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Manual picker */}
      {settings.mode === 'manual' && (
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-accent/60 mb-4">Select theme</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map(t => {
              const isActive = settings.manual === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSettings(s => ({ ...s, manual: t.id }))}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-150 group ${
                    isActive
                      ? 'border-accent/40 bg-surface/60'
                      : 'border-foreground/8 hover:border-foreground/20 bg-surface/20'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-serif text-sm ${isActive ? 'text-foreground' : 'text-foreground/55 group-hover:text-foreground/75'}`}
                    >
                      {t.name}
                    </span>
                    {isActive && (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-accent/60">Active</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">{t.subtitle}</p>

                  {/* Color strip */}
                  <div className="flex gap-1 mt-3">
                    {[t.bg, t.smoke, t.surface, t.muted, t.accent].map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full border border-foreground/8"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Save row */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={save}
          disabled={saving}
          className="btn-shimmer px-6 py-2.5 rounded-lg bg-accent/20 border border-accent/35 text-foreground text-sm font-medium transition-all duration-150 hover:bg-accent/30 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <span className="text-[11px] text-emerald-400/80 tracking-wide">Saved — theme revalidated</span>
        )}
        {error && <span className="text-[11px] text-red-400/80">{error}</span>}
      </div>
    </div>
  )
}