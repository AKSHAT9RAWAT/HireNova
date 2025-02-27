"use client";
// app/career-chatbot/page.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Upload,
  User,
  Moon,
  Sun,
  Loader2,
  Bot,
} from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Interface for messages
interface Message {
  text: string;
  isUser: boolean;
}

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

const ThinkingDots = () => (
  <div className="flex space-x-1">
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0 }}
      className="w-2 h-2 bg-purple-500 rounded-full"
    />
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
      className="w-2 h-2 bg-purple-500 rounded-full"
    />
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
      className="w-2 h-2 bg-purple-500 rounded-full"
    />
  </div>
);

const CareerChatbotPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const streamResponse = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text: message, isUser: true }, { text: "", isUser: false }]);

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a career coach AI. Answer this career-related question: "${message}" Provide concise, actionable advice.`;
      const result = await model.generateContentStream(prompt);

      let streamedText = "";
      for await (const chunk of result.stream) {
        streamedText += chunk.text();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = streamedText;
          return updated;
        });
        await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate typing effect
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Sorry, I couldn’t process that. Try again!";
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim()) {
      streamResponse(input);
      setInput('');
    }
  };

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setMessages((prev) => [...prev, { text: "File uploaded! I’ll consider it in my responses if relevant.", isUser: false }]);
  };

  const onFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileUpload(droppedFile);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileUpload(selectedFile);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={`min-h-screen w-full ${isDarkTheme ? 'bg-black text-white' : 'bg-gray-100 text-black'} flex overflow-hidden`}>
      <BackgroundGradient />

      {/* Left Sidebar */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-16 bg-black border-r border-purple-900/50 flex flex-col items-center py-6 space-y-8"
      >
        <MessageCircle className="w-6 h-6 text-purple-400" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsDarkTheme(!isDarkTheme)}
          className="focus:outline-none"
        >
          {isDarkTheme ? (
            <Sun className="w-6 h-6 text-purple-400" />
          ) : (
            <Moon className="w-6 h-6 text-purple-400" />
          )}
        </motion.button>
        <User className="w-6 h-6 text-purple-400" />
        <label className="cursor-pointer">
          <Upload className="w-6 h-6 text-purple-400" />
          <input type="file" className="hidden" onChange={onFileSelect} />
        </label>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-6 border-b border-purple-900/50"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-fuchsia-500">
            AI Career Q&A Chatbot
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Your personal career coach, powered by AI.
          </p>
        </motion.div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} items-start`}
                >
                  {!msg.isUser && (
                    <Bot className="w-6 h-6 text-purple-400 mr-2 mt-1 flex-shrink-0" />
                  )}
                  <GlowCard className={`max-w-xl ${msg.isUser ? 'bg-purple-900/20' : 'bg-black'}`}>
                    <div className="p-4">
                      <p className={`${msg.isUser ? 'text-gray-200' : 'text-purple-300'} whitespace-pre-wrap`}>
                        {msg.text || (isLoading && index === messages.length - 1 && <ThinkingDots />)}
                      </p>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Fixed Bottom Input Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 bg-black border-t border-purple-900/50"
        >
          <div className="max-w-3xl mx-auto">
            <GlowCard>
              <div className="flex items-center p-2">
                <textarea
                  className="flex-1 min-h-[48px] max-h-32 p-2 rounded-lg bg-purple-900/30 border border-purple-500/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                  placeholder="Ask a career question (e.g., 'How do I switch industries?')"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={isLoading}
                  className="ml-2 p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Send className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
            </GlowCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerChatbotPage;