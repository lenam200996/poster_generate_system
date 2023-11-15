import { useEffect, useRef, useState } from "react"
import { Button, styled } from "@mui/material"
import BaseNumberInput from "@/components/base/form/BaseNumberInput"
import { DraggableData, Position, Rnd } from "react-rnd"
import { DraggableEvent } from "react-draggable"
import { useApiClient } from "@/hooks/useApiClient"

const imageCanvasSize = 200
// const imageAspectRatio = 0.75 //4:3

type ImageType = {
  originalUrl: string
  selectAreaWidth: number
  selectAreaHeight: number
}

type Props = {
  image: ImageType
  onChange: () => void
  onSave: (imageBase64Data: string) => void
}

const WorkspaceImageTriming = (props: Props) => {
  const apiClient = useApiClient()

  // 画像の表示比率(高さ/幅)
  const imageAspectRatio =
    props.image.selectAreaHeight / props.image.selectAreaWidth

  // プレビュー画像をアクセスする参照定義
  const imageRef = useRef<HTMLImageElement>()

  // console.log(
  //   `画像情報: width: ${props.image.imageWidth}, height: ${props.image.imageHeight}, imageCanvasRatio: ${imageCanvasRatio}`,
  // )

  // 初期情報
  const [imageFitInfo, setImageFitInfo] = useState({
    isInit: true,
    top: 0,
    left: 0,
    zoom: 0,
    imageCanvasRatio: 0,
    selectAreaWidth: 0, // 選択枠の幅
    selectAreaHeight: 0, // 選択枠の高さ
    imageWidth: 0, // プレビュー画像幅
    imageHeight: 0, // プレビュー画像高さ
    originalImageWidth: 0, // 元画像の幅
    originalImageHeight: 0, // 元画像の幅
  })

  const [imageTrimmer, setImageTrimmer] = useState({
    top: 0, // 選択枠のTOP座標
    left: 0, // 選択枠のLEFT座標
    zoom: 100, // 選択枠の拡大/縮小比率
    imageCanvasRatio: 0,
    selectAreaWidth: 0, // 選択枠の幅
    selectAreaHeight: 0, // 選択枠の高さ
    imageWidth: 0, // プレビュー画像幅
    imageHeight: 0, // プレビュー画像高さ
    originalImageWidth: 0, // 元画像の幅
    originalImageHeight: 0, // 元画像の幅
  })

  // 選択枠のサイズ変更処理
  const handleOnResizeStop = (ref: HTMLElement, pos: Position) => {
    const w = parsePxToNumber(ref.style.width)
    const h = parsePxToNumber(ref.style.height)
    setImageTrimmer((preStatus) => ({
      ...preStatus,
      top: clampMin(pos.y),
      left: clampMin(pos.x),
      selectAreaWidth: w,
      selectAreaHeight: h,
      zoom: Math.floor((w / preStatus.imageWidth) * 100),
    }))
  }

  // 選択枠のDrag処理
  const handleOnDragStop = (e: DraggableEvent, d: DraggableData) => {
    setImageTrimmer((preStatus) => ({
      ...preStatus,
      top: clampMin(d.y),
      left: clampMin(d.x),
    }))
  }

  const parsePxToNumber = (px: string) => {
    return Number(px.replace(/\D/g, ""))
  }

  const clampMin = (num: number) => {
    if (num < 0) {
      return 0
    } else {
      return Math.floor(num)
    }
  }

  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,0,0,0.3)",
  }

  const imageUrlFormat = (url: string) => {
    const imageUrl =
      url.startsWith("/asset") || url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_API_URL}/v1/idml-replace/workspace/image/${url}`
    return imageUrl
  }

  const imageUrl = imageUrlFormat(props.image.originalUrl)

  useEffect(() => {
    const handleLoad = () => {
      if (
        imageRef.current.naturalWidth > 0 &&
        imageRef.current.naturalHeight > 0 &&
        imageRef.current.width > 0 &&
        imageRef.current.height > 0
      ) {
        const originalImageWidth = imageRef.current.naturalWidth
        const originalImageHeight = imageRef.current.naturalHeight
        const imageWidth = imageRef.current.width
        const imageHeight = imageRef.current.height
        const imageCanvasRatio = imageWidth / originalImageWidth
        // console.log(
        //   "*******>",
        //   imageWidth,
        //   originalImageWidth,
        //   originalImageHeight,
        //   imageCanvasRatio,
        // )

        let selectAreaWidth = props.image.selectAreaWidth
        let selectAreaHeight = props.image.selectAreaHeight

        // もし高さより幅が長い場合は、選択エリアの幅をプレビュー画像に合わせて、
        // 選択エリアの高さをその比率が縮小／拡大する
        if (selectAreaWidth >= selectAreaHeight) {
          selectAreaWidth = imageWidth
          selectAreaHeight =
            (imageWidth / props.image.selectAreaWidth) *
            props.image.selectAreaHeight
        } else {
          selectAreaHeight = imageHeight
          selectAreaWidth =
            (imageHeight / props.image.selectAreaHeight) *
            props.image.selectAreaWidth
        }

        const top = Math.floor((imageHeight - selectAreaHeight) / 2)
        const left = Math.floor((imageWidth - selectAreaWidth) / 2)
        const zoom = Math.floor((selectAreaWidth / imageWidth) * 100)
        // console.log(top, left, zoom)

        setImageTrimmer((preState) => ({
          ...preState,
          top,
          left,
          zoom,
          imageCanvasRatio,
          imageWidth,
          imageHeight,
          originalImageWidth,
          originalImageHeight,
          selectAreaWidth,
          selectAreaHeight,
        }))

        if (imageFitInfo.isInit) {
          setImageFitInfo((preState) => ({
            ...preState,
            isInit: true,
            imageCanvasRatio,
            top: top, // 選択枠のTOP座標
            left: left, // 選択枠のLEFT座標
            zoom: 100, // 選択枠の拡大/縮小比率
            imageWidth,
            imageHeight,
            originalImageWidth,
            originalImageHeight,
            selectAreaWidth,
            selectAreaHeight,
          }))
        }
      }
    }

    const imageEl = imageRef.current
    if (imageEl) {
      imageEl.addEventListener("load", handleLoad)
    }

    return () => {
      if (imageEl) {
        imageEl.removeEventListener("load", handleLoad)
      }
    }
  }, [])

  // console.log("====>", imageTrimmer)

  const urlToFile = async (url: string, filename: string, mimeType: string) => {
    const formatedURL = imageUrlFormat(url)
    if (formatedURL && formatedURL.startsWith("http")) {
      // S3の画像ファイル名に拡張子がない場合は、CORSが正しく動かない
      const timestamp = new Date().getTime()
      const imageUrlWithTimestamp = `${formatedURL}?${timestamp}`
      const response = await fetch(imageUrlWithTimestamp)
      const data = await response.blob()
      return new File([data], filename, { type: mimeType })
    }

    return new File([""], filename, { type: mimeType })
  }

  const handleOnChange = async () => {
    props.onChange()
  }

  const handleOnSave = async () => {
    const startTop = imageTrimmer.top / imageTrimmer.imageCanvasRatio
    const startLeft = imageTrimmer.left / imageTrimmer.imageCanvasRatio
    const width = imageTrimmer.selectAreaWidth / imageTrimmer.imageCanvasRatio
    const height = imageTrimmer.selectAreaHeight / imageTrimmer.imageCanvasRatio

    // console.log(imageTrimmer, imageTrimmer.imageCanvasRatio)

    // console.log(
    //   ` x: ${startLeft},y: ${startTop}, width: ${width}, height: ${height}`,
    // )

    const partsImageFile = await urlToFile(
      props.image.originalUrl,
      "image.jpg",
      "image/jpeg",
    )

    if (partsImageFile.size === 0) {
      alert("画像ファイルが正しく取得できません")
      return
    }

    const { data } =
      await apiClient.idmlReplaceApiFactory.idmlReplaceControllerImageCropping(
        width,
        height,
        startLeft,
        startTop,
        partsImageFile,
      )

    props.onSave(data.message)
  }

  return (
    <>
      <div className='flex items-center'>
        <div className={`relative w-[${imageCanvasSize}px]`}>
          <div>
            <Rnd
              size={{
                width: imageTrimmer.selectAreaWidth,
                height: imageTrimmer.selectAreaHeight,
              }}
              position={{ x: imageTrimmer.left, y: imageTrimmer.top }}
              onResizeStop={(_e, _dir, ref, _delta, pos) => {
                handleOnResizeStop(ref, pos)
              }}
              onDragStop={(e, data) => {
                handleOnDragStop(e, data)
              }}
              style={style}
              bounds={"parent"}
              default={{
                x: imageTrimmer.left,
                y: imageTrimmer.top,
                width: imageTrimmer.selectAreaWidth,
                height: imageTrimmer.selectAreaHeight,
              }}
              lockAspectRatio={true}
            ></Rnd>
            <div className='flex items-center justify-between'>
              <img
                ref={imageRef}
                className='h-full w-full object-contain'
                src={imageUrl}
                alt='image'
              />
            </div>
          </div>
        </div>
        <div className='ml-5 flex-auto'>
          <div className='flex items-center justify-between'>
            <div className='mr-5'>
              <div className='mb-5'>
                <BaseNumberInput
                  label={"Top"}
                  value={imageTrimmer.top}
                  plusDisabled={
                    imageTrimmer.top + imageTrimmer.selectAreaHeight >=
                    imageTrimmer.selectAreaWidth * imageAspectRatio
                  }
                  minusDisabled={imageTrimmer.top <= 0}
                  onIncrease={() => {
                    setImageTrimmer((prev) => {
                      const newHeight = prev.top + 1 + prev.selectAreaHeight
                      let top = prev.top + 1
                      if (
                        newHeight >
                        imageTrimmer.selectAreaWidth * imageAspectRatio
                      ) {
                        top =
                          imageTrimmer.selectAreaWidth * imageAspectRatio -
                          prev.selectAreaHeight
                      }
                      return {
                        ...prev,
                        top: top,
                      }
                    })
                  }}
                  onDecrease={() => {
                    setImageTrimmer((prev) => {
                      return {
                        ...prev,
                        top: clampMin(prev.top - 1),
                      }
                    })
                  }}
                  onChange={(value) => {
                    setImageTrimmer((prev) => {
                      const newHeight = value + prev.selectAreaHeight
                      if (newHeight > imageCanvasSize * imageAspectRatio) {
                        const target =
                          imageCanvasSize * imageAspectRatio -
                          (prev.selectAreaHeight + prev.top)
                        return {
                          ...prev,
                          top: prev.top + target,
                        }
                      }
                      return {
                        ...prev,
                        top: value,
                      }
                    })
                  }}
                ></BaseNumberInput>
              </div>
              <div className='mb-5'>
                <BaseNumberInput
                  label={"Left"}
                  value={imageTrimmer.left}
                  plusDisabled={
                    imageTrimmer.left + imageTrimmer.selectAreaWidth >=
                    imageCanvasSize
                  }
                  minusDisabled={imageTrimmer.left <= 0}
                  onIncrease={() => {
                    setImageTrimmer((prev) => {
                      const newWidth = prev.left + 1 + prev.selectAreaWidth
                      let left = prev.left + 1
                      if (newWidth > imageCanvasSize) {
                        left = imageCanvasSize - prev.selectAreaWidth
                      }
                      return {
                        ...prev,
                        left: left,
                      }
                    })
                  }}
                  onDecrease={() => {
                    setImageTrimmer((prev) => {
                      return {
                        ...prev,
                        left: clampMin(prev.left - 1),
                      }
                    })
                  }}
                  onChange={(value) => {
                    setImageTrimmer((prev) => {
                      const newWidth = value + prev.selectAreaWidth
                      if (newWidth > imageCanvasSize) {
                        const target =
                          imageCanvasSize - (prev.selectAreaWidth + prev.left)
                        return {
                          ...prev,
                          left: prev.left + target,
                        }
                      }
                      return {
                        ...prev,
                        left: value,
                      }
                    })
                  }}
                ></BaseNumberInput>
              </div>
              <div className='mb-5'>
                <BaseNumberInput
                  label={"Zoom"}
                  unit='%'
                  value={imageTrimmer.zoom}
                  maxNum={100}
                  minNum={1}
                  plusDisabled={imageTrimmer.zoom >= 100}
                  minusDisabled={imageTrimmer.zoom <= 1}
                  onIncrease={() => {
                    setImageTrimmer((prev) => {
                      const newWidth = imageCanvasSize * ((prev.zoom + 1) / 100)
                      const newHeight = newWidth * imageAspectRatio
                      return {
                        ...prev,
                        zoom: prev.zoom + 1,
                        selectAreaWidth: newWidth,
                        selectAreaHeight: newHeight,
                      }
                    })
                  }}
                  onDecrease={() => {
                    setImageTrimmer((prev) => {
                      const newWidth = imageCanvasSize * ((prev.zoom - 1) / 100)
                      const newHeight = newWidth * imageAspectRatio
                      return {
                        ...prev,
                        zoom: prev.zoom - 1,
                        selectAreaWidth: newWidth,
                        selectAreaHeight: newHeight,
                      }
                    })
                  }}
                  onChange={(value) => {
                    setImageTrimmer((prev) => {
                      const newValue =
                        value >= 100 ? 100 : value <= 1 ? 1 : value
                      const newWidth = imageCanvasSize * (newValue / 100)
                      const newHeight = newWidth * imageAspectRatio

                      // 選択枠が超過した場合は、TOPとLEFTの座標位置を再計算する必要がある
                      let top = prev.top
                      let left = prev.left

                      if (newHeight + prev.top > prev.imageHeight) {
                        top = Math.floor(prev.imageHeight - newHeight)
                      }

                      if (newWidth + prev.left > prev.imageWidth) {
                        left = Math.floor(prev.imageWidth - newWidth)
                      }

                      return {
                        ...prev,
                        top,
                        left,
                        zoom: newValue,
                        selectAreaWidth: newWidth,
                        selectAreaHeight: newHeight,
                      }
                    })
                  }}
                ></BaseNumberInput>
              </div>
              <div className='ml-[51px]'>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => {
                    setImageTrimmer((prev) => {
                      return {
                        ...prev,
                        ...imageFitInfo,
                      }
                    })
                  }}
                >
                  フィット
                </Button>
              </div>
            </div>
            <div>
              <div className='flex flex-col items-center justify-center gap-y-5'>
                <Button variant='outlined' size='small' onClick={handleOnSave}>
                  決定
                </Button>
                <Button
                  variant='contained'
                  size='small'
                  onClick={handleOnChange}
                >
                  変更
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default WorkspaceImageTriming
