'use client';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
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

type Table = {
  id: string;
  seats: number;
  x: number;
  y: number;
  shape: 'round' | 'rect' | 'long';
  status: 'available' | 'booked';
  accessible?: boolean;
  label?: string;
};

const TABLES: Table[] = [
  { id: 'T1', seats: 2, x: 22, y: 26, shape: 'round', status: 'available', label: 'Window' },
  { id: 'T2', seats: 4, x: 48, y: 28, shape: 'rect', status: 'available' },
  { id: 'T3', seats: 6, x: 76, y: 32, shape: 'rect', status: 'booked' },
  { id: 'T4', seats: 4, x: 26, y: 52, shape: 'rect', status: 'available', accessible: true },
  { id: 'T5', seats: 2, x: 78, y: 56, shape: 'round', status: 'available', label: 'Garden' },
  { id: 'T6', seats: 12, x: 50, y: 73, shape: 'long', status: 'available', label: "Chef's Table" },
  { id: 'T7', seats: 4, x: 22, y: 82, shape: 'rect', status: 'booked' },
  { id: 'T8', seats: 6, x: 78, y: 82, shape: 'rect', status: 'available', accessible: true },
];

const inputClass =
  'w-full bg-obsidian/60 border border-gold/20 rounded-lg px-4 py-3.5 text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-gold/50 focus:bg-obsidian/80 transition-all duration-300 appearance-none';

const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-cream/40 mb-2';

export default function ReservationsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [showFloor, setShowFloor] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.1 });
  const isInfoInView = useInView(infoRef, { once: true, amount: 0.1 });

  useEffect(() => {
    const t = setTimeout(() => setShowFloor(true), 3000);
    return () => clearTimeout(t);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);

    const to24h = (t: string) => {
      const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!m) return t;
      let h = parseInt(m[1], 10);
      const period = m[3].toUpperCase();
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${m[2]}`;
    };

    const str = (k: string) => {
      const v = data.get(k);
      const s = typeof v === 'string' ? v.trim() : '';
      return s.length ? s : undefined;
    };

    const guestsRaw = String(data.get('guests') ?? '');
    const guests = guestsRaw === '9+' ? 9 : parseInt(guestsRaw, 10);

    const tableTag = selectedTable
      ? `Table ${selectedTable.id} (${selectedTable.seats} seats${selectedTable.label ? `, ${selectedTable.label}` : ''}${selectedTable.accessible ? ', accessible' : ''})`
      : '';
    const userNotes = str('notes') ?? '';
    const notes = [tableTag, userNotes].filter(Boolean).join(' — ') || undefined;

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: str('firstName'),
          lastName: str('lastName'),
          email: str('email'),
          phone: str('phone'),
          date: str('date'),
          time: to24h(String(data.get('time') ?? '')),
          guests,
          occasion: occasion || undefined,
          dietary: str('dietary'),
          notes,
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

            <div className="relative z-10 w-full">
              <AnimatePresence mode="wait">
                {!showFloor ? (
                  <motion.div
                    key="intro"
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.5 }}
                  >
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

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={isInfoInView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.7, delay: 0.55 }}
                      className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-ember/60 mb-5"
                    >
                      <span className="relative flex w-1.5 h-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-ember/60 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-ember" />
                      </span>
                      Floor plan loading…
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
                  </motion.div>
                ) : (
                  <motion.div
                    key="floor"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-gold/45 hover:text-gold transition-colors mb-4 group"
                    >
                      <span className="block w-5 h-px bg-gold/35 group-hover:w-8 group-hover:bg-gold transition-all duration-400" />
                      Ember on Toorak
                    </Link>

                    <p className="text-gold text-[10px] tracking-[0.45em] uppercase mb-2">Floor Plan</p>
                    <h2 className="font-serif italic text-cream text-2xl sm:text-3xl leading-tight mb-2">
                      Choose <span className="text-gold/60">your table</span>
                    </h2>
                    <p className="text-cream/40 text-xs mb-4 max-w-xs">
                      Tap an available table to add it to your reservation.
                    </p>

                    {/* Floor plan canvas */}
                    <div
                      className="relative w-full rounded-2xl border border-gold/15 bg-linear-to-br from-obsidian/90 via-smoke/70 to-obsidian/90 overflow-hidden shadow-[inset_0_0_60px_rgba(0,0,0,0.5)]"
                      style={{ aspectRatio: '4 / 5' }}
                    >
                      {/* parquet texture */}
                      <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(45deg, rgba(254,119,67,0.6) 0 1px, transparent 1px 14px)',
                        }}
                      />

                      {/* Kitchen strip */}
                      <div className="absolute top-2 left-2 right-2 h-8 rounded-md border border-ember/25 bg-ember/10 flex items-center justify-center gap-2 text-[9px] tracking-[0.3em] uppercase text-ember/75">
                        <span className="text-[13px]">🔥</span> Kitchen
                      </div>

                      {/* Restrooms */}
                      <div
                        className="absolute right-2 w-10 h-10 rounded-md border border-steel/35 bg-steel/15 flex items-center justify-center text-[15px]"
                        style={{ top: 'calc(8px + 36px + 4px)' }}
                        title="Restrooms"
                      >
                        🚻
                      </div>

                      {/* Bar */}
                      <div
                        className="absolute left-2 w-9 rounded-md border border-gold/25 bg-gold/10 flex items-center justify-center text-[8px] tracking-[0.3em] uppercase text-gold/65"
                        style={{ top: 'calc(8px + 36px + 4px)', height: '90px', writingMode: 'vertical-rl' }}
                      >
                        Bar
                      </div>

                      {/* Tables */}
                      {TABLES.map((t, i) => {
                        const isSelected = selectedTable?.id === t.id;
                        const isBooked = t.status === 'booked';
                        const w = t.shape === 'long' ? 120 : t.seats >= 6 ? 60 : t.seats >= 4 ? 50 : 38;
                        const h = t.shape === 'long' ? 36 : w;
                        return (
                          <motion.button
                            key={t.id}
                            type="button"
                            onClick={() => !isBooked && setSelectedTable(isSelected ? null : t)}
                            disabled={isBooked}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 220, damping: 18 }}
                            whileHover={!isBooked ? { scale: 1.08 } : {}}
                            whileTap={!isBooked ? { scale: 0.95 } : {}}
                            className={`absolute flex flex-col items-center justify-center font-medium transition-colors duration-300 ${
                              t.shape === 'round' ? 'rounded-full' : 'rounded-lg'
                            } ${
                              isBooked
                                ? 'bg-steel/25 border border-steel/40 text-cream/25 cursor-not-allowed'
                                : isSelected
                                ? 'bg-ember text-obsidian border-2 border-gold shadow-[0_0_28px_rgba(254,119,67,0.65)]'
                                : 'bg-gold/15 border border-gold/45 text-gold hover:bg-gold/25 hover:border-gold/80'
                            }`}
                            style={{
                              left: `${t.x}%`,
                              top: `${t.y}%`,
                              width: w,
                              height: h,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            <span className="text-[12px] leading-none">{t.seats}</span>
                            <span className="text-[7px] tracking-[0.15em] opacity-75 mt-0.5">{t.id}</span>
                            {t.accessible && (
                              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-steel border border-cream/30 text-cream text-[9px] flex items-center justify-center shadow">
                                ♿
                              </span>
                            )}
                            {isBooked && (
                              <span className="absolute inset-0 rounded-[inherit] flex items-center justify-center bg-obsidian/40 text-rose-300/80 text-[10px] tracking-widest uppercase">
                                ✕
                              </span>
                            )}
                          </motion.button>
                        );
                      })}

                      {/* Entry */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full border border-cream/15 bg-obsidian/70 text-[8px] tracking-[0.3em] uppercase text-cream/45">
                        <span>↓</span> Entry
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-cream/55">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-gold/20 border border-gold/50" /> Available
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-ember border border-gold" /> Selected
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded bg-steel/30 border border-steel/50" /> Booked
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full bg-steel text-cream text-[8px] flex items-center justify-center">♿</span> Accessible
                      </div>
                    </div>

                    {/* Selected summary in left panel */}
                    <AnimatePresence>
                      {selectedTable && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="mt-4 p-3 rounded-lg border border-gold/30 bg-gold/8 flex items-center justify-between gap-3"
                        >
                          <div className="text-[11px] text-cream/70">
                            <span className="text-gold font-medium">{selectedTable.id}</span> · {selectedTable.seats} seats
                            {selectedTable.label && <span className="text-cream/45"> · {selectedTable.label}</span>}
                            {selectedTable.accessible && <span className="text-steel"> · ♿</span>}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedTable(null)}
                            className="text-[9px] tracking-[0.25em] uppercase text-cream/40 hover:text-ember transition-colors"
                          >
                            Clear
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
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

                      <AnimatePresence>
                        {selectedTable && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -6, height: 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 p-4 rounded-xl border border-gold/30 bg-linear-to-r from-gold/10 to-ember/5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <span className="w-10 h-10 rounded-full bg-gold/20 border border-gold/55 flex items-center justify-center text-gold text-sm font-semibold">
                                    {selectedTable.seats}
                                  </span>
                                  {selectedTable.accessible && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-steel text-cream text-[9px] flex items-center justify-center">♿</span>
                                  )}
                                </div>
                                <div>
                                  <p className="text-[10px] tracking-[0.25em] uppercase text-gold/75">Selected Table</p>
                                  <p className="text-cream/85 text-sm">
                                    {selectedTable.id} · {selectedTable.seats} seats
                                    {selectedTable.label && <span className="text-cream/50"> · {selectedTable.label}</span>}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setSelectedTable(null)}
                                className="text-[10px] tracking-[0.25em] uppercase text-cream/45 hover:text-ember transition-colors shrink-0"
                              >
                                Change
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
