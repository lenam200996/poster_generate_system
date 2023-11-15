import { ImageLibrary } from "@/api/imageLibraries"

type ImageType =
  | "旅館"
  | "部屋"
  | "浴場"
  | "浴場展望"
  | "食事"
  | "食事会場"
  | "特典"
  | "特徴"
  | "その他"

export interface ImageItem {
  id: number
  code: string
  category: "yado" | "kanko"
  imageType: ImageType
  name: string
  width: number
  height: number
  image: string
}

export const mockImageItems: ImageLibrary[] = [...Array(23)].map((_, i) => ({
  id: i + 1,
  title: `Image Title ${i}`,
  imageEps: `ImageEps ${i}`,
  imageConvert:
    i % 4 === 1 ? "/assets/image-select-thumb.jpg" : "/assets/000546B2.jpg",
  imageRgb: `ImageRgb ${i}`,
  hotelCode: `HotelCode ${i}`,
  hotelName: `HotelName ${i}`,
  resolution: "350ppi",
  size: "600px x 450px",
  colorSpace: `ColorSpace ${i}`,
  caption: `Caption ${i}`,
  shortCaption: `ShortCaption ${i}`,
  imageFormat: `ImageFormat ${i}`,
  caution: `Caution ${i}`,
  memo: `Memo ${i}`,
  keywords: `Keywords ${i}`,
  imageCategoryId: 3,
  imageCategory: {
    id: 3,
    code: "COMMON_MATERIAL",
    name: "共通素材",
    createdAt: new Date(),
    modifiedAt: new Date(),
    deletedAt: null,
  },
  libraryImageTypes: [...Array(3)].map((_, j) => ({
    id: 15,
    libraryId: i + 1,
    imageTypeId: 2,
    imageType: {
      id: 2,
      code: "ROOMS",
      name: "部屋",
      order: 2,
      createdAt: new Date(),
      modifiedAt: new Date(),
      deletedAt: null,
    },
  })),
}))
