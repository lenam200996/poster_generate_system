import { useCallback, useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $createRangeSelection,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical"
import { mergeRegister } from "@lexical/utils"
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection"

const SupportedColoredType = {
  red: "#d90000",
  green: "#33b200",
} as const
export type ColoredType = keyof typeof SupportedColoredType

export const TEXT_COLOR_COMMAND: LexicalCommand<ColoredType> = createCommand()

export const ColoredPlugin = () => {
  const [editor] = useLexicalComposerContext()

  const applyStyleText = useCallback(
    (styles: Record<string, string>) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles)
        }
      })
    },
    [editor],
  )

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TEXT_COLOR_COMMAND,
        (payload: ColoredType) => {
          const selection = $createRangeSelection()
          selection.focus.set("root", $getRoot().getChildrenSize(), "element")

          const cssColorValue = $getSelectionStyleValueForProperty(
            selection,
            "color",
            "",
          )
          const colorValue = SupportedColoredType[payload]
          applyStyleText(
            cssColorValue ? { color: null } : { color: colorValue },
          )
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor, applyStyleText])

  return <></>
}
