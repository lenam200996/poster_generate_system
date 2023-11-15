import { useState, useEffect } from "react"
import { outDataFormats } from "@/config/api/mock/projects"
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress"
import MuiBox from "@mui/material/Box"
import MuiPaper from "@mui/material/Paper"
import MuiButton from "@mui/material/Button"
import MuiTypography from "@mui/material/Typography"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiDivider from "@mui/material/Divider"
import MuiLink from "@mui/material/Link"
import ProjectlistManagementImportModal from "@/components/page/projectlist/management/ProjectlistManagementImportModal"
import ProjectlistManagementStatusLabel from "@/components/page/projectlist/management/ProjectlistManagementStatusLabel"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import errorMessage from "@/config/errorMessage"
import {
  ProjectWithXlsFilesResponseDto,
  ProjectsWithImagesResponseDto,
} from "@/openapi/api"
import { currentRolesMock, RolesMock } from "@/config/api/mock/users"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import { useCostomEffect } from "@/hooks/useCustomEffect"

type Progress = "wait" | "work" | "done" | "error"

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number | undefined },
) {
  return (
    <MuiBox sx={{ display: "flex", alignItems: "center" }}>
      <MuiBox sx={{ width: "100%", mr: 1 }}>
        <MuiLinearProgress variant='determinate' {...props} />
      </MuiBox>
      <MuiBox sx={{ minWidth: 35 }}>
        <MuiTypography
          variant='body2'
          color='text.secondary'
          align='right'
        >{`${Math.round(props.value)}%`}</MuiTypography>
      </MuiBox>
    </MuiBox>
  )
}

interface Props {
  project: ProjectsWithImagesResponseDto
  onProjectChange: () => void
  onChangeImportStatus?: (value: boolean) => void
}

const ProjectImport = (props: Props) => {
  const apiClient = useApiClient()
  const [progress1, setProgress1] = useState(0)
  const [progress1Status, setProgress1Status] = useState<Progress>("wait")
  const [progress1File, setProgress1File] = useState<{
    downloadLink: string
    fileName: string
  }>(null)
  const [progress1TimerId, setProgress1TimerId] =
    useState<NodeJS.Timeout>(undefined)

  const [progress2, setProgress2] = useState(0)
  const [progress2Status, setProgress2Status] = useState<Progress>("wait")
  const [progress2File, setProgress2File] = useState<{
    downloadLink: string
    fileName: string
  }>(null)
  const [progress2TimerId, setProgress2TimerId] =
    useState<NodeJS.Timeout>(undefined)

  const [errors, setErrors] = useState(null)
  const { showAlertMessage } = useShowAlertMessage()
  const localStorageEntryFileId = "entryFileId"
  const localStorageDaiwariFileId = "daiwariFileId"

  const Options = outDataFormats
    .filter(
      (option) =>
        !(
          currentRolesMock.includes(RolesMock.manuscriptOperator) &&
          option.value === "PAGE_KUMIHAN"
        ),
    )
    .map((option) => (
      <MuiMenuItem key={option.value} value={option.value}>
        <div className='text-sm text-content-default-primary'>
          {option.label}
        </div>
      </MuiMenuItem>
    ))

  const handleOnClickImportLink = ({
    downloadLink,
    fileName,
  }: {
    downloadLink: string
    fileName: string
  }) => {
    downloadFileFromUrl(downloadLink, fileName)
  }

  const importProgress = async ({
    fileId,
    importTarget,
  }: {
    fileId: number
    importTarget: "entry" | "daiwari"
  }) => {
    const isEntry = importTarget === "entry"
    if (isEntry) {
      setProgress1Status("wait")
    } else {
      setProgress2Status("wait")
    }
    const timerId = setInterval(async () => {
      if (isEntry) {
        setProgress1TimerId(timerId)
        await apiClient.importsApi
          .importControllerGetEntryProgress(fileId)
          .then(({ data }) => {
            switch (data.status) {
              case "PROGRESS":
                setProgress1(data.progress)
                setProgress1Status("work")
                break
              case "ERROR":
                setErrors({ entryFormatError: data.message })
                setProgress1Status("error")
                clearInterval(timerId)
                localStorage.removeItem(localStorageEntryFileId)
                break
              case "CANCEL":
                setProgress1Status("wait")
                setProgress1(0)
                clearInterval(timerId)
                localStorage.removeItem(localStorageEntryFileId)
                break
              case "COMPLETE":
                setProgress1Status("done")
                setProgress1File({
                  downloadLink: data.image,
                  fileName: generateFileNameFromPath(data.image),
                })
                showAlertMessage(
                  "success",
                  "エントリーのインポートに成功しました",
                )
                clearInterval(timerId)
                localStorage.removeItem(localStorageEntryFileId)
                props.onProjectChange()
                break
              default:
                break
            }
          })
          .catch((error) => {
            clearInterval(timerId)
            console.error(error)
          })
      } else {
        setProgress2TimerId(timerId)
        await apiClient.importsApi
          .importControllerGetProgress(fileId)
          .then(({ data }) => {
            switch (data.status) {
              case "PROGRESS":
                setProgress2(data.progress)
                setProgress2Status("work")
                break
              case "ERROR":
                setErrors({ flatplainFormatError: data.message })
                setProgress2Status("error")
                clearInterval(timerId)
                localStorage.removeItem(localStorageDaiwariFileId)
                break
              case "CANCEL":
                setProgress2Status("wait")
                setProgress1(0)
                clearInterval(timerId)
                localStorage.removeItem(localStorageDaiwariFileId)
                break
              case "COMPLETE":
                setProgress2Status("done")
                setProgress2File({
                  downloadLink: data.image,
                  fileName: generateFileNameFromPath(data.image),
                })
                showAlertMessage("success", "台割のインポートに成功しました")
                clearInterval(timerId)
                localStorage.removeItem(localStorageDaiwariFileId)
                break
              default:
                break
            }
          })
          .catch((error) => {
            clearInterval(timerId)
            console.error(error)
          })
      }
    }, 1000)
  }

  const handleOnChangeEntryFile = async (file: File) => {
    try {
      const params = {
        id: props.project.id,
        file,
      }
      const { data } = await apiClient.importsApi.importControllerEntryImport(
        params.id,
        params.file,
      )

      showAlertMessage("info", "エントリーのインポートを開始しました")
      // @ts-ignore
      const entryFileId = data.id
      importProgress({ fileId: entryFileId, importTarget: "entry" })
      localStorage.setItem(localStorageEntryFileId, JSON.stringify(entryFileId))
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClickEntryFileCancel = async () => {
    if (progress1Status !== "work") return
    try {
      const entryFileId = Number(localStorage.getItem(localStorageEntryFileId))
      await apiClient.importsApi.importControllerEntryTaskCancel(entryFileId)
      clearInterval(progress1TimerId)
      localStorage.removeItem(localStorageEntryFileId)
      setProgress1Status("wait")
      setProgress1(0)
      showAlertMessage("info", "エントリーのインポートを中止しました")
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnChangeDraftFile = async (file: File) => {
    try {
      const params = {
        id: props.project.id,
        file,
      }
      const { data } = await apiClient.importsApi.importControllerDraftImport(
        params.id,
        params.file,
      )

      showAlertMessage("info", "台割のインポートを開始しました")

      // @ts-ignore
      const daiwariFileId = data.id
      localStorage.setItem(
        localStorageDaiwariFileId,
        JSON.stringify(daiwariFileId),
      )
      importProgress({ fileId: daiwariFileId, importTarget: "daiwari" })
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClickDaiwariFileCancel = async () => {
    if (progress2Status !== "work") return
    try {
      const daiwariFileId = Number(
        localStorage.getItem(localStorageDaiwariFileId),
      )
      await apiClient.importsApi.importControllerDraftTaskCancel(daiwariFileId)
      localStorage.removeItem(localStorageDaiwariFileId)
      clearInterval(progress2TimerId)
      setProgress2Status("wait")
      setProgress2(0)
      showAlertMessage("info", "台割のインポートを中止しました")
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    props.onChangeImportStatus &&
      props.onChangeImportStatus(
        progress1Status === "done" && progress2Status === "done",
      )
  }, [progress1Status, progress2Status])

  useCostomEffect(() => {
    const entryFileId = Number(localStorage.getItem(localStorageEntryFileId))
    if (!entryFileId) return
    importProgress({ fileId: entryFileId, importTarget: "entry" })
  }, [])

  useCostomEffect(() => {
    const daiwariFileId = Number(
      localStorage.getItem(localStorageDaiwariFileId),
    )
    if (!daiwariFileId) return
    importProgress({ fileId: daiwariFileId, importTarget: "daiwari" })
  }, [])

  useEffect(() => {
    if (progress1Status === "error") {
      if (errors?.entryFormatError) {
        showAlertMessage("error", errors.entryFormatError)
      } else {
        showAlertMessage("error", errorMessage.ENTRYSHEET_IMPORT_ERROR)
      }
    }
  }, [progress1Status]) // eslint-disable-line

  useEffect(() => {
    if (progress2Status === "error") {
      if (errors?.flatplainFormatError) {
        showAlertMessage("error", errors.flatplainFormatError)
      } else {
        showAlertMessage("error", errorMessage.FLATPLAN_IMPORT_ERROR)
      }
    }
  }, [progress2Status]) // eslint-disable-line

  useEffect(() => {
    const entryImportFile = props.project.xlsDocuments.entry
    if (!entryImportFile) return
    setProgress1Status("done")
    setProgress1File({
      downloadLink: entryImportFile.image,
      fileName: generateFileNameFromPath(entryImportFile.image),
    })
  }, [props.project.xlsDocuments.entry])

  useEffect(() => {
    const draftImportFile = props.project.xlsDocuments.draft
    if (!draftImportFile) return
    setProgress2Status("done")
    setProgress2File({
      downloadLink: draftImportFile.image,
      fileName: generateFileNameFromPath(draftImportFile.image),
    })
  }, [props.project.xlsDocuments.draft])

  return (
    <div className='pt-8'>
      <MuiDivider textAlign='left'>
        <div className='text-sm'>入力</div>
      </MuiDivider>
      <div className='mt-[26px]'>
        <MuiPaper elevation={0}>
          <div className='space-y-11 py-10 pl-[84px] pr-10'>
            <div className='flex items-center'>
              <p className='w-36 text-sm font-bold text-content-default-primary'>
                エントリー
              </p>
              {progress1Status === "work" ? (
                <MuiButton
                  variant='outlined'
                  color='inherit'
                  size='small'
                  sx={{ minWidth: 104 }}
                  onClick={handleOnClickEntryFileCancel}
                >
                  キャンセル
                </MuiButton>
              ) : (
                <ProjectlistManagementImportModal
                  type='entry'
                  onChange={handleOnChangeEntryFile}
                />
              )}
              <div className='ml-11 w-[200px]'>
                {progress1Status === "done" ? (
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      handleOnClickImportLink({
                        downloadLink: progress1File.downloadLink,
                        fileName: progress1File.fileName,
                      })
                    }
                  >
                    <div className='text-sm font-bold'>
                      {progress1File.fileName}
                    </div>
                  </MuiLink>
                ) : (
                  <MuiBox sx={{ width: 200 }}>
                    <LinearProgressWithLabel
                      value={progress1}
                      color={progress1 === 0 ? "inherit" : "primary"}
                    />
                  </MuiBox>
                )}
              </div>
              <div className='ml-[107px]'>
                <ProjectlistManagementStatusLabel status={progress1Status} />
              </div>
            </div>
            <div className='flex items-center'>
              <p className='w-36 text-sm font-bold text-content-default-primary'>
                台割
              </p>
              {progress2Status === "work" ? (
                <MuiButton
                  variant='outlined'
                  color='inherit'
                  size='small'
                  sx={{ minWidth: 104 }}
                  onClick={handleOnClickDaiwariFileCancel}
                >
                  キャンセル
                </MuiButton>
              ) : (
                <ProjectlistManagementImportModal
                  type='flatplain'
                  onChange={handleOnChangeDraftFile}
                />
              )}
              <div className='ml-11 w-[200px]'>
                {progress2Status === "done" ? (
                  <MuiLink
                    component='button'
                    underline='none'
                    onClick={() =>
                      handleOnClickImportLink({
                        downloadLink: progress2File.downloadLink,
                        fileName: progress2File.fileName,
                      })
                    }
                  >
                    <div className='text-sm font-bold'>
                      {progress2File.fileName}
                    </div>
                  </MuiLink>
                ) : (
                  <MuiBox sx={{ width: 200 }}>
                    <LinearProgressWithLabel
                      value={progress2}
                      color={progress2 === 0 ? "inherit" : "primary"}
                    />
                  </MuiBox>
                )}
              </div>
              <div className='ml-[107px]'>
                <ProjectlistManagementStatusLabel status={progress2Status} />
              </div>
            </div>
          </div>
        </MuiPaper>
      </div>
    </div>
  )
}

export default ProjectImport
