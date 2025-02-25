"use client"
// app/resume-analyzer/page.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  CheckCircle,
  Target,
  Zap,
  ChevronRight,
  Upload,
  BarChart2,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-black">
    <div className="absolute h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
    <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-purple-800/10 via-transparent to-transparent" />
    <div className="absolute h-full w-full bg-[linear-gradient(to_bottom_right,rgba(0,0,0,0.8),transparent_120px),linear-gradient(to_top_left,rgba(0,0,0,0.8),transparent_120px)]" />
    <div className="absolute inset-0 bg-grid-white/[0.02]" />
  </div>
);

const GlowCard = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-900 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200" />
    <div className="relative bg-black rounded-lg p-6">
      {children}
    </div>
  </div>
);

const SkillBar = ({ skill, score }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-gray-300">{skill}</span>
      <span className="text-purple-400">{score}%</span>
    </div>
    <div className="w-full bg-purple-900/30 rounded-full h-2">
      <div
        className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

const ResumeAnalyzerPage = () => {
  const [isDragging, setIsDragging] = useState(false);

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
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI Resume Analysis</span>
          </motion.div>

          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            Optimize Your Resume
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Get instant AI-powered analysis of your resume, with detailed feedback and suggestions to maximize your chances of landing your dream job.
          </p>
        </motion.div>

        {/* Main Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <GlowCard>
            <div className="rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/50'
                      }`}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={() => setIsDragging(false)}
                  >
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-purple-300 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Drop your PDF or DOCX file here, or click to browse
                    </p>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300">
                      <span>Select File</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-medium text-purple-300 mb-4">
                    Current Analysis
                  </h3>
                  <SkillBar skill="Keyword Optimization" score={85} />
                  <SkillBar skill="Experience Impact" score={72} />
                  <SkillBar skill="Skills Relevance" score={90} />
                  <SkillBar skill="ATS Compatibility" score={95} />
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: BarChart2,
              title: "Deep Analysis",
              description: "Get comprehensive insights into your resume's strengths and areas for improvement",
              delay: 0.4,
            },
            {
              icon: Target,
              title: "ATS Optimization",
              description: "Ensure your resume passes Applicant Tracking Systems with formatting suggestions",
              delay: 0.5,
            },
            {
              icon: TrendingUp,
              title: "Industry Alignment",
              description: "Compare your resume against industry standards and top performers",
              delay: 0.6,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: feature.delay }}
            >
              <GlowCard className="h-full">
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-purple-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Enhancement Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <GlowCard>
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Smart Suggestions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: Award,
                    title: "Achievement Focus",
                    description: "Add more quantifiable achievements to strengthen impact"
                  },
                  {
                    icon: Zap,
                    title: "Action Words",
                    description: "Use more powerful action verbs to describe experiences"
                  },
                  {
                    icon: CheckCircle,
                    title: "Skills Match",
                    description: "Align technical skills with job market demands"
                  },
                  {
                    icon: Target,
                    title: "Target Match",
                    description: "Customize content for your target industry"
                  }
                ].map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-purple-500/5 border border-purple-500/10">
                    <suggestion.icon className="w-5 h-5 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-purple-300 mb-1">{suggestion.title}</h4>
                      <p className="text-sm text-gray-400">{suggestion.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;