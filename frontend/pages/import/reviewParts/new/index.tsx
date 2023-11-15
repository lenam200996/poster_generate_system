import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import ReviewPartsForm from "@/components/page/import/reviewParts/ReviewPartsForm"
import { useApiClient } from "@/hooks/useApiClient"
import MuiLoadingButton from "@mui/lab/LoadingButton"

type FileData = {
  file: File
  name: string
  path: string
}

const PartsNewPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [apiLoading, setApiLoading] = useState(false)
  const [item, setItem] = useState<{
    name: string
    media: string[]
    remarks: string
    manuscriptSize?: string
    thisIssueImage?: FileData
    previousIssueImage?: FileData
    twoPreviousIssueImage?: FileData
    wantedImage?: FileData
    startFillImage?: FileData
    startHalfFillImage?: FileData
    startNonFillImage?: FileData
    wordOfMouthMount?: FileData
    inDesign?: FileData
  }>({
    name: "",
    media: [],
    remarks: "",
  })

  const handleOnChange = (item) => {
    setItem((state) => ({
      ...state,
      ...item,
    }))
  }

  const handleOnClickSave = async () => {
    try {
      setApiLoading(true)
      const params = {
        name: item.name,
        documentSize: item.manuscriptSize,
        imageFirst: item.thisIssueImage.file,
        imagePrevious: item.previousIssueImage.file,
        imagePreviousTwo: item.twoPreviousIssueImage.file,
        imageWanted: item.wantedImage.file,
        imageStarFillAll: item.startFillImage.file,
        imageStarFillHalf: item.startHalfFillImage.file,
        imageStarFillNone: item.startNonFillImage.file,
        inDesign: item.inDesign.file,
        comment: item.remarks,
        mediaTypes: item.media,
      }
      await apiClient.documentEvaluationsApi.documentEvaluationControllerCreateDocumentEvaluation(
        params.name,
        params.documentSize,
        params.imageFirst,
        params.imagePrevious,
        params.imagePreviousTwo,
        params.imageWanted,
        params.imageStarFillAll,
        params.imageStarFillHalf,
        params.imageStarFillNone,
        params.inDesign,
        params.comment,
        params.mediaTypes,
      )
      router.push("/import/reviewParts")
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const isSaveDisabled = useMemo(() => {
    if (
      item.name === "" ||
      item.media.length === 0 ||
      (item.thisIssueImage ?? "") === "" ||
      (item.previousIssueImage ?? "") === "" ||
      (item.twoPreviousIssueImage ?? "") === "" ||
      (item.wantedImage ?? "") === "" ||
      (item.startFillImage ?? "") === "" ||
      (item.startHalfFillImage ?? "") === "" ||
      (item.startNonFillImage ?? "") === "" ||
      (item.inDesign ?? "") === ""
    ) {
      return true
    }
    return false
  }, [item])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 w-full flex-1 overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/reviewParts'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                評価パーツリストに戻る
              </div>
            </MuiLink>
          </Link>
          <h1 className='mt-4 text-xl font-bold text-content-default-primary'>
            評価パーツ　新規登録
          </h1>
          <div className='mt-8'>
            <ReviewPartsForm item={item} onChange={handleOnChange} />
          </div>
        </div>
        <div className='absolute bottom-0 left-0 right-0 flex h-16 items-center justify-end bg-white-0 px-10'>
          <MuiLoadingButton
            variant='contained'
            sx={{ width: 104 }}
            disabled={isSaveDisabled}
            loading={apiLoading}
            onClick={handleOnClickSave}
          >
            保存
          </MuiLoadingButton>
        </div>
      </div>
    </AuthLayout>
  )
}

export default PartsNewPage
