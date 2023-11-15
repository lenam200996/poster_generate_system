import { useContext } from "react"

import type { ApiClient } from "@/clients/apiClient"
import { ApiClientContext } from "@/context/apiClientContext"

export const useApiClient = (): ApiClient => {
  const apiClient = useContext(ApiClientContext)
  if (!apiClient)
    throw new Error("useApiClient must be inside a Provider with a value")

  return apiClient
}
