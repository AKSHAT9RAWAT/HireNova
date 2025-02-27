"use client";
// app/interview-prep/page.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Loader2, Zap, BookOpen } from 'lucide-react';
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

const PulseIndicator = () => (
  <motion.div
    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
  />
);

const InterviewPrepPage = () => {
  const [topic, setTopic] = useState('');
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isLoadingSubtopics, setIsLoadingSubtopics] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const generateSubtopics = async () => {
    if (!topic.trim()) return;

    setIsLoadingSubtopics(true);
    setSubtopics([]);
    setSelectedSubtopic(null);
    setContent(null);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        Given the topic "${topic}", generate a list of 5-8 key subtopics that would be essential for preparing for an interview on this subject. Return the result as a JSON array of strings (e.g., ["Subtopic 1", "Subtopic 2"]).
      `;

      const response = await model.generateContent(prompt);
      const cleanedResult = response.response.text().replace(/```json\n|\n```/g, '');
      const parsedResult = JSON.parse(cleanedResult);
      setSubtopics(parsedResult);
    } catch (error) {
      console.error("Error generating subtopics:", error);
      setSubtopics(["Failed to generate subtopics. Please try again."]);
    } finally {
      setIsLoadingSubtopics(false);
    }
  };

  const generateContent = async (subtopic: string) => {
    setIsLoadingContent(true);
    setContent(null);
    setSelectedSubtopic(subtopic);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        For an interview preparation on the topic "${topic}", provide detailed content for the subtopic "${subtopic}". Include key concepts, tips, and potential interview questions in a concise, well-formatted text. Use markdown-style formatting (e.g., **bold**, - lists) for readability.
      `;

      const response = await model.generateContent(prompt);
      setContent(response.response.text());
    } catch (error) {
      console.error("Error generating content:", error);
      setContent("Failed to generate content. Please try again.");
    } finally {
      setIsLoadingContent(false);
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
          AI-Powered Interview Preparations
        </h1>
        <p className="text-xl text-gray-400 mt-4 max-w-2xl mx-auto">
          Input a topic to generate subtopics and dynamic content for interview prep.
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
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="text-sm text-gray-400 mb-2 block">Interview Topic</label>
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Machine Learning"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoadingSubtopics || isLoadingContent}
              />
            </motion.div>
            <motion.div
              className="flex justify-center mt-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: [1, 1.02, 1], transition: { duration: 1.5, repeat: Infinity } }}
                onClick={generateSubtopics}
                disabled={isLoadingSubtopics || isLoadingContent}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white transition-all"
              >
                {isLoadingSubtopics ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Generate Subtopics</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </GlowCard>
      </motion.div>

      {/* Results Section */}
      <AnimatePresence>
        {isLoadingSubtopics || subtopics.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-6 pb-16 flex gap-6"
          >
            {/* Subtopics List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-1/3"
            >
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-purple-400" />
                    Subtopics
                  </h3>
                  {isLoadingSubtopics ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                      <span className="ml-2 text-gray-400">Loading subtopics...</span>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {subtopics.map((subtopic, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          onClick={() => generateContent(subtopic)}
                          className={`flex items-center gap-2 text-gray-300 cursor-pointer hover:text-purple-300 transition-colors ${
                            selectedSubtopic === subtopic ? 'text-purple-400' : ''
                          }`}
                        >
                          <PulseIndicator />
                          {subtopic}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </GlowCard>
            </motion.div>

            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-2/3"
            >
              <GlowCard>
                <div className="p-6">
                  {isLoadingContent || content ? (
                    <>
                      <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-500 flex items-center gap-2 mb-4">
                        <BookOpen className="w-6 h-6 text-purple-400" />
                        {selectedSubtopic || "Content"}
                      </h3>
                      {isLoadingContent ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                          <span className="ml-2 text-gray-400">Generating content...</span>
                        </div>
                      ) : (
                        <div
                          className="prose prose-invert max-w-none text-gray-300"
                          dangerouslySetInnerHTML={{
                            __html: content!
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/-(.*?)\n/g, '<li>$1</li>')
                              .replace(/\n/g, '<br/>'),
                          }}
                        />
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      Select a subtopic to generate detailed content.
                    </p>
                  )}
                </div>
              </GlowCard>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default InterviewPrepPage;