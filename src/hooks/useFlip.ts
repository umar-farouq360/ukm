import { useLayoutEffect, useRef, type RefObject } from 'react'

const EASE = 'cubic-bezier(.23, 1, .32, 1)'

/**
 * Keeps a changing list calm: cards that stay glide to their new slot and the list height eases
 * between sizes, so filtering never makes the page jump. Newly added cards animate in through CSS.
 * Mark each item with `data-flip="<stable key>"`.
 */
export function useFlip(container: RefObject<HTMLElement | null>, deps: readonly unknown[]) {
  const rects = useRef(new Map<string, DOMRect>())
  const height = useRef<number | null>(null)

  useLayoutEffect(() => {
    const el = container.current
    if (!el) { rects.current = new Map(); height.current = null; return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const origin = el.getBoundingClientRect()
    const next = new Map<string, DOMRect>()

    el.querySelectorAll<HTMLElement>('[data-flip]').forEach((node) => {
      const key = node.dataset.flip as string
      const r = node.getBoundingClientRect()
      const rel = new DOMRect(r.left - origin.left, r.top - origin.top, r.width, r.height)
      next.set(key, rel)
      const prev = rects.current.get(key)
      if (!prev || reduce) return
      const dx = prev.left - rel.left
      const dy = prev.top - rel.top
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        node.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 420, easing: EASE })
      }
    })

    const h = origin.height
    if (!reduce && height.current !== null && Math.abs(height.current - h) > 2) {
      el.animate([{ height: `${height.current}px`, overflow: 'hidden' }, { height: `${h}px`, overflow: 'hidden' }], { duration: 380, easing: EASE })
    }

    rects.current = next
    height.current = h
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
