import type { Metadata } from "next"
import JobSearchClient from "./jobsearchclient"

export const metadata: Metadata = {
  title: "DevJobs | Find Your Next Developer Role",
  description: "Search for developer jobs across the globe",
}

export default function JobSearchApp() {
  return <JobSearchClient />
}

