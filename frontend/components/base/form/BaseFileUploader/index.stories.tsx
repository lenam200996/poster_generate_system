import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFileUploader = () => {
  const handleOnChange = ({ files }: { files: File[] }) => {
    console.log(files)
  }
  return (
    <div className='p-10'>
      <div className='h-52 w-80'>
        <Component
          text='ファイルを選択してください'
          extension={[".eps"]}
          onChange={handleOnChange}
        />
      </div>
    </div>
  )
}
