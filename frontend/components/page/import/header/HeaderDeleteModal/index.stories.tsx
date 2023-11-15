import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import/Header",
  component: Component,
} as ComponentMeta<typeof Component>

export const HeaderDeleteModal = () => {
  return (
    <div className='p-10'>
      <Component
        id={1}
        name='1別送チラシ用見出し　E'
        onClose={() => {}}
        onComplete={() => {}}
      />
    </div>
  )
}
