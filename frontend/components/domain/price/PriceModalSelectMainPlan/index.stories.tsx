import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Price",
  component: Component,
} as ComponentMeta<typeof PriceModalSelectMainPlan>

export const PriceModalSelectMainPlan = () => {
  return <Component planList={[]} />
}
