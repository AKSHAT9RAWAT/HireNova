"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import {
  ArrowRight,
  Briefcase,
  Linkedin,
  MessageSquare,
  Search,
  Star,
  Zap,
  Users,
  Terminal,
  MessagesSquare,
  Moon,
  Sun,
  Mail,
  Target,
  FileText,
  BarChart3,
  Map,
  BookOpen,
  Building,
  GraduationCap,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Montserrat } from "next/font/google"
import { LucideIcon } from "lucide-react"

const montserrat = Montserrat({ subsets: ["latin"] })

interface Tool {
  title: string;
  description: string;
  image: string;
}

interface CategorySection {
  title: string;
  description: string;
  tools: Tool[];
  Icon: LucideIcon;
}

// Organize tools by category
const toolCategories = {
  jobSearch: [
    {
      title: "Job Search Engine",
      icon: Search,
      href: "/jobsearch",
      description: "Find your perfect job with our AI-powered search engine that matches your skills and preferences",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80",
      badge: "New",
    },
    {
      title: "Job Description Decoder",
      icon: FileText,
      href: "/jobdecoder",
      description: "Understand what employers are really looking for in job descriptions",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Job Comparison",
      icon: BarChart3,
      href: "/jobcompare",
      description: "Compare job offers side by side to make the best career decision",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Master Outreach",
      icon: Mail,
      href: "/emailwriter",
      description: "Create personalized outreach emails that get responses from hiring managers",
      image: "https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=800&auto=format&fit=crop&q=80",
    },
  ],
  profileOptimization: [
    {
      title: "Skill Gap Analysis",
      icon: Search,
      href: "/resume-analyzer",
      description: "Analyze your resume against job requirements to identify and bridge skill gaps",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "LinkedIn Optimizer",
      icon: Linkedin,
      href: "/linkedin-roast",
      description: "Get actionable feedback to transform your LinkedIn profile and attract recruiters",
      image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "PortfolioPro",
      icon: Briefcase,
      href: "/portfolio",
      description: "Build an impressive portfolio that showcases your skills and experience effectively",
      image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    },
  ],
  interviewPrep: [
    {
      title: "AI Interviewer",
      icon: MessageSquare,
      href: "/interviewprep",
      description: "Practice interviews with our AI and receive instant feedback to improve your performance",
      image: "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "AI Self Introduction",
      icon: Star,
      href: "/self-introduction",
      description: "Generate compelling self-introductions tailored to your target role and company",
      image: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "AI-Powered Preparation",
      icon: BookOpen,
      href: "/preparationai",
      description: "Prepare for interviews and assessments with AI-generated practice materials",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80",
    },
  ],
  careerDevelopment: [
    {
      title: "Career Goal Setter",
      icon: Target,
      href: "/careergoal",
      description: "Define and track your career goals with personalized action plans",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Roadmap Generator",
      icon: Map,
      href: "/roadmap",
      description: "Get a personalized career roadmap based on your goals and current skills",
      image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Career Chatbot",
      icon: MessagesSquare,
      href: "/chatbot",
      description: "Get instant answers to your career questions from our AI-powered assistant",
      image: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=800&auto=format&fit=crop&q=80",
    },
  ],
  developerTools: [
    {
      title: "Code Companion",
      icon: Terminal,
      href: "/githubchat",
      description: "Get real-time coding assistance and learn best practices while you code",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e256?w=800&auto=format&fit=crop&q=80",
    },
    {
      title: "Dev Connect",
      icon: Users,
      href: "/aicoder",
      description: "Connect with fellow developers to collaborate on projects and share knowledge",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    },
  ],
}

// Flatten all tools for navigation menu
const allTools = [
  ...toolCategories.jobSearch,
  ...toolCategories.profileOptimization,
  ...toolCategories.interviewPrep,
  ...toolCategories.careerDevelopment,
  ...toolCategories.developerTools,
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9 px-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function FeatureSection({ tool, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })
  const isEven = index % 2 === 0

  return (
    <section ref={ref} className="py-20 overflow-hidden">
      <div className="container">
        <div
          className={cn("grid gap-8 items-center", isEven ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-[1.2fr_1fr]")}
        >
          <motion.div
            className={cn("space-y-6", isEven ? "lg:order-1" : "lg:order-2")}
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -50 : 50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {tool.badge && (
              <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                {tool.badge}
              </Badge>
            )}
            <div className="inline-flex items-center gap-2 rounded-full bg-green-900/30 px-4 py-1.5 text-sm font-medium text-green-300">
              <tool.icon className="h-4 w-4" />
              <span>Featured Tool</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
              {tool.title}
            </h2>
            <p className="text-lg text-green-200/80">{tool.description}</p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="group bg-green-600 hover:bg-green-700 text-white">
                Try Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="border-green-700 text-green-300 hover:bg-green-900/50">
                Learn More
              </Button>
            </div>
          </motion.div>

          <motion.div
            className={cn("relative aspect-video overflow-hidden rounded-xl", isEven ? "lg:order-2" : "lg:order-1")}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Image
              src={tool.image || "/placeholder.svg"}
              alt={tool.title}
              fill
              className="object-cover transition-transform duration-700"
              style={{
                transform: isInView ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-green-900/70 to-transparent opacity-80" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ToolCard({ tool }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-green-500/5 bg-black border-green-900/50">
        <CardContent className="p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-900/30">
            <tool.icon className="h-6 w-6 text-green-400" />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-white">{tool.title}</h3>
            {tool.badge && (
              <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                {tool.badge}
              </Badge>
            )}
          </div>
          <p className="mb-4 text-sm text-green-200/70">{tool.description}</p>
          <Link
            href={tool.href}
            className="inline-flex items-center text-sm font-medium text-green-400 hover:text-green-300"
          >
            Explore
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CategorySection({ title, description, tools, icon: Icon }) {
  return (
    <section className="py-16">
      <div className="container">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
            <Icon className="h-8 w-8 text-green-400" />
          </div>
          <motion.h2
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="max-w-[700px] text-lg text-green-200/80"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.title} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HeroParticle({ delay = 0 }) {
  const randomX = Math.random() * 100
  const randomSize = Math.random() * 10 + 5
  const randomDuration = Math.random() * 10 + 15

  return (
    <motion.div
      className="absolute rounded-full bg-green-500/20"
      initial={{
        x: `${randomX}%`,
        y: "110%",
        opacity: 0.1,
        width: randomSize,
        height: randomSize,
      }}
      animate={{
        y: "-10%",
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: randomDuration,
        repeat: Number.POSITIVE_INFINITY,
        delay,
        ease: "linear",
      }}
    />
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Generate particles for hero animation
  const particles = Array.from({ length: 20 }).map((_, i) => <HeroParticle key={i} delay={i * 0.5} />)

  // Set dark theme as default
  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-50 w-full border-b border-green-900/50 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-green-400" />
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
              HireNova
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 bg-transparent text-green-200 hover:bg-green-900/30 hover:text-green-100">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-black border border-green-900/50">
                      {allTools.slice(0, 10).map((tool) => (
                        <li key={tool.title}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={tool.href}
                              className="flex select-none items-center space-x-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-900/30 hover:text-green-100 text-green-200"
                            >
                              <tool.icon className="h-4 w-4" />
                              <span>{tool.title}</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <Link href="#" className="text-sm font-medium transition-colors text-green-200 hover:text-green-100">
              About
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors text-green-200 hover:text-green-100">
              Contact
            </Link>
            <ThemeToggle />
            <Button
              className="ml-4"
              variant="outline"
              className="border-green-700 text-green-300 hover:bg-green-900/50"
            >
              Sign In
            </Button>
            <Button className="ml-2 bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Parallax */}
        <section ref={heroRef} className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-green-800/10 to-black"
            style={{ scale: heroScale }}
          />

          <div className="absolute inset-0 overflow-hidden">{particles}</div>

          <motion.div
            className="container relative flex min-h-[90vh] flex-col items-center justify-center text-center"
            style={{ opacity: heroOpacity }}
          >
            <motion.div
              className="max-w-3xl space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/30"
              >
                <Zap className="h-10 w-10 text-green-400" />
              </motion.div>

              <h1 className={`text-4xl font-bold tracking-tight sm:text-6xl ${montserrat.className}`}>
                Elevate Your <span className="text-purple-500">Career</span> Journey
              </h1>

              <motion.p
                className="mx-auto max-w-[700px] text-xl text-green-200/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Discover AI-powered tools designed to transform your job search, enhance your professional profile, and
                accelerate your career growth.
              </motion.p>

              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button size="lg" className="group bg-green-600 hover:bg-green-700 text-white">
                  Explore Tools
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-700 text-green-300 hover:bg-green-900/50"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 1.2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            >
              <ArrowRight className="h-6 w-6 rotate-90 text-green-400" />
            </motion.div>
          </motion.div>
        </section>

        {/* Featured Tools with Alternating Layout */}
        <div className="py-10">
          <div className="container text-center mb-16">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Featured Tools
            </motion.h2>
            <motion.p
              className="mx-auto max-w-[700px] text-lg text-green-200/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Discover our most popular tools to accelerate your career growth
            </motion.p>
          </div>

          {/* Alternating feature sections with growing images on scroll */}
          <FeatureSection tool={toolCategories.jobSearch[0]} index={0} />
          <FeatureSection tool={toolCategories.interviewPrep[0]} index={1} />
          <FeatureSection tool={toolCategories.profileOptimization[0]} index={2} />
        </div>

        {/* Thematic Categories */}
        <div className="border-t border-green-900/30 py-16">
          <div className="container">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
                Explore Our Tools by Category
              </h2>
              <p className="mx-auto max-w-[700px] text-lg text-green-200/80">
                Find the perfect tools for every stage of your career journey
              </p>
            </motion.div>

            <Tabs defaultValue="jobSearch" className="w-full">
              <TabsList className="w-full justify-start mb-8 bg-transparent border-b border-green-900/30 overflow-x-auto flex-nowrap">
                <TabsTrigger
                  value="jobSearch"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-200 text-green-300/70"
                >
                  Job Search
                </TabsTrigger>
                <TabsTrigger
                  value="profileOptimization"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-200 text-green-300/70"
                >
                  Profile Optimization
                </TabsTrigger>
                <TabsTrigger
                  value="interviewPrep"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-200 text-green-300/70"
                >
                  Interview Preparation
                </TabsTrigger>
                <TabsTrigger
                  value="careerDevelopment"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-200 text-green-300/70"
                >
                  Career Development
                </TabsTrigger>
                <TabsTrigger
                  value="developerTools"
                  className="data-[state=active]:bg-green-900/30 data-[state=active]:text-green-200 text-green-300/70"
                >
                  Developer Tools
                </TabsTrigger>
              </TabsList>

              <TabsContent value="jobSearch" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {toolCategories.jobSearch.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="profileOptimization" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {toolCategories.profileOptimization.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="interviewPrep" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {toolCategories.interviewPrep.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="careerDevelopment" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {toolCategories.careerDevelopment.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="developerTools" className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {toolCategories.developerTools.map((tool) => (
                    <ToolCard key={tool.title} tool={tool} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Individual Category Sections */}
        <CategorySection
          title="Find Your Dream Job"
          description="Our comprehensive job search tools help you discover, analyze, and apply for the perfect positions"
          tools={toolCategories.jobSearch}
          icon={Building}
        />

        <div className="border-t border-green-900/30">
          <CategorySection
            title="Optimize Your Professional Profile"
            description="Stand out from the crowd with tools that enhance your resume, portfolio, and online presence"
            tools={toolCategories.profileOptimization}
            icon={Sparkles}
          />
        </div>

        <div className="border-t border-green-900/30">
          <CategorySection
            title="Ace Your Interviews"
            description="Practice and prepare for interviews with AI-powered tools that provide real-time feedback"
            tools={toolCategories.interviewPrep}
            icon={MessageSquare}
          />
        </div>

        <div className="border-t border-green-900/30">
          <CategorySection
            title="Plan Your Career Growth"
            description="Set goals, create roadmaps, and get guidance for your long-term career development"
            tools={toolCategories.careerDevelopment}
            icon={GraduationCap}
          />
        </div>

        {/* Developer Section */}
        <section className="border-t border-green-900/30 py-24">
          <div className="container">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
              <motion.h2
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                For Developers
              </motion.h2>
              <motion.p
                className="max-w-[85%] text-lg text-green-200/80"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Level up your coding skills and connect with fellow developers
              </motion.p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-green-500/10 bg-black border-green-900/50">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
                      <Terminal className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Code Companion</h3>
                    <p className="mb-6 text-green-200/70">
                      Chat with GitHub Codespaces AI to get instant help with your code. Debug, refactor, and learn best
                      practices in real-time.
                    </p>
                    <Button className="group bg-green-600 hover:bg-green-700 text-white" size="lg">
                      Start Coding
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:shadow-green-500/10 bg-black border-green-900/50">
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-900/30">
                      <Users className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-white">Dev Connect</h3>
                    <p className="mb-6 text-green-200/70">
                      Join a community of developers. Collaborate on projects, share knowledge, and grow together
                      through peer programming.
                    </p>
                    <Button className="group bg-green-600 hover:bg-green-700 text-white" size="lg">
                      Join Community
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container space-y-12 py-24 border-t border-green-900/30">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              className="max-w-[85%] text-lg text-green-200/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Everything you need to know about HireNova
            </motion.p>
          </div>

          <motion.div
            className="mx-auto max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-green-900/30">
                <AccordionTrigger className="text-green-200">How does HireNova work?</AccordionTrigger>
                <AccordionContent className="text-green-200/70">
                  HireNova uses advanced artificial intelligence to analyze your profile, provide personalized
                  feedback, and help you improve your career prospects through various tools and features.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-green-900/30">
                <AccordionTrigger className="text-green-200">Is my data secure?</AccordionTrigger>
                <AccordionContent className="text-green-200/70">
                  Yes, we take data security seriously. All your data is encrypted and stored securely. We never share
                  your personal information with third parties without your consent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-green-900/30">
                <AccordionTrigger className="text-green-200">What makes HireNova different?</AccordionTrigger>
                <AccordionContent className="text-green-200/70">
                  Our platform combines AI-powered analysis with practical tools and a supportive community. We offer
                  personalized feedback and actionable insights to help you achieve your career goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-green-900/30">
                <AccordionTrigger className="text-green-200">Can I try it for free?</AccordionTrigger>
                <AccordionContent className="text-green-200/70">
                  Yes! We offer a free trial that gives you access to our basic features. You can upgrade to a premium
                  plan anytime to unlock all features.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24 text-white border-t border-green-900/30">
          <div className="absolute inset-0 bg-gradient-to-r from-green-900 to-green-700 opacity-30" />
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] bg-cover bg-center opacity-10" />
          <div className="container relative">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200">
                Ready to Transform Your Career?
              </h2>
              <p className="mb-8 text-lg text-green-200/80">
                Join thousands of professionals who have accelerated their career growth with our AI-powered tools.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="group bg-green-600 hover:bg-green-700 text-white">
                  Get Started for Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-400/30 text-green-200 hover:bg-green-700/20"
                >
                  Schedule a Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-green-900/50 bg-black py-12">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-green-300/70 hover:text-green-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-300/70 hover:text-green-200">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-green-300/70 hover:text-green-200">
                <MessagesSquare className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-green-300/70 hover:text-green-200">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="container mt-8 border-t border-green-900/30 pt-8">
          <p className="text-center text-sm text-green-300/50">© 2025 HireNova. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

