import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Domain/Template",
  component: Component,
} as ComponentMeta<typeof TemplateModalSelectManuscript>

export const TemplateModalSelectManuscript = () => {
  const handleOnPrev = () => {}
  const handleOnClose = () => {}
  const handleOnClick = () => {}
  return (
    <Component
      manuscriptSize='ONE_ONE'
      onPrev={handleOnPrev}
      onClose={handleOnClose}
      onClick={handleOnClick}
    />
  )
}
