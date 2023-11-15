import React, { useEffect, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import { useRecoilState, useSetRecoilState } from "recoil"
import { workspaceBookletState } from "@/atoms/workspace"
import { useApiClient } from "@/hooks/useApiClient"
import MuiButton from "@mui/material/Button"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"

interface Props {
  pageNumber: number
  order: 1 | 2 | 3 | 4
  onClose: () => void
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

const MAP_ORDER_NAME = {
  "1": "右上",
  "2": "左上",
  "3": "右下",
  "4": "左下",
}

const PAGE_SIZE_ORDER = {
  A: [1],
  B: [1, 2],
  C: [1, 2, 3],
  D: [1, 2, 3],
  E: [1, 2, 3, 4],
}

const DOC_SIZE = {
  A_1: "ONE_ONE",
  B_1: "ONE_TWO",
  B_2: "ONE_TWO",
  C_1: "ONE_TWO",
  C_2: "ONE_FOUR",
  C_3: "ONE_FOUR",
  D_1: "ONE_FOUR",
  D_2: "ONE_FOUR",
  D_3: "ONE_TWO",
}

const WorkspaceModalMoveManuscript = (props: Props) => {
  const apiClient = useApiClient()
  const [complite, setComplete] = useState<string>("select_page") // "complete" ,  "select_order"
  const [toPageValue, setToPageValue] = useState<number>(null)
  const [toDocOrder, setToDocOrder] = useState<number>(null)
  const [toDocOrderSize, setToDocOrderSize] = useState<string>(null) // ONE_TWO, ONE_FOUR
  const [toPageLayout, setToPageLayout] = useState("")
  const [listDocOrder, setListDocOrder] = useState<number[]>([])
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)
  // const {  } = useSetRecoilState(bo)
  const [documentTypeName, setDocumentTypeName] = useState("")
  const [pageOptions, setPageOptions] = useState([])
  useEffect(() => {
    let name =
      bookletState.pages
        .find((page) => page.pageNumber === props.pageNumber)
        ?.documents.find((doc) => doc.order === props.order)?.documentType
        ?.kana || ""
    const validOptionPage = [
      ...Array(bookletState ? bookletState.numberOfPages : 0),
    ]
      .map((_, i) => i + 3)
      .filter((pageNumber) => {
        // get other page
        let thisPage = bookletState.pages.find(
          (page) => page.pageNumber === pageNumber,
        )
        if (thisPage) {
          if (
            thisPage.layoutAlphabet &&
            !PAGE_SIZE_ORDER[thisPage.layoutAlphabet].every((order) =>
              thisPage.documents.find((doc) => doc.order == order),
            )
          )
            return true
          else return false
        }
        return false
      })
    if (validOptionPage.length === 0) {
      setComplete("cancel")
    } else {
      setPageOptions(validOptionPage)
      setDocumentTypeName(name)
    }
  }, [props.pageNumber, props.order, bookletState]) // eslint-disable-line

  useEffect(() => {
    if (complite === "cancel" || complite === "no_match") {
      setToDocOrder(null)
      setToDocOrderSize(null)
    }
  }, [complite])
  const handleOnClose = () => props.onClose()

  const compareDocSize = (toPage, toOrder) => {
    let sourcePage = bookletState.pages.find(
      (page) => page.pageNumber === props.pageNumber,
    )
    let targetPage = bookletState.pages.find(
      (page) => page.pageNumber === toPage,
    )
    const originDocSize =
      DOC_SIZE[`${targetPage.layoutAlphabet}_${props.order}`]
    const toDocSize = DOC_SIZE[`${sourcePage.layoutAlphabet}_${toOrder}`]
    return originDocSize === toDocSize
  }

  const handleNextOrder = () => {
    setToDocOrder(null)
    setToDocOrderSize(null)
    let toMovePage = bookletState.pages.find(
      (page) => page.pageNumber == toPageValue,
    )
    if (toMovePage) {
      const hasMatch = listDocOrder.some((order) =>
        compareDocSize(toPageValue, order),
      )
      if (hasMatch) {
        if (listDocOrder.length === 1) {
          return handleMove({
            toOrder: listDocOrder[0],
          })
        }
        setComplete("select_order")
      } else {
        setComplete("no_match")
      }
    }
  }
  const handleMove = async (options?: { toOrder: number }) => {
    const docOrder = options && options.toOrder ? options.toOrder : toDocOrder
    //
    let sourcePage = bookletState.pages.find(
      (page) => page.pageNumber === props.pageNumber,
    )
    let targetPage = bookletState.pages.find(
      (page) => page.pageNumber === toPageValue,
    )

    if (!sourcePage || !targetPage) return setComplete("no_match")
    let documentMoving = sourcePage.documents.find(
      (doc) => doc.order === props.order,
    )
    let response =
      await apiClient.documentsApiFactory.documentControllerMoveDocument({
        id: documentMoving.id,
        order: Number(docOrder),
        pageId: targetPage.id,
      })
    let updateSourceDocuments = sourcePage.documents.filter(
      (doc) => doc.order !== props.order,
    )

    let updateTargetDocuments = [
      ...targetPage.documents,
      { ...documentMoving, order: Number(docOrder) },
    ]
    if (targetPage.id === sourcePage.id) {
      updateTargetDocuments = [
        ...updateSourceDocuments,
        { ...documentMoving, order: Number(docOrder) },
      ]
    } else {
      if (updateSourceDocuments.length === 0) {
        await apiClient.pagesApiFactory
          .pageControllerDelete(sourcePage.id, true)
          .then(() => {
            console.log({ deleting: sourcePage.id })
            setBookletState({
              ...bookletState,
              pages: bookletState.pages.filter((p) => p.id != sourcePage.id),
            })
          })
      }
    }
    setBookletState((state) => {
      return {
        ...state,
        pages: state.pages
          .filter((p) => {
            if (p.id == sourcePage.id && sourcePage.documents.length === 0)
              return false
            return true
          })
          .map((page) => {
            let newDocuments = page.documents
            if (page.pageNumber === props.pageNumber)
              newDocuments = updateSourceDocuments
            if (page.pageNumber === toPageValue)
              newDocuments = updateTargetDocuments
            // update document api
            return { ...page, documents: newDocuments }
          }),
      }
    })
    setComplete("complete")
  }

  const handleChange = (e) => {
    setToPageValue(parseInt(e.target.value))
    let thisPage = bookletState.pages.find(
      (page) => page.pageNumber === parseInt(e.target.value),
    )

    if (thisPage) {
      const listFullOrder = PAGE_SIZE_ORDER[thisPage.layoutAlphabet] || []
      const closeOrder = thisPage.documents.map((doc) => doc.order)
      const openOrder = listFullOrder.filter(
        (order) =>
          !closeOrder.includes(order) &&
          compareDocSize(parseInt(e.target.value), order),
      )
      console.log({ openOrder })

      setToPageLayout(thisPage.layoutAlphabet)
      setListDocOrder(openOrder)
    }
  }

  const handleChangeDocOrder = (e, docSize) => {
    setToDocOrder(e)
    setToDocOrderSize(docSize)
  }

  const CancelModal = () => {
    return (
      <div className='relative flex min-h-[280px] min-w-[480px] flex-col '>
        <div className='mt-[56px] px-9'>
          <p className='text-center text-lg font-bold'>移動</p>
          <p className='mt-4 text-center text-sm font-medium'>
            移動先のページがありません
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }
  const NoMatchModal = () => {
    return (
      <div className='relative flex min-h-[280px] min-w-[480px] flex-col '>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>移動</p>
          <p className='mt-4 text-center text-sm font-medium'>
            移動元と移動先の原稿サイズが不一致のため移動できません。
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }

  const SelectOrderViewItem: React.FC<{
    disabled: boolean
    size: string
    order: number
  }> = (props: { disabled: boolean; size: string; order: number }) => {
    if (props.size === "ONE_TWO" || props.size === "ONE_FOUR")
      return (
        <div
          onClick={() =>
            !props.disabled && handleChangeDocOrder(props.order, props.size)
          }
          className={
            (props.size === "ONE_TWO" ? "w-[292px] " : "w-[139px] ") +
            "flex h-[204px] cursor-pointer items-center bg-[#F0F2F8]" +
            (toDocOrder === props.order
              ? " border border-solid border-[#1976D2]"
              : "") +
            (props.disabled ? " cursor-not-allowed bg-[#FBFBFB]" : "")
          }
        >
          <span className='block w-full text-center text-[12px] font-medium'>
            {props.disabled ? "配置できません" : "クリックして選択"}
          </span>
        </div>
      )
    else return undefined
  }

  const SelectOrderView = (props: { layout: string; open: Array<number> }) => {
    return (
      // disable #FBFBFB
      <div className='relative flex min-h-[600px] min-w-[900px] flex-col items-center justify-center '>
        <div className='mb-[20px] w-full text-center'>原稿配置確認</div>
        <div className='flex items-center justify-center'>
          {props.layout === "B" && (
            <div className='border-gray-200 flex h-[462px] w-[324px] flex-col justify-between gap-[12px] border border-solid border-[#ccc] bg-white-0 p-[16px]'>
              <SelectOrderViewItem
                disabled={!props.open.includes(1)}
                order={1}
                size={"ONE_TWO"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(2)}
                order={2}
                size={"ONE_TWO"}
              />
            </div>
          )}
          {props.layout === "C" && (
            <div className='border-gray-200 flex h-[462px] w-[324px] flex-wrap justify-between gap-[12px] border border-solid border-[#ccc] bg-white-0 p-[16px]'>
              <SelectOrderViewItem
                disabled={!props.open.includes(1)}
                order={1}
                size={"ONE_TWO"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(3)}
                order={3}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(2)}
                order={2}
                size={"ONE_FOUR"}
              />
            </div>
          )}
          {props.layout === "D" && (
            <div className='border-gray-200 flex h-[462px] w-[324px] flex-wrap justify-between gap-[12px] border border-solid border-[#ccc] bg-white-0 p-[16px]'>
              <SelectOrderViewItem
                disabled={!props.open.includes(2)}
                order={2}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(1)}
                order={1}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(3)}
                order={3}
                size={"ONE_TWO"}
              />
            </div>
          )}
          {props.layout === "E" && (
            <div className='border-gray-200 flex h-[462px] w-[324px] flex-wrap justify-between gap-[12px] border border-solid border-[#ccc] bg-white-0 p-[16px]'>
              <SelectOrderViewItem
                disabled={!props.open.includes(2)}
                order={2}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(1)}
                order={1}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(4)}
                order={4}
                size={"ONE_FOUR"}
              />
              <SelectOrderViewItem
                disabled={!props.open.includes(3)}
                order={3}
                size={"ONE_FOUR"}
              />
            </div>
          )}
        </div>
        {/* footer */}
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={
              !toPageValue || !toPageLayout || !toDocOrder || !toDocOrderSize
            }
            onClick={() => handleMove()}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }

  const ConfirmView = () => {
    return (
      <div className='relative min-h-[320px] min-w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>移動</p>
          <p className='mt-4 text-center text-sm font-medium'>
            移動先ページを選択してください
          </p>
          <div className='flex items-center justify-center'>
            <div className='mt-7 flex items-center justify-center'>
              <span className='mr-1 max-w-[90px] text-sm font-medium'>
                移動先ページ
              </span>
              <MuiFormControl size='small' sx={{ minWidth: 122 }}>
                <MuiSelect
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue={toPageValue}
                  MenuProps={MenuProps}
                  onChange={handleChange}
                >
                  <MuiMenuItem value={null}>移動先ページの選択</MuiMenuItem>
                  {pageOptions.map((pageNumber, i) => (
                    <MuiMenuItem key={i} value={pageNumber}>
                      {pageNumber}ページ
                    </MuiMenuItem>
                  ))}
                </MuiSelect>
              </MuiFormControl>
            </div>
          </div>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
          <MuiButton
            color='inherit'
            variant='outlined'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            キャンセル
          </MuiButton>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={!toPageValue}
            onClick={handleNextOrder}
          >
            確定
          </MuiButton>
        </div>
      </div>
    )
  }
  const CompleteView = () => {
    return (
      <div className='relative h-[320px] w-[600px]'>
        <div className='px-9 pt-[56px]'>
          <p className='text-center text-lg font-bold'>原稿の移動完了</p>
          <p className='mt-4 text-center text-sm font-medium'>
            {documentTypeName}の原稿<br></br>を{toPageValue}ページへ移動しました
          </p>
        </div>
        <div className='absolute bottom-0 left-0 flex w-full items-center justify-center px-9 pb-9'>
          <MuiButton
            variant='contained'
            sx={{ width: 104 }}
            onClick={handleOnClose}
          >
            OK
          </MuiButton>
        </div>
      </div>
    )
  }
  return (
    <BaseModal shown={true} onClickClose={handleOnClose}>
      {complite === "cancel" && <CancelModal />}
      {complite === "no_match" && <NoMatchModal />}
      {complite === "complete" && <CompleteView />}
      {complite === "select_page" && <ConfirmView />}
      {complite === "select_order" && (
        <SelectOrderView layout={toPageLayout} open={listDocOrder} />
      )}
    </BaseModal>
  )
}

export default WorkspaceModalMoveManuscript
