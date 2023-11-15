import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import",
  component: Component,
} as ComponentMeta<typeof Component>

export const ImportFileUpload = () => {
  return (
    <div className='p-10'>
      <div className='h-52 w-80'>
        <Component text='ファイルを選択してください' />
      </div>
    </div>
  )
}
