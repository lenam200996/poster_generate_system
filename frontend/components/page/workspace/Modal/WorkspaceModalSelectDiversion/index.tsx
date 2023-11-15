import { useEffect, useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiTable from "@mui/material/Table"
import MuiTableBody from "@mui/material/TableBody"
import MuiTableCell from "@mui/material/TableCell"
import MuiTableContainer from "@mui/material/TableContainer"
import dayjs from "@/util/dayjs"
import MuiTableHead from "@mui/material/TableHead"
import MuiTableRow from "@mui/material/TableRow"
import { createTheme, ThemeProvider } from "@mui/material"
import tableRowTheme from "@/config/mui/theme/tableRow"
import Radio from "@mui/material/Radio"
import MuiIconButton from "@mui/material/IconButton"
import RadioGroup from "@mui/material/RadioGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import {
  DocumentResponseDto,
  IdmlItemsResponseDto,
  IdmlItemsResponseDtoItemsInner,
} from "@/openapi"
import { useApiClient } from "@/hooks/useApiClient"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import DiversionFilter from "./DiversionFilter"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import { useMyStock } from "@/hooks/useMyStock"
import { userCognitoMock } from "@/config/api/mock/myStock"
import { useRouter } from "next/router"
import BaseModalPreview from "@/components/base/overlay/BaseModalPreview"
import WorkspacePreview from "../../WorkspacePreview"
import { workspaceManuscriptState } from "@/atoms/workspace"
import BaseModalConfirm from "@/components/base/overlay/BaseModalConfirm"

// propsのmyStockIdを参照して相乗りの配列を取得する。今は仮で
const array = [
  { id: "Z202206ES00001", edition: "関東", updated: "2023/08/16　16:15" },
  { id: "Z202206ES00002", edition: "関東", updated: "2023/08/16　16:15" },
]

type DiversionResult = {
  documentId: number
  mystock: boolean
  documentCode: string
  mediaTypeName: string
  mediaTypeCode: string
  issueMonth: string
  issueYear: string
  editionName: string
  editionCode: string
  status: string
  updated: string
  manuscriptPerson: string
  bookletId: number
  projectId: number
  hotelCode: string
}

const theme = createTheme(tableRowTheme)

interface Props {
  document: DocumentResponseDto
  onClose?: () => void
  onExact?: () => void
}
type SelectOptionsType = { label: string; value: string }[]

const WorkspaceModalSelectDiversion = (props: Props) => {
  const router = useRouter()
  const [shownPreview, setShownPreview] = useState(false)
  const [manuscript, setManuscript] = useState<any>(undefined)
  const [searchResults, setSearchResults] = useState<Array<DiversionResult>>([])
  const [filteredResults, setFilteredResults] = useState<
    Array<DiversionResult>
  >([])
  const [selectedDocumentId, setSelectedDocumentId] =
    useState<number>(undefined)
  const apiClient = useApiClient()
  const { toggleMyStock } = useMyStock()
  const [bookmark, setBookmark] = useState(false)
  const [filterYearMonthOptions, setFilterYearMonthOptions] =
    useState<SelectOptionsType>([])
  const [filterConditions, setFilterConditions] = useState<
    FilterSearchCondition[]
  >([])
  const [previewManuscript, setPreviewManuscript] = useState<{
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
  }>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const handleOnClickPreview = async (value: DiversionResult) => {
    setManuscript(value)
    const editId = `${value.projectId}_${value.bookletId}_${value.documentId}`
    const result =
      await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
        editId,
        "template",
      )
    const dataDocument =
      await apiClient.documentsApiFactory.documentControllerGetDocument(
        value.documentId,
      )
    const idmlResponse = result
    const items = idmlResponse.data.items
    setPreviewManuscript({
      original: idmlResponse.data,
      items: items,
      document: dataDocument.data,
      viewState: "Price",
      editId,
      id: dataDocument.data.id,
    })
    setShownPreview(true)
  }
  const handleOnSearch = (conditions: FilterSearchCondition[]) => {
    let filters = conditions
      .concat(
        filterConditions.filter((s) => !conditions.find((t) => t.key == s.key)),
      )
      .filter((f) => {
        if (f.value === "") {
          return false
        }
        return true
      })
    setFilterConditions([...filters])
  }
  const handleClickClose = () => {
    props.onClose()
  }
  const handleOnClickExact = () => {
    setShowConfirmModal(true)
  }
  const clickExactConfirmed = () => {
    if (!selectedDocumentId) return
    try {
      apiClient.documentsApiFactory.documentControllerDiversion(
        selectedDocumentId,
        props.document.id,
      )
      router.push({
        pathname: "/workspace/[id]",
        query: {
          id: props.document.bookletId,
          viewMode: "split",
          documentId: props.document.id,
        },
      })
    } catch (error) {
      console.error(error)
    }
    props.onExact()
  }
  const handleOnClickMyStock = async (id: number) => {
    const newResults = [...searchResults]
    const item = newResults.find((x) => x.documentId === id)
    try {
      await toggleMyStock(!item.mystock, item.documentId, userCognitoMock)
      item.mystock = !item.mystock
      setSearchResults(newResults)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const newResults = searchResults.filter((x) => {
      return !filterConditions.some((condition) => {
        if (condition.key === "media") {
          return condition.value.split(",").every((s) => s !== x.mediaTypeCode)
        } else if (condition.key === "edition") {
          return condition.value.split(",").every((s) => s !== x.editionCode)
        } else if (condition.key === "yearMonth") {
          return condition.value
            .split(",")
            .every(
              (s) => dayjs(s).format("YYYYM") !== x.issueYear + x.issueMonth,
            )
        }
      })
    })
    setFilteredResults([...newResults])
  }, [filterConditions, searchResults])

  useEffect(() => {
    const fetch = async () => {
      const res =
        await apiClient.documentsApiFactory.documentControllerSearchDiversion(
          props.document.id,
        )
      const resArray = res.data
      const yearMonth = resArray
        .map((doc) =>
          dayjs(`${doc.project.issueYear}-${doc.project.issueMonth}`).format(
            "YYYY-MM",
          ),
        )
        .sort((a, b) => (a > b ? -1 : 0))
      setFilterYearMonthOptions(
        Array.from(new Set(yearMonth)).map((item) => ({
          label: dayjs(item).format("YYYY年M月号"),
          value: item,
        })),
      )
      const newArray: DiversionResult[] = resArray.map((doc) => {
        let isMyStock = false
        doc.documentMyStocks.forEach((myStock) => {
          if (myStock.createPersonCognito === userCognitoMock) {
            isMyStock = true
          }
        })
        return {
          documentId: doc.id,
          mystock: isMyStock,
          documentCode: doc.documentCode,
          status: doc.status.name,
          updated: doc.modifiedAt,
          manuscriptPerson: doc.manuscriptPerson.personName,
          editionName: doc.booklet.masterEditionCode.name,
          editionCode: doc.booklet.masterEditionCode.code,
          mediaTypeName: doc.project.mediaType.name,
          mediaTypeCode: doc.project.mediaType.code,
          issueMonth: String(doc.project.issueMonth),
          issueYear: String(doc.project.issueYear),
          bookletId: doc.booklet.id,
          projectId: doc.booklet.projectId,
          hotelCode: doc.hotelCode,
        } as DiversionResult
      })
      setSearchResults(newArray)
    }
    fetch()
  }, []) // eslint-disable-line
  if (!props.document) {
    return <></>
  }
  return (
    <div>
      <BaseModal shown={true} onClickClose={handleClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[36px] pt-[40px]'>
          <p className='text-center text-lg font-bold'>
            流用指示　流用元の原稿選択
          </p>
          <div className='my-6'>
            <DiversionFilter
              yearMonthOptions={filterYearMonthOptions}
              conditions={filterConditions}
              onSearch={handleOnSearch}
            />
          </div>
          <p className='mt-3 text-center text-sm font-bold'>
            {`${props.document.hotelCode}　${props.document.documentContent.hotelNameLarge}　原稿サイズ：${props.document.documentSize.name}`}
          </p>
          <p className='mt-3 text-center text-sm font-medium'>
            流用元の原稿を下記から選択してください
          </p>
          {/** in content */}
          <div className='mx-auto mt-3 w-fit'>
            <RadioGroup
              defaultValue={""}
              name='category'
              onChange={(event) =>
                setSelectedDocumentId(Number(event.target.value))
              }
            >
              <MuiTableContainer
                sx={{ maxHeight: 245 }}
                className='rounded border-[1px] border-solid border-divider-accent-primary'
              >
                <MuiTable stickyHeader>
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell
                        align='center'
                        padding='none'
                        sx={{ width: "50px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          選択
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        padding='none'
                        sx={{ width: "24px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          <span className='material-icons align-top'>star</span>
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "80px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          原稿ID
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "236px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-light text-content-default-quaternary'>
                          媒体・月号
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "80px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          版
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "140px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          ステータス
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "140px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          最終更新日
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "140px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          原稿担当
                        </div>
                      </MuiTableCell>
                      <MuiTableCell
                        align='center'
                        sx={{ width: "104px", backgroundColor: "#F2F5FF" }}
                      >
                        <div className='text-xs font-normal text-content-default-quaternary'>
                          プレビュー
                        </div>
                      </MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    <ThemeProvider theme={theme}>
                      {filteredResults.map((x) => (
                        <MuiTableRow key={x.documentId}>
                          <MuiTableCell
                            align='center'
                            padding='none'
                            height={48}
                          >
                            <FormControlLabel
                              value={x.documentId}
                              control={<Radio size='small' />}
                              label={""}
                              sx={{ margin: 0, fontSize: "12px" }}
                            />
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <MuiIconButton
                              onClick={() => handleOnClickMyStock(x.documentId)}
                            >
                              <span
                                className={`text-[#1976D2] ${
                                  x.mystock
                                    ? "material-icons"
                                    : "material-symbols-outlined"
                                }`}
                              >
                                star
                              </span>
                            </MuiIconButton>
                          </MuiTableCell>
                          <MuiTableCell align='center' padding='none'>
                            <div className='text-xs font-medium'>
                              {x.documentCode}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {`${x.mediaTypeName}　${x.issueYear}年 ${x.issueMonth}月号`}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {x.editionName}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {x.status}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {dayjs(x.updated).format("YYYY/M/D  HH:mm")}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell padding='none' align='center'>
                            <div className='text-xs font-medium'>
                              {x.manuscriptPerson}
                            </div>
                          </MuiTableCell>
                          <MuiTableCell
                            size='small'
                            align='center'
                            sx={{ fontSize: 12, fontWeight: 500 }}
                          >
                            <BaseButtonIconText
                              // disabled={true}
                              icon='plagiarism'
                              text='表示'
                              onClick={() => {
                                handleOnClickPreview(x)
                              }}
                            />
                          </MuiTableCell>
                        </MuiTableRow>
                      ))}
                    </ThemeProvider>
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
            </RadioGroup>
          </div>
          {filteredResults.length === 0 && (
            <div className='mt-10 text-center text-sm font-bold text-content-default-primary'>
              流用可能な原稿がありません
            </div>
          )}
          {/** end content */}
          <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleClickClose}
            >
              キャンセル
            </MuiButton>
            <MuiButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!selectedDocumentId}
              onClick={handleOnClickExact}
            >
              確定
            </MuiButton>
          </div>
        </div>
        {shownPreview && (
          // WorkspacePreview
          <BaseModalPreview
            imageUrl={"" /*manuscript.image*/}
            PreviewComponent={
              <WorkspacePreview
                imgUrl=''
                type='fullscreen'
                manuscriptProps={previewManuscript}
              />
            }
            shown={shownPreview}
            onClose={() => setShownPreview(false)}
          />
        )}
        {showConfirmModal && (
          <BaseModalConfirm
            header='流用確認'
            onClose={() => setShowConfirmModal(false)}
            onNext={() => {}}
          >
            原稿を上書きしますか？
          </BaseModalConfirm>
        )}
      </BaseModal>
    </div>
  )
}

export default WorkspaceModalSelectDiversion
