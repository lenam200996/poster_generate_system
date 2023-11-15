import React from "react"

import type { ApiClient } from "@/clients/apiClient"

export const ApiClientContext = React.createContext<ApiClient | undefined>(
  undefined,
)
