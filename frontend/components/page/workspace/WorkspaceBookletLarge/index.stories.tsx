import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { booklet } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace",
  component: Component,
} as ComponentMeta<typeof WorkspaceBookletLarge>

export const WorkspaceBookletLarge = () => {
  return (
    <div className='flex h-full flex-row-reverse flex-nowrap overflow-x-scroll'>
      {booklet.pages.map((e, i) => (
        <Component
          page={e}
          key={e.pageNumber}
          booklet={booklet}
          pageNumber={3}
        />
      ))}
    </div>
  )
}
