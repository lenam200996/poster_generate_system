import { IdmlRectanglePageItemDto } from "@/openapi"

interface Props {
  item: IdmlRectanglePageItemDto
}

const RectanglePageItem = (props: Props) => {
  if (props.item.type !== "rectangle") {
    return null
  }

  return (
    <div
      data-self={props.item.self}
      className={`pointer-events-none absolute`}
      style={{
        left: `${props.item.x}pt`,
        top: `${props.item.y}pt`,
        width: `${props.item.width}pt`,
        height: `${props.item.height}pt`,
        borderWidth: props.item.strokeWeight
          ? `${props.item.strokeWeight}pt`
          : 0,
        borderColor:
          props.item.strokeColor && props.item.strokeColor["rgb"]
            ? `${props.item.strokeColor["rgb"]}`
            : "transparent",
        backgroundColor:
          props.item.fillColor && props.item.fillColor["rgb"]
            ? `rgb(${props.item.fillColor["rgb"]})`
            : "transparent",
      }}
    />
  )
}

export default RectanglePageItem
