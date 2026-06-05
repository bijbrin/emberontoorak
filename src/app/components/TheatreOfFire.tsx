'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

const filmStrip = [
  {
    label: 'The Coal',
    description: '1,200° hardwood coals. No gas. No shortcuts.',
    gradient:
      'radial-gradient(ellipse at 40% 60%, color-mix(in srgb, var(--color-accent) 75%, transparent) 0%, var(--color-surface) 35%, var(--color-background) 70%, var(--color-background) 100%)',
  },
  {
    label: 'The Sear',
    description: 'Maillard at its most violent. Crust formed in seconds.',
    gradient:
      'radial-gradient(ellipse at 60% 40%, color-mix(in srgb, var(--color-accent) 55%, transparent) 0%, var(--color-smoke) 40%, var(--color-background) 70%, var(--color-background) 100%)',
  },
  {
    label: 'The Rest',
    description: '28 days of dry-age. 4 minutes of patience.',
    gradient:
      'radial-gradient(ellipse at 50% 70%, var(--color-muted) 0%, var(--color-surface) 40%, var(--color-background) 70%, var(--color-background) 100%)',
  },
];

const stats = [
  { value: '28', unit: 'Days', label: 'Dry-Aged' },
  { value: '1,200°', unit: '', label: 'Coals' },
  { value: '100%', unit: '', label: 'Grass-Fed' },
];

export default function TheatreOfFire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    section.addEventListener('mousemove', onMouseMove);
    return () => section.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative bg-smoke overflow-hidden section-y section-x"
    >
      {/* Spotlight cursor — desktop only */}
      <div
        className="hidden lg:block pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, color-mix(in srgb, var(--color-accent) 6%, transparent), transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-24 items-start">
        {/* Left: Manifesto */}
        <div className="lg:sticky lg:top-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-accent text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-5 sm:mb-6"
          >
            Our Philosophy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-foreground leading-[0.95] mb-6 sm:mb-8"
            style={{ fontSize: 'clamp(40px, 7vw, 80px)' }}
          >
            Theatre <br className="sm:hidden" />of Fire
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-12 sm:w-16 h-px bg-accent mb-5 sm:mb-6 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-foreground/70 text-base sm:text-lg leading-relaxed mb-5 sm:mb-6"
            style={{ letterSpacing: '-0.01em' }}
          >
            We believe fire is not a tool. It is a collaborator.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-foreground/45 text-sm sm:text-base leading-relaxed mb-10 max-w-lg"
            style={{ letterSpacing: '-0.01em' }}
          >
            The 1,200° coals do not simply cook—they transform. Every cut of beef
            that enters our kitchen is changed by its encounter with flame:
            caramelised, charred, elevated. This is the ritual we perform, evening
            after evening, in the heart of Toorak.
          </motion.p>

          {/* Stats badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap gap-2 sm:gap-3"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: [
                    '0 0 15px color-mix(in srgb, var(--color-accent) 12%, transparent)',
                    '0 0 30px color-mix(in srgb, var(--color-accent) 30%, transparent)',
                    '0 0 15px color-mix(in srgb, var(--color-accent) 12%, transparent)',
                  ],
                }}
                transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity }}
                className="flex items-baseline gap-1.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-accent/20 bg-background/60"
              >
                <span className="font-serif text-accent text-lg sm:text-xl">{s.value}</span>
                {s.unit && <span className="text-accent text-xs sm:text-sm">{s.unit}</span>}
                <span className="text-foreground/50 text-[10px] sm:text-xs tracking-[0.2em] uppercase ml-1">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: Film strip */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {filmStrip.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
              whileHover={{ scale: 1.02 }}
              className="group relative rounded-2xl overflow-hidden cursor-default inner-glow inner-glow-hover transition-all duration-500"
              style={{
                height: i === 0 ? 'clamp(260px, 40vw, 380px)' : 'clamp(200px, 30vw, 260px)',
              }}
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{ background: item.gradient }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 right-0">
                <p className="text-accent text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-2">
                  0{i + 1}
                </p>
                <h3 className="font-serif text-foreground text-xl sm:text-2xl mb-1">
                  {item.label}
                </h3>
                <p className="text-foreground/55 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
