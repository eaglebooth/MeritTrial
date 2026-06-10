"use client";

import { motion } from "framer-motion";
import { Cpu, FileCode, Braces } from "lucide-react";

const codeBlock = `@gl.public.write
def evaluate_application(self, application_id: u256) -> str:
  # Fetch candidate evidence from URLs
  github = gl.nondet.web.get(github_url)
  portfolio = gl.nondet.web.get(portfolio_url)
  resume = gl.nondet.web.get(resume_url)

  # AI analysis — bias-free by design
  prompt = build_evaluation_prompt(
    job_requirements, github, portfolio, resume
  )
  verdict = gl.nondet.exec_prompt(prompt)

  # Consensus: all validators must agree
  result = gl.eq_principle.strict_eq(evaluate)
  return json.loads(result)`;

const badges = ["GenVM Runtime", "Python Contracts", "AI Validator Network"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
} as const;

export default function TechSection() {
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
            Under the Hood
          </span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Powered by{" "}
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              GenLayer&apos;s Intelligent Contracts
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: description */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <p className="text-lg leading-relaxed text-text-secondary">
              MeritTrial runs on GenLayer&apos;s GenVM — a Python-based execution environment where smart contracts can fetch the internet and run AI reasoning natively.
            </p>
            <p className="leading-relaxed text-text-secondary">
              When an evaluation is requested, AI validators independently: (1) fetch candidate evidence from GitHub, portfolio, and resume URLs, (2) analyze code quality, skills match, and experience depth, (3) produce a structured JSON verdict.
            </p>
            <p className="leading-relaxed text-text-secondary">
              The <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-accent">gl.eq_principle.strict_eq()</code> consensus mechanism ensures all validators produce byte-identical outputs — no room for manipulation.
            </p>
            <p className="leading-relaxed text-text-secondary">
              Results are stored on-chain, immutable, and auditable by anyone.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-border bg-card-bg px-4 py-1.5 text-xs font-medium text-text-muted"
                >
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right: code block */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="rounded-2xl border border-border bg-[#0d1117] p-6 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-text-muted">MeritTrial.py</span>
              </div>
              <pre className="mt-4 overflow-x-auto font-mono text-[13px] leading-relaxed text-gray-300">
                <code>
                  <span className="text-purple-400">@gl.public.write</span>
                  {"\n"}
                  <span className="text-blue-400">def</span> <span className="text-yellow-300">evaluate_application</span>(
                  {"\n"}
                  {"  "}<span className="text-orange-300">self</span>,{" "}
                  <span className="text-orange-300">application_id</span>: <span className="text-green-400">u256</span>
                  {"\n"}
                  ) -&gt; <span className="text-green-400">str</span>:
                  {"\n"}
                  {"  "}<span className="text-gray-500"># Fetch candidate evidence from URLs</span>
                  {"\n"}
                  {"  "}<span className="text-orange-300">github</span> = gl.nondet.web.get(github_url)
                  {"\n"}
                  {"  "}<span className="text-orange-300">portfolio</span> = gl.nondet.web.get(portfolio_url)
                  {"\n"}
                  {"  "}<span className="text-orange-300">resume</span> = gl.nondet.web.get(resume_url)
                  {"\n"}
                  {"\n"}
                  {"  "}<span className="text-gray-500"># AI analysis — bias-free by design</span>
                  {"\n"}
                  {"  "}<span className="text-orange-300">prompt</span> = build_evaluation_prompt(
                  {"\n"}
                  {"    "}job_requirements, github, portfolio, resume
                  {"\n"}
                  {"  "})
                  {"\n"}
                  {"  "}<span className="text-orange-300">verdict</span> = gl.nondet.exec_prompt(prompt)
                  {"\n"}
                  {"\n"}
                  {"  "}<span className="text-gray-500"># Consensus: all validators must agree</span>
                  {"\n"}
                  {"  "}<span className="text-orange-300">result</span> = gl.eq_principle.strict_eq(evaluate)
                  {"\n"}
                  {"  "}<span className="text-blue-400">return</span> json.loads(result)
                </code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
