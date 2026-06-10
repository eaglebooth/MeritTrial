"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  GraduationCap,
  Globe2,
  HeartHandshake,
  BadgeCheck,
  UserX,
  Plane,
  Trophy,
} from "lucide-react";

const employers = [
  {
    icon: UserCheck,
    title: "Tech Hiring",
    description:
      "Evaluate GitHub repos, code challenges, and technical portfolios at scale. Find the best engineers without pedigree bias.",
  },
  {
    icon: GraduationCap,
    title: "University Recruiting",
    description:
      "Screen thousands of candidates from diverse backgrounds fairly. No more filtering by university name.",
  },
  {
    icon: Globe2,
    title: "Remote / Global Hiring",
    description:
      "Evaluate international candidates with the same rigor. No location bias, no network advantage.",
  },
  {
    icon: HeartHandshake,
    title: "Diversity & Inclusion",
    description:
      "Prove your hiring process is fair. On-chain audit trail shows zero demographic correlation.",
  },
];

const candidates = [
  {
    icon: BadgeCheck,
    title: "Verified Skill Records",
    description:
      "Your evaluations are stored on-chain. Build a verified portfolio of AI-assessed skills that you own.",
  },
  {
    icon: UserX,
    title: "Anonymous Applications",
    description:
      "Apply without revealing name, gender, age, or university. Let your code speak.",
  },
  {
    icon: Trophy,
    title: "Challenge Unfair Results",
    description:
      "Disagree with the evaluation? Challenge it within 7 days. A panel of 3 AI experts re-evaluates.",
  },
  {
    icon: Plane,
    title: "Global Opportunity",
    description:
      "Your skills are evaluated fairly regardless of where you&apos;re from. No passport premium.",
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

function UseCaseCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUp}
      className="flex gap-4 rounded-2xl border border-border bg-card-bg p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.06]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/20 to-accent-secondary/20 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function UseCasesSection() {
  return (
    <section id="employers" className="border-y border-border bg-secondary-bg py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            Use Cases
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Fair Evaluation for{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          {/* Employers */}
          <div>
            <h3 className="text-lg font-semibold text-white">For Employers</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Hire the best talent without unconscious bias getting in the way.
            </p>
            <div className="mt-6 space-y-4">
              {employers.map((item, i) => (
                <UseCaseCard key={item.title} {...item} index={i} />
              ))}
            </div>
          </div>

          {/* Candidates */}
          <div id="candidates">
            <h3 className="text-lg font-semibold text-white">For Candidates</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Let your skills speak for themselves. Own your verified evaluation record.
            </p>
            <div className="mt-6 space-y-4">
              {candidates.map((item, i) => (
                <UseCaseCard key={item.title} {...item} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
