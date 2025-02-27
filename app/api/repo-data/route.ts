import { type NextRequest, NextResponse } from "next/server"

// Store structure and contents globally (for simplicity in this example)
// In a production app, you might want to use a more robust caching solution
let structure: Record<string, any> = {}
let fileContents: Record<string, string> = {}

async function fetchRepoContents(owner: string, repo: string, path = "") {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      // Add GitHub token if you have one to increase rate limits
      // "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  const contents = await response.json()
  const currentFiles: string[] = []

  // Process each item
  for (const item of contents) {
    const fullPath = item.path

    if (item.type === "file") {
      currentFiles.push(fullPath)
      const rawUrl = item.download_url
      const contentResponse = await fetch(rawUrl)
      const content = await contentResponse.text()
      fileContents[fullPath] = content
    } else if (item.type === "dir") {
      structure[fullPath] = {}
      await fetchRepoContents(owner, repo, fullPath) // Recurse
    }
  }

  // Store in structure
  if (path === "") {
    structure["root"] = currentFiles
  } else {
    const parentPath = path.includes("/") ? path.split("/").slice(0, -1).join("/") : "root"

    if (!structure[parentPath]) {
      structure[parentPath] = {}
    }
    structure[parentPath][path] = {}
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  if (!owner || !repo) {
    return NextResponse.json({ error: "Owner and repo parameters are required" }, { status: 400 })
  }

  try {
    // Reset for fresh fetch
    structure = {}
    fileContents = {}

    await fetchRepoContents(owner, repo)

    return NextResponse.json({
      structure,
      contents: fileContents,
    })
  } catch (error) {
    console.error("Error fetching repo data:", error)
    return NextResponse.json({ error: "Failed to fetch repository data" }, { status: 500 })
  }
}

