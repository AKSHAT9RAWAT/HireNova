"use client";
// app/job-comparator/page.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronRight,
  Loader2,
  DollarSign,
  Gift,
  TrendingUp,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-black">
    <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
    <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-800/10 via-transparent to-transparent" />
    <div className="absolute inset-0 bg-grid-white/[0.02]" />
  </div>
);

const GlowCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000" />
    <div className="relative bg-black rounded-lg">
      {children}
    </div>
  </div>
);

const ProgressCircle = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <div className="relative w-20 h-20">
      <svg className="w-full h-full" viewBox="0 0 36 36">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#444"
          strokeWidth="2"
        />
        <motion.path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray="100"
          strokeDashoffset={100 - value}
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 100 - value }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
        {value}%
      </div>
    </div>
    <span className="mt-2 text-sm text-gray-400">{label}</span>
  </motion.div>
);

const JobComparatorPage = () => {
  const [job1, setJob1] = useState('');
  const [job2, setJob2] = useState('');
  const [result, setResult] = useState<{
    job1: { salary: string; perks: string[]; growth: string };
    job2: { salary: string; perks: string[]; growth: string };
    comparison: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompare = async () => {
    if (!job1.trim() || !job2.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Compare these two job offers based on salary, benefits (perks), and career growth. Return a JSON object with:
        - "job1": { salary: string, perks: array of strings, growth: string }
        - "job2": { salary: string, perks: array of strings, growth: string }
        - "comparison": string (a concise text summary of which job is better and why)

        Job Offer 1: "${job1}"
        Job Offer 2: "${job2}"
      `;

      const response = await model.generateContent(prompt);
      const cleanedResult = response.response.text().replace(/```json\n|\n```/g, '');
      const parsedResult = JSON.parse(cleanedResult);
      setResult(parsedResult);
    } catch (error) {
      console.error("Error comparing job offers:", error);
      setResult({
        job1: { salary: "Error", perks: ["Error processing perks"], growth: "Error" },
        job2: { salary: "Error", perks: ["Error processing perks"], growth: "Error" },
        comparison: "Failed to compare offers. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <BackgroundGradient />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
          AI Job Offer Comparator
        </h1>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Paste two job offers and let AI compare them with detailed visuals and insights.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-6xl mx-auto mb-16 px-6 flex gap-6"
      >
        <GlowCard className="flex-1">
          <div className="p-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
              Job Offer 1
            </h3>
            <textarea
              className="w-full h-48 p-4 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Paste Job Offer 1 here..."
              value={job1}
              onChange={(e) => setJob1(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </GlowCard>
        <GlowCard className="flex-1">
          <div className="p-6">
            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
              Job Offer 2
            </h3>
            <textarea
              className="w-full h-48 p-4 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Paste Job Offer 2 here..."
              value={job2}
              onChange={(e) => setJob2(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </GlowCard>
      </motion.div>

      {/* Compare Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mb-16"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCompare}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <span>Compare Offers</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {isLoading || result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-6 pb-16"
          >
            <GlowCard>
              <div className="p-6 space-y-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Comparing your job offers...</span>
                  </div>
                ) : (
                  <>
                    {/* Comparison Grid */}
                    <div className="grid grid-cols-2 gap-8">
                      {/* Job 1 */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-6">
                          Job Offer 1
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <DollarSign className="w-5 h-5" />
                              Salary
                            </h4>
                            <p className="text-gray-300 mt-2">{result?.job1.salary}</p>
                            <ProgressCircle label="Salary Score" value={75} color="#a855f7" />
                          </div>
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <Gift className="w-5 h-5" />
                              Perks
                            </h4>
                            <ul className="space-y-2 mt-2">
                              {result?.job1.perks.map((perk, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className="flex items-center gap-2 text-gray-300"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  {perk}
                                </motion.li>
                              ))}
                            </ul>
                            <ProgressCircle label="Perks Score" value={80} color="#a855f7" />
                          </div>
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Career Growth
                            </h4>
                            <p className="text-gray-300 mt-2">{result?.job1.growth}</p>
                            <ProgressCircle label="Growth Score" value={70} color="#a855f7" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Job 2 */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-6">
                          Job Offer 2
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <DollarSign className="w-5 h-5" />
                              Salary
                            </h4>
                            <p className="text-gray-300 mt-2">{result?.job2.salary}</p>
                            <ProgressCircle label="Salary Score" value={85} color="#ec4899" />
                          </div>
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <Gift className="w-5 h-5" />
                              Perks
                            </h4>
                            <ul className="space-y-2 mt-2">
                              {result?.job2.perks.map((perk, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className="flex items-center gap-2 text-gray-300"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  {perk}
                                </motion.li>
                              ))}
                            </ul>
                            <ProgressCircle label="Perks Score" value={70} color="#ec4899" />
                          </div>
                          <div>
                            <h4 className="text-lg text-purple-300 flex items-center gap-2">
                              <TrendingUp className="w-5 h-5" />
                              Career Growth
                            </h4>
                            <p className="text-gray-300 mt-2">{result?.job2.growth}</p>
                            <ProgressCircle label="Growth Score" value={90} color="#ec4899" />
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    {/* Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="mt-8"
                    >
                      <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 mb-4">
                        Comparison Summary
                      </h3>
                      <p className="text-gray-300">{result?.comparison}</p>
                    </motion.div>
                  </>
                )}
              </div>
            </GlowCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default JobComparatorPage;