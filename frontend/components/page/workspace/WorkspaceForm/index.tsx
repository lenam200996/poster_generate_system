import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import MuiButton from "@mui/material/Button"
import MuiIconButton from "@mui/material/IconButton"
import MuiTooltip from "@mui/material/Tooltip"
import { workspaceManuscriptState } from "@/atoms/workspace"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"
import PriceStandard from "@/components/domain/price/priceStandard"
import { useRouter } from "next/router"
import { useApiClient } from "@/hooks/useApiClient"
import { useMyStock } from "@/hooks/useMyStock"
import { userCognitoMock } from "@/config/api/mock/myStock"
import { concatStrings } from "@/util/strings"
import WorkspaceHotelInfoForm from "../WorkspaceHotelInfoForm"
import WorkspaceModalSelectPattern, {
  PatternSet,
} from "../Modal/WorkspaceModalSelectPattern"
import { MasterDocumentSizeDtoCodeEnum } from "@/openapi"
import WorkspacePartsDetailForm from "@/components/page/workspace/WorkspacePartsDetailForm"
import { PartsMock } from "@/config/api/mock/parts"
import BaseModal from "@/components/base/overlay/BaseModal"

export type Props = {
  size: "small" | "medium" | "large"
  idmlEditId?: string
  refresh?: () => void
  save?: () => void
}
export type TemplatePatterns = {
  pattern1: PatternSet | null
  pattern2: PatternSet | null
  pattern3: PatternSet | null
  pattern4: PatternSet | null
}
const WorkspaceForm = (props: Props) => {
  const router = useRouter()
  const [manuscriptState, setManuscriptState] = useRecoilState(
    workspaceManuscriptState,
  )
  const [bookmark, setBookmark] = useState(false)
  const [bookmarkTitle, setBookmarkTitle] = useState("マイストックに保存")
  const [patternShown, setPatternShown] = useState(false)
  const [partsReSelectionShown, setPartsReSelectionShown] = useState(false)

  const apiClient = useApiClient()
  const { toggleMyStock } = useMyStock()
  const { id, documentId } = router.query

  //テンプレートのパターン情報、取得先未確認のため仮 1/1原稿の例
  const patterns: TemplatePatterns = {
    pattern1: "NINE",
    pattern2: "TWO_HALF",
    pattern3: "NINE",
    pattern4: "PRICE_TABLE",
  }

  useEffect(() => {
    setManuscriptState((state) => ({
      ...state,
      isPartsEditing: false,
    }))
  }, [])

  useEffect(() => {}, [])
  useEffect(() => {
    if (bookmark) {
      setBookmarkTitle("マイストックから保存解除")
    } else {
      setBookmarkTitle("マイストックに保存")
    }
  }, [bookmark])

  useEffect(() => {
    if (documentId) {
      const fetch = async () => {
        const res =
          await apiClient.documentsApiFactory.documentControllerGetDocumentContent(
            Number(documentId),
          )
        res.data.documentMyStocks &&
          setBookmark(
            res.data.documentMyStocks.some(
              (doc) => doc.createPersonCognito === userCognitoMock,
            ),
          )
      }
      fetch()
    }
  }, [documentId]) // eslint-disable-line

  const styles = () => {
    if (props.size === "small") {
      return "max-h-[calc(100vh_-_400px)]"
    } else if (props.size === "medium") {
      return "max-h-[calc(100vh_-_92px)]"
    } else if (props.size === "large") {
      return "max-h-[calc(100vh_-_92px)]"
    }
  }
  const handleOnClickPattern = () => {
    setPatternShown(true)
  }

  const handleOnClickMyStock = async () => {
    const currentBookmark = !bookmark
    try {
      await toggleMyStock(currentBookmark, manuscriptState.id, userCognitoMock)
      setBookmark(currentBookmark)
    } catch (error) {
      console.error(error)
    }
  }

  const onRefresh = () => {
    props.refresh && props.refresh()
  }

  /**
   * セーブ
   */
  const onSave = () => {
    props.save && props.save()
  }

  if (!manuscriptState) {
    return null
  }

  // 画面が宿情報編集であるか判定、相乗り原稿の場合宿情報画面表示できない
  if (
    manuscriptState?.viewState === "Hotel" &&
    manuscriptState?.document.aliasId === null
  ) {
    return <WorkspaceHotelInfoForm size={props.size} />
  }

  // 画面が料金表であるか判定、相乗り原稿の場合料金表画面表示できない
  if (
    manuscriptState?.viewState === "Price" &&
    manuscriptState?.document.aliasId === null
  ) {
    // 画面が料金表の場合
    // className：サイドバーの表示
    // PriceStandard：料金表編集から共通処理に繋ぐ設定
    return (
      <div className='mx-auto max-h-[calc(100vh_-_92px)] overflow-scroll px-20'>
        <PriceStandard
          onChange={onRefresh}
          onSave={onSave}
          hotelName={
            manuscriptState?.document &&
            manuscriptState?.document?.documentContent
              ? manuscriptState?.document?.documentContent?.hotelNameLarge
              : ""
          }
          idmlEditId={props.idmlEditId}
        />
      </div>
    )
  }

  return (
    <div className='relative h-full bg-white-0'>
      <div
        className={`scrollbar-hide relative m-auto h-full overflow-y-auto ${styles()}`}
      >
        <div className='flex h-[72px] items-center justify-between bg-container-main-senary pl-6 pr-8'>
          <div className='space-x-4'>
            <RenderWithRoles
              roles={[
                RolesMock.admin,
                RolesMock.operator,
                RolesMock.manuscriptUpdator,
                RolesMock.manuscriptOperator,
              ]}
            >
              <MuiButton
                size='small'
                variant='contained'
                disabled={manuscriptState.document?.aliasId !== null}
                onClick={() => {
                  setManuscriptState((state) => ({
                    ...state,
                    viewState: "Price",
                  }))
                  router.replace({
                    pathname: "/workspace/[id]",
                    query: {
                      id,
                      viewMode: "fullscreen",
                      viewTarget: "form",
                      documentId: documentId,
                    },
                  })
                }}
              >
                料金表編集
              </MuiButton>
            </RenderWithRoles>
            <MuiButton
              size='small'
              variant='contained'
              disabled={manuscriptState.document?.aliasId !== null}
              onClick={() =>
                setManuscriptState((state) => ({
                  ...state,
                  viewState: "Hotel",
                }))
              }
            >
              宿情報編集
            </MuiButton>
            <MuiButton
              size='small'
              disabled={manuscriptState.document?.aliasId !== null}
              variant='outlined'
              color='inherit'
              sx={{ backgroundColor: "#ffffff" }}
              onClick={() => handleOnClickPattern()}
            >
              パターン選択
            </MuiButton>
          </div>
          <MuiTooltip title={bookmarkTitle} arrow>
            <MuiIconButton onClick={() => handleOnClickMyStock()}>
              <span
                className={`text-[#1976D2] ${
                  bookmark ? "material-icons" : "material-symbols-outlined"
                }`}
              >
                star
              </span>
            </MuiIconButton>
          </MuiTooltip>
        </div>
        <div className='px-20'>
          <div className='mx-auto mb-8 flex w-full max-w-[1115px] justify-between bg-white-0 pt-6 '>
            <div>
              <div className='text-sm'>
                宿コード： {manuscriptState?.document?.hotelCode}
              </div>
              <div className='font-bold'>
                {concatStrings(
                  [
                    manuscriptState?.document?.documentContent?.hotelNameSmall,
                    manuscriptState?.document?.documentContent?.hotelNameLarge,
                  ],
                  "　",
                )}
              </div>
              <div className='mt-8 font-bold'>
                {manuscriptState.document?.aliasId && <> {`相乗り原稿`}</>}
              </div>
            </div>
            <div>
              {manuscriptState.selectedPartsTagId &&
                !manuscriptState.isPartsEditing && (
                  <div>
                    <MuiButton
                      size='small'
                      variant='outlined'
                      color='inherit'
                      sx={{ backgroundColor: "#ffffff" }}
                      className='mr-5'
                      onClick={() => {
                        if (manuscriptState.selectedPartsTagId) {
                          setManuscriptState((state) => ({
                            ...state,
                            isPartsEditing: true,
                          }))
                        }
                      }}
                    >
                      編集
                    </MuiButton>
                    <MuiButton
                      size='small'
                      variant='contained'
                      onClick={() => setPartsReSelectionShown(true)}
                    >
                      変更
                    </MuiButton>
                  </div>
                )}
              {manuscriptState.selectedPartsTagId &&
                manuscriptState.isPartsEditing && (
                  <MuiButton
                    size='small'
                    variant='outlined'
                    color='inherit'
                    sx={{ backgroundColor: "#ffffff" }}
                    onClick={() => {
                      setManuscriptState((state) => ({
                        ...state,
                        isPartsEditing: false,
                      }))
                    }}
                  >
                    編集終了
                  </MuiButton>
                )}
            </div>
          </div>
          {manuscriptState.isPartsEditing && (
            <WorkspacePartsDetailForm parts={PartsMock[0]} />
          )}
        </div>
      </div>

      {patternShown && (
        <WorkspaceModalSelectPattern
          size={
            manuscriptState.document
              ?.documentSizeCode as MasterDocumentSizeDtoCodeEnum
          }
          editId={props.idmlEditId}
          patterns={patterns}
          shown={patternShown}
          onClose={() => setPatternShown(false)}
        />
      )}

      {partsReSelectionShown && (
        <BaseModal
          shown={partsReSelectionShown}
          onClickClose={() => setPartsReSelectionShown(false)}
        >
          <div className='relative h-[320px] w-[600px]'>
            <div className='px-9 pt-[56px]'>
              <p className='text-center text-lg font-bold'>パーツの再選択</p>
              <p className='mt-4 text-center text-sm font-medium'>
                入力した内容を削除して
                <br />
                パーツを再選択しますか？
              </p>
            </div>
            <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
              <MuiButton
                color='inherit'
                variant='outlined'
                sx={{ width: 104 }}
                onClick={() => setPartsReSelectionShown(false)}
              >
                キャンセル
              </MuiButton>
              <MuiButton
                variant='contained'
                sx={{ width: 104 }}
                onClick={() => {
                  setManuscriptState((state) => ({
                    ...state,
                    partsModalShown: true,
                  }))
                  setPartsReSelectionShown(false)
                }}
              >
                確定
              </MuiButton>
            </div>
          </div>
        </BaseModal>
      )}
    </div>
  )
}

export default WorkspaceForm
