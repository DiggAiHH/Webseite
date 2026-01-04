import { Helmet } from 'react-helmet-async'

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function resolveSiteUrl() {
  const configured = import.meta?.env?.VITE_SITE_URL
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured.replace(/\/$/, '')
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }

  return 'https://diggaihh.de'
}

function resolveOgImageUrl(siteUrl) {
  const configured = import.meta?.env?.VITE_OG_IMAGE_URL
  if (typeof configured === 'string' && configured.trim().length > 0) {
    return configured
  }

  return `${siteUrl}/og-image.png`
}

export default function Seo({
  title,
  description,
  canonicalPath,
  robots = 'index,follow',
  ogType = 'website',
  ogImageUrl
}) {
  const siteUrl = resolveSiteUrl()
  const canonicalUrl = `${siteUrl}${normalizePath(canonicalPath ?? '/')}`
  const imageUrl = ogImageUrl ?? resolveOgImageUrl(siteUrl)

  return (
    <Helmet>
      {title ? <title>{title}</title> : null}
      {description ? <meta name="description" content={description} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="DiggAiHH" />
      <meta property="og:url" content={canonicalUrl} />
      {title ? <meta property="og:title" content={title} /> : null}
      {description ? <meta property="og:description" content={description} /> : null}
      {imageUrl ? <meta property="og:image" content={imageUrl} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      {title ? <meta name="twitter:title" content={title} /> : null}
      {description ? <meta name="twitter:description" content={description} /> : null}
      {imageUrl ? <meta name="twitter:image" content={imageUrl} /> : null}
    </Helmet>
  )
}
