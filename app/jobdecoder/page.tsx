"use client";
// app/job-decoder/page.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  ChevronRight,
  Loader2,
  Briefcase,
  Brain,
  Award,
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

const ProgressBar = ({ label, value }: { label: string; value: number }) => (
  <motion.div
    initial={{ opacity: 0, width: 0 }}
    animate={{ opacity: 1, width: "100%" }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="space-y-2"
  >
    <div className="flex justify-between text-sm text-gray-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-purple-900/30 rounded-full h-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 h-2 rounded-full"
      />
    </div>
  </motion.div>
);

const JobDecoderPage = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<{
    skills: string[];
    responsibilities: string[];
    qualifications: string[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDecode = async () => {
    if (!jobDescription.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Analyze the following job description and break it down into three categories: key skills, responsibilities, and qualifications. Return the result as a JSON object with these fields: "skills" (array of strings), "responsibilities" (array of strings), and "qualifications" (array of strings). Focus on the most critical elements.

        Job Description: "${jobDescription}"
      `;

      const response = await model.generateContent(prompt);
      const cleanedResult = response.response.text().replace(/```json\n|\n```/g, '');
      const parsedResult = JSON.parse(cleanedResult);
      setResult(parsedResult);
    } catch (error) {
      console.error("Error decoding job description:", error);
      setResult({
        skills: ["Error processing skills"],
        responsibilities: ["Error processing responsibilities"],
        qualifications: ["Error processing qualifications"],
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
          AI Job Description Decoder
        </h1>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Paste a job posting, and let AI break it down into key insights with a sleek, animated breakdown.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-16 px-6"
      >
        <GlowCard>
          <div className="p-6">
            <textarea
              className="w-full h-40 p-4 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDecode}
              disabled={isLoading}
              className="mt-4 flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors mx-auto"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Decode Job</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </div>
        </GlowCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {isLoading || result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto px-6 pb-16"
          >
            <GlowCard>
              <div className="p-6 space-y-8">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Decoding your job description...</span>
                  </div>
                ) : (
                  <>
                    {/* Skills Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3 className="text-2xlلیه

Human: font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2 mb-4">
                        <Brain className="w-6 h-6 text-purple-400" />
                        Key Skills
                      </h3>
                      <ul className="space-y-3">
                        {result?.skills.map((skill, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            {skill}
                          </motion.li>
                        ))}
                      </ul>
                      <ProgressBar label="Skills Relevance" value={85} />
                    </motion.div>

                    {/* Responsibilities Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2 mb-4">
                        <Briefcase className="w-6 h-6 text-purple-400" />
                        Responsibilities
                      </h3>
                      <ul className="space-y-3">
                        {result?.responsibilities.map((resp, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            {resp}
                          </motion.li>
                        ))}
                      </ul>
                      <ProgressBar label="Task Importance" value={70} />
                    </motion.div>

                    {/* Qualifications Section */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2 mb-4">
                        <Award className="w-6 h-6 text-purple-400" />
                        Qualifications
                      </h3>
                      <ul className="space-y-3">
                        {result?.qualifications.map((qual, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center gap-2 text-gray-300"
                          >
                            <span className="w-2 h-2 bg-purple-500 rounded-full" />
                            {qual}
                          </motion.li>
                        ))}
                      </ul>
                      <ProgressBar label="Qualification Match" value={90} />
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

export default JobDecoderPage;