"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function CTASection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section id="cta" className="relative overflow-hidden py-24 lg:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-accent to-accent-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Hire Fairly?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join the waitlist for early access to MeritTrial on GenLayer testnet.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-xl border-0 bg-white/10 px-5 py-3.5 text-sm text-white placeholder-white/50 backdrop-blur-sm outline-none ring-1 ring-white/20 transition-all focus:ring-2 focus:ring-white/40"
              />
              <button
                type="submit"
                className="rounded-xl bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:scale-105"
              >
                Join Waitlist
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 rounded-xl bg-white/10 px-6 py-4 text-sm font-medium text-white backdrop-blur-sm"
            >
              You&apos;re on the list! We&apos;ll be in touch soon.
            </motion.div>
          )}

          <p className="mt-4 text-xs text-white/50">
            No spam. Only product updates. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
