/**
 * URL of a `w`-pixel-wide WebP variant of an image in /public.
 *
 * On a Node server that is Next's optimizer (/_next/image; `w` must be one of
 * its default device/image sizes, or it answers 400). The static build for
 * hoster.kz has no optimizer, so it points to /_img/{w}/{path}.webp, a file
 * that scripts/finish-export.mjs renders after `next build` for every such
 * URL found in out/.
 */
export function imageVariant(src: string, w: number) {
  if (process.env.STATIC_EXPORT === '1') {
    return `/_img/${w}${src.replace(/\.[a-z]+$/i, '')}.webp`
  }
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`
}
