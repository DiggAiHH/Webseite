import { spawnSync } from 'node:child_process'
import process from 'node:process'

const PROJECT = process.env.INFRA_COMPOSE_PROJECT ?? 'diggaihh-infra'
const COMPOSE_FILE = process.env.INFRA_COMPOSE_FILE ?? 'docker-compose.infra.yml'
const BASE_URL = process.env.INFRA_BASE_URL ?? 'http://localhost:8080'

function run(cmd, args, { allowFail = false } = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit' })
  if (result.status !== 0 && !allowFail) {
    throw new Error(`Command failed: ${cmd} ${args.join(' ')}`)
  }
  return result.status
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms))
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 7000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function requireHeader(headers, name, predicate, context) {
  const value = headers.get(name)
  if (value == null) {
    throw new Error(`${context}: missing header ${name}`)
  }
  if (!predicate(value)) {
    throw new Error(`${context}: header ${name} did not match. Got: ${value}`)
  }
  return value
}

function requireHeaderIncludes(headers, name, requiredParts, context) {
  const value = requireHeader(headers, name, (v) => v.length > 0, context)
  const lower = value.toLowerCase()

  for (const part of requiredParts) {
    if (!lower.includes(part.toLowerCase())) {
      throw new Error(`${context}: header ${name} missing required part: ${part}. Got: ${value}`)
    }
  }

  return value
}

function requireCspGuards(headers, context) {
  requireHeaderIncludes(
    headers,
    'content-security-policy',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'"
    ],
    context
  )

  const reportOnly = requireHeaderIncludes(
    headers,
    'content-security-policy-report-only',
    [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "form-action 'self'"
    ],
    context
  )

  const lower = reportOnly.toLowerCase()
  if (lower.includes("'unsafe-inline'")) {
    throw new Error(`${context}: content-security-policy-report-only must not include 'unsafe-inline'. Got: ${reportOnly}`)
  }
}

function requireJson(contentType, context) {
  if (!contentType || !contentType.toLowerCase().includes('application/json')) {
    throw new Error(`${context}: expected application/json content-type, got: ${contentType ?? '<missing>'}`)
  }
}

async function waitForOk(path, { attempts = 60, delayMs = 500 } = {}) {
  let lastError = null
  for (let i = 0; i < attempts; i += 1) {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}${path}`, {}, 5000)
      if (res.ok) return
      lastError = new Error(`HTTP ${res.status}`)
    } catch (err) {
      lastError = err
    }
    await sleep(delayMs)
  }
  throw new Error(`Service not ready at ${BASE_URL}${path}: ${lastError?.message ?? 'unknown error'}`)
}

async function main() {
  // Ensure a clean slate for this project name.
  run('docker', ['compose', '-p', PROJECT, '-f', COMPOSE_FILE, 'down', '--remove-orphans'], { allowFail: true })

  run('docker', ['compose', '-p', PROJECT, '-f', COMPOSE_FILE, 'up', '-d', '--build'])

  try {
    await waitForOk('/health')
    await waitForOk('/api/health')

    // 1) Health endpoints
    {
      const res = await fetchWithTimeout(`${BASE_URL}/health`)
      const body = await res.text()
      if (!res.ok) throw new Error(`/health expected 200, got ${res.status}`)
      if (!/healthy/i.test(body)) throw new Error(`/health unexpected body: ${body}`)
    }

    {
      const res = await fetchWithTimeout(`${BASE_URL}/api/health`)
      const body = await res.text()
      if (!res.ok) throw new Error(`/api/health expected 200, got ${res.status}`)
      if (!/ok/i.test(body)) throw new Error(`/api/health unexpected body: ${body}`)

      requireHeader(res.headers, 'cache-control', (v) => /no-store/i.test(v), '/api/health')
    }

    // 2) Security headers should be present (server-level add_header ... always)
    {
      const paths = ['/', '/index.html', '/api/health', '/robots.txt']
      for (const path of paths) {
        const res = await fetchWithTimeout(`${BASE_URL}${path}`)
        if (!res.ok) throw new Error(`${path} expected 200, got ${res.status}`)

        requireHeader(res.headers, 'x-frame-options', (v) => /deny/i.test(v), path)
        requireHeader(res.headers, 'x-content-type-options', (v) => /nosniff/i.test(v), path)
        requireHeader(res.headers, 'referrer-policy', (v) => v.length > 0, path)
        requireHeader(res.headers, 'permissions-policy', (v) => v.length > 0, path)
        requireHeader(res.headers, 'cross-origin-opener-policy', (v) => /same-origin/i.test(v), path)
        requireHeader(res.headers, 'cross-origin-resource-policy', (v) => /same-origin/i.test(v), path)

        requireCspGuards(res.headers, path)
      }
    }

    // 3) Caching behavior
    let html
    {
      const res = await fetchWithTimeout(`${BASE_URL}/`)
      const contentType = res.headers.get('content-type')
      if (!contentType?.toLowerCase().includes('text/html')) {
        throw new Error(`/ expected text/html, got: ${contentType ?? '<missing>'}`)
      }
      requireHeader(res.headers, 'cache-control', (v) => /no-store/i.test(v), '/')
      html = await res.text()
      if (!html.includes('<!DOCTYPE html') && !html.toLowerCase().includes('<html')) {
        throw new Error('/ did not look like HTML')
      }
    }

    {
      const res = await fetchWithTimeout(`${BASE_URL}/index.html`)
      if (!res.ok) throw new Error(`/index.html expected 200, got ${res.status}`)
      requireHeader(res.headers, 'cache-control', (v) => /no-store/i.test(v), '/index.html')
    }

    // Find at least one hashed asset URL and verify immutable caching
    {
      const assetMatch = html.match(/\/(assets\/[^"]+\.(?:js|css))/i)
      if (!assetMatch) {
        throw new Error('Could not find an /assets/*.js|css reference in HTML')
      }

      const assetPath = `/${assetMatch[1]}`
      const res = await fetchWithTimeout(`${BASE_URL}${assetPath}`)
      if (!res.ok) throw new Error(`${assetPath} expected 200, got ${res.status}`)
      requireHeader(res.headers, 'cache-control', (v) => /immutable/i.test(v), assetPath)
    }

    // 4) Lead endpoint behavior with SMTP unconfigured (fail-safe 503)
    {
      const res = await fetchWithTimeout(`${BASE_URL}/api/lead`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: 'arzt@example.com',
          organisation: 'Praxis Dr. Beispiel',
          phone: '',
          message: '',
          productId: '',
          consent: true,
          hp: ''
        })
      })

      requireHeader(res.headers, 'cache-control', (v) => /no-store/i.test(v), '/api/lead')

      const contentType = res.headers.get('content-type')
      requireJson(contentType, '/api/lead')

      const body = await res.json().catch(() => null)
      if (res.status !== 503) {
        throw new Error(`/api/lead expected 503 when SMTP not configured, got ${res.status}. Body: ${JSON.stringify(body)}`)
      }
      if (!body?.error || body.error !== 'SERVICE_NOT_CONFIGURED') {
        throw new Error(`/api/lead expected error SERVICE_NOT_CONFIGURED. Body: ${JSON.stringify(body)}`)
      }
      if (!body?.requestId) {
        throw new Error(`/api/lead expected requestId. Body: ${JSON.stringify(body)}`)
      }
    }

    console.log('infra-smoke: OK')
  } finally {
    run('docker', ['compose', '-p', PROJECT, '-f', COMPOSE_FILE, 'down', '--remove-orphans'], { allowFail: true })
  }
}

await main()
