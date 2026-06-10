"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  BrainCircuit,
  LockKeyhole,
  BarChart3,
  Repeat2,
  Link2,
} from "lucide-react";

const stats = [
  { value: "0%", label: "Bias Score", sub: "Zero demographic bias" },
  { value: "< 60s", label: "Evaluation Time", sub: "Per candidate" },
  { value: "100%", label: "Skills-Based", sub: "Assessment only" },
  { value: "100%", label: "On-Chain", sub: "Verifiable results" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
} as const;

export default function StatsSection() {
  return (
    <section className="border-y border-border bg-secondary-bg py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card-bg p-6 text-center backdrop-blur-sm"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium text-white">{stat.label}</div>
              <div className="mt-1 text-xs text-text-muted">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
