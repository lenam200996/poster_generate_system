import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Workspace/Modal",
  component: Component,
} as ComponentMeta<typeof WorkspaceModalDesignTemplateDetail>

const template = {
  id: 1,
  recommend: true,
  name: "本誌1/2 松茸コラム 2023年10月号",
  image: "/assets/design-template-sample.png",
}

export const WorkspaceModalDesignTemplateDetail = () => {
  const handleOnPrev = () => {}
  const handleOnClose = () => {}
  const handleOnClick = () => {}
  return (
    <Component
      shown={true}
      template={template}
      onPrev={handleOnPrev}
      onClose={handleOnClose}
      onClick={handleOnClick}
    />
  )
}
