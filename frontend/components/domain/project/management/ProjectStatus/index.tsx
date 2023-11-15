import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import ProjectManuscriptTable from "@/components/domain/project/management/ProjectManuscriptTable"
import ProjectStatusTable from "@/components/domain/project/management/ProjectStatusTable"
import { useApiClient } from "@/hooks/useApiClient"
import { useRecoilState } from "recoil"
import { projectManagementDocuments } from "@/atoms/projectManagement"
import {
  BookletProgressAggregationDto,
  UpdateManyDocumentStatusDtoStatusCodeEnum,
  ProjectWithXlsFilesResponseDto,
} from "@/openapi/api"
import { CircularProgress } from "@mui/material"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"

interface Props {
  projectId: number
  project: ProjectWithXlsFilesResponseDto
  updateLock: (value: boolean, bookletId: number) => void
}
type Progress = "wait" | "work" | "done" | "error"
const ProjectStatus = (props: Props) => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [bookletsProgress, setBookletsProgress] = useState<
    BookletProgressAggregationDto[]
  >([])
  const [documents, setDocuments] = useRecoilState(projectManagementDocuments)
  const [loading, setLoading] = useState<boolean>(false)
  const [outputProgress, setProgress] = useState(0)
  const [outputProgressStatus, setProgressStatus] = useState<Progress>("wait")
  const [timerId, setTimerId] = useState<NodeJS.Timeout>(undefined)

  const { id, plate, status } = router.query
  const exportProgress = ({ id }: { id: number }) => {
    const timerId = setInterval(async () => {
      setTimerId(timerId)
      await apiClient.exportsApi
        .exportsControllerGetProgress(id)
        .then((response) => {
          switch (response.data.status) {
            case "PROGRESS":
              setProgress(response.data.progress)
              setProgressStatus("work")
              break
            case "ERROR":
              setProgressStatus("error")
              clearInterval(timerId)
              break
            case "CANCEL":
              setProgressStatus("error")
              clearInterval(timerId)
              break
            case "COMPLETE":
              setProgressStatus("done")
              // down link
              downloadFileFromUrl(
                response.data.image,
                generateFileNameFromPath(response.data.image),
              )
              clearInterval(timerId)
              break
            default:
              break
          }
        })
        .catch((error) => {
          clearInterval(timerId)
          console.error(error)
        })
    }, 1000)
  }
  const downloadAfterWordData = async (
    projectId: number,
    editionCode: string,
  ) => {
    const { data } =
      await apiClient.exportsApi.exportsControllerExportDraftAssistance(
        projectId,
        editionCode as any,
        "KANMATSU_KEISAIYADO",
      )
    exportProgress({ id: data.id })
  }
  const onUpdateLockedBookletsProgress = (id: number, value: boolean) => {
    apiClient.bookletApiFactory
      .bookletControllerUpdateLock({
        id: id,
        locked: value,
      })
      .then(() => {
        props.updateLock(value, id)
        setBookletsProgress((prev) =>
          prev.map((bpr) => {
            if (bpr.id === id) bpr.locked = value
            return bpr
          }),
        )
      })
  }
  useEffect(() => {
    if (plate !== undefined && status !== undefined) return
    ;(async () => {
      try {
        setLoading(true)
        const response =
          await apiClient.bookletApiFactory.bookletControllerProgressAggregation(
            props.projectId,
          )
        setBookletsProgress(response.data)
      } catch (error: any) {
        console.log("error: ", error)
      }
      setLoading(false)
    })()
  }, [router.query]) // eslint-disable-line

  useEffect(() => {
    if (plate === undefined && status === undefined) return
    ;(async () => {
      const params = {
        take: undefined,
        skip: undefined,
        projectId: Number(id),
        statusCodes: [status],
        mediaTypeCodes: undefined,
        editionCodes: [plate],
        issueYearMonth: undefined,
        hotelCode: undefined,
        hotelName: undefined,
        documentSizeCode: undefined,
        manuscriptPersonCognito: undefined,
        salesPersonCognito: undefined,
        documentCode: undefined,
        documentModifiedAtFrom: undefined,
        documentModifiedAtTo: undefined,
      }
      if (status === "MATCHED" || status === "UNUSED" || status === "MYSTOCK") {
        try {
          setLoading(true)
          const take = 99999
          const skip = 0
          const response =
            await apiClient.bookletApiFactory.bookletControllerProgressAggregation(
              props.projectId,
              take,
              skip,
            )
          const booklet = response.data.find(
            (booklet) => booklet.masterEditionCode.code === plate,
          )
          if (!booklet) {
            throw new Error("booklet not found")
          }
          if (status === "UNUSED") {
            setDocuments(booklet.unusedDocuments)
          } else if (status === "MYSTOCK") {
            setDocuments(booklet.myStockDocuments)
          } else {
            setDocuments(booklet.matchedDocuments)
          }
        } catch (error: any) {
          console.log("error: ", error)
        }
      } else {
        try {
          setLoading(true)
          const response =
            await apiClient.documentsApiFactory.documentControllerSearch(
              params.take,
              params.skip,
              params.projectId,
              params.statusCodes,
              params.mediaTypeCodes,
              params.editionCodes,
              params.issueYearMonth,
              params.hotelCode,
              params.hotelName,
              params.documentSizeCode,
              params.manuscriptPersonCognito,
              params.salesPersonCognito,
              params.documentCode,
              params.documentModifiedAtFrom,
              params.documentModifiedAtTo,
            )
          setDocuments(response.data.data)
        } catch (error: any) {
          console.log("error: ", error)
        }
      }
      setLoading(false)
    })()
  }, [plate, status]) // eslint-disable-line

  if (loading) {
    return <CircularProgress />
  }
  return (
    <>
      {plate && status ? (
        <ProjectManuscriptTable
          documents={documents}
          searchStatus={
            status as
              | UpdateManyDocumentStatusDtoStatusCodeEnum
              | "UNUSED"
              | "MYSTOCK"
              | "MATCHED"
          }
          searchPlate={plate as string}
        />
      ) : (
        <ProjectStatusTable
          project={props.project}
          bookletsProgress={bookletsProgress}
          onUpdateLockedBookletsProgress={onUpdateLockedBookletsProgress}
          downloadAfterWordData={downloadAfterWordData}
          outputProgressStatus={outputProgressStatus}
          onClickManuscriptLink={(plate, status) =>
            router.push({
              pathname: "/management/[id]",
              query: { id: props.projectId, plate, status },
            })
          }
        />
      )}
    </>
  )
}

export default ProjectStatus
