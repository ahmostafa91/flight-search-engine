import { useEffect, useMemo, useRef, useState } from 'react'

// Simple window-based virtual list (fixed item height estimate)
// Renders slice of items visible in the viewport based on window scroll.
// Pros: no dependency. Cons: assumes roughly fixed row height.
export default function VirtualList({
  items = [],
  estimateHeight = 200,
  overscan = 4,
  renderItem, // (item, index) => ReactNode
  getKey = (item, index) => index,
}) {
  const containerRef = useRef(null)
  const [viewport, setViewport] = useState({ top: 0, height: 0 })

  useEffect(() => {
    function update() {
      const top = window.scrollY || window.pageYOffset || 0
      const height = window.innerHeight || 800
      setViewport({ top, height })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const offsetTop = useMemo(() => {
    let el = containerRef.current
    let top = 0
    while (el) {
      top += el.offsetTop || 0
      el = el.offsetParent
    }
    return top
  }, [containerRef.current, items.length])

  const total = items.length
  const totalHeight = total * estimateHeight

  const startIndex = Math.max(0, Math.floor((viewport.top - offsetTop) / estimateHeight) - overscan)
  const endIndex = Math.min(total - 1, Math.ceil((viewport.top - offsetTop + viewport.height) / estimateHeight) + overscan)
  const slice = items.slice(startIndex, endIndex + 1)
  const padTop = startIndex * estimateHeight

  return (
    <div ref={containerRef} style={{ position: 'relative', height: totalHeight }}>
      <div style={{ position: 'absolute', top: padTop, left: 0, right: 0 }}>
        {slice.map((item, i) => {
          const idx = startIndex + i
          return (
            <div key={getKey(item, idx)} style={{ height: estimateHeight, overflow: 'visible' }}>
              {renderItem(item, idx)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
