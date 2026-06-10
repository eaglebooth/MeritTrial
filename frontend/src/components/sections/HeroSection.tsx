"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";

const evaluationData = {
  technicalRating: 87,
  recommendation: "STRONG_HIRE" as const,
  skillsMatched: ["Python", "React", "PostgreSQL", "Docker", "AWS"],
  skillsMissing: ["Kubernetes"],
  codeQuality: "EXCELLENT" as const,
};

const badgeColorMap: Record<string, string> = {
  STRONG_HIRE: "bg-status-approved/20 text-status-approved",
  HIRE: "bg-accent/20 text-accent",
  REVIEW: "bg-status-pending/20 text-status-pending",
  NO_HIRE: "bg-status-rejected/20 text-status-rejected",
};

const codeQualityColorMap: Record<string, string> = {
  EXCELLENT: "text-status-approved",
  GOOD: "text-accent",
  FAIR: "text-status-pending",
  POOR: "text-status-rejected",
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#0a0a0f]">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow orbs */}
        <div className="animate-float absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="animate-float-delayed absolute right-[10%] top-[40%] h-[400px] w-[400px] rounded-full bg-accent-secondary/20 blur-[100px]" />
        <div className="animate-pulse-glow absolute bottom-[10%] left-[30%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="pt-24 lg:pt-0"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-xs font-medium text-accent"
              >
                <Zap className="h-3.5 w-3.5" />
                Powered by GenLayer Blockchain
              </motion.span>

              {/* Headline */}
              <h1 className="mt-8 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                  Hiring, Without the Bias.
                </span>
                <br />
                <span className="text-white">AI-Verified Talent Evaluation.</span>
              </h1>

              {/* Subheadline */}
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-text-secondary">
                Smart contracts that read GitHub, portfolios, and resumes — then analyze skills with AI.
                No names. No genders. No universities. Just proof of work, evaluated fairly on-chain.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="#employers"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 hover:scale-105"
                >
                  For Employers
                  <ChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="#candidates"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:scale-105"
                >
                  For Candidates
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-status-approved" />
                  50+ AI Validators
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-status-approved" />
                  Bias-Free by Design
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-status-approved" />
                  Immutable Results
                </span>
              </div>
            </motion.div>

            {/* Right: mockup UI */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-accent/20 to-accent-secondary/20 blur-2xl" />

                <div className="relative rounded-2xl border border-border bg-card-bg p-6 backdrop-blur-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <div className="text-xs text-text-muted">Candidate Evaluation</div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        candidate_0x7f3a...9b2e
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColorMap[evaluationData.recommendation]}`}
                    >
                      {evaluationData.recommendation.replace("_", " ")}
                    </span>
                  </div>

                  {/* Score */}
                  <div className="mt-6 flex items-center gap-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-accent">
                      <span className="text-2xl font-bold text-white">
                        {evaluationData.technicalRating}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Technical Rating</div>
                      <div className="mt-1 text-xs text-text-muted">out of 100</div>
                      <div className="mt-2 text-xs text-accent">
                        Code Quality:{" "}
                        <span className={codeQualityColorMap[evaluationData.codeQuality]}>
                          {evaluationData.codeQuality}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <div className="text-xs font-medium text-text-muted">Skills Matched</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {evaluationData.skillsMatched.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-status-approved/10 px-2.5 py-1 text-xs font-medium text-status-approved"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-medium text-text-muted">Skills Missing</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {evaluationData.skillsMissing.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-status-rejected/10 px-2.5 py-1 text-xs font-medium text-status-rejected"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs text-text-muted">
                    <span>Confidence: 9/10</span>
                    <span>Evaluated 42s ago</span>
                    <span className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-status-approved" />
                      On-chain
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
