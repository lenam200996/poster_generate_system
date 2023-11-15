import { atom } from "recoil"
import { Project, projects } from "@/config/api/mock/myStock"

export const myStockProjects = atom<Project[] | null>({
  key: "myStockProjects",
  default: projects,
})
