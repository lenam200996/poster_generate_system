import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { project } from "@/config/api/mock/myStock"

export default {
  title: "Page/MyStock/Table",
  component: Component,
} as ComponentMeta<typeof MyStorkTableProject>

export const MyStorkTableProject = () => {
  return (
    <div className='overflow-x-auto'>
      <div className='min-w-max'>
        <Component project={project} />
      </div>
    </div>
  )
}
