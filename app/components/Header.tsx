'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Show, UserButton, SignInButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useBooking } from '../contexts/BookingContext';

const navLinks = [
  { label: 'Our Story', href: '/#story' },
  { label: 'Menu & Cellar', href: '/menu' },
  { label: 'Reservations', href: '/reservations' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open } = useBooking();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    const onScroll = () => {
      if (!scrolled && window.scrollY > 80) setScrolled(true);
      if (scrolled && window.scrollY < 40) setScrolled(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrolled]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[999] navbar-blur transition-[background-color,box-shadow,padding] duration-500 ${
          scrolled || menuOpen ? 'glass glass-fire py-3 sm:py-4' : 'py-5 sm:py-6'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group shrink-0">
            <span className="font-serif italic text-xl sm:text-2xl text-cream tracking-tight">
              Ember
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.35em] uppercase text-gold/70 group-hover:text-gold transition-colors">
              on Toorak
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] tracking-[0.2em] uppercase text-cream/60 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" className="text-[11px] tracking-[0.2em] uppercase text-gold/60 hover:text-gold transition-colors duration-300">
                Admin
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Show when="signed-in">
              <UserButton
                appearance={{
                  variables: { colorPrimary: '#FE7743' },
                }}
              />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden md:inline-flex text-[10px] tracking-[0.2em] uppercase text-cream/40 hover:text-gold transition-colors duration-300">
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <motion.button
              onClick={open}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:inline-flex items-center px-6 lg:px-7 py-3 rounded-full border border-gold/40 text-gold text-[11px] tracking-[0.2em] uppercase hover:bg-gold hover:text-obsidian hover:border-gold transition-all duration-300"
            >
              Book a Table
            </motion.button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-px bg-cream origin-center"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1, y: 6 }}
                initial={{ y: 6 }}
                transition={{ duration: 0.2 }}
                className="block w-5 h-px bg-cream"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 12 }}
                initial={{ y: 12 }}
                transition={{ duration: 0.3 }}
                className="block w-5 h-px bg-cream origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[998] bg-obsidian/95 backdrop-blur-xl flex flex-col items-center justify-center gap-7 md:hidden px-6"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: i * 0.07, duration: 0.4 }}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif italic text-4xl sm:text-5xl text-cream hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => {
                setMenuOpen(false);
                open();
              }}
              className="btn-shimmer mt-6 px-10 py-4 rounded-full bg-gold text-obsidian text-xs tracking-[0.25em] uppercase font-medium"
            >
              Book a Table
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile floating book button — only visible when menu closed */}
      <AnimatePresence>
        {!menuOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            onClick={open}
            className="btn-shimmer fixed bottom-5 right-5 z-[997] md:hidden flex items-center gap-2 px-5 py-3 rounded-full bg-gold text-obsidian text-[11px] font-medium tracking-[0.2em] uppercase shadow-[0_8px_30px_rgba(254,119,67,0.35)]"
          >
            Book a Table
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
