import type { NextPage } from "next"
import { useRecoilState, useResetRecoilState } from "recoil"
import { projectlistShownsState, projectsState } from "@/atoms/projectlist"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import { useState, useEffect, useMemo, useCallback } from "react"
import { manuscriptSizesMock, orderList } from "@/config/api/mock/projects"
import AuthLayout from "@/components/layout/Auth"
import ProjectFilter from "@/components/domain/project/ProjectFilter"
import ProjectMagazines from "@/components/domain/project/ProjectMagazines"
import BaseSortSelectbox from "@/components/base/form/BaseSortSelectbox"
import IconButton from "@mui/material/IconButton"
import dayjs from "@/util/dayjs"
import ProjectFilteredManuscripts from "@/components/domain/project/ProjectFilteredManuscripts"
import ProjectFilteredBooklets from "@/components/domain/project/ProjectFilteredBooklets"
import { useRouter } from "next/router"
import ProjectNewProjectModal from "@/components/domain/project/ProjectNewProjectModal"
import { useApiClient } from "@/hooks/useApiClient"
import {
  DocumentSearchWithCountDto,
  BookletSearchWithCountDto,
  BookletDetailResponseDtoEditionCodeEnum,
  MasterMediaTypeDtoCodeEnum,
} from "@/openapi/api"
import MuiCircularProgress from "@mui/material/CircularProgress"

//-------------------------------------------------------------------------
/**
 *
 */
//-------------------------------------------------------------------------
type SelectOptionsType = {
  label: string
  value: string
}[]

//-------------------------------------------------------------------------
/**
 *
 * @returns
 */
//-------------------------------------------------------------------------
const Yukichi: NextPage = () => {
  const apiClient = useApiClient()
  const router = useRouter()
  const [filteredBooklets, setFilteredBooklets] = useState<
    BookletSearchWithCountDto["data"]
  >([])
  const [filteredManuscripts, setFilteredManuscripts] = useState<
    DocumentSearchWithCountDto["data"]
  >([])
  const [selectedSortValue, setSelectedSortValue] = useState<string>("")
  const [projectsRecoilState, setProjectsRecoilState] =
    useRecoilState(projectsState)
  const [projects, setProjects] = useState([])
  const [showns, setShowns] = useRecoilState(projectlistShownsState)
  const resetShownsState = useResetRecoilState(projectlistShownsState)
  const [bookletValues, setBookletValues] = useState<number[]>([])
  const [allShown, setAllShown] = useState<boolean>(false)
  const [filterYearMonthOptions, setFilterYearMonthOptions] =
    useState<SelectOptionsType>([])
  const [filterConditions, setFilterConditions] = useState<
    FilterSearchCondition[]
  >([])
  const [progress, setProgress] = useState(false)

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const handleOnClickAll = () => {
    if (showns.length === bookletValues.length) {
      setShowns([])
    } else {
      setShowns([...bookletValues])
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param value
   */
  //-------------------------------------------------------------------------
  const handleOnChangeSort = (value: string) => {
    setSelectedSortValue(value)
  }

  //-------------------------------------------------------------------------
  /**
   *
   * @param conditions
   */
  //-------------------------------------------------------------------------
  const handleOnSearch = (conditions: FilterSearchCondition[]) => {
    setFilterConditions(conditions)
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const handleOnCreate = async () => {
    try {
      const resposne =
        await apiClient.projectsApiFactory.projectControllerList()
      setProjectsRecoilState(resposne.data.data)
    } catch (error) {
      console.error(error)
    }
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    ;(async () => {
      try {
        setProgress(true)
        const response =
          await apiClient.projectsApiFactory.projectControllerList()
        setProjectsRecoilState(response.data.data)
      } catch (error: any) {
        console.error("error: ", error)
      } finally {
        setProgress(false)
      }
    })()
  }, []) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    ;(async () => {
      if (filterConditions.length === 0) return
      try {
        setProgress(true)
        const getConditionList = (key: FilterSearchCondition["key"]) => {
          const items = filterConditions.filter((item) => item.key === key)
          return items.length === 1
            ? items.map((item) => item.value)[0].split(",")
            : []
        }
        const statusCodes = getConditionList("status")
        const mediaTypeCodes = getConditionList("media")
        const editionCodes = getConditionList("edition")
        const issueYearMonth = getConditionList("yearMonth")
        const hotelCode = getConditionList("hotelCode")
        const hotelName = getConditionList("hotelName")
        const documentSizeCode = getConditionList("size")
        const salesPersonCognito = getConditionList("sales")
        const manuscriptPersonCognito = getConditionList("manuscript")
        const documentCode = getConditionList("manuscriptID")
        const documentModifiedAt = getConditionList("updated")

        const params = {
          take: undefined,
          skip: undefined,
          projectId: undefined,
          statusCodes: [...statusCodes],
          mediaTypeCodes: [...mediaTypeCodes],
          editionCodes: [...editionCodes],
          issueYearMonth: [...issueYearMonth],
          hotelCode: hotelCode[0],
          hotelName: hotelName[0],
          documentSizeCode: documentSizeCode[0],
          manuscriptPersonCognito: [...manuscriptPersonCognito],
          salesPersonCognito: [...salesPersonCognito],
          documentCode,
          documentModifiedAtFrom: documentModifiedAt[0] ?? undefined,
          documentModifiedAtTo: documentModifiedAt[1] ?? undefined,
        }

        const response =
          await apiClient.documentsApiFactory.documentControllerSearch(
            params.take,
            params.skip,
            params.projectId,
            params.statusCodes,
            params.mediaTypeCodes,
            params.editionCodes,
            params.issueYearMonth,
            params.hotelCode,
            params.hotelName,
            // @ts-ignore
            params.documentSizeCode,
            params.manuscriptPersonCognito,
            params.salesPersonCognito,
            params.documentCode,
            params.documentModifiedAtFrom,
            params.documentModifiedAtTo,
          )

        const paramsBooklets = {
          editionCodes: [
            ...editionCodes,
          ] as Array<BookletDetailResponseDtoEditionCodeEnum>,
          mediaTypeCodes: [
            ...mediaTypeCodes,
          ] as Array<MasterMediaTypeDtoCodeEnum>,
          issueYearMonth: [...issueYearMonth],
          bookletModifiedAtFrom: documentModifiedAt[0] ?? undefined,
          bookletModifiedAtTo: documentModifiedAt[1] ?? undefined,
        }
        const responseBooklets =
          await apiClient.bookletApiFactory.bookletControllerSearch(
            paramsBooklets.editionCodes,
            paramsBooklets.mediaTypeCodes,
            paramsBooklets.issueYearMonth,
            paramsBooklets.bookletModifiedAtFrom,
            paramsBooklets.bookletModifiedAtTo,
          )

        setFilteredManuscripts(response.data.data)
        setFilteredBooklets(responseBooklets.data.data)
      } catch (error: any) {
        console.error("error: ", error)
      } finally {
        setProgress(false)
      }
    })()
  }, [filterConditions]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    const yearMonth = projects
      .map((item) =>
        dayjs(`${item.issueYear}-${item.issueMonth}`).format("YYYY-MM"),
      )
      .sort((a, b) => (a > b ? -1 : 0))
    setFilterYearMonthOptions(
      Array.from(new Set(yearMonth)).map((item) => ({
        label: dayjs(item).format("YYYY年M月号"),
        value: item,
      })),
    )

    const projectIDs = projects.map((magazine) => magazine.id)
    setBookletValues(projectIDs)
    setShowns((state) => state.filter((id) => projectIDs.includes(id)))
  }, [projects, setShowns])

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    resetShownsState()
  }, []) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    if (showns.length === 0) {
      setAllShown(false)
    } else if (showns.length === bookletValues.length) {
      setAllShown(true)
    }
  }, [showns]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   * @param url
   * @returns
   */
  //-------------------------------------------------------------------------
  const parseQueryParameters = (url) => {
    const queryParamRegex = /[?&]([^=&]+)(=([^&]*))?/g
    const queryParams = {}
    let match

    while ((match = queryParamRegex.exec(url)) !== null) {
      const paramName = decodeURIComponent(match[1])
      const paramValue =
        match[3] !== undefined ? decodeURIComponent(match[3]) : null
      queryParams[paramName] = paramValue
    }

    return queryParams
  }

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    const conditions = []
    const query = parseQueryParameters(router.asPath)
    Object.keys(query).forEach((key) => {
      if (
        [
          "status",
          "media",
          "edition",
          "yearMonth",
          "hotelCode",
          "hotelName",
          "size",
          "sales",
          "manuscript",
          "updated",
        ].includes(key)
      ) {
        const value = String(query[key])
        if (value !== "") {
          conditions.push({
            key,
            value,
          })
        }
      }
    })
    resetShownsState()
    setFilterConditions(conditions)
  }, [router.asPath]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const sortCallBack = useCallback(() => {
    // sort created
    if (selectedSortValue === "created") {
      setProjects((state) =>
        [...state].sort(function (x, y) {
          const firstDate = new Date(x.createdAt)
          const SecondDate = new Date(y.createdAt)

          if (firstDate < SecondDate) return -1
          if (firstDate > SecondDate) return 1
          return 0
        }),
      )
    }

    // sort created && Year/month/number
    if (selectedSortValue === "year") {
      setProjects((state) =>
        [...state].sort(function (x, y) {
          const formatFirstYearMonth = `${x.issueYear}-${x.issueMonth}`
          const formatSecondYearMonth = `${y.issueYear}-${y.issueMonth}`
          const firstYearMonth = new Date(formatFirstYearMonth)
          const SecondYearMonth = new Date(formatSecondYearMonth)
          const firstCreatedTime = new Date(x.createdAt)
          const secondCreatedTime = new Date(y.createdAt)

          if (formatFirstYearMonth === formatSecondYearMonth) {
            if (firstCreatedTime > secondCreatedTime) {
              return -1
            } else if (firstCreatedTime < secondCreatedTime) {
              return 1
            } else {
              return 0
            }
          } else if (firstYearMonth > SecondYearMonth) {
            return -1
          } else if (firstYearMonth < SecondYearMonth) {
            return 1
          } else {
            return 0
          }
        }),
      )
    }
  }, [selectedSortValue])

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    sortCallBack()
  }, [selectedSortValue]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  useEffect(() => {
    const array = [...projectsRecoilState]
    setProjects(array)
    sortCallBack()
  }, [projectsRecoilState]) // eslint-disable-line

  //-------------------------------------------------------------------------
  /**
   *
   */
  //-------------------------------------------------------------------------
  const isFilteredManuscripts = useMemo(
    () =>
      filterConditions.find(({ key }) =>
        [
          "status",
          "hotelCode",
          "hotelName",
          "size",
          "sales",
          "manuscript",
        ].includes(key),
      ) !== undefined,
    [filterConditions],
  )

  //=========================================================================
  /**
   * 表示内容
   */
  //=========================================================================
  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary px-10'>
        <div className='w-full pt-4 pb-3'>
          <div className='flex items-end justify-between'>
            <h1 className='mb-1 text-xl font-bold text-gray-90'>
              プロジェクトリスト
            </h1>
            <div className='mb-2'>
              <ProjectNewProjectModal onCreate={handleOnCreate} />
            </div>
          </div>
          <hr className='mb-6 h-[1px] border-0 bg-divider-accent-secondary' />

          {/* filter area */}
          <ProjectFilter
            magazines={projects}
            yearMonthOptions={filterYearMonthOptions}
            sizeOptions={manuscriptSizesMock}
            conditions={filterConditions}
            onSearch={handleOnSearch}
          />

          {filterConditions.length === 0 && (
            <div className='my-3 flex items-center'>
              <div>
                <BaseSortSelectbox
                  defaultValue='並び替え'
                  options={orderList}
                  selectedValue={selectedSortValue}
                  onChange={handleOnChangeSort}
                />
              </div>
              <div className='ml-3'>
                <IconButton onClick={handleOnClickAll}>
                  <span
                    className={`material-symbols-outlined ${
                      allShown && "rotate-180"
                    }`}
                  >
                    keyboard_double_arrow_down
                  </span>
                </IconButton>
              </div>
            </div>
          )}
        </div>

        {progress ? (
          <div className='flex justify-center'>
            <MuiCircularProgress />
          </div>
        ) : (
          <div className='scrollbar-hide flex-1 space-y-14 overflow-y-auto pt-3 pb-10'>
            {filterConditions.length === 0 && (
              <div>
                {projects.map((project) => (
                  <ProjectMagazines
                    magazine={project}
                    id={project.id}
                    key={project.id}
                  />
                ))}
              </div>
            )}

            {filterConditions.length > 0 && !isFilteredManuscripts && (
              <div>
                <h2 className='text-sm text-gray-90'>
                  冊子の検索結果は{`${filteredBooklets.length}`}件です
                </h2>
                {filteredBooklets.length > 0 ? (
                  <div className='mt-10'>
                    <ProjectFilteredBooklets booklets={filteredBooklets} />
                  </div>
                ) : (
                  <div className='mt-20 text-center text-sm text-gray-90'>
                    検索結果がありません
                  </div>
                )}
              </div>
            )}

            {filterConditions.length > 0 &&
              (isFilteredManuscripts || filteredBooklets.length > 0) && (
                <div>
                  <h2 className='text-sm text-gray-90'>
                    原稿の検索結果は{`${filteredManuscripts.length}`}件です
                  </h2>
                  {filteredManuscripts.length > 0 ? (
                    <div className='mt-10'>
                      <ProjectFilteredManuscripts
                        manuscripts={filteredManuscripts}
                      />
                    </div>
                  ) : (
                    <div className='mt-20 text-center text-sm text-gray-90'>
                      検索結果がありません
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default Yukichi
