const generateFileNameFromPath = (path: string) => {
  if (!path) return ""
  return path.split("/").pop().split("\\").pop()
}

export default generateFileNameFromPath
