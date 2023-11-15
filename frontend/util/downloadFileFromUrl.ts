const downloadFileFromUrl = (url: string, name: string) => {
  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", name)
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export default downloadFileFromUrl
