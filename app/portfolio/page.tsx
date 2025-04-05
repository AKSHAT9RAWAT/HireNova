"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Github, ExternalLink, Mail, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function DynamicPortfolio() {
  const [portfolioData, setPortfolioData] = useState({
    name: "Alex Johnson",
    title: "Full Stack Developer & AI Enthusiast",
    about: "I'm a passionate full-stack developer with a strong interest in artificial intelligence and machine learning. With 3 years of experience in web development, I specialize in creating modern, scalable applications using React, Node.js, and Python. I'm constantly exploring new technologies and frameworks to stay at the forefront of web development.",
    skills: [
      { name: "JavaScript", level: 95 },
      { name: "React", level: 90 },
      { name: "Node.js", level: 85 },
      { name: "Python", level: 80 },
      { name: "TypeScript", level: 85 },
      { name: "AWS", level: 75 }
    ],
    projects: [
      {
        title: "AI-Powered Task Manager",
        description: "A smart task management system that uses machine learning to predict task completion times and optimize schedules.",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["AI", "React", "Node.js"],
        github: "https://github.com/example/task-manager",
        demo: "https://task-manager-demo.com"
      },
      {
        title: "EcoTrack",
        description: "A sustainability tracking app that helps users monitor and reduce their carbon footprint through AI-powered insights.",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["Sustainability", "React Native", "Firebase"],
        github: "https://github.com/example/ecotrack",
        demo: "https://ecotrack-app.com"
      },
      {
        title: "CodeCollab",
        description: "A real-time collaborative coding platform with built-in AI code suggestions and pair programming features.",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["Web Development", "WebSockets", "AI"],
        github: "https://github.com/example/codecollab",
        demo: "https://codecollab.io"
      },
      {
        title: "HealthAI",
        description: "A health monitoring system that uses machine learning to analyze user health data and provide personalized recommendations.",
        image: "/placeholder.svg?height=400&width=600",
        tags: ["Healthcare", "Machine Learning", "React"],
        github: "https://github.com/example/healthai",
        demo: "https://healthai.app"
      }
    ],
    certifications: [
      { title: "AWS Certified Developer" },
      { title: "Google Cloud Professional" },
      { title: "TensorFlow Developer" },
      { title: "React Advanced Patterns" }
    ],
    achievements: [
      { title: "Hackathon Winner 2023", description: "First place in the Global AI Hackathon for developing an innovative healthcare solution" },
      { title: "Open Source Contributor", description: "Significant contributions to major open-source projects including React and Node.js" },
      { title: "Tech Conference Speaker", description: "Regular speaker at international tech conferences on AI and web development" },
      { title: "Mentorship Program", description: "Lead mentor for junior developers in the TechStars mentorship program" }
    ],
    social: {
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      linkedin: "https://linkedin.com/in/alexjohnson",
      github: "https://github.com/alexjohnson",
      twitter: "https://twitter.com/alexjohnson"
    }
  })

  const [showForm, setShowForm] = useState(true)
  const [newSkill, setNewSkill] = useState({ name: "", level: "" })
  const [newProject, setNewProject] = useState({ title: "", description: "", tags: "", github: "", demo: "" })
  const [newCertification, setNewCertification] = useState({ title: "" })
  const [newAchievement, setNewAchievement] = useState({ title: "", description: "" })

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const handlePreview = (e) => {
    e.preventDefault()
    setShowForm(false)
  }

  const addSkill = () => {
    if (newSkill.name && newSkill.level) {
      setPortfolioData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.name, level: parseInt(newSkill.level) }]
      }))
      setNewSkill({ name: "", level: "" })
    }
  }

  const addProject = () => {
    if (newProject.title && newProject.description) {
      setPortfolioData(prev => ({
        ...prev,
        projects: [...prev.projects, {
          ...newProject,
          tags: newProject.tags.split(",").map(tag => tag.trim()),
          image: "/placeholder.svg?height=400&width=600"
        }]
      }))
      setNewProject({ title: "", description: "", tags: "", github: "", demo: "" })
    }
  }

  const addCertification = () => {
    if (newCertification.title) {
      setPortfolioData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }))
      setNewCertification({ title: "" })
    }
  }

  const addAchievement = () => {
    if (newAchievement.title && newAchievement.description) {
      setPortfolioData(prev => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement]
      }))
      setNewAchievement({ title: "", description: "" })
    }
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 text-white">
        <form onSubmit={handlePreview} className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Create Your Portfolio</h2>
          
          {/* Basic Info */}
          <div className="space-y-2">
            <input
              placeholder="Your Name"
              value={portfolioData.name}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Your Title"
              value={portfolioData.title}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <textarea
              placeholder="About You"
              value={portfolioData.about}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, about: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded h-32"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-xl">Add Skill</h3>
            <input
              placeholder="Skill Name"
              value={newSkill.name}
              onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Skill Level (0-100)"
              type="number"
              value={newSkill.level}
              onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <Button onClick={addSkill} type="button">Add Skill</Button>
            <div>
              {portfolioData.skills.map((skill, index) => (
                <p key={index}>{skill.name} - {skill.level}%</p>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-2">
            <h3 className="text-xl">Add Project</h3>
            <input
              placeholder="Project Title"
              value={newProject.title}
              onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Tags (comma-separated)"
              value={newProject.tags}
              onChange={(e) => setNewProject(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="GitHub URL"
              value={newProject.github}
              onChange={(e) => setNewProject(prev => ({ ...prev, github: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Demo URL"
              value={newProject.demo}
              onChange={(e) => setNewProject(prev => ({ ...prev, demo: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <Button onClick={addProject} type="button">Add Project</Button>
            <div>
              {portfolioData.projects.map((project, index) => (
                <p key={index}>{project.title}</p>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h3 className="text-xl">Add Certification</h3>
            <input
              placeholder="Certification Title"
              value={newCertification.title}
              onChange={(e) => setNewCertification(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <Button onClick={addCertification} type="button">Add Certification</Button>
            <div>
              {portfolioData.certifications.map((cert, index) => (
                <p key={index}>{cert.title}</p>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <h3 className="text-xl">Add Achievement</h3>
            <input
              placeholder="Achievement Title"
              value={newAchievement.title}
              onChange={(e) => setNewAchievement(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <textarea
              placeholder="Achievement Description"
              value={newAchievement.description}
              onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <Button onClick={addAchievement} type="button">Add Achievement</Button>
            <div>
              {portfolioData.achievements.map((achievement, index) => (
                <p key={index}>{achievement.title}</p>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <h3 className="text-xl">Social Links</h3>
            <input
              placeholder="Email"
              value={portfolioData.social.email}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, social: { ...prev.social, email: e.target.value } }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Phone"
              value={portfolioData.social.phone}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, social: { ...prev.social, phone: e.target.value } }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="LinkedIn URL"
              value={portfolioData.social.linkedin}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, social: { ...prev.social, linkedin: e.target.value } }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="GitHub URL"
              value={portfolioData.social.github}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, social: { ...prev.social, github: e.target.value } }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
            <input
              placeholder="Twitter URL"
              value={portfolioData.social.twitter}
              onChange={(e) => setPortfolioData(prev => ({ ...prev, social: { ...prev.social, twitter: e.target.value } }))}
              className="w-full p-2 bg-gray-800 text-white rounded"
            />
          </div>

          <Button type="submit" className="w-full">Preview Portfolio</Button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
        <motion.div {...fadeIn} className="container mx-auto px-4 text-center z-10">
          <motion.h1 {...fadeIn} className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500">
            {portfolioData.name}
          </motion.h1>
          <motion.p {...fadeIn} className="text-xl md:text-2xl text-gray-300 mb-8">
            {portfolioData.title}
          </motion.p>
          <motion.p {...fadeIn} className="text-gray-400 max-w-2xl mx-auto">
            {portfolioData.about}
          </motion.p>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4">
        <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }} className="group">
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden">
                  <Image src={project.image} alt={project.title} width={600} height={400} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-400 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-700">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <Link href={project.github} className="text-gray-400 hover:text-white"><Github className="h-6 w-6" /></Link>
                      <Link href={project.demo} className="text-gray-400 hover:text-white"><ExternalLink className="h-6 w-6" /></Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {portfolioData.skills.map((skill, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-gray-400">{skill.level}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4">
        <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {portfolioData.certifications.map((cert, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}>
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <h3 className="text-xl font-bold">{cert.title}</h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-4">
        <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="container mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Achievements & Honors</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioData.achievements.map((achievement, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} whileHover={{ y: -5 }}>
                <Card className="bg-gray-800/50 border-gray-700 p-6">
                  <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                  <p className="text-gray-400">{achievement.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gray-900/50">
        <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }} className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Connect</h2>
          <p className="text-gray-400 mb-4">Email: {portfolioData.social.email}</p>
          <p className="text-gray-400 mb-8">Phone: {portfolioData.social.phone}</p>
          <div className="flex justify-center gap-6">
            {portfolioData.social.email && <Link href={`mailto:${portfolioData.social.email}`} className="text-gray-400 hover:text-white"><Mail className="h-8 w-8" /></Link>}
            {portfolioData.social.linkedin && <Link href={portfolioData.social.linkedin} className="text-gray-400 hover:text-white"><Linkedin className="h-8 w-8" /></Link>}
            {portfolioData.social.github && <Link href={portfolioData.social.github} className="text-gray-400 hover:text-white"><Github className="h-8 w-8" /></Link>}
            {portfolioData.social.twitter && <Link href={portfolioData.social.twitter} className="text-gray-400 hover:text-white"><Twitter className="h-8 w-8" /></Link>}
          </div>
          <Button onClick={() => setShowForm(true)} className="mt-8">Edit Portfolio</Button>
        </motion.div>
      </section>
    </div>
  )
}

