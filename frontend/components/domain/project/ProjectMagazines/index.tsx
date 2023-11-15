import { useState, useEffect, useMemo } from "react"
import { useRecoilState } from "recoil"
import { useRouter } from "next/router"
import { projectsState, projectlistShownsState } from "@/atoms/projectlist"
import MuiIconButton from "@mui/material/IconButton"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ProjectBookletTable from "../ProjectBookletTable"
import { ProjectListResponseDto } from "@/openapi/api"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"

interface Props {
  magazine: ProjectListResponseDto
  id: number
}

const ProjectMagazines = (props: Props) => {
  const router = useRouter()
  const [projects, setProjects] = useRecoilState(projectsState)
  const [showns, setShowns] = useRecoilState(projectlistShownsState)
  const [shown, setShown] = useState<boolean>(false)

  const onClickToggle = () => {
    if (showns.includes(props.magazine.id)) {
      setShowns(showns.filter((v) => v !== props.magazine.id))
    } else {
      setShowns([...showns, props.magazine.id])
    }
  }

  useEffect(() => {
    setShown(showns.includes(props.magazine.id))
  }, [showns]) // eslint-disable-line

  const isSaveDisabled = useMemo(() => {
    const inputYear = props.magazine.issueYear
    const inputMonth = props.magazine.issueMonth
    return (
      projects.find(
        (project) =>
          project.id !== props.magazine.id &&
          project.mediaTypeCode === props.magazine.mediaTypeCode &&
          project.issueYear === inputYear &&
          project.issueMonth === inputMonth,
      ) !== undefined
    )
  }, [projects, props.magazine.id, props.magazine.mediaTypeCode]) // eslint-disable-line

  return (
    <div className='border-[1px] border-b-0 border-solid border-container-sleep-secondary bg-container-main-quinary last-of-type:border-b-[1px]'>
      <div className='flex h-[56px] items-center justify-between bg-white-0 pl-7 pr-9'>
        <h2 className='text-stroke-content-primary-dark90 flex items-start font-bold'>
          <span className='text-sm text-content-default-primary'>
            {props.magazine.mediaType.name}
          </span>
          <span className='mr-1 text-sm text-content-default-primary'>
            {props.magazine.issueYear}年{props.magazine.issueMonth}月号
          </span>
        </h2>
        <div className='flex items-center'>
          <div className='flex justify-between'>
            <RenderWithRoles
              roles={[
                RolesMock.admin,
                RolesMock.operator,
                RolesMock.manuscriptOperator,
              ]}
            >
              <div className='ml-0'>
                <BaseButtonIconText
                  icon='settings_applications'
                  text='詳細'
                  size='small'
                  onClick={() =>
                    router.push({
                      pathname: "/management/[id]",
                      query: { id: props.magazine.id },
                    })
                  }
                />
              </div>
            </RenderWithRoles>
          </div>
          <div className='ml-6'>
            <MuiIconButton color='primary' onClick={onClickToggle}>
              <span
                className={`material-symbols-outlined text-[25px] text-content-default-tertiary ${
                  shown && "rotate-180"
                }`}
              >
                keyboard_double_arrow_down
              </span>
            </MuiIconButton>
          </div>
        </div>
      </div>
      {shown && (
        <div className='border-t-[1px] border-container-sleep-secondary p-4'>
          <ProjectBookletTable project={props.magazine} />
        </div>
      )}
    </div>
  )
}

export default ProjectMagazines
