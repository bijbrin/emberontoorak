'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../contexts/BookingContext';
import { useLenis } from 'lenis/react';
import { useState, useEffect } from 'react';

const inputClass =
  'w-full bg-smoke border border-gold/20 rounded-lg px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/60 focus:bg-smoke/80 transition-all';

export default function BookingPanel() {
  const { isOpen, close } = useBooking();
  const lenis = useLenis();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [isOpen, lenis]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      close();
    }, 2500);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm"
          />

          {/* Panel — full-screen on mobile, sidebar on desktop */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 sm:left-auto sm:top-0 sm:right-0 sm:bottom-0 z-[1001] w-full sm:max-w-md bg-surface sm:border-l border-gold/10 flex flex-col"
          >
            <div data-lenis-prevent className="p-6 sm:p-8 md:p-10 flex-1 overflow-y-auto overscroll-contain flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-8 sm:mb-10">
                <div>
                  <p className="text-gold text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-2">
                    Reserve
                  </p>
                  <h2 className="font-serif italic text-3xl sm:text-4xl text-cream leading-none">
                    A Table
                  </h2>
                </div>
                <button
                  onClick={close}
                  className="w-10 h-10 -mt-2 -mr-2 flex items-center justify-center text-cream/40 hover:text-gold transition-colors text-2xl rounded-full"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-12"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(254,119,67,0.3)',
                        '0 0 40px rgba(254,119,67,0.6)',
                        '0 0 20px rgba(254,119,67,0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold text-2xl"
                  >
                    ✓
                  </motion.div>
                  <p className="font-serif italic text-2xl text-cream">Reservation Received</p>
                  <p className="text-sm text-cream/55 leading-relaxed max-w-xs">
                    We&apos;ll confirm your table at Ember on Toorak shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 flex-1">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                        First Name
                      </label>
                      <input type="text" placeholder="James" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                        Last Name
                      </label>
                      <input type="text" placeholder="Halliday" className={inputClass} required />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="james@example.com"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                      Phone
                    </label>
                    <input type="tel" placeholder="+61 4XX XXX XXX" className={inputClass} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                        Date
                      </label>
                      <input type="date" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                        Time
                      </label>
                      <select className={inputClass} required defaultValue="">
                        <option value="" disabled>Select</option>
                        <option>6:00 PM</option>
                        <option>6:30 PM</option>
                        <option>7:00 PM</option>
                        <option>7:30 PM</option>
                        <option>8:00 PM</option>
                        <option>8:30 PM</option>
                        <option>9:00 PM</option>
                        <option>9:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                      Guests
                    </label>
                    <select className={inputClass} required defaultValue="2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                      <option value="9+">9+ (please call)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      placeholder="Dietary requirements, occasions, wine preferences…"
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <div className="mt-4 sm:mt-auto pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-shimmer w-full py-4 bg-gold text-obsidian text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium rounded-full hover:shadow-[0_0_30px_rgba(254,119,67,0.4)] transition-shadow duration-500"
                    >
                      Confirm Reservation
                    </motion.button>
                    <p className="text-center text-[11px] text-cream/30 mt-4">
                      Or call us at{' '}
                      <a
                        href="tel:0398247600"
                        className="text-gold/70 hover:text-gold transition-colors"
                      >
                        (03) 9824 7600
                      </a>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
