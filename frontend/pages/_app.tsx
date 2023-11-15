import "../styles/globals.css"
import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import AlertMessageProvider from "@/components/domain/global/AlertMessageProvider"
import { ApiClient } from "@/clients/apiClient"
import { ApiClientContext } from "@/context/apiClientContext"

const apiClient = new ApiClient()

export const appTheme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP",
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApiClientContext.Provider value={apiClient}>
      <RecoilRoot>
        <ThemeProvider theme={appTheme}>
          <AlertMessageProvider>
            <Component {...pageProps} />
          </AlertMessageProvider>
        </ThemeProvider>
      </RecoilRoot>
    </ApiClientContext.Provider>
  )
}

export default MyApp
