import axios from "axios"
import config from "@/src/aws-exports"
const axiosInstance = axios.create({
  baseURL: `https://cognito-idp.${config.aws_cognito_region}.amazonaws.com`,
  headers: {
    accept: "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "max-age=0",
    "content-type": "application/x-amz-json-1.1",
    "x-amz-target": "AWSCognitoIdentityProviderService.GetUser",
    "x-amz-user-agent": "aws-amplify/5.0.4 js",
  },
})

type UserAttributesItem = {
  Name: string
  Value: string
}

type UserCognitoInfo = {
  UserAttributes: UserAttributesItem[]
  Username: string
}

export const getUserInfo = async (accessToken: string) => {
  const response = await axiosInstance.post<UserCognitoInfo>("", {
    AccessToken: accessToken,
  })
  return response.data
}
