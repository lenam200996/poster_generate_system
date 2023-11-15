import { useEffect, useMemo, useState } from "react"
import { useSetRecoilState } from "recoil"
import { DocumentSizeType, Order } from "@/config/api/mock/workspace/booklet"
import BaseModal from "@/components/base/overlay/BaseModal/index"
import BaseRadioSquare from "@/components/base/form/BaseRadioSquare"
import MuiFormControl from "@mui/material/FormControl"
import MuiRadioGroup from "@mui/material/RadioGroup"
import MuiButton from "@mui/material/Button"
import MuiDivider from "@mui/material/Divider"
import WorkspaceModalCreateLink from "@/components/page/workspace/Modal/WorkspaceModalCreateLink"
import WorkspaceModalOutputCofirmPlan from "@/components/page/workspace/Modal/WorkspaceModalOutputCofirmPlan"
import WorkspaceModalDeletePlan from "@/components/page/workspace/Modal/WorkspaceModalDeletePlan"
import WorkspaceModalSettingsManuscript from "@/components/page/workspace/Modal/WorkspaceModalSettingsManuscript"
import WorkspaceModalSelectAlias from "@/components/page/workspace/Modal/WorkspaceModalSelectAlias"
import WorkspaceModalProofreadingRequest from "../WorkspaceModalProofreadingRequest"
import TemplateModalSelectManuscript from "@/components/domain/template/TemplateModalSelectManuscript"
import { workspaceManuscriptState } from "@/atoms/workspace"
import { useApiClient } from "@/hooks/useApiClient"
import {
  DocumentResponseDto,
  DocumentSettingsDto,
  HotelInfoResponse,
  MasterDocumentStatusDtoCodeEnum,
  MasterDocumentTypeDtoCodeEnum,
  PageForBookletDto,
  UpdateDocumentDto,
} from "@/openapi"
import WorkspaceModalMoveManuscript from "../WorkspaceModalMoveManuscript"
import { workspaceActivePageNumberState } from "@/atoms/workspace"
import { useRouter } from "next/router"
import WorkspaceModalSelectDiversion from "../WorkspaceModalSelectDiversion"
import WorkspaceModalRemoveAlias from "../WorkspaceModalRemoveAlias"
import WorkspaceModalProofreading from "../WorkspaceModalProofreading"

type DisplayStatus =
  | "edit"
  | "settingPlan"
  | "copyLink"
  | "outputConfirmPlan"
  | "deletePlan"
  | "selectManuscript"
  | "selectAlias"
  | "removeAlias"
  | "diversion"
  | "outputProofreading"
  | "outputProofreadingRequest"
  | "move"
  | "none"

type Props = {
  page: PageForBookletDto
  documentSize: DocumentSizeType
  order: Order
  onClose?: Function
  bookletLocked: boolean
}

const WorkspaceModalPlanOperation = (props: Props) => {
  const apiClient = useApiClient()
  const router = useRouter()
  const setActivePageNumber = useSetRecoilState(workspaceActivePageNumberState)
  const setManuscriptState = useSetRecoilState(workspaceManuscriptState)

  const [value, setValue] = useState<DisplayStatus>(null)
  const [displayStatus, setDisplayStatus] = useState<DisplayStatus>("none")
  const [planTitle, setPlanTitle] = useState("")

  const [manuscript, setManuscript] = useState<DocumentResponseDto>(null)
  const [settings, setSettings] = useState<DocumentSettingsDto>(null)
  const [selectedTemplateID, setSelectedTemplateID] = useState<number | null>(
    null,
  )

  const handleOnClose = () => {
    if (!props.onClose) return
    props.onClose()
    setDisplayStatus("none")
  }

  const handleOnComplete = () => {
    setValue(null)
    setDisplayStatus("none")
    router.push({
      pathname: "/workspace/[id]",
      query: {
        id: router.query.id,
        viewMode: "split",
      },
    })
    props.onClose()
  }

  const handleOnClickNext = async () => {
    if (["settingPlan", "selectManuscript"].includes(value)) {
      const response =
        await apiClient.settingsApiFactory.settingControllerDocumentSetting()
      setSettings(response.data)
    }

    if (value === "edit") {
      try {
        // 宿編集ボタン押下後、編集中のIDML情報を取得して、宿編集プレビュー画面に遷移する
        const documentFind = props.page.documents.find(
          (e) => e.order === props.order,
        )
        const dataDocument =
          await apiClient.documentsApiFactory.documentControllerGetDocument(
            documentFind.id,
          )
        const document = dataDocument.data
        if (document.documentContent.mainPlanCode) {
          router.push({
            pathname: "/workspace/[id]",
            query: {
              id: document.bookletId,
              viewMode: "split",
              documentId: document.id,
            },
          })
        } else {
          router.push({
            pathname: "/workspace/[id]",
            query: {
              id: document.bookletId,
              viewMode: "fullscreen",
              viewTarget: "form",
              documentId: document.id,
              viewState: "Price",
            },
          })
          setManuscriptState((state) => ({
            ...state,
            document,
            viewState: "Price",
          }))
        }
      } catch (error) {
        console.error(error)
      }

      handleOnClose()
    }

    setDisplayStatus(value)
  }

  const handleOnClickTemplate = (id: number) => {
    setSelectedTemplateID(id)
    apiClient.documentsApiFactory
      .documentControllerUpdateDocument(manuscript.id, {
        manuscriptPersonCognito: manuscript.manuscriptPersonCognito,
        salesPersonCognito: manuscript.salesPersonCognito,
        templateId: id,
        hotelCode: manuscript.hotelCode,
      })
      .then(() => {
        setDisplayStatus("settingPlan")
      })
  }
  useEffect(() => {}, [])

  useEffect(() => {
    const manuscript = props.page.documents.find((e) => e.order === props.order)
    if (!manuscript) return

    setManuscript(manuscript)
    if (manuscript) {
      if (manuscript.templateId) {
        setSelectedTemplateID(manuscript.templateId)
      }
      let hotelName = ""
      switch (manuscript.documentTypeCode) {
        case "FILLER":
          hotelName = "うめ草"
          break
        case "HEAD_LINE":
          hotelName = "見出し"
          break
        default:
          hotelName = manuscript.documentContent?.hotelNameLarge
          break
      }
      setPlanTitle(hotelName)
    }
  }, [props.order, props.page.documents])

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

  const handleOnExactDesignTemplate = async ({
    hotelInfo,
    salesManager,
  }: {
    hotelInfo: HotelInfoResponse
    salesManager: string
  }) => {
    if (hotelInfo) {
      const updateDocumentDto: UpdateDocumentDto = {
        templateId: selectedTemplateID,
        hotelCode: hotelInfo?.hotelCode,
        salesPersonCognito: salesManager ?? "AAAXXXCCVCC",
        manuscriptPersonCognito: salesManager ?? "AAAXXXCCVCC",
      }
      // 原稿情報を更新
      const documentResponse =
        await apiClient.documentsApiFactory.documentControllerUpdateDocument(
          manuscript.id,
          updateDocumentDto,
        )

      // IDML編集情報を更新
      const editId = `${manuscript.projectId}_${manuscript.bookletId}_${manuscript.id}`
      const idmlResponse =
        await apiClient.idmlReplaceApiFactory.idmlReplaceControllerGetWorkspaceItems(
          editId,
          "template",
        )
      setManuscriptState((state) => ({
        ...state,
        hotelCode: Number(hotelInfo.hotelCode),
        items: idmlResponse.data.items,
        document: documentResponse.data,
        viewState: "Price",
      }))
    }

    setDisplayStatus("none")
    props.onClose()
  }

  const isNotManuscript = () => {
    return (
      manuscript?.documentTypeCode !==
      MasterDocumentTypeDtoCodeEnum.HotelManuscript
    )
  }

  const isNotInStatus = (status: MasterDocumentStatusDtoCodeEnum[]) => {
    return manuscript?.status?.code && !status.includes(manuscript.status.code)
  }

  const isAliasManuscript = () => {
    return manuscript && manuscript.aliasId !== null
  }

  return (
    <>
      <BaseModal shown={!!manuscript} onClickClose={handleOnClose}>
        <MuiFormControl>
          <MuiRadioGroup
            value={value}
            onChange={(event) => setValue(event.target.value as DisplayStatus)}
          >
            <div className='relative h-[570px] w-[860px]'>
              <div className='pt-[56px]'>
                <MuiDivider
                  sx={{ width: 570, margin: "auto", color: "#1976D2" }}
                  textAlign='center'
                >
                  操作
                </MuiDivider>
                <div className='m-auto mb-11 mt-9 grid w-max grid-cols-3 gap-5'>
                  <BaseRadioSquare
                    label='編集'
                    value='edit'
                    disabled={
                      isNotManuscript() ||
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.NotStart,
                        MasterDocumentStatusDtoCodeEnum.Making,
                        MasterDocumentStatusDtoCodeEnum.SendBack,
                        MasterDocumentStatusDtoCodeEnum.Proofreading,
                      ]) ||
                      props.bookletLocked
                    }
                  />
                  <BaseRadioSquare
                    label='移動'
                    value='move'
                    disabled={
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.NotStart,
                        MasterDocumentStatusDtoCodeEnum.Making,
                        MasterDocumentStatusDtoCodeEnum.SendBack,
                        MasterDocumentStatusDtoCodeEnum.Proofreading,
                      ]) || props.bookletLocked
                    }
                  />
                  <BaseRadioSquare
                    label='削除'
                    value='deletePlan'
                    disabled={
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.NotStart,
                        MasterDocumentStatusDtoCodeEnum.Making,
                        MasterDocumentStatusDtoCodeEnum.SendBack,
                      ]) || props.bookletLocked
                    }
                  />
                </div>
                <MuiDivider
                  sx={{ width: 570, margin: "auto", color: "#1976D2" }}
                  textAlign='center'
                >
                  設定
                </MuiDivider>
                <div className='m-auto mb-11 mt-9 grid w-max grid-cols-3 gap-5'>
                  <BaseRadioSquare
                    label='原稿設定'
                    value='settingPlan'
                    disabled={
                      isNotManuscript() ||
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.NotStart,
                        MasterDocumentStatusDtoCodeEnum.Making,
                      ]) ||
                      isAliasManuscript() ||
                      props.bookletLocked
                    }
                  />
                  {isAliasManuscript() ? (
                    <BaseRadioSquare
                      label='相乗り解除'
                      value='removeAlias'
                      disabled={
                        isNotManuscript() ||
                        isNotInStatus([
                          MasterDocumentStatusDtoCodeEnum.NotStart,
                          MasterDocumentStatusDtoCodeEnum.Making,
                        ]) ||
                        props.bookletLocked
                      }
                    />
                  ) : (
                    <BaseRadioSquare
                      label='相乗り設定'
                      value='selectAlias'
                      disabled={
                        isNotManuscript() ||
                        isNotInStatus([
                          MasterDocumentStatusDtoCodeEnum.NotStart,
                          MasterDocumentStatusDtoCodeEnum.Making,
                        ]) ||
                        props.bookletLocked ||
                        manuscript.sharingAliasTo?.length !== 0
                      }
                    />
                  )}
                  <BaseRadioSquare
                    label='流用指示'
                    value='diversion'
                    disabled={
                      isNotManuscript() ||
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.NotStart,
                        MasterDocumentStatusDtoCodeEnum.Making,
                      ]) ||
                      isAliasManuscript() ||
                      props.bookletLocked
                    }
                  />
                </div>
                <MuiDivider
                  sx={{ width: 570, margin: "auto", color: "#1976D2" }}
                  textAlign='center'
                >
                  書き出し
                </MuiDivider>
                <div className='m-auto mt-9 grid w-max grid-cols-3 gap-5'>
                  <BaseRadioSquare
                    label='リンク発行'
                    value='copyLink'
                    disabled={isNotManuscript() || isAliasManuscript()}
                  />
                  <BaseRadioSquare
                    label='確認用'
                    value='outputConfirmPlan'
                    disabled={
                      isNotManuscript() ||
                      isNotInStatus([
                        MasterDocumentStatusDtoCodeEnum.Making,
                        MasterDocumentStatusDtoCodeEnum.Checking,
                        MasterDocumentStatusDtoCodeEnum.SendBack,
                        MasterDocumentStatusDtoCodeEnum.Proofreading,
                      ]) ||
                      isAliasManuscript()
                    }
                  />
                  {manuscript?.status.code ===
                    MasterDocumentStatusDtoCodeEnum.SendBack ||
                  manuscript?.status.code ===
                    MasterDocumentStatusDtoCodeEnum.Proofreading ? (
                    <BaseRadioSquare
                      label='校了'
                      value='outputProofreading'
                      disabled={
                        isNotManuscript() ||
                        isNotInStatus([
                          MasterDocumentStatusDtoCodeEnum.SendBack,
                        ]) ||
                        isAliasManuscript()
                      }
                    />
                  ) : (
                    <BaseRadioSquare
                      label='校正依頼用'
                      value='outputProofreadingRequest'
                      disabled={
                        isNotManuscript() ||
                        isNotInStatus([
                          MasterDocumentStatusDtoCodeEnum.Making,
                        ]) ||
                        isAliasManuscript()
                      }
                    />
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
                  onClick={handleOnClickNext}
                >
                  次へ
                </MuiButton>
              </div>
            </div>
          </MuiRadioGroup>
        </MuiFormControl>
      </BaseModal>
      {(displayStatus === "settingPlan" ||
        displayStatus === "selectManuscript") === true && (
        <WorkspaceModalSettingsManuscript
          page={props.page}
          documentSize={props.documentSize}
          type='edit'
          templateName={selectedTemplate?.name}
          hotelCode={manuscript.hotelCode}
          hotelName={manuscript.documentContent.hotelNameLarge}
          salesManager={
            settings.salesPersons.find(
              (item) => item.personCognito === manuscript.salesPersonCognito,
            )?.personCognito ?? ""
          }
          salesManagers={salesManagers}
          onClose={() => setDisplayStatus("none")}
          onPrev={() => setDisplayStatus("none")}
          onChange={() => setDisplayStatus("selectManuscript")}
          onExact={handleOnExactDesignTemplate}
        />
      )}
      {displayStatus === "selectManuscript" && (
        <TemplateModalSelectManuscript
          manuscriptSize={
            props.page.documents[props.order - 1].documentSizeCode
          }
          onClick={handleOnClickTemplate}
          onClose={() => setDisplayStatus("settingPlan")}
          onPrev={() => setDisplayStatus("settingPlan")}
        />
      )}
      {displayStatus === "copyLink" && (
        <WorkspaceModalCreateLink
          manuscript={manuscript}
          onClose={() => setDisplayStatus("none")}
        />
      )}
      {displayStatus === "outputConfirmPlan" && (
        <WorkspaceModalOutputCofirmPlan
          planTitle={planTitle}
          onClose={() => setDisplayStatus("none")}
        />
      )}
      {displayStatus === "deletePlan" && (
        <WorkspaceModalDeletePlan
          id={props.page.id}
          order={props.order}
          planTitle={planTitle}
          onClose={() => setDisplayStatus("none")}
          onComplete={handleOnComplete}
        />
      )}
      {displayStatus === "outputProofreadingRequest" && (
        <WorkspaceModalProofreadingRequest
          document={manuscript}
          onClose={() => setDisplayStatus("none")}
          onComplete={handleOnComplete}
        />
      )}
      {displayStatus === "outputProofreading" && (
        <WorkspaceModalProofreading
          document={manuscript}
          onClose={() => setDisplayStatus("none")}
          onComplete={handleOnComplete}
        />
      )}
      {displayStatus === "removeAlias" && (
        <WorkspaceModalRemoveAlias
          document={manuscript}
          onClose={() => setDisplayStatus("none")}
          onExact={() => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                refresh: true,
              },
            })
            setDisplayStatus("none")
          }}
        />
      )}
      {displayStatus === "selectAlias" && (
        <WorkspaceModalSelectAlias
          document={manuscript}
          onClose={() => setDisplayStatus("none")}
          onExact={() => {
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                refresh: true,
              },
            })
            setDisplayStatus("none")
            props.onClose()
          }}
        />
      )}
      {displayStatus === "diversion" && (
        <WorkspaceModalSelectDiversion
          document={manuscript}
          onClose={() => {
            setDisplayStatus("none")
          }}
          onExact={() => setDisplayStatus("none")}
        />
      )}
      {displayStatus === "move" && (
        <WorkspaceModalMoveManuscript
          onClose={() => {
            setDisplayStatus("none")
            setActivePageNumber(null)
          }}
          pageNumber={props.page.pageNumber}
          order={props.order}
        />
      )}
    </>
  )
}

export default WorkspaceModalPlanOperation
