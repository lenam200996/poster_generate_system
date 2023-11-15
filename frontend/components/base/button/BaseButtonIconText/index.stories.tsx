import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Button",
  component: Component,
} as ComponentMeta<typeof BaseButtonIconText>

export const BaseButtonIconText = () => {
  const handleOnClick = () => {
    console.log("click")
  }
  return (
    <Component
      icon='settings_applications'
      text='詳細'
      onClick={handleOnClick}
    />
  )
}
