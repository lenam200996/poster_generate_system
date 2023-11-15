import { useEffect, useRef, DependencyList } from "react"

export const useCostomEffect = (
  callback: () => void,
  dependencies: DependencyList,
) => {
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    return callback()
  }, dependencies)
}
