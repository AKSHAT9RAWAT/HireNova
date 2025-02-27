"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function CareerGoalSetter() {
  const [currentRole, setCurrentRole] = useState("");
  const [dreamJob, setDreamJob] = useState("");
  const [roadmap, setRoadmap] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinking, setThinking] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const generateRoadmap = async () => {
    setIsLoading(true);
    setThinking(true);
    setRoadmap([]);

    try {
      const prompt = `You are a career coach AI. Create a concise, step-by-step action plan with 6-8 milestones to go from a "${currentRole}" role to a "${dreamJob}" role. Format each step as a short sentence starting with a number (e.g., "1. Do this").`;
      const result = await model.generateContentStream(prompt);

      let streamedText = "";
      for await (const chunk of result.stream) {
        streamedText += chunk.text();
        const steps = streamedText.split("\n").filter(step => step.trim() && step.match(/^\d+\./));
        setRoadmap(steps);
        await new Promise(resolve => setTimeout(resolve, 50)); // Typing effect
      }
    } catch (error) {
      console.error("Error streaming response:", error);
      setRoadmap(["Sorry, I couldn’t generate a roadmap. Please try again!"]);
    } finally {
      setIsLoading(false);
      setThinking(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1a1a1a",
      padding: "2rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflowX: "hidden"
    }}>
      <motion.h1
        initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{
          background: "linear-gradient(45deg, #8b5cf6, #d8b4fe)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontSize: "2.8rem",
          marginBottom: "2rem",
          textShadow: "0 0 10px rgba(139, 92, 246, 0.3)"
        }}
      >
        AI Career Goal Setter
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          width: "100%",
          maxWidth: "800px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#8b5cf6" }}
          transition={{ duration: 0.3 }}
          type="text"
          placeholder="Current Role"
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #333",
            background: "#222",
            color: "white",
            borderRadius: "6px",
            minWidth: "200px",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)"
          }}
        />
        <motion.input
          whileFocus={{ scale: 1.02, borderColor: "#8b5cf6" }}
          transition={{ duration: 0.3 }}
          type="text"
          placeholder="Dream Job"
          value={dreamJob}
          onChange={(e) => setDreamJob(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #333",
            background: "#222",
            color: "white",
            borderRadius: "6px",
            minWidth: "200px",
            boxShadow: "inset 0 0 5px rgba(0,0,0,0.3)"
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRoadmap}
          disabled={isLoading || !currentRole || !dreamJob}
          style={{
            padding: "0.75rem 1.5rem",
            background: "linear-gradient(45deg, #8b5cf6, #d8b4fe)",
            border: "none",
            borderRadius: "6px",
            color: "white",
            cursor: "pointer",
            fontWeight: 600,
            opacity: isLoading || !currentRole || !dreamJob ? 0.6 : 1,
            transition: "all 0.3s ease"
          }}
        >
          {isLoading ? "Generating..." : "Generate Roadmap"}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {thinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            style={{
              color: "#8b5cf6",
              marginBottom: "1rem",
              fontStyle: "italic"
            }}
          >
            Thinking
            <motion.span
              animate={{ 
                opacity: [0, 1, 0],
                x: [0, 5, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 1.5,
                times: [0, 0.5, 1]
              }}
            >
              ...
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {roadmap.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, type: "spring" }}
            style={{
              width: "100%",
              maxWidth: "800px",
              background: "#222",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #333",
              boxShadow: "0 0 20px rgba(139, 92, 246, 0.1)"
            }}
          >
            <motion.h2
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{
                background: "linear-gradient(45deg, #8b5cf6, #d8b4fe, #8b5cf6)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: "1.5rem"
              }}
            >
              Your Career Roadmap
            </motion.h2>
            <ul style={{
              listStyle: "none",
              padding: 0,
              position: "relative",
              margin: 0
            }}>
              {roadmap.map((step, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -50, rotate: -5 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    x: 10,
                    color: "#d8b4fe",
                    transition: { duration: 0.2 }
                  }}
                  style={{
                    position: "relative",
                    paddingLeft: "2.5rem",
                    marginBottom: "1.5rem",
                    color: "#d1d5db",
                    borderLeft: "2px solid #8b5cf6",
                    padding: "0.5rem 0 0.5rem 2.5rem"
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      boxShadow: [
                        "0 0 5px rgba(139, 92, 246, 0.3)",
                        "0 0 10px rgba(139, 92, 246, 0.6)",
                        "0 0 5px rgba(139, 92, 246, 0.3)"
                      ]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    style={{
                      position: "absolute",
                      left: "-6px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "12px",
                      height: "12px",
                      background: "#8b5cf6",
                      borderRadius: "50%",
                      border: "2px solid #222"
                    }}
                  />
                  {step}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}