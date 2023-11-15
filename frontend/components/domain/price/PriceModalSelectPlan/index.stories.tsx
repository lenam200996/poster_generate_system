import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Price",
  component: Component,
} as ComponentMeta<typeof PriceModalSelectPlan>

export const PriceModalSelectPlan = () => {
  return (
    <Component
      roomCode=''
      entryPlanId=''
      documentId={1}
      idEdit=''
      isForMain={false}
      planCode=''
      hotelCode='0001'
      planName=''
      mainEditRoomName=''
      willEditPriceTable={null}
      hotelName=''
    />
  )
}
