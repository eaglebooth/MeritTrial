"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Loader2 } from "lucide-react";

type Stats = { jobs: number; applications: number; challenges: number; treasury: number };

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
} as const;

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export default function LiveContractStats() {
  const [stats, setStats] = useState<Stats>({ jobs: 0, applications: 0, challenges: 0, treasury: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      try {
        const [jobsRes, appsRes, challengesRes, treasuryRes] = await Promise.all([
          fetch("/api/contract?fn=get_job_count&args=[]"),
          fetch("/api/contract?fn=get_application_count&args=[]"),
          fetch("/api/contract?fn=get_challenge_count&args=[]"),
          fetch("/api/contract?fn=get_treasury_count&args=[]"),
        ]);

        if (cancelled) return;

        const [jobsJson, appsJson, challengesJson, treasuryJson] = await Promise.all([
          jobsRes.json(),
          appsRes.json(),
          challengesRes.json(),
          treasuryRes.json(),
        ]);

        const extract = (json: { data?: unknown }) =>
          json?.data !== undefined ? toNumber(json.data) : 0;

        setStats({
          jobs: extract(jobsJson),
          applications: extract(appsJson),
          challenges: extract(challengesJson),
          treasury: extract(treasuryJson),
        });

        if (typeof jobsJson?.contract === "string") setContractAddress(jobsJson.contract);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to fetch");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStats();
    return () => { cancelled = true; };
  }, []);

  const statItems = [
    { label: "Jobs Posted", value: stats.jobs },
    { label: "Applications", value: stats.applications },
    { label: "Challenges", value: stats.challenges },
    { label: "Treasury Records", value: stats.treasury },
  ];

  return (
    <section className="border-y border-border bg-secondary-bg py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
              Live On-Chain Stats
            </h3>
            <p className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <span className="inline-flex h-2 w-2 rounded-full bg-status-approved animate-pulse" />
              Connected to MeritTrial contract
            </p>
          </div>

          {contractAddress && (
            <a
              href={`https://genlayer.com/explorer/address/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card-bg px-3 py-1.5 text-xs font-mono text-text-secondary transition-colors hover:border-accent/50 hover:text-accent"
            >
              {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {error ? (
          <div className="mt-8 rounded-xl border border-status-rejected/30 bg-status-rejected/5 p-4 text-center text-sm text-status-rejected">
            {error}
          </div>
        ) : loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading on-chain data...
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {statItems.map((item, i) => (
              <motion.div
                key={item.label}
                custom={i}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="rounded-2xl border border-border bg-card-bg p-5 text-center backdrop-blur-sm"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                  {item.value}
                </div>
                <div className="mt-2 text-xs font-medium text-text-secondary">{item.label}</div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
