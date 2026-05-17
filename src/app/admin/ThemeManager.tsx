'use client'
import { useState } from 'react'
import type { ThemeSettings } from '@/lib/theme'

export const THEMES = [
  {
    id: 'rose-pine-moon',
    name: 'Rose Pine Moon',
    subtitle: 'Warm Purple Dusk',
    obsidian: '#232136',
    smoke: '#2a273f',
    surface: '#393552',
    steel: '#6e6a86',
    accent: '#eb6f92',
  },
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    subtitle: 'Deep Blue-Tinted Dark',
    obsidian: '#1e1e2e',
    smoke: '#181825',
    surface: '#313244',
    steel: '#6c7086',
    accent: '#fab387',
  },
  {
    id: 'tokyo-night',
    name: 'Tokyo Night',
    subtitle: 'Navy-Indigo Cityscape',
    obsidian: '#1a1b26',
    smoke: '#16161e',
    surface: '#24283b',
    steel: '#565f89',
    accent: '#ff9e64',
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    subtitle: 'Retro Earthy Warmth',
    obsidian: '#1d2021',
    smoke: '#282828',
    surface: '#3c3836',
    steel: '#928374',
    accent: '#d79921',
  },
  {
    id: 'nord',
    name: 'Nord',
    subtitle: 'Arctic Calm Blues',
    obsidian: '#2e3440',
    smoke: '#3b4252',
    surface: '#434c5e',
    steel: '#4c566a',
    accent: '#88c0d0',
  },
  {
    id: 'dracula',
    name: 'Dracula',
    subtitle: 'High-Contrast Violet',
    obsidian: '#282a36',
    smoke: '#1e1f29',
    surface: '#44475a',
    steel: '#6272a4',
    accent: '#ff79c6',
  },
  {
    id: 'flexoki-dark',
    name: 'Flexoki Dark',
    subtitle: 'Ink-on-Paper Warmth',
    obsidian: '#100F0F',
    smoke: '#1C1B1A',
    surface: '#282726',
    steel: '#6F6E69',
    accent: '#da702c',
  },
  {
    id: 'flexoki-dawn',
    name: 'Flexoki Dawn',
    subtitle: 'Warm Paper Light',
    obsidian: '#FFFCF0',
    smoke: '#F2F0E5',
    surface: '#E6E4D9',
    steel: '#6F6E69',
    accent: '#BC5215',
  },
] as const

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
      <span className={`inline-block w-3 ${swatchH} rounded-sm`} style={{ background: t.obsidian }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm`} style={{ background: t.smoke }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm`} style={{ background: t.surface }} />
      <span className={`inline-block w-3 ${swatchH} rounded-sm`} style={{ background: t.accent }} />
    </span>
  )
}

export default function ThemeManager({ initial }: { initial: ThemeSettings }) {
  const [settings, setSettings] = useState<ThemeSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const activeThemeId = resolveActiveThemeId(settings) ?? 'rose-pine-moon'
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
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/15 bg-surface/30">
        <span className="text-[9px] tracking-[0.3em] uppercase text-gold/40">Active now</span>
        {activeTheme ? (
          <>
            <ThemeSwatch themeId={activeTheme.id} size="sm" />
            <span className="font-serif italic text-cream/80 text-sm">{activeTheme.name}</span>
            <span className="text-cream/25 text-[11px]">— {activeTheme.subtitle}</span>
          </>
        ) : (
          <span className="text-cream/30 text-sm">Default</span>
        )}
      </div>

      {/* Mode toggle */}
      <div>
        <p className="text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-3">Mode</p>
        <div className="flex gap-2">
          {(['auto', 'manual'] as const).map(m => (
            <button
              key={m}
              onClick={() => setSettings(s => ({ ...s, mode: m }))}
              className={`px-5 py-2.5 rounded-lg border text-sm transition-all duration-150 ${
                settings.mode === m
                  ? 'bg-gold/15 border-gold/35 text-cream font-medium'
                  : 'border-cream/10 text-cream/40 hover:text-cream/65 hover:border-cream/20'
              }`}
            >
              {m === 'auto' ? 'Auto Rotate' : 'Manual'}
            </button>
          ))}
        </div>
        <p className="text-[10px] text-cream/25 mt-2">
          {settings.mode === 'auto'
            ? 'Theme changes automatically each day of the week.'
            : 'A single theme is applied permanently until you change it.'}
        </p>
      </div>

      {/* Auto schedule */}
      {settings.mode === 'auto' && (
        <div>
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-4">Weekly schedule</p>
          <div className="space-y-2">
            {DAYS.map(({ index, label }) => {
              const selectedId = settings.schedule?.[index] ?? 'rose-pine-moon'
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-24 text-[10px] tracking-[0.15em] uppercase text-cream/35 shrink-0">
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
                            ? 'border-gold/40 bg-gold/10 text-cream'
                            : 'border-cream/8 text-cream/30 hover:text-cream/55 hover:border-cream/20'
                        }`}
                      >
                        <ThemeSwatch themeId={t.id} size="sm" />
                        <span className={selectedId === t.id ? 'text-cream/80' : ''}>
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
          <p className="text-[9px] tracking-[0.35em] uppercase text-gold/40 mb-4">Select theme</p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(t => {
              const isActive = settings.manual === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSettings(s => ({ ...s, manual: t.id }))}
                  className={`relative text-left p-4 rounded-xl border transition-all duration-150 group ${
                    isActive
                      ? 'border-gold/40 bg-surface/60'
                      : 'border-cream/8 hover:border-cream/20 bg-surface/20'
                  }`}
                >
                  {/* Mini canvas preview */}
                  <div className="flex gap-1 mb-3">
                    <div
                      className="flex-1 h-10 rounded-md flex items-end p-1.5 gap-1"
                      style={{ background: t.obsidian }}
                    >
                      <div className="h-1 w-5 rounded-sm" style={{ background: t.smoke }} />
                      <div className="h-1 w-8 rounded-sm" style={{ background: t.surface }} />
                    </div>
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{ background: t.accent + '22', border: `1px solid ${t.accent}55` }}
                    >
                      <div className="w-4 h-4 rounded-full" style={{ background: t.accent }} />
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-serif italic text-sm ${isActive ? 'text-cream' : 'text-cream/55 group-hover:text-cream/75'}`}
                    >
                      {t.name}
                    </span>
                    {isActive && (
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold/60">Active</span>
                    )}
                  </div>
                  <p className="text-[10px] text-cream/25 mt-0.5">{t.subtitle}</p>

                  {/* Color strip */}
                  <div className="flex gap-1 mt-3">
                    {[t.obsidian, t.smoke, t.surface, t.steel, t.accent].map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full"
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
          className="btn-shimmer px-6 py-2.5 rounded-lg bg-gold/20 border border-gold/35 text-cream text-sm font-medium transition-all duration-150 hover:bg-gold/30 disabled:opacity-50"
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
