"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface SearchFiltersProps {
  onSearch: (params: any) => void
  isLoading: boolean
}

export function SearchFilters({ onSearch, isLoading }: SearchFiltersProps) {
  const [keywords, setKeywords] = useState("")
  const [locationId, setLocationId] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("")
  const [onsiteRemote, setOnsiteRemote] = useState("")
  const [sort, setSort] = useState("mostRelevant")

  const handleSubmit = (e: React.FormEvent) => {
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
                className="pl-10 bg-gray-800 border-gray-700 focus:border-purple-500 text-white"
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
                className="pl-10 bg-gray-800 border-gray-700 focus:border-purple-500 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience" className="text-purple-300">
              Experience Level
            </Label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white">
                <SelectValue placeholder="Any experience" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="any">Any experience</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="entryLevel">Entry Level</SelectItem>
                <SelectItem value="associate">Associate</SelectItem>
                <SelectItem value="midSeniorLevel">Mid-Senior Level</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="workType" className="text-purple-300">
              Work Type
            </Label>
            <Select value={onsiteRemote} onValueChange={setOnsiteRemote}>
              <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white">
                <SelectValue placeholder="Any work type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="any">Any work type</SelectItem>
                <SelectItem value="onSite">On-site</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full sm:w-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white w-full sm:w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="mostRelevant">Most Relevant</SelectItem>
                <SelectItem value="mostRecent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="border-purple-600 text-purple-300">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-gray-900 border-purple-900/50 text-white">
                <SheetHeader>
                  <SheetTitle className="text-purple-300">Advanced Filters</SheetTitle>
                  <SheetDescription className="text-gray-400">
                    Refine your job search with additional filters
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-purple-300">
                      Industry
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="function" className="text-purple-300">
                      Job Function
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 focus:border-purple-500 text-white">
                        <SelectValue placeholder="Select function" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search Jobs"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

