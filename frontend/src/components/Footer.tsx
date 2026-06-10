"use client";

import { motion } from "framer-motion";
import { Scale, Twitter, Github, MessageCircle } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  Product: ["How It Works", "Features", "Use Cases", "Pricing"],
  Developers: ["Documentation", "GenLayer Docs", "GitHub", "Testnet"],
  Legal: ["Terms of Service", "Privacy Policy", "Arbitration Policy"],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary-bg">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent-secondary">
                <Scale className="h-5 w-5 text-white" />
              </span>
              <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                MeritTrial
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
              AI-Verified. Bias-Free. On-Chain.
              <br />
              Fair candidate evaluation powered by GenLayer Intelligent Contracts.
            </p>
            <div className="mt-6 flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-muted transition-colors hover:border-accent/50 hover:text-accent"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-text-muted transition-colors hover:text-accent"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-xs text-text-muted">
          © 2025 MeritTrial — Built on GenLayer. Powered by AI.
        </div>
      </div>
    </footer>
  );
}
