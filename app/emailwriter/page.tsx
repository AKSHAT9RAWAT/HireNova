"use client";
// app/networking-coach-email/page.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  CheckCircle,
  Copy,
  ChevronRight,
  Upload,
  Loader2,
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

const NetworkingCoachEmailPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [companyDescription, setCompanyDescription] = useState<string>('');
  const [emailResult, setEmailResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleEmailGeneration = async () => {
    if (!resumeFile || !companyDescription) {
      setEmailResult("Please upload a resume and provide a company description.");
      return;
    }

    setIsGenerating(true);
    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const fileBuffer = await resumeFile.arrayBuffer();
      const base64Data = Buffer.from(fileBuffer).toString("base64");

      const prompt = `
        Using the provided resume and company description below, generate a professional networking email. The email should be concise, polite, and tailored to the company, expressing interest in connecting with someone at the company (e.g., a recruiter or employee in a relevant role). Include a subject line and a signature with placeholders for the user's name and contact info.

        Company Description: "${companyDescription}"
      `;

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: resumeFile.type || "application/pdf",
          },
        },
        prompt,
      ]);

      const cleanedResult = result.response.text()
        .replace(/\*\*/g, '')
        .replace(/###/g, '')
        .replace(/\n/g, '<br/>'); // Convert newlines to HTML breaks for rendering

      setEmailResult(cleanedResult);
    } catch (error) {
      console.error("Error generating email:", error);
      setEmailResult("Failed to generate the email. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      setResumeFile(droppedFile);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setResumeFile(selectedFile);
    }
  };

  const handleCopy = () => {
    if (emailResult) {
      const plainText = emailResult.replace(/<br\/>/g, '\n'); // Convert HTML breaks back to newlines
      navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
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
            <Mail className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Master Your Outreach</span>
          </motion.div>

          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            Connect with Confidence
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Generate personalized networking emails for LinkedIn outreach or direct contact, tailored to your resume and the company.
          </p>
        </motion.div>

        {/* Main Input Section */}
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
                    Job Description
                  </h3>
                  <textarea
                    className="w-full h-32 p-4 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter a brief description of the company (e.g., industry, size, mission)..."
                    value={companyDescription}
                    onChange={(e) => setCompanyDescription(e.target.value)}
                  />
                  <button
                    onClick={handleEmailGeneration}
                    className="w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                  >
                    Generate Email
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>
        </motion.div>

        {/* Generated Email Section */}
        {isGenerating || emailResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <GlowCard>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-purple-300 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Your Networking Email
                  </h3>
                  {emailResult && (
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
                    >
                      <Copy className="w-4 h-4" />
                      <span>{copied ? "Copied!" : "Copy Email"}</span>
                    </button>
                  )}
                </div>
                {isGenerating ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    <span className="ml-2 text-gray-400">Generating your email...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <div
                      dangerouslySetInnerHTML={{ __html: emailResult || '' }}
                      className="text-gray-300 bg-purple-900/20 p-4 rounded-lg"
                    />
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

export default NetworkingCoachEmailPage;