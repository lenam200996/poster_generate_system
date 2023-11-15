import { atom } from "recoil"
import { DocumentSearchDto } from "@/openapi/api"

export interface DocumentSearchDtoEx extends DocumentSearchDto {
  // 入稿キャンセル、差し戻し、校了のいずれかがクリックされたらtrueになる
  isDisabled?: boolean
}

export const projectManagementDocuments = atom<DocumentSearchDtoEx[]>({
  key: "projectManagementDocuments",
  default: [],
})
