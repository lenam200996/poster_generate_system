import ImagePageItem from "../ImagePageItem"
import RectanglePageItem from "../RectanglePageItem"
import TextFramePageItem from "../TextFramePageItem"
import {
  IdmlImagePageItemDto,
  IdmlItemsResponseDtoItemsInner,
  IdmlItemsResponseDtoPage,
  IdmlRectanglePageItemDto,
  IdmlTextFramePageItemDto,
} from "@/openapi"

interface Props {
  editId: string
  selectedItem?: IdmlItemsResponseDtoItemsInner
  backgroundImage?: string
  page: IdmlItemsResponseDtoPage
  items: Array<IdmlItemsResponseDtoItemsInner>
  loadingItems?: string[]
  onClickPaper: () => void
  onClickPageItem: (self: IdmlItemsResponseDtoItemsInner) => void
  idmlEditId?: string
  isPropsManuscript?: boolean
}
const IdmlPageItemsPreview = (props: Props) => {
  return (
    <div
      className={`relative bg-white-0 bg-contain bg-no-repeat text-[#000000] drop-shadow ${
        props.selectedItem && "cursor-pointer"
      }`}
      style={{
        width: `${props.page && props.page.size ? props.page.size.width : 0}pt`,
        height: `${
          props.page && props.page.size ? props.page.size.height : 0
        }pt`,
        backgroundImage: props.backgroundImage
          ? `url('${props.backgroundImage}')`
          : "none",
      }}
      onClick={props.onClickPaper}
    >
      {props.items.map((item, i) =>
        item.type === "rectangle" ? (
          <RectanglePageItem key={i} item={item as IdmlRectanglePageItemDto} />
        ) : item.type === "image" || item.type === "imported-page" ? (
          <ImagePageItem
            isPropsManuscript={props.isPropsManuscript}
            idmlEditId={props.idmlEditId || "mytest"}
            key={i}
            editId={props.editId}
            item={item as IdmlImagePageItemDto}
            selected={
              props.selectedItem &&
              props.selectedItem.parentTagId === item.parentTagId &&
              props.selectedItem.self === item.self
              // props.selectedItem.x === item.x &&
              // props.selectedItem.y === item.y
            }
            loading={props.loadingItems}
            onClick={() => {
              props.onClickPageItem(item)
            }}
          />
        ) : item.type === "text" ? (
          <TextFramePageItem
            isPropsManuscript={props.isPropsManuscript}
            key={i}
            item={item as IdmlTextFramePageItemDto}
            selected={
              props.selectedItem &&
              props.selectedItem.parentTagId === item.parentTagId &&
              props.selectedItem.self === item.self
            }
            onClick={() => {
              props.onClickPageItem(item)
            }}
          />
        ) : null,
      )}
      <div
        style={{
          position: "absolute",
          width: "232px",
          bottom: "141px",
          fontSize: "12px",
        }}
      ></div>
    </div>
  )
}

export default IdmlPageItemsPreview
