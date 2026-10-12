/**
 * Second step of `npm run build:static`, after `next build` with
 * STATIC_EXPORT=1 has written the site to out/:
 *
 * 1. copies deploy/htaccess to out/.htaccess (routing, redirects, headers
 *    and the localized 404 on the Plesk Apache);
 * 2. renders the WebP variants that src/lib/image-variant.ts points to
 *    (/_img/{w}/{path}.webp) with Next's own optimizer, so they are the same
 *    files /_next/image serves on a Node server.
 *
 * Every image that the pages reference through /_img/ gets all srcset widths
 * up to its own width, because client components (the competition panel)
 * build their srcset in the browser and may ask for a width no page has
 * rendered.
 */
import { promises as fs } from 'node:fs'
import { createRequire } from 'node:module'
import os from 'node:os'
import path from 'node:path'

const require = createRequire(import.meta.url)
const { optimizeImage, getImageSize } = require('next/dist/server/image-optimizer')

const root = process.cwd()
const outDir = path.join(root, 'out')
const publicDir = path.join(root, 'public')

/** Union of the srcset widths in competition-card.tsx and news-card.tsx. */
const WIDTHS = [384, 640, 828, 1080, 1200]
const QUALITY = 75
const SOURCE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(file)
    else yield file
  }
}

/** '/images/a/b' → the /public file it was made from ('/images/a/b.jpg'). */
async function findSource(base) {
  for (const ext of SOURCE_EXTENSIONS) {
    const file = path.join(publicDir, `${base}${ext}`)
    try {
      await fs.access(file)
      return file
    } catch {}
  }
  return null
}

async function main() {
  try {
    await fs.access(outDir)
  } catch {
    throw new Error('out/ not found: run `STATIC_EXPORT=1 next build` first')
  }

  await fs.copyFile(path.join(root, 'deploy/htaccess'), path.join(outDir, '.htaccess'))

  // Source images referenced as /_img/{w}{base}.webp in pages and payloads.
  const bases = new Set()
  const pattern = /\/_img\/\d+(\/[^"'\s,)\\]+?)\.webp/g
  for await (const file of walk(outDir)) {
    if (!/\.(?:html|txt|js)$/.test(file)) continue
    const text = await fs.readFile(file, 'utf8')
    for (const match of text.matchAll(pattern)) bases.add(match[1])
  }

  const jobs = []
  for (const base of bases) {
    const source = await findSource(base)
    if (!source) {
      console.warn(`  ! no source image for ${base}`)
      continue
    }
    const buffer = await fs.readFile(source)
    const { width } = await getImageSize(buffer, path.extname(source).slice(1))
    for (const w of WIDTHS.filter(w => w <= width)) {
      jobs.push({ buffer, w, target: path.join(outDir, '_img', String(w), `${base}.webp`) })
    }
  }

  // Next's optimizer runs its own worker pool; keep it busy, not flooded.
  let next = 0
  let bytes = 0
  const worker = async () => {
    while (next < jobs.length) {
      const { buffer, w, target } = jobs[next++]
      const webp = await optimizeImage({
        buffer,
        contentType: 'image/webp',
        quality: QUALITY,
        width: w
      })
      await fs.mkdir(path.dirname(target), { recursive: true })
      await fs.writeFile(target, webp)
      bytes += webp.length
    }
  }
  await Promise.all(Array.from({ length: Math.max(2, os.cpus().length - 1) }, worker))

  console.log(
    `✓ out/.htaccess, ${jobs.length} WebP variants of ${bases.size} images ` +
      `(${(bytes / 1024 / 1024).toFixed(1)} MB) in out/_img`
  )
}

main().then(
  // The optimizer's worker pool keeps the event loop alive.
  () => process.exit(0),
  error => {
    console.error(error)
    process.exit(1)
  }
)
