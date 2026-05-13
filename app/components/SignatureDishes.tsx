'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steaks = [
  { name: 'Fullblood Wagyu Scotch Fillet', detail: 'MBS 9+ · Darling Downs, QLD', price: '185' },
  { name: '45-Day Dry-Aged T-Bone', detail: 'Rangers Valley Black Angus · 1.2kg', price: '165' },
  { name: 'Rangers Valley Sirloin', detail: 'Grass-Fed · Cape Grim, TAS', price: '98' },
];

const rawBar = [
  { name: 'Cloudy Bay Diamond Clams', detail: 'Finger lime, cultured cream', price: '38' },
  { name: 'Hiramasa Kingfish Crudo', detail: 'Dashi gel, nori, yuzu kosho', price: '42' },
];

const cellarPours = [
  'Penfolds Grange 2018',
  'Bass Phillip Pinot Noir',
  'Henschke Hill of Grace',
  'Leeuwin Art Series Chard',
  'Yangarra Grenache 2021',
];

export default function SignatureDishes() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section id="menu" ref={ref} className="bg-obsidian section-y section-x">
      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 sm:mb-16 lg:mb-20 max-w-2xl"
        >
          <p className="text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 sm:mb-5">
            The Menu
          </p>
          <h2
            className="font-serif italic text-cream leading-[0.95] mb-5"
            style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
          >
            Signature Dishes
          </h2>
          <p className="text-cream/40 text-sm sm:text-base leading-relaxed">
            From the coals, the cellar, and the ocean — three rooms of the Theatre.
          </p>
        </motion.div>

        {/* Responsive bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-auto">
          {/* Premium Steaks — full width on mobile, 2x2 on md+ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group relative rounded-2xl overflow-hidden inner-glow inner-glow-hover transition-all duration-500 cursor-default md:col-span-2 md:row-span-2 min-h-[480px] md:min-h-[560px]"
            style={{
              background:
                'radial-gradient(ellipse at 35% 50%, rgba(254,119,67,0.6) 0%, #2A4A5E 40%, #1E3347 70%, #273F4F 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
            <div
              className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]"
              style={{
                background: 'radial-gradient(ellipse at 40% 45%, rgba(254,119,67,0.08) 0%, transparent 60%)',
              }}
            />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12">
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3">
                Premium Cuts
              </p>
              <h3 className="font-serif italic text-cream text-3xl sm:text-4xl md:text-5xl mb-5 sm:mb-7 leading-[0.95]">
                Fire & Beef
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {steaks.map((steak, i) => (
                  <motion.div
                    key={steak.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    className="flex items-baseline justify-between gap-3 border-t border-gold/10 pt-3 group/item"
                  >
                    <div className="min-w-0">
                      <p className="text-cream text-sm sm:text-base font-medium group-hover/item:text-gold transition-colors leading-snug">
                        {steak.name}
                      </p>
                      <p className="text-cream/40 text-[11px] sm:text-xs mt-0.5 leading-snug">
                        {steak.detail}
                      </p>
                    </div>
                    <span className="text-gold font-serif italic text-base sm:text-lg shrink-0">
                      ${steak.price}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="absolute top-6 right-6 sm:top-8 sm:right-8 w-32 h-32 sm:w-40 sm:h-40 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle, rgba(254,119,67,0.6) 0%, transparent 70%)',
              }}
            />
          </motion.div>

          {/* Raw Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative rounded-2xl overflow-hidden inner-glow inner-glow-hover transition-all duration-500 cursor-default min-h-[280px] md:min-h-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 30%, #2D6680 0%, #1E4A62 50%, #152E40 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian/80" />
            <div className="relative h-full p-6 sm:p-7 flex flex-col">
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3">
                The Ocean
              </p>
              <h3 className="font-serif italic text-cream text-2xl sm:text-3xl mb-5 leading-tight">
                Raw Bar
              </h3>
              <div className="space-y-3 mt-auto">
                {rawBar.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-baseline gap-3 border-t border-gold/10 pt-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-cream/80 text-xs sm:text-sm leading-snug">{item.name}</p>
                      <p className="text-cream/35 text-[10px] sm:text-[11px] mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                    <span className="text-gold/70 text-xs font-serif italic shrink-0">
                      ${item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* The Cellar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="group relative rounded-2xl overflow-hidden inner-glow inner-glow-hover transition-all duration-500 cursor-default min-h-[280px] md:min-h-0"
            style={{
              background: 'radial-gradient(ellipse at 50% 70%, #2A4255 0%, #1E3040 50%, #273F4F 100%)',
            }}
          >
            <div className="relative h-full p-6 sm:p-7 flex flex-col">
              <p className="text-gold text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-3">
                Wine
              </p>
              <h3 className="font-serif italic text-cream text-2xl sm:text-3xl mb-5 leading-tight">
                The Cellar
              </h3>
              <div className="flex-1 overflow-hidden relative min-h-[120px]">
                <motion.div
                  animate={{ y: [0, -100, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  className="space-y-3 absolute inset-x-0 top-0"
                >
                  {[...cellarPours, ...cellarPours].map((pour, i) => (
                    <p
                      key={i}
                      className="text-cream/55 text-xs sm:text-sm border-b border-gold/8 pb-2.5"
                    >
                      {pour}
                    </p>
                  ))}
                </motion.div>
                <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-obsidian/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-obsidian/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* View full menu link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 text-[11px] sm:text-xs tracking-[0.3em] uppercase text-gold/70 hover:text-gold transition-colors group"
          >
            View Full Menu & Cellar
            <span className="block w-8 h-px bg-gold/40 group-hover:w-16 group-hover:bg-gold transition-all duration-500" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
