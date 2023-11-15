const generateDownloadLinkFromLocal = (fileBase64, fileName, fileType) => {
  let bin = atob(fileBase64.replace(/^.*,/, ""))
  let buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  const blob = new Blob([buffer.buffer], { type: fileType })
  const link = document.createElement("a")
  link.download = fileName
  link.href = URL.createObjectURL(blob)
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadFileFromLocal = (file) => {
  let fileData: { file: File; fileName: string; type: any; base64: any } = null
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = (event) => {
    fileData = {
      file: file,
      fileName: file.name,
      type: file.type,
      base64: event.target.result,
    }
    generateDownloadLinkFromLocal(
      fileData.base64,
      fileData.fileName,
      fileData.type,
    )
  }
}

export default downloadFileFromLocal
