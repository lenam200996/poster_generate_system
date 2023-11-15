import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Button",
  component: Component,
} as ComponentMeta<typeof BaseButton>

export const BaseButton = () => {
  const handleOnClick = () => {
    console.log("click")
  }
  return (
    <div>
      <div>
        <span>secondary</span>
        <Component onClick={handleOnClick}>button</Component>
      </div>
      <div className='mt-6'>
        <span>MP</span>
        <Component theme='mp' onClick={handleOnClick}>
          button
        </Component>
      </div>
      <div className='mt-6'>
        <span>CS</span>
        <Component theme='cs' onClick={handleOnClick}>
          button
        </Component>
      </div>
      <div className='mt-6'>
        <span>画像管理</span>
        <Component theme='im' onClick={handleOnClick}>
          button
        </Component>
      </div>
      <div className='mt-6'>
        <span>湯吉</span>
        <Component theme='yk' onClick={handleOnClick}>
          button
        </Component>
      </div>
    </div>
  )
}
