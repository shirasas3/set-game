import { useCallback, useState } from 'react'
import { DEFAULT_SHAPE_IMAGES } from './config'
import { shrinkImage } from './imageUtils'

const KEY = 'set-shape-images'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}
function save(o) {
  try { localStorage.setItem(KEY, JSON.stringify(o)) } catch { /* storage full or blocked */ }
}

// Returns images = [img0, img1, img2] (null = built-in vector shape)
export function useShapeImages() {
  const [custom, setCustom] = useState(load)

  const images = [0, 1, 2].map((i) => custom[i] ?? DEFAULT_SHAPE_IMAGES[i] ?? null)

  const setImage = useCallback(async (shape, file) => {
    if (!file) return
    const data = await shrinkImage(file)
    setCustom((c) => { const n = { ...c, [shape]: data }; save(n); return n })
  }, [])

  const reset = useCallback((shape) => {
    setCustom((c) => { const n = { ...c }; delete n[shape]; save(n); return n })
  }, [])

  return { images, setImage, reset, isCustom: (i) => custom[i] != null }
}
