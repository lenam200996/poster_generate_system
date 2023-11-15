export interface IndexHeader {
  id: number
  name: string
  media: string[]
  plate: Array<{
    value: string
    upLoading?: boolean
    files?: {
      id?: number
      code?: string
      eps?: {
        path?: string
        file?: File
      }
      convertImage?: File
    }[]
  }>
  created?: string
  updated?: string
}
