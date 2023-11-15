import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material"

const BaseTextAreaAutoSize = (props: TextareaAutosizeProps) => (
  <TextareaAutosize
    {...props}
    style={{
      borderColor: "#BFC8CC",
      borderWidth: "1px",
      padding: "4px 12px",
      borderRadius: "4px",
      resize: "none",
      fontSize: 14,
      color: props.disabled ? "rgba(0, 0, 0, 0.38)" : "inherit",
      background: props.disabled ? "none" : "inherit",
      ...(props.style ?? {}),
    }}
  />
)

export default BaseTextAreaAutoSize
