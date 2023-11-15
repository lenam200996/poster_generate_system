import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { booklet } from "@/config/api/mock/workspace/booklet"

export default {
  title: "Page/Workspace",
  component: Component,
} as ComponentMeta<typeof WorkspaceBookletSmall>

export const WorkspaceBookletSmall = () => {
  const reversedArray = [...booklet.pages].reverse()
  return (
    <div className='scrollbar-hide flex overflow-x-auto'>
      {reversedArray.map((e, i) => (
        <Component page={e} key={e.id} booklet={booklet} pageNumber={3} />
      ))}
    </div>
  )
}
