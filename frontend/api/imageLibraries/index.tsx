import axios from "axios"

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_IMAGE_API_URL}/v1`,
  headers: { "content-type": "application/json" },
})

type ImageCategoryListResponseType = Array<{
  id: number
  code: string
  name: string
  createdAt: Date
  modifiedAt: Date
  deletedAt: Date
}>

export const getImageCategoryList = async () => {
  const response = await axiosInstance.get<ImageCategoryListResponseType>(
    "/libraries/image-category-list",
  )
  return response.data
}

type ImageTypeListResponseType = Array<{
  id: number
  code: string
  name: string
  order: number
  createdAt: Date
  modifiedAt: Date
  deletedAt: Date
}>

export const getImageTypeList = async () => {
  const response = await axiosInstance.get<ImageTypeListResponseType>(
    "/libraries/image-type-list",
  )
  return response.data
}

type ImageType = {
  id: number
  code: string
  name: string
  order: number
  createdAt: Date
  modifiedAt: Date
  deletedAt: Date
}

type LibraryImageType = {
  id: number
  imageTypeId: number
  imageType: ImageType
}

type ImageCategory = {
  id: number
  code: string
  name: string
  createdAt: Date
  modifiedAt: Date
  deletedAt: Date
}

export type ImageLibrary = {
  id: number
  title: string
  imageEps?: string
  imageConvert: string
  imageRgb?: string
  hotelCode?: string
  hotelName?: string
  resolution: string
  size: string
  colorSpace: string
  caption?: string
  shortCaption?: string
  imageFormat: string
  caution?: string
  memo?: string
  keywords?: string
  imageCategoryId: number
  imageCategory: ImageCategory
  libraryImageTypes: LibraryImageType[]
}

export type LibraryResponseType = {
  count: number
  data: ImageLibrary[]
}

export const getImageLibraries = async () => {
  const response = await axiosInstance.get<LibraryResponseType>("/libraries")
  return response.data
}
