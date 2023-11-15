import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Overlay",
  component: Component,
} as ComponentMeta<typeof BaseModalConfirm>

export const BaseModalConfirm = () => {
  const [shown, setShown] = useState<boolean>(false)
  const onShowModal = () => {
    setShown(true)
  }
  const handleOnClickClose = () => {
    setShown(false)
  }
  return (
    <div>
      <button onClick={onShowModal}>モーダルを表示する</button>
      <Component header='' onClose={handleOnClickClose}>
        <div className='h-[300px]'>あああ</div>
      </Component>
    </div>
  )
}
