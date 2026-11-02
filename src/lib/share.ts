export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}

export async function downloadCanvas(canvas: HTMLCanvasElement, filename: string): Promise<boolean> {
  const blob = await canvasToBlob(canvas)
  if (!blob) return false
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 2000)
  return true
}

export type ShareOutcome = 'shared' | 'copied' | 'cancelled' | 'failed'

/**
 * Web Share API when available (with the PNG attached if the browser allows it),
 * otherwise copies the text to the clipboard.
 */
export async function shareContent(opts: { title: string; text: string; canvas?: HTMLCanvasElement | null; filename?: string }): Promise<ShareOutcome> {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      const data: ShareData = { title: opts.title, text: opts.text }
      if (opts.canvas) {
        const blob = await canvasToBlob(opts.canvas)
        if (blob) {
          const file = new File([blob], opts.filename ?? 'diyaverse.png', { type: 'image/png' })
          if (navigator.canShare?.({ files: [file] })) data.files = [file]
        }
      }
      await navigator.share(data)
      return 'shared'
    }
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'
    // fall through to clipboard
  }
  try {
    await navigator.clipboard.writeText(opts.text)
    return 'copied'
  } catch {
    return 'failed'
  }
}
