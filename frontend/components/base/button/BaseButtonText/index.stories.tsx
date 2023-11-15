import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Button",
  component: Component,
} as ComponentMeta<typeof BaseButtonText>

export const BaseButtonText = () => {
  const handleOnClick = () => {
    console.log("click")
  }
  return (
    <div className='flex items-center'>
      <div>
        <Component onClick={handleOnClick}>検索条件をクリア</Component>
      </div>
      <div className='ml-3'>
        <Component onClick={handleOnClick}>クリア</Component>
      </div>
    </div>
  )
}
