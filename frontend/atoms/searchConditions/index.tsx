import { atom } from "recoil"
import { SavedFilterSearchCondition } from "@/types/page/projectlist/savedFilterSearchCondition"

export const savedFilterSearchConditionsState = atom<
  SavedFilterSearchCondition[]
>({
  key: "savedFilterSearchConditionsState",
  default: [],
})
