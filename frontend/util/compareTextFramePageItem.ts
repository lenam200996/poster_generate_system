import { IdmlItemsResponseDtoItemsInner } from "@/openapi"

const convertJsonWithoutContentKey = (content: object) => {
  return JSON.stringify(
    Object.keys(content)
      .filter((k) => k !== "content")
      .reduce((obj, k) => {
        obj[k] = content[k]
        return obj
      }, {}),
  )
}

// const convertCmpareTextFrameContents = (item: IdmlTextFramePageItemDto) => {
//   return item.texts.reduce((list, item) => {
//     if (list.length > 0) {
//       const json1 = convertJsonWithoutContentKey(item)
//       const json2 = convertJsonWithoutContentKey(list[list.length - 1])
//       if (json1 === json2) {
//         list[list.length - 1].content += item.content
//         return list
//       }
//     }

//     list.push({ content: item.content, red: item.red })
//     return list
//   }, [])
// }

export const compareTextFramePageItem = (
  item1: IdmlItemsResponseDtoItemsInner,
  item2: IdmlItemsResponseDtoItemsInner,
) => {
  if (item1["type"] !== "text" || item2["type"] !== "text") {
    return false
  }

  // const obj1 = convertCmpareTextFrameContents(item1 as IdmlTextFramePageItemDto)
  // const obj2 = convertCmpareTextFrameContents(item2 as IdmlTextFramePageItemDto)
  // return JSON.stringify(obj1) === JSON.stringify(obj2)
  // return JSON.stringify(item1) === JSON.stringify(item1)
  return false
}
