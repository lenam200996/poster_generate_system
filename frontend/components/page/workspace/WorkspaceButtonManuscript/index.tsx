import { DocumentSizeType } from "@/config/api/mock/workspace/booklet"

type Props = {
  documentSize: DocumentSizeType
  bookletSize: "small" | "large"
  positionY?: "top" | "bottom"
  positionX?: "left" | "right"
  children: any
  onClick?: Function
}

const WorkspaceButtonManuscript = (props: Props) => {
  const handleOnClick = () => {
    if (!props.onClick) return
    props.onClick()
  }
  return (
    <>
      {props.documentSize === "ONE_ONE" && (
        <div
          className={`absolute inset-0 m-auto flex overflow-hidden text-center ${
            props.bookletSize === "small"
              ? `h-[122px] w-[84px] text-[8px]`
              : `h-[391px] w-[271px]`
          } items-center justify-center bg-[#F0F2F8] bg-transparent leading-[1.3] text-[#66587B]`}
          onClick={handleOnClick}
        >
          {props.children}
        </div>
      )}
      {props.documentSize === "ONE_TWO" && (
        <div
          className={`absolute mx-auto flex overflow-hidden text-center ${
            props.bookletSize === "small"
              ? `${
                  props.positionY === "top" ? "top-1" : "bottom-1"
                } left-0 right-0 h-[61px] w-[84px] text-[8px]`
              : `${
                  props.positionY === "top" ? "top-5" : "bottom-5"
                } left-0 right-0 h-[190px] w-[271px]`
          } items-center justify-center bg-[#F0F2F8] bg-transparent leading-[1.3] text-[#66587B]`}
          onClick={handleOnClick}
        >
          {props.children}
        </div>
      )}
      {props.documentSize === "ONE_FOUR" && (
        <div
          className={`absolute flex overflow-hidden text-center ${
            props.bookletSize === "small"
              ? `${props.positionY === "top" ? "top-1" : "bottom-1"} ${
                  props.positionX === "left" ? "left-[5px]" : "right-[5px]"
                } h-[61px] w-[41px] text-[8px]`
              : `${props.positionY === "top" ? "top-5" : "bottom-5"} ${
                  props.positionX === "left" ? "left-3" : "right-3"
                } h-[190px] w-[130px]`
          } items-center justify-center bg-[#F0F2F8] bg-transparent leading-[1.3] text-[#66587B]`}
          onClick={handleOnClick}
        >
          {props.children}
        </div>
      )}
    </>
  )
}

export default WorkspaceButtonManuscript
