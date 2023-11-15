import { atom } from "recoil"
import { mockStamps } from "@/config/api/mock/import/stamp"

export const stampItemsState = atom({
  key: "stampItemsState",
  default: mockStamps,
})
