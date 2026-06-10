"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How does MeritTrial prevent bias?",
    a: "AI prompt explicitly instructs ignoring demographic info. Only skills-based evidence is analyzed. The on-chain audit trail allows independent verification of zero demographic correlation.",
  },
  {
    q: "Can AI really evaluate candidates fairly?",
    a: "GenLayer&apos;s Optimistic Democracy ensures multiple AI validators must agree on the verdict. The consensus mechanism + challenge window provides strong fairness guarantees.",
  },
  {
    q: "What evidence can candidates submit?",
    a: "GitHub repos, portfolio websites, resume URLs, code challenge submissions, cover letters. All submitted as URLs — the AI fetches and reads them directly.",
  },
  {
    q: "Is the evaluation legally binding?",
    a: "Results are stored on-chain as immutable records. Employers can use them as part of their hiring decision. The evaluation itself is a verified assessment, not an employment contract.",
  },
  {
    q: "What if a candidate disagrees with the evaluation?",
    a: "7-day challenge window. When challenged, a panel of 3 independent AI validators re-evaluates. If 2/3 disagree with the original, the verdict is overturned.",
  },
  {
    q: "How much does it cost?",
    a: "1–3% of the evaluation fee. Traditional recruiter fees are 15–20% of first-year salary. MeritTrial is dramatically cheaper and fairer.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex rounded-full border border-border px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-text-muted">
            FAQ
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Common Questions
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-2xl border border-border bg-card-bg backdrop-blur-sm transition-colors hover:border-accent/20"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-sm font-semibold text-white sm:text-base">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-text-secondary">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
