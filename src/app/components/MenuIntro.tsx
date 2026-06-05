'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const pillars = [
  { word: 'Fire', detail: '1,200° ironbark coals' },
  { word: 'Ocean', detail: 'From the raw bar' },
  { word: 'The Cellar', detail: '400+ labels, hand-picked' },
]

export default function MenuIntro() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <section ref={ref} className="relative bg-background section-y section-x overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, color-mix(in srgb, var(--color-muted) 4%, transparent) 40%, transparent 70%)' }}
      />
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-accent text-[10px] sm:text-xs tracking-[0.45em] uppercase mb-4"
        >
          Ember on Toorak — The Menu
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-foreground leading-[0.92] max-w-4xl"
          style={{ fontSize: 'clamp(40px, 7.5vw, 96px)' }}
        >
          Fire, Ocean
          <br />
          <span className="text-accent/85">&amp; The Cellar</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-foreground/45 text-sm sm:text-base mt-6 max-w-xl leading-relaxed"
        >
          Seasonal ingredients, ancient fire techniques, and over 400 cellar labels — chosen by our Head Sommelier.
        </motion.p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mt-10 sm:mt-14 max-w-4xl">
          {pillars.map((p, i) => (
            <motion.div
              key={p.word}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-2xl border border-accent/15 bg-smoke/30 px-5 py-6 sm:px-6 sm:py-7 overflow-hidden transition-all duration-500 hover:border-accent/40 hover:bg-smoke/50"
            >
              <span
                className="absolute -top-px left-6 right-6 h-px bg-linear-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <p className="text-[10px] tracking-[0.4em] uppercase text-accent/55 mb-3">0{i + 1}</p>
              <h3 className="font-serif text-foreground text-2xl sm:text-3xl leading-tight">{p.word}</h3>
              <p className="text-foreground/40 text-xs mt-2">{p.detail}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-accent/15 border border-accent/35 text-accent text-[10px] sm:text-[11px] tracking-[0.3em] uppercase hover:bg-accent/25 transition-all duration-400"
          >
            View Full Menu
            <span className="block w-5 h-px bg-accent/60 group-hover:w-10 transition-all" />
          </Link>
          <Link
            href="/menu#lunch-set-pricing"
            className="inline-flex items-center gap-3 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-foreground/55 hover:text-foreground transition-colors group"
          >
            <span className="text-accent/70">·</span> Lunch Set Menu from $39
            <span className="block w-5 h-px bg-foreground/30 group-hover:w-10 group-hover:bg-accent/60 transition-all duration-400" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
