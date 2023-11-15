import { useState } from "react"
import BaseModal from "@/components/base/overlay/BaseModal"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ProjectDuplicateComplete from "./ProjectDuplicateComplete"
import ProjectDuplicateProject from "./ProjectDuplicateProject"
import ProjectDuplicateSalesPeriod from "./ProjectDuplicateSalesPeriod"
import { useApiClient } from "@/hooks/useApiClient"
import { MasterMediaTypePublicDto } from "@/openapi/api"
import { useShowAlertMessage } from "../../global/AlertMessageProvider"

type DisplayStatus = "project" | "period" | "complete"

interface Props {
  id: number
  mediaType: MasterMediaTypePublicDto
  year: number
  month: number
  onComplete: Function
}

const ProjectDuplicateModal = (props: Props) => {
  const apiClient = useApiClient()
  const [shown, setShown] = useState<boolean>(false)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("project")
  const [year, setYear] = useState<string>("")
  const [month, setMonth] = useState<string>("")
  const [apiLoading, setApiLoading] = useState(false)
  const [projectDestinationId, setProjectDestinationId] = useState(null)
  const { showAlertMessage } = useShowAlertMessage()
  const [loading, setLoading] = useState(false)

  const handleOnClickNextToSalesPeriod = (
    year: string,
    month: string,
    projectId: number,
  ) => {
    setYear(year)
    setMonth(month)
    setProjectDestinationId(projectId)
    // setDisplayStatus("period")
    handleOnClickDuplicateProject(projectId)
  }

  const handleOnClickDuplicateProject = async (
    // start, end
    projectId: string | number,
  ) => {
    try {
      setApiLoading(true)
      const resultCopy =
        await apiClient.projectsApiFactory.projectControllerDuplicate({
          destinationId: Number(projectId),
          id: props.id,
        })
      if (!resultCopy) {
        showAlertMessage("error", "Can't copy!")
      }
      setDisplayStatus("complete")
      setApiLoading(false)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const handleOnClickComplete = () => {
    props.onComplete()
    setShown(false)
  }

  const handleOnClose = () => {
    if (displayStatus === "complete") {
      handleOnClickComplete()
    } else {
      setShown(false)
    }
  }

  return (
    <div>
      <BaseButtonIconText
        icon='file_copy'
        text='複製'
        size='small'
        onClick={() => {
          setDisplayStatus("project")
          setYear("")
          setMonth("")
          setShown(true)
        }}
      />
      <BaseModal shown={shown} onClickClose={handleOnClose}>
        {displayStatus === "complete" ? (
          <ProjectDuplicateComplete
            media={props.mediaType.name}
            year={props.year}
            month={props.month}
            newYear={year}
            newMonth={month}
            onClick={handleOnClickComplete}
          />
        ) : displayStatus === "period" ? (
          <ProjectDuplicateSalesPeriod
            onClose={handleOnClose}
            onClickNext={() =>
              handleOnClickDuplicateProject(projectDestinationId)
            }
            apiLoading={apiLoading}
          />
        ) : (
          <ProjectDuplicateProject
            media={props.mediaType.name}
            year={props.year}
            month={props.month}
            onClose={handleOnClose}
            onClickNext={handleOnClickNextToSalesPeriod}
            loading={apiLoading}
          />
        )}
      </BaseModal>
    </div>
  )
}

export default ProjectDuplicateModal
