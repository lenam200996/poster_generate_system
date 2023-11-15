import { Manuscript } from "./manuscript"

export interface Booklet {
  id: string
  name: string
  manuscripts: Manuscript[]
  manuscriptCounts: number
  completionCounts: number
  status: string
  locked?: boolean
  updated: string
}
