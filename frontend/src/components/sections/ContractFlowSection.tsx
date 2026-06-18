"use client";

import { FormEvent, useEffect, useState } from "react";
import { CONTRACT_ADDRESS } from "@/lib/genlayer-config";
import { connectWallet, readContract, writeContract } from "@/app/api/contract/genlayer";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Coins,
  ExternalLink,
  FileJson,
  Gavel,
  GitBranch,
  Loader2,
  PlusCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";

type JobForm = {
  title: string;
  description: string;
  requirementsJson: string;
  company: string;
  evaluationFee: string;
  challengeWindowBlocks: string;
};

type ApplicationForm = {
  jobId: string;
  candidateId: string;
  resumeUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  codeChallengeUrl: string;
};

type ContractStats = {
  jobs: string;
  applications: string;
  challenges: string;
  treasury: string;
};

const defaultJobForm: JobForm = {
  title: "Senior Frontend Engineer",
  description: "Build production web apps with React, TypeScript, and GenLayer contract integration.",
  requirementsJson: JSON.stringify({
    required: ["React", "TypeScript", "API integration", "testing"],
    minExperienceYears: 3,
  }, null, 2),
  company: "MeritTrial Labs",
  evaluationFee: "1",
  challengeWindowBlocks: "100",
};

const defaultApplicationForm: ApplicationForm = {
  jobId: "",
  candidateId: "",
  resumeUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  codeChallengeUrl: "",
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "bigint") return Number(value);
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function formatResponse(value: unknown): string {
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function ContractFlowSection() {
  const [walletAddress, setWalletAddress] = useState("");
  const [jobForm, setJobForm] = useState<JobForm>(defaultJobForm);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>(defaultApplicationForm);
  const [coverLetterUrl, setCoverLetterUrl] = useState("");
  const [challengeReason, setChallengeReason] = useState("");
  const [lastJobId, setLastJobId] = useState("");
  const [lastApplicationId, setLastApplicationId] = useState("");
  const [stats, setStats] = useState<ContractStats>({ jobs: "0", applications: "0", challenges: "0", treasury: "0" });
  const [result, setResult] = useState("");
  const [resultTitle, setResultTitle] = useState("Ready");
  const [isBusy, setIsBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const contractAddress = CONTRACT_ADDRESS;
  const explorerUrl = contractAddress ? `https://genlayer.com/explorer/address/${contractAddress}` : "#";
  const network = process.env.NEXT_PUBLIC_NETWORK ?? "testnetAsimov";

  async function refreshStats() {
    const [jobs, applications, challenges, treasury] = await Promise.all([
      readContract("get_job_count", []),
      readContract("get_application_count", []),
      readContract("get_challenge_count", []),
      readContract("get_treasury_count", []),
    ]);

    setStats({
      jobs: String(toNumber(jobs.data)),
      applications: String(toNumber(applications.data)),
      challenges: String(toNumber(challenges.data)),
      treasury: String(toNumber(treasury.data)),
    });
  }

  async function loadJob() {
    const jobId = lastJobId.trim();
    if (!jobId) {
      setAlert("Enter a job ID first.", "error");
      return;
    }

    const response = await readContract("get_job", [parseNumber(jobId)]);
    setResultTitle(`Job #${jobId}`);
    setResult(formatResponse(response.data));
    setAlert(response.success ? "Job loaded." : `Failed to load job: ${response.error}`, response.success ? "success" : "error");
  }

  async function loadApplication() {
    const applicationId = lastApplicationId.trim();
    if (!applicationId) {
      setAlert("Enter an application ID first.", "error");
      return;
    }

    const response = await readContract("get_application", [parseNumber(applicationId)]);
    setResultTitle(`Application #${applicationId}`);
    setResult(formatResponse(response.data));
    setAlert(response.success ? "Application loaded." : `Failed to load application: ${response.error}`, response.success ? "success" : "error");
  }

  async function runWrite(label: string, functionName: string, args: unknown[], afterWrite?: () => Promise<void>) {
    if (!contractAddress) {
      setAlert("Contract address is not configured.", "error");
      return;
    }

    setIsBusy(true);
    setAlert(`${label}...`, "info");
    setResultTitle(label);

    const response = await writeContract(functionName, args, contractAddress);
    if (response.success) {
      setResult(formatResponse(response));
      setAlert(`${label} submitted. Tx: ${response.hash?.slice(0, 10)}...${response.hash?.slice(-8)}`, "success");
      if (afterWrite) {
        await afterWrite();
      }
    } else {
      setResult(formatResponse(response));
      setAlert(response.error ?? "Transaction failed", "error");
    }

    setIsBusy(false);
  }

  async function createJob(event: FormEvent) {
    event.preventDefault();
    await runWrite(
      "Create job",
      "create_job",
      [
        jobForm.title,
        jobForm.description,
        jobForm.requirementsJson,
        jobForm.company,
        parseNumber(jobForm.evaluationFee),
        parseNumber(jobForm.challengeWindowBlocks),
      ],
      refreshStats,
    );
  }

  async function fundJob() {
    if (!lastJobId.trim()) {
      setAlert("Create or enter a job ID first.", "error");
      return;
    }

    await runWrite(
      "Fund job",
      "fund_job",
      [parseNumber(lastJobId), parseNumber(jobForm.evaluationFee)],
      async () => {
        const response = await readContract("get_job", [parseNumber(lastJobId)]);
        setResultTitle(`Job #${lastJobId} balance`);
        setResult(formatResponse(response.data));
      },
    );
  }

  async function submitApplication(event: FormEvent) {
    event.preventDefault();
    await runWrite(
      "Submit application",
      "submit_application",
      [
        parseNumber(applicationForm.jobId),
        applicationForm.candidateId,
        applicationForm.resumeUrl,
        applicationForm.githubUrl,
        applicationForm.portfolioUrl,
        applicationForm.codeChallengeUrl,
      ],
      refreshStats,
    );
  }

  async function attachCoverLetter() {
    if (!lastApplicationId.trim()) {
      setAlert("Submit or enter an application ID first.", "error");
      return;
    }

    await runWrite(
      "Attach cover letter",
      "attach_cover_letter",
      [parseNumber(lastApplicationId), coverLetterUrl],
    );
  }

  async function evaluateApplication() {
    if (!lastApplicationId.trim()) {
      setAlert("Submit or enter an application ID first.", "error");
      return;
    }

    await runWrite(
      "Evaluate application",
      "evaluate_application",
      [parseNumber(lastApplicationId)],
      async () => {
        const status = await readContract("get_application_status", [parseNumber(lastApplicationId)]);
        const evaluation = await readContract("get_evaluation", [parseNumber(lastApplicationId)]);
        setResultTitle(`Evaluation #${lastApplicationId}`);
        setResult(`${status.data}\n\n${formatResponse(evaluation.data)}`);
      },
    );
  }

  async function challengeEvaluation() {
    if (!lastApplicationId.trim()) {
      setAlert("Submit or enter an application ID first.", "error");
      return;
    }
    if (!challengeReason.trim()) {
      setAlert("Enter a challenge reason first.", "error");
      return;
    }

    await runWrite(
      "Challenge evaluation",
      "challenge_evaluation",
      [parseNumber(lastApplicationId), challengeReason],
      async () => {
        const status = await readContract("get_application_status", [parseNumber(lastApplicationId)]);
        setResultTitle(`Challenge #${lastApplicationId}`);
        setResult(formatResponse(status.data));
      },
    );
  }

  async function finalizeEvaluation() {
    if (!lastApplicationId.trim()) {
      setAlert("Submit or enter an application ID first.", "error");
      return;
    }

    await runWrite(
      "Finalize evaluation",
      "finalize_evaluation",
      [parseNumber(lastApplicationId)],
      async () => {
        const status = await readContract("get_application_status", [parseNumber(lastApplicationId)]);
        setResultTitle(`Final status #${lastApplicationId}`);
        setResult(formatResponse(status.data));
      },
    );
  }

  function setAlert(nextMessage: string, type: "success" | "error" | "info") {
    setMessageType(type);
    setMessage(nextMessage);
  }

  useEffect(() => {
    void refreshStats();
  }, []);

  return (
    <section id="flow" className="border-y border-border bg-secondary-bg py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Live contract flow</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            Create, submit, evaluate, and challenge on-chain
          </h2>
          <p className="mt-4 text-base text-text-secondary">
            This UI calls the deployed MeritTrial contract through genlayer-js. Connect a GenLayer-compatible wallet,
            then run the full hiring decision flow from the browser.
          </p>
        </div>

        <div className="mt-8 grid gap-4 text-sm text-text-secondary md:grid-cols-4">
          {[
            ["Jobs", stats.jobs],
            ["Applications", stats.applications],
            ["Challenges", stats.challenges],
            ["Treasury Records", stats.treasury],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-card-bg p-4">
              <div className="text-xs uppercase tracking-wider text-text-muted">{label}</div>
              <div className="mt-1 text-2xl font-bold text-text-primary">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                    <Wallet className="h-5 w-5 text-accent" />
                    Wallet
                  </div>
                  <p className="mt-2 text-sm text-text-secondary">
                    Required for create, fund, submit, evaluate, and challenge transactions.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={async () => {
                    const connected = await connectWallet();
                    if (connected.success && connected.address) {
                      setWalletAddress(connected.address);
                      setAlert("Wallet connected.", "success");
                    } else {
                      setAlert(connected.error ?? "Failed to connect wallet", "error");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {walletAddress ? "Reconnect" : "Connect wallet"}
                </button>
              </div>

              {walletAddress ? (
                <div className="mt-4 rounded-2xl border border-status-approved/30 bg-status-approved/5 p-3 text-xs text-status-approved">
                  <span className="font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</span>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-status-pending/30 bg-status-pending/5 p-3 text-xs text-status-pending">
                  Wallet not connected yet.
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-border bg-background/40 p-3 text-xs">
                <div className="flex justify-between">
                  <span>Network</span>
                  <span className="font-mono text-text-primary">{network}</span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span>Contract</span>
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-accent hover:underline"
                  >
                    {contractAddress ? `${contractAddress.slice(0, 8)}...${contractAddress.slice(-6)}` : "Not set"}
                    <ExternalLink className="ml-1 inline h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={createJob} className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                <PlusCircle className="h-5 w-5 text-accent" />
                Create job
              </div>
              <div className="mt-5 grid gap-4">
                {(["title", "description", "requirementsJson", "company", "evaluationFee", "challengeWindowBlocks"] as const).map((field) => (
                  <label key={field} className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {field === "requirementsJson" ? (
                      <textarea
                        value={jobForm[field]}
                        onChange={(event) => setJobForm({ ...jobForm, [field]: event.target.value })}
                        disabled={isBusy}
                        rows={6}
                        className="mt-2 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    ) : (
                      <input
                        type={field === "evaluationFee" || field === "challengeWindowBlocks" ? "number" : "text"}
                        value={jobForm[field]}
                        onChange={(event) => setJobForm({ ...jobForm, [field]: event.target.value })}
                        disabled={isBusy}
                        className="mt-2 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    )}
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create job
                </button>
              </div>
            </form>

            <div className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                <Coins className="h-5 w-5 text-accent" />
                Fund job
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                Funding pays the per-application evaluation fee before AI evaluation can run.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  value={lastJobId}
                  onChange={(event) => setLastJobId(event.target.value)}
                  disabled={isBusy}
                  placeholder="Job ID"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={fundJob}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Coins className="h-4 w-4" />
                  Fund
                </button>
              </div>
            </div>

            <form onSubmit={submitApplication} className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                <GitBranch className="h-5 w-5 text-accent" />
                Submit application
              </div>
              <div className="mt-5 grid gap-4">
                {(["jobId", "candidateId", "resumeUrl", "githubUrl", "portfolioUrl", "codeChallengeUrl"] as const).map((field) => (
                  <label key={field} className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                      {field.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <input
                      type={field === "jobId" ? "number" : "text"}
                      value={applicationForm[field]}
                      onChange={(event) => setApplicationForm({ ...applicationForm, [field]: event.target.value })}
                      disabled={isBusy}
                      className="mt-2 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </label>
                ))}
                <button
                  type="submit"
                  disabled={isBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <GitBranch className="h-4 w-4" />
                  Submit application
                </button>
              </div>
            </form>

            <div className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                <FileJson className="h-5 w-5 text-accent" />
                Attach cover letter
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  value={lastApplicationId}
                  onChange={(event) => setLastApplicationId(event.target.value)}
                  disabled={isBusy}
                  placeholder="Application ID"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <input
                  type="url"
                  value={coverLetterUrl}
                  onChange={(event) => setCoverLetterUrl(event.target.value)}
                  disabled={isBusy}
                  placeholder="Cover letter URL"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={attachCoverLetter}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent/10 px-5 py-3 text-sm font-semibold text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileJson className="h-4 w-4" />
                  Attach
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                <BrainCircuit className="h-5 w-5 text-accent" />
                Evaluate and challenge
              </div>
              <p className="mt-2 text-sm text-text-secondary">
                Run AI evaluation, then challenge the result if the verdict needs a three-panelist review.
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="number"
                  value={lastApplicationId}
                  onChange={(event) => setLastApplicationId(event.target.value)}
                  disabled={isBusy}
                  placeholder="Application ID"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={evaluateApplication}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <BrainCircuit className="h-4 w-4" />
                  Evaluate
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={challengeReason}
                  onChange={(event) => setChallengeReason(event.target.value)}
                  disabled={isBusy}
                  placeholder="Challenge reason"
                  className="min-w-0 flex-1 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm text-text-primary outline-none transition focus:border-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={challengeEvaluation}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-status-pending/10 px-5 py-3 text-sm font-semibold text-status-pending transition hover:bg-status-pending/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Gavel className="h-4 w-4" />
                  Challenge
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={finalizeEvaluation}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-status-approved/10 px-5 py-3 text-sm font-semibold text-status-approved transition hover:bg-status-approved/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Finalize
                </button>
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => void refreshStats()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-5 py-3 text-sm font-semibold text-text-secondary transition hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh stats
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card-bg p-6 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-text-primary">
                  <ArrowRight className="h-5 w-5 text-accent" />
                  Output
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={loadJob}
                    className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs font-medium text-text-secondary transition hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Load job
                  </button>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={loadApplication}
                    className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs font-medium text-text-secondary transition hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Load application
                  </button>
                </div>
              </div>

              {message && (
                <div
                  className={`mt-5 flex items-start gap-2 rounded-2xl border p-3 text-sm ${
                    messageType === "success"
                      ? "border-status-approved/30 bg-status-approved/5 text-status-approved"
                      : messageType === "error"
                        ? "border-status-rejected/30 bg-status-rejected/5 text-status-rejected"
                        : "border-accent/30 bg-accent/5 text-accent"
                  }`}
                >
                  {messageType === "error" ? (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : messageType === "success" ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  ) : (
                    isBusy ? (
                      <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0" />
                    )
                  )}
                  <span>{message}</span>
                </div>
              )}

              <div className="mt-5">
                <div className="text-xs font-medium uppercase tracking-wider text-text-muted">{resultTitle}</div>
                <pre className="mt-3 max-h-[520px] overflow-auto rounded-2xl border border-border bg-background/70 p-4 text-xs leading-relaxed text-text-secondary">
                  {result || "Run a transaction or load a job/application to see contract output here."}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
