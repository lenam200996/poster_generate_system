import { useState, useMemo, useEffect } from "react"
import { outDataFormats } from "@/config/api/mock/projects"
import MuiLinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress"
import MuiBox from "@mui/material/Box"
import MuiPaper from "@mui/material/Paper"
import MuiButton from "@mui/material/Button"
import MuiTypography from "@mui/material/Typography"
import MuiFormControl from "@mui/material/FormControl"
import MuiSelect, { SelectProps } from "@mui/material/Select"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiDivider from "@mui/material/Divider"
import ProjectlistManagementStatusLabel from "@/components/page/projectlist/management/ProjectlistManagementStatusLabel"
import downloadFileFromUrl from "@/util/downloadFileFromUrl"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import filterCopies from "@/util/filterCopies"
import {
  ProjectWithXlsFilesResponseDto,
  ProjectsWithImagesResponseDto,
} from "@/openapi/api"
import { currentRolesMock, RolesMock } from "@/config/api/mock/users"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"

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

const MenuProps: SelectProps["MenuProps"] = {
  PaperProps: {
    style: {
      minWidth: 295,
    },
  },
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
}

type OutputPageType =
  | "INDEX_DATA"
  | "DAIWARI_HOJO_DATA"
  | "PAGE_KUMIHAN"
  | "KANMATSU_KEISAIYADO"
  | "DAIWARI"

export type EditionType =
  | "HOKKAIDO"
  | "TOUHOKU"
  | "JOSHINETSU"
  | "KITA_KANTO"
  | "KANTO"
  | "TOKAI"
  | "KANSAI"
  | "HOKURIKU"
  | "CHUGOKU_SHIKOKU"
  | "KYUSHU"
  | "KANSAI_HOKURIKU"
  | "TOUKAI_HOKURIKU"
  | "TEST"

interface Props {
  project: ProjectsWithImagesResponseDto
  activeIndexData: boolean
}

const ProjectOutput = (props: Props) => {
  const apiClient = useApiClient()
  const [outputDataType, setOutputDataType] = useState<OutputPageType | "">("")
  const [selectedPlate, setSelectedPlate] = useState<EditionType | "" | "ALL">(
    "",
  )
  const [outputProgress, setProgress] = useState(0)
  const [outputProgressStatus, setProgressStatus] = useState<Progress>("wait")
  const { showAlertMessage } = useShowAlertMessage()
  const [outputFile, setOutputFile] = useState<{
    downloadLink: string
    fileName: string
  }>(null)
  const [timerId, setTimerId] = useState<NodeJS.Timeout>(undefined)
  const [completedDownload, setCompletedDownload] = useState(false)

  const handleOnChangeOutputFormat = (value: OutputPageType) => {
    setOutputDataType(value)
    setSelectedPlate("")
  }

  const [outputDataName, setOutputDataName] = useState("")
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
              setOutputFile({
                downloadLink: response.data.image,
                fileName: generateFileNameFromPath(response.data.image),
              })
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

  const handleOnClickOutput = async () => {
    const params = {
      projectId: props.project.id,
      editionCode: selectedPlate as unknown as EditionType | "ALL",
    }
    try {
      if (
        outputDataType != "" &&
        ["DAIWARI_HOJO_DATA", "INDEX_DATA", "KANMATSU_KEISAIYADO"].includes(
          outputDataType,
        )
      ) {
        if (params.editionCode === "ALL") {
          const { data } =
            await apiClient.exportsApi.exportsControllerExportDraftAssistance(
              params.projectId,
              undefined,
              outputDataType,
            )
          exportProgress({ id: data.id })
        } else {
          const { data } =
            await apiClient.exportsApi.exportsControllerExportDraftAssistance(
              params.projectId,
              params.editionCode,
              outputDataType,
            )
          exportProgress({ id: data.id })
        }
      } else {
        const { data } =
          await apiClient.exportsApi.exportsControllerExportDraftPages(
            params.projectId,
          )
        exportProgress({ id: data.id })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleOnClickDownload = () => {
    downloadFileFromUrl(outputFile.downloadLink, outputFile.fileName)
    setCompletedDownload(true)
  }

  const handleOnClickResetDownload = () => {
    setOutputDataType("")
    setProgressStatus("wait")
    setProgress(0)
    setOutputFile(null)
    setCompletedDownload(false)
  }

  useEffect(() => {
    const selectedOutputDataType = outDataFormats.find(
      ({ value }) => value === outputDataType,
    )
    const outputDataName = selectedOutputDataType
      ? selectedOutputDataType.label
      : "データ"
    setOutputDataName(outputDataName)
    if (outputProgressStatus === "work" && outputProgress === 0) {
      showAlertMessage("info", `${outputDataName}の出力を開始しました`)
    } else if (outputProgressStatus === "done") {
      showAlertMessage("success", `${outputDataName}の出力に成功しました`)
    }
  }, [outputDataType, outputProgress, outputProgressStatus, showAlertMessage])

  const plateOptions = useMemo(() => {
    const plates = filterCopies(
      props.project.booklets.map((booklet) => booklet.masterEditionCode.code),
    )
    return plates.map((option) => (
      <MuiMenuItem key={option.value} value={option.value}>
        <div className='text-sm text-content-default-primary'>
          {option.label}
        </div>
      </MuiMenuItem>
    ))
  }, [props.project, selectedPlate]) // eslint-disable-line

  const isOutputButtonDisabled = useMemo(() => {
    if (!props.activeIndexData && outputDataType === "INDEX_DATA") return true
    if (
      outputDataType === "KANMATSU_KEISAIYADO" &&
      !props.project.allDocumentProofreading &&
      props.project.booklets.filter((bk) => bk.locked === true).length == 0
    )
      return true
    const availableRoles = [
      RolesMock.admin,
      RolesMock.operator,
      RolesMock.manuscriptOperator,
    ]
    const hasAvailableRole = availableRoles.some((role) =>
      currentRolesMock.includes(role),
    )

    return (
      outputDataType === "" ||
      ([
        "INDEX_DATA",
        "DAIWARI_HOJO_DATA",
        "PAGE_KUMIHAN",
        "KANMATSU_KEISAIYADO",
      ].includes(outputDataType) &&
        selectedPlate.length === 0) ||
      !hasAvailableRole
    )
  }, [outputDataType, selectedPlate])

  return (
    <div>
      <MuiDivider textAlign='left'>
        <div className='text-sm'>出力</div>
      </MuiDivider>
      <div className='mt-[22px]'>
        <MuiPaper elevation={0}>
          <div className='py-10 pl-[84px] pr-10'>
            <div className='flex items-start'>
              <p className='flex h-[30px] w-36 items-center text-sm font-bold text-content-default-primary'>
                出力データ形式
              </p>
              <div>
                <div className='flex items-center'>
                  {outputProgressStatus === "wait" && (
                    <>
                      <MuiFormControl sx={{ minWidth: 91 }}>
                        <MuiSelect
                          size='small'
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          defaultValue=''
                          value={outputDataType}
                          MenuProps={MenuProps}
                          onChange={(event) =>
                            handleOnChangeOutputFormat(
                              event.target.value as OutputPageType,
                            )
                          }
                        >
                          <MuiMenuItem value=''>
                            <div className='text-sm text-content-default-primary'>
                              選択
                            </div>
                          </MuiMenuItem>
                          {Options}
                        </MuiSelect>
                      </MuiFormControl>
                      {[
                        "INDEX_DATA",
                        "DAIWARI_HOJO_DATA",
                        "PAGE_KUMIHAN",
                        "KANMATSU_KEISAIYADO",
                      ].includes(outputDataType) && (
                        <div className='ml-11'>
                          <MuiFormControl sx={{ minWidth: 74 }}>
                            <MuiSelect
                              displayEmpty
                              size='small'
                              inputProps={{ "aria-label": "Without label" }}
                              value={selectedPlate}
                              defaultValue=''
                              onChange={(event) =>
                                setSelectedPlate(
                                  event.target.value as EditionType,
                                )
                              }
                            >
                              <MuiMenuItem value=''>
                                <div className='text-sm text-content-default-primary'>
                                  選択
                                </div>
                              </MuiMenuItem>
                              <MuiMenuItem value='ALL'>
                                <div className='text-sm text-content-default-primary'>
                                  全ての版
                                </div>
                              </MuiMenuItem>
                              {plateOptions}
                            </MuiSelect>
                          </MuiFormControl>
                        </div>
                      )}
                      <div className='ml-11'>
                        <MuiButton
                          variant='contained'
                          size='small'
                          disabled={isOutputButtonDisabled}
                          sx={{ minWidth: 104 }}
                          onClick={handleOnClickOutput}
                        >
                          書き出し
                        </MuiButton>
                      </div>
                    </>
                  )}
                  {outputProgressStatus === "work" && (
                    <>
                      <MuiButton
                        variant='outlined'
                        color='inherit'
                        size='small'
                        sx={{ minWidth: 104 }}
                        onClick={() => {
                          setProgressStatus("wait")
                          setProgress(0)
                          clearInterval(timerId)
                          showAlertMessage(
                            "info",
                            `${outputDataName}の書き出しを中止しました`,
                          )
                        }}
                      >
                        キャンセル
                      </MuiButton>
                      <div className='ml-11'>
                        <MuiBox sx={{ width: 200 }}>
                          <LinearProgressWithLabel
                            value={outputProgress}
                            color={outputProgress === 0 ? "inherit" : "primary"}
                          />
                        </MuiBox>
                      </div>
                      <div className='ml-[107px]'>
                        <ProjectlistManagementStatusLabel
                          status={outputProgressStatus}
                        />
                      </div>
                    </>
                  )}
                  {outputProgressStatus === "done" && (
                    <>
                      <MuiButton
                        variant='contained'
                        size='small'
                        sx={{ minWidth: 104 }}
                        onClick={handleOnClickDownload}
                      >
                        ダウンロード
                      </MuiButton>
                      <div className='ml-11 w-[200px] text-sm font-bold text-content-default-primary'>
                        {outputFile.fileName}
                      </div>
                      <div className='ml-[107px]'>
                        <ProjectlistManagementStatusLabel
                          status={outputProgressStatus}
                        />
                      </div>
                    </>
                  )}
                </div>
                {outputProgressStatus === "done" && (
                  <div className='mt-6'>
                    <MuiButton
                      variant='contained'
                      size='small'
                      sx={{ minWidth: 104 }}
                      disabled={!completedDownload}
                      onClick={handleOnClickResetDownload}
                    >
                      再選択
                    </MuiButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </MuiPaper>
      </div>
    </div>
  )
}

export default ProjectOutput
