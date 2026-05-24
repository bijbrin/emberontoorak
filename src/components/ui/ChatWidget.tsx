'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [greeting, setGreeting] = useState<string | null>(null);
  const [greetingLoading, setGreetingLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const greetingFetched = useRef(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    if (open && !greetingFetched.current) {
      greetingFetched.current = true;
      setGreetingLoading(true);
      fetch('/api/chat/greeting')
        .then((r) => r.json())
        .then(({ greeting: text }) => setGreeting(text))
        .catch(() => setGreeting('The coals are lit and the table is yours.'))
        .finally(() => setGreetingLoading(false));
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Lock body scroll on mobile when chat is open
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia('(max-width: 639px)').matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed z-[998] flex flex-col overflow-hidden shadow-2xl border border-steel/30
              inset-x-3 top-20 bottom-3 rounded-2xl
              sm:inset-auto sm:top-auto sm:bottom-24 sm:right-6 sm:w-[360px] sm:max-h-[520px]"
            style={{ background: 'var(--color-surface)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-steel/20 shrink-0"
              style={{ background: 'var(--color-smoke)' }}
            >
              <div>
                <p className="font-display text-[11px] uppercase tracking-widest text-ember">
                  Ember on Toorak
                </p>
                <p className="text-cream/70 text-[10px] mt-0.5">Ask us anything</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 text-xl leading-none"
                aria-label="Close chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-2.5 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-start gap-2">
                  <div
                    className="max-w-[88%] rounded-xl rounded-tl-sm px-3 py-2 text-[13px] leading-relaxed text-cream/90"
                    style={{ background: 'color-mix(in srgb, var(--color-obsidian) 60%, transparent)' }}
                  >
                    {greetingLoading ? (
                      <span className="inline-flex gap-1 py-0.5">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-ember/60 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </span>
                    ) : (
                      greeting
                    )}
                  </div>
                  {!greetingLoading && (
                    <a
                      href="/reservations"
                      className="btn-shimmer inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-display uppercase tracking-widest text-obsidian transition-opacity hover:opacity-90"
                      style={{ background: 'var(--color-ember)' }}
                    >
                      Reserve a table
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                      message.role === 'user'
                        ? 'text-cream rounded-tr-sm'
                        : 'text-cream/90 rounded-tl-sm'
                    }`}
                    style={{
                      background:
                        message.role === 'user'
                          ? 'color-mix(in srgb, var(--color-ember) 25%, transparent)'
                          : 'color-mix(in srgb, var(--color-obsidian) 60%, transparent)',
                    }}
                  >
                    {message.parts.map((part, i) =>
                      part.type === 'text' ? (
                        <span key={i}>{part.text}</span>
                      ) : null,
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="rounded-xl rounded-tl-sm px-4 py-3"
                    style={{ background: 'color-mix(in srgb, var(--color-obsidian) 60%, transparent)' }}
                  >
                    <span className="inline-flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-ember/60 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-3 pb-3 pt-2 border-t border-steel/20 flex gap-2 shrink-0"
              style={{ background: 'var(--color-smoke)' }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="Type a message…"
                className="flex-1 min-w-0 bg-obsidian/60 border border-steel/30 rounded-lg px-3 py-2 text-[13px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-ember/50 transition-colors disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="shrink-0 bg-ember hover:bg-ember/80 disabled:opacity-40 disabled:cursor-not-allowed text-obsidian rounded-lg px-3 py-2 transition-colors font-display text-[11px] uppercase tracking-wider"
              >
                Send
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — hides on mobile while open so it doesn't cover the input */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed z-[999] rounded-full shadow-lg flex items-center justify-center transition-colors
          bottom-5 left-5 w-12 h-12
          sm:bottom-6 sm:right-6 sm:left-auto sm:w-14 sm:h-14
          ${open ? 'hidden sm:flex' : 'flex'}`}
        style={{
          background: open ? 'var(--color-smoke)' : 'var(--color-ember)',
          border: open ? '1px solid color-mix(in srgb, var(--color-steel) 40%, transparent)' : 'none',
        }}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-cream text-xl leading-none"
            >
              ×
            </motion.span>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6 text-obsidian"
            >
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
                clipRule="evenodd"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
