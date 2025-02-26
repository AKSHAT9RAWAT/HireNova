"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building2, GraduationCap, Briefcase, Award, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"

interface Education {
  fieldOfStudy: string
  degree: string
  schoolName: string
  startYear: number
  endYear: number
}

interface Position {
  title: string
  companyName: string
  companyIndustry: string
  location: string
  description: string
  startYear: number
  endYear: number | "Present"
  employmentType: string
}

interface Certification {
  name: string
  authority: string
  year: number
}

interface Achievement {
  name: string
  endorsements: number
}

interface ProfileData {
  username: string
  firstName: string
  lastName: string
  headline: string
  summary: string
  profilePicture: string
  geo: {
    country: string
    city: string
    full: string
  }
  educations: Education[]
  positions: Position[]
  skills: { name: string }[]
  projects: any[]
  certifications: Certification[]
  achievements: Achievement[]
}

export default function ProfileView({ data }: { data: ProfileData }) {
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [roast, setRoast] = useState<string | null>(null)
  const [loadingAnalysis, setLoadingAnalysis] = useState(false)
  const [loadingRoast, setLoadingRoast] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const safeData = {
    ...data,
    firstName: data.firstName || "Unknown",
    lastName: data.lastName || "User",
    headline: data.headline || "No headline provided",
    summary: data.summary || "No summary available",
    profilePicture: data.profilePicture || "/placeholder.svg",
    geo: data.geo || { country: "", city: "", full: "Location not specified" },
    educations: data.educations || [],
    positions: data.positions || [],
    skills: data.skills || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    achievements: data.achievements || [],
  }

  const GEMINI_API_KEY = "AIzaSyBJQL2jiLkEz8CCbPpOtps6KhPz9ivt4-U" // Replace if invalid
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const analyzeProfile = async () => {
    console.log("Analyze Profile button clicked")
    setLoadingAnalysis(true)
    setAnalysis(null)
    setError(null)
    try {
      const prompt = `Analyze this LinkedIn profile and give me a score out of 100, tell me what the user should focus on, and how they should improve it. Here's the profile data: ${JSON.stringify(safeData, null, 2)}`
      console.log("Sending request to Gemini API for analysis...")
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      console.log("Analysis response:", text)
      setAnalysis(text)
    } catch (error) {
      console.error("Error during analysis:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(`Failed to analyze profile: ${errorMessage}. Check your Gemini API key or network.`)
      // Fallback message if API fails
      setAnalysis("Analysis unavailable due to API error. Here's a generic tip: Add more specific achievements to stand out!")
    } finally {
      setLoadingAnalysis(false)
    }
  }

  const roastProfile = async () => {
    console.log("Roast Profile button clicked")
    setLoadingRoast(true)
    setRoast(null)
    setError(null)
    try {
      const prompt = `Roast this LinkedIn profile completely based on the provided profile data. Use funny and brutal roasts to roast this person brutally. Here's the profile data: ${JSON.stringify(safeData, null, 2)}`
      console.log("Sending request to Gemini API for roast...")
      const result = await model.generateContent(prompt)
      const text = result.response.text()
      console.log("Roast response:", text)
      setRoast(text)
    } catch (error) {
      console.error("Error during roast:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      setError(`Failed to roast profile: ${errorMessage}. Check your Gemini API key or network.`)
      // Fallback message if API fails
      setRoast("Roast failed! Looks like this profile is too dull to even roast properly—maybe add some spice next time!")
    } finally {
      setLoadingRoast(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-48 bg-gradient-to-r from-purple-900/50 to-green-900/50"
      >
        <div className="absolute -bottom-16 container px-4 mx-auto">
          <div className="flex items-end gap-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full border-4 border-black overflow-hidden w-32 h-32"
            >
              <Image
                src={safeData.profilePicture}
                alt={`${safeData.firstName} ${safeData.lastName}`}
                width={128}
                height={128}
                className="object-cover"
              />
            </motion.div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold">
                {safeData.firstName} {safeData.lastName}
              </h1>
              <p className="text-purple-400">{safeData.headline}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container px-4 mx-auto mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <MapPin className="w-4 h-4" />
                <h3 className="font-semibold">Location</h3>
              </div>
              <p className="text-gray-300">{safeData.geo.full}</p>
            </Card>

            <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <Award className="w-4 h-4" />
                <h3 className="font-semibold">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {safeData.skills.length > 0 ? (
                  safeData.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                    >
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-400">No skills listed</p>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 mb-4">
                <GraduationCap className="w-4 h-4" />
                <h3 className="font-semibold">Education</h3>
              </div>
              <div className="space-y-4">
                {safeData.educations.length > 0 ? (
                  safeData.educations.map((edu, index) => (
                    <div key={index} className="border-l-2 border-purple-500/20 pl-4">
                      <h4 className="font-semibold text-gray-200">{edu.schoolName}</h4>
                      <p className="text-purple-400">
                        {edu.degree} • {edu.fieldOfStudy}
                      </p>
                      <p className="text-sm text-gray-400">
                        {edu.startYear} - {edu.endYear}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400">No education history available</p>
                )}
              </div>
            </Card>

            {safeData.certifications.length > 0 && (
              <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Award className="w-4 h-4" />
                  <h3 className="font-semibold">Certifications</h3>
                </div>
                <div className="space-y-4">
                  {safeData.certifications.map((cert, index) => (
                    <div key={index} className="border-l-2 border-purple-500/20 pl-4">
                      <h4 className="font-semibold text-gray-200">{cert.name}</h4>
                      <p className="text-purple-400">{cert.authority}</p>
                      <p className="text-sm text-gray-400">{cert.year}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={analyzeProfile}
                disabled={loadingAnalysis}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loadingAnalysis ? "Analyzing..." : "Analyze Profile"}
              </Button>
              <Button
                onClick={roastProfile}
                disabled={loadingRoast}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loadingRoast ? "Roasting..." : "Roast Profile"}
              </Button>
            </div>

            {error && (
              <Card className="p-6 bg-black/50 border border-red-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Error</h3>
                <p className="text-gray-300">{error}</p>
              </Card>
            )}

            {analysis && (
              <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Profile Analysis</h3>
                <div className="text-gray-300 whitespace-pre-line">{analysis}</div>
              </Card>
            )}

            {roast && (
              <Card className="p-6 bg-black/50 border border-red-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-red-400">Profile Roast</h3>
                <div className="text-gray-300 whitespace-pre-line italic">{roast}</div>
              </Card>
            )}

            <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">About</h3>
              <p className="text-gray-300 whitespace-pre-line">{safeData.summary}</p>
            </Card>

            <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-purple-400 mb-6">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-xl font-semibold">Experience</h3>
              </div>
              <div className="space-y-6">
                {safeData.positions.length > 0 ? (
                  safeData.positions.map((position, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-l-2 border-purple-500/20 pl-4"
                    >
                      <h4 className="font-semibold text-gray-200">{position.title}</h4>
                      <div className="flex items-center gap-2 text-purple-400 mt-1">
                        <Building2 className="w-4 h-4" />
                        <p>{position.companyName}</p>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {position.startYear} - {position.endYear} • {position.employmentType}
                      </p>
                      <p className="text-gray-300 mt-2 whitespace-pre-line">{position.description}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No experience listed</p>
                )}
              </div>
            </Card>

            {safeData.projects && safeData.projects.length > 0 && (
              <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Projects</h3>
                <div className="grid gap-4">
                  {safeData.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-purple-500/5 rounded-lg">
                      <h4 className="font-semibold text-gray-200">{project.name || "Unnamed Project"}</h4>
                      <p className="text-gray-300 mt-2">{project.description || "No description available"}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {safeData.achievements.length > 0 && (
              <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-purple-400 mb-4">
                  <Star className="w-4 h-4" />
                  <h3 className="text-xl font-semibold">Achievements</h3>
                </div>
                <div className="space-y-4">
                  {safeData.achievements.map((achievement, index) => (
                    <div key={index} className="border-l-2 border-purple-500/20 pl-4">
                      <h4 className="font-semibold text-gray-200">{achievement.name}</h4>
                      <p className="text-gray-300">Endorsements: {achievement.endorsements}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}