"use client";
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

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
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const fileBuffer = await uploadedFile.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: uploadedFile.type || "application/pdf",
          },
        },
        "Analyze this resume and provide a detailed summary with suggestions for improvement. Include feedback on keyword optimization, experience impact, skills relevance, and ATS compatibility.",
      ]);

      // Clean up the response (remove ** and ###)
      const cleanedResult = result.response.text()
        .replace(/\*\*/g, '')
        .replace(/###/g, '')
        .replace(/\n/g, '<br/>'); // Convert newlines to HTML breaks for rendering

      setAnalysisResult(cleanedResult);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setAnalysisResult("Failed to analyze the resume. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      handleFileUpload(droppedFile);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

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
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-purple-500/20 hover:border-purple-500/50'}`}
                    onDragEnter={() => setIsDragging(true)}
                    onDragLeave={() => setIsDragging(false)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onFileDrop}
                  >
                    <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-purple-300 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Drop your PDF or DOCX file here, or click to browse
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300 cursor-pointer">
                      <span>Select File</span>
                      <ChevronRight className="w-4 h-4" />
                      <input type="file" className="hidden" accept=".pdf,.docx" onChange={onFileSelect} />
                    </label>
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
            { icon: BarChart2, title: "Deep Analysis", description: "Get comprehensive insights into your resume's strengths and areas for improvement", delay: 0.4 },
            { icon: Target, title: "ATS Optimization", description: "Ensure your resume passes Applicant Tracking Systems with formatting suggestions", delay: 0.5 },
            { icon: TrendingUp, title: "Industry Alignment", description: "Compare your resume against industry standards and top performers", delay: 0.6 },
          ].map((feature, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: feature.delay }}>
              <GlowCard className="h-full">
                <feature.icon className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-purple-300">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>

        {/* Analysis Results Section */}
        {isAnalyzing || analysisResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <GlowCard>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5" />
                  Analysis Results
                </h3>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Analyzing your resume...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: analysisResult || '' }} className="text-gray-300" />
                  </div>
                )}
              </div>
            </GlowCard>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;