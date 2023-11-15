import { EditorState } from "lexical"
import {
  InitialEditorStateType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import { ToolbarPlugin } from "./ToolbarPlugin"
import { ColoredPlugin, ColoredType } from "./ColoredPlugin"

interface Props {
  colors?: ColoredType[]
  initialEditorState?: InitialEditorStateType
  disabled?: boolean
  onChange: (editorState: EditorState) => void
}

const TextEditor = (props: Props) => {
  const isDisabled = props.disabled ?? false
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "TextEditor",
        onError: (error) => console.error(error),
        editorState: props.initialEditorState,
        editable: !isDisabled,
      }}
    >
      {!isDisabled && props.colors && <ToolbarPlugin colors={props.colors} />}
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            className={`min-h-[80px] rounded border border-container-sleep-primary bg-white-0 px-3 py-1 text-sm`}
            style={{
              borderColor: "#BFC8CC",
              color: isDisabled ? "rgba(0, 0, 0, 0.38)" : "inherit",
              background: isDisabled ? "none" : "inherit",
            }}
          />
        }
        placeholder={<></>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin ignoreSelectionChange={true} onChange={props.onChange} />
      <HistoryPlugin />
      <ColoredPlugin />
    </LexicalComposer>
  )
}

export default TextEditor
