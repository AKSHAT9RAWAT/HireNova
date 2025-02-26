"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TypeAnimation } from "react-type-animation"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"
import ProfileView from "./profile-view"
import Link from "next/link"

export default function LinkedInPage() {
  const [profileData, setProfileData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_KEY = 'e2e03befacmsh4187222c1fc0e47p1f0efbjsn4f5964cc54cd' // Replace if invalid

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.target as HTMLFormElement
    const linkedinUrl = new FormData(form).get("linkedin-url") as string

    if (!linkedinUrl || !linkedinUrl.includes("linkedin.com")) {
      setError("Please enter a valid LinkedIn URL")
      setLoading(false)
      return
    }

    const url = `https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(linkedinUrl)}`
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com',
        'accept': 'application/json'
      }
    }

    try {
      console.log("Fetching LinkedIn profile data from RapidAPI...")
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const text = await response.text()
        throw new Error(`API request failed with status ${response.status}: ${text.substring(0, 100)}...`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text()
        throw new Error(`Expected JSON but received ${contentType || "unknown type"}: ${text.substring(0, 100)}...`)
      }

      const data = await response.json()

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Received empty profile data from API")
      }

      console.log("Profile data received:", data)

      const transformedData = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        headline: data.headline,
        summary: data.summary,
        profilePicture: data.profilePicture,
        geo: data.geo,
        educations: data.educations.map((edu: any) => ({
          fieldOfStudy: edu.fieldOfStudy,
          degree: edu.degree,
          schoolName: edu.schoolName,
          startYear: edu.start.year,
          endYear: edu.end.year,
        })),
        positions: data.fullPositions.map((pos: any) => ({
          title: pos.title,
          companyName: pos.companyName,
          companyIndustry: pos.companyIndustry,
          location: pos.location,
          description: pos.description,
          startYear: pos.start.year,
          endYear: pos.end.year || "Present",
          employmentType: pos.employmentType || "Full-time",
        })),
        skills: data.skills.map((skill: any) => ({ name: skill.name })),
        projects: data.projects || [],
        certifications: [],
        achievements: data.skills.map((skill: any) => ({
          name: `${skill.name} Skill`,
          endorsements: skill.endorsementsCount
        }))
      }

      setProfileData(transformedData)
    } catch (error) {
      console.error("Error fetching profile:", error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An unknown error occurred while fetching the profile"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* <ParticleBackground /> Uncomment if you implement it */}
      {!profileData ? (
        <>
          <section className="relative">
            <div className="container px-4 py-24 mx-auto text-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-green-400 via-purple-500 to-green-400 text-transparent bg-clip-text animate-gradient">
                  Roast Your Resume
                  <br />
                  Like a Pro!
                </h1>
                <div className="h-[32px] md:h-[40px] flex items-center justify-center">
                  <TypeAnimation
                    sequence={["Get actionable feedback", 2000, "Improve your chances", 2000, "Land your dream job", 2000]}
                    wrapper="span"
                    speed={50}
                    repeat={Number.POSITIVE_INFINITY}
                    className="text-xl md:text-2xl text-purple-400"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-md mx-auto mt-12 space-y-4"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <Input
                      type="url"
                      name="linkedin-url"
                      placeholder="Paste Your LinkedIn URL Here"
                      className="w-full h-14 bg-black/50 border-2 border-purple-500/50 rounded-xl text-white placeholder:text-purple-300/50 focus:border-green-400 transition-all duration-300 backdrop-blur-sm"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-purple-500/20 blur-xl group-hover:bg-green-400/20 transition-all duration-500 -z-10" />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    size="lg"
                    className="w-full h-14 bg-black hover:bg-black/90 border-2 border-green-400 rounded-xl font-bold text-lg relative group overflow-hidden"
                  >
                    <span className="relative z-10 bg-gradient-to-r from-green-400 to-purple-500 text-transparent bg-clip-text group-hover:from-purple-500 group-hover:to-green-400 transition-all duration-500">
                      {loading ? "Loading..." : "Roast Me!"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-purple-500/20 blur-sm group-hover:blur-lg transition-all duration-500" />
                  </Button>
                  {error && (
                    <p className="text-red-400 text-center text-sm">{error}</p>
                  )}
                </form>
              </motion.div>
            </div>
          </section>
          <section className="relative py-24 border-t border-white/10">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-green-400 text-transparent bg-clip-text">
                  Why Choose Resume Roaster?
                </h2>
              </motion.div>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-6 bg-black/50 border border-purple-500/20 backdrop-blur-sm hover:border-green-400/50 transition-all duration-500 group">
                      <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 group-hover:bg-green-400/10 transition-all duration-500">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-purple-400 group-hover:text-green-400 transition-all duration-500">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
          <section className="relative py-24 border-t border-white/10">
            <div className="container px-4 mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto space-y-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-400 via-purple-500 to-green-400 text-transparent bg-clip-text animate-gradient">
                  Ready to Level Up Your Resume?
                </h2>
                <p className="text-gray-400 text-lg">
                  Join thousands of professionals who’ve improved their job prospects with Resume Roaster
                </p>
                <Button
                  size="lg"
                  className="bg-purple-500 hover:bg-purple-600 text-white px-8 h-14 rounded-xl font-bold text-lg relative group overflow-hidden"
                  disabled
                >
                  Get Started Free
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-green-400/20 blur-sm group-hover:blur-lg transition-all duration-500" />
                </Button>
              </motion.div>
            </div>
          </section>
          <footer className="border-t border-white/10 py-8">
            <div className="container px-4 mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <p className="text-gray-400">© 2025 Resume Roaster. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Terms
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Privacy
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </>
      ) : (
        <ProfileView data={profileData} />
      )}
    </div>
  )
}

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Get instant, detailed feedback on your resume using cutting-edge AI technology",
    icon: <Zap className="w-6 h-6 text-purple-400 group-hover:text-green-400 transition-colors" />,
  },
  {
    title: "Expert Insights",
    description: "Receive professional recommendations based on industry standards and best practices",
    icon: <CheckCircle className="w-6 h-6 text-purple-400 group-hover:text-green-400 transition-colors" />,
  },
  {
    title: "Quick Results",
    description: "Get comprehensive feedback in minutes, not days",
    icon: <ArrowRight className="w-6 h-6 text-purple-400 group-hover:text-green-400 transition-colors" />,
  },
]