import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PRODUCT_SEO_INDEX } from '../src/utils/productSeoIndex.js'
import { BASE_URL, getIndexableRoutePaths } from '../src/utils/seo.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const outPath = path.join(rootDir, 'public', 'sitemap.xml')

const ROUTE_META = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/products': { changefreq: 'weekly', priority: '0.8' },
  '/kontakt': { changefreq: 'monthly', priority: '0.5' },
  '/security': { changefreq: 'monthly', priority: '0.5' },
  '/lageropt': { changefreq: 'weekly', priority: '0.7' },
  '/roi': { changefreq: 'weekly', priority: '0.7' }
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function toUrl(pathname) {
  if (pathname === '/') return `${BASE_URL}/`
  return `${BASE_URL}${pathname}`
}

function buildEntry(pathname, fallbackChangefreq = 'monthly', fallbackPriority = '0.6') {
  const meta = ROUTE_META[pathname] ?? {
    changefreq: fallbackChangefreq,
    priority: fallbackPriority
  }

  return {
    loc: toUrl(pathname),
    changefreq: meta.changefreq,
    priority: meta.priority
  }
}

function renderSitemap(entries) {
  const body = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`
}

async function main() {
  const routePaths = getIndexableRoutePaths()
  const staticEntries = routePaths.map((pathname) => buildEntry(pathname))

  const productEntries = Array.from(PRODUCT_SEO_INDEX.keys()).map((productId) =>
    buildEntry(`/products/${productId}`, 'monthly', '0.6')
  )

  const allEntries = [...staticEntries, ...productEntries]
  const deduped = Array.from(new Map(allEntries.map((entry) => [entry.loc, entry])).values())

  const sitemap = renderSitemap(deduped)
  await writeFile(outPath, `${sitemap}\n`, 'utf8')

  console.log(`[sitemap] generated ${deduped.length} URLs at ${outPath}`)
}

main().catch((error) => {
  console.error('[sitemap] generation failed:', error)
  if (typeof globalThis.process !== 'undefined') {
    globalThis.process.exitCode = 1
  }
})
