'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { useState, useEffect } from 'react';
import { Table, TABLES, OCCASIONS } from '@/lib/tables';

const inputClass = 'form-input';

const labelClass = 'form-label';

const sectionLabel = 'form-section-label';

function to24h(t: string) {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return t;
  let h = parseInt(m[1], 10);
  const period = m[3].toUpperCase();
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

export default function BookingPanel() {
  const { isOpen, close } = useBookingStore();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [occasion, setOccasion] = useState('');
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, [isOpen]);

  function resetForm() {
    setSubmitted(false);
    setOccasion('');
    setSelectedTable(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);

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
            <div className="p-6 sm:p-8 flex-1 overflow-y-auto overscroll-contain flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <p className="text-gold text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-1.5">
                    Reserve
                  </p>
                  <h2 className="font-serif italic text-3xl sm:text-4xl text-cream leading-none">
                    A Table{' '}
                    <span className="text-gold/60">at Ember</span>
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
                        '0 0 20px color-mix(in srgb, var(--color-ember) 30%, transparent)',
                        '0 0 40px color-mix(in srgb, var(--color-ember) 60%, transparent)',
                        '0 0 20px color-mix(in srgb, var(--color-ember) 30%, transparent)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 rounded-full border border-gold flex items-center justify-center text-gold text-2xl"
                  >
                    ✓
                  </motion.div>
                  <p className="font-serif italic text-2xl text-cream">Reservation Received</p>
                  <p className="text-sm text-cream/55 leading-relaxed max-w-xs">
                    We&apos;ll confirm your table at Ember on Toorak shortly. A confirmation will be sent to your email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 rounded-full border border-gold/30 text-gold/70 text-[11px] tracking-[0.2em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
                    >
                      Make Another
                    </button>
                    <button
                      onClick={close}
                      className="px-6 py-2.5 rounded-full bg-gold/10 text-gold/70 text-[11px] tracking-[0.2em] uppercase hover:bg-gold/20 hover:text-gold transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">

                  {/* Personal Details */}
                  <div>
                    <p className={sectionLabel}>Your Details</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={labelClass}>First Name</label>
                        <input name="firstName" type="text" placeholder="James" className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>Last Name</label>
                        <input name="lastName" type="text" placeholder="Halliday" className={inputClass} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Email</label>
                        <input name="email" type="email" placeholder="james@example.com" className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>Phone</label>
                        <input name="phone" type="tel" placeholder="+61 4XX XXX XXX" className={inputClass} />
                      </div>
                    </div>
                  </div>

                  {/* Reservation Details */}
                  <div>
                    <p className={sectionLabel}>Reservation Details</p>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className={labelClass}>Date</label>
                        <input name="date" type="date" className={inputClass} required />
                      </div>
                      <div>
                        <label className={labelClass}>Time</label>
                        <select name="time" className={inputClass} required defaultValue="">
                          <option value="" disabled>Select</option>
                          {['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Guests</label>
                      <select name="guests" className={inputClass} required defaultValue="2">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                        <option value="9+">9+ Guests (please call)</option>
                      </select>
                    </div>
                  </div>

                  {/* Occasion */}
                  <div>
                    <p className={sectionLabel}>
                      Occasion{' '}
                      <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setOccasion(occasion === o ? '' : o)}
                          className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-[0.15em] uppercase transition-all duration-300 ${
                            occasion === o
                              ? 'bg-gold/20 border border-gold/60 text-gold'
                              : 'border border-gold/15 text-cream/35 hover:border-gold/35 hover:text-cream/60'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Floor Plan */}
                  <div>
                    <p className={sectionLabel}>
                      Choose a Table{' '}
                      <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                    </p>
                    <p className="text-[11px] text-cream/35 mb-3">Tap an available table to add it to your reservation.</p>

                    <div
                      className="relative w-full rounded-xl border border-gold/15 bg-gradient-to-br from-obsidian/90 via-smoke/70 to-obsidian/90 overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {/* parquet texture */}
                      <div
                        className="absolute inset-0 opacity-[0.06] pointer-events-none"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-ember) 60%, transparent) 0 1px, transparent 1px 14px)' }}
                      />

                      {/* Kitchen strip */}
                      <div className="absolute top-2 left-2 right-2 h-7 rounded-md border border-ember/25 bg-ember/10 flex items-center justify-center gap-1.5 text-[8px] tracking-[0.3em] uppercase text-ember/75">
                        <span className="text-[11px]">🔥</span> Kitchen
                      </div>

                      {/* Restrooms */}
                      <div
                        className="absolute right-2 w-8 h-8 rounded-md border border-steel/35 bg-steel/15 flex items-center justify-center text-[13px]"
                        style={{ top: 'calc(8px + 32px + 4px)' }}
                        title="Restrooms"
                      >
                        🚻
                      </div>

                      {/* Bar */}
                      <div
                        className="absolute left-2 w-8 rounded-md border border-gold/25 bg-gold/10 flex items-center justify-center text-[7px] tracking-[0.3em] uppercase text-gold/65"
                        style={{ top: 'calc(8px + 32px + 4px)', height: '80px', writingMode: 'vertical-rl' }}
                      >
                        Bar
                      </div>

                      {/* Tables */}
                      {TABLES.map((t, i) => {
                        const isSelected = selectedTable?.id === t.id;
                        const isBooked = t.status === 'booked';
                        const w = t.shape === 'long' ? 110 : t.seats >= 6 ? 54 : t.seats >= 4 ? 44 : 34;
                        const h = t.shape === 'long' ? 32 : w;
                        return (
                          <motion.button
                            key={t.id}
                            type="button"
                            onClick={() => !isBooked && setSelectedTable(isSelected ? null : t)}
                            disabled={isBooked}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.06, type: 'spring', stiffness: 220, damping: 18 }}
                            whileHover={!isBooked ? { scale: 1.08 } : {}}
                            whileTap={!isBooked ? { scale: 0.95 } : {}}
                            className={`absolute flex flex-col items-center justify-center font-medium transition-colors duration-300 ${
                              t.shape === 'round' ? 'rounded-full' : 'rounded-lg'
                            } ${
                              isBooked
                                ? 'bg-steel/25 border border-steel/40 text-cream/25 cursor-not-allowed'
                                : isSelected
                                  ? 'bg-ember text-obsidian border-2 border-gold shadow-[0_0_24px_color-mix(in_srgb,var(--color-ember)_65%,transparent)]'
                                  : 'bg-gold/15 border border-gold/45 text-gold hover:bg-gold/25 hover:border-gold/80'
                            }`}
                            style={{ left: `${t.x}%`, top: `${t.y}%`, width: w, height: h, transform: 'translate(-50%, -50%)' }}
                          >
                            <span className="text-[11px] leading-none">{t.seats}</span>
                            <span className="text-[6px] tracking-[0.15em] opacity-75 mt-0.5">{t.id}</span>
                            {t.accessible && (
                              <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-steel border border-cream/30 text-cream text-[8px] flex items-center justify-center shadow">
                                ♿
                              </span>
                            )}
                            {isBooked && (
                              <span className="absolute inset-0 rounded-[inherit] flex items-center justify-center bg-obsidian/40 text-rose-300/80 text-[9px] tracking-widest uppercase">
                                ✕
                              </span>
                            )}
                          </motion.button>
                        );
                      })}

                      {/* Entry */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full border border-cream/15 bg-obsidian/70 text-[7px] tracking-[0.3em] uppercase text-cream/45">
                        <span>↓</span> Entry
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-2.5 grid grid-cols-4 gap-x-2 gap-y-1.5 text-[9px] text-cream/50">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-gold/20 border border-gold/50 shrink-0" /> Available
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-ember border border-gold shrink-0" /> Selected
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-steel/30 border border-steel/50 shrink-0" /> Booked
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-steel text-cream text-[7px] flex items-center justify-center shrink-0">♿</span> Access
                      </div>
                    </div>

                    {/* Selected table summary */}
                    <AnimatePresence>
                      {selectedTable && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: 8, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-3 rounded-lg border border-gold/30 bg-gold/8 flex items-center justify-between gap-3">
                            <div className="text-[11px] text-cream/70">
                              <span className="text-gold font-medium">{selectedTable.id}</span>{' '}
                              · {selectedTable.seats} seats
                              {selectedTable.label && <span className="text-cream/45"> · {selectedTable.label}</span>}
                              {selectedTable.accessible && <span className="text-steel"> · ♿</span>}
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedTable(null)}
                              className="text-[9px] tracking-[0.25em] uppercase text-cream/40 hover:text-ember transition-colors shrink-0"
                            >
                              Clear
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <p className={sectionLabel}>
                      Special Requests{' '}
                      <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                    </p>
                    <div className="mb-3">
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
                        placeholder="Seating preferences, wine requests, anything else…"
                        rows={3}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="mt-auto pt-2">
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="btn-shimmer w-full py-4 bg-gold text-obsidian text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium rounded-full hover:shadow-[0_0_30px_color-mix(in_srgb,var(--color-ember)_40%,transparent)] transition-shadow duration-500 disabled:opacity-60"
                    >
                      {submitting ? 'Sending…' : 'Confirm Reservation'}
                    </motion.button>
                    <p className="text-center text-[11px] text-cream/30 mt-4">
                      Or call us at{' '}
                      <a href="tel:0398247600" className="text-gold/70 hover:text-gold transition-colors">
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
