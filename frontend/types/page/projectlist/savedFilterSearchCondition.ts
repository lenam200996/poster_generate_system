import { FilterSearchCondition } from "./filterSearchCondition"

export interface SavedFilterSearchCondition {
  id: string
  name: string
  conditions: FilterSearchCondition[]
}
