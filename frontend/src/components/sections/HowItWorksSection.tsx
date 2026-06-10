"use client";

import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck, FileText, Code2 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: FileText,
    title: "Post Job / Submit Application",
    description:
      "Employers post job requirements. Candidates submit anonymized evidence: GitHub URLs, portfolio links, code challenges. No names, no photos, no demographic info.",
    tech: "Anonymized submission via smart contract",
  },
  {
    num: "02",
    icon: Code2,
    title: "AI Analysis",
    description:
      "GenLayer validators fetch all evidence via web.get(). AI reads code, analyzes skills against requirements, applies technical assessment standards, and reaches consensus verdict — completely ignoring demographic signals.",
    tech: "gl.eq_principle.strict_eq() consensus",
  },
  {
    num: "03",
    icon: ShieldCheck,
    title: "Verified Result",
    description:
      "Smart contract stores the evaluation on-chain. Immutable, auditable, challengeable. Employers see skills-based recommendation. Candidates get fair, unbiased feedback.",
    tech: "On-chain immutable storage",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
} as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-y border-border bg-secondary-bg py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            How It Works
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            From Resume to Verdict in{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              3 Steps
            </span>
          </h2>
        </motion.div>

        <div className="mt-20 grid gap-8 lg:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="relative"
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-px w-full bg-gradient-to-r from-accent/50 to-accent-secondary/50 lg:block" />
              )}

              <div className="relative rounded-2xl border border-border bg-card-bg p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.06]">
                {/* Step number */}
                <span className="text-5xl font-bold bg-gradient-to-br from-accent/30 to-accent-secondary/30 bg-clip-text text-transparent">
                  {step.num}
                </span>

                <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 text-accent">
                  <step.icon className="h-6 w-6" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {step.description}
                </p>

                <div className="mt-5 rounded-lg bg-black/30 px-3 py-2 font-mono text-[11px] text-text-muted">
                  {step.tech}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
