"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, 
  Video, 
  MessageSquare, 
  Brain, 
  ChevronRight, 
  Play,
  BarChart,
  Clock
} from 'lucide-react';



const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-black">
    <div className="absolute h-full w-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
    <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-800/10 via-transparent to-transparent" />
    <div className="absolute h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.8),transparent_120px),linear-gradient(to_top,rgba(0,0,0,0.8),transparent_120px)]" />
    <div className="absolute inset-0 bg-grid-white/[0.02]" />
  </div>
);

const GlowingCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
    <div className="relative bg-black rounded-lg p-6">
      {children}
    </div>
  </div>
);

const InterviewPrepPage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden">
      <BackgroundGradient />

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8"
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered Interview Practice</span>
          </motion.div>

          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            Master Your Interviews
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Practice with our advanced AI interviewer that adapts to your experience level and provides real-time feedback on your responses.
          </p>
        </motion.div>

        {/* Main Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <GlowingCard>
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/50 to-black p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-semibold mb-4 text-purple-300">Start Your Interview</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Video className="w-5 h-5 text-purple-400" />
                      <span>Video analysis for body language</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mic className="w-5 h-5 text-purple-400" />
                      <span>Voice tone and clarity feedback</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                      <span>Real-time response evaluation</span>
                    </div>
                  </div>
                  
                  <button
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-300"
                  >
                    <Play className="w-5 h-5" />
                    <span>Begin Interview Session</span>
                    <motion.span
                      animate={{ x: isHovered ? 5 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.span>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg bg-black/50 p-4 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-medium">Session Duration</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Average time</span>
                      <span>45 minutes</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-black/50 p-4 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-3">
                      <BarChart className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-medium">Performance Metrics</span>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full bg-purple-900/30 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-3/4" />
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Technical Skills</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlowingCard>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              title: "Personalized Questions",
              description: "Questions tailored to your experience level and industry focus",
              delay: 0.4,
            },
            {
              title: "Real-time Analysis",
              description: "Instant feedback on your answers, tone, and presentation",
              delay: 0.5,
            },
            {
              title: "Performance Tracking",
              description: "Track your progress and improvement over time",
              delay: 0.6,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
            >
              <GlowingCard className="h-full">
                <h3 className="text-xl font-semibold mb-3 text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </GlowingCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrepPage;