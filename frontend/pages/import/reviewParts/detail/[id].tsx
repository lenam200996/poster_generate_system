import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ReviewPartsForm from "@/components/page/import/reviewParts/ReviewPartsForm"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"

type FileData = {
  file?: File
  name: string
  path: string
}

const PartsDetailPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [item, setItem] = useState<{
    id: number
    code: number
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
    inDesign?: FileData
  }>(undefined)

  useEffect(() => {
    ;(async () => {
      const params = {
        id: Number(id),
      }
      try {
        const { data } =
          await apiClient.documentEvaluationsApi.documentEvaluationControllerGetDocumentEvaluation(
            params.id,
          )
        setItem({
          id: data.id,
          code: data.code,
          name: data.name,
          media: data.mediaTypes.map((mediaType) => mediaType.mediaTypeCode),
          manuscriptSize: data.documentSize.code,
          remarks: data.comment,
          thisIssueImage: {
            path: data.imageFirst,
            name: generateFileNameFromPath(data.imageFirst),
          },
          previousIssueImage: {
            path: data.imagePrevious,
            name: generateFileNameFromPath(data.imagePrevious),
          },
          twoPreviousIssueImage: {
            path: data.imagePreviousTwo,
            name: generateFileNameFromPath(data.imagePreviousTwo),
          },
          wantedImage: {
            path: data.imageWanted,
            name: generateFileNameFromPath(data.imageWanted),
          },
          startFillImage: {
            path: data.imageStarFillAll,
            name: generateFileNameFromPath(data.imageStarFillAll),
          },
          startHalfFillImage: {
            path: data.imageStarFillHalf,
            name: generateFileNameFromPath(data.imageStarFillHalf),
          },
          startNonFillImage: {
            path: data.imageStarFillNone,
            name: generateFileNameFromPath(data.imageStarFillNone),
          },
          inDesign: {
            path: data.inDesign,
            name: generateFileNameFromPath(data.inDesign),
          },
        })
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='overflow-y-auto px-10 pt-6 pb-10'>
          <Link href='/import/reviewParts'>
            <MuiLink component='span' underline='none'>
              <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                <ArrowBack sx={{ width: 18, height: 18, marginLeft: "-3px" }} />
                評価パーツリストに戻る
              </div>
            </MuiLink>
          </Link>
          {item && (
            <>
              <div className='mt-4 flex items-start justify-between'>
                <h1 className='text-xl font-bold text-content-default-primary'>
                  評価パーツ　詳細
                </h1>
                <BaseButtonIconText
                  icon='edit_note'
                  text='編集'
                  onClick={() =>
                    router.push({
                      pathname: "/import/reviewParts/edit/[id]",
                      query: { id },
                    })
                  }
                />
              </div>
              <div className='mt-11'>
                <ReviewPartsForm item={item} />
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default PartsDetailPage
