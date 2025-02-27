"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-black">
    <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
    <div className="absolute inset-0 bg-grid-white/[0.02]" />
  </div>
);

const GlowCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000" />
    <div className="relative bg-black rounded-lg p-6">{children}</div>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <BackgroundGradient />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            AI Webpage Tools
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Generate stunning webpages from prompts or modify existing code with AI-powered suggestions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link href="/generate">
              <GlowCard>
                <FileText className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Generate Webpage</h3>
                <p className="text-gray-400">Create a webpage from a text prompt</p>
              </GlowCard>
            </Link>
            <Link href="/modify">
              <GlowCard>
                <Code className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-purple-300 mb-2">Modify Code</h3>
                <p className="text-gray-400">Upload and enhance your frontend code</p>
              </GlowCard>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}