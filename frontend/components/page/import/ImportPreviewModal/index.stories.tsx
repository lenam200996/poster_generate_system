import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Page/Import",
  component: Component,
} as ComponentMeta<typeof Component>

export const ImportPreviewModal = () => {
  return (
    <div className='p-10'>
      <Component
        url='/assets/design-template-paper-preview.png'
        onClose={() => {}}
      />
    </div>
  )
}
