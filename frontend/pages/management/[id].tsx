import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import MuiLink from "@mui/material/Link"
import MuiTab from "@mui/material/Tab"
import MuiTabContext from "@mui/lab/TabContext"
import MuiTabList from "@mui/lab/TabList"
import MuiTabPanel from "@mui/lab/TabPanel"
import MuiBox from "@mui/material/Box"
import { ArrowBack } from "@mui/icons-material"
import { createTheme, ThemeProvider } from "@mui/material"
import selectBoxTheme from "@/config/mui/theme/selectBox"
import ProjectInputOutput from "@/components/domain/project/management/ProjectInputOutput"
import ProjectSettings from "@/components/domain/project/management/ProjectSettings"
import ProjectStatus from "@/components/domain/project/management/ProjectStatus"
import AuthLayout from "@/components/layout/Auth"
import BaseButtonIconText from "@/components/base/button/BaseButtonIconText"
import ProjectDuplicateModal from "@/components/domain/project/ProjectDuplicateModal"
import ProjectDeleteModal from "@/components/domain/project/ProjectDeleteModal"
import { useApiClient } from "@/hooks/useApiClient"
import { ProjectsWithImagesResponseDto } from "@/openapi/api"
import {
  IconData,
  initialSettings,
} from "@/types/page/projectlist/projectSettings"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { currentRolesMock, RolesMock } from "@/config/api/mock/users"
import { useSetRecoilState } from "recoil"
import { GlobalLoadingState } from "@/atoms/global"
import { useShowAlertMessage } from "@/components/domain/global/AlertMessageProvider"
import infoMessage from "@/config/infomessage"

const theme = createTheme(selectBoxTheme)

//-------------------------------------------------------------------------
/**
 * プロジェクト詳細の表示
 *  - 入力/出力、進捗状況、共通設定のタブ内部は別ファイルで実装している。
 *
 * @returns 表示内容
 */
//-------------------------------------------------------------------------
const ProjectlistManagement: NextPage = () => {
  const apiClient = useApiClient()
  const { showAlertMessage } = useShowAlertMessage()
  const [projectNeedToUpdate, setProjectNeedToUpdate] = useState<boolean>(true)
  const setLoadingState = useSetRecoilState(GlobalLoadingState)
  const [project, setProject] =
    useState<ProjectsWithImagesResponseDto>(undefined)
  const router = useRouter()
  const [deleteProject, setDeleteProject] =
    useState<ProjectsWithImagesResponseDto>(undefined)

  const { id, plate, status } = router.query

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const tabsInfo = [
    {
      label: "入力/出力",
      value: "1",
      availableRoles: [
        RolesMock.admin,
        RolesMock.operator,
        RolesMock.manuscriptOperator,
      ],
    },
    {
      label: "進捗状況",
      value: "2",
      availableRoles: [
        RolesMock.admin,
        RolesMock.operator,
        RolesMock.manuscriptOperator,
        RolesMock.csReplenishmentManager,
      ],
    },
    {
      label: "共通設定",
      value: "3",
      availableRoles: [
        RolesMock.admin,
        RolesMock.operator,
        RolesMock.manuscriptOperator,
        RolesMock.manuscriptUpdator,
        RolesMock.outsourcingManager,
        RolesMock.csReplenishmentManager,
      ],
    },
  ]

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const accessibleTabs = tabsInfo.filter((tabInfo) =>
    tabInfo.availableRoles.some((role) => currentRolesMock.includes(role)),
  )

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState<string>(
    accessibleTabs.length > 0 ? accessibleTabs[0].value : "1",
  )

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const AreaEnum = {
    HOKKAIDO: "北海道",
    TOUHOKU: "東北",
    JOSHINETSU: "上信越",
    KITA_KANTO: "北関東",
    KANTO: "関東",
    TOKAI: "東海",
    KANSAI: "関西",
    HOKURIKU: "北陸",
    TOUKAI_HOKURIKU: "東海・北陸",
    KANSAI_HOKURIKU: "関西・北陸",
    CHUGOKU_SHIKOKU: "中国・四国",
    KYUSHU: "九州",
    TEST: "テスト",
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const StatusEnum = {
    MAKING: "制作中",
    NOT_START: "未着手",
    CHECKING: "入稿確認中",
    SEND_BACK: "差し戻し",
    PROOFREADING: "校了",
    MATCHED: "マッチングOK",
    UNUSED: "不要原稿",
    MYSTOCK: "下書き原稿",
  }

  //-------------------------------------------------------------------------
  /**
   * API連携
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    if (!projectNeedToUpdate) return
    ;(async () => {
      if (!id) return
      try {
        const response =
          await apiClient.projectsApiFactory.projectControllerDetails(
            Number(id),
          )
        setProject(response.data)
      } catch (error: any) {
        console.log("error: ", error)
      }
    })()
    setProjectNeedToUpdate(false)
  }, [router.query, projectNeedToUpdate]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   * @param event
   * @param newValue
   */
  //-------------------------------------------------------------------------
  const handleOnChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue)
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param iconData
   * @returns
   */
  //-------------------------------------------------------------------------
  const getFileElseEmpty = (iconData: IconData): File => {
    if (iconData) {
      return iconData.file
    }
    return new File([""], "")
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param setting
   * @param selectedPlates
   */
  //-------------------------------------------------------------------------
  const handleOnSave = async (
    setting: typeof initialSettings,
    selectedPlates: string[],
  ) => {
    try {
      setLoadingState(true)
      const request = {
        id: Number(id),
        salesStartDate: setting.salesStartDate,
        salesEndDate: setting.salesEndDate,
        reviewRatingStartDate: setting.reviewRatingStartDate,
        reviewRatingEndDate: setting.reviewRatingEndDate,
        bookletEnables: selectedPlates,
        thumbIndexId: setting.thumbIndexId,
        headLineId: setting.headLineId,
        openAirIconOn: getFileElseEmpty(setting.openAirIconOn),
        openAirIconOff: getFileElseEmpty(setting.openAirIconOff),
        freeFlowingIconOn: getFileElseEmpty(setting.freeFlowingIconOn),
        freeFlowingIconOff: getFileElseEmpty(setting.freeFlowingIconOff),
        elevatorIconOn: getFileElseEmpty(setting.elevatorIconOn),
        elevatorIconOff: getFileElseEmpty(setting.elevatorIconOff),
        sameDayReservationIconOn: getFileElseEmpty(
          setting.sameDayReservationIconOn,
        ),
        sameDayReservationIconOff: getFileElseEmpty(
          setting.sameDayReservationIconOff,
        ),
        pickUpAvailableIconOn: getFileElseEmpty(setting.pickUpAvailableIconOn),
        pickUpAvailableIconOff: getFileElseEmpty(
          setting.pickUpAvailableIconOff,
        ),
        noSmokingIconOn: getFileElseEmpty(setting.noSmokingIconOn),
        noSmokingIconOff: getFileElseEmpty(setting.noSmokingIconOff),
        dinnerVenueMeal: getFileElseEmpty(setting.dinnerVenueMeal),
        dinnerPrivateRoomDining: getFileElseEmpty(
          setting.dinnerPrivateRoomDining,
        ),
        dinnerRoomMeal: getFileElseEmpty(setting.dinnerRoomMeal),
        dinnerVenueMealOorPrivateDiningRoom: getFileElseEmpty(
          setting.dinnerVenueMealOorPrivateDiningRoom,
        ),
        dinnerVenueMealOrRoomService: getFileElseEmpty(
          setting.dinnerVenueMealOrRoomService,
        ),
        dinnerRoomOrPrivateDiningRoom: getFileElseEmpty(
          setting.dinnerRoomOrPrivateDiningRoom,
        ),
        dinnerNone: getFileElseEmpty(setting.dinnerNone),
        breakfastVenueMeal: getFileElseEmpty(setting.breakfastVenueMeal),
        breakfastPrivateRoomDining: getFileElseEmpty(
          setting.breakfastPrivateRoomDining,
        ),
        breakfastRoomMeal: getFileElseEmpty(setting.breakfastRoomMeal),
        breakfastVenueMealOorPrivateDiningRoom: getFileElseEmpty(
          setting.breakfastVenueMealOorPrivateDiningRoom,
        ),
        breakfastVenueMealOrRoomService: getFileElseEmpty(
          setting.breakfastVenueMealOrRoomService,
        ),
        breakfastRoomOrPrivateDiningRoom: getFileElseEmpty(
          setting.breakfastRoomOrPrivateDiningRoom,
        ),
        breakfastNone: getFileElseEmpty(setting.breakfastNone),
        issueDataImage: setting.issueDataImage.file,
        consumptionTax: setting.consumptionTax,
        tax: undefined,
        pageMountId: setting.pageMountId,
      }

      await apiClient.projectsApiFactory.projectControllerProjectSetting(
        request.id,
        request.salesStartDate,
        request.salesEndDate,
        request.reviewRatingStartDate,
        request.reviewRatingEndDate,
        request.bookletEnables,
        request.thumbIndexId,
        request.headLineId,
        request.openAirIconOn,
        request.openAirIconOff,
        request.freeFlowingIconOn,
        request.freeFlowingIconOff,
        request.elevatorIconOn,
        request.elevatorIconOff,
        request.sameDayReservationIconOn,
        request.sameDayReservationIconOff,
        request.pickUpAvailableIconOn,
        request.pickUpAvailableIconOff,
        request.noSmokingIconOn,
        request.noSmokingIconOff,
        request.dinnerVenueMeal,
        request.dinnerPrivateRoomDining,
        request.dinnerRoomMeal,
        request.dinnerVenueMealOorPrivateDiningRoom,
        request.dinnerVenueMealOrRoomService,
        request.dinnerRoomOrPrivateDiningRoom,
        request.dinnerNone,
        request.breakfastVenueMeal,
        request.breakfastPrivateRoomDining,
        request.breakfastRoomMeal,
        request.breakfastVenueMealOorPrivateDiningRoom,
        request.breakfastVenueMealOrRoomService,
        request.breakfastRoomOrPrivateDiningRoom,
        request.breakfastNone,
        request.issueDataImage,
        request.consumptionTax,
        request.tax,
        request.pageMountId,
      )

      const response =
        await apiClient.projectsApiFactory.projectControllerDetails(Number(id))
      setProject(response.data)

      showAlertMessage("success", infoMessage.SAVE_SUCCESS)
    } catch (error) {
      showAlertMessage(
        "error",
        error.response ? error.response.data.message : error.message,
      )
    } finally {
      setLoadingState(false)
    }
  }

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <AuthLayout>
      <ThemeProvider theme={theme}>
        <MuiTabContext value={selectedTab}>
          <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary'>
            <div className='px-10 pt-6'>
              {project !== undefined &&
              plate !== undefined &&
              status !== undefined ? (
                <MuiLink
                  component='a'
                  sx={{ textDecoration: "none" }}
                  onClick={() =>
                    router.push({ pathname: "/management/[id]", query: { id } })
                  }
                >
                  <div className='flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                    <ArrowBack
                      sx={{ width: 18, height: 18, marginLeft: "-3px" }}
                    />
                    {`${project.mediaType.name}${project.issueYear}年${project.issueMonth}月号に戻る`}
                  </div>
                </MuiLink>
              ) : (
                <Link href='/'>
                  <span className='inline-flex cursor-pointer items-center text-xs leading-none text-content-default-secondary'>
                    <ArrowBack
                      sx={{ width: 18, height: 18, marginLeft: "-3px" }}
                    />
                    プロジェクトリストに戻る
                  </span>
                </Link>
              )}
              {project !== undefined && (
                <>
                  <div className='mt-4 flex items-end justify-between'>
                    <h1 className='space-x-5 text-xl font-bold leading-9 text-gray-90'>
                      {plate !== undefined &&
                      status !== undefined &&
                      selectedTab === "2" ? (
                        <>
                          <span>{AreaEnum[plate as string]}</span>
                          <span>{StatusEnum[status as string]}</span>
                        </>
                      ) : (
                        `${project.mediaType.name} ${project.issueYear}年 ${project.issueMonth}月号`
                      )}
                    </h1>
                    <RenderWithRoles
                      roles={[
                        RolesMock.admin,
                        RolesMock.operator,
                        RolesMock.manuscriptUpdator,
                        RolesMock.outsourcingManager,
                        RolesMock.csReplenishmentManager,
                      ]}
                    >
                      <div className='flex items-center space-x-3'>
                        <ProjectDuplicateModal
                          id={project.id}
                          year={project.issueYear}
                          month={project.issueMonth}
                          mediaType={project.mediaType}
                          onComplete={() => router.push("/")}
                        />
                        <BaseButtonIconText
                          icon='delete'
                          text='削除'
                          size='small'
                          onClick={() => setDeleteProject(project)}
                        />
                      </div>
                    </RenderWithRoles>
                  </div>
                  <div className='mt-7'>
                    <MuiBox sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <MuiTabList
                        onChange={handleOnChangeTab}
                        sx={{ minHeight: "40px" }}
                      >
                        {tabsInfo.map((tabInfo) => {
                          if (
                            tabInfo.availableRoles.some((role) =>
                              currentRolesMock.includes(role),
                            )
                          ) {
                            return (
                              <MuiTab
                                key={tabInfo.value}
                                sx={{ minHeight: "40px", padding: "9px 16px" }}
                                label={tabInfo.label}
                                value={tabInfo.value}
                              />
                            )
                          }
                          return null
                        })}
                      </MuiTabList>
                    </MuiBox>
                  </div>
                </>
              )}
            </div>

            {project !== undefined && (
              <div className='overflow-y-auto px-10 pb-10'>
                {/*
                ------------------------
                    タブ：入力/出力
                ------------------------
                */}
                <MuiTabPanel value='1'>
                  <ProjectInputOutput
                    onProjectChange={() => {
                      setProjectNeedToUpdate(true)
                    }}
                    project={project}
                  />
                </MuiTabPanel>
                {/*
                ------------------------
                    タブ：進捗状況
                ------------------------
                */}
                <MuiTabPanel value='2' sx={{ padding: 0 }}>
                  <ProjectStatus
                    projectId={Number(id)}
                    project={project}
                    updateLock={(value: boolean, bookletId: number) => {
                      setProject((prev) => ({
                        ...prev,
                        booklets: prev.booklets.map((bk) => {
                          if (bk.id == bookletId) bk.locked = value
                          return bk
                        }),
                      }))
                    }}
                  />
                </MuiTabPanel>
                {/*
                ------------------------
                    タブ：共通設定
                ------------------------
                */}
                <MuiTabPanel value='3' sx={{ padding: 0 }}>
                  <ProjectSettings
                    project={project}
                    headings={project.headLines.map((headline) => ({
                      label: headline.name,
                      value: headline.id,
                    }))}
                    thumbIndexes={project.thumbIndexes.map((thumbIndex) => ({
                      label: thumbIndex.name,
                      value: thumbIndex.id,
                    }))}
                    footers={project.marginBottoms.map((marginBottom) => ({
                      label: marginBottom.name,
                      value: marginBottom.id,
                    }))}
                    onSave={handleOnSave}
                  />
                </MuiTabPanel>
              </div>
            )}
          </div>
        </MuiTabContext>
      </ThemeProvider>
      {deleteProject && (
        <ProjectDeleteModal
          id={deleteProject.id}
          media={deleteProject.mediaType.name}
          year={deleteProject.issueYear}
          month={deleteProject.issueMonth}
          onClose={() => setDeleteProject(undefined)}
          onComplete={() => router.push("/")}
        />
      )}
    </AuthLayout>
  )
}

export default ProjectlistManagement
