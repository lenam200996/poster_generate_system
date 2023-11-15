import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/Header",
  component: Component,
} as ComponentMeta<typeof Component>

export const HeaderListItem = () => {
  return (
    <div className='bg-container-main-primary p-10'>
      <Component
        id={1}
        name='別送チラシ用見出し　E'
        thumbImageUrl='/assets/design-import-header-thumb.png'
      />
    </div>
  )
}
