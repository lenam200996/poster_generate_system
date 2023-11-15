import { categoryOptions } from "@/config/options"

const filterCatetories = (values: string[] = []) =>
  categoryOptions.filter(({ value }) => values.includes(value))

export default filterCatetories
