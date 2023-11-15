import React, { useEffect, useRef, useState } from "react"

interface ScrollerProps {
  settings: {
    itemHeight: number
    amount: number
    tolerance?: number
    minIndex?: number
    maxIndex?: number
    startIndex: number
  }
  get?: (index: number, bufferedItems: number) => any[]
  row: (item: any, index: number) => React.ReactNode
}

const setInitialState = (settings: ScrollerProps["settings"]) => {
  const { itemHeight, amount, tolerance, minIndex, maxIndex, startIndex } =
    settings
  const viewportHeight = amount * itemHeight
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight
  const toleranceHeight = tolerance * itemHeight
  const bufferHeight = viewportHeight + 2 * toleranceHeight
  const bufferedItems = amount + 2 * tolerance
  const itemsAbove = startIndex - tolerance - minIndex
  const topPaddingHeight = itemsAbove * itemHeight
  const bottomPaddingHeight = totalHeight - topPaddingHeight
  const initialPosition = topPaddingHeight + toleranceHeight
  return {
    settings,
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: [],
  }
}

const Scroller: React.FC<ScrollerProps> = (props) => {
  const viewportElement = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState(setInitialState(props.settings))

  const runScroller = (scrollTop: number) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex },
    } = state
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight)
    if (props.get) {
      const data = props.get(index, bufferedItems)
      const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0)
      const bottomPaddingHeight = Math.max(
        totalHeight - topPaddingHeight - data.length * itemHeight,
        0,
      )

      setState({
        ...state,
        topPaddingHeight,
        bottomPaddingHeight,
        data,
      })
    }
  }

  useEffect(() => {
    if (viewportElement.current) {
      viewportElement.current.scrollTop = state.initialPosition
      if (!state.initialPosition) {
        runScroller(0)
      }
    }
  }, [state])

  return (
    <div
      className='viewport'
      ref={viewportElement}
      onScroll={(e) => runScroller(e.currentTarget.scrollTop)}
      style={{ height: state.viewportHeight, overflow: "auto" }}
    >
      <div style={{ height: state.topPaddingHeight }} />
      {state.data.map((item, index) => (
        <div key={index}>{props.row(item, index)}</div>
      ))}
      <div style={{ height: state.bottomPaddingHeight }} />
    </div>
  )
}

export default Scroller
