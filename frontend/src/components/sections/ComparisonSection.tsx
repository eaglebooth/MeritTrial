"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  GitBranch,
  ClipboardList,
  ShieldCheck,
  MessageSquareX,
  Wallet,
  Clock,
  Scale,
} from "lucide-react";

const comparisons = [
  {
    label: "Evaluation Basis",
    traditional: "Resume keywords + pedigree",
    merittrial: "Actual code + skills proof",
  },
  {
    label: "Bias",
    traditional: "Name, university, gender, location",
    merittrial: "Explicitly excluded from analysis",
  },
  {
    label: "Speed",
    traditional: "23 hours per resume",
    merittrial: "< 60 seconds",
  },
  {
    label: "Scale",
    traditional: "Manual review limits",
    merittrial: "Unlimited parallel AI evaluation",
  },
  {
    label: "Transparency",
    traditional: "Opaque decisions",
    merittrial: "Fully auditable on-chain",
  },
  {
    label: "Appeal",
    traditional: "HR manager discretion",
    merittrial: "Multi-panel AI re-evaluation",
  },
  {
    label: "Cost",
    traditional: "$500–4,000 per hire (recruiter fee)",
    merittrial: "1–3% platform fee",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
} as const;

export default function ComparisonSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            VS Traditional Hiring
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Why{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              MeritTrial
            </span>{" "}
            Changes Everything
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-16 overflow-hidden rounded-2xl border border-border bg-card-bg backdrop-blur-sm"
        >
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 font-medium text-text-muted">Criteria</th>
                <th className="px-6 py-4 font-medium text-text-muted">Traditional Hiring</th>
                <th className="px-6 py-4 font-medium text-accent">MeritTrial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparisons.map((row, i) => (
                <motion.tr
                  key={row.label}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="transition-colors hover:bg-white/[0.02]"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                    {row.label}
                  </td>
                  <td className="px-6 py-4 text-text-muted line-through decoration-text-muted/50">
                    {row.traditional}
                  </td>
                  <td className="px-6 py-4 font-medium text-accent">
                    {row.merittrial}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
