import { useMemo } from "react"
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import { IdmlImagePageItemDto } from "@/openapi"

interface Props {
  editId: string
  item: any //IdmlImagePageItemDto
  selected?: boolean
  loading?: string[]
  onClick: () => void
  idmlEditId: string
  isPropsManuscript?: boolean
}

const ImagePageItem = (props: Props) => {
  const router = useRouter()
  const id = useMemo(() => {
    return router.isReady ? (router.query.id as string) : ""
  }, [router.isReady, router.query.id])
  const selectedOutline = useMemo(() => {
    if (props.isPropsManuscript) return "outline-none"
    return props.selected ? "outline-[1pt] outline-red-50" : "outline-[#3388ff]"
  }, [props.selected, props.isPropsManuscript])
  if (!router.isReady) {
    return null
  }
  let pos = {}
  if (props.item.self === "price") pos["bottom"] = `116pt`
  else pos["top"] = `${props.item.y}pt`

  return (
    <div
      data-self={props.item.self}
      className={`absolute cursor-pointer overflow-hidden outline outline-[0.5pt] ${selectedOutline}`}
      style={{
        left: `${props.item.self === "price" ? 3 : props.item.x}pt`,
        ...pos,
        width: `${props.item.width}pt`,
        height: `${props.item.height}pt`,
      }}
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
    >
      {props.item.item &&
        props.item.item.imageFileName &&
        props.item.item.imageFileName.endsWith(".jpg") && (
          <div>
            <div>
              <img
                className='absolute max-h-[none] max-w-none'
                style={{
                  width: "100%",
                }}
                src={
                  props.item.item.imageFileName.startsWith("/asset") ||
                  props.item.item.imageFileName.startsWith("http")
                    ? props.item.item.imageFileName
                    : `${
                        process.env.NEXT_PUBLIC_API_URL
                      }/v1/idml-replace/workspace/image/${encodeURIComponent(
                        props.item.item.imageFileName,
                      )}`
                }
                alt=''
              />
            </div>
            {props.loading && props.loading.includes(props.item.self) && (
              <div
                className='absolute flex items-center justify-center bg-white-0 bg-opacity-30'
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress sx={{ animationDuration: "500ms" }} />
              </div>
            )}
          </div>
        )}

      {props.item.images &&
        props.item.images.map((image, i) => {
          let pos = {}
          if (image["-y"]) pos["bottom"] = `0`
          else pos["top"] = `${image.y - props.item.y}pt`
          const style = {
            width: "100%",
            // height: "100%",
            // transformOrigin: "left top",
            // transform: `scale(${image.scaleX}, ${image.scaleY})`,
            // left: `${image.x - props.item.x}pt`,
            // ...pos,
          }
          return (
            <div key={i}>
              {image.imageFileName ? (
                <div>
                  <img
                    className='absolute max-h-[none] max-w-none'
                    style={style}
                    // src={`${
                    //   process.env.NEXT_PUBLIC_API_URL ?? ""
                    // }/v1/idml-replace/image/${id}/${image.imageFileName}?${
                    //   image.linkResourceModified ?? 0
                    // }`}
                    src={
                      // image.linkResourceURI
                      //   ? image.linkResourceURI
                      //   : `${
                      //       process.env.NEXT_PUBLIC_API_URL ?? ""
                      //     }/v1/idml-replace/image/${props.idmlEditId}/${
                      //       image.self
                      //     }.jpg`
                      image.imageFileName.startsWith("/asset") ||
                      image.imageFileName.startsWith("http")
                        ? image.imageFileName
                        : `${
                            process.env.NEXT_PUBLIC_API_URL
                          }/v1/idml-replace/workspace/image/${encodeURIComponent(
                            image.imageFileName,
                          )}`
                    }
                    alt=''
                  />
                </div>
              ) : (
                <div
                  className='absolute bg-gray-50 bg-opacity-10'
                  style={style}
                />
              )}
              {props.loading && props.loading.includes(image.self) && (
                <div
                  className='absolute flex items-center justify-center bg-white-0 bg-opacity-30'
                  style={style}
                >
                  <CircularProgress sx={{ animationDuration: "500ms" }} />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export default ImagePageItem
