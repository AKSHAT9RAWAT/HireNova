import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Job } from "@/lib/types"
import { Briefcase, MapPin, Clock, Building } from "lucide-react"
import Image from "next/image"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
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
        {job.type === "Remote" && (
          <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-500/50">
            Remote
          </Badge>
        )}
        {job.type === "Hybrid" && (
          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500/50">
            Hybrid
          </Badge>
        )}
        {job.type === "Contract" && (
          <Badge variant="outline" className="bg-amber-900/30 text-amber-300 border-amber-500/50">
            Contract
          </Badge>
        )}
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

