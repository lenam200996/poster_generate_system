import "@aws-amplify/ui-react/styles.css"
import GlobalAuthHeader from "@/components/domain/global/GlobalAuthHeader/index"
import GlobalSideNavigation from "@/components/domain/global/sideNavigation/GlobalSideNavigation"
import { useEffect, useState } from "react"
import { GlobalLoadingState } from "@/atoms/global"
import { cognitoUserState, verifyAndGetUser } from "@/atoms/user"
import { useRecoilState, useRecoilValue } from "recoil"
import { useApiClient } from "@/hooks/useApiClient"
import { domtoimage } from "@/util/dom2image"
import { jsPDF } from "jspdf"
import MuiCircularProgress from "@mui/material/CircularProgress"

export default function AuthLayout({ children }) {
  const [userState, setUserState] = useRecoilState(cognitoUserState)
  const isLoading = useRecoilValue(GlobalLoadingState)
  const apiClient = useApiClient()
  const [manuscriptExports, setManuscriptExports] = useState([])
  const [exportType, setExportType] = useState<Array<"jpg" | "pdf">>([])
  useEffect(() => {
    ;(async () => {
      if (!userState) {
        let userStateAccess = localStorage.getItem(
          "aws-amplify-user-access-token",
        )
        if (userStateAccess) {
          let rs = await verifyAndGetUser(userStateAccess, apiClient)
          setUserState(rs)
        }
      }
    })()
  }, []) // eslint-disable-line
  useEffect(() => {
    if (manuscriptExports.length > 0) {
      if (exportType.includes("jpg")) {
        // const screenDiv = document.getElementById("screenshot-doc")
        // domtoimage.toBlob(screenDiv, {}).then((out) => {
        const url = "/assets/dummy/dummy-manuscript.png"
        const link = document.createElement("a")
        link.href = url
        link.download = "dummy-manuscript.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        // console.log("out", out)
        // })
      }
      if (exportType.includes("pdf")) {
        // const doc = new jsPDF()
        // doc.html(document.getElementById("screenshot-doc"), {
        // callback: function (pdf) {
        // pdf.save("pdf-document.pdf")
        // },
        // })
        const url = "/assets/dummy/dummy-pdf.pdf"
        const link = document.createElement("a")
        link.href = url
        link.download = "dummy-pdf.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    }
  }, [manuscriptExports, exportType])
  return (
    <div className='flex'>
      {isLoading ? (
        <div
          style={{ backgroundColor: "rgb(0 0 0 / 9%)" }}
          className='absolute top-0 left-0 z-[999] flex h-full w-full items-center justify-center'
        >
          <MuiCircularProgress />
        </div>
      ) : null}

      <div id='screenshot-doc' className='-z-10'>
        {
          // manuscriptExports.map(manus =>
          //   <IdmlPageItemsPreview
          //     editId={""}
          //     items={manus.items}
          //     page={manus.page}
          //     onClickPageItem={() => {}}
          //     onClickPaper={() => {}}
          //     backgroundImage={`${process.env.NEXT_PUBLIC_API_URL}/v1/idml-replace/workspace/bg-image/${manus.documentSizeCode}`}
          // />)

          // dummy data export
          manuscriptExports.map((manus, index: number) => (
            <div
              key={index}
              style={{
                width: `${manus.page ? manus.page.size.width : 522}px`,
                height: `${manus.page ? manus.page.size.height : 522}px`,
              }}
            >
              <img
                src='/assets/dummy/dummy-manuscript.png'
                alt=''
                className='h-full w-full'
              ></img>
            </div>
          ))
        }
      </div>
      <GlobalSideNavigation
        manuscriptExports={(selected, type) => {
          setManuscriptExports(selected || [])
          setExportType(type)
        }}
      />
      <div className='flex w-full flex-col'>
        <GlobalAuthHeader />
        <main className='scrollbar-hide ml-[60px] flex-1 overflow-x-auto'>
          {children}
        </main>
      </div>
    </div>
  )
}
