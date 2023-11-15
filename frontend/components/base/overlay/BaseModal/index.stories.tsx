import { useState } from "react"
import Component from "./index"
import { ComponentMeta } from "@storybook/react"

export default {
  title: "Base/Overlay",
  component: Component,
} as ComponentMeta<typeof BaseModal>

export const BaseModal = () => {
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
      <Component shown={shown} onClickClose={handleOnClickClose}>
        <div className='h-[300px]'>あああ</div>
      </Component>
    </div>
  )
}
