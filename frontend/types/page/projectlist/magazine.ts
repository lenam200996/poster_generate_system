import { Booklet } from "./booklet"
import { ProjectSettings } from "./projectSettings"

export interface Magazine {
  id: string
  media: string
  year: string
  month: string
  created: string
  updated: string
  data: Booklet[]
  settings: ProjectSettings
}
