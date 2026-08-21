import { useEffect } from 'react'

// https://github.com/excalidraw/excalidraw/blob/7eaf47c9d41a33a6230d8c3a16b5087fc720dcfb/src/packages/excalidraw/index.tsx#L66
export function useDisablePinchZooming(win?: Window) {
  useEffect(() => {
    const _win = win ?? window
    // Only block two-finger pinch zoom. Calling preventDefault() on every
    // touchmove also cancels single-finger taps, long-press text selection,
    // and popup dictionary extensions inside the iframe, so single-finger
    // gestures are left untouched.
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    }

    _win.document.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    })

    return () => {
      _win.document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [win])
}
