import { atom } from "recoil"
import { ProjectListResponseDto } from "@/openapi/api"

export const projectlistShownsState = atom({
  key: "projectlistShownsState",
  default: [],
})

export const projectsState = atom<ProjectListResponseDto[]>({
  key: "projectsState",
  default: [],
})
