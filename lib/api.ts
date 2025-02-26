import type { SearchParams, JobSearchResponse } from "./types"

export async function searchJobs(params: SearchParams): Promise<JobSearchResponse> {
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
      "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
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

