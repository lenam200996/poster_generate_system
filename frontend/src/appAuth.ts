import Amplify, { Auth } from "aws-amplify"
import awsconfig from "./aws-exports"

Amplify.configure(awsconfig)

export const AppAuth = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    Auth.currentAuthenticatedUser()
      .then(() => resolve(true))
      .catch(() => reject(false))
  })
}
