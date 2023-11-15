import { useEffect, useMemo, useState } from "react"
import { useRecoilState, useSetRecoilState } from "recoil"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
import IdmlPageItemsPreview from "../../idml/IdmlPageItemsPreview"
import { createWorkspaceBackgroundImageURL } from "@/api/idmlReplace"
import {
  DocumentPartsResponseDto,
  DocumentResponseDto,
  IdmlItemsResponseDto,
  IdmlItemsResponseDtoItemsInner,
  MasterPartsClassDto,
} from "@/openapi"
import WorkspaceModalPartsSelect from "@/components/page/workspace/Modal/WorkspaceModalPartsSelect"

import { useApiClient } from "@/hooks/useApiClient"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import { GlobalLoadingState } from "@/atoms/global"

type ManuscriptProps = {
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
}
interface Props {
  imgUrl: string
  type: "split" | "fullscreen"
  idmlEditId?: string
  partsOnclick?: (packageId: string) => void
  manuscriptProps?: ManuscriptProps
}

const pinchOptions = {
  step: 1,
}

const wheelOptions = {
  step: 0.1,
}

const WorkspacePreview = (props: Props) => {
  const apiClient = useApiClient()
  const { showAlertMessage } = useShowAlertMessage()
  const setLoadingState = useSetRecoilState(GlobalLoadingState)

  const [manuscriptState, setManuscriptState] = useRecoilState(
    workspaceManuscriptState,
  )

  // パーツデータリスト
  const [partsList, setPartsList] = useState<DocumentPartsResponseDto[]>([])

  // パーツ種別データリスト
  const [partsCategoryList, setPartsCategoryList] = useState<
    MasterPartsClassDto[]
  >([])

  useEffect(() => {
    const fetchParts = async () => {
      const partsCategoryResponse =
        await apiClient.documentPartsApi.documentPartsControllerGetDocumentPartsClassAndCategories()
      setPartsCategoryList(partsCategoryResponse.data)

      const partsResponse =
        await apiClient.documentPartsApi.documentPartsControllerList()
      setPartsList(partsResponse.data.data)
    }
    fetchParts()
  }, [])

  const handleOnClickPageItem = (item: IdmlItemsResponseDtoItemsInner) => {
    if (isPropsManuscript) return
    //相乗り原稿は編集不可
    if (manuscriptState.document.aliasId !== null) return
    if (!manuscriptState.isPartsEditing && item) {
      let selectedPartsTagId = ""
      const partsItem = item as any
      if (
        item.type === "imported-page" &&
        (item as any).item.tag.startsWith("PATTERN_")
      ) {
        if ((item as any).status !== "created") {
          setManuscriptState((state) => ({ ...state, partsModalShown: true }))
        } else {
          selectedPartsTagId = `${partsItem.parentTagId}_${partsItem.item.tag}`
        }
      }

      setManuscriptState((state) => ({
        ...state,
        selectedItem: item,
        selectedPartsTagId: selectedPartsTagId,
      }))
    }
  }

  const handleOnClickPaper = () => {
    //相乗り原稿は編集不可
    if (manuscriptState.document.aliasId !== null) return
    setManuscriptState((state) => ({ ...state, selectedItem: null }))
  }

  const handleCreateNewParts = async (partsId: number) => {
    try {
      // 暫定対応(今後見直す時に型を全部綺麗にする)
      setLoadingState(true)
      const partsItem = manuscriptState.selectedItem as any
      // console.log(partsItem.parentTagId)
      const packageId = `parts_layout_${partsItem.parentTagId.replace(
        "APEAL_",
        "",
      )}`

      // console.log("選択されたパーツID: ", {
      //   editId: manuscriptState.editId,
      //   packageId: packageId.toLocaleLowerCase(),
      //   tagId: partsItem.item.tag,
      //   partsId: partsId,
      // })

      // パーツ作成
      await apiClient.idmlReplaceApiFactory.idmlReplaceControllerCreateWorkspacePartsCoumn(
        {
          editId: manuscriptState.editId,
          packageId: packageId.toLocaleLowerCase(),
          tagId: partsItem.item.tag,
          partsId: partsId,
        },
      )

      // 最新の項目レイアウト定義を取得
      const idmlResponse =
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
          manuscriptState.editId,
        )
      setManuscriptState((state) => ({
        ...state,
        items: idmlResponse.data.items,
      }))

      setManuscriptState((state) => ({ ...state, partsModalShown: false }))
    } catch (error) {
      setManuscriptState((state) => ({ ...state, partsModalShown: false }))
      showAlertMessage("error", "選択されたパーツを保存できませんでした")
    } finally {
      setLoadingState(false)
    }
  }


  const manuscriptData = useMemo(() => {
    if (props.manuscriptProps) return props.manuscriptProps
    return manuscriptState
  }, [manuscriptState, props.manuscriptProps])

  const isPropsManuscript = useMemo(() => {
    return props.manuscriptProps !== undefined
  }, [props.manuscriptProps])

  const scales = useMemo(() => {
    if (props.manuscriptProps !== undefined)
      return {
        initScale: 0.6,
        minScale: 0.6,
      }
    return {
      initScale: manuscriptData.original ? 0.7 : 0.8,
      minScale: manuscriptData.original ? 0.6 : 0.8,
    }
  }, [manuscriptData, props.manuscriptProps])

  const maxHeight = useMemo(() => {
    if (props.manuscriptProps !== undefined)
      return {
        maxHeight: "100%",
      }
    else
      return {
        maxHeight: `${
          props.type === "split" ? "calc(100vh - 400px)" : "calc(100vh - 149px)"
        }`,
      }
  }, [props.manuscriptProps, props.type])
  
  if (!manuscriptState) {
    return null
  }

  return (
    <TransformWrapper
      key={manuscriptData.id}
      initialScale={scales.initScale}
      minScale={scales.minScale}
      initialPositionX={0}
      centerOnInit
      pinch={pinchOptions}
      wheel={wheelOptions}
    >
      <TransformComponent
        wrapperStyle={{
          width: "100%",
          ...maxHeight,
          height: "100%",
        }}
      >
        {manuscriptData && manuscriptData.original ? (
          <IdmlPageItemsPreview
            editId={manuscriptData.editId}
            selectedItem={manuscriptData.selectedItem}
            items={manuscriptData.items}
            idmlEditId={props.idmlEditId}
            page={manuscriptData.original.page}
            backgroundImage={createWorkspaceBackgroundImageURL(
              manuscriptData.document.documentSizeCode,
            )}
            onClickPageItem={handleOnClickPageItem}
            onClickPaper={handleOnClickPaper}
            isPropsManuscript={isPropsManuscript}
          />
        ) : (
          <img
            src='/assets/plan-a.png'
            alt='test'
            className='w-auto'
            style={{
              height: `${
                props.type === "split"
                  ? "calc(100vh - 462px)"
                  : "calc(100vh - 229px)"
              }`,
            }}
          />
        )}
      </TransformComponent>

      <WorkspaceModalPartsSelect
        items={partsList.filter(
          (x) =>
            x.documentSizeCode === manuscriptData.document?.documentSizeCode,
        )}
        shown={manuscriptData.partsModalShown ?? false}
        onSelect={handleCreateNewParts}
        onClose={() =>
          setManuscriptState((state) => ({ ...state, partsModalShown: false }))
        }
        partsCategoryList={partsCategoryList}
      />
    </TransformWrapper>
  )
}

export default WorkspacePreview
