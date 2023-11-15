import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseTextField = () => {
  return (
    <div className='w-[440px]'>
      <Component
        size='small'
        variant='outlined'
        placeholder='例）松茸コラム'
        sx={{ width: 440 }}
      />
    </div>
  )
}
