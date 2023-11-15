import { atom } from "recoil"

export const GlobalNavigationVisibleState = atom<boolean>({
  key: "GlobalNavigationVisibleState",
  default: false,
})

export const GlobalLoadingState = atom<boolean>({
  key: "GlobalLoadingState",
  default: false,
})
