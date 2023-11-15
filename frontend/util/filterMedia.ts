import { mediaOptions } from "@/config/options"

const filterMedia = (values: string[] = []) =>
  mediaOptions.filter(({ value }) => values.includes(value))

export default filterMedia
