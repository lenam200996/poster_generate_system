import { atom } from "recoil"
import { mockReviewParts } from "@/config/api/mock/import/reviewParts"

export const reviewPartsItemsState = atom({
  key: "reviewPartsItemsState",
  default: mockReviewParts,
})
