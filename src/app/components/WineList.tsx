'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const wines = [
  {
    name: 'Penfolds Grange',
    year: '2018',
    region: 'Barossa Valley, SA',
    varietal: 'Shiraz',
    price: '1,200',
    note: 'The Australian icon. Plum, dark chocolate, and cedar.',
    featured: false,
  },
  {
    name: "Tonight's Pour",
    year: '2022',
    region: 'Piedmont, Italy',
    varietal: "Nebbiolo d'Alba",
    price: '28 / glass',
    note: 'Roses, tar, and crushed stone. Ethereally light.',
    featured: true,
  },
  {
    name: 'Bass Phillip Reserve',
    year: '2020',
    region: 'Gippsland, VIC',
    varietal: 'Pinot Noir',
    price: '480',
    note: 'Impossibly elegant. Forest floor and Morello cherry.',
    featured: false,
  },
  {
    name: 'Henschke Hill of Grace',
    year: '2019',
    region: 'Eden Valley, SA',
    varietal: 'Shiraz',
    price: '900',
    note: 'A century of vines. Restrained power and complexity.',
    featured: false,
  },
  {
    name: 'Leeuwin Art Series',
    year: '2021',
    region: 'Margaret River, WA',
    varietal: 'Chardonnay',
    price: '320',
    note: 'Nectarine, toasted hazelnut, and vivid acidity.',
    featured: false,
  },
  {
    name: "d'Arenberg Dead Arm",
    year: '2019',
    region: 'McLaren Vale, SA',
    varietal: 'Shiraz',
    price: '195',
    note: 'Dense and brooding. Dark fruit and licorice.',
    featured: false,
  },
];

export default function WineList() {
  const ref = useRef<HTMLDivElement>(null);
  const constraintRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="cellar" ref={ref} className="bg-smoke overflow-hidden section-y">
      <div className="max-w-7xl mx-auto section-x mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div className="max-w-2xl">
            <p className="text-accent text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-4 sm:mb-5">
              The Cellar
            </p>
            <h2
              className="font-serif text-foreground leading-[0.95]"
              style={{ fontSize: 'clamp(36px, 6vw, 64px)' }}
            >
              Wine & Spirits
            </h2>
          </div>
          <p className="text-foreground/45 text-xs sm:text-sm max-w-xs leading-relaxed">
            Drag to explore our curated cellar of over 400 labels, chosen by our Head Sommelier.
          </p>
        </motion.div>
      </div>

      {/* Drag carousel */}
      <motion.div
        ref={constraintRef}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="overflow-hidden"
      >
        <motion.div
          drag="x"
          dragConstraints={constraintRef}
          dragElastic={0.1}
          className="flex gap-3 sm:gap-4 px-5 sm:px-8 lg:px-12 cursor-grab active:cursor-grabbing pb-4"
          style={{ width: 'max-content' }}
        >
          {wines.map((wine, i) => (
            <motion.div
              key={wine.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl overflow-hidden flex-shrink-0 inner-glow transition-all duration-500 ${
                wine.featured
                  ? 'border border-accent/50 bg-surface'
                  : 'border border-accent/10 bg-background hover:border-accent/30'
              }`}
              style={{ width: 'min(78vw, 290px)', minHeight: '380px' }}
            >
              {wine.featured && (
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              )}

              <div className="p-7 sm:p-8 h-full flex flex-col">
                {wine.featured && (
                  <motion.span
                    animate={{
                      boxShadow: [
                        '0 0 8px color-mix(in srgb, var(--color-accent) 20%, transparent)',
                        '0 0 22px color-mix(in srgb, var(--color-accent) 55%, transparent)',
                        '0 0 8px color-mix(in srgb, var(--color-accent) 20%, transparent)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block mb-5 text-[9px] tracking-[0.35em] uppercase text-background bg-accent px-3 py-1 rounded-full self-start"
                  >
                    Tonight&apos;s Pour
                  </motion.span>
                )}

                <div className="flex-1">
                  <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-accent/70 mb-2">
                    {wine.varietal}
                  </p>
                  <h3
                    className={`font-serif leading-tight mb-1 ${
                      wine.featured ? 'text-accent text-2xl sm:text-3xl' : 'text-foreground text-xl sm:text-2xl'
                    }`}
                  >
                    {wine.name}
                  </h3>
                  <p className="text-foreground/35 text-xs sm:text-sm">{wine.year}</p>
                </div>

                <div className="mt-6 pt-5 border-t border-accent/10">
                  <p className="text-foreground/45 text-xs leading-relaxed mb-4">{wine.note}</p>
                  <p className="text-foreground/35 text-[10px] tracking-[0.2em] uppercase mb-1.5">
                    {wine.region}
                  </p>
                  <p
                    className={`font-serif text-xl ${
                      wine.featured ? 'text-accent' : 'text-foreground/75'
                    }`}
                  >
                    ${wine.price}
                  </p>
                </div>
              </div>

              {wine.featured && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 70%)',
                  }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Drag hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="text-center text-[10px] sm:text-xs tracking-[0.25em] uppercase text-foreground/25 mt-6 sm:mt-8 px-6"
      >
        ← Drag to explore →
      </motion.p>
    </section>
  );
}
