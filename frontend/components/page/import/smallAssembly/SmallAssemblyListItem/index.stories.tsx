import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/SmallAssembly",
  component: Component,
} as ComponentMeta<typeof Component>

export const SmallAssemblyListItem = () => {
  return (
    <div className='bg-container-main-primary p-10'>
      <Component
        id={1}
        name='あて原稿1003'
        thumbImageUrl='/assets/design-template-small-assembly.png'
        onDelete={() => {}}
      />
    </div>
  )
}
