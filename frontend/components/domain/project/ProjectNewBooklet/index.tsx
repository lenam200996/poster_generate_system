import { useMemo, useState } from "react"
import { useRecoilState } from "recoil"
import BaseModal from "@/components/base/overlay/BaseModal"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ProjectNewBookletSetting from "@/components/domain/project/ProjectNewBooklet/ProjectNewBookletSetting"
import ProjectNewBookletComplete from "@/components/domain/project/ProjectNewBooklet/ProjectNewBookletComplete"
import { copiesMock, generateMockBookletID } from "@/config/api/mock/projects"
import dayjs from "@/util/dayjs"
import { projectsState } from "@/atoms/projectlist"

interface Props {
  id: number
}

type DisplayStatus = "setting" | "complete"

const ProjectNewBooklet = (props: Props) => {
  const [projects, setProjectsState] = useRecoilState(projectsState)
  const [shown, setShown] = useState<boolean>(false)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("setting")
  const [plateName, setPlateName] = useState<string>("")
  const [pageCounts, setPageCounts] = useState<string>("")
  const [destinationProject, setDestinationProject] = useState<string>("")

  const project = useMemo(
    () => projects.find((project) => project.id === props.id),
    [projects, props.id],
  )
  const destinationPlates = useMemo(() => {
    const plates = project
      ? project.booklets.map((item) => item.masterEditionCode.name)
      : []
    return copiesMock
      .filter((copies) => !plates.includes(copies.value))
      .map((copies) => copies.value)
  }, [project])
  const handleOnClickOpen = () => {
    setDisplayStatus("setting")
    setShown(true)
  }
  const handleOnClose = () => {
    setShown(false)
  }
  const handleOnNext = ({ plateName, pageCounts }) => {
    // API連携が発生する予定
    if (project) {
      setProjectsState((state) =>
        state.map((project) => {
          if (project.id === props.id) {
            return {
              ...project,
              data: [
                ...project.booklets,
                {
                  id: generateMockBookletID(),
                  name: plateName,
                  manuscripts: [],
                  manuscriptCounts: pageCounts,
                  completionCounts: 0,
                  status: "",
                  updated: dayjs().format("YYYY-MM-DD"),
                },
              ],
            }
          }
          return project
        }),
      )

      setPlateName(plateName)
      setPageCounts(pageCounts)

      setDestinationProject(
        `${project.mediaType.name}　${dayjs(
          `${project.issueYear}-${project.issueMonth}`,
        ).format("YYYY年　M月号")}`,
      )

      // API連携が完了したら
      setDisplayStatus("complete")
    }
  }

  return (
    <div>
      <BaseButtonIconText
        icon='add_box'
        text='追加'
        size='small'
        disabled={destinationPlates.length === 0}
        onClick={handleOnClickOpen}
      />
      <BaseModal shown={shown} onClickClose={handleOnClose}>
        {displayStatus === "setting" && (
          <ProjectNewBookletSetting
            destinationPlates={destinationPlates}
            onClose={handleOnClose}
            onNext={handleOnNext}
          />
        )}
        {displayStatus === "complete" && (
          <ProjectNewBookletComplete
            plateName={plateName}
            pageCounts={pageCounts}
            destinationProject={destinationProject}
            onComplete={handleOnClose}
            onClose={handleOnClose}
          />
        )}
      </BaseModal>
    </div>
  )
}

export default ProjectNewBooklet
