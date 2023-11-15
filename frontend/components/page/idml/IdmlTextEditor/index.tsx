import React, { useEffect, useImperativeHandle, useRef } from "react"
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  SerializedParagraphNode,
  SerializedRootNode,
  SerializedTextNode,
} from "lexical"
import TextEditor from "@/components/page/editor/TextEditor"
import { ColoredType } from "@/components/page/editor/TextEditor/ColoredPlugin"

export type EditorContent = {
  content: string
  color: string
}

interface Props {
  colors?: ColoredType[]
  initString: string
  disabled?: boolean
  onChange: (status: EditorContent[]) => void
}

export type IdmlTextEditorHandle = {
  getRoot: () => string
  getContent: () => string
  getEditorState: () => EditorContent[]
}

const IdmlTextEditor = React.forwardRef<IdmlTextEditorHandle, Props>(
  function IdmlTextEditorFunc(props, ref) {
    const editorStateRef = useRef<EditorState>()

    const formatEditorState = (editorState: EditorState) => {
      const root = editorState.toJSON()
        .root as SerializedRootNode<SerializedParagraphNode>

      const contents: EditorContent[] = root.children.flatMap((child) => {
        return child.children.map((node) => {
          if (node.type === "text") {
            const textNode = node as SerializedTextNode
            const content = textNode.text
            const colorMatch = textNode.style.match(/color: ([#\w]+);/)
            const color = colorMatch ? colorMatch[1] : ""
            return { content, color }
          } else if (node.type === "linebreak") {
            return { content: "\n", color: "" }
          }
        })
      })

      return contents
    }

    const parseTextToEditorContent = (inputText: string): EditorContent[] => {
      const regex = /<([#\w]+)>([^<]+)<\/\1>|([^<]+)/g
      const results: EditorContent[] = []

      let match: RegExpExecArray
      while ((match = regex.exec(inputText)) !== null) {
        if (match[1] && match[2]) {
          // Matched colored text
          results.push({
            content: match[2],
            color: match[1],
          })
        } else if (match[3]) {
          // Matched normal text
          results.push({
            content: match[3],
            color: "",
          })
        }
      }

      return results
    }

    useImperativeHandle(ref, () => ({
      getRoot: () => {
        if (editorStateRef.current) {
          return JSON.stringify(editorStateRef.current)
        }
      },
      getContent: () => {
        if (editorStateRef.current) {
          const contents = formatEditorState(editorStateRef.current)
          let result = ""
          for (const content of contents) {
            if (content.color) {
              result += `<${content.color}>${content.content}</${content.color}>`
            } else {
              result += content.content
            }
          }
          return result
        }
      },
      getEditorState: () => {
        if (editorStateRef.current) {
          return formatEditorState(editorStateRef.current)
        }
      },
    }))

    const onChange = (editorState: EditorState) => {
      editorStateRef.current = editorState
      editorState.read(() => {
        const changedStatuses = formatEditorState(editorState)
        props.onChange(changedStatuses)
      })
    }
    return (
      <TextEditor
        colors={props.colors}
        onChange={onChange}
        disabled={props.disabled}
        initialEditorState={() => {
          const editorContents = parseTextToEditorContent(props.initString)
          const paragraph = $createParagraphNode()
          for (const content of editorContents) {
            const text = $createTextNode(content.content)
            if (content.color) {
              text.setStyle(`color: ${content.color};`)
            }
            paragraph.append(text)
          }
          $getRoot().append(paragraph)
        }}
      />
    )
  },
)

export default IdmlTextEditor
