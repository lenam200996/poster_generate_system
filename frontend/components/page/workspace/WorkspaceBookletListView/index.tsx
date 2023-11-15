import { useState, useEffect } from "react"
import { useRecoilState, useResetRecoilState } from "recoil"
import { workspaceOutputsState, workspaceShownsState } from "@/atoms/workspace"
import WorkspaceBooklets from "@/components/page/workspace/WorkspaceBooklets"
import WorkspaceChangeSplitListBar from "@/components/page/workspace/WorkspaceChangeSplitListBar"
import MuiIconButton from "@mui/material/IconButton"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import MuiCheckbox from "@mui/material/Checkbox"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import formControlLabelTheme from "@/config/mui/theme/formControlLabel"
import { BookletDetailResponseDto } from "@/openapi"

type Props = {
  booklet: BookletDetailResponseDto
}

const theme = createTheme(formControlLabelTheme)

const WorkspaceListView = (props: Props) => {
  const [showns, setShowns] = useRecoilState(workspaceShownsState)
  const [outputsRecoilState, setOutputsRecoilState] = useRecoilState(
    workspaceOutputsState,
  )
  const [allShown, setAllShown] = useState<boolean>(false)
  const [pageValues, setPageValues] = useState<number[]>([])
  const resetShownsState = useResetRecoilState(workspaceShownsState)
  const handleOnClickAll = () => {
    if (showns.length === pageValues.length) {
      // ページで開く物なし（全部開いている）-> 全て閉じる
      setShowns([])
    } else {
      // ページで開く物あり（どれか開いていない）-> 全て開ける
      setShowns([...pageValues])
    }
  }
  const handleOnChangeAll = () => {
    if (outputsRecoilState.length === pageValues.length) {
      setOutputsRecoilState([])
    } else {
      setOutputsRecoilState(pageValues)
    }
  }
  const handleOnChange = (id: number) => {
    if (outputsRecoilState.includes(id)) {
      setOutputsRecoilState((state) => state.filter((value) => value !== id))
    } else {
      setOutputsRecoilState((state) => [...state, id])
    }
  }

  // ページ単体のダブルアローボタン押下時
  const handleOnClick = (pageNum: number) => {
    // ページ番号があるかチェック
    if (showns.includes(pageNum)) {
      // ある場合
      // 同じ値のページ番号を削除
      setShowns((state) => state.filter((value) => value !== pageNum))
    } else {
      // ない場合
      // ページ番号を追加
      setShowns((state) => [...state, pageNum])
    }
  }

  // 画面のページ項目の開閉状態をリセットする（閉じる状態になる）
  useEffect(() => {
    resetShownsState()
  }, [])

  useEffect(() => {
    const pageNumbers = props.booklet
      ? [...Array(props.booklet.numberOfPages)].map((_, i) => i + 3)
      : []

    pageNumbers.map((pageNumber, index) => {
      const page = props.booklet.pages.find(
        (page) => page.pageNumber === pageNumber,
      )
    })

    setPageValues(pageNumbers)
  }, [props.booklet, setOutputsRecoilState])

  useEffect(() => {
    if (showns.length === 0) {
      setAllShown(false)
    } else if (showns.length === pageValues.length) {
      setAllShown(true)
    }
  }, [showns]) // eslint-disable-line

  const pageNumbers = props.booklet
    ? [...Array(props.booklet.numberOfPages)].map((_, i) => i + 3)
    : []

  return (
    <div>
      <div className='bg-container-main-primary px-10 py-5'>
        <div className='my-3 flex items-center'>
          <ThemeProvider theme={theme}>
            <MuiFormControlLabel
              control={
                <MuiCheckbox
                  size='small'
                  checked={outputsRecoilState.length === pageValues.length}
                  onChange={handleOnChangeAll}
                />
              }
              label='全てチェック'
            />
          </ThemeProvider>
          <div className='ml-5'>
            <MuiIconButton onClick={handleOnClickAll}>
              <span
                className={`material-symbols-outlined text-content-default-quaternary ${
                  allShown && "rotate-180"
                }`}
              >
                keyboard_double_arrow_down
              </span>
            </MuiIconButton>
          </div>
        </div>
        {/* プロジェクトリスト コンテンツ部分 */}
        {props.booklet && (
          <div className='relative mt-8 h-[calc(100vh_-_258px)] overflow-y-auto'>
            <div className='rounded bg-container-main-septenary p-1'>
              {pageNumbers.map((pageNumber, index) => {
                const page = props.booklet.pages.find(
                  (page) => page.pageNumber === pageNumber,
                )
                return (
                  <div key={index}>
                    <WorkspaceBooklets
                      page={page}
                      pageNumber={pageNumber}
                      checked={outputsRecoilState.includes(page?.id)}
                      onChange={handleOnChange}
                      onOpen={handleOnClick}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div className='fixed bottom-0 right-0 w-full'>
        <WorkspaceChangeSplitListBar />
      </div>
    </div>
  )
}

export default WorkspaceListView
