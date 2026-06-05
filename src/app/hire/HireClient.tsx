'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import BookingPanel from '../components/BookingPanel';
import Footer from '@/components/layout/Footer';

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

const perks = [
  { title: 'Family Meal', body: 'A proper sit-down meal cooked by the brigade before every service.' },
  { title: 'Cellar Education', body: 'Weekly tastings led by the Sommelier across regions, vintages, and verticals.' },
  { title: 'Sundays Off', body: 'A genuine weekend. The dining room is closed Sundays — the team rests.' },
  { title: 'Continuing Education', body: 'Annual stipend for WSET, Court of Master Sommeliers, or stages abroad.' },
];

const inputClass =
  'w-full bg-background/60 border border-accent/20 rounded-lg px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all duration-300 appearance-none';

const labelClass = 'block text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function HireClient({ jobs }: { jobs: Job[] }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ ref: string; position: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const isJobsInView = useInView(jobsRef, { once: true, amount: 0.05 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.1 });

  function pickJob(job: Job) {
    setSelectedJob(job);
    setExpandedId(job.id);
    setTimeout(() => {
      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  function validateFile(f: File): string | null {
    const lower = f.name.toLowerCase();
    if (!ALLOWED_EXT.some((ext) => lower.endsWith(ext))) {
      return 'Only PDF, DOC, or DOCX files are accepted.';
    }
    if (f.size > MAX_FILE_BYTES) return 'File must be 5 MB or smaller.';
    return null;
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) {
    setFileError(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) {
      setter(null);
      return;
    }
    const err = validateFile(f);
    if (err) {
      setFileError(err);
      e.target.value = '';
      setter(null);
      return;
    }
    setter(f);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!resume) {
      setFileError('Please attach your resume.');
      return;
    }

    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    fd.set('resume', resume);
    if (coverLetter) fd.set('coverLetter', coverLetter);
    else fd.delete('coverLetter');

    try {
      const res = await fetch('/api/applications', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFormError(data?.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted({ ref: data.ref, position: String(fd.get('position') ?? '') });
    } catch {
      setFormError('Network error. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <BookingPanel />

      <main className="min-h-screen bg-background">
        {/* HERO */}
        <section
          ref={heroRef}
          className="relative overflow-hidden pt-32 sm:pt-40 pb-20 sm:pb-28 px-6 sm:px-10 lg:px-16"
        >
          <div className="absolute inset-0 bg-smoke" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 30% 30%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, color-mix(in srgb, var(--color-muted) 5%, transparent) 35%, transparent 70%)',
            }}
          />
          <div className="absolute top-24 left-12 w-1.5 h-1.5 rounded-full bg-accent/40 animate-drift1 pointer-events-none" />
          <div className="absolute top-40 right-20 w-1 h-1 rounded-full bg-accent/30 animate-drift2 pointer-events-none" />
          <div className="absolute bottom-24 left-1/3 w-1 h-1 rounded-full bg-accent/25 animate-drift3 pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-accent/45 hover:text-accent transition-colors mb-6 group"
              >
                <span className="block w-5 h-px bg-accent/35 group-hover:w-8 group-hover:bg-accent transition-all duration-400" />
                Ember on Toorak
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-accent text-[10px] tracking-[0.45em] uppercase mb-4"
            >
              Careers
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-foreground leading-[0.95] mb-6"
              style={{ fontSize: 'clamp(44px, 7vw, 88px)' }}
            >
              Cook with <span className="text-accent/65">fire.</span>
              <br />
              Serve with <span className="text-accent/65">soul.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-foreground/55 text-base sm:text-lg leading-relaxed max-w-2xl"
            >
              Ember on Toorak is a small, deliberate team. We move with intention,
              we look after each other, and we believe a great dining room begins
              with the people inside it. If that sounds like home, we&apos;d love
              to meet you.
            </motion.p>

            {/* perks */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {perks.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border border-accent/15 bg-surface/40 p-4 backdrop-blur-sm"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-accent/70 mb-2">
                    {p.title}
                  </p>
                  <p className="text-foreground/55 text-xs leading-relaxed">{p.body}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* jobs */}
        <section
          ref={jobsRef}
          className="relative px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-t border-accent/10"
        >
          <div className="max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              animate={isJobsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-accent text-[10px] tracking-[0.45em] uppercase mb-3"
            >
              Open Positions
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={isJobsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-foreground leading-tight mb-12"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)' }}
            >
              Currently <span className="text-accent/60">hiring</span>
            </motion.h2>

            <div className="space-y-3">
              {jobs.map((job, i) => {
                const isOpen = expandedId === job.id;
                const isSelected = selectedJob?.id === job.id;
                return (
                  <motion.article
                    key={job.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={isJobsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.06 }}
                    className={`rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'border-accent/55 bg-linear-to-br from-accent/8 via-surface/40 to-background/40 shadow-[0_0_32px_color-mix(in_srgb,var(--color-accent)_10%,transparent)]'
                        : 'border-accent/12 bg-surface/30 hover:border-accent/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : job.id)}
                      className="w-full text-left px-5 sm:px-7 py-5 flex items-center justify-between gap-4"
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-[9px] tracking-[0.3em] uppercase text-accent/55">
                            {job.department}
                          </span>
                          <span className="text-foreground/20 text-[9px]">·</span>
                          <span className="text-[9px] tracking-[0.25em] uppercase text-foreground/45">
                            {job.type}
                          </span>
                          <span className="text-foreground/20 text-[9px]">·</span>
                          <span className="text-[9px] tracking-[0.25em] uppercase text-foreground/45">
                            {job.location}
                          </span>
                        </div>
                        <h3 className="font-serif text-foreground text-xl sm:text-2xl leading-tight">
                          {job.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="hidden sm:block text-[11px] text-accent/70 tracking-wide">
                          {job.salary}
                        </span>
                        <span
                          className={`w-8 h-8 rounded-full border border-accent/30 flex items-center justify-center text-accent text-sm transition-transform duration-300 ${
                            isOpen ? 'rotate-45' : ''
                          }`}
                          aria-hidden
                        >
                          +
                        </span>
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="detail"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 sm:px-7 pb-7 pt-1 border-t border-accent/10">
                            <p className="text-foreground/65 text-sm leading-relaxed max-w-2xl mb-6">
                              {job.summary}
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-accent/55 mb-3">
                                  What you&apos;ll do
                                </p>
                                <ul className="space-y-2">
                                  {job.responsibilities.map((r) => (
                                    <li key={r} className="text-foreground/55 text-sm leading-relaxed flex gap-2">
                                      <span className="text-accent/50 shrink-0">·</span>
                                      <span>{r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-accent/55 mb-3">
                                  Who you are
                                </p>
                                <ul className="space-y-2">
                                  {job.requirements.map((r) => (
                                    <li key={r} className="text-foreground/55 text-sm leading-relaxed flex gap-2">
                                      <span className="text-accent/50 shrink-0">·</span>
                                      <span>{r}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-3">
                              <p className="text-[11px] text-accent/70 sm:hidden">{job.salary}</p>
                              <button
                                type="button"
                                onClick={() => pickJob(job)}
                                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-[11px] tracking-[0.2em] uppercase hover:bg-accent/25 hover:border-accent transition-all duration-300"
                              >
                                Apply for this role
                                <span aria-hidden>→</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* APPLICATION FORM */}
        <section
          id="apply"
          ref={formRef}
          className="relative px-6 sm:px-10 lg:px-16 py-20 sm:py-28 border-t border-accent/10"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at 70% 0%, color-mix(in srgb, var(--color-accent) 6%, transparent) 0%, transparent 55%)',
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center gap-6 py-16"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px color-mix(in srgb, var(--color-accent) 20%, transparent)',
                        '0 0 50px color-mix(in srgb, var(--color-accent) 50%, transparent)',
                        '0 0 20px color-mix(in srgb, var(--color-accent) 20%, transparent)',
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 rounded-full border border-accent/60 flex items-center justify-center text-accent text-3xl"
                  >
                    ✓
                  </motion.div>
                  <div>
                    <p className="font-serif text-3xl sm:text-4xl text-foreground mb-3">
                      Application Received
                    </p>
                    <p className="text-foreground/50 text-sm leading-relaxed max-w-md mx-auto">
                      Thank you for applying for <span className="text-accent/80">{submitted.position}</span>.
                      We review every application personally and will be in touch within five business days.
                    </p>
                    <p className="text-[11px] tracking-[0.25em] uppercase text-foreground/30 mt-4">
                      Reference · <span className="text-accent/70">{submitted.ref}</span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button
                      onClick={() => {
                        setSubmitted(null);
                        setResume(null);
                        setCoverLetter(null);
                        setSelectedJob(null);
                      }}
                      className="px-7 py-3 rounded-full border border-accent/30 text-accent/70 text-[11px] tracking-[0.2em] uppercase hover:border-accent hover:text-accent transition-all duration-300"
                    >
                      Apply for another role
                    </button>
                    <Link
                      href="/"
                      className="px-7 py-3 rounded-full bg-accent/10 text-accent/70 text-[11px] tracking-[0.2em] uppercase hover:bg-accent/20 hover:text-accent transition-all duration-300"
                    >
                      Back to Ember
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={isFormInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-accent text-[10px] tracking-[0.45em] uppercase mb-3">Apply</p>
                  <h2
                    className="font-serif text-foreground leading-tight mb-3"
                    style={{ fontSize: 'clamp(30px, 4vw, 46px)' }}
                  >
                    Tell us <span className="text-accent/60">your story</span>
                  </h2>
                  <p className="text-foreground/45 text-sm leading-relaxed max-w-xl mb-10">
                    A short application is enough. Attach your CV, add a cover letter if you&apos;d
                    like, and we&apos;ll take it from there.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal */}
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-accent/55 mb-5 pb-3 border-b border-accent/10">
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
                    </div>

                    {/* Role */}
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-accent/55 mb-5 pb-3 border-b border-accent/10">
                        Role
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className={labelClass}>Position</label>
                          <select
                            name="position"
                            className={inputClass}
                            required
                            value={selectedJob?.title ?? ''}
                            onChange={(e) => {
                              const job = jobs.find((j) => j.title === e.target.value);
                              setSelectedJob(job ?? null);
                              if (job) setExpandedId(job.id);
                            }}
                          >
                            <option value="" disabled>Select a role</option>
                            {jobs.map((j) => (
                              <option key={j.id} value={j.title}>{j.title}</option>
                            ))}
                            <option value="General Application">General Application</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Years of Experience</label>
                          <select name="experience" className={inputClass} required defaultValue="">
                            <option value="" disabled>Select</option>
                            <option>Less than 1 year</option>
                            <option>1 – 3 years</option>
                            <option>3 – 5 years</option>
                            <option>5 – 10 years</option>
                            <option>10+ years</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass}>Right to Work in Australia</label>
                        <select name="rightToWork" className={inputClass} required defaultValue="">
                          <option value="" disabled>Select</option>
                          <option value="yes">Yes — unrestricted</option>
                          <option value="sponsorship">Require visa sponsorship</option>
                          <option value="no">Not currently eligible</option>
                        </select>
                      </div>
                    </div>

                    {/* Files */}
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-accent/55 mb-5 pb-3 border-b border-accent/10">
                        Documents
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FileDrop
                          label="Resume / CV"
                          required
                          file={resume}
                          onChange={(e) => handleFile(e, setResume)}
                          onClear={() => setResume(null)}
                          inputName="resume"
                        />
                        <FileDrop
                          label="Cover Letter"
                          optional
                          file={coverLetter}
                          onChange={(e) => handleFile(e, setCoverLetter)}
                          onClear={() => setCoverLetter(null)}
                          inputName="coverLetter"
                        />
                      </div>

                      <p className="text-[10px] text-foreground/30 mt-3">
                        PDF, DOC, or DOCX. Maximum 5 MB per file.
                      </p>
                      {fileError && (
                        <p className="text-[11px] text-rose-300/80 mt-2">{fileError}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <p className="text-[10px] tracking-[0.35em] uppercase text-accent/55 mb-5 pb-3 border-b border-accent/10">
                        A note <span className="text-foreground/20 normal-case tracking-normal">(optional)</span>
                      </p>
                      <label className={labelClass}>Tell us why Ember</label>
                      <textarea
                        name="message"
                        rows={5}
                        placeholder="Anything you&apos;d like us to know — your favourite ingredient, a service you remember, why now…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      {formError && (
                        <p className="text-[11px] text-rose-300/80 mb-3 text-center">{formError}</p>
                      )}
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="btn-shimmer w-full py-4 bg-accent text-background text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium rounded-full hover:shadow-[0_0_40px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] transition-shadow duration-500 disabled:opacity-60"
                      >
                        {submitting ? 'Sending…' : 'Submit Application'}
                      </motion.button>

                      <p className="text-center text-[11px] text-foreground/30 mt-5">
                        Prefer email? Send your application to{' '}
                        <a href="mailto:careers@emberontoorak.com.au" className="text-accent/70 hover:text-accent transition-colors">
                          careers@emberontoorak.com.au
                        </a>
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function FileDrop({
  label,
  required = false,
  optional = false,
  file,
  onChange,
  onClear,
  inputName,
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputName: string;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label} {optional && <span className="text-foreground/20 normal-case tracking-normal">(optional)</span>}
      </label>
      <label
        className={`relative flex flex-col items-center justify-center gap-2 w-full min-h-[120px] rounded-lg border-2 border-dashed cursor-pointer transition-all duration-300 px-4 py-5 text-center ${
          file
            ? 'border-accent/50 bg-accent/8'
            : 'border-accent/20 bg-background/40 hover:border-accent/40 hover:bg-background/60'
        }`}
      >
        <input
          type="file"
          name={inputName}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={onChange}
          required={required && !file}
        />
        {file ? (
          <>
            <span className="w-9 h-9 rounded-full bg-accent/20 border border-accent/55 flex items-center justify-center text-accent text-base">
              ✓
            </span>
            <p className="text-foreground/85 text-sm truncate max-w-full">{file.name}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/35">
              {formatBytes(file.size)}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onClear();
              }}
              className="mt-1 text-[10px] tracking-[0.25em] uppercase text-foreground/45 hover:text-accent transition-colors"
            >
              Remove
            </button>
          </>
        ) : (
          <>
            <span className="w-9 h-9 rounded-full border border-accent/40 flex items-center justify-center text-accent/70 text-lg">
              ↑
            </span>
            <p className="text-foreground/65 text-sm">
              <span className="text-accent">Click to upload</span> or drag &amp; drop
            </p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/30">
              PDF · DOC · DOCX
            </p>
          </>
        )}
      </label>
    </div>
  );
}
