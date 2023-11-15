import { Button, Divider, MenuItem, Select, TextField } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import IdmlTextEditor, {
  EditorContent,
  IdmlTextEditorHandle,
} from "../../idml/IdmlTextEditor"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import WorkspaceModalImageSelect from "../Modal/WorkspaceModalImageSelect"
import {
  ImageLibrary,
  getImageCategoryList,
  getImageLibraries,
  getImageTypeList,
} from "@/api/imageLibraries"
import { OptionType } from "@/types/page/workspace/optionType"
import {
  ColumnCategoryMaster,
  PartsType,
  PriceCategoryMaster,
} from "@/config/api/mock/parts"
import { useRecoilState, useSetRecoilState } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import {
  IdmlImagePageItemDto,
  IdmlImagePageSubItemDto,
  IdmlTextFramePageItemDto,
  IdmlTextFramePageTextContentDto,
  IdmlUpdateContentItemDto,
} from "@/openapi"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { useApiClient } from "@/hooks/useApiClient"
import { GlobalLoadingState } from "@/atoms/global"
import WorkspaceModalPartsPlan from "@/components/page/workspace/Modal/WorkspaceModalPartsPlan"
import WorkspaceImageTriming from "@/components/page/workspace/WorkspaceImageTriming"

type Props = {
  parts: PartsType
}

interface PartsFormState {
  [key: string]: string
}

interface FormTextLengthState {
  [key: string]: number
}

const TAG_ID_ROP_NAME = "ROP_NAME" // オプション名
const TAG_ID_PLN_NAME = "PLN_NAME" // プラン名
const TAG_ID_GLI_OPC_CD = "GLI_OPC_CD" // 受付種別
const TAG_ID_ROP_CLS = "ROP_CLS" // 料金種別
const TAG_ID_GLI_CLT_CD = "GLI_CLT_CD" // コラムタイプ
const TAG_ID_ROP_PRICE = "ROP_PRICE" // 料金価格(オブション)
const TAG_ID_PLN_PRICE = "PLN_PRICE" // 料金価格(ブラン)
const TAG_ID_GLI_BODY_TXT = "GLI_BODY_TXT" // コピー
const TAG_ID_GLI_CMT_TXT = "GLI_CMT_TXT" // 注釈
const TAG_ID_GLI_IMG1 = "GLI_IMG1" // 画像1
const TAG_ID_GLI_IMG2 = "GLI_IMG2" // 画像2

const WorkspacePartsDetailForm = (props: Props) => {
  const apiClient = useApiClient()
  const { showAlertMessage } = useShowAlertMessage()
  const setLoadingState = useSetRecoilState(GlobalLoadingState)

  const [isChanged, setIsChanged] = useState(false)
  const [showSelectImage, setShowSelectImage] = useState(false)
  const [showSelectPlan, setShowSelectPlan] = useState(false)
  const [selectedTagId, setSelectedTagId] = useState<string>("")
  const [manuscriptState, setManuscriptState] = useRecoilState(
    workspaceManuscriptState,
  )

  const captionIdmlEditorRef = useRef<IdmlTextEditorHandle>(null)
  const copyIdmlEditorRef = useRef<IdmlTextEditorHandle>(null)
  const [imageCategoryOptions, setImageCategoryOptions] = useState<
    OptionType[]
  >([])
  const [imageTypeOptions, setImageTypeOptions] = useState<OptionType[]>([])
  const [imageLibraries, setImageLibraries] = useState<ImageLibrary[]>([])

  const partsTagId = manuscriptState.selectedPartsTagId

  const getTextByTagId = (tagId: string, isRowString = false) => {
    for (const item of manuscriptState.items) {
      if (item.type === "text") {
        const foundText = (item as IdmlTextFramePageItemDto).texts?.find(
          (textItem) =>
            item.parentTagId === partsTagId && textItem.tagId === tagId,
        )
        if (foundText) {
          // return foundText
          let result = ""
          for (const content of foundText.contents) {
            if (isRowString && content.color) {
              result += `<${content.color}>${content.content}</${content.color}>`
            } else {
              result += content.content
            }
          }
          return result
        }
      }
    }
    return null
  }

  const getImageByTagId = (tagId: string) => {
    for (const item of manuscriptState.items) {
      if (item.type === "image") {
        const foundImage = (item as IdmlImagePageItemDto).images?.find(
          (imageItem) =>
            item.parentTagId === partsTagId && imageItem.tag === tagId,
        )
        if (foundImage) {
          return foundImage
        }
      }
    }
    return null
  }

  const getImageSizeByTagId = (tagId: string) => {
    for (const item of manuscriptState.items) {
      if (item.type === "image") {
        const foundImage = (item as IdmlImagePageItemDto).images?.find(
          (imageItem) =>
            item.parentTagId === partsTagId && imageItem.tag === tagId,
        )
        if (foundImage) {
          // ptをpx単位に変換
          return {
            selectAreaWidth: item.width / 0.75,
            selectAreaHeight: item.height / 0.75,
          }
        }
      }
    }
    return null
  }

  const setTextsByTagIds = (
    updates: {
      tagId: string
      newValue: string | Array<IdmlTextFramePageTextContentDto>
    }[],
  ) => {
    const newItems = manuscriptState.items.map((item) => {
      if (item.type === "text" && (item as IdmlTextFramePageItemDto).texts) {
        return {
          ...item,
          texts: (item as IdmlTextFramePageItemDto).texts.map((textItem) => {
            const update = updates.find(
              (u) =>
                item.parentTagId === partsTagId && u.tagId === textItem.tagId,
            )
            if (update) {
              if (typeof update.newValue === "string" && textItem.contents) {
                return {
                  ...textItem,
                  contents: [
                    {
                      ...textItem.contents[0],
                      content: update.newValue,
                    },
                  ],
                }
              } else {
                return {
                  ...textItem,
                  contents:
                    update.newValue as IdmlTextFramePageTextContentDto[],
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

    setManuscriptState((state) => ({ ...state, items: newItems }))
  }

  const setImageByTagId = (tagId: string, newValue: string) => {
    const newItems = manuscriptState.items.map((item) => {
      if (item.type === "image") {
        return {
          ...item,
          images: (item as IdmlImagePageItemDto).images.map((image) =>
            item.parentTagId === partsTagId && image.tag === tagId
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
    setManuscriptState((state) => ({ ...state, items: newItems }))
  }

  const countCharactersExcludingTags = (input: string): number => {
    const stringWithoutTags = input ? input.replace(/<\/?[\w#]+>/g, "") : ""
    return stringWithoutTags.length
  }

  const addIfNotEmpty = (
    key: string,
    value: string | IdmlImagePageSubItemDto,
    state: PartsFormState,
  ) => {
    if (value) {
      if (typeof value === "string") {
        state[key] = value
      } else if (value.imageFileName) {
        state[key] = value.imageFileName
      }
    }
  }

  const [formState, setFormState] = useState<PartsFormState>({})
  const [formTextLengthState, setFormTextLengthState] =
    useState<FormTextLengthState>({})

  const urlToFile = async (url: string, filename: string, mimeType: string) => {
    if (url && url.startsWith("http")) {
      // S3の画像ファイル名に拡張子がない場合は、CORSが正しく動かない
      const timestamp = new Date().getTime()
      const imageUrlWithTimestamp = `${url}?${timestamp}`
      const response = await fetch(imageUrlWithTimestamp)
      const data = await response.blob()
      return new File([data], filename, { type: mimeType })
    }

    return new File([""], filename, { type: mimeType })
  }

  const handleOnSave = async () => {
    try {
      setLoadingState(true)
      const items: IdmlUpdateContentItemDto[] = []

      // オプション名
      if (formState[TAG_ID_ROP_NAME]) {
        items.push({
          tagId: TAG_ID_ROP_NAME,
          contents: [
            {
              content: formState[TAG_ID_ROP_NAME],
              color: "",
            },
          ],
        })
      }

      // オプション名
      if (formState[TAG_ID_PLN_NAME]) {
        items.push({
          tagId: TAG_ID_PLN_NAME,
          contents: [
            {
              content: formState[TAG_ID_PLN_NAME],
              color: "",
            },
          ],
        })
      }

      // 料金種別(オブション)
      if (formState[TAG_ID_ROP_CLS]) {
        items.push({
          tagId: TAG_ID_ROP_CLS,
          contents: [
            {
              content: formState[TAG_ID_ROP_CLS],
              color: "",
            },
          ],
        })
      }

      // 料金価格(ブラン)
      if (formState[TAG_ID_PLN_PRICE]) {
        items.push({
          tagId: TAG_ID_PLN_PRICE,
          contents: [
            {
              content: formState[TAG_ID_PLN_PRICE],
              color: "",
            },
          ],
        })
      }

      // コピー
      if (formState[TAG_ID_GLI_BODY_TXT]) {
        items.push({
          tagId: TAG_ID_GLI_BODY_TXT,
          contents: copyIdmlEditorRef.current.getEditorState(),
        })
      }

      // 注釈
      if (formState[TAG_ID_GLI_CMT_TXT]) {
        items.push({
          tagId: TAG_ID_GLI_CMT_TXT,
          contents: captionIdmlEditorRef.current.getEditorState(),
        })
      }

      const updatePackageId = partsTagId
        .toLocaleLowerCase()
        .replace("apeal_", "parts_layout_")
        .toLocaleLowerCase()
      await apiClient.idmlReplaceApiFactory.idmlReplaceControllerUpdateWorkspaceContents(
        {
          editId: manuscriptState.editId,
          packageId: updatePackageId,
          items: items,
        },
      )

      // 画像1の保存
      if (formState[TAG_ID_GLI_IMG1]) {
        const image1 = await urlToFile(
          formState[TAG_ID_GLI_IMG1],
          "image.jpg",
          "image/jpeg",
        )
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerUpdateWorkspaceImage(
          manuscriptState.editId,
          updatePackageId,
          TAG_ID_GLI_IMG1,
          image1,
        )
      }

      // 画像2の保存
      if (formState[TAG_ID_GLI_IMG2]) {
        const image1 = await urlToFile(
          formState[TAG_ID_GLI_IMG2],
          "image.jpg",
          "image/jpeg",
        )
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerUpdateWorkspaceImage(
          manuscriptState.editId,
          updatePackageId,
          TAG_ID_GLI_IMG2,
          image1,
        )
      }

      setIsChanged(false)
      showAlertMessage("success", "パーツ情報保存しました。")
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingState(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const copyText = getTextByTagId(TAG_ID_GLI_BODY_TXT, true) // コピー
    const captionText = getTextByTagId(TAG_ID_GLI_CMT_TXT, true) // 注釈
    const image1 = getImageByTagId(TAG_ID_GLI_IMG1) // 画像1
    const image2 = getImageByTagId(TAG_ID_GLI_IMG2) // 画像2

    const initialState: PartsFormState = {}
    const values = {
      [TAG_ID_ROP_NAME]: getTextByTagId(TAG_ID_ROP_NAME), // オプション名
      [TAG_ID_PLN_NAME]: getTextByTagId(TAG_ID_PLN_NAME), // プラン名
      [TAG_ID_GLI_OPC_CD]: getTextByTagId(TAG_ID_GLI_OPC_CD), // 受付種別
      [TAG_ID_ROP_CLS]: getTextByTagId(TAG_ID_ROP_CLS), // 料金種別
      [TAG_ID_ROP_PRICE]: getTextByTagId(TAG_ID_ROP_PRICE), // 料金価格(オブション)
      [TAG_ID_PLN_PRICE]: getTextByTagId(TAG_ID_PLN_PRICE), // 料金価格(ブラン)
      [TAG_ID_GLI_BODY_TXT]: copyText, // コピー
      [TAG_ID_GLI_CMT_TXT]: captionText, // 注釈
      [TAG_ID_GLI_IMG1]: image1,
      [TAG_ID_GLI_IMG2]: image2,
    }

    Object.entries(values).forEach(([key, value]) => {
      addIfNotEmpty(key, value, initialState)
    })

    const initialTextLengthState: FormTextLengthState = {
      [TAG_ID_GLI_BODY_TXT]: countCharactersExcludingTags(copyText),
      [TAG_ID_GLI_CMT_TXT]: countCharactersExcludingTags(captionText),
    }

    setFormState(initialState)
    setFormTextLengthState(initialTextLengthState)
  }, [partsTagId])

  const fetchData = async () => {
    // 画像関連処理
    const categoryData = await getImageCategoryList()
    const typeData = await getImageTypeList()
    const imageData = await getImageLibraries()

    const categoryOptions = categoryData.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))

    const typeOptions = typeData.map((item) => ({
      label: item.name,
      value: item.id.toString(),
    }))

    setImageCategoryOptions(categoryOptions)
    setImageTypeOptions(typeOptions)
    setImageLibraries(imageData.data)
  }

  return (
    <>
      <div className='mb-10'>
        <Divider>
          <span className='text-content-active-primary'>
            {props.parts.partsName}
          </span>
        </Divider>
      </div>

      {props.parts.items.map((item) => {
        return (
          <div key={item.tagId}>
            {((item) => {
              if (
                item.tagId === TAG_ID_ROP_NAME &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // オプション名
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1'>
                      {item.tagId ? (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm'>{formState[item.tagId]}</p>
                            <div>
                              <Button
                                variant='contained'
                                size='small'
                                onClick={() => {}}
                              >
                                変更
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Button
                          variant='contained'
                          size='small'
                          onClick={() => {}}
                        >
                          選択
                        </Button>
                      )}
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_GLI_OPC_CD &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // 受付種別
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1 text-sm'>
                      {formState[item.tagId]}
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_ROP_CLS &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // 料金種別
                return (
                  <div className='mb-8  flex w-[250px] items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1'>
                      <Select
                        fullWidth
                        displayEmpty
                        size='small'
                        value={formState[item.tagId] || ""}
                        defaultValue={formState[item.tagId] || ""}
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [item.tagId]: event.target.value,
                          })
                          setTextsByTagIds([
                            {
                              tagId: TAG_ID_ROP_CLS,
                              newValue: event.target.value,
                            },
                          ])
                          setIsChanged(true)
                        }}
                      >
                        {PriceCategoryMaster.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            <div className='text-xs leading-6 text-content-default-primary'>
                              {item.name}
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_GLI_CLT_CD &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // コラムタイプ
                return (
                  <div className='mb-8  flex w-[250px] items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1'>
                      <Select
                        fullWidth
                        displayEmpty
                        size='small'
                        value={formState[item.tagId] || ""}
                        defaultValue={formState[item.tagId] || ""}
                        onChange={(event) => {
                          setFormState({
                            ...formState,
                            [item.tagId]: event.target.value,
                          })
                          setIsChanged(true)
                        }}
                      >
                        {ColumnCategoryMaster.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            <div className='text-xs leading-6 text-content-default-primary'>
                              {item.name}
                            </div>
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                )
              } else if (
                (item.tagId === TAG_ID_ROP_PRICE ||
                  item.tagId === TAG_ID_PLN_PRICE) &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // 料金
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1'>
                      {formState[item.tagId]}円
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_PLN_NAME &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // プラン名
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='relative flex-1'>
                      {item.tagId ? (
                        <>
                          <div className='flex items-center justify-between'>
                            <p className='text-sm'>{formState[item.tagId]}</p>
                            <div>
                              <Button
                                variant='contained'
                                size='small'
                                onClick={() => {
                                  setShowSelectPlan(true)
                                  setSelectedTagId(item.tagId)
                                }}
                              >
                                変更
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <Button
                          variant='contained'
                          size='small'
                          onClick={() => setShowSelectPlan(true)}
                        >
                          選択
                        </Button>
                      )}
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_GLI_BODY_TXT &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // コピー
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='flex-1'>
                      <IdmlTextEditor
                        ref={copyIdmlEditorRef}
                        initString={formState[item.tagId] || ""}
                        colors={["red"]}
                        onChange={(status: EditorContent[]) => {
                          setFormTextLengthState({
                            ...formTextLengthState,
                            [item.tagId]: countCharactersExcludingTags(
                              copyIdmlEditorRef.current.getContent(),
                            ),
                          })
                          setIsChanged(true)
                          setFormState({
                            ...formState,
                            [item.tagId]:
                              copyIdmlEditorRef.current.getContent(),
                          })
                          setTextsByTagIds([
                            {
                              tagId: TAG_ID_GLI_BODY_TXT,
                              newValue: status,
                            },
                          ])
                        }}
                      />
                      <p className='text-right text-sm text-content-default-quaternary'>
                        {formTextLengthState[item.tagId] || 0} / 256
                      </p>
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_GLI_CMT_TXT &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // 注釈
                return (
                  <div className='mb-8 flex items-center'>
                    <label className='min-w-[100px] text-sm text-content-default-primary'>
                      {item.name}
                    </label>
                    <div className='flex-1'>
                      <IdmlTextEditor
                        ref={captionIdmlEditorRef}
                        colors={[]}
                        initString={formState[item.tagId] || ""}
                        onChange={(status: EditorContent[]) => {
                          setFormTextLengthState({
                            ...formTextLengthState,
                            [item.tagId]: countCharactersExcludingTags(
                              captionIdmlEditorRef.current.getContent(),
                            ),
                          })
                          setIsChanged(true)
                          setFormState({
                            ...formState,
                            [item.tagId]:
                              captionIdmlEditorRef.current.getContent(),
                          })
                          setTextsByTagIds([
                            {
                              tagId: item.tagId,
                              newValue: status,
                            },
                          ])
                        }}
                      />
                      <p className='text-right text-sm text-content-default-quaternary'>
                        {formTextLengthState[item.tagId] || 0} / 256
                      </p>
                    </div>
                  </div>
                )
              } else if (
                item.tagId === TAG_ID_GLI_IMG1 &&
                formState.hasOwnProperty(item.tagId)
              ) {
                // 画像1
                return (
                  <>
                    <div className='mb-8 flex items-center'>
                      <label className='min-w-[100px] text-sm text-content-default-primary'>
                        {item.name}
                      </label>
                      <div className='relative flex-1'>
                        {formState[item.tagId] ? (
                          <WorkspaceImageTriming
                            image={{
                              originalUrl: formState[item.tagId],
                              ...getImageSizeByTagId(item.tagId),
                            }}
                            onSave={(imageURL) => {
                              setShowSelectImage(false)
                              setIsChanged(true)
                              setFormState({
                                ...formState,
                                [item.tagId]: imageURL,
                              })
                              setImageByTagId(item.tagId, imageURL)
                            }}
                            onChange={() => {
                              setShowSelectImage(true)
                              setSelectedTagId(item.tagId)
                            }}
                          />
                        ) : (
                          <Button
                            variant='contained'
                            size='small'
                            onClick={() => {
                              setShowSelectImage(true)
                              setSelectedTagId(item.tagId)
                            }}
                          >
                            選択
                          </Button>
                        )}
                      </div>
                    </div>
                    {props.parts.items.find(
                      (item) => item.tagId === "GLI_IGM_CPTN1",
                    ) && (
                      <div className='mb-8 flex items-center'>
                        <label className='min-w-[100px] align-middle text-sm text-content-default-primary'>
                          画像1 <br />
                          タイトル
                        </label>
                        <div className='flex-1'>
                          <TextField
                            sx={{ width: "350px" }}
                            value={formState["GLI_IGM_CPTN1"]}
                            onChange={(e) => {
                              setIsChanged(true)
                              setFormState({
                                ...formState,
                                [item.tagId]: e.target.value,
                              })
                            }}
                            margin='normal'
                            variant='outlined'
                          />
                        </div>
                      </div>
                    )}
                  </>
                )
              } else if (
                item.tagId === TAG_ID_GLI_IMG2 &&
                formState.hasOwnProperty(item.tagId)
              ) {
                return (
                  // 画像2
                  <>
                    <div className='mb-8 flex items-center'>
                      <label className='min-w-[100px] text-sm text-content-default-primary'>
                        {item.name}
                      </label>
                      <div className='relative flex-1'>
                        {formState[item.tagId] ? (
                          <>
                            <div className='flex items-center justify-between'>
                              <div className='h-[120px] max-w-[200px]'>
                                <img
                                  className='h-full w-full object-contain'
                                  src={
                                    formState[item.tagId].startsWith(
                                      "/asset",
                                    ) ||
                                    formState[item.tagId].startsWith("http")
                                      ? formState[item.tagId]
                                      : `${
                                          process.env.NEXT_PUBLIC_API_URL
                                        }/v1/idml-replace/workspace/image/${
                                          formState[item.tagId]
                                        }`
                                  }
                                  alt='画像2'
                                />
                              </div>
                              <div>
                                <Button
                                  variant='contained'
                                  size='small'
                                  onClick={() => {
                                    setShowSelectImage(true)
                                    setSelectedTagId(item.tagId)
                                  }}
                                >
                                  変更
                                </Button>
                              </div>
                            </div>
                            <div className={`flex h-10 justify-end`}>
                              <BaseButtonIconText
                                icon='delete'
                                text='削除'
                                onClick={() => {
                                  setIsChanged(true)
                                  setFormState((state) => ({
                                    ...state,
                                    [item.tagId]: null,
                                  }))
                                }}
                              />
                            </div>
                          </>
                        ) : (
                          <Button
                            variant='contained'
                            size='small'
                            onClick={() => {
                              setShowSelectImage(true)
                              setSelectedTagId(item.tagId)
                            }}
                          >
                            選択
                          </Button>
                        )}
                      </div>
                    </div>
                    {props.parts.items.find(
                      (item) => item.tagId === "GLI_IGM_CPTN2",
                    ) && (
                      <div className='mb-8 flex items-center'>
                        <label className='min-w-[100px] align-middle text-sm text-content-default-primary'>
                          画像2 <br />
                          タイトル
                        </label>
                        <div className='flex-1'>
                          <TextField
                            sx={{ width: "350px" }}
                            value={formState["GLI_IGM_CPTN2"]}
                            onChange={(e) => {
                              setIsChanged(true)
                              setFormState({
                                ...formState,
                                [item.tagId]: e.target.value,
                              })
                            }}
                            margin='normal'
                            variant='outlined'
                          />
                        </div>
                      </div>
                    )}
                  </>
                )
              }
            })(item)}
          </div>
        )
      })}
      <div>
        <Button
          variant='contained'
          size='medium'
          style={{ width: "120px" }}
          onClick={() => handleOnSave()}
          disabled={!isChanged}
        >
          保存
        </Button>
      </div>
      {showSelectImage && (
        <WorkspaceModalImageSelect
          items={imageLibraries}
          categoryOptions={imageCategoryOptions}
          typeOptions={imageTypeOptions}
          useCodes={[]}
          onSelect={(id) => {
            const item = imageLibraries.find((item) => item.id === id)
            if (item && selectedTagId !== "") {
              setShowSelectImage(false)
              setIsChanged(true)
              setFormState({
                ...formState,
                [selectedTagId]: item.imageConvert,
              })
              setSelectedTagId("")
              setImageByTagId(selectedTagId, item.imageConvert)
            }
          }}
          onReload={fetchData}
          onClose={() => {
            setShowSelectImage(false)
            setSelectedTagId("")
          }}
        />
      )}
      {showSelectPlan && (
        <WorkspaceModalPartsPlan
          onClick={({ planName, priceText }) => {
            // ブラン名の場合
            if (selectedTagId === TAG_ID_PLN_NAME) {
              setFormState((state) => ({
                ...state,
                [TAG_ID_PLN_NAME]: planName,
                [TAG_ID_PLN_PRICE]: priceText,
              }))
              setTextsByTagIds([
                {
                  tagId: TAG_ID_PLN_NAME,
                  newValue: planName,
                },
                {
                  tagId: TAG_ID_PLN_PRICE,
                  newValue: priceText,
                },
              ])
            } else if (selectedTagId === TAG_ID_ROP_NAME) {
              setFormState((state) => ({
                ...state,
                [TAG_ID_ROP_NAME]: planName,
                [TAG_ID_ROP_PRICE]: priceText,
              }))
              setTextsByTagIds([
                {
                  tagId: TAG_ID_ROP_NAME,
                  newValue: planName,
                },
                {
                  tagId: TAG_ID_ROP_PRICE,
                  newValue: priceText,
                },
              ])
            }

            setShowSelectPlan(false)
            setSelectedTagId("")
            setIsChanged(true)
          }}
          onClose={() => {
            setShowSelectPlan(false)
            setSelectedTagId("")
          }}
        />
      )}
    </>
  )
}

export default WorkspacePartsDetailForm
