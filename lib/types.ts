export interface Job {
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

export interface JobSearchResponse {
  success: boolean
  message: string
  data: Job[]
  total: number
}

export interface SearchParams {
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

