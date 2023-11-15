import { cognitoUserState, verifyAndGetUser } from "@/atoms/user"
import { useApiClient } from "@/hooks/useApiClient"
import { Alert, Backdrop } from "@mui/material"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"

const Verify: NextPage = () => {
  const router = useRouter()
  const [userState, setUserState] = useRecoilState(cognitoUserState)
  const [result, setResult] = useState("verifying")
  const apiClient = useApiClient()
  useEffect(() => {
    const token = router.query.token as string
    if (!token) return
    ;(async () => {
      try {
        const rs = await verifyAndGetUser(token, apiClient)
        setUserState(rs)
        setResult("success")
        setTimeout(() => {
          router.push("/")
        }, 1000)
      } catch (e) {
        setResult("error")
        throw e
      }
    })()
  }, [router.isReady, router.query.token]) // eslint-disable-line

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      {result === "verifying" && <Alert severity='info'>Verifying...</Alert>}
      {result === "success" && (
        <Alert severity='success'>Verified! Redirecting...</Alert>
      )}
      {result === "error" && (
        <Alert severity='error'>Error, please try again!!</Alert>
      )}
    </Backdrop>
  )
}
export default Verify
