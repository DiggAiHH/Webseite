import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

export const AGENT_PACK_INPUTS = [
  'public/agent-integration.md',
  'public/llms.txt',
  'public/.well-known/ai.json',
  'public/.well-known/agent-integration.json',
  'public/data/products.json',
  'public/data/faq.json',
  'public/data/compliance-summary.json',
  'public/data/agent-integrations.json',
  'public/data/product-entity-map.json',
  'public/data/product-comparison.json'
]

function parseOutDirArg() {
  const outFlagIndex = process.argv.indexOf('--out')

  if (outFlagIndex === -1) {
    return path.join(rootDir, 'dist', 'agent-pack')
  }

  const value = process.argv[outFlagIndex + 1]
  if (!value) {
    throw new Error('Missing value for --out')
  }

  if (path.isAbsolute(value)) {
    return value
  }

  return path.resolve(rootDir, value)
}

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex')
}

async function exportPack(outDir) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })

  const files = []

  for (const sourceRelPath of AGENT_PACK_INPUTS) {
    const sourcePath = path.join(rootDir, sourceRelPath)
    const fileBytes = await readFile(sourcePath)

    const targetRelPath = sourceRelPath.replace(/^public\//, '')
    const targetPath = path.join(outDir, targetRelPath)

    await mkdir(path.dirname(targetPath), { recursive: true })
    await writeFile(targetPath, fileBytes)

    files.push({
      source: `/${targetRelPath}`,
      file: targetRelPath,
      bytes: fileBytes.byteLength,
      sha256: sha256(fileBytes)
    })
  }

  const manifest = {
    name: 'diggaihh-agent-pack',
    generatedAt: new Date().toISOString(),
    baseUrl: 'https://diggaihh.de',
    files
  }

  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  const wellKnownSource = path.join(rootDir, 'public', '.well-known')
  const wellKnownTarget = path.join(outDir, '.well-known')
  await cp(wellKnownSource, wellKnownTarget, { recursive: true })

  return files.length
}

export { exportPack }

async function main() {
  const outDir = parseOutDirArg()
  const exportedCount = await exportPack(outDir)

  console.log(`[agent-pack] exported ${exportedCount} files to ${outDir}`)
  console.log('[agent-pack] includes manifest.json with SHA-256 checksums')
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  main().catch((error) => {
    console.error('[agent-pack] export failed:', error)
    process.exitCode = 1
  })
}
