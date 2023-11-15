import { useState, useEffect, useMemo } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { projectsState } from "@/atoms/projectlist"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import MuiButton from "@mui/material/Button"
import MuiMenuItem from "@mui/material/MenuItem"
import MuiSelect from "@mui/material/Select"
import BaseTextField from "@/components/base/form/BaseTextField"
import {
  BookletForProjectResponseDtoEditionCodeEnum,
  MasterDocumentSizeDtoCodeEnum,
  MasterEditionCodeDtoCodeEnum,
  MasterEditionCodePublicDtoCodeEnum,
  MasterMediaTypeDto,
  MasterMediaTypeDtoCodeEnum,
} from "@/openapi"
import { useApiClient } from "@/hooks/useApiClient"
import { userCognitoMock } from "@/config/api/mock/myStock"
import { paddingZero } from "@/util/number"
import MuiLoadingButton from "@mui/lab/LoadingButton"
import BaseErrorBody from "@/components/base/typography/BaseErrorBody"
import errorMessage from "@/config/errorMessage"

interface Props {
  documentSize: MasterDocumentSizeDtoCodeEnum
  templateName: string
  onPrev?: () => void
  onClose?: () => void
  onChange?: () => void
  onExact: ({
    hotelCode,
    hotelName,
    projectId,
    edition,
    reload,
  }: {
    hotelCode: string
    hotelName: string
    projectId: string
    edition: string
    reload?: boolean
  }) => void
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 180,
    },
  },
}

export type EditionType = keyof MasterEditionCodePublicDtoCodeEnum | null

const MyStockModalSettingsManuscript = (props: Props) => {
  const apiClient = useApiClient()
  const { documentSize, templateName } = props
  const [hotelCode, setHotelCode] = useState("")
  const [hotelName, setHotelName] = useState("")
  const [projectId, setProjectId] = useState("")
  const [edition, setEdition] = useState("")
  const [disable, setDisable] = useState(false)
  const projectListState = useRecoilValue(projectsState)
  const [hotelTimer, setHotelTimer] = useState<NodeJS.Timer>(null)
  const [creating, setCreating] = useState(false)
  const [hotelCodeError, setHotelCodeError] = useState<Record<
    string,
    any
  > | null>(null)
  const [fetchingData, setFetchingData] = useState(false)

  const handleOnClickPrev = () => {
    if (!props.onPrev) return
    props.onPrev()
  }
  const handleOnClickClose = () => {
    if (!props.onClose) return
    props.onClose()
  }
  const handleOnClickChange = () => {
    props.onChange()
  }

  const notMatch = useMemo(() => {
    const project = projectListState.find(
      (project) => project.id === Number(projectId),
    )
    if (!project || !edition || !hotelCode) return true
    const booklet = project.booklets.find((bk) => bk.id == Number(edition))
    if (!booklet) return true
    return booklet.documents.some(
      (doc) =>
        doc.documentSizeCode == props.documentSize &&
        doc.hotelCode == hotelCode,
    )
  }, [projectId, hotelCode, edition])

  const handleOnExact = () => {
    setCreating(true)
    const project = projectListState.find(
      (project) => project.id === Number(projectId),
    )
    if (!project || !edition || !hotelCode) return
    const booklet = project.booklets.find((bk) => bk.id == Number(edition))
    if (booklet) {
      if (
        booklet.documents.some(
          (doc) =>
            doc.documentSizeCode == props.documentSize &&
            doc.hotelCode == hotelCode,
        )
      ) {
        setCreating(false)
        return alert("同じ宿コード・原稿サイズの原稿が存在します。")
      } else {
        const mapMediaTypeCode = new Map<MasterMediaTypeDtoCodeEnum, string>([
          [MasterMediaTypeDtoCodeEnum.Magazine, "Y"], // 北海道
          [MasterMediaTypeDtoCodeEnum.Test, "Z"], // テスト
        ])
        const mapEditionCode = new Map<MasterEditionCodeDtoCodeEnum, string>([
          [MasterEditionCodeDtoCodeEnum.Hokkaido, "HK"], // 北海道
          [MasterEditionCodeDtoCodeEnum.Touhoku, "TH"], // 東北
          [MasterEditionCodeDtoCodeEnum.Joshinetsu, "JS"], // 上信越
          [MasterEditionCodeDtoCodeEnum.KitaKanto, "KK"], // 北関東
          [MasterEditionCodeDtoCodeEnum.Kanto, "ES"], // 関東
          [MasterEditionCodeDtoCodeEnum.Tokai, "CB"], // 東海
          [MasterEditionCodeDtoCodeEnum.Kansai, "WS"], // 関西
          [MasterEditionCodeDtoCodeEnum.Hokuriku, "HR"], // 北陸
          [MasterEditionCodeDtoCodeEnum.ChugokuShikoku, "CC"], // 中国四国
          [MasterEditionCodeDtoCodeEnum.Kyushu, "KS"], // 九州
          [MasterEditionCodeDtoCodeEnum.KansaiHokuriku, "WH"], // 関西・北陸版
          [MasterEditionCodeDtoCodeEnum.ToukaiHokuriku, "CH"], // 東海・北陸版
          [MasterEditionCodeDtoCodeEnum.Test, "ZZ"], // テスト
        ])
        const documentSerialNumber = booklet.documentSerialNumber + 1
        const documentCodeItems = [
          mapMediaTypeCode.get(project.mediaTypeCode),
          booklet.project.issueYear,
          paddingZero(booklet.project.issueMonth, 2),
          mapEditionCode.get(booklet.masterEditionCode.code),
          paddingZero(documentSerialNumber, 5),
        ]
        return apiClient.documentsApiFactory
          .documentControllerCreateDocument({
            bookletId: booklet.id,
            documentSizeCode: props.documentSize,
            documentCode: documentCodeItems.join(""),
            documentTypeCode: "HOTEL_MANUSCRIPT",
            manuscriptPersonCognito: userCognitoMock,
            projectId: project.id,
            salesPersonCognito: userCognitoMock,
            statusCode: "NOT_START",
            hotelCode: hotelCode,
          })
          .then((createdDocument) => {
            const doc = createdDocument.data
            apiClient.documentMyStocksApi
              .documentMyStockControllerCreate({
                createPersonCognito: userCognitoMock,
                documentId: doc.id,
              })
              .then((res) => {
                setCreating(false)
                props.onExact({
                  hotelCode,
                  hotelName,
                  projectId,
                  edition,
                  reload: true,
                })
              })
          })
        // const doc = booklet.documents.find(d => d.hotelCode == hotelCode)
        // if(doc){
        //   return apiClient.documentMyStocksApi.documentMyStockControllerCreate({
        //     createPersonCognito: userCognitoMock,
        //     documentId: doc.id
        //   }).then(res => {
        //     props.onExact({ hotelCode, hotelName, projectId, edition, reload : true })
        //   })
        // }
      }
    }
    props.onExact({ hotelCode, hotelName, projectId, edition })
  }

  const ProjectOptions = useMemo(() => {
    const array = projectListState.map((project) => {
      const projectName = `${project.mediaType.name} ${project.issueYear}年 ${project.issueMonth}月号`
      return (
        <MuiMenuItem key={project.id} value={project.id}>
          {projectName}
        </MuiMenuItem>
      )
    })
    return array
  }, [projectListState])

  const EditionOptions = useMemo(() => {
    const project = projectListState.find(
      (project) => project.id === Number(projectId),
    )
    const array =
      project &&
      project.booklets.map((e) => (
        <MuiMenuItem key={e.id} value={e.id}>
          {e.masterEditionCode.name}
        </MuiMenuItem>
      ))
    return array
  }, [projectListState, projectId])

  const disableButton = useMemo(() => {
    return (
      !hotelCode ||
      !hotelName ||
      !projectId ||
      !edition ||
      hotelCodeError ||
      fetchingData ||
      notMatch
    )
  }, [
    hotelCode,
    hotelName,
    projectId,
    edition,
    hotelCodeError,
    fetchingData,
    notMatch,
  ])
  useEffect(() => {
    setDisable(
      hotelCode === "" ||
        hotelName === "" ||
        projectId === "" ||
        edition === "" ||
        hotelCodeError !== null ||
        fetchingData ||
        notMatch,
    )
  }, [
    hotelCode,
    hotelName,
    projectId,
    edition,
    hotelCodeError,
    fetchingData,
    notMatch,
  ])

  useEffect(() => {
    setHotelCodeError(null)
    checkDuplicatedDocument(hotelCode, Number(edition))
  }, [hotelCode, projectId, edition])
  useEffect(() => {
    if (typeof hotelTimer == "number") clearTimeout(hotelTimer)
    if (!hotelCode) return

    setHotelTimer(
      setTimeout(() => {
        apiClient.hotelApiFactory
          .hotelInfoControllerGetHotelInfo(hotelCode)
          .then((result) => {
            if (!result.data.result) {
              setHotelName("")
              return setHotelCodeError({
                hotelCodeInvalidError: errorMessage.HOTEL_CODE_NOT_EXIST,
              })
            }
            const hotelInfo = result.data
            if (hotelInfo) setHotelName(hotelInfo.hotelName)
            if (!hotelCodeError)
              checkDuplicatedDocument(hotelCode, Number(edition))
          })
      }, 200),
    )
  }, [hotelCode])
  const checkDuplicatedDocument = async (code: string, editionId: number) => {
    if (!editionId) return
    setFetchingData(true)
    try {
      const res = await apiClient.bookletApiFactory.bookletControllerGet(
        editionId,
      )
      await res.data.pages.some((page) => {
        return page.documents.some((document) => {
          if (
            document.hotelCode === code &&
            document.documentSizeCode === props.documentSize
          ) {
            setHotelCodeError({
              hotelCodeInvalidError:
                "既に該当の宿コードと原稿サイズの原稿が存在します。",
            })
            return true
          }
          return false
        })
      })

      setFetchingData(false)
    } catch (error) {
      setFetchingData(false)
      console.log(error)
      setHotelCodeError({
        hotelCodeInvalidError: "接続にエラーが発生しました。",
      })
    }
  }

  return (
    <div>
      <BaseModal shown={true} onClickClose={handleOnClickClose}>
        <div className='relative h-[640px] w-[1200px] px-[50px] pt-[56px]'>
          <div className='mx-auto w-[700px]'>
            <p className='text-content-primary-dark90 text-center text-lg font-bold'>
              原稿情報設定
            </p>
            <div className='mt-[105px]'>
              {documentSize === "ONE_ONE" && (
                <div className='flex items-center'>
                  <p className='w-[200px] text-sm font-medium'>
                    原稿レイアウト
                  </p>
                  <div className='flex items-center'>
                    <p className='mr-5 text-sm font-medium'>{templateName}</p>
                    <MuiButton
                      size='small'
                      variant='contained'
                      onClick={handleOnClickChange}
                    >
                      変更
                    </MuiButton>
                  </div>
                </div>
              )}

              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>プロジェクト</p>
                <MuiSelect
                  size='small'
                  value={projectId}
                  sx={{ minWidth: 440 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue=''
                  MenuProps={MenuProps}
                  onChange={(event) => {
                    setProjectId(event.target.value)
                    setEdition("")
                  }}
                >
                  <MuiMenuItem value={""}>選択</MuiMenuItem>
                  {ProjectOptions}
                </MuiSelect>
              </div>
              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>版選択</p>
                <MuiSelect
                  size='small'
                  value={edition}
                  sx={{ minWidth: 122 }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  defaultValue=''
                  MenuProps={MenuProps}
                  onChange={(event) => setEdition(event.target.value)}
                >
                  <MuiMenuItem value=''>選択</MuiMenuItem>
                  {EditionOptions}
                </MuiSelect>
              </div>
              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>宿コード</p>
                <div className='flex flex-col'>
                  <BaseTextField
                    size='small'
                    sx={{ width: 60 }}
                    value={hotelCode}
                    error={!!hotelCodeError?.hotelCodeInvalidError}
                    onChange={(event) => setHotelCode(event.target.value)}
                  />
                  {hotelCodeError?.hotelCodeInvalidError && (
                    <div className='mt-1'>
                      <BaseErrorBody>
                        {hotelCodeError.hotelCodeInvalidError}
                      </BaseErrorBody>
                    </div>
                  )}
                </div>
              </div>
              <div className='mt-7 flex items-center'>
                <p className='w-[200px] text-sm font-medium'>宿名</p>
                <span>{hotelName}</span>
              </div>
            </div>
          </div>
          <div className='absolute left-0 bottom-0 flex w-full items-center justify-between px-9 pb-9'>
            <MuiButton
              color='inherit'
              variant='outlined'
              sx={{ width: 104 }}
              onClick={handleOnClickPrev}
            >
              戻る
            </MuiButton>
            <MuiLoadingButton
              variant='contained'
              sx={{ width: 104 }}
              disabled={!!disableButton}
              onClick={handleOnExact}
              loading={creating}
            >
              確定
            </MuiLoadingButton>
          </div>
        </div>
      </BaseModal>
    </div>
  )
}

export default MyStockModalSettingsManuscript
