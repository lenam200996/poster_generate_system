export const sortProjectsByCreated = (fn, targetArray) => {
  const array = [...targetArray].sort((x, y) => {
    const firstDate = new Date(x.created)
    const SecondDate = new Date(y.created)

    if (firstDate < SecondDate) return -1
    if (firstDate > SecondDate) return 1
    return 0
  })
  fn(array)
}

export const sortProjectsByYearAndCreated = (fn, targetArray) => {
  const array = [...targetArray].sort((x, y) => {
    const formatFirstYearMonth = `${x.issueYear}-${x.issueMonth}`
    const formatSecondYearMonth = `${y.issueYear}-${y.issueMonth}`
    const firstYearMonth = new Date(formatFirstYearMonth)
    const SecondYearMonth = new Date(formatSecondYearMonth)
    const firstCreatedTime = new Date(x.created)
    const secondCreatedTime = new Date(y.created)

    if (
      firstYearMonth > SecondYearMonth ||
      firstCreatedTime > secondCreatedTime
    )
      return -1
    if (
      firstYearMonth < SecondYearMonth ||
      firstCreatedTime < secondCreatedTime
    )
      return 1
    return 0
  })
  fn(array)
}
