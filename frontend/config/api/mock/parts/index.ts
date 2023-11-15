import {
  DocumentPartsCategoryDtoDocumentPartsClassEnum,
  DocumentPartsMediaTypeDtoMediaTypeCodeEnum,
} from "@/openapi"
import { DocumentSizeType } from "../workspace/booklet"

export type documentPartsCategories = "OSHINAGAKI"

export type PartsType = {
  partsName: string
  partsCode: string
  applicableDocumentSize: DocumentSizeType[]
  mediaType: DocumentPartsMediaTypeDtoMediaTypeCodeEnum[]
  class: DocumentPartsCategoryDtoDocumentPartsClassEnum[]
  category: documentPartsCategories
  description: string
  disabled: boolean
  indesignData: string
  comment: string
  items: PartsItemType[]
}

export type PartsItemType = {
  tagId: string
  name: string
  // text?: string
  // path?: string
  // selectId?: string
  // textColorRed?: boolean
  // useChotai?: boolean
  // chotaiRatio?: number
  // imageWidth?: number
  // imageHeight?: number
}

export const OptionMaster = [
  {
    name: "丹波牛ステーキ",
    id: "TEST01",
  },
]

export const PriceCategoryMaster = [
  {
    id: "おひとり（大人のみ）",
    name: "おひとり（大人のみ）",
  },
  {
    id: "ひとつ",
    name: "ひとつ",
  },
]

export const BookingCategoryMaster = [
  {
    name: "おひとり",
    id: "OHITORI",
  },
]
export const ColumnCategoryMaster = [
  {
    name: "部屋食",
    id: "HEYASHOKU",
  },
  {
    name: "先割",
    id: "SAKIWARI",
  },
  {
    name: "先得",
    id: "SAKITOKU",
  },
  {
    name: "割引",
    id: "WARIBIKI",
  },
  {
    name: "連泊",
    id: "RENPAKU",
  },
  {
    name: "一人泊",
    id: "HITORIPAKU",
  },
  {
    name: "チケット付き",
    id: "TICKETTSUKI",
  },
  {
    name: "選べる料理",
    id: "ERABERU",
  },
  {
    name: "追加料金でお得",
    id: "TUIKARYOKIN",
  },
  {
    name: "個室会場食",
    id: "KOSHITUKAIJO",
  },
]

export const PartsMock: PartsType[] = [
  {
    partsName: "プランコラム 画像x1 注釈なし",
    partsCode: "Y01",
    applicableDocumentSize: ["ONE_ONE"],
    mediaType: ["MAGAZINE"],
    class: ["COMMON"],
    category: "OSHINAGAKI",
    description: "プランコラム 画像x1 注釈なし",
    disabled: false,
    indesignData: "test.idml",
    comment: "選べる客室　画像２枚",
    items: [
      {
        tagId: "ROP_NAME",
        name: "オプション名",
      },
      {
        tagId: "PLN_NAME",
        name: "プラン名",
      },
      {
        tagId: "GLI_OPC_CD",
        name: "受付種別",
      },
      {
        tagId: "ROP_CLS",
        name: "料金種別",
      },
      {
        tagId: "GLI_CLT_CD",
        name: "コラムタイプ",
      },
      {
        tagId: "ROP_PRICE",
        name: "料金",
      },
      {
        tagId: "PLN_PRICE",
        name: "料金",
      },
      {
        tagId: "GLI_BODY_TXT",
        name: "コピー",
      },
      {
        tagId: "GLI_CMT_TXT",
        name: "注釈",
      },
      {
        tagId: "GLI_IMG1",
        name: "画像1",
      },
      {
        tagId: "GLI_IMG2",
        name: "画像2",
      },
    ],
  },
]
