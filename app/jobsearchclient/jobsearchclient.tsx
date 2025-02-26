"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cva } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Icons
import { Search, MapPin, Briefcase, Filter, Clock, Building, ChevronLeft, ChevronRight } from "lucide-react"

// Utility function
function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Types
interface Job {
  id: string
  title: string
  url: string
  referenceId?: string
  posterId?: string
  company?: {
    name: string
    logo: string
    url: string
    staffCountRange?: string
    headquarter?: string
  }
  location?: string
  type?: string
  postDate?: string
  benefits?: string
}

interface JobSearchResponse {
  success: boolean
  message: string
  data: Job[]
  total: number
}
interface SearchParams {
  keywords: string          // Matches "keywords"
  locationId?: string       // Matches "locationId"
  experienceLevel?: string  // Matches "experienceLevel"
  titleIds?: string         // Matches "titleIds"
  functionIds?: string      // Matches "functionIds"
  start?: string           // Matches "start"
  industryIds?: string      // Matches "industryIds"
  onsiteRemote?: string     // Matches "onsiteRemote"
  sort?: string            // Matches "sort"
}

// API function
async function searchJobs(params: SearchParams): Promise<JobSearchResponse> {
  const queryParams = new URLSearchParams()

  // Add all non-empty params to query string
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryParams.append(key, value)
    }
  })

  const url = `https://linkedin-data-api.p.rapidapi.com/search-jobs?${queryParams.toString()}`

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "e2e03befacmsh4187222c1fc0e47p1f0efbjsn4f5964cc54cd",
      "x-rapidapi-host": "linkedin-data-api.p.rapidapi.com",
    },
  }

  try {
    // For demo purposes, return mock data if no API key
    if (!process.env.NEXT_PUBLIC_RAPIDAPI_KEY) {
      return getMockJobData()
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching jobs:", error)
    // Return mock data on error for demo purposes
    return getMockJobData()
  }
}

// Mock data for demonstration purposes
function getMockJobData(): JobSearchResponse {
  return {
    success: true,
    message: "Jobs retrieved successfully",
    data: [
      {
        id: "3847401358",
        title: "Go Developer",
        url: "https://www.linkedin.com/jobs/view/3847401358",
        referenceId: "aYFvP5j3neBOlxUSmxYANA==",
        posterId: "22219443",
        company: {
          name: "5V Video | Certified B Corp™",
          logo: "https://media.licdn.com/dms/image/D4E0BAQHrQWecvQHiEw/company-logo_200_200/0/1688391543328/5vvideo_logo?e=1718841600&v=beta&t=0-TUF4uK0Uf4h_RFgskMIOAsHSdrVhRT2mc9G5wnS94",
          url: "https://www.linkedin.com/company/5vvideo/life",
          staffCountRange: "51-200 employees",
          headquarter: "New York, NY",
        },
        location: "New York City Metropolitan Area (Hybrid)",
        type: "Contract",
        postDate: "1 week ago",
        benefits: "$65/hr - $88/hr",
      },
      {
        id: "3847401359",
        title: "Senior React Developer",
        url: "https://www.linkedin.com/jobs/view/3847401359",
        company: {
          name: "Tech Innovations Inc.",
          logo: "/placeholder.svg?height=200&width=200",
          url: "https://www.linkedin.com/company/techinnovations/",
        },
        location: "San Francisco, CA (Remote)",
        type: "Full-time",
        postDate: "2 days ago",
        benefits: "$120K - $150K/year",
      },
      {
        id: "3847401360",
        title: "Frontend Engineer",
        url: "https://www.linkedin.com/jobs/view/3847401360",
        company: {
          name: "StartupXYZ",
          logo: "/placeholder.svg?height=200&width=200",
          url: "https://www.linkedin.com/company/startupxyz/",
        },
        location: "Austin, TX (Hybrid)",
        type: "Full-time",
        postDate: "3 days ago",
        benefits: "$90K - $120K/year",
      },
      {
        id: "3847401361",
        title: "Backend Developer",
        url: "https://www.linkedin.com/jobs/view/3847401361",
        company: {
          name: "Enterprise Solutions",
          logo: "/placeholder.svg?height=200&width=200",
          url: "https://www.linkedin.com/company/enterprise-solutions/",
        },
        location: "Chicago, IL (On-site)",
        type: "Full-time",
        postDate: "1 week ago",
        benefits: "$100K - $130K/year",
      },
      {
        id: "3847401362",
        title: "DevOps Engineer",
        url: "https://www.linkedin.com/jobs/view/3847401362",
        company: {
          name: "Cloud Systems Inc.",
          logo: "/placeholder.svg?height=200&width=200",
          url: "https://www.linkedin.com/company/cloud-systems/",
        },
        location: "Remote",
        type: "Contract",
        postDate: "5 days ago",
        benefits: "$70/hr - $90/hr",
      },
      {
        id: "3847401363",
        title: "Full Stack Developer",
        url: "https://www.linkedin.com/jobs/view/3847401363",
        company: {
          name: "Digital Agency",
          logo: "/placeholder.svg?height=200&width=200",
          url: "https://www.linkedin.com/company/digital-agency/",
        },
        location: "Boston, MA (Hybrid)",
        type: "Full-time",
        postDate: "2 weeks ago",
        benefits: "$95K - $125K/year",
      },
    ],
    total: 120,
  }
}

// Button component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-purple-600 text-white hover:bg-purple-700",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-700 bg-transparent hover:bg-gray-800 hover:text-white text-gray-300",
        secondary: "bg-gray-800 text-white hover:bg-gray-700",
        ghost: "hover:bg-gray-800 hover:text-white",
        link: "text-purple-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

// Input component
function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

// Label component
function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

// Select components
function Select({ children, value, onValueChange, ...props }) {
  return (
    <div className="relative">
      <select
        className="flex h-10 w-full appearance-none rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        value={value}
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  )
}

function SelectItem({ value, children }) {
  return <option value={value}>{children}</option>
}

// Badge component
function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "bg-purple-900/30 text-purple-300 border-purple-500/50",
    secondary: "bg-blue-900/30 text-blue-300 border-blue-500/50",
    outline: "text-foreground",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}

// Skeleton component
function Skeleton({ className, ...props }) {
  return <div className={cn("animate-pulse rounded-md bg-gray-800", className)} {...props} />
}

// Sheet components for mobile filters
function Sheet({ children, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-3/4 max-w-md bg-gray-900 p-6 shadow-lg">{children}</div>
    </div>
  )
}

function SheetTrigger({ children, onClick }) {
  return <div onClick={onClick}>{children}</div>
}

function SheetContent({ children }) {
  return <div className="flex h-full flex-col">{children}</div>
}

function SheetHeader({ children }) {
  return <div className="mb-6">{children}</div>
}

function SheetTitle({ children }) {
  return <h3 className="text-lg font-semibold text-purple-300">{children}</h3>
}

function SheetDescription({ children }) {
  return <p className="text-sm text-gray-400">{children}</p>
}

// JobCard component
function JobCard({ job }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-purple-900/50 shadow-lg shadow-purple-900/20 flex flex-col h-full transition-all duration-200 hover:border-purple-500/70 hover:shadow-purple-800/30 hover:translate-y-[-2px]">
      <div className="flex items-start gap-4 mb-4">
        <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-800 flex-shrink-0">
          {job.company?.logo ? (
            <Image
              src={job.company.logo || "/placeholder.svg"}
              alt={job.company.name || "Company logo"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-purple-900 text-white">
              <Building size={20} />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold text-white text-lg line-clamp-1">{job.title}</h3>
          <p className="text-purple-300 text-sm">{job.company?.name}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-grow">
        <div className="flex items-center text-gray-400 text-sm">
          <MapPin size={14} className="mr-1.5 text-purple-400" />
          <span>{job.location || "Location not specified"}</span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <Briefcase size={14} className="mr-1.5 text-purple-400" />
          <span>{job.type || "Job type not specified"}</span>
        </div>

        <div className="flex items-center text-gray-400 text-sm">
          <Clock size={14} className="mr-1.5 text-purple-400" />
          <span>{job.postDate || "Date not specified"}</span>
        </div>

        {job.benefits && <div className="text-sm text-white font-medium">{job.benefits}</div>}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.type === "Remote" && <Badge variant="default">Remote</Badge>}
        {job.type === "Hybrid" && <Badge variant="secondary">Hybrid</Badge>}
        {job.type === "Contract" && <Badge>Contract</Badge>}
      </div>

      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-auto"
        onClick={() => window.open(job.url, "_blank")}
      >
        Apply Now
      </Button>
    </div>
  )
}

// JobCardSkeleton component
function JobCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-purple-900/50 shadow-lg shadow-purple-900/20 h-[320px] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-1" />
      <Skeleton className="h-4 w-4/6 mb-4" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-auto pt-4">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  )
}

// JobList component
function JobList({ jobs, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl text-purple-300 mb-2">No jobs found</h3>
        <p className="text-gray-400">Try adjusting your search filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}

// Pagination component
function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = 4
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...")
      }

      // Add page range
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...")
      }

      // Always show last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pageNumbers.map((page, index) =>
        typeof page === "number" ? (
          <Button key={index} variant={currentPage === page ? "default" : "outline"} onClick={() => onPageChange(page)}>
            {page}
          </Button>
        ) : (
          <span key={index} className="text-gray-500">
            {page}
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

// SearchFilters component
function SearchFilters({ onSearch, isLoading }) {
  const [keywords, setKeywords] = useState("")
  const [locationId, setLocationId] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [onsiteRemote, setOnsiteRemote] = useState("")
  const [sort, setSort] = useState("mostRelevant")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch({
      keywords,
      locationId,
      experienceLevel,
      onsiteRemote,
      sort,
      start: "0",
    })
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8 border border-purple-900/50 shadow-lg shadow-purple-900/20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-purple-300">
              Keywords
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <Input
                id="keywords"
                placeholder="Job title, skills, or company"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-purple-300">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-purple-400" />
              <Input
                id="location"
                placeholder="City, state, or country"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-purple-300">
              Experience Level
            </Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectItem value="any">Any experience</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="entryLevel">Entry Level</SelectItem>
              <SelectItem value="associate">Associate</SelectItem>
              <SelectItem value="midSeniorLevel">Mid-Senior Level</SelectItem>
              <SelectItem value="director">Director</SelectItem>
              <SelectItem value="executive">Executive</SelectItem>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType" className="text-purple-300">
              Work Type
            </Label>
            <Select value={onsiteRemote} onValueChange={setOnsiteRemote}>
              <SelectItem value="any">Any work type</SelectItem>
              <SelectItem value="onSite">On-site</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectItem value="mostRelevant">Most Relevant</SelectItem>
              <SelectItem value="mostRecent">Most Recent</SelectItem>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <SheetTrigger onClick={() => setIsFiltersOpen(true)}>
              <Button variant="outline" className="border-purple-600 text-purple-300">
                <Filter className="mr-2 h-4 w-4" />
                Advanced Filters
              </Button>
            </SheetTrigger>

            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search Jobs"}
            </Button>
          </div>
        </div>
      </form>

      <Sheet isOpen={isFiltersOpen} onClose={() => setIsFiltersOpen(false)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Advanced Filters</SheetTitle>
            <SheetDescription>Refine your job search with additional filters</SheetDescription>
          </SheetHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="industry" className="text-purple-300">
                Industry
              </Label>
              <Select>
                <SelectItem value="tech">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="function" className="text-purple-300">
                Job Function
              </Label>
              <Select>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setIsFiltersOpen(false)}>Apply Filters</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Main component
export default function JobSearchClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchParams] = useState({
    keywords: "",
    locationId: "",
    experienceLevel: "",
    titleIds: "",
    functionIds: "",
    industryIds: "",
    onsiteRemote: "",
    sort: "mostRelevant",
    start: "0",
  })

  useEffect(() => {
    // Load initial data
    handleSearch({})
  }, [])

  const handleSearch = async (newParams) => {
    setIsLoading(true)
    try {
      const updatedParams = { ...searchParams, ...newParams }
      setSearchParams(updatedParams)

      const result = await searchJobs(updatedParams)
      setJobs(result.data || [])
      setTotalJobs(result.total || 0)
    } catch (error) {
      console.error("Error searching jobs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page) => {
    const start = (page - 1) * 25
    setCurrentPage(page)
    handleSearch({ start: start.toString() })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950">
      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(128, 90, 213, 0.05);
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(128, 90, 213, 0.3);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(128, 90, 213, 0.5);
        }
      `}</style>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-200 mb-2">
            DevJobs
          </h1>
          <p className="text-purple-300 text-center max-w-2xl">
            Find your next developer role from thousands of listings
          </p>
        </div>

        <SearchFilters onSearch={handleSearch} isLoading={isLoading} />

        <JobList jobs={jobs} isLoading={isLoading} />

        {totalJobs > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              totalItems={totalJobs}
              itemsPerPage={25}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  )
}

