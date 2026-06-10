import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTRACT_ADDRESS } from "@/lib/genlayer-config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MeritTrial — AI-Verified, Bias-Free Candidate Evaluation on GenLayer",
    template: "%s · MeritTrial",
  },
  description:
    "Smart contracts that read GitHub, portfolios, and resumes — then analyze skills with AI. No names. No genders. No universities. Just proof of work, evaluated fairly on-chain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <Navbar contractAddress={CONTRACT_ADDRESS} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
