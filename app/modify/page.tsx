"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronRight, Upload } from 'lucide-react';
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

export default function ModifyPage() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [modifiedCode, setModifiedCode] = useState<string | null>(null);
  const [isModifying, setIsModifying] = useState(false);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setFileContent(e.target.result as string);
    reader.readAsText(file);
  };

  const handleModify = async () => {
    if (!fileContent || !prompt) return;
    setIsModifying(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const result = await model.generateContent(
        `Modify this HTML/CSS code based on this prompt: "${prompt}". Original code: \n${fileContent}\nReturn only the raw modified HTML/CSS code without explanations or markdown.`
      );
      setModifiedCode(result.response.text());
    } catch (error) {
      console.error("Error modifying code:", error);
      setModifiedCode('<p class="text-red-500">Failed to modify code. Please try again.</p>');
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <BackgroundGradient />
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            Modify Frontend Code
          </h1>

          <GlowCard className="max-w-4xl mx-auto mb-8">
            <div className="space-y-6">
              <label className="flex items-center gap-2 p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 cursor-pointer">
                <Upload className="w-6 h-6 text-purple-400" />
                <span className="text-purple-300">Upload HTML File</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".html"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                />
              </label>
              <textarea
                className="w-full h-32 p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter modification prompt (e.g., 'Add a navbar with a purple background')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <button
                onClick={handleModify}
                disabled={isModifying || !fileContent || !prompt}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
              >
                {isModifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                <span>{isModifying ? 'Modifying...' : 'Modify'}</span>
              </button>
            </div>
          </GlowCard>

          {fileContent && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              <GlowCard>
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">Original Code</h2>
                <textarea
                  className="w-full h-[400px] p-4 rounded-lg bg-purple-900/20 border border-purple-500/20 text-white font-mono text-sm"
                  value={fileContent}
                  readOnly
                />
              </GlowCard>
              <GlowCard>
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">Preview</h2>
                <iframe
                  srcDoc={modifiedCode || fileContent}
                  className="w-full h-[400px] rounded-lg border border-purple-500/20"
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