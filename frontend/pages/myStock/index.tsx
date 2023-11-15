import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import type { NextPage } from "next"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { myStockProjects } from "@/atoms/myStock"
import {
  sortProjectsByCreated,
  sortProjectsByYearAndCreated,
} from "@/util/sortProjects"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import {
  orderOptions,
  manuscriptSizes,
  userCognitoMock,
} from "@/config/api/mock/myStock"
import AuthLayout from "@/components/layout/Auth"
import BaseSortSelectbox from "@/components/base/form/BaseSortSelectbox"
import MyStockModalNewManuscript from "@/components/page/myStock/modal/MyStockModalNewManuscript"
import MyStockFilter from "@/components/page/myStock/MyStockFilter"
import MyStorkListTableProject from "@/components/page/myStock/table/MyStorkTableProject"
import RenderWithRoles from "@/components/domain/global/RenderWithRoles"
import { RolesMock } from "@/config/api/mock/users"
import { useApiClient } from "@/hooks/useApiClient"
import MuiCircularProgress from "@mui/material/CircularProgress"
import { projectsState } from "@/atoms/projectlist"

const MyStock: NextPage = () => {
  const router = useRouter()
  const [filterConditions, setFilterConditions] = useState<
    FilterSearchCondition[]
  >([])
  const [fetchedData, setFetchedData] = useState([])
  const [myStockState, setMyStockState] = useState([])
  const [progress, setProgress] = useState(true)
  const [selectedSortValue, setSelectedSortValue] = useState<string>("")
  const apiClient = useApiClient()
  const setProjectsRecoilState = useSetRecoilState(projectsState)

  const handleOnSearch = (conditions: FilterSearchCondition[]) => {
    setFilterConditions(conditions)
  }
  const handleOnChangeSort = (value: string) => {
    setSelectedSortValue(value)
  }
  const fetch = async () => {
    setProgress(true)
    const res =
      await apiClient.documentMyStocksApi.documentMyStockControllerList(
        userCognitoMock,
      )
    setFetchedData(res.data.data)
    setMyStockState(res.data.data)
    setProgress(false)
  }
  useEffect(() => {
    try {
      fetch()
      getProjectList()
    } catch (error: any) {
      console.error("error: ", error)
    }
  }, []) // eslint-disable-line
  const getProjectList = async () => {
    try {
      const resposne =
        await apiClient.projectsApiFactory.projectControllerList()
      setProjectsRecoilState(resposne.data.data)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const conditions = []
    Object.keys(router.query).forEach((key) => {
      if (
        ["media", "edition", "hotelCode", "hotelName", "size"].includes(key)
      ) {
        const value = String(router.query[key])
        if (value !== "") {
          conditions.push({
            key,
            value,
          })
        }
      }
    })
    setFilterConditions(conditions)
  }, [router.query]) // eslint-disable-line

  useEffect(() => {
    // sort created
    if (selectedSortValue === "created") {
      sortProjectsByCreated(setMyStockState, myStockState)
    }

    // sort created && Year/month/number
    if (selectedSortValue === "year") {
      sortProjectsByYearAndCreated(setMyStockState, myStockState)
    }
  }, [selectedSortValue]) // eslint-disable-line

  useEffect(() => {
    if (filterConditions.length > 0) {
      const getConditionList = (key: FilterSearchCondition["key"]) => {
        const items = filterConditions.filter((item) => item.key === key)
        return items.length === 1
          ? items.map((item) => item.value)[0].split(",")
          : []
      }

      // compile to string array
      const mediaList = getConditionList("media")
      const editionList = getConditionList("edition")
      const sizeList = getConditionList("size")
      const hotelNameList = getConditionList("hotelName")
      const hotelCodeList = getConditionList("hotelCode")

      let filterdArray = [...fetchedData]

      if (mediaList.length > 0) {
        filterdArray =
          filterdArray &&
          filterdArray.filter((project) =>
            mediaList.includes(project.mediaType.code),
          )
      }

      if (editionList.length > 0) {
        filterdArray =
          filterdArray &&
          filterdArray.map((project) => {
            const filterdManuscriptArray = project.documentMyStocks.filter(
              (myStock) =>
                editionList.includes(myStock.booklet.masterEditionCode.code),
            )
            return {
              ...project,
              documentMyStocks: filterdManuscriptArray,
            }
          })
      }

      if (hotelCodeList.length > 0) {
        filterdArray =
          filterdArray &&
          filterdArray.map((project) => {
            const filterdManuscriptArray = project.documentMyStocks.filter(
              (myStock) =>
                hotelCodeList.find(
                  (word) =>
                    String(myStock.document.hotelCode).indexOf(word) >= 0,
                ),
            )
            return {
              ...project,
              documentMyStocks: filterdManuscriptArray,
            }
          })
      }

      /**
       * 宿名のフィルタ処理
       */

      // 宿名のフィルタで入力されたか判定
      if (hotelNameList.length > 0) {
        // 宿名のフィルタを実行
        //  - project.documentMyStocks：一覧にある宿名
        //  - hotelNameList：画面の宿名に記入した内容
        //  - filterdArray：最終的にフィルタした結果を格納
        filterdArray =
          filterdArray &&
          filterdArray.map((project) => {
            const filterdManuscriptArray = project.documentMyStocks.filter(
              (myStock) =>
                hotelNameList.find(
                  (word) =>
                    myStock.document.documentContent.hotelNameLarge.indexOf(
                      word,
                    ) >= 0,
                ),
            )
            // filterdArrayへの返却値としてフィルタ結果を格納
            return {
              ...project,
              documentMyStocks: filterdManuscriptArray,
            }
          })
      }

      if (sizeList.length > 0) {
        filterdArray =
          filterdArray &&
          filterdArray.map((project) => {
            const filterdManuscriptArray = project.documentMyStocks.filter(
              (myStock) =>
                sizeList.includes(myStock.document.documentSize.name),
            )
            return {
              ...project,
              documentMyStocks: filterdManuscriptArray,
            }
          })
      }

      setMyStockState(filterdArray)
    } else {
      setMyStockState(fetchedData)
    }
  }, [filterConditions]) // eslint-disable-line

  return (
    <AuthLayout>
      <div className='flex h-[calc(100vh_-_60px)] min-w-[1280px] flex-col bg-container-main-primary px-10'>
        <div className='pt-[30px] pb-3'>
          <div className='flex items-end justify-between'>
            <h1 className='mb-1 text-xl font-bold text-gray-90'>
              マイストック
            </h1>
            <div className='mb-2'>
              <RenderWithRoles
                roles={[
                  RolesMock.admin,
                  RolesMock.operator,
                  RolesMock.manuscriptUpdator,
                  RolesMock.manuscriptOperator,
                  RolesMock.outsourcingManager,
                ]}
              >
                <MyStockModalNewManuscript reload={() => fetch()} />
              </RenderWithRoles>
            </div>
          </div>
          <hr className='mt-1 mb-6 h-[1px] border-0 bg-divider-accent-secondary' />

          {/* filter area */}
          <MyStockFilter
            sizeOptions={manuscriptSizes}
            conditions={filterConditions}
            onSearch={handleOnSearch}
          />

          {filterConditions.length === 0 && (
            <div className='mt-4'>
              <BaseSortSelectbox
                defaultValue='並び替え'
                options={orderOptions}
                selectedValue={selectedSortValue}
                onChange={handleOnChangeSort}
              />
            </div>
          )}
        </div>

        {/* content area */}
        {progress ? (
          <div className='flex justify-center'>
            <MuiCircularProgress />
          </div>
        ) : (
          <div className='mt-7 flex-1 overflow-y-auto'>
            {myStockState &&
              myStockState.map(
                (project) =>
                  project.documentMyStocks?.length > 0 && (
                    <div key={project.id}>
                      <h2 className='flex text-sm font-medium'>
                        <span>{project.mediaType.name}</span>
                        <span className='ml-2'>{project.issueYear}年</span>
                        <span className='ml-2'>{project.issueMonth}月号</span>
                      </h2>
                      <div className='mt-4 mb-[80px]'>
                        <div className='overflow-x-auto'>
                          <div className='min-w-max'>
                            <MyStorkListTableProject project={project} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
              )}
            {(!myStockState ||
              myStockState.every(
                (project) => !project.documentMyStocks?.length,
              )) === true && (
              <p className='text-center text-sm font-bold'>
                マイストック原稿がありません
              </p>
            )}
          </div>
        )}
      </div>
    </AuthLayout>
  )
}

export default MyStock
