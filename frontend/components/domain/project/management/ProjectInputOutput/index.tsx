import {
  ProjectWithXlsFilesResponseDto,
  ProjectsWithImagesResponseDto,
} from "@/openapi/api"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"

import ProjectImport from "@/components/domain/project/management/ProjectImport"
import ProjectOutput from "@/components/domain/project/management/ProjectOutput"
import { useState } from "react"

interface Props {
  project: ProjectsWithImagesResponseDto
  onProjectChange: () => void
}

const ProjectInputOutput = (props: Props) => {
  const [isAllImported, setIsAllImported] = useState<boolean>(false)
  return (
    <div className='pt-8'>
      <RenderWithRoles roles={[RolesMock.admin, RolesMock.operator]}>
        <div className='mb-12'>
          <ProjectImport
            onProjectChange={props.onProjectChange}
            project={props.project}
            onChangeImportStatus={(value) => setIsAllImported(value)}
          />
        </div>
      </RenderWithRoles>
      <ProjectOutput project={props.project} activeIndexData={isAllImported} />
    </div>
  )
}

export default ProjectInputOutput
