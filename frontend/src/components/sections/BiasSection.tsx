"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BrainCircuit, LockKeyhole } from "lucide-react";

const proofs = [
  {
    icon: ShieldCheck,
    title: "Anonymized by Default",
    description:
      "Candidate submissions strip all demographic info. The AI never sees names, genders, ages, or universities.",
  },
  {
    icon: BrainCircuit,
    title: "Prompt-Engineered Fairness",
    description:
      "The evaluation prompt explicitly instructs the LLM: &quot;IGNORE name, gender, age, university pedigree, location, nationality. FOCUS ONLY ON: proof-of-work, code quality, problem-solving.&quot;",
  },
  {
    icon: LockKeyhole,
    title: "Auditable Fairness",
    description:
      "Researchers can audit the AI&apos;s decisions on-chain. Prove correlation between evaluation scores and demographic factors is zero.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5 },
  }),
} as const;

export default function BiasSection() {
  return (
    <section className="border-y border-border bg-secondary-bg py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            Our Commitment
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Bias Isn&apos;t Just Unfair —{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              It&apos;s Expensive
            </span>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">
            McKinsey estimates hiring bias costs $386B/year in lost productivity.
            MeritTrial&apos;s AI is explicitly instructed to ignore demographic signals.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {proofs.map((proof, i) => (
            <motion.div
              key={proof.title}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card-bg p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.06]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent-secondary/20 text-accent">
                <proof.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{proof.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                {proof.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
