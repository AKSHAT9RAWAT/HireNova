import { JobCard } from "@/components/job-card"
import type { Job } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface JobListProps {
  jobs: Job[]
  isLoading: boolean
}

export function JobList({ jobs, isLoading }: JobListProps) {
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

function JobCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-purple-900/50 shadow-lg shadow-purple-900/20 h-[320px] flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="h-12 w-12 rounded-md bg-gray-800" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 bg-gray-800" />
          <Skeleton className="h-3 w-24 bg-gray-800" />
        </div>
      </div>
      <Skeleton className="h-5 w-3/4 mb-2 bg-gray-800" />
      <Skeleton className="h-4 w-full mb-1 bg-gray-800" />
      <Skeleton className="h-4 w-5/6 mb-1 bg-gray-800" />
      <Skeleton className="h-4 w-4/6 mb-4 bg-gray-800" />
      <div className="flex gap-2 mt-2">
        <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
        <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
      </div>
      <div className="mt-auto pt-4">
        <Skeleton className="h-9 w-full rounded-md bg-gray-800" />
      </div>
    </div>
  )
}

