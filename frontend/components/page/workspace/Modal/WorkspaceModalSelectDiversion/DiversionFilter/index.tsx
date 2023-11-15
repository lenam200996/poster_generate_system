import { copiesMock, mediaMock } from "@/config/api/mock/projects/index"
import BaseFilterSelectCheckbox from "@/components/base/form/BaseFilterSelectCheckbox"
import { FilterSearchCondition } from "@/types/page/projectlist/filterSearchCondition"
import { useState } from "react"

type SelectOptionsType = { label: string; value: string }[]

interface Props {
  yearMonthOptions: SelectOptionsType
  conditions: FilterSearchCondition[]
  onSearch: (conditions: FilterSearchCondition[]) => void
}

const DiversionFilter = (props: Props) => {
  const handleExactMedia = (values) => handleChangeCondition("media", values)
  const handleExactCopies = (values) => handleChangeCondition("edition", values)
  const handleExactYearMonths = (values) =>
    handleChangeCondition("yearMonth", values)

  const handleChangeCondition = (
    key: FilterSearchCondition["key"],
    values: string[],
  ) => {
    const str = values.join(",")
    props.onSearch([
      {
        key,
        value: str,
      },
    ])
  }
  const filterArrayValues = (key: FilterSearchCondition["key"]) => {
    const item = props.conditions.find((item) => item.key === key)
    return item ? item.value.split(",") : []
  }
  return (
    <>
      <div className='flex justify-center'>
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
      </div>
    </>
  )
}

export default DiversionFilter
