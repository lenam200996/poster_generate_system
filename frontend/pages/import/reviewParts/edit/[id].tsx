import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import Link from "next/link"
import MuiButton from "@mui/material/Button"
import AuthLayout from "@/components/layout/Auth"
import MuiLink from "@mui/material/Link"
import { ArrowBack } from "@mui/icons-material"
import ReviewPartsForm from "@/components/page/import/reviewParts/ReviewPartsForm"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ReviewPartsDeleteModal from "@/components/page/import/reviewParts/ReviewPartsDeleteModal"
import { useApiClient } from "@/hooks/useApiClient"
import generateFileNameFromPath from "@/util/generateFileNameFromPath"
import MuiLoadingButton from "@mui/lab/LoadingButton"

type FileData = {
  file?: File
  name: string
  path: string
}

type Form = {
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
}

const PartsEditPage: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const { id } = router.query
  const [originalItem, setOriginalItem] = useState<Form>(undefined)
  const [item, setItem] = useState<Form>(undefined)
  const [shown, setShown] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      const params = {
        id,
      }
      try {
        const { data } =
          await apiClient.documentEvaluationsApi.documentEvaluationControllerGetDocumentEvaluation(
            Number(params.id),
          )
        const itemData = {
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
        }
        setItem(itemData)
        setOriginalItem(itemData)
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
  }, [id]) // eslint-disable-line

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
        id: Number(id),
        documentSizeCode: item.manuscriptSize,
        imageFirst: item.thisIssueImage.file,
        imagePrevious: item.previousIssueImage.file,
        imagePreviousTwo: item.twoPreviousIssueImage.file,
        imageWanted: item.wantedImage.file,
        imageStarFillAll: item.startFillImage.file,
        imageStarFillHalf: item.startHalfFillImage.file,
        imageStarFillNone: item.startNonFillImage.file,
        name: item.name,
        inDesign: item.inDesign.file,
        comment: item.remarks,
        mediaTypes: item.media,
      }
      await apiClient.documentEvaluationsApi.documentEvaluationControllerUpdateDocumentEvaluation(
        params.id,
        params.documentSizeCode,
        params.imageFirst,
        params.imagePrevious,
        params.imagePreviousTwo,
        params.imageWanted,
        params.imageStarFillAll,
        params.imageStarFillHalf,
        params.imageStarFillNone,
        params.name,
        params.inDesign,
        params.comment,
        params.mediaTypes,
      )
      router.push(`/import/reviewParts/detail/${id}`)
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const isSaveDisabled = useMemo(() => {
    if (
      item === undefined ||
      item.name === "" ||
      item.media.length === 0 ||
      (item.manuscriptSize ?? "") === "" ||
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

    if (
      Object.keys(item).find((key) =>
        key === "media"
          ? item[key].length !== originalItem[key].length ||
            item[key].find((value) => !originalItem[key].includes(value)) !==
              undefined
          : item[key] !== originalItem[key],
      ) === undefined
    ) {
      return true
    }

    return false
  }, [item, originalItem])

  return (
    <AuthLayout>
      <div className='relative flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
        <div className='mb-16 overflow-y-auto px-10 pt-6 pb-10'>
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
                  評価パーツ　編集
                </h1>
                <div className='space-x-5'>
                  <BaseButtonIconText
                    icon='loupe'
                    text='詳細'
                    onClick={() =>
                      router.push({
                        pathname: "/import/reviewParts/detail/[id]",
                        query: { id },
                      })
                    }
                  />
                  <BaseButtonIconText
                    icon='delete'
                    text='削除'
                    onClick={() => setShown(true)}
                  />
                </div>
              </div>
              <div className='mt-8'>
                <ReviewPartsForm item={item} onChange={handleOnChange} />
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
            </>
          )}
        </div>
      </div>
      {shown && (
        <ReviewPartsDeleteModal
          id={originalItem.id}
          name={originalItem.name}
          onClose={() => setShown(false)}
          onComplete={() => router.push("/import/reviewParts")}
        />
      )}
    </AuthLayout>
  )
}

export default PartsEditPage
