import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Price",
  component: Component,
} as ComponentMeta<typeof priceStandard>

export const priceStandard = () => {
  return <Component hotelName='ことひら温泉　御宿　敷島館' idmlEditId='' />
}
