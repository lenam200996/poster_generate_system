import dayjs from "dayjs"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Price",
  component: Component,
} as ComponentMeta<typeof PriceModalAddSeason>

export const PriceModalAddSeason = () => {
  return (
    <Component
      endDate={dayjs()}
      startDate={dayjs()}
      periods={[]}
      manuscriptName='ゆこゆこ本誌　2023年　10月号　中国・四国版　ことひら温泉　御宿　敷島館'
    />
  )
}
