'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { BookingProvider } from '../contexts/BookingContext';
import Header from '../components/Header';
import BookingPanel from '../components/BookingPanel';

const hours = [
  { day: 'Monday – Thursday', time: '11:00 am – 9:00 pm' },
  { day: 'Friday – Saturday', time: '11:00 am – 10:00 pm' },
  { day: 'Sunday', time: '11:00 am – 9:00 pm' },
];

const occasions = [
  'Birthday',
  'Anniversary',
  'Business Dinner',
  'Date Night',
  'Celebration',
  'Other',
];

const inputClass =
  'w-full bg-obsidian/60 border border-gold/20 rounded-lg px-4 py-3.5 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-gold/50 focus:bg-obsidian/80 transition-all duration-300 appearance-none';

const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2';

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [occasion, setOccasion] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.1 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.1 });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          phone: data.get('phone'),
          date: data.get('date'),
          time: data.get('time'),
          guests: data.get('guests'),
          occasion: occasion || null,
          dietary: data.get('dietary'),
          notes: data.get('notes'),
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setSubmitted(true);
    } catch {
      alert('Something went wrong. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BookingProvider>
      <Header />
      <BookingPanel />

      <main className="min-h-screen bg-obsidian">
        {/* Page layout: splits into two columns on large screens */}
        <div className="min-h-screen lg:flex lg:items-stretch">

          {/* Left panel — atmospheric info */}
          <div
            ref={infoRef}
            className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[42%] xl:w-[38%] overflow-hidden flex flex-col justify-end pt-20 pb-8 px-8 sm:px-12 lg:px-14"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-smoke" />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 60%, rgba(254,119,67,0.08) 0%, rgba(68,125,155,0.05) 30%, transparent 65%)',
              }}
            />
            <div
              className="absolute top-0 right-0 w-72 h-72 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 100% 0%, rgba(254,119,67,0.06) 0%, transparent 60%)',
              }}
            />
            {/* Vertical gold accent line */}
            <div className="absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden lg:block" />

            {/* Floating embers */}
            <div className="absolute top-32 left-16 w-1.5 h-1.5 rounded-full bg-ember/40 animate-drift1" />
            <div className="absolute top-48 right-20 w-1 h-1 rounded-full bg-gold/30 animate-drift2" />
            <div className="absolute bottom-40 left-24 w-1 h-1 rounded-full bg-ember/25 animate-drift3" />

            <div className="relative z-10">
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={isInfoInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
                className="absolute top-0 left-0 -translate-y-16 lg:translate-y-0 lg:top-auto lg:bottom-full lg:mb-12"
              >
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInfoInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/45 hover:text-gold transition-colors mb-5 group"
                >
                  <span className="block w-5 h-px bg-gold/35 group-hover:w-8 group-hover:bg-gold transition-all duration-400" />
                  Ember on Toorak
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-gold text-[10px] tracking-[0.45em] uppercase mb-3"
              >
                Reserve
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic text-cream leading-[0.92] mb-4"
                style={{ fontSize: 'clamp(38px, 6vw, 68px)' }}
              >
                A Table
                <br />
                <span className="text-gold/60">at Ember</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInfoInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-cream/35 text-sm leading-relaxed max-w-xs mb-5"
              >
                An evening at Ember is an invitation to slow down and let fire do the talking. We look forward to welcoming you.
              </motion.p>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mb-4"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-2">Hours</p>
                <div className="space-y-2">
                  {hours.map((h) => (
                    <div key={h.day} className="flex items-baseline justify-between gap-4">
                      <p className="text-cream/50 text-xs">{h.day}</p>
                      <p className="text-cream/30 text-[11px] shrink-0">{h.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border-t border-gold/10 pt-4"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-gold/50 mb-2">Contact</p>
                <div className="space-y-1">
                  <p className="text-cream/45 text-xs">328 Toorak Road, Toorak VIC 3142</p>
                  <a href="tel:0398247600" className="block text-cream/45 text-xs hover:text-gold transition-colors">
                    (03) 9824 7600
                  </a>
                  <a href="mailto:reservations@emberontoorak.com.au" className="block text-cream/35 text-[11px] hover:text-gold transition-colors break-all">
                    reservations@emberontoorak.com.au
                  </a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right panel — form */}
          <div
            ref={formRef}
            className="flex-1 bg-obsidian border-l border-gold/8 px-6 sm:px-10 lg:px-16 xl:px-20 py-16 lg:py-28"
          >
            <div className="max-w-xl mx-auto lg:mx-0">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center text-center gap-6 py-20"
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(254,119,67,0.2)',
                          '0 0 50px rgba(254,119,67,0.5)',
                          '0 0 20px rgba(254,119,67,0.2)',
                        ],
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="w-20 h-20 rounded-full border border-gold/60 flex items-center justify-center text-gold text-3xl mb-2"
                    >
                      ✓
                    </motion.div>
                    <div>
                      <p className="font-serif italic text-3xl sm:text-4xl text-cream mb-3">
                        Reservation Received
                      </p>
                      <p className="text-cream/45 text-sm leading-relaxed max-w-xs mx-auto">
                        We&apos;ll confirm your table at Ember on Toorak shortly. A confirmation will be sent to your email.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="px-7 py-3 rounded-full border border-gold/30 text-gold/70 text-[11px] tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
                      >
                        Make Another
                      </button>
                      <Link
                        href="/menu"
                        className="px-7 py-3 rounded-full bg-gold/10 text-gold/70 text-[11px] tracking-[0.2em] uppercase hover:bg-gold/20 hover:text-gold transition-all duration-300"
                      >
                        View Menu
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Section: Personal Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    >
                      <p className="text-[10px] tracking-[0.35em] uppercase text-gold/55 mb-5 pb-3 border-b border-gold/10">
                        Your Details
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={labelClass}>First Name</label>
                          <input name="firstName" type="text" placeholder="James" className={inputClass} required />
                        </div>
                        <div>
                          <label className={labelClass}>Last Name</label>
                          <input name="lastName" type="text" placeholder="Halliday" className={inputClass} required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className={labelClass}>Email</label>
                          <input name="email" type="email" placeholder="james@example.com" className={inputClass} required />
                        </div>
                        <div>
                          <label className={labelClass}>Phone</label>
                          <input name="phone" type="tel" placeholder="+61 4XX XXX XXX" className={inputClass} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Section: Reservation Details */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    >
                      <p className="text-[10px] tracking-[0.35em] uppercase text-gold/55 mb-5 pb-3 border-b border-gold/10">
                        Reservation Details
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={labelClass}>Date</label>
                          <input name="date" type="date" className={inputClass} required />
                        </div>
                        <div>
                          <label className={labelClass}>Time</label>
                          <select name="time" className={inputClass} required defaultValue="">
                            <option value="" disabled>Select</option>
                            {['6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'].map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Number of Guests</label>
                        <select name="guests" className={inputClass} required defaultValue="2">
                          {[1,2,3,4,5,6,7,8].map((n) => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                          <option value="9+">9+ Guests (please call)</option>
                        </select>
                      </div>
                    </motion.div>

                    {/* Section: Occasion */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.3 }}
                    >
                      <p className="text-[10px] tracking-[0.35em] uppercase text-gold/55 mb-5 pb-3 border-b border-gold/10">
                        Occasion <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {occasions.map((o) => (
                          <button
                            key={o}
                            type="button"
                            onClick={() => setOccasion(occasion === o ? '' : o)}
                            className={`px-4 py-2 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                              occasion === o
                                ? 'bg-gold/20 border border-gold/60 text-gold'
                                : 'border border-gold/15 text-cream/35 hover:border-gold/35 hover:text-cream/60'
                            }`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </motion.div>

                    {/* Section: Special Requests */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.7, delay: 0.4 }}
                    >
                      <p className="text-[10px] tracking-[0.35em] uppercase text-gold/55 mb-5 pb-3 border-b border-gold/10">
                        Special Requests <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                      </p>
                      <div className="mb-4">
                        <label className={labelClass}>Dietary Requirements</label>
                        <input
                          name="dietary"
                          type="text"
                          placeholder="Vegetarian, gluten-free, allergies…"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Additional Notes</label>
                        <textarea
                          name="notes"
                          placeholder="Seating preferences, wine requests, anything else we should know…"
                          rows={3}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="pt-2"
                    >
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="btn-shimmer w-full py-4 bg-gold text-obsidian text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium rounded-full hover:shadow-[0_0_40px_rgba(254,119,67,0.45)] transition-shadow duration-500 disabled:opacity-60"
                      >
                        {submitting ? 'Sending…' : 'Confirm Reservation'}
                      </motion.button>

                      <div className="flex items-center gap-4 mt-5">
                        <div className="flex-1 h-px bg-gold/10" />
                        <p className="text-[11px] text-cream/25 shrink-0">or</p>
                        <div className="flex-1 h-px bg-gold/10" />
                      </div>

                      <p className="text-center text-[11px] text-cream/30 mt-4">
                        Call us directly at{' '}
                        <a href="tel:0398247600" className="text-gold/60 hover:text-gold transition-colors">
                          (03) 9824 7600
                        </a>
                        <span className="text-cream/20 mx-2">·</span>
                        <a href="mailto:reservations@emberontoorak.com.au" className="text-gold/60 hover:text-gold transition-colors">
                          reservations@emberontoorak.com.au
                        </a>
                      </p>

                      <p className="text-center text-[10px] text-cream/18 mt-3">
                        For groups of 9 or more, please contact us directly to arrange private dining.
                      </p>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </BookingProvider>
  );
}
