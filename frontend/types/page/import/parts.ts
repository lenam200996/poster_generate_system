export interface Parts {
  id?: number
  name: string
  documentSize: string
  mediaTypes: string[]
  category: string
  columnCategory: string
  detail: string
  remarks: string
  thumbImage?: { file?: File; name: string; path: string }
  inDesign?: {
    file?: File
    name: string
    path: string
  }
  availability: boolean
  created?: string
  updated?: string
}
