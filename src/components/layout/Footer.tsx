'use client';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useBookingStore } from '@/store/bookingStore';

const footerLinks = [
  { label: 'Our Story', href: '/#story' },
  { label: 'Menu & Cellar', href: '/menu' },
  { label: 'Reservations', href: '/reservations' },
  { label: 'Private Dining', href: '#' },
  { label: 'Press', href: '#' },
];

const hours = [
  { day: 'Mon – Thu', time: '11:00 am – 9:00 pm' },
  { day: 'Fri – Sat', time: '11:00 am – 10:00 pm' },
  { day: 'Sunday', time: '11:00 am – 9:00 pm' },
];

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { open } = useBookingStore();

  return (
    <footer
      id="reservations"
      ref={ref}
      className="relative bg-background border-t border-accent/10 overflow-hidden"
    >
      {/* Subtle ember glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-32 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)',
        }}
      />

      {/* CTA Block */}
      <div className="relative z-10 py-20 sm:py-24 lg:py-28 section-x border-b border-accent/10 text-center">
        <div className="max-w-3xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-accent text-[10px] sm:text-xs tracking-[0.4em] uppercase mb-5 sm:mb-6"
        >
          Reserve
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-serif text-foreground mb-6 sm:mb-8 leading-[0.95]"
          style={{ fontSize: 'clamp(36px, 7vw, 72px)' }}
        >
          Join Us at the Table
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-muted text-sm sm:text-base max-w-md mx-auto mb-9 sm:mb-12 leading-relaxed px-4"
        >
          An evening at Ember is an invitation to slow down and let fire do the talking.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          onClick={open}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="btn-shimmer px-7 py-3 sm:px-10 sm:py-4 rounded-full bg-accent text-background text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] transition-shadow duration-500"
        >
          Book a Table
        </motion.button>
        </div>
      </div>

      {/* Footer grid */}
      <div className="relative z-10 py-14 sm:py-16 section-x max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 sm:gap-y-14">
        {/* Logo & address */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex flex-col leading-none mb-5 sm:mb-6">
            <span className="font-serif text-2xl text-foreground">Ember</span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-accent/70">on Toorak</span>
          </div>
          <address className="not-italic text-muted text-sm leading-relaxed">
            <p>328 Toorak Road</p>
            <p>Toorak VIC 3142</p>
            <p className="mt-3">
              <a href="tel:0398247600" className="hover:text-accent transition-colors">
                (03) 9824 7600
              </a>
            </p>
            <p className="break-all">
              <a
                href="mailto:reservations@emberontoorak.com.au"
                className="hover:text-accent transition-colors"
              >
                reservations@emberontoorak.com.au
              </a>
            </p>
          </address>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent/70 mb-4 sm:mb-5">
            Explore
          </p>
          <ul className="space-y-2.5">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-muted text-sm hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent/70 mb-4 sm:mb-5">
            Hours
          </p>
          <div className="space-y-2.5">
            {hours.map((h) => (
              <div key={h.day}>
                <p className="text-foreground/85 text-xs sm:text-[13px]">{h.day}</p>
                <p className="text-muted text-[11px] sm:text-xs">{h.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tagline & social */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent/70 mb-4 sm:mb-5">
            Follow
          </p>
          <div className="flex gap-5 mb-7">
            {['Instagram', 'Facebook'].map((s) => (
              <a
                key={s}
                href="#"
                className="text-[11px] tracking-[0.2em] uppercase text-muted hover:text-accent transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
          <p className="font-serif text-muted text-base sm:text-lg leading-snug">
            &ldquo;The ritual of fire.
            <br />
            The architecture of flavour.&rdquo;
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-accent/8 py-5 sm:py-6 section-x">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted text-[11px]">
            © {new Date().getFullYear()} Ember on Toorak. All rights reserved.
          </p>
          <p className="text-muted text-[11px]">Fine dining · Toorak, Victoria</p>
        </div>
      </div>

      {/* Bottom padding so floating mobile button doesn't cover content */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </footer>
  );
}
