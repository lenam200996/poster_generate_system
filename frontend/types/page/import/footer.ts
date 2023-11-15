export interface Footer {
  id: number
  name: string
  media: string[]
  plate: Array<{
    value: string
    upLoading?: boolean
    files?: {
      id?: number
      code?: number
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
