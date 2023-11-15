import Component from "./index"
import { ComponentMeta } from "@storybook/react"
import { useState } from "react"

export default {
  title: "Base/Form",
  component: Component,
} as ComponentMeta<typeof Component>

export const BaseFilterCalender = () => {
  const handleExact = (start: string, end: string) => {
    //
  }
  return <Component placeholder='最終更新日' onExact={handleExact} />
}
