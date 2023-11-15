import { useState } from "react"
import dayjs from "dayjs"
import MuiButton from "@mui/material/Button"
import BaseModal from "@/components/base/overlay/BaseModal"
import ProjectNewProjectMedia from "@/components/domain/project/ProjectNewProjectModal/ProjectNewProjectMedia"
import ProjectNewProjectPeriod from "@/components/domain/project/ProjectNewProjectModal/ProjectNewProjectPeriod"
import ProjectNewProjectComplete from "@/components/domain/project/ProjectNewProjectModal/ProjectNewProjectComplete"
import ProjectNewSettingPlateModal from "./ProjectNewProjectPlate"
import {
  CreateProjectWithEditionCodeDto,
  CreateProjectWithEditionCodeDtoConsumptionTaxEnum,
} from "@/openapi/api"
import { useApiClient } from "@/hooks/useApiClient"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"
import { useShowAlertMessage } from "../../global/AlertMessageProvider"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
type DisplayStatus = "media" | "period" | "plate" | "complete"

type Props = {
  onCreate: Function
}

export const enumMedia = {
  magazine: "ゆこゆこ本誌",
  test: "テスト",
}

const ProjectNewProjectModal = (props: Props) => {
  const apiClient = useApiClient()
  const [shown, setShown] = useState<boolean>(false)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("media")
  const [mediaType, setMediaType] = useState<"MAGAZINE" | "TEST">("MAGAZINE")
  const [year, setYear] = useState<number>(2023)
  const [month, setMonth] = useState<number>(12)
  const [startSales, setStartSales] = useState<string>(null)
  const [finishSales, setFinishSales] = useState<string>(null)
  const [startReview, setStartReview] = useState<string>(null)
  const [finishReview, setFinishReview] = useState<string>(null)
  const [taxIncluded, setTaxIncluded] =
    useState<CreateProjectWithEditionCodeDtoConsumptionTaxEnum>(
      CreateProjectWithEditionCodeDtoConsumptionTaxEnum.Included,
    )
  const [tax, setTax] = useState(1.1)
  const [plates, setPlates] = useState<
    CreateProjectWithEditionCodeDto["editionCodes"]
  >([])

  const { showAlertMessage } = useShowAlertMessage()

  const handleOnClickNext = ({ mediaType, year, month }) => {
    setMediaType(mediaType)
    setYear(year)
    setMonth(month)
    setDisplayStatus("period")
  }
  const handleOnClickNextPlateSelect = ({
    startSales,
    finishSales,
    startReview,
    finishReview,
    taxIncluded,
    tax,
  }) => {
    setStartSales(startSales)
    setFinishSales(finishSales)
    setStartReview(startReview)
    setFinishReview(finishReview)
    setTaxIncluded(taxIncluded)
    setTax(tax)
    setDisplayStatus("plate")
  }
  const handleOnExact = async (
    plates: CreateProjectWithEditionCodeDto["editionCodes"],
  ) => {
    try {
      let result = await apiClient.projectsApiFactory.projectControllerCreate({
        mediaTypeCode: mediaType,
        issueYear: year,
        issueMonth: month,
        salesStartDate: dayjs.tz(startSales, "UTC").format("YYYY/MM/DD"),
        salesEndDate: dayjs.tz(finishSales).format("YYYY/MM/DD"),
        reviewRatingStartDate: dayjs
          .tz(startReview, "UTC")
          .format("YYYY/MM/DD"),
        reviewRatingEndDate: dayjs.tz(finishReview, "UTC").format("YYYY/MM/DD"),
        editionCodes: plates,
        consumptionTax: taxIncluded,
        tax: tax,
      })
      if (result.data && !result.data.error) {
        setPlates(plates)
        setDisplayStatus("complete")
        props.onCreate()
      } else {
        showAlertMessage("error", result.data.error || "Something went wrong. ")
      }
    } catch (error) {
      showAlertMessage("error", error?.message || "Something went wrong. ")
    }
  }
  const handleOnClickOpen = () => {
    setDisplayStatus("media")
    setPlates([])
    setShown(true)
  }
  const handleOnClose = () => setShown(false)
  return (
    <div>
      <RenderWithRoles roles={[RolesMock.admin, RolesMock.operator]}>
        <MuiButton variant='contained' onClick={handleOnClickOpen}>
          新規プロジェクト登録
        </MuiButton>
      </RenderWithRoles>
      <BaseModal shown={shown} onClickClose={handleOnClose}>
        {displayStatus === "media" && (
          <ProjectNewProjectMedia
            onNext={handleOnClickNext}
            onClose={handleOnClose}
          />
        )}
        {displayStatus === "period" && (
          <ProjectNewProjectPeriod
            onExact={handleOnClickNextPlateSelect}
            onClose={handleOnClose}
          />
        )}
        {displayStatus === "plate" && (
          <ProjectNewSettingPlateModal
            onExact={handleOnExact}
            onClose={handleOnClose}
          />
        )}
        {displayStatus === "complete" && (
          <ProjectNewProjectComplete
            mediaType={mediaType}
            year={year}
            month={month}
            startSales={startSales}
            finishSales={finishSales}
            startReview={startReview}
            finishReview={finishReview}
            plates={plates}
            onClose={handleOnClose}
          />
        )}
      </BaseModal>
    </div>
  )
}

export default ProjectNewProjectModal
