import { atom, selector, selectorFamily } from "recoil"
import {
  BookletDetailResponseDto,
  DocumentResponseDto,
  IdmlImagePageItemDto,
  IdmlImagePageSubItemDto,
  IdmlItemsResponseDto,
  IdmlItemsResponseDtoItemsInner,
  IdmlTextFramePageItemDto,
  IdmlTextFramePageTextContentDto,
  IdmlTextFramePageTextDto,
} from "@/openapi"
import { getFileName } from "@/util/strings"

type OutPuts = number[]

export const workspaceShownsState = atom({
  key: "workspaceShownsState",
  default: [],
})

export const workspaceOutputsState = atom<OutPuts>({
  key: "workspaceOutputsState",
  default: [],
})

export const workspaceBookletState = atom<BookletDetailResponseDto | null>({
  key: "workspaceBookletState",
  default: null,
})

export const workspaceManuscriptState = atom<{
  id: number
  editId: string
  original?: IdmlItemsResponseDto
  items?: Array<IdmlItemsResponseDtoItemsInner>
  selectedItem?: IdmlItemsResponseDtoItemsInner
  selectedPartsTagId?: string
  isPartsEditing?: boolean
  partsModalShown?: boolean
  viewState?: "Hotel" | "Price"
  document: DocumentResponseDto
} | null>({
  key: "workspaceManuscriptState",
  default: null,
})

export const workspaceActivePageNumberState = atom<number>({
  key: "workspaceActivePageNumberState",
  default: null,
})

export const workspaceActivePageOrderState = atom<number>({
  key: "workspaceActivePageOrderState",
  default: null,
})

export const textSelectorFamily = selectorFamily<
  | IdmlTextFramePageTextDto
  | Array<IdmlTextFramePageTextContentDto>
  | string
  | null,
  string // tagId id
>({
  key: "textSelector",
  get:
    (tagId) =>
    ({ get }) => {
      const manuscriptState = get(workspaceManuscriptState)
      if (!manuscriptState || !manuscriptState.items) return null
      for (const item of manuscriptState.items) {
        if (item.type === "text") {
          const foundText = (item as IdmlTextFramePageItemDto).texts?.find(
            (textItem) => textItem.tagId === tagId,
          )
          if (foundText) {
            return foundText
          }
        }
      }
      return null
    },
  set:
    (tagId) =>
    (
      { set, get },
      newValue: string | Array<IdmlTextFramePageTextContentDto>,
    ) => {
      const manuscriptState = get(workspaceManuscriptState)
      if (!manuscriptState || !manuscriptState.items) return

      const newItems = manuscriptState.items.map((item) => {
        if (item.type === "text" && (item as IdmlTextFramePageItemDto).texts) {
          return {
            ...item,
            texts: (item as IdmlTextFramePageItemDto).texts.map((textItem) => {
              if (textItem.tagId === tagId) {
                if (typeof newValue === "string" && textItem.contents) {
                  return {
                    ...textItem,
                    contents: [
                      {
                        ...textItem.contents[0],
                        content: newValue,
                      },
                    ],
                  }
                } else {
                  return {
                    ...textItem,
                    contents: newValue as IdmlTextFramePageTextContentDto[],
                  }
                }
              }
              return textItem
            }),
          }
        } else {
          return item
        }
      })
      set(workspaceManuscriptState, { ...manuscriptState, items: newItems })
    },
})

export const imageSelectorFamily = selectorFamily<
  IdmlImagePageSubItemDto | string | null,
  string // tagId
>({
  key: "imageSelector",
  get:
    (tagId) =>
    ({ get }) => {
      const manuscriptState = get(workspaceManuscriptState)
      if (!manuscriptState || !manuscriptState.items) return null
      for (const item of manuscriptState.items) {
        if (item.type === "image") {
          const foundImage = (item as IdmlImagePageItemDto).images?.find(
            (image) => !item.parentTagId && image.tag === tagId,
          )
          if (foundImage) {
            return foundImage
          }
        }
      }
      return null
    },
  set:
    (tagId) =>
    ({ set, get }, newValue) => {
      const manuscriptState = get(workspaceManuscriptState)
      if (
        !manuscriptState ||
        !manuscriptState.items ||
        typeof newValue !== "string"
      )
        return
      const newItems = manuscriptState.items.map((item) => {
        if (item.type === "image") {
          return {
            ...item,
            images: (item as IdmlImagePageItemDto).images.map((image) =>
              !item.parentTagId && image.tag === tagId
                ? {
                    ...image,
                    imageFileName: newValue,
                  }
                : image,
            ),
          }
        } else {
          return item
        }
      })
      set(workspaceManuscriptState, { ...manuscriptState, items: newItems })
    },
})

export const updatedTextItemsSelector = selector<
  Array<{
    tagId: string
    contents: Array<IdmlTextFramePageTextContentDto>
  }>
>({
  key: "updatedTextItems",
  get: ({ get }) => {
    const manuscriptState = get(workspaceManuscriptState)
    if (!manuscriptState || !manuscriptState.items) return []

    const updateItems = manuscriptState.items
      .filter(
        (item) =>
          item.type === "text" &&
          (item as IdmlTextFramePageItemDto)?.texts?.length > 0,
      )
      .filter((item) => {
        const original = (
          manuscriptState.original ? manuscriptState.original.items : []
        ).find(
          (originalItem) =>
            originalItem.type === "text" && originalItem.self === item.self,
        )
        const itemJson = JSON.stringify(item)
        const originalJson = JSON.stringify(original)
        return original && !(originalJson === itemJson)
      })
      .flatMap((item: IdmlTextFramePageItemDto) => {
        return item.texts.map((text) => ({
          tagId: text.tagId,
          contents: text.contents,
        }))
      })

    return updateItems
  },
})

export const updatedIconItemsSelector = selector<
  Array<{ tagId: string; icon: string }>
>({
  key: "updatedIconItems",
  get: ({ get }) => {
    const manuscriptState = get(workspaceManuscriptState)
    if (!manuscriptState || !manuscriptState.items) return []

    return (manuscriptState.items ?? [])
      .filter((item): item is IdmlImagePageItemDto => item.type === "image")
      .filter((item) => {
        const original = (
          manuscriptState.original ? manuscriptState.original.items : []
        ).find(
          (originalItem) =>
            originalItem.type === "image" && originalItem.self === item.self,
        )
        const itemJson = JSON.stringify(item)
        const originalJson = JSON.stringify(original)
        return original && !(originalJson === itemJson)
      })
      .flatMap((item: IdmlImagePageItemDto) =>
        item.images
          .filter(
            (image) =>
              !!image.imageFileName && !image.imageFileName.startsWith("http"),
          )
          .map((image) => ({
            tagId: image.tag,
            icon: getFileName(decodeURIComponent(image.imageFileName)),
          })),
      )
  },
})

export const updatedImageItemsSelector = selector<
  Array<{ tagId: string; name: string }>
>({
  key: "updatedImageItems",
  get: ({ get }) => {
    const manuscriptState = get(workspaceManuscriptState)
    if (!manuscriptState || !manuscriptState.items) return []

    return (manuscriptState.items ?? [])
      .filter((item): item is IdmlImagePageItemDto => item.type === "image")
      .filter((item) => {
        const original = (
          manuscriptState.original ? manuscriptState.original.items : []
        ).find(
          (originalItem) =>
            originalItem.type === "image" && originalItem.self === item.self,
        )
        return original
      })
      .flatMap((item: IdmlImagePageItemDto) =>
        item.images
          .filter(
            (image) =>
              !!image.imageFileName && image.imageFileName.startsWith("http"),
          )
          .map((image) => ({
            tagId: image.tag,
            name: image.imageFileName,
          })),
      )
  },
})
