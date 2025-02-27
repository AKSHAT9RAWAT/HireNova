"use client";
// app/learning-path/page.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronRight, Loader2, Target, Zap } from 'lucide-react';
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

const TimelineDot = () => (
  <motion.div
    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
  />
);

const LearningPathPage = () => {
  const [role, setRole] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [result, setResult] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim() || !timeframe.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Suggest a detailed, step-by-step learning path to become a "${role}" in ${timeframe}. 
        Return the result as a JSON array of strings, where each string is a clear, concise step 
        (e.g., "Learn Python basics", "Complete a project on neural networks"). 
        Focus on key skills, resources, and milestones.
      `;

      const response = await model.generateContent(prompt);
      const cleanedResult = response.response.text().replace(/```json\n|\n```/g, '');
      const parsedResult = JSON.parse(cleanedResult);
      setResult(parsedResult);
    } catch (error) {
      console.error("Error generating learning path:", error);
      setResult(["Failed to generate learning path. Please try again."]);
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
          AI-Powered Learning Path Generator
        </h1>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Enter your target role and timeframe to get a personalized skill-improvement plan.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto mb-16 px-6"
      >
        <GlowCard>
          <div className="p-6 grid grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="text-sm text-gray-400 mb-2 block">Target Role</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Machine Learning Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="text-sm text-gray-400 mb-2 block">Timeframe</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 6 months"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                disabled={isLoading}
              />
            </motion.div>
          </div>
          <motion.div
            className="flex justify-center pb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              animate={{ scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity } }}
              onClick={handleGenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Generate Path</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </motion.div>
        </GlowCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {isLoading || result ? (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-6 pb-16"
          >
            <GlowCard>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Generating your learning path...</span>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-400" />
                      Your Learning Path
                    </h3>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-900/50" />
                      {/* Steps */}
                      {result?.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.2 }}
                          className="flex items-start gap-4 mb-6"
                        >
                          <TimelineDot />
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-purple-300 flex items-center gap-2">
                              <Zap className="w-5 h-5" />
                              Step {index + 1}
                            </h4>
                            <p className="text-gray-300 mt-1">{step}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlowCard>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default LearningPathPage;