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
  keywords: string
  locationId?: string
  experienceLevel?: string
  titleIds?: string
  functionIds?: string
  start?: string
  industryIds?: string
  onsiteRemote?: string
  sort?: string
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
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return {
      success: false,
      message: "Failed to fetch jobs",
      data: [],
      total: 0
    }
  }
}

// Rest of the components remain the same (Button, Input, Label, etc.) until JobSearchClient
// [Keeping all other components unchanged for brevity]

export default function JobSearchClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalJobs, setTotalJobs] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchParams, setSearchParams] = useState<SearchParams>({
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

  const handleSearch = async (newParams: Partial<SearchParams>) => {
    setIsLoading(true)
    try {
      const updatedParams = { ...searchParams, ...newParams }
      setSearchParams(updatedParams)

      const result = await searchJobs(updatedParams)
      if (result.success) {
        setJobs(result.data)
        setTotalJobs(result.total)
      } else {
        setJobs([])
        setTotalJobs(0)
      }
    } catch (error) {
      console.error("Error in handleSearch:", error)
      setJobs([])
      setTotalJobs(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    const start = ((page - 1) * 25).toString()
    setCurrentPage(page)
    handleSearch({ start })
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