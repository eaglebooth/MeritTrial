"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Scale,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "For Employers", href: "#employers" },
  { label: "For Candidates", href: "#candidates" },
  { label: "FAQ", href: "#faq" },
];

interface NavbarProps {
  contractAddress?: string;
}

export default function Navbar({ contractAddress }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const explorerUrl = contractAddress
    ? `https://genlayer.com/explorer/address/${contractAddress}`
    : "#";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary">
              <Scale className="h-5 w-5 text-white" />
            </span>
            <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
              MeritTrial
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA + Contract */}
          <div className="hidden items-center gap-3 md:flex">
            {contractAddress && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white/5 px-3 py-2.5 text-xs font-medium text-text-secondary backdrop-blur-sm transition-colors hover:border-accent/50 hover:text-accent"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Contract
              </a>
            )}
            <a
              href="#cta"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:shadow-accent/40 hover:scale-105"
            >
              Start Evaluating
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/5 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              {contractAddress && (
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-xs font-medium text-text-secondary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Contract on Explorer
                </a>
              )}
              <a
                href="#cta"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block rounded-xl bg-gradient-to-r from-accent to-accent-secondary px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Start Evaluating
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
