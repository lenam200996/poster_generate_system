import { useState } from "react"
import MuiCheckbox from "@mui/material/Checkbox"
import MuiLink from "@mui/material/Link"
import MuiFormControlLabel from "@mui/material/FormControlLabel"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ProjectCSVOutputModal from "../ProjectCSVOutputModal"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import {
  BookletProgressAggregationDto,
  ProjectWithXlsFilesResponseDto,
} from "@/openapi/api"

interface Props {
  project: ProjectWithXlsFilesResponseDto
  bookletsProgress: BookletProgressAggregationDto[]
  onClickManuscriptLink: (plate: string, status: string) => void
  onUpdateLockedBookletsProgress: (id: number, value: boolean) => void
  downloadAfterWordData: (projectId: number, editionCode: string) => void
  outputProgressStatus: "wait" | "work" | "done" | "error"
}

const ProjectStatusTable = (props: Props) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])

  const statusCount = props.bookletsProgress.reduce(
    (total, item) => {
      total.notStart += item.notStart
      total.makingCount += item.makingCount
      total.checkingCount += item.checkingCount
      total.sendBackCount += item.sendBackCount
      total.proofreadingCount += item.proofreadingCount
      total.myStockCount += item.myStockCount
      total.matchedCount += item.matchedCount
      total.unusedCount += item.unusedCount
      total.entryCount += item.entryCount
      total.locked += item.locked ? 1 : 0
      return total
    },
    {
      notStart: 0,
      makingCount: 0,
      checkingCount: 0,
      sendBackCount: 0,
      proofreadingCount: 0,
      myStockCount: 0,
      matchedCount: 0,
      unusedCount: 0,
      documentCount: 0,
      entryCount: 0,
      locked: 0,
    },
  )

  const handleOnChangeChecked = (editionCode: string) => {
    if (selectedValues.includes(editionCode)) {
      setSelectedValues((state) =>
        state.filter((value) => value !== editionCode),
      )
    } else {
      setSelectedValues([...selectedValues, editionCode])
    }
  }
  const bookletsCanExport = props.bookletsProgress
    .filter(
      (bookletProgress) =>
        bookletProgress.matchedCount > 0 && bookletProgress.unusedCount > 0,
    )
    .map((bookletProgress) => bookletProgress.masterEditionCode.code)
  const handleOnChangeAllChecked = () => {
    if (bookletsCanExport.length === selectedValues.length) {
      setSelectedValues([])
    } else {
      setSelectedValues(bookletsCanExport)
    }
  }
  const handleOnClickLocked = (id: number, value: boolean) => {
    props.onUpdateLockedBookletsProgress(id, value)
  }
  const downloadAfterWordData = (projectId: number, editionCode: string) => {
    props.downloadAfterWordData(projectId, editionCode)
  }

  return (
    <div>
      <div className='mt-[14px] flex h-[38px] items-center justify-between pl-[7px]'>
        <MuiFormControlLabel
          control={
            <MuiCheckbox
              size='small'
              checked={
                props.bookletsProgress.length > 0 &&
                bookletsCanExport.length > 0 &&
                bookletsCanExport.length === selectedValues.length
              }
              onChange={handleOnChangeAllChecked}
            />
          }
          label={
            <div className='text-sm text-content-default-primary'>
              全てチェック
            </div>
          }
        />
        <ProjectCSVOutputModal
          projectId={props.project.id}
          media={props.project.mediaType.name}
          year={props.project.issueYear}
          month={props.project.issueMonth}
          selectedPlates={selectedValues}
          disabled={selectedValues.length === 0}
        />
      </div>
      <div className='mt-3 w-full overflow-x-auto bg-white-0'>
        <table className='w-full min-w-max border border-divider-accent-secondary'>
          <thead>
            <tr className='h-[30px] border-b border-divider-accent-secondary bg-theme-yk-primary text-xs text-content-default-primary'>
              <th
                rowSpan={2}
                className='min-w-[50px] border-r border-b border-divider-accent-secondary p-0 font-medium'
              >
                選択
              </th>
              <th
                rowSpan={2}
                className='min-w-[80px] border-r border-b border-divider-accent-secondary p-0 font-medium'
              >
                版名
              </th>
              <th
                colSpan={5}
                className='border-r border-divider-accent-secondary p-0 font-medium'
              >
                進捗
              </th>
              <th
                rowSpan={2}
                className='min-w-[120px] border-b border-r border-divider-accent-secondary p-0 font-medium'
              >
                マッチングOK
              </th>
              <th
                rowSpan={2}
                className='min-w-[80px] border-b border-r border-divider-accent-secondary p-0 font-medium'
              >
                不要原稿
              </th>
              <th
                rowSpan={2}
                className='min-w-[100px] border-b border-r border-divider-accent-secondary p-0 font-medium'
              >
                エントリ本数
              </th>
              <th
                rowSpan={2}
                className='min-w-[100px] border-b border-r border-divider-accent-secondary p-0 font-medium'
              >
                下書き原稿数
              </th>
              <th
                rowSpan={2}
                className='min-w-[160px] border-b border-r border-divider-accent-secondary p-0 font-medium'
              >
                入稿ロック
              </th>
              <th
                colSpan={2}
                className='border-r border-divider-accent-secondary p-0 font-medium'
              >
                書き出し
              </th>
            </tr>
            <tr className='h-[30px] bg-container-main-senary text-xs text-content-default-primary'>
              <th className='min-w-[100px] border-b border-r border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                未着手
              </th>
              <th className='min-w-[100px] border-r border-b border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                制作中
              </th>
              <th className='min-w-[100px] border-r border-b border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                入稿確認中
              </th>
              <th className='min-w-[100px] border-r border-b border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                差し戻し
              </th>
              <th className='min-w-[100px] border-r border-b border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                校了済
              </th>
              <th className='min-w-[160px] border-b border-r border-divider-accent-secondary p-0 text-theme-yk-sennary'>
                組板
              </th>
              <th className='min-w-[120px] border-b border-r border-divider-accent-secondary px-4 py-0 text-theme-yk-sennary'>
                巻末掲載宿
              </th>
            </tr>
          </thead>
          <tbody>
            {props.bookletsProgress.map((bookletProgress, i) => (
              <tr
                className='text-center text-xs font-medium even:bg-container-main-quaternary'
                key={bookletProgress.masterEditionCode.name}
              >
                <td className='border-r border-b border-divider-accent-secondary p-0 text-center'>
                  <div className='flex min-h-[47px] items-center justify-center'>
                    <MuiCheckbox
                      value={bookletProgress.masterEditionCode.code}
                      size='small'
                      disabled={
                        bookletProgress.unusedCount === 0 &&
                        bookletProgress.matchedCount === 0
                      }
                      checked={selectedValues.includes(
                        bookletProgress.masterEditionCode.code,
                      )}
                      onChange={(event) =>
                        handleOnChangeChecked(event.target.value)
                      }
                    />
                  </div>
                </td>
                <td className='break-all border-r border-b border-divider-accent-secondary px-2 py-0'>
                  {bookletProgress.masterEditionCode.name}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.notStart === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "NOT_START",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.notStart}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.makingCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "MAKING",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.makingCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.checkingCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "CHECKING",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.checkingCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.sendBackCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "SEND_BACK",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.sendBackCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.proofreadingCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "PROOFREADING",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.proofreadingCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.matchedCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "MATCHED",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.matchedCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.unusedCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "UNUSED",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.unusedCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.entryCount}本
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.myStockCount === 0 ? (
                    "0本"
                  ) : (
                    <MuiLink
                      component='button'
                      underline='none'
                      onClick={() =>
                        props.onClickManuscriptLink(
                          bookletProgress.masterEditionCode.code,
                          "MYSTOCK",
                        )
                      }
                    >
                      <div className='text-container-active-primary underline'>
                        {bookletProgress.myStockCount}本
                      </div>
                    </MuiLink>
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.isEndProofreading ? (
                    <BaseButtonIconText
                      icon='lock'
                      text={
                        bookletProgress.locked ? "入稿ロック解除" : "入稿ロック"
                      }
                      onClick={() =>
                        handleOnClickLocked(
                          bookletProgress.id,
                          !bookletProgress.locked,
                        )
                      }
                    />
                  ) : (
                    "未校了"
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.isEndProofreading ? (
                    <BaseButtonIconText
                      icon='auto_stories'
                      text='ページ一括組版'
                      disabled={!bookletProgress.locked}
                      onClick={() => {
                        downloadFileFromUrl(
                          "/assets/dummy/dummy-pdf.pdf",
                          "dummy",
                        )
                      }}
                    />
                  ) : (
                    "未校了"
                  )}
                </td>
                <td className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                  {bookletProgress.isEndProofreading ? (
                    props.outputProgressStatus === "work" ? (
                      <MuiLoadingButton
                        variant='contained'
                        sx={{ width: 104 }}
                        disabled={true}
                        onClick={() => {}}
                        loading={true}
                      >
                        確定
                      </MuiLoadingButton>
                    ) : (
                      <BaseButtonIconText
                        icon='output'
                        text='出力'
                        disabled={!bookletProgress.locked}
                        onClick={() => {
                          downloadAfterWordData(
                            bookletProgress.projectId,
                            bookletProgress.masterEditionCode.code,
                          )
                        }}
                      />
                    )
                  ) : (
                    "未校了"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className='h-[50px] text-center text-xs font-medium'>
              <th
                className='border-r border-b border-divider-accent-secondary px-4 py-0 font-bold'
                colSpan={2}
              >
                全て
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.notStart}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.makingCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.checkingCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.sendBackCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.proofreadingCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.matchedCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.unusedCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.entryCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.myStockCount}本
              </th>
              <th className='border-r border-b border-divider-accent-secondary px-4 py-0'>
                {statusCount.locked}本
              </th>
              <th
                className='border-r border-b border-divider-accent-secondary px-4 py-0'
                colSpan={2}
              ></th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default ProjectStatusTable
