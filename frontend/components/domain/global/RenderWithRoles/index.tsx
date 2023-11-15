import { RoleTypes } from "@/config/api/mock/users"
import React, { useCallback } from "react"
import { useRecoilValue } from "recoil"
import { cognitoUserState } from "@/atoms/user"
type Props = {
  roles: RoleTypes[]
  children: React.ReactElement
}

const RenderWithRoles: React.FC<Props> = ({ children, roles }) => {
  const userState = useRecoilValue(cognitoUserState)
  // TODO defaultでadminをやめる
  const mockDefaultRole: RoleTypes[] = ["admin"]
  // INFO: モックデータを入れている
  const hasRole = useCallback(
    (roles: RoleTypes[], currentRoles: RoleTypes[] = mockDefaultRole) => {
      return roles.some((role) => currentRoles.includes(role))
    },
    [], // eslint-disable-line
  )

  return hasRole(
    roles,
    userState ? userState["cognito:groups"] : mockDefaultRole,
  )
    ? children
    : null
}

export default React.memo(RenderWithRoles)
