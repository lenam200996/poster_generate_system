import { Stamp } from "@/types/page/import/stamp"
import dayjs from "@/util/dayjs"

let mockStampID = 1
export const generateMockStampID = () => String(mockStampID++)

const baseDate = dayjs("2022-11-23T14:34:55Z")

export const mockStamps: Stamp[] = [
  {
    id: generateMockStampID(),
    code: "01",
    name: "75点＿お風呂評価アイコン",
    media: ["テスト"],
    image: "75_ofuro.eps",
    remarks: "",
    category: "",
    thumbImageUrl: "/assets/design-template-stamp.png",
    created: "2022-11-23T14:34:55Z",
    updated: "2022-11-23T14:34:55Z",
  },
  {
    id: generateMockStampID(),
    code: "01",
    name: "ゆこゆこ限定",
    media: ["ゆこゆこ本誌"],
    image: "75_ofuro.eps",
    remarks: "",
    category: "",
    thumbImageUrl: "/assets/design-template-stamp.png",
    created: "2022-11-23T14:34:55Z",
    updated: "2022-11-23T14:34:55Z",
  },
  {
    id: generateMockStampID(),
    code: "01",
    name: "ゆこゆこ限定",
    media: ["テスト", "ゆこゆこ本誌"],
    image: "75_ofuro.eps",
    remarks: "",
    category: "",
    thumbImageUrl: "/assets/design-template-stamp.png",
    created: "2022-11-23T14:34:55Z",
    updated: "2022-11-23T14:34:55Z",
  },
]
  .map((item, i) => {
    const created = baseDate.add(i, "day").toISOString()
    const updated = baseDate.add(i + (i % 3), "day").toISOString()
    return {
      ...item,
      created,
      updated,
    }
  })
  .reverse()

export const categories = [
  { label: "自慢", value: "boast" },
  { label: "口コミ点数", value: "reviewPoint" },
]
