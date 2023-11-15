import { ReviewParts } from "@/types/page/import/reviewParts"
import dayjs from "@/util/dayjs"

let mockReviewPartsID = 1
export const generateMockReviewPartsID = () => String(mockReviewPartsID++)

const baseDate = dayjs("2022-11-23T14:34:55Z")

export const mockReviewParts: ReviewParts[] = [
  {
    id: generateMockReviewPartsID(),
    code: "H4",
    name: "評価パーツ4/1用",
    media: ["テスト"],
    remarks: "本誌　評価パーツ1/4用",
    thisIssueImage: "Hyoka4_0.eps",
    previousIssueImage: "Hyoka4_1.eps",
    twoPreviousIssueImage: "Hyoka4_2.eps",
    wantedImage: "Hyoka4_2.eps",
    startFillImage: "Hyoka4_2.eps",
    startHalfFillImage: "Hyoka4_2.eps",
    startNonFillImage: "Hyoka4_2.eps",
    wordOfMouthMount: "Hyoka4_2.eps",
    created: "2022-11-23T14:34:55Z",
    updated: "2022-11-23T14:34:55Z",
  },
  {
    id: generateMockReviewPartsID(),
    code: "H1",
    name: "評価パーツ１Ｐ＆１／２用",
    media: ["ゆこゆこ本誌"],
    remarks: "本誌　評価パーツ1/4用",
    thisIssueImage: "Hyoka4_0.eps",
    previousIssueImage: "Hyoka4_1.eps",
    twoPreviousIssueImage: "Hyoka4_2.eps",
    wantedImage: "Hyoka4_2.eps",
    startFillImage: "Hyoka4_2.eps",
    startHalfFillImage: "Hyoka4_2.eps",
    startNonFillImage: "Hyoka4_2.eps",
    wordOfMouthMount: "Hyoka4_2.eps",
    created: "2022-11-23T14:34:55Z",
    updated: "2022-11-23T14:34:55Z",
  },
  {
    id: generateMockReviewPartsID(),
    code: "HK",
    name: "プレミアム評価パーツ",
    media: ["テスト", "ゆこゆこ本誌"],
    remarks: "本誌　評価パーツ1/4用",
    thisIssueImage: "Hyoka4_0.eps",
    previousIssueImage: "Hyoka4_1.eps",
    twoPreviousIssueImage: "Hyoka4_2.eps",
    wantedImage: "Hyoka4_2.eps",
    startFillImage: "Hyoka4_2.eps",
    startHalfFillImage: "Hyoka4_2.eps",
    startNonFillImage: "Hyoka4_2.eps",
    wordOfMouthMount: "Hyoka4_2.eps",
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
