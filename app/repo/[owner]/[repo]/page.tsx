"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Send,
  Github,
  Code,
  File,
  FileText,
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
  Terminal,
  FileJson,
  FileImage,
  FileCog,
} from "lucide-react"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface RepoData {
  structure: Record<string, any>
  contents: Record<string, string>
}

interface ChatMessage {
  text: string
  isUser: boolean
  timestamp: Date
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyA-tAJWZDUcDpMEo8IfT3wEI9D39KMKVV8")
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export default function RepoExplorer() {
  const params = useParams()
  const owner = params.owner as string
  const repo = params.repo as string

  const [repoData, setRepoData] = useState<RepoData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [chatInput, setChatInput] = useState("")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      text: "Welcome to the AI-powered repository explorer! Ask me questions about the code you're viewing.",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]))
  const [aiThinking, setAiThinking] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/repo-data?owner=${owner}&repo=${repo}`)
        if (!response.ok) throw new Error("Failed to fetch repository data")
        const data = await response.json()
        setRepoData(data)
      } catch (error) {
        console.error("Error fetching repo data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRepoData()
  }, [owner, repo])

  useEffect(() => {
    // Scroll to bottom of chat when new messages are added
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [])

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderPath)) {
        newSet.delete(folderPath)
      } else {
        newSet.add(folderPath)
      }
      return newSet
    })
  }

  const handleFileClick = (filePath: string) => {
    setSelectedFile(filePath)
  }

  const getFileIcon = (filePath: string) => {
    const extension = filePath.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "js":
      case "jsx":
      case "ts":
      case "tsx":
        return <FileCode className="w-4 h-4 text-yellow-400" />
      case "json":
        return <FileJson className="w-4 h-4 text-green-400" />
      case "md":
        return <FileText className="w-4 h-4 text-blue-400" />
      case "png":
      case "jpg":
      case "jpeg":
      case "svg":
      case "gif":
        return <FileImage className="w-4 h-4 text-purple-400" />
      case "yml":
      case "yaml":
      case "toml":
      case "ini":
      case "conf":
        return <FileCog className="w-4 h-4 text-gray-400" />
      case "sh":
      case "bash":
      case "zsh":
        return <Terminal className="w-4 h-4 text-green-500" />
      default:
        return <File className="w-4 h-4 text-gray-400" />
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage = {
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setAiThinking(true)

    try {
      // Get the current file content
      const fileContent = selectedFile ? repoData?.contents[selectedFile] || "No content available" : "No file selected"
      const fileName = selectedFile ? selectedFile.split("/").pop() || selectedFile : "No file selected"

      // Create prompt with user input and file content
      const prompt = `
User question: ${chatInput}

Currently viewing file: ${fileName}

File content:
\`\`\`
${fileContent}
\`\`\`

Please provide a helpful, accurate response about this code. If the question is not related to the code, you can still answer general programming questions.
      `

      // Call Gemini API
      const result = await model.generateContent(prompt)
      const aiResponse = result.response.text()

      setChatMessages((prev) => [
        ...prev,
        {
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error processing your request. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ])
    } finally {
      setAiThinking(false)
    }
  }

  const renderFileStructure = (structure: Record<string, any>, parentKey = "", level = 0) => {
    if (!structure) return null

    const folders: JSX.Element[] = []
    const files: JSX.Element[] = []

    // First handle root files
    if (structure.root && parentKey === "") {
      structure.root.forEach((item: string, index: number) => {
        files.push(
          <li
            key={`root-file-${index}`}
            className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-zinc-800 ${selectedFile === item ? "bg-zinc-800 text-purple-400" : "text-gray-300"}`}
            onClick={() => handleFileClick(item)}
          >
            <span className="mr-2">{getFileIcon(item)}</span>
            <span className="text-sm truncate">{item.split("/").pop()}</span>
          </li>,
        )
      })
    }

    // Then handle directories
    Object.entries(structure)
      .filter(([key]) => key !== "root")
      .forEach(([key, value]) => {
        const isFolder = typeof value === "object"
        const displayName = key.split("/").pop() || key
        const fullPath = parentKey ? `${parentKey}/${key}` : key
        const isExpanded = expandedFolders.has(key)

        if (isFolder) {
          folders.push(
            <li key={key} className="py-1">
              <div
                className="flex items-center px-2 py-1 rounded cursor-pointer hover:bg-zinc-800 text-gray-300"
                onClick={() => toggleFolder(key)}
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 mr-1 text-purple-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-1 text-purple-400" />
                )}
                <Folder className="w-4 h-4 mr-2 text-purple-400" />
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              {isExpanded && (
                <ul className="ml-4 mt-1 space-y-0.5">
                  {renderFileStructure(value as Record<string, any>, key, level + 1)}
                </ul>
              )}
            </li>,
          )
        } else {
          files.push(
            <li
              key={key}
              className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-zinc-800 ${selectedFile === key ? "bg-zinc-800 text-purple-400" : "text-gray-300"}`}
              onClick={() => handleFileClick(key)}
            >
              <span className="mr-2">{getFileIcon(key)}</span>
              <span className="text-sm truncate">{displayName}</span>
            </li>,
          )
        }
      })

    // Return folders first, then files
    return [...folders, ...files]
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-xl font-medium bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Loading repository data...
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar: File Structure */}
      <div className="w-1/4 bg-zinc-950 border-r border-zinc-800 p-4 overflow-y-auto">
        <div className="flex items-center mb-4">
          <Github className="w-5 h-5 mr-2 text-purple-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {owner}/{repo}
          </h2>
        </div>
        <div className="mb-4">
          <h3 className="text-sm font-medium text-zinc-400 mb-2">Repository Files</h3>
          <ul className="space-y-0.5">{repoData && renderFileStructure(repoData.structure)}</ul>
        </div>
      </div>

      {/* Center: Chat Interface */}
      <div className="w-2/4 flex flex-col p-4 bg-zinc-900">
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto rounded-lg p-4 bg-zinc-950 border border-zinc-800 mb-4"
        >
          <div className="space-y-4">
            {chatMessages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    message.isUser ? "bg-purple-600 text-white" : "bg-zinc-800 text-gray-200"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                  <div className={`text-xs mt-1 ${message.isUser ? "text-purple-300" : "text-zinc-500"}`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            {aiThinking && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-zinc-800 text-gray-200">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
            className="flex-1 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500"
            placeholder="Ask about the code..."
            disabled={aiThinking}
          />
          <Button
            onClick={handleSendMessage}
            disabled={aiThinking}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {aiThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Right Sidebar: File Preview */}
      <div className="w-1/4 bg-zinc-950 border-l border-zinc-800 p-4 overflow-y-auto">
        <div className="flex items-center mb-4">
          <Code className="w-5 h-5 mr-2 text-purple-400" />
          <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            File Preview
          </h2>
        </div>
        {selectedFile ? (
          <>
            <div className="mb-2 p-2 bg-zinc-900 rounded border border-zinc-800">
              <div className="flex items-center">
                {getFileIcon(selectedFile)}
                <span className="ml-2 text-sm font-medium text-zinc-300">{selectedFile}</span>
              </div>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap p-4 bg-zinc-900 rounded border border-zinc-800 overflow-x-auto">
              {repoData?.contents[selectedFile] || "No content available"}
            </pre>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">Select a file to preview its content</p>
          </div>
        )}
      </div>
    </div>
  )
}

