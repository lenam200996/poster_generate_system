import { useCallback } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ColoredType, TEXT_COLOR_COMMAND } from "./ColoredPlugin"
import { Button, Tooltip } from "@mui/material"

type ButtonColor =
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"

type ButtonConfig = {
  tooltip: string
  text: string
  color: ButtonColor
}

const buttonConfigs: {
  [key in string]: ButtonConfig
} = {
  red: {
    tooltip: "赤文字",
    text: "赤",
    color: "error",
  },
  green: {
    tooltip: "緑文字",
    text: "緑",
    color: "success",
  },
}

export const ToolbarPlugin = ({ colors }: { colors: ColoredType[] }) => {
  const [editor] = useLexicalComposerContext()

  const formatColorColorText = useCallback(
    (color: ColoredType) => {
      editor.dispatchCommand(TEXT_COLOR_COMMAND, color)
    },
    [editor],
  )

  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex'>
          {colors.map((color) => {
            const config = buttonConfigs[color]
            return (
              <Button
                key={color}
                variant='outlined'
                color={config.color}
                size='small'
                sx={{ minWidth: 33, minHeight: 30, mb: 1, mr: 1 }}
                onClick={() => formatColorColorText(color)}
              >
                <Tooltip title={config.tooltip} placement='top'>
                  <span className='text-[15px] leading-none'>
                    {config.text}
                  </span>
                </Tooltip>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
