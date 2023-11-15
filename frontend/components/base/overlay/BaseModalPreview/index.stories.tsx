import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Overlay",
  component: Component,
} as ComponentMeta<typeof BaseModalPreview>

export const BaseModalPreview = () => {
  const [shown, setShown] = useState<boolean>(true)

  return (
    <div>
      <button onClick={() => setShown(true)}>モーダルを表示する</button>
      <Component
        shown={shown}
        imageUrl='https://placehold.jp/1280x700.png'
        onClose={() => setShown(false)}
      />
    </div>
  )
}
