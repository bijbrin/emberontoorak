'use client'
import Link from 'next/link'
import { useMemo, useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import BookingPanel from '../components/BookingPanel'
import type { MenuSectionData, MenuItemData } from '@/types/menu'
import type { MenuType } from '@/types/admin'

type TabKey = MenuType

const TABS: { id: TabKey; label: string; tagline: string }[] = [
  { id: 'A_LA_CARTE', label: 'À La Carte', tagline: 'Fire, Ocean & Earth' },
  { id: 'LUNCH', label: 'Lunch', tagline: 'Mon–Fri · Set Menu' },
  { id: 'DRINKS', label: 'Drinks', tagline: 'Cocktails · Cellar · Spirits' },
]

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function PriceLabel({ item, size = 'base' }: { item: MenuItemData; size?: 'sm' | 'base' | 'lg' }) {
  if (!item.price) return null
  const sizeCls = size === 'lg' ? 'text-lg sm:text-xl' : size === 'sm' ? 'text-sm' : 'text-base sm:text-lg'
  return (
    <span className={`font-serif italic shrink-0 ${sizeCls} flex items-baseline gap-1.5 ${
      item.highlight ? 'text-gold' : 'text-cream/60 group-hover:text-cream/85'
    } transition-colors duration-300`}>
      <span>${item.price}</span>
      {item.priceNote && (
        <span className="text-[9px] tracking-[0.15em] uppercase not-italic text-cream/40">{item.priceNote}</span>
      )}
    </span>
  )
}

function ItemRow({ item, idx, inView, dense = false }: { item: MenuItemData; idx: number; inView: boolean; dense?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.45, delay: 0.1 + idx * 0.04 }}
      className={`group relative flex items-baseline justify-between gap-6 ${dense ? 'py-3 sm:py-3.5' : 'py-5 sm:py-6'} border-b border-gold/10 px-1 -mx-1 rounded-sm transition-colors duration-300 hover:bg-gold/[0.025]`}
    >
      {item.highlight && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-10 bg-linear-to-b from-gold/0 via-gold/60 to-gold/0" />
      )}
      <div className="min-w-0 flex-1 pl-1">
        <p className={`font-serif italic leading-snug transition-colors duration-300 ${
          item.highlight
            ? 'text-gold text-lg sm:text-xl'
            : `text-cream/90 ${dense ? 'text-base' : 'text-base sm:text-lg'} group-hover:text-cream`
        }`}>
          {item.name}
        </p>
        {item.description && (
          <p className="text-cream/40 text-[11px] sm:text-xs mt-1 leading-relaxed">{item.description}</p>
        )}
      </div>
      <PriceLabel item={item} size={dense ? 'sm' : 'base'} />
    </motion.div>
  )
}

function SectionBlock({ section, children }: { section: MenuSectionData; children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section ref={ref} id={section.id} className="scroll-mt-32">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 sm:mb-8"
      >
        {section.subtitle && (
          <p className="text-gold text-[10px] tracking-[0.45em] uppercase mb-2">{section.subtitle}</p>
        )}
        <h2 className="font-serif italic text-cream leading-none" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          {section.label}
        </h2>
        {section.note && (
          <p className="text-cream/40 text-xs sm:text-sm leading-relaxed mt-3 max-w-xl">{section.note}</p>
        )}
      </motion.div>
      {section.items.length > 0 && (
        <div className="space-y-0 border-t border-gold/15">
          {section.items.map((item, i) => (
            <ItemRow key={`${section.id}-${item.name}`} item={item} idx={i} inView={inView} />
          ))}
        </div>
      )}
      {children}
    </section>
  )
}

function SubGroup({ section }: { section: MenuSectionData }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05 })
  return (
    <div ref={ref} className="mt-10 first:mt-8">
      <motion.div
        initial={{ opacity: 0, x: -6 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-4"
      >
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold/65 mb-1">{section.subtitle || section.label}</p>
        {section.subtitle && section.subtitle !== section.label && (
          <h3 className="font-serif italic text-cream/90 text-xl sm:text-2xl leading-tight">{section.label}</h3>
        )}
      </motion.div>
      <div className="space-y-0 border-t border-gold/10">
        {section.items.map((item, i) => (
          <ItemRow key={`${section.id}-${item.name}`} item={item} idx={i} inView={inView} dense />
        ))}
      </div>
    </div>
  )
}

function LunchSetMenu({ section }: { section: MenuSectionData }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <section id={section.id} ref={ref} className="scroll-mt-32 mb-16 sm:mb-20">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <p className="text-gold text-[10px] tracking-[0.45em] uppercase mb-2">{section.subtitle}</p>
        <h2 className="font-serif italic text-cream leading-none" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>{section.label}</h2>
        {section.note && (
          <p className="text-cream/45 text-xs sm:text-sm leading-relaxed mt-3 max-w-lg">{section.note}</p>
        )}
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {section.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.12 + i * 0.08 }}
            className={`relative rounded-2xl p-6 sm:p-7 transition-all duration-500 ${
              item.highlight
                ? 'bg-gradient-to-br from-gold/[0.07] to-transparent border border-gold/30 shadow-[0_0_40px_-15px_color-mix(in_srgb,var(--color-ember)_35%,transparent)]'
                : 'bg-smoke/40 border border-gold/10 hover:border-gold/25'
            }`}
          >
            {item.highlight && (
              <span className="absolute top-3 right-3 text-[9px] tracking-[0.3em] uppercase text-gold/80 bg-gold/10 px-2 py-0.5 rounded-full">
                Best Value
              </span>
            )}
            <p className="text-[10px] tracking-[0.35em] uppercase text-cream/40 mb-3">Set</p>
            <p className="font-serif italic text-cream text-lg sm:text-xl leading-snug mb-4">{item.name}</p>
            <p className={`font-serif italic ${item.highlight ? 'text-gold' : 'text-cream/85'}`} style={{ fontSize: 'clamp(32px, 4vw, 42px)' }}>
              ${item.price}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function MenuPageClient({ sections }: { sections: MenuSectionData[] }) {
  const [tab, setTab] = useState<TabKey>('A_LA_CARTE')
  const [activeSection, setActiveSection] = useState<string>('')

  const grouped = useMemo(() => {
    const byType: Record<TabKey, MenuSectionData[]> = { A_LA_CARTE: [], LUNCH: [], DRINKS: [] }
    sections.forEach((s) => byType[s.menuType].push(s))
    return byType
  }, [sections])

  const tabSections = grouped[tab]
  const rootSections = useMemo(() => tabSections.filter((s) => !s.parentSlug), [tabSections])
  const childrenBy = useMemo(() => {
    const m = new Map<string, MenuSectionData[]>()
    tabSections.forEach((s) => {
      if (s.parentSlug) {
        if (!m.has(s.parentSlug)) m.set(s.parentSlug, [])
        m.get(s.parentSlug)!.push(s)
      }
    })
    return m
  }, [tabSections])

  // Sticky nav items = root sections of current tab (and the special set-pricing card for lunch)
  const navItems = rootSections.map((s) => ({ id: s.id, label: s.label }))

  useEffect(() => {
    const ids = navItems.map((n) => n.id)
    const handle = () => {
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id)
        if (el) {
          const r = el.getBoundingClientRect()
          if (r.top <= 150) {
            setActiveSection(id)
            return
          }
        }
      }
      setActiveSection(ids[0] ?? '')
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, tabSections.length])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 130
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <>
      <BookingPanel />

      <main className="min-h-screen bg-obsidian">
        {/* Compact intro */}
        <div className="pt-28 sm:pt-32 pb-8 sm:pb-10 section-x">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/55 hover:text-gold transition-colors mb-6 group">
                <span className="block w-5 h-px bg-gold/40 group-hover:w-8 group-hover:bg-gold transition-all duration-400" />
                Ember on Toorak
              </Link>
            </FadeIn>
            <FadeIn delay={0.05}>
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.45em] uppercase mb-3">The Menus</p>
              <h1 className="font-serif italic text-cream leading-[0.95]" style={{ fontSize: 'clamp(40px, 7vw, 82px)' }}>
                Choose your <span className="text-gold/85">table</span>
              </h1>
              <p className="text-cream/45 text-sm sm:text-base mt-4 max-w-md leading-relaxed">
                Three menus, one fire. Switch between à la carte, lunch, and our drinks list below.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="sticky top-15 sm:top-17 z-40 bg-obsidian/95 backdrop-blur-xl border-b border-gold/10">
          <div className="max-w-7xl mx-auto section-x">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
              {TABS.map((t) => {
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => { setTab(t.id); window.scrollTo({ top: window.scrollY }) }}
                    className="relative shrink-0 px-5 sm:px-7 py-4 sm:py-5 text-left group"
                  >
                    <p className={`text-[11px] sm:text-xs tracking-[0.3em] uppercase transition-colors duration-300 ${active ? 'text-gold' : 'text-cream/45 group-hover:text-cream/80'}`}>
                      {t.label}
                    </p>
                    <p className={`text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mt-1 transition-colors duration-300 ${active ? 'text-cream/55' : 'text-cream/25'}`}>
                      {t.tagline}
                    </p>
                    {active && (
                      <motion.span
                        layoutId="tabUnderline"
                        className="absolute left-3 right-3 bottom-0 h-0.5 bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
            {/* Sub-nav for current tab */}
            {navItems.length > 0 && (
              <div className="flex gap-0 overflow-x-auto scrollbar-hide border-t border-gold/[0.07] -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
                {navItems.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => scrollTo(n.id)}
                    className={`shrink-0 px-3 sm:px-4 py-3 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 border-b-2 -mb-px ${
                      activeSection === n.id
                        ? 'text-gold border-gold'
                        : 'text-cream/35 border-transparent hover:text-cream/65 hover:border-gold/30'
                    }`}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Menu content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-7xl mx-auto section-x py-14 sm:py-20"
          >
            <div className="max-w-3xl">
              {tab === 'LUNCH' && rootSections[0] && rootSections[0].id === 'lunch-set-pricing' ? (
                <>
                  <LunchSetMenu section={rootSections[0]} />
                  <div className="space-y-16 sm:space-y-20">
                    {rootSections.slice(1).map((section) => (
                      <SectionBlock key={section.id} section={section} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-16 sm:space-y-20">
                  {rootSections.map((section) => {
                    const children = childrenBy.get(section.id) ?? []
                    return (
                      <SectionBlock key={section.id} section={section}>
                        {children.length > 0 && (
                          <div className="mt-4">
                            {children.map((child) => (
                              <SubGroup key={child.id} section={child} />
                            ))}
                          </div>
                        )}
                      </SectionBlock>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <div className="bg-obsidian border-t border-gold/10 py-16 sm:py-20 section-x text-center">
          <FadeIn>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">Ready?</p>
            <h2 className="font-serif italic text-cream mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Join us at the table
            </h2>
            <Link href="/reservations" className="btn-shimmer inline-flex items-center gap-3 px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-gold text-obsidian text-[11px] tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-ember)_40%,transparent)] transition-shadow duration-500">
              Reserve a Table
            </Link>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  )
}
