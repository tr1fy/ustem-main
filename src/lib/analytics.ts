/** GA4 event helper (TZ §10). No-op until analytics consent loads gtag. */
export function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag
  if (typeof gtag === 'function') gtag('event', event, params)
}
