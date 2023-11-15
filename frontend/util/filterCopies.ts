import { copiesMock } from "@/config/api/mock/projects"

const filterCopies = (values: string[] = []) =>
  copiesMock.filter(({ value }) => values.includes(value))

export default filterCopies
