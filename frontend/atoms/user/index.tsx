import { atom } from "recoil"
import { CognitoAttributes } from "../../../frontend/node_modules/@aws-amplify/ui-react/node_modules/@aws-amplify/ui/dist/types/types/authenticator/user"
import { RoleTypes } from "@/config/api/mock/users"
import { useApiClient } from "@/hooks/useApiClient"
import { ApiClient } from "@/clients/apiClient"

// オプション属性は型参照できないためCognitoAttributesを拡張しています
type CustomCognitoAttributes = {
  name?: string
  email?: string
  phone_number?: string
  picture?: string
  ["cognito:groups"]?: RoleTypes[]
}

export const cognitoUserState = atom<CustomCognitoAttributes | undefined>({
  key: "CognitoUserState",
  default: undefined,
})

export const verifyAndGetUser = async (
  _t: string,
  apiClient: ApiClient,
): Promise<CustomCognitoAttributes> => {
  try {
    const token = _t
    let result =
      await apiClient.authorizesApiFactory.authorizeControllerCheckForAuthorization(
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      )
    if (result.data) {
      localStorage.setItem("check-auth", JSON.stringify(result.data))
      let userStateSaved = {
        accessToken: _t as string,
        email: result.data.email,
        name: result.data.email,
        phone_number: "",
        ["cognito:groups"]: result.data["cognito:groups"] as RoleTypes[],
      }
      localStorage.setItem("aws-amplify-user-access-token", _t as string)
      return userStateSaved
      // router.replace("/")
    }
  } catch (e) {
    localStorage.removeItem("aws-amplify-user-access-token")
    throw e
  }
}
