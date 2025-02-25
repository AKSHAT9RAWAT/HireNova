"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  ArrowRight,
  Briefcase,
  Github,
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
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

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
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 px-0"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold dark:text-gradient-glow">CareerBoost AI</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9">Tools</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Skill Gap Analysis", icon: Search, href: "/resume-analyzer" },
                        { title: "AI Interviewer", icon: MessageSquare, href: "/interviewprep" },
                        { title: "AI Self Introduction", icon: Star, href: "/self-introduction" },
                        { title: "Motivate.Me", icon: Briefcase, href: "#" },
                        { title: "LinkedIn Roast", icon: Linkedin, href: "/linkedin-roast" },
                        { title: "GitHub Roast", icon: Github, href: "#" },
                        { title: "Code Companion", icon: Terminal, href: "#" },
                        { title: "Dev Connect", icon: Users, href: "#" },
                      ].map((tool) => (
                        <li key={tool.title}>
                          <NavigationMenuLink asChild>
                            <Link href={tool.href} className="flex select-none items-center space-x-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
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
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
            <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
              Contact
            </Link>
            <ThemeToggle />
            <Button className="ml-4" variant="secondary">
              Sign In
            </Button>
            <Button className="ml-2">Get Started</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative">
          <div className="absolute inset-0 overflow-hidden">
            <div className="animate-wave absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-950 dark:via-purple-900 dark:to-purple-800" />
            <div className="animate-wave-slow absolute inset-0 bg-gradient-to-br from-purple-100/50 via-purple-200/50 to-purple-300/50 dark:from-purple-900/50 dark:via-purple-800/50 dark:to-purple-700/50" />
            <div className="absolute inset-0">
              <div className="particles-container" />
            </div>
          </div>
          <div className="container relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
            <div className="max-w-3xl space-y-4">
              <h1 className="text-gradient-glow text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-purple-400 dark:to-purple-100">
                Optimize Your Career with AI
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-purple-200">
                AI-driven tools to enhance your job search and career growth. Take control of your professional journey
                today.
              </p>
              <div className="space-x-4">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 hover:text-primary dark:bg-purple-900 dark:text-purple-100 dark:hover:bg-purple-800"
                >
                  Explore Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary dark:border-purple-400 dark:text-purple-100 dark:hover:bg-purple-800"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="container space-y-8 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Powerful Tools to Supercharge Your Career
            </h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Our AI-powered tools help you prepare, practice, and perfect your career journey.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Skill Gap Analysis",
                description: "Analyze your skills against job requirements and get personalized recommendations.",
                href: "/resume-analyzer"
              },
              {
                icon: MessageSquare,
                title: "AI Interviewer",
                description: "Practice interviews with our AI and get instant feedback on your responses.",
                href: "/interviewprep"
              },
              {
                icon: Star,
                title: "AI Self Introduction",
                description: "Create compelling self-introductions tailored to your target role.",
                href: "#"
              },
              {
                icon: Briefcase,
                title: "Motivate.Me",
                description: "Get personalized motivation and career guidance when you need it most.",
                href: "#"
              },
              {
                icon: Linkedin,
                title: "LinkedIn Roast",
                description: "Get honest feedback on your LinkedIn profile and suggestions for improvement.",
                href: "#"
              },
              {
                icon: Github,
                title: "GitHub Roast",
                description: "Receive constructive criticism on your GitHub profile and projects.",
                href: "#"
              },
            ].map((tool) => (
              <Card key={tool.title} className="group relative overflow-hidden p-6 transition-all hover:shadow-lg">
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-100 to-purple-200 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
                <tool.icon className="h-10 w-10 text-primary" />
                <h3 className="mt-4 font-bold">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{tool.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* For Developers Section */}
        <section className="container space-y-8 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">For Developers</h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Level up your coding skills and connect with fellow developers
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem]">
            <Card className="group relative overflow-hidden p-8 transition-all hover:shadow-lg">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-100 to-purple-200 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              <Terminal className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Code Companion</h3>
              <p className="mt-2 text-muted-foreground">
                Chat with GitHub Codespaces AI to get instant help with your code. Debug, refactor, and learn best
                practices in real-time.
              </p>
              <Button className="mt-4" variant="secondary">
                Start Coding
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
            <Card className="group relative overflow-hidden p-8 transition-all hover:shadow-lg">
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-100 to-purple-200 opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
              <Users className="h-12 w-12 text-primary" />
              <h3 className="mt-4 text-xl font-bold">Dev Connect</h3>
              <p className="mt-2 text-muted-foreground">
                Join a community of developers. Collaborate on projects, share knowledge, and grow together through peer
                programming.
              </p>
              <Button className="mt-4" variant="secondary">
                Join Community
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container space-y-8 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[85%] text-muted-foreground sm:text-lg">
              Everything you need to know about CareerBoost AI
            </p>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How does CareerBoost AI work?</AccordionTrigger>
                <AccordionContent>
                  CareerBoost AI uses advanced artificial intelligence to analyze your profile, provide personalized
                  feedback, and help you improve your career prospects through various tools and features.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, we take data security seriously. All your data is encrypted and stored securely. We never share
                  your personal information with third parties without your consent.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What makes CareerBoost AI different?</AccordionTrigger>
                <AccordionContent>
                  Our platform combines AI-powered analysis with practical tools and a supportive community. We offer
                  personalized feedback and actionable insights to help you achieve your career goals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I try it for free?</AccordionTrigger>
                <AccordionContent>
                  Yes! We offer a free trial that gives you access to our basic features. You can upgrade to a premium
                  plan anytime to unlock all features.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-purple-950 py-12 text-white">
        <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-purple-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-purple-200">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-purple-200">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="hover:text-purple-200">
                <MessagesSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="container mt-8 border-t border-white/10 pt-8">
          <p className="text-center text-sm">© 2025 CareerBoost AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}