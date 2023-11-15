import { useEffect, useMemo, useRef, useState } from "react"
import { IdmlTextFramePageItemDto, IdmlTextFramePageTextDto } from "@/openapi"

const dpi = 96
const convertPt2Px = (pt: number) => (pt * dpi) / 72
const convertPx2Pt = (px: number) => (px * 72) / dpi

interface Props {
  item: IdmlTextFramePageItemDto
  selected?: boolean
  onClick: () => void
  isPropsManuscript?: boolean
}

const TextFramePageItem = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const [textScale, setTextScale] = useState({ x: 100, y: 100 })

  useEffect(() => {
    if (
      boxRef.current &&
      containerRef.current
      // && props.item.horizontalScale !== undefined
    ) {
      let hiddenBox = document.getElementById("hidden-size-check-box")
      if (!hiddenBox) {
        hiddenBox = document.createElement("div")
        hiddenBox.id = "hidden-size-check-box"
        hiddenBox.style.position = "fixed"
        hiddenBox.style.top = "-999999"
        hiddenBox.style.left = "999999"
        hiddenBox.style.visibility = "hidden"
        document.body.appendChild(hiddenBox)
      }

      const containerElement =
        containerRef.current.cloneNode() as HTMLDivElement
      const element = boxRef.current.cloneNode(true) as HTMLDivElement
      // element.style.transform = ""
      containerElement.appendChild(element)
      hiddenBox.appendChild(containerElement)

      const itemWidthPx = convertPt2Px(props.item.width)
      const itemHeightPx = convertPt2Px(props.item.height)
      const { width, height } = element.getBoundingClientRect()
      if (itemWidthPx < width || itemHeightPx < height) {
        // console.log("-", textScale.x)
        let checkTextScale = textScale.x
        let newTextScaleX = checkTextScale
        while (70 < checkTextScale) {
          checkTextScale--
          // containerElement.style.width = `${
          //   (props.item.width * scale(text)) / (checkTextScale / 100)
          // }pt`
          element.style.transform = `scale(${checkTextScale / 100}, 1)`
          const bounding = element.getBoundingClientRect()
          // console.log(
          //   "-",
          //   checkTextScale,
          //   itemWidthPx,
          //   bounding.width,
          //   itemWidthPx > bounding.width,
          //   itemHeightPx,
          //   bounding.height,
          //   itemHeightPx > bounding.height,
          // )
          newTextScaleX = checkTextScale
          if (itemWidthPx > bounding.width && itemHeightPx > bounding.height) {
            break
          }
        }
        // console.log("-", "newTextScaleX", newTextScaleX)
        setTextScale((state) => ({ ...state, x: newTextScaleX }))
      } else if (itemWidthPx > width && itemHeightPx > height) {
        // console.log("+", textScale.x)
        let checkTextScale = textScale.x
        let newTextScaleX = checkTextScale
        while (checkTextScale < 100) {
          checkTextScale++
          // containerElement.style.width = `${
          //   (props.item.width * scale(text)) / (checkTextScale / 100)
          // }pt`
          element.style.transform = `scale(${checkTextScale / 100}, 1)`
          const bounding = element.getBoundingClientRect()
          // console.log(
          //   "+",
          //   checkTextScale,
          //   itemWidthPx,
          //   bounding.width,
          //   itemWidthPx > bounding.width,
          //   itemHeightPx,
          //   bounding.height,
          //   itemHeightPx > bounding.height,
          // )
          if (itemWidthPx < bounding.width || itemHeightPx < bounding.height) {
            break
          }
          newTextScaleX = checkTextScale
          checkTextScale++
        }
        // console.log("+", "newTextScaleX", newTextScaleX)
        setTextScale((state) => ({ ...state, x: newTextScaleX }))
      }

      element.parentNode.removeChild(element)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.item.texts])
  const selectedOutline = useMemo(() => {
    if (props.isPropsManuscript) return "outline-none"
    return props.selected ? "outline-[1pt] outline-red-50" : "outline-[#3388ff]"
  }, [props.selected, props.isPropsManuscript])


  if (
    !props.item.texts ||
    props.item.texts.length == 0 ||
    !props.item.texts[0].contents
  ) {
    return
  }

  // const scale = useMemo(() => {
  //   if (props.item.texts[0].fontSize && props.item.texts[0].fontSize < 7.5) {
  //     const rate = 7.5 / props.item.texts[0].fontSize
  //     if (rate < 4) {
  //       return 2
  //     } else if (rate < 8) {
  //       return 4
  //     } else if (rate < 10) {
  //       return 8
  //     }
  //     return 10
  //   } else {
  //     return 1
  //   }
  // }, [props.item.texts[0].fontSize])

  const scale = (text: IdmlTextFramePageTextDto) => {
    // if (text.fontSize && text.fontSize < 7.5) {
    //   const rate = 7.5 / text.fontSize
    //   if (rate < 4) {
    //     return 2
    //   } else if (rate < 8) {
    //     return 4
    //   } else if (rate < 10) {
    //     return 8
    //   }
    //   return 10
    // } else {
    //   return 1
    // }
    return 1
  }

  // const convertTcy = (content: string, item: IdmlTextFramePageItem) => {
  //   const regexp = new RegExp(
  //     item.autoTcy > 0 && item.autoTcyIncludeRoman
  //       ? `([^0-9a-zA-Z]*)([0-9a-zA-Z]+)([\\s\\S]*)`
  //       : `([^0-9a-zA-Z]*)([0-9]+|[a-zA-Z]+)([\\s\\S]*)`,
  //     "m",
  //   )
  //   const matches = []
  //   let text = content
  //   let result = text.match(regexp)
  //   while (result) {
  //     if (result[1] !== "") {
  //       matches.push(result[1])
  //     }
  //     if (result[2] !== "") {
  //       matches.push(result[2])
  //     }
  //     text = result[3]
  //     result = text.match(regexp)
  //   }
  //   if (text !== "") {
  //     matches.push(text)
  //   }

  //   const patterns = []
  //   if (item.autoTcy > 0 && item.autoTcyIncludeRoman) {
  //     patterns.push(`[0-9a-zA-Z]{1,${item.autoTcy}}`)
  //   } else if (item.autoTcy > 0) {
  //     patterns.push(`[0-9]{1,${item.autoTcy}}`)
  //   }
  //   if (patterns.length === 0) {
  //     patterns.push(".+")
  //   }
  //   const digitRegexp = new RegExp(`^(?:${patterns.join("|")})$`)
  //   return matches.map((item, i) => {
  //     return (
  //       <span
  //         key={i}
  //         style={{
  //           textCombineUpright:
  //             item.match(digitRegexp) || item.rotateSingleByteCharacters
  //               ? "all"
  //               : "none",
  //         }}
  //       >
  //         {item}
  //       </span>
  //     )
  //   })
  // }
 
  if (props.item.type !== "text") {
    return null
  }
  
  return (
    <div
      data-self={props.item.self}
      data-parent-story={props.item.parentStory}
      // data-scale={scale}
      className={`pointer-events-auto absolute cursor-pointer overflow-hidden whitespace-pre-wrap p-0 outline outline-[0.5pt] ${selectedOutline}`}
      style={{
        left: `${props.item.x}pt`,
        top: `${props.item.y}pt`,
        width: `${props.item.width}pt`,
        height: `${props.item.height}pt`,
      }}
      onClick={(event) => {
        event.stopPropagation()
        props.onClick()
      }}
    >
      <div className='flex'>
        {props.item.texts.map((text) => {
          if (props.item.texts.length > 1) {
            if (text.contents.every((x) => !x.content)) {
              return null
            }
          }

          const scaleValue = scale(text)
          return (
            <div
              key={text.self}
              ref={containerRef}
              className={`flex-auto select-none whitespace-pre-wrap first-line:leading-none`}
              style={{
                fontFeatureSettings: "'palt' 1",
                width: `${
                  props.item.texts.length > 1
                    ? "initial"
                    : (props.item.width * scaleValue) / (textScale.x / 100)
                }pt`,
                height: `${props.item.height * scaleValue}pt`,
                fontFamily: text.fontFamily ?? "ヒラギノ明朝 ProN",
                fontSize: text.fontSize
                  ? `${text.fontSize * scaleValue}pt`
                  : "7.5pt",
                // fontStyle: text.italic ? "italic" : "normal",
                // textDecoration: props.item.underline ? "underline" : "none",
                textAlignLast:
                  text.justification && text.justification === "CenterJustified"
                    ? "center"
                    : "auto",
                // writingMode:
                //   props.item.orientation === "Vertical" ? "vertical-rl" : "inherit",
                lineHeight: text ? `${text.leading * scaleValue}pt` : "1",
                // letterSpacing:
                //   props.item.parentStory in mockStories &&
                //   mockStories[props.item.parentStory].letterSpacing
                //     ? `${mockStories[props.item.parentStory].letterSpacing * scale}pt`
                //     : "normal",
                ...(scaleValue !== 1
                  ? {
                      transform: `scale(${1 / scaleValue}, ${1 / scaleValue})`,
                      transformOrigin: "0 0",
                    }
                  : {}),
              }}
            >
              <p
                ref={boxRef}
                // style={
                //   props.item.horizontalScale !== undefined
                //     ? {
                //         transformOrigin: "left top",
                //         transform: `scale(${textScale.x / 100}, ${
                //           textScale.y / 100
                //         })`,
                //       }
                //     : {}
                // }
              >
                {text.contents.map((content, i) => (
                  <span
                    key={`${props.item.parentStory}_${i}`}
                    style={{
                      color: content.color ? content.color : "inherit",
                      wordBreak: "break-all",
                      // textCombineUpright: content.tatechuyoko ? "all" : "none",
                      textOrientation: text.rotateSingleByteCharacters
                        ? "upright"
                        : "initial",
                    }}
                  >
                    {/* {props.item.texts[0].autoTcy > 0
                    ? convertTcy(content.content, props.item)
                    : content.content} */}
                    {content.breakLine && <br />}
                    {content.content}
                    {content.breakLine && <br />}
                  </span>
                ))}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TextFramePageItem
