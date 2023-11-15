import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Button",
  component: Component,
} as ComponentMeta<typeof BaseButtonCopyLink>

export const BaseButtonCopyLink = () => {
  return (
    <Component link='https://dev-yukichi.aws.yukoyuko.net/workspace/482874897' />
  )
}
