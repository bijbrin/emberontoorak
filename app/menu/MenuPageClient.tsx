'use client'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { BookingProvider } from '../contexts/BookingContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BookingPanel from '../components/BookingPanel'

export interface MenuItemData {
  name: string
  description: string
  price: string
  highlight?: boolean
}

export interface MenuSectionData {
  id: string
  label: string
  subtitle: string
  note?: string
  items: MenuItemData[]
}

export interface WineItemData {
  name: string
  varietal: string
  region: string
  year: string
  price: string
  highlight?: boolean
}

export interface CellarSectionData {
  id: string
  label: string
  items: WineItemData[]
}

const sectionIds = ['small-plates', 'fire', 'ocean', 'sides', 'desserts', 'cellar']

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function MenuSection({ section }: { section: MenuSectionData }) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.05 })

  return (
    <section ref={ref} id={section.id} className="scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8 sm:mb-10"
      >
        <p className="text-gold text-[10px] tracking-[0.45em] uppercase mb-2">{section.subtitle}</p>
        <h2 className="font-serif italic text-cream leading-none" style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}>
          {section.label}
        </h2>
        {section.note && (
          <p className="text-cream/35 text-xs sm:text-sm leading-relaxed mt-3 max-w-xl">{section.note}</p>
        )}
      </motion.div>

      <div className="space-y-0 border-t border-gold/15">
        {section.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
            className={`group flex items-baseline justify-between gap-6 py-5 sm:py-6 border-b border-gold/10 transition-colors duration-300 hover:bg-gold/2 px-1 -mx-1 rounded-sm ${
              item.highlight ? 'relative' : ''
            }`}
          >
            {item.highlight && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-10 bg-linear-to-b from-gold/0 via-gold/60 to-gold/0" />
            )}
            <div className="min-w-0 flex-1 pl-1">
              <p className={`font-serif italic leading-snug transition-colors duration-300 ${
                item.highlight ? 'text-gold text-lg sm:text-xl' : 'text-cream/90 text-base sm:text-lg group-hover:text-cream'
              }`}>
                {item.name}
              </p>
              <p className="text-cream/35 text-[11px] sm:text-xs mt-1 leading-relaxed">{item.description}</p>
            </div>
            <span className={`font-serif italic shrink-0 text-base sm:text-lg ${
              item.highlight ? 'text-gold' : 'text-cream/55 group-hover:text-cream/80'
            } transition-colors duration-300`}>
              ${item.price}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function WineSection({ section }: { section: CellarSectionData }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div ref={ref} className="mb-12 sm:mb-16">
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-5 sm:mb-6"
      >
        {section.label}
      </motion.p>

      <div className="space-y-0 border-t border-gold/10">
        {section.items.map((wine, i) => (
          <motion.div
            key={wine.name}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`group flex items-center gap-4 py-4 sm:py-5 border-b border-gold/8 hover:bg-gold/2.5 transition-colors duration-300 px-1 -mx-1 rounded-sm ${
              wine.highlight ? 'relative' : ''
            }`}
          >
            {wine.highlight && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-linear-to-b from-gold/0 via-gold/50 to-gold/0" />
            )}
            <div className="flex-1 min-w-0 pl-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-serif italic leading-snug ${
                  wine.highlight ? 'text-gold text-base sm:text-lg' : 'text-cream/85 text-sm sm:text-base group-hover:text-cream transition-colors duration-300'
                }`}>
                  {wine.name}
                </span>
                {wine.highlight && (
                  <span className="text-[9px] tracking-[0.3em] uppercase text-gold/60 bg-gold/10 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-cream/30 text-[10px] sm:text-[11px] mt-0.5">
                {wine.varietal} · {wine.region}
              </p>
            </div>
            <span className="text-cream/25 text-[11px] sm:text-xs tracking-wider shrink-0">{wine.year}</span>
            <span className={`font-serif italic text-sm sm:text-base shrink-0 ${
              wine.highlight ? 'text-gold' : 'text-cream/50 group-hover:text-cream/75 transition-colors duration-300'
            }`}>
              ${wine.price}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  menuSections: MenuSectionData[]
  cellarSections: CellarSectionData[]
}

export default function MenuPageClient({ menuSections, cellarSections }: Props) {
  const [activeSection, setActiveSection] = useState('small-plates')
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const all = [...sectionIds]
      for (const id of [...all].reverse()) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 140) {
            setActiveSection(id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 110
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const navItems = [
    { id: 'small-plates', label: 'Small Plates' },
    { id: 'fire', label: 'Fire & Beef' },
    { id: 'ocean', label: 'The Ocean' },
    { id: 'sides', label: 'Sides' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'cellar', label: 'The Cellar' },
  ]

  return (
    <BookingProvider>
      <Header />
      <BookingPanel />

      <main className="min-h-screen bg-obsidian">
        {/* Hero */}
        <div ref={heroRef} className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-24 section-x">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-100 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(254,119,67,0.07) 0%, rgba(68,125,155,0.04) 40%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-125 h-75 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(254,119,67,0.04) 0%, transparent 60%)' }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/50 hover:text-gold transition-colors mb-8 group">
                <span className="block w-5 h-px bg-gold/40 group-hover:w-8 group-hover:bg-gold transition-all duration-400" />
                Ember on Toorak
              </Link>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }} className="text-gold text-[10px] sm:text-xs tracking-[0.45em] uppercase mb-4">
              The Menu
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }} className="font-serif italic text-cream leading-[0.92]" style={{ fontSize: 'clamp(52px, 9vw, 108px)' }}>
              Fire, Ocean
              <br />
              <span className="text-gold/80">&amp; The Cellar</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="text-cream/35 text-sm sm:text-base mt-6 max-w-md leading-relaxed">
              Seasonal ingredients, ancient fire techniques, and over 400 cellar labels — chosen by our Head Sommelier.
            </motion.p>
          </div>
        </div>

        {/* Sticky section nav */}
        <div className="sticky top-15 sm:top-17 z-40 bg-obsidian/90 backdrop-blur-lg border-b border-gold/10">
          <div className="max-w-7xl mx-auto section-x">
            <div className="flex gap-0 overflow-x-auto scrollbar-hide -mx-5 px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`shrink-0 px-4 sm:px-5 py-4 text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-all duration-300 border-b-2 ${
                    activeSection === item.id ? 'text-gold border-gold' : 'text-cream/35 border-transparent hover:text-cream/65 hover:border-gold/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu content */}
        <div className="max-w-7xl mx-auto section-x py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="space-y-16 sm:space-y-20">
              {menuSections.map((section) => (
                <MenuSection key={section.id} section={section} />
              ))}
            </div>
          </div>
        </div>

        {/* Cellar divider */}
        <div className="relative overflow-hidden bg-smoke border-y border-gold/10">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(254,119,67,0.05) 0%, transparent 70%)' }} />
          <div className="relative z-10 max-w-7xl mx-auto section-x py-16 sm:py-20" id="cellar">
            <FadeIn>
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.45em] uppercase mb-4">The Cellar</p>
              <h2 className="font-serif italic text-cream leading-[0.95] mb-5" style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}>
                Wine &amp; Spirits
              </h2>
              <p className="text-cream/35 text-sm sm:text-base max-w-lg leading-relaxed">
                Over 400 labels curated by our Head Sommelier — spanning the great regions of Australia and beyond.
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Wine list */}
        <div className="bg-smoke">
          <div className="max-w-7xl mx-auto section-x py-16 sm:py-20">
            <div className="max-w-3xl">
              {cellarSections.map((section) => (
                <WineSection key={section.id} section={section} />
              ))}
              <FadeIn delay={0.1}>
                <div className="mt-10 pt-8 border-t border-gold/10">
                  <p className="text-cream/30 text-xs leading-relaxed max-w-sm">
                    Full wine list available on request. Corkage available Sunday–Thursday at $45 per bottle. Please speak with our sommelier for cellar reserve selections.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-obsidian border-t border-gold/10 py-16 sm:py-20 section-x text-center">
          <FadeIn>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">Ready?</p>
            <h2 className="font-serif italic text-cream mb-6" style={{ fontSize: 'clamp(28px, 4vw, 48px)' }}>
              Join us at the table
            </h2>
            <Link href="/reservations" className="btn-shimmer inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gold text-obsidian text-[11px] tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_rgba(254,119,67,0.4)] transition-shadow duration-500">
              Reserve a Table
            </Link>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </BookingProvider>
  )
}
