let cachedSupport: boolean | undefined

export function supportsWebGL() {
  if (cachedSupport !== undefined) return cachedSupport

  try {
    const canvas = document.createElement('canvas')
    const context =
      canvas.getContext('webgl') ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)

    cachedSupport = Boolean(window.WebGLRenderingContext && context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return cachedSupport
  } catch {
    cachedSupport = false
    return cachedSupport
  }
}
