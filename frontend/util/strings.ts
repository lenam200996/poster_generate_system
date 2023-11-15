export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str
  }
  const truncateAt = maxLength - 3
  return str.substring(0, truncateAt) + "..."
}

export const defaultText = (
  text: string | undefined,
  defaultText: string,
): string => {
  return text === undefined || text.trim() === "" ? defaultText : text
}

export const getFileName = (
  filePath: string,
  includeExtension: boolean = false,
): string => {
  if (!filePath) {
    return filePath
  }

  const splittedPath = filePath.split("/")
  const fullFileName = splittedPath[splittedPath.length - 1]
  if (includeExtension) {
    return fullFileName
  } else {
    const fileName = fullFileName.split(".")[0]
    return fileName || filePath
  }
}

export const concatStrings = (strings: string[], separator: string): string => {
  return strings.filter((str) => str).join(separator)
}

export function countBytes(str) {
  let byteCount = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i)
    if (char.charCodeAt(0) >= 0x0800) {
      byteCount += 2
    } else {
      byteCount += 1
    }
  }

  return byteCount
}
