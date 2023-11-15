import { useState, useEffect } from "react"
import {
  copiesMock,
  statusesMock,
  mediaMock,
  manuscriptSizesMock,
} from "@/config/api/mock/projects/index"
import BaseFilterSelectCheckbox from "@/components/base/form/BaseFilterSelectCheckbox"
import ProjectFilterSearchConditionSaveModal from "@/components/domain/project/ProjectFilterSearchConditionSaveModal"
import BaseButtonText from "@/components/base/button/BaseButtonText"
import dayjs from "@/util/dayjs"
import BaseFilterInputText from "@/components/base/form/BaseFilterInputText"
import MuiChip from "@mui/material/Chip"
import BaseFilterSelectCheckboxWithTextFilter from "@/components/base/form/BaseFilterSelectCheckboxWithTextFilter"
import BaseFilterCalender from "@/components/base/form/BaseFilterCalender"
import { savedFilterSearchConditionsState } from "@/atoms/searchConditions"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import { useRecoilState } from "recoil"
import BaseFilterSelectRadio from "@/components/base/form/BaseFilterSelectRadio"
import { useRouter } from "next/router"
import { useApiClient } from "@/hooks/useApiClient"
import { ProjectListResponseDto } from "@/openapi/api"
const utc = require("dayjs/plugin/utc") // Import plugin utc
const timezone = require("dayjs/plugin/timezone") // Import plugin timezone
dayjs.extend(utc) // Extend dayjs with utc
dayjs.extend(timezone) // Extend dayjs with timezone
type SelectOptionsType = { label: string; value: string }[]

interface Props {
  magazines: ProjectListResponseDto[]
  yearMonthOptions: SelectOptionsType
  sizeOptions: SelectOptionsType
  conditions: FilterSearchCondition[]
  onSearch: (conditions: FilterSearchCondition[]) => void
}

const ProjectFilter = (props: Props) => {
  const apiClient = useApiClient()
  const router = useRouter()

  const [salesPersonOptions, setSalesPersonOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [manuscriptPersonOptions, setManuscriptPersonOptions] = useState<
    { label: string; value: string }[]
  >([])

  const [savedFilterSearchConditions, setSavedFilterSearchConditionsState] =
    useRecoilState(savedFilterSearchConditionsState)
  const handleExactStatus = (values) => handleChangeCondition("status", values)
  const handleExactMedia = (values) => handleChangeCondition("media", values)
  const handleExactCopies = (values) => handleChangeCondition("edition", values)
  const handleExactYearMonths = (values) =>
    handleChangeCondition("yearMonth", values)
  const handleExactHotelCode = (value) =>
    handleChangeCondition("hotelCode", [value])
  const handleExactHotelName = (value) =>
    handleChangeCondition("hotelName", [value])
  const handleExactSizes = (value) => handleChangeCondition("size", [value])
  const handleExactSalesName = (values) =>
    handleChangeCondition("sales", values)
  const handleExactUpdated = (start, end) => {
    if (start === "" && end === "") {
      handleChangeCondition("updated", [""])
    } else {
      handleChangeCondition("updated", [start, end])
    }
  }

  const handleChangeCondition = (
    key: FilterSearchCondition["key"],
    values: string[],
  ) => {
    const query = Object.keys(router.query).reduce((obj, _key) => {
      if (key !== _key) {
        obj[_key] = router.query[_key]
      }
      return obj
    }, {})

    const value = Array.from(values)
      .map((value) => value)
      .join(",")
    if (value !== "") {
      query[key] = value
    }

    router.replace({
      pathname: "/",
      query,
    })
  }

  const handleOnClickClear = () => {
    router.replace("/")
  }

  const handleOnSaveConditinName = (name) => {
    const filterdOnlyId = savedFilterSearchConditions.map(
      (savedFilterSearchCondition) => Number(savedFilterSearchCondition.id),
    )
    const maxId = filterdOnlyId.length > 0 ? Math.max(...filterdOnlyId) : 0
    setSavedFilterSearchConditionsState((conditions) => [
      ...conditions,
      {
        id: String(maxId + 1),
        name,
        conditions: props.conditions,
      },
    ])
  }

  const filterArrayValues = (key: FilterSearchCondition["key"]) => {
    const item = props.conditions.find((item) => item.key === key)
    return item ? item.value.split(",") : []
  }
  const filterTextValue = (key: FilterSearchCondition["key"]) => {
    const item = props.conditions.find((item) => item.key === key)
    return item ? item.value : ""
  }

  const updatedCondition = filterTextValue("updated")
  let updatedStart, updatedEnd
  if (updatedCondition !== "") {
    const dates = updatedCondition.split(",")
    if (dates.length >= 2) {
      updatedStart = dates[0]
      updatedEnd = dates[1]
    }
  }

  const generateChipName = (targetOptions, selectedValues) => {
    const array = targetOptions
      .filter((copy) => selectedValues.split(",").includes(copy.value))
      .map((copy) => copy.label)
    return array.join(",")
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response =
          await apiClient.settingsApiFactory.settingControllerSearchParams()
        const salesPersons = response.data.salesPersons.map((salesPerson) => {
          return {
            label: salesPerson.personName,
            value: salesPerson.personCognito,
          }
        })
        const manuscriptPersons = response.data.manuscriptPersons.map(
          (manuscriptPerson) => {
            return {
              label: manuscriptPerson.personName,
              value: manuscriptPerson.personCognito,
            }
          },
        )
        setSalesPersonOptions(salesPersons)
        setManuscriptPersonOptions(manuscriptPersons)
      } catch (error) {
      } finally {
      }
    })()
  }, []) // eslint-disable-line

  return (
    <>
      <div className='mb-1 flex items-start'>
        <div className='flex flex-1 flex-wrap'>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='ステータス'
              onExact={handleExactStatus}
              options={statusesMock}
              selectedValues={filterArrayValues("status")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='媒体'
              onExact={handleExactMedia}
              options={mediaMock}
              selectedValues={filterArrayValues("media")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='版'
              onExact={handleExactCopies}
              options={copiesMock}
              selectedValues={filterArrayValues("edition")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckbox
              placeholder='号'
              onExact={handleExactYearMonths}
              options={props.yearMonthOptions}
              selectedValues={filterArrayValues("yearMonth")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterInputText
              placeholder='宿コード'
              onExact={handleExactHotelCode}
              value={filterTextValue("hotelCode")}
              maxLength={4}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterInputText
              placeholder='宿名'
              onExact={handleExactHotelName}
              value={filterTextValue("hotelName")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectRadio
              placeholder='原稿サイズ'
              onExact={handleExactSizes}
              options={props.sizeOptions}
              value={
                props.conditions.find((item) => item.key === "size")?.value ??
                ""
              }
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterSelectCheckboxWithTextFilter
              placeholder='営業担当'
              onExact={handleExactSalesName}
              options={salesPersonOptions}
              selectedValues={filterArrayValues("sales")}
            />
          </div>
          <div className='mr-3 mb-3'>
            <BaseFilterCalender
              placeholder='最終更新日'
              start={updatedStart}
              end={updatedEnd}
              onExact={handleExactUpdated}
            />
          </div>
        </div>
        <div className='flex items-center justify-end'>
          <ProjectFilterSearchConditionSaveModal
            disabled={
              props.conditions.length === 0 ||
              savedFilterSearchConditions.length === 10
            }
            onSave={handleOnSaveConditinName}
          />
          <div className='ml-6'>
            <BaseButtonText
              disabled={props.conditions.length === 0}
              onClick={handleOnClickClear}
              sx={{ height: "33px" }}
            >
              <span className='text-[15px] leading-6'>クリア</span>
            </BaseButtonText>
          </div>
        </div>
      </div>
      {props.conditions.length > 0 && (
        <div className='mb-4 mt-3 flex flex-wrap'>
          {props.conditions.map(({ key, value: _value }) => {
            const title =
              key === "status"
                ? "ステータス"
                : key === "media"
                ? "媒体"
                : key === "edition"
                ? "版"
                : key === "yearMonth"
                ? "号"
                : key === "hotelCode"
                ? "宿コード"
                : key === "hotelName"
                ? "宿名"
                : key === "size"
                ? "原稿サイズ"
                : key === "sales"
                ? "営業担当"
                : key === "updated"
                ? "最終更新日"
                : ""
            if (title === "" || _value === "") {
              return null
            }
            let value = _value
            if (key === "status") {
              value = generateChipName(statusesMock, _value)
            } else if (key === "media") {
              value = generateChipName(mediaMock, _value)
            } else if (key === "edition") {
              value = generateChipName(copiesMock, _value)
            } else if (key === "yearMonth") {
              const values = value.split(",")
              value = values
                .map((item) => dayjs.tz(item, "UTC").format("YYYY年M月号"))
                .join(",")
            } else if (key === "updated") {
              const dates = value.split(",")
              if (dates.length >= 2) {
                value = `${
                  dates[0] !== ""
                    ? dayjs.tz(dates[0], "UTC").format("YYYY.M.D")
                    : ""
                }-${
                  dates[1] !== ""
                    ? dayjs.tz(dates[1], "UTC").format("YYYY.M.D")
                    : ""
                }`
              }
            } else if (key === "size") {
              value = generateChipName(manuscriptSizesMock, _value)
            } else if (key === "sales") {
              value = generateChipName(salesPersonOptions, _value)
            } else if (key === "manuscript") {
              value = generateChipName(manuscriptPersonOptions, _value)
            }
            return (
              <div key={`${key}_${value}`} className='mr-2 mb-2'>
                <MuiChip
                  label={`${title}: ${value}`}
                  size='small'
                  onDelete={() => {
                    router.replace({
                      pathname: "/",
                      query: Object.keys(router.query).reduce((obj, _key) => {
                        if (key !== _key) {
                          obj[_key] = router.query[_key]
                        }
                        return obj
                      }, {}),
                    })
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default ProjectFilter
