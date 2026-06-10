"use client";

import { motion } from "framer-motion";
import { Scale, FileText, Code, CheckCircle2, Shield, Zap, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Scale,
    title: "Anonymized Evaluation",
    description:
      "AI only sees skills evidence — no names, genders, universities, or photos. Demographic info is explicitly excluded from the analysis.",
  },
  {
    icon: Globe,
    title: "Native Web Evidence Fetching",
    description:
      "AI jurors read GitHub repos, portfolio sites, and resume URLs directly on-chain. No oracles, no off-chain data silos.",
  },
  {
    icon: Code,
    title: "Deep Code Analysis",
    description:
      "LLM reads actual code from GitHub — architecture, complexity, commit patterns, collaboration quality. Not just keyword matching.",
  },
  {
    icon: Zap,
    title: "Optimistic Democracy Consensus",
    description:
      "Multiple AI validators must reach byte-identical verdict. Slashing prevents collusion. The network agrees on the outcome.",
  },
  {
    icon: Shield,
    title: "Challengeable Verdicts",
    description:
      "7-day challenge window. Disputed evaluations trigger 3-panel AI re-evaluation. Quality assurance built into the protocol.",
  },
  {
    icon: Lock,
    title: "Blockchain-Verified Results",
    description:
      "Every evaluation is stored on-chain with timestamp. Immutable audit trail. Employers prove they used fair evaluation. Candidates own their verified records.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
} as const;

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            Features
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Built for{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              Fair Hiring
            </span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            Every feature is designed to eliminate bias and surface true candidate potential.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="group rounded-2xl border border-border bg-card-bg p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
