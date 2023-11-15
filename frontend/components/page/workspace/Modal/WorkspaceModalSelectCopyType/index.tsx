import { useEffect, useMemo, useState } from "react"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  workspaceBookletState,
  workspaceManuscriptState,
} from "@/atoms/workspace"
import {
  DocumentSizeType,
  DocumentType,
  Order,
} from "@/config/api/mock/workspace/booklet"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"
import WorkspaceModalSelectDesignTemplateChartTitle from "@/components/page/workspace/Modal/WorkspaceModalSelectDesignTemplateChartTitle"
import WorkspaceModalSelectDesignTemplateSmallAssembly from "@/components/page/workspace/Modal/WorkspaceModalSelectDesignTemplateSmallAssembly"
import TemplateModalSelectManuscript from "@/components/domain/template/TemplateModalSelectManuscript"
import WorkspaceModalSettingsManuscript from "@/components/page/workspace/Modal/WorkspaceModalSettingsManuscript"
import { useApiClient } from "@/hooks/useApiClient"
import {
  CreateDocumentDto,
  CreateDocumentDtoDocumentTypeCodeEnum,
  DocumentSettingsDto,
  HotelInfoResponse,
  PageForBookletDto,
} from "@/openapi"
import { currentRolesMock, RolesMock } from "@/config/api/mock/users"
import { useRouter } from "next/router"

type DisplayStatus = "settingsManuscript"

type Props = {
  page: PageForBookletDto
  documentSize: DocumentSizeType
  order: Order
  onClose?: Function
  onExact?: Function
}

const WorkspaceModalSelectCopyType = (props: Props) => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [shown, setShown] = useState(false)
  const [value, setValue] = useState<DocumentType>(null)
  const [manuscriptType, setManuscriptType] = useState<DocumentType>(null)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>(null)
  const [bookletState, setBookletState] = useRecoilState(workspaceBookletState)
  const [settings, setSettings] = useState<DocumentSettingsDto>(null)
  const [selectedTemplateID, setSelectedTemplateID] = useState<number | null>(
    null,
  )
  const [apiLoading, setApiLoading] = useState(false)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)
  const manuscriptState = useRecoilValue(workspaceManuscriptState)
  useEffect(() => {
    ;(async () => {
      const response =
        await apiClient.settingsApiFactory.settingControllerDocumentSetting()
      setSettings(response.data)
      setShown(true)
    })()
  }, [apiClient.settingsApiFactory, apiClient.documentHeadLinesApi])

  const handleOnChange = (value: DocumentType) => {
    setValue(value)
  }

  const handleOnClose = () => {
    if (!props.onClose) return
    props.onClose()
  }

  const handleOnExactDesignTemplate = async ({
    hotelInfo,
    salesManager,
  }: {
    hotelInfo: HotelInfoResponse
    salesManager: string
  }) => {
    await createDocument({
      documentTypeCode: "HOTEL_MANUSCRIPT",
      hotelInfo,
      salesManager,
    })
  }

  const handleOnSelectDesignTemplateSmallAssembly = async (
    fillerId: number,
  ) => {
    await createDocument({ documentTypeCode: "FILLER", fillerId })
  }

  const handleOnSelectDesignTemplateChartTitle = async (headLineId: number) => {
    await createDocument({ documentTypeCode: "HEAD_LINE", headLineId })
  }

  const createDocument = async (params: {
    documentTypeCode: CreateDocumentDtoDocumentTypeCodeEnum
    hotelInfo?: HotelInfoResponse
    salesManager?: string
    fillerId?: number
    headLineId?: number
  }) => {
    try {
      setApiLoading(true)
      const createDocumentDto: CreateDocumentDto = {
        projectId: bookletState.projectId,
        bookletId: bookletState.id,
        pageId: props.page.id,
        pageNumber: props.page.pageNumber,
        hotelCode: params.hotelInfo?.hotelCode,
        documentCode: "",
        documentTypeCode: params.documentTypeCode,
        documentSizeCode: props.documentSize,
        salesPersonCognito: params.salesManager ?? "AAAXXXCCVCC",
        manuscriptPersonCognito: params.salesManager ?? "AAAXXXCCVCC",
        order: props.order,
        statusCode: "NOT_START",
      }
      if (
        params.documentTypeCode === "HOTEL_MANUSCRIPT" &&
        selectedTemplateID !== null
      ) {
        createDocumentDto.templateId = selectedTemplateID
      } else if (
        params.documentTypeCode === "FILLER" &&
        params.fillerId !== undefined
      ) {
        createDocumentDto.fillerId = params.fillerId
      } else if (
        params.documentTypeCode === "HEAD_LINE" &&
        params.headLineId !== undefined
      ) {
        createDocumentDto.headLineId = params.headLineId
      }
      const document =
        await apiClient.documentsApiFactory.documentControllerCreateDocument(
          createDocumentDto,
        )
      const pages = [...bookletState.pages].map((page) => {
        if (page.id === props.page.id) {
          return {
            ...page,
            documents: [...page.documents, document.data].sort(
              (a, b) => Number(a.order) - Number(b.order),
            ),
          }
        }
        return page
      })
      const formattedBooklet = {
        ...bookletState,
        pages,
      }
      setBookletState(formattedBooklet)
      try {
        const viewState = params.documentTypeCode === "FILLER" ? null : "Price"
        if (manuscriptState && params.documentTypeCode != "FILLER") {
          setManuscriptState((state) => ({
            ...state,
            document: document.data,
            viewState: viewState,
          }))
        } else {
          setManuscriptState(null)
        }

        const query: any = {
          id: createDocumentDto.bookletId,
          viewMode: "split",
        }
        if (params.documentTypeCode != "FILLER") {
          query.viewState = "Price"
          query.viewMode = "fullscreen"
          query.documentId = document.data.id
          query.viewTarget = "form"
        }
        // 宿編集プレビュー画面に遷移する
        router.push({
          pathname: "/workspace/[id]",
          query: query,
        })
      } catch (error) {
        console.error(error)
        setManuscriptState(null)
      }

      setManuscriptType(null)
      props.onExact()
    } catch (error) {
      console.error(error)
      setApiLoading(false)
    }
  }

  const handleOnClickTemplate = (id: number) => {
    setSelectedTemplateID(id)
    setDisplayStatus("settingsManuscript")
  }

  const templates = useMemo(() => {
    return settings
      ? settings.documentTemplates.map((item) => ({
          id: item.id,
          name: item.name,
          // image: item.image,
          image: "/assets/design-template-sample.png",
        }))
      : []
  }, [settings])

  const headLines = useMemo(() => {
    return settings
      ? settings.documentHeadLines.map((item) => ({
          id: item.id,
          name: item.name,
          // image: item.image,
          image: "/assets/design-template-chart-title.png",
        }))
      : []
  }, [settings])

  const smallAssemblies = useMemo(() => {
    return settings
      ? settings.documentFillers
          .filter((item) => item.documentSizeCode === props.documentSize)
          .map((item) => ({
            ...item,
            id: item.id,
            name: item.name,
            // image: item.image,
            image: "/assets/design-template-small-assembly.png",
          }))
      : []
  }, [props.documentSize, settings])

  const salesManagers = useMemo(() => {
    return settings
      ? settings.salesPersons.map((item) => ({
          label: item.personName,
          value: item.personCognito,
        }))
      : []
  }, [settings])

  const selectedTemplate = useMemo(() => {
    return templates.find((item) => item.id === selectedTemplateID)
  }, [selectedTemplateID, templates])

  const availableRoles = [RolesMock.admin, RolesMock.operator]
  const isShow = availableRoles.some((role) => currentRolesMock.includes(role))

  return (
    <>
      <BaseModal shown={shown} onClickClose={handleOnClose}>
        <MuiFormControl>
          <MuiRadioGroup
            value={value}
            onChange={(event) =>
              handleOnChange(event.target.value as DocumentType)
            }
          >
            <div className='relative h-[320px] w-[600px]'>
              <div className='pt-[56px]'>
                <p className='text-content-primary-dark90 text-center text-lg font-bold'>
                  選択してください
                </p>
                <div className='m-auto mt-4 grid w-[445px] grid-cols-2 gap-6'>
                  <BaseRadioSquare label='宿原稿' value='HOTEL_MANUSCRIPT' />
                  {isShow && (
                    <>
                      <BaseRadioSquare
                        label='見出し'
                        value='HEAD_LINE'
                        disabled={props.documentSize !== "ONE_TWO"}
                      />
                      <BaseRadioSquare label='うめ草' value='FILLER' />
                    </>
                  )}
                </div>
              </div>
              <div className='absolute bottom-0 left-0 flex w-full items-center justify-between px-9 pb-9'>
                <MuiButton
                  color='inherit'
                  variant='outlined'
                  sx={{ width: 104 }}
                  onClick={handleOnClose}
                >
                  キャンセル
                </MuiButton>
                <MuiButton
                  disabled={value === null}
                  variant='contained'
                  sx={{ width: 104 }}
                  onClick={() => setManuscriptType(value)}
                >
                  確定
                </MuiButton>
              </div>
            </div>
          </MuiRadioGroup>
        </MuiFormControl>
      </BaseModal>
      {manuscriptType === "HOTEL_MANUSCRIPT" && (
        <>
          {props.documentSize === "ONE_ONE" && (
            <TemplateModalSelectManuscript
              manuscriptSize={props.documentSize}
              onPrev={() => setManuscriptType(null)}
              onClose={() => setManuscriptType(null)}
              onClick={handleOnClickTemplate}
            />
          )}
          {(props.documentSize !== "ONE_ONE" ||
            displayStatus === "settingsManuscript") && (
            <WorkspaceModalSettingsManuscript
              type='new'
              page={props.page}
              documentSize={props.documentSize}
              salesManagers={salesManagers}
              templateName={selectedTemplate?.name ?? ""}
              onClose={() => {
                setDisplayStatus(null)
                setManuscriptType(null)
              }}
              onPrev={() => {
                setDisplayStatus(null)
                if (props.documentSize !== "ONE_ONE") {
                  setManuscriptType(null)
                }
              }}
              onChange={() => {
                setDisplayStatus(null)
                if (props.documentSize !== "ONE_ONE") {
                  setManuscriptType(null)
                }
              }}
              onExact={handleOnExactDesignTemplate}
              loading={apiLoading}
            />
          )}
        </>
      )}
      <WorkspaceModalSelectDesignTemplateChartTitle
        shown={manuscriptType === "HEAD_LINE"}
        items={headLines}
        onPrev={() => setManuscriptType(null)}
        onClose={() => setManuscriptType(null)}
        onSelect={handleOnSelectDesignTemplateChartTitle}
      />
      <WorkspaceModalSelectDesignTemplateSmallAssembly
        shown={manuscriptType === "FILLER"}
        items={smallAssemblies}
        onPrev={() => setManuscriptType(null)}
        onClose={() => setManuscriptType(null)}
        onSelect={handleOnSelectDesignTemplateSmallAssembly}
      />
    </>
  )
}

WorkspaceModalSelectCopyType.defaultProps = {
  size: "small",
}

export default WorkspaceModalSelectCopyType
