import {
  useEffect,
  useState,
  useReducer,
  ChangeEvent,
  useRef,
  useMemo,
} from "react"
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil"
import MuiButton from "@mui/material/Button"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiDivider from "@mui/material/Divider"
import MuiSelect, { SelectChangeEvent } from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import {
  imageSelectorFamily,
  textSelectorFamily,
  workspaceManuscriptState,
} from "@/atoms/workspace"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import BaseTextField from "@/components/base/form/BaseTextField"
import BaseTextAreaAutoSize from "@/components/base/form/BaseTextAreaAutoSize"
import WorkspaceModalImageSelect from "@/components/page/workspace/Modal/WorkspaceModalImageSelect"
import { FormControlLabel } from "@mui/material"
import { usedImagesState } from "@/atoms/image"
import { OptionType } from "@/types/page/workspace/optionType"
import {
  ImageLibrary,
  getImageCategoryList,
  getImageLibraries,
  getImageTypeList,
} from "@/api/imageLibraries"
import { EatingPlacesEnum, IDMLTagEnum } from "@/config/enum"
import { booleanOptions, eatingPlacesOptions } from "@/config/options"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { useApiClient } from "@/hooks/useApiClient"
import {
  DocumentResponseDtoDocumentContentBreakfastPlaceEnum,
  DocumentResponseDtoDocumentContentDinnerPlaceEnum,
  IdmlImagePageSubItemDto,
  MasterDocumentStatusDtoCodeEnum,
} from "@/openapi"
import IdmlTextEditor, {
  EditorContent,
  IdmlTextEditorHandle,
} from "../../idml/IdmlTextEditor"
import { GlobalLoadingState } from "@/atoms/global"
import { createWorkspaceImageURL } from "@/api/idmlReplace"

interface FormState {
  focusMountEditor: number
  isChanged: boolean
  bathExclusiveFlag: boolean
  furigana: string
  furiganaSmall: string
  name: string
  nameSmall: string
  pref: string
  area: string
  catch: string
  appearanceImage: string
  access: string
  dinnerIcon: string
  breakfastIcon: string
  roten: boolean
  kakenagasi: boolean
  elevator: string
  toujitu: boolean
  sougei: boolean
  kinen: string
}

interface Action {
  type: "UPDATE_FIELD" | "SET_TOUCHED" | "UPDATE_MULTIPLE_FIELD"
  field?: string
  value?: string | boolean | number
  payloads?: FormState
}

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        isChanged: true,
        [action.field]: action.value,
      }
    case "SET_TOUCHED":
      return {
        ...state,
        isChanged: true,
      }
    case "UPDATE_MULTIPLE_FIELD":
      return {
        ...state,
        ...action.payloads,
      }
    default:
      return state
  }
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const mealOptions = eatingPlacesOptions.map((option) => (
  <MuiMenuItem key={option.label} value={option.value}>
    {option.label}
  </MuiMenuItem>
))

const elevatorOptions = booleanOptions.map((option) => (
  <MuiMenuItem key={option.value} value={option.value}>
    {option.label}
  </MuiMenuItem>
))

export type Props = {
  size: "small" | "medium" | "large"
}

const WorkspaceHotelInfoForm = (props: Props) => {
  const { showAlertMessage } = useShowAlertMessage()
  const apiClient = useApiClient()

  const setLoadingState = useSetRecoilState(GlobalLoadingState)
  const [usedImages, setUsedImages] = useRecoilState(usedImagesState)
  const [manuscriptState, setManuscriptState] = useRecoilState(
    workspaceManuscriptState,
  )

  const documentContent = manuscriptState.document.documentContent
  const isReferenceMode =
    manuscriptState.document.statusCode ===
      MasterDocumentStatusDtoCodeEnum.Checking ||
    manuscriptState.document.statusCode ===
      MasterDocumentStatusDtoCodeEnum.Proofreading

  const accessIdmlEditorRef = useRef<IdmlTextEditorHandle>(null)
  const initialState: FormState = {
    focusMountEditor: 1,
    isChanged: false,
    bathExclusiveFlag: documentContent.bathExclusiveFlag,
    furigana: documentContent.furiganaLarge,
    furiganaSmall: documentContent.furiganaSmall ?? "",
    name: documentContent.hotelNameLarge,
    nameSmall: documentContent.hotelNameSmall ?? "",
    pref: documentContent.prefectureName,
    area: documentContent.spaName ?? "",
    catch: documentContent.hotelCatchCopy ?? "",
    appearanceImage: documentContent.exteriorPhoto ?? "",
    access: documentContent.accessInfoText,
    dinnerIcon: documentContent.breakfastPlace ?? "",
    breakfastIcon: documentContent.breakfastPlace ?? "",
    roten: documentContent.hasOpenAirBath,
    kakenagasi: documentContent.hasKakenagashi,
    elevator: String(documentContent.hasElevator),
    toujitu: documentContent.hasSameDayReservation,
    sougei: documentContent.hasDropOffService,
    kinen: documentContent.smokingStatus,
  }

  const [formState, dispatch] = useReducer(formReducer, initialState)

  const [showSelectImage, setShowSelectImage] = useState(false)
  const [imageCategoryOptions, setImageCategoryOptions] = useState<
    OptionType[]
  >([])
  const [imageTypeOptions, setImageTypeOptions] = useState<OptionType[]>([])
  const [imageLibraries, setImageLibraries] = useState<ImageLibrary[]>([])

  const setTextItem = useRecoilCallback(
    ({ set }) =>
      (tagId: string, contents) => {
        set(textSelectorFamily(tagId), contents)
      },
  )

  const setIconItem = useRecoilCallback(({ set }) => (tagId: string, name) => {
    set(imageSelectorFamily(tagId), name)
  })

  const setExteriorImage = useSetRecoilState(
    imageSelectorFamily(IDMLTagEnum.TemplateExteriorImage),
  )

  // アイコン画像
  const openAirBathImage = useRecoilValue(
    imageSelectorFamily(IDMLTagEnum.TemplateOpenAirBath),
  ) as IdmlImagePageSubItemDto
  const kakenagashiImage = useRecoilValue(
    imageSelectorFamily(IDMLTagEnum.TemplateKakenagashi),
  ) as IdmlImagePageSubItemDto
  const sameDayReservationAvailableImage = useRecoilValue(
    imageSelectorFamily(IDMLTagEnum.TemplateSameDayReservationAvailable),
  ) as IdmlImagePageSubItemDto
  const dropOffServiceImage = useRecoilValue(
    imageSelectorFamily(IDMLTagEnum.TemplateHasDropOffService),
  ) as IdmlImagePageSubItemDto
  const nonSmokingReservationAvailableImage = useRecoilValue(
    imageSelectorFamily(IDMLTagEnum.TemplateNonSmokingReservationAvailable),
  ) as IdmlImagePageSubItemDto

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>,
    tagId: string,
  ) => {
    const target = e.target as
      | (HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement)
      | { value: string; name?: string }
    const value =
      "type" in target && target.type === "checkbox"
        ? target.checked.toString()
        : target.value

    dispatch({
      type: "UPDATE_FIELD",
      field: target.name || "",
      value: value,
    })

    setTextItem(tagId, value)
  }

  const handleSelectChange = (e: SelectChangeEvent<string>, tagId: string) => {
    const target = e.target as { value: string; name?: string }
    const value = target.value

    dispatch({
      type: "UPDATE_FIELD",
      field: target.name || "",
      value: value,
    })

    let iconName = ""
    switch (tagId) {
      case IDMLTagEnum.TemplateBreakfast:
      case IDMLTagEnum.TemplateDinner:
        iconName = convertEatingPlaceToIconName(tagId, value)
        break
      case IDMLTagEnum.TemplateElevator:
        iconName =
          value === "true"
            ? "elevatorアイコンON.jpg"
            : "elevatorアイコンOFF.jpg"
        break
      default:
      // Nothing
    }

    setIconItem(
      tagId,
      iconName ? encodeURIComponent(`/common/links/${iconName}`) : "",
    )
  }

  const styles = () => {
    if (props.size === "small") {
      return "max-h-[calc(100vh_-_400px)]"
    } else if (props.size === "medium") {
      return "max-h-[calc(100vh_-_92px)]"
    } else if (props.size === "large") {
      return "max-h-[calc(100vh_-_92px)]"
    }
  }

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

  const isSaveEnabled = useMemo((): boolean => {
    return (
      formState.isChanged &&
      formState.breakfastIcon.length > 0 &&
      formState.dinnerIcon.length > 0
    )
  }, [formState])

  const handleOnClickSave = async () => {
    try {
      setLoadingState(true)
      const exteriorPhotoFile = await urlToFile(
        formState.appearanceImage,
        "image.jpg",
        "image/jpeg",
      )

      const response =
        await apiClient.documentsApiFactory.documentControllerUpdateDocumentContentAndIDML(
          manuscriptState.document.id,
          formState.bathExclusiveFlag,
          formState.furiganaSmall,
          formState.nameSmall,
          formState.area,
          formState.catch,
          exteriorPhotoFile,
          accessIdmlEditorRef.current.getContent(),
          formState.breakfastIcon as DocumentResponseDtoDocumentContentBreakfastPlaceEnum,
          formState.dinnerIcon as DocumentResponseDtoDocumentContentDinnerPlaceEnum,
          formState.elevator === "true",
        )

      setManuscriptState((state) => ({
        ...state,
        document: {
          ...manuscriptState.document,
          documentContent: response.data.documentContent,
        },
      }))

      showAlertMessage("success", "宿情報保存しました。")
    } catch (error) {
      console.error(error)
    } finally {
      setLoadingState(false)
    }
  }

  const convertEatingPlaceToIconName = (type: string, place: string) => {
    const prefix = type === IDMLTagEnum.TemplateBreakfast ? "朝食" : "夕食"
    let name = ""
    switch (place) {
      case EatingPlacesEnum.None:
        name = "アイコンOFF"
        break
      case EatingPlacesEnum.Restaurant:
        name = "アイコン_会場食"
        break
      case EatingPlacesEnum.PrivateRestaurant:
        name = "アイコン_個室会場食"
        break
      case EatingPlacesEnum.Guestroom:
        name = "アイコン_部屋食"
        break
      case EatingPlacesEnum.RestaurantAndPrivateRestaurant:
        name = "アイコン_会場食または個室会場食"
        break
      case EatingPlacesEnum.RestaurantAndGuestroom:
        name = "アイコン_会場食または部屋食"
        break
      case EatingPlacesEnum.GuestroomAndPrivateRestaurant:
        name = "アイコン_部屋食または個室会場食"
        break
      default:
        name = ""
    }
    return name ? `${prefix}${name}.jpg` : ""
  }

  useEffect(() => {
    fetchData()
  }, [])

  const updateSFdata = () => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "focusMountEditor",
      value: 0,
    })
    fetchData()
    apiClient.documentsApiFactory
      .documentControllerGetDocumentContent(manuscriptState.document.id)
      .then((rContent) => {
        dispatch({
          type: "UPDATE_MULTIPLE_FIELD",
          payloads: {
            focusMountEditor: 1,
            isChanged: false,
            bathExclusiveFlag: rContent.data.documentContent.bathExclusiveFlag,
            furigana: rContent.data.documentContent.furiganaLarge,
            furiganaSmall: rContent.data.documentContent.furiganaSmall ?? "",
            name: rContent.data.documentContent.hotelNameLarge,
            nameSmall: rContent.data.documentContent.hotelNameSmall ?? "",
            pref: rContent.data.documentContent.prefectureName,
            area: rContent.data.documentContent.spaName ?? "",
            catch: rContent.data.documentContent.hotelCatchCopy ?? "",
            appearanceImage: rContent.data.documentContent.exteriorPhoto ?? "",
            access: rContent.data.documentContent.accessInfoText,
            dinnerIcon: rContent.data.documentContent.breakfastPlace ?? "",
            breakfastIcon: rContent.data.documentContent.breakfastPlace ?? "",
            roten: rContent.data.documentContent.hasOpenAirBath,
            kakenagasi: rContent.data.documentContent.hasKakenagashi,
            elevator: String(rContent.data.documentContent.hasElevator),
            toujitu: rContent.data.documentContent.hasSameDayReservation,
            sougei: rContent.data.documentContent.hasDropOffService,
            kinen: rContent.data.documentContent.smokingStatus,
          }, // rContent.data.documentContent
        })
      })
  }

  const fetchData = async () => {
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
    <div className='relative h-full bg-white-0'>
      <div
        className={`scrollbar-hide relative m-auto h-full overflow-y-auto px-10 pb-[50px] ${styles()}`}
      >
        <div className='flex justify-end'>
          <div className='flex h-20 items-center justify-end'>
            <MuiButton
              key='sf-hotel-reload-button'
              variant='contained'
              className='mr-[8px]'
              onClick={() => updateSFdata()}
            >
              SFデータ更新
            </MuiButton>
            <MuiButton
              key='hotel-close-button'
              variant='outlined'
              color='inherit'
              onClick={() =>
                setManuscriptState((state) => ({
                  ...state,
                  viewState: undefined,
                }))
              }
            >
              閉じる
            </MuiButton>
          </div>
        </div>
        <h2 className='text-lg font-bold text-content-default-primary'>
          宿情報編集
        </h2>
        <div className='mt-7'>
          <FormControlLabel
            control={<MuiCheckbox size='small' disableRipple />}
            label={<span className='text-sm'>風呂評価対象外</span>}
            name='bathExclusiveFlag'
            disabled={isReferenceMode}
            checked={formState.bathExclusiveFlag}
            onChange={(event: React.SyntheticEvent, checked: boolean) =>
              dispatch({
                type: "UPDATE_FIELD",
                field: (event.target as HTMLInputElement).name,
                value: checked,
              })
            }
          />
        </div>
        <div
          className={`mt-5 grid gap-x-10 gap-y-6 ${
            props.size === "large" ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              ふりがな小
            </label>
            <div className='flex-1'>
              <BaseTextField
                size='small'
                variant='outlined'
                fullWidth
                name='furiganaSmall'
                value={formState.furiganaSmall}
                onChange={(event) =>
                  handleInputChange(event, IDMLTagEnum.TemplateFuriganaSmall)
                }
                disabled={isReferenceMode}
              />
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              ふりがな大
            </label>
            <div className='flex-1'>
              <div className='text-sm text-content-default-primary'>
                {formState.furigana}
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              宿名小
            </label>
            <div className='flex-1'>
              <BaseTextField
                size='small'
                variant='outlined'
                fullWidth
                name='nameSmall'
                value={formState.nameSmall}
                onChange={(event) =>
                  handleInputChange(event, IDMLTagEnum.TemplateHotelNameSmall)
                }
                disabled={isReferenceMode}
              />
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              宿名大
            </label>
            <div className='flex-1'>
              <div className='text-sm text-content-default-primary'>
                {formState.name}
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              都道府県
            </label>
            <div className='flex-1'>
              <div className='text-sm text-content-default-primary'>
                {formState.pref}
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              温泉地
            </label>
            <div className='flex-1'>
              <BaseTextField
                size='small'
                variant='outlined'
                fullWidth
                name='area'
                value={formState.area}
                onChange={(event) =>
                  handleInputChange(event, IDMLTagEnum.TemplateSpaName)
                }
                disabled={isReferenceMode}
              />
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              キャッチ
            </label>
            <div className='flex-1'>
              <BaseTextAreaAutoSize
                minRows={3}
                style={{ width: "100%" }}
                name='catch'
                value={formState.catch}
                onChange={(event) =>
                  handleInputChange(event, IDMLTagEnum.TemplateCatchCopy)
                }
                disabled={isReferenceMode}
              />
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className={`min-w-[80px] text-xs text-content-default-primary ${
                formState.appearanceImage && props.size !== "large" && "pb-20"
              }`}
              htmlFor='hurigana-small'
            >
              外観画像
            </label>
            <div className='relative flex-1'>
              {formState.appearanceImage ? (
                <>
                  <div className='flex items-center justify-between'>
                    <div className='h-[120px] max-w-[200px]'>
                      <img
                        className='h-full w-full object-contain'
                        src={
                          formState.appearanceImage.startsWith("/asset") ||
                          formState.appearanceImage.startsWith("http")
                            ? formState.appearanceImage
                            : `${process.env.NEXT_PUBLIC_API_URL}/v1/idml-replace/workspace/image/${formState.appearanceImage}`
                        }
                        alt='外観画像'
                      />
                    </div>
                    {!isReferenceMode && (
                      <div>
                        <MuiButton
                          variant='contained'
                          size='small'
                          onClick={() => setShowSelectImage(true)}
                          disabled={isReferenceMode}
                        >
                          変更
                        </MuiButton>
                      </div>
                    )}
                  </div>
                  {!isReferenceMode && (
                    <div
                      className={`flex h-10 justify-end ${
                        props.size === "large"
                          ? "absolute -bottom-10 right-0"
                          : "mt-10"
                      }`}
                    >
                      <BaseButtonIconText
                        icon='delete'
                        text='削除'
                        onClick={() => {
                          dispatch({
                            type: "UPDATE_FIELD",
                            field: "appearanceImage",
                            value: "",
                          })
                          setExteriorImage("")
                        }}
                        disabled={isReferenceMode}
                      />
                    </div>
                  )}
                </>
              ) : (
                <MuiButton
                  variant='contained'
                  size='small'
                  onClick={() => setShowSelectImage(true)}
                >
                  選択
                </MuiButton>
              )}
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              アクセス情報
            </label>
            <div className='flex-1'>
              {formState.focusMountEditor && (
                <IdmlTextEditor
                  ref={accessIdmlEditorRef}
                  initString={formState.access}
                  colors={["green"]}
                  disabled={isReferenceMode}
                  onChange={(status: EditorContent[]) => {
                    dispatch({ type: "SET_TOUCHED" })
                    setTextItem(IDMLTagEnum.TemplateAccessInfo, status)
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <MuiDivider textAlign='left'>
            <div className='text-sm'>アイコン</div>
          </MuiDivider>
        </div>
        <div
          className={`mt-8 flex ${
            props.size === "large"
              ? "flex-wrap space-x-10"
              : "flex-col space-x-0 space-y-6"
          }`}
        >
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              夕食
            </label>
            <div className='flex-1'>
              <MuiSelect
                size='small'
                sx={{ minWidth: 248 }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                name='dinnerIcon'
                value={formState.dinnerIcon}
                disabled={isReferenceMode}
                onChange={(event) =>
                  handleSelectChange(event, IDMLTagEnum.TemplateDinner)
                }
              >
                {mealOptions}
              </MuiSelect>
            </div>
          </div>
          <div className='flex items-center'>
            <label
              className='min-w-[80px] text-xs text-content-default-primary'
              htmlFor='hurigana-small'
            >
              朝食
            </label>
            <div className='flex-1'>
              <MuiSelect
                size='small'
                sx={{ minWidth: 248 }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                MenuProps={MenuProps}
                name='breakfastIcon'
                value={formState.breakfastIcon}
                disabled={isReferenceMode}
                onChange={(event) =>
                  handleSelectChange(event, IDMLTagEnum.TemplateBreakfast)
                }
              >
                {mealOptions}
              </MuiSelect>
            </div>
          </div>
        </div>
        <div className='mt-10 flex flex-wrap'>
          <div className='mb-8 flex items-center'>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                露天
              </label>
              <div className='flex-1'>
                <img
                  width='40'
                  height='44'
                  src={createWorkspaceImageURL(openAirBathImage?.imageFileName)}
                  alt={formState.roten ? "露天風呂あり" : "露天風呂なし"}
                />
              </div>
            </div>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                かけ流し
              </label>
              <div className='flex-1'>
                <img
                  width='40'
                  height='44'
                  src={createWorkspaceImageURL(kakenagashiImage?.imageFileName)}
                  alt={formState.kakenagasi ? "かけ流しあり" : "かけ流しなし"}
                />
              </div>
            </div>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                エレベーター
              </label>
              <div className='flex-1'>
                <MuiSelect
                  size='small'
                  sx={{ minWidth: 87 }}
                  displayEmpty
                  inputProps={{
                    "aria-label": "Without label",
                    "data-tag-id": "my-custom-value",
                  }}
                  MenuProps={MenuProps}
                  name='elevator'
                  value={formState.elevator}
                  disabled={isReferenceMode}
                  onChange={(event) =>
                    handleSelectChange(event, IDMLTagEnum.TemplateElevator)
                  }
                >
                  {elevatorOptions}
                </MuiSelect>
              </div>
            </div>
          </div>
          <div className='mb-8 flex items-center'>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                当日予約
              </label>
              <div className='flex-1'>
                <img
                  width='40'
                  height='44'
                  src={createWorkspaceImageURL(
                    sameDayReservationAvailableImage?.imageFileName,
                  )}
                  alt={formState.toujitu ? "当日予約可" : "当日予約不可"}
                />
              </div>
            </div>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                送迎
              </label>
              <div className='flex-1'>
                <img
                  width='40'
                  height='44'
                  src={createWorkspaceImageURL(
                    dropOffServiceImage?.imageFileName,
                  )}
                  alt={formState.sougei ? "送迎あり" : "送迎なし"}
                />
              </div>
            </div>
            <div className='mr-8 flex items-center'>
              <label
                className='min-w-[80px] text-xs text-content-default-primary'
                htmlFor='hurigana-small'
              >
                禁煙
              </label>
              <div className='flex-1'>
                <img
                  width='40'
                  height='44'
                  src={createWorkspaceImageURL(
                    nonSmokingReservationAvailableImage?.imageFileName,
                  )}
                  alt={formState.kinen === "1" ? "禁煙予約可" : "禁煙予約不可"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isReferenceMode && (
        <div className='absolute bottom-0 left-0 flex h-[56px] w-full items-center bg-container-main-secondary bg-opacity-80 pl-11'>
          <MuiButton
            variant='contained'
            disabled={!isSaveEnabled}
            onClick={handleOnClickSave}
          >
            保存
          </MuiButton>
        </div>
      )}
      {showSelectImage && (
        <WorkspaceModalImageSelect
          items={imageLibraries}
          categoryOptions={imageCategoryOptions}
          typeOptions={imageTypeOptions}
          useCodes={usedImages}
          onSelect={(id) => {
            const item = imageLibraries.find((item) => item.id === id)
            if (item) {
              setUsedImages((state) => [...state, id])
              setShowSelectImage(false)
              setExteriorImage(item.imageConvert)
              dispatch({
                type: "UPDATE_FIELD",
                field: "appearanceImage",
                value: item.imageConvert,
              })
            }
          }}
          onReload={fetchData}
          onClose={() => setShowSelectImage(false)}
        />
      )}
    </div>
  )
}

export default WorkspaceHotelInfoForm
