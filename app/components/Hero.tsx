'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useBooking } from '../contexts/BookingContext';

export default function Hero() {
  const { open } = useBooking();
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Subtle parallax on scroll
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(0, ${window.scrollY * -0.18}px, 0) scale(1.15)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Some mobile browsers (iOS Safari) need an explicit play() call after mount
    const v = videoRef.current;
    if (v) {
      v.play().catch(() => {
        /* autoplay blocked — poster will show */
      });
    }
  }, []);

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Looping fire video background with subtle parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: 'scale(1.15)' }}
      >
        <video
          ref={videoRef}
          src="/fire.mov"
          poster="/hero.png"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      {/* Layered overlays for legibility and atmosphere */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/10 to-obsidian" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Subtle ember glow drifting on top of photo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-drift1"
          style={{
            width: '65vw',
            height: '65vw',
            background:
              'radial-gradient(circle, rgba(254,119,67,0.18) 0%, transparent 65%)',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
          }}
        />
        <div
          className="absolute rounded-full animate-drift3"
          style={{
            width: '40vw',
            height: '40vw',
            background:
              'radial-gradient(circle, rgba(68,125,155,0.15) 0%, transparent 70%)',
            top: '0%',
            left: '0%',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center select-none pt-28 sm:pt-32 pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-gold/90 mb-8 sm:mb-12"
        >
          Est. Toorak · Melbourne
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="uppercase leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(72px, 16vw, 200px)',
              color: '#FE7743',
              textShadow: '0 4px 60px rgba(254,119,67,0.35), 0 8px 80px rgba(0,0,0,0.6)',
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
          className="my-7 sm:my-9 mx-auto h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="font-serif italic text-cream/95 text-xl sm:text-2xl tracking-wide"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,0.55)' }}
        >
          Theatre of Fire
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-cream/65 text-xs sm:text-sm tracking-[0.08em] mt-5 max-w-md mx-auto leading-relaxed"
        >
          The ritual of fire. The architecture of flavour.
          <br className="hidden sm:inline" />
          In the heart of Toorak.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto"
        >
          <motion.button
            onClick={open}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-shimmer px-8 py-4 rounded-full bg-gold text-obsidian text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_rgba(254,119,67,0.55)] transition-shadow duration-500"
          >
            Reserve a Table
          </motion.button>
          <a
            href="#menu"
            className="px-8 py-4 rounded-full border border-cream/30 text-cream/90 text-[11px] sm:text-xs tracking-[0.25em] uppercase hover:border-gold/60 hover:text-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-[2px]"
          >
            Explore the Menu
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10"
      >
        <span className="text-[9px] tracking-[0.4em] uppercase text-cream/45">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-gold/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
