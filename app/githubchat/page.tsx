"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Github, ArrowRight, Code } from "lucide-react"

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Parse GitHub URL (e.g., https://github.com/owner/repo)
    const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) {
      setError("Invalid GitHub URL. Use format: https://github.com/owner/repo")
      return
    }

    const [_, owner, repo] = match
    router.push(`/repo/${owner}/${repo}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-black text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 rounded-xl shadow-2xl border border-purple-500/20">
        <div className="flex items-center justify-center mb-8">
          <Github className="w-10 h-10 mr-3 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Repo Explorer
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="repo-url" className="text-sm font-medium text-purple-300">
              Enter GitHub Repository URL
            </label>
            <Input
              id="repo-url"
              type="text"
              placeholder="https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-purple-500"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/30 border-red-800">
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <span>Explore Repository</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          <p>Powered by Next.js and Gemini AI</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <Code className="h-4 w-4" />
            <span>Explore code with AI assistance</span>
          </div>
        </div>
      </div>
    </main>
  )
}

