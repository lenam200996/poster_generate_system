import { useState } from "react"
import { useApiClient } from "./useApiClient"
export const useMyStock = () => {
  const apiClient = useApiClient()
  const [loading, setLoading] = useState<boolean>(false)
  const toggleMyStock = async (
    saved: boolean,
    documentId: number,
    userCognito: string,
  ) => {
    if (loading) return false
    try {
      setLoading(true)
      if (saved) {
        const res =
          await apiClient.documentMyStocksApi.documentMyStockControllerCreate({
            documentId,
            createPersonCognito: userCognito,
          })
        setLoading(false)
      } else {
        const res =
          await apiClient.documentMyStocksApi.documentMyStockControllerDelete({
            documentId,
            createPersonCognito: userCognito,
          })
        setLoading(false)
      }
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }
  return { toggleMyStock }
}
