import { useState } from "react"

export const useRerender = () => {
  const [dummy, setDummy] = useState<number>(0)
  const update = () => {
    setDummy(v => v + 1)
  }
  return [dummy, update] as [number, () => void]
}
