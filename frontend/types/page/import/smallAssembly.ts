export interface SmallAssembly {
  id: number
  name: string
  code: string
  manuscriptSize: string
  media: string[]
  contents: string
  remarks: string
  imageEps?: { file: File; name: string; path: string }
  imageConvert?: { file: File; path: string }
  created?: string
  updated?: string
}
