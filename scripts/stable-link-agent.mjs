import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

function parseArgs(argv) {
  const args = {}

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]

    if (!token.startsWith('--')) {
      continue
    }

    const key = token.slice(2)
    const nextToken = argv[index + 1]

    if (nextToken && !nextToken.startsWith('--')) {
      args[key] = nextToken
      index += 1
      continue
    }

    args[key] = true
  }

  return args
}

function hasFlag(args, key) {
  return args[key] === true
}

function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '')
}

function runCommand(command, args, { capture = false } = {}) {
  const result = spawnSync(command, args, {
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8'
  })

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n')
    throw new Error(`Command failed (${command} ${args.join(' ')}):\n${output}`)
  }

  return result
}

function parseDeployJson(stdout) {
  const trimmed = String(stdout || '').trim()

  if (!trimmed) {
    throw new Error('Netlify deploy output is empty. Could not parse deploy metadata.')
  }

  try {
    return JSON.parse(trimmed)
  } catch {
    // fall through
  }

  const lines = trimmed.split('\n').map((line) => line.trim()).filter(Boolean)
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    try {
      return JSON.parse(lines[index])
    } catch {
      // keep scanning
    }
  }

  throw new Error(`Could not parse Netlify deploy JSON output:\n${trimmed}`)
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function checkEndpoint(name, url, assertion) {
  const startedAt = Date.now()

  try {
    const response = await assertion()
    return {
      name,
      url,
      ok: true,
      statusCode: response?.status ?? null,
      durationMs: Date.now() - startedAt
    }
  } catch (error) {
    return {
      name,
      url,
      ok: false,
      statusCode: error.statusCode ?? null,
      durationMs: Date.now() - startedAt,
      error: error.message
    }
  }
}

async function runSmokeChecks(baseUrl) {
  const frontendUrl = `${baseUrl}/`
  const healthUrl = `${baseUrl}/api/health`
  const leadUrl = `${baseUrl}/api/lead`

  const checks = []

  checks.push(
    await checkEndpoint('frontend-home', frontendUrl, async () => {
      const response = await fetchWithTimeout(frontendUrl)
      const contentType = response.headers.get('content-type') || ''

      if (!response.ok) {
        const error = new Error(`Expected 2xx from ${frontendUrl}, got ${response.status}`)
        error.statusCode = response.status
        throw error
      }

      if (!contentType.toLowerCase().includes('text/html')) {
        throw new Error(`Expected text/html from ${frontendUrl}, got ${contentType || '<missing>'}`)
      }

      return response
    })
  )

  checks.push(
    await checkEndpoint('backend-health', healthUrl, async () => {
      const response = await fetchWithTimeout(healthUrl)
      const contentType = response.headers.get('content-type') || ''

      if (response.status !== 200) {
        const error = new Error(`Expected 200 from ${healthUrl}, got ${response.status}`)
        error.statusCode = response.status
        throw error
      }

      if (contentType.toLowerCase().includes('application/json')) {
        const body = await response.json().catch(() => null)
        if (!body?.ok) {
          throw new Error(`Expected { ok: true } from ${healthUrl}, got ${JSON.stringify(body)}`)
        }
        return response
      }

      const bodyText = await response.text()
      if (!/ok|healthy/i.test(bodyText)) {
        throw new Error(`Expected plain-text health signal from ${healthUrl}, got ${bodyText}`)
      }

      return response
    })
  )

  checks.push(
    await checkEndpoint('backend-lead', leadUrl, async () => {
      const response = await fetchWithTimeout(leadUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: 'qa+stable-link@diggaihh.invalid',
          organisation: 'DiggAiHH QA',
          phone: '',
          message: 'Smoke test request from stable-link-agent',
          productId: 'stable-link-smoke',
          consent: true,
          hp: ''
        })
      })

      const body = await response.json().catch(() => null)

      if (response.status === 200) {
        if (!body?.ok) {
          throw new Error(`Expected ok=true for 200 response from ${leadUrl}, got ${JSON.stringify(body)}`)
        }
        return response
      }

      if (response.status === 503) {
        if (body?.error !== 'SERVICE_NOT_CONFIGURED') {
          throw new Error(`Expected SERVICE_NOT_CONFIGURED for 503 from ${leadUrl}, got ${JSON.stringify(body)}`)
        }
        return response
      }

      const error = new Error(`Expected 200 or 503 from ${leadUrl}, got ${response.status}`)
      error.statusCode = response.status
      throw error
    })
  )

  return {
    ok: checks.every((check) => check.ok),
    checks
  }
}

function getDeployLinks(baseUrl) {
  return {
    frontend: `${baseUrl}/`,
    backendHealth: `${baseUrl}/api/health`,
    backendLead: `${baseUrl}/api/lead`
  }
}

async function writeReport({ mode, baseUrl, deploy, smoke }) {
  const timestamp = new Date().toISOString()
  const report = {
    generatedAt: timestamp,
    mode,
    baseUrl,
    links: getDeployLinks(baseUrl),
    deploy,
    smoke
  }

  const stamp = timestamp.replace(/[:.]/g, '-')
  const reportDirectory = path.resolve('buildLogs')
  const reportPath = path.join(reportDirectory, `${stamp}_stable-link-${mode}.json`)

  await mkdir(reportDirectory, { recursive: true })
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')

  return { report, reportPath }
}

function ensureEnv(name) {
  const value = process.env[name]
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return String(value).trim()
}

async function runDeploy(args) {
  const authToken = ensureEnv('NETLIFY_AUTH_TOKEN')
  const siteId = ensureEnv('NETLIFY_SITE_ID')
  const isProd = !hasFlag(args, 'preview')
  const skipBuild = hasFlag(args, 'skip-build')

  if (!skipBuild) {
    runCommand('npm', ['run', 'build'])
  }

  const deployArgs = [
    'netlify-cli',
    'deploy',
    '--site',
    siteId,
    '--auth',
    authToken,
    '--dir',
    'dist',
    '--functions',
    'netlify/functions',
    '--message',
    `stable-link-agent ${new Date().toISOString()}`,
    '--json'
  ]

  if (isProd) {
    deployArgs.push('--prod')
  }

  const deployResult = runCommand('npx', deployArgs, { capture: true })
  const deployJson = parseDeployJson(deployResult.stdout)

  const baseUrl = normalizeBaseUrl(
    deployJson.ssl_url ||
      deployJson.deploy_ssl_url ||
      deployJson.url ||
      deployJson.deploy_url
  )

  if (!baseUrl) {
    throw new Error(`Could not resolve deployment URL from Netlify output: ${JSON.stringify(deployJson)}`)
  }

  const smoke = await runSmokeChecks(baseUrl)

  const deployMeta = {
    id: deployJson.id || null,
    url: baseUrl,
    context: isProd ? 'production' : 'preview',
    state: deployJson.state || null
  }

  const { reportPath } = await writeReport({
    mode: 'deploy',
    baseUrl,
    deploy: deployMeta,
    smoke
  })

  console.log('Stable link deployment completed')
  console.log(`Frontend URL: ${baseUrl}/`)
  console.log(`Backend health URL: ${baseUrl}/api/health`)
  console.log(`Backend lead URL: ${baseUrl}/api/lead`)
  console.log(`Report: ${reportPath}`)

  if (!smoke.ok) {
    throw new Error('Smoke checks failed after deployment. See report for details.')
  }
}

async function runSmoke(args) {
  const baseUrl = normalizeBaseUrl(args.url || process.env.STABLE_BASE_URL)

  if (!baseUrl) {
    throw new Error('Missing smoke target URL. Provide --url <https://...> or set STABLE_BASE_URL.')
  }

  const smoke = await runSmokeChecks(baseUrl)
  const { reportPath } = await writeReport({
    mode: 'smoke',
    baseUrl,
    deploy: null,
    smoke
  })

  console.log('Stable link smoke run completed')
  console.log(`Frontend URL: ${baseUrl}/`)
  console.log(`Backend health URL: ${baseUrl}/api/health`)
  console.log(`Backend lead URL: ${baseUrl}/api/lead`)
  console.log(`Report: ${reportPath}`)

  if (!smoke.ok) {
    throw new Error('Smoke checks failed. See report for details.')
  }
}

function printUsage() {
  console.log('Usage: node scripts/stable-link-agent.mjs <deploy|smoke> [options]')
  console.log('')
  console.log('Commands:')
  console.log('  deploy    Build + deploy to Netlify and smoke-test stable links')
  console.log('  smoke     Smoke-test an existing stable link URL')
  console.log('')
  console.log('Deploy options:')
  console.log('  --preview      Deploy as preview (default is production)')
  console.log('  --skip-build   Skip npm run build')
  console.log('')
  console.log('Smoke options:')
  console.log('  --url <url>    Base URL to smoke test (or set STABLE_BASE_URL env)')
  console.log('')
  console.log('Required env for deploy: NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID')
}

async function main() {
  const [command = 'help', ...rest] = process.argv.slice(2)
  const args = parseArgs(rest)

  if (command === 'deploy') {
    await runDeploy(args)
    return
  }

  if (command === 'smoke') {
    await runSmoke(args)
    return
  }

  printUsage()
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
