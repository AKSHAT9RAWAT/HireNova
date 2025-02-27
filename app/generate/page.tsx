"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(
        `Generate a complete HTML webpage with CSS based on this prompt: "${prompt}". Return only the raw HTML/CSS code without any additional explanations or markdown.`
      );
      setGeneratedCode(result.response.text());
    } catch (error) {
      console.error("Error generating webpage:", error);
      setGeneratedCode('<p class="text-red-500">Failed to generate webpage. Please try again.</p>');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <BackgroundGradient />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            Generate Webpage
          </h1>
          <GlowCard className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <textarea
                className="w-full h-32 p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter your webpage prompt (e.g., 'A portfolio page with a purple theme')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                <span>{isGenerating ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </GlowCard>

          {generatedCode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mt-12">
              <GlowCard className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">Generated Webpage</h2>
                <iframe
                  srcDoc={generatedCode}
                  className="w-full h-[600px] rounded-lg border border-purple-500/20"
                  sandbox="allow-same-origin allow-scripts"
                />
              </GlowCard>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}