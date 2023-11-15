import { atom } from "recoil"

export const favoriteImagesState = atom<number[]>({
  key: "favoriteImagesState",
  default: [],
})

export const usedImagesState = atom<number[]>({
  key: "usedImagesState",
  default: [],
})
