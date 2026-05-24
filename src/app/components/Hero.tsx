'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

export default function Hero() {
  const { open } = useBookingStore();
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Background drifts up as you scroll out
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  // Content rises slightly faster — creates depth
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  // Overlay darkens as hero leaves view
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.6], [0.3, 0.7]);
  // Hero content fades as it scrolls away
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={heroRef} className='relative min-h-svh flex items-center justify-center overflow-hidden'>
      {/* Looping fire video background with Lenis-driven parallax */}
      <motion.div
        className='absolute inset-0 will-change-transform'
        style={{ y: bgY, scale: 1.15 }}
      >
        <video
          ref={videoRef}
          src='/fire.mov'
          autoPlay
          loop
          muted
          playsInline
          preload='auto'
          aria-hidden='true'
          className='absolute inset-0 w-full h-full object-cover object-center'
          onCanPlay={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
        />
      </motion.div>

      {/* Layered overlays */}
      <motion.div className='absolute inset-0 bg-black/30' style={{ opacity: overlayOpacity }} />
      <div className='absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-obsidian' />
      <div
        className='absolute inset-0 pointer-events-none'
        style={{
          background: 'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Ember glow particles */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden'>
        <div
          className='absolute rounded-full animate-drift1'
          style={{
            width: '65vw',
            height: '65vw',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-ember) 18%, transparent) 0%, transparent 65%)',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className='absolute rounded-full animate-drift3'
          style={{
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, color-mix(in srgb, var(--color-steel) 15%, transparent) 0%, transparent 70%)',
            top: '0%',
            left: '0%',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Content with its own parallax + fade-out on scroll */}
      <motion.div
        className='relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center select-none pt-16 sm:pt-20 pb-4'
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className='text-[8px] sm:text-[9px] tracking-[0.45em] uppercase text-gold/90 mb-1'
        >
          Est. Toorak · Melbourne
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className='uppercase leading-none'
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(56px, 12vw, 150px)',
              color: 'var(--color-ember)',
              textShadow: '0 4px 60px color-mix(in srgb, var(--color-ember) 35%, transparent), 0 8px 80px rgba(0,0,0,0.6)',
              letterSpacing: '0.04em',
            }}
          >
            Ember
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className='my-4 sm:my-5 mx-auto h-px w-24 sm:w-32 bg-linear-to-r from-transparent via-gold to-transparent'
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className='font-serif italic text-cream/95 text-xl sm:text-2xl tracking-wide'
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }}
        >
          Theatre of Fire
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className='text-cream/65 text-xs sm:text-sm tracking-[0.08em] mt-3 max-w-md mx-auto leading-relaxed'
        >
          The ritual of fire. The architecture of flavour.
          <br className='hidden sm:inline' />
          In the heart of Toorak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className='mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto'
        >
          <motion.button
            onClick={open}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className='btn-shimmer px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gold text-obsidian text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-ember)_55%,transparent)] transition-shadow duration-500'
          >
            Reserve a Table
          </motion.button>
          <a
            href='#menu'
            className='px-6 py-3 sm:px-8 sm:py-4 rounded-full border border-cream/30 text-cream/90 text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:border-gold/60 hover:text-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-[2px]'
          >
            Explore the Menu
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className='hidden sm:flex flex-col items-center gap-2 mt-6'
        >
          <span className='text-[9px] tracking-[0.4em] uppercase text-cream/45'>Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className='w-px h-8 bg-linear-to-b from-gold/70 to-transparent'
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
