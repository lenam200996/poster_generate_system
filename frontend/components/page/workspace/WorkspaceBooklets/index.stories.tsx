import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { booklet } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace",
  component: Component,
} as ComponentMeta<typeof WorkspaceBooklets>

export const WorkspaceBooklets = () => {
  return (
    <div className='p-10'>
      {booklet.pages.map((page, i) => (
        <div className='mt-5 first-of-type:mt-0' key={i}>
          <Component pageNumber={1} page={page} />
        </div>
      ))}
    </div>
  )
}
