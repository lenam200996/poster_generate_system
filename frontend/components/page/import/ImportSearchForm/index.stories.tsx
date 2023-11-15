import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import",
  component: Component,
} as ComponentMeta<typeof Component>

export const ImportSearchForm = () => {
  return (
    <div className='p-10'>
      <Component
        placeholder='あて原稿1003'
        onSearch={() => {}}
        onClear={() => {}}
      />
    </div>
  )
}
