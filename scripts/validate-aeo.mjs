import { access, mkdtemp, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { AGENT_PACK_INPUTS, exportPack } from './build-agent-pack.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const REQUIRED_MACHINE_READABLE_KEYS = [
  'products',
  'faq',
  'compliance',
  'integrations',
  'entityMap',
  'comparison'
]

const VALID_COMPLEXITIES = new Set(['low', 'medium', 'high'])
const VALID_REFRESH_VALUES = new Set(['daily', 'weekly', 'monthly'])

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertNonEmptyString(value, label) {
  assert(typeof value === 'string' && value.trim().length > 0, `${label} must be a non-empty string`)
}

function assertArray(value, label) {
  assert(Array.isArray(value) && value.length > 0, `${label} must be a non-empty array`)
}

function assertUnique(values, label) {
  const uniqueCount = new Set(values).size
  assert(uniqueCount === values.length, `${label} must not contain duplicates`)
}

function toAbsolute(relativePath) {
  return path.join(rootDir, relativePath)
}

function publicPathToRelative(publicPath, label) {
  assertNonEmptyString(publicPath, label)
  assert(publicPath.startsWith('/'), `${label} must start with /`)
  return path.join('public', publicPath.slice(1))
}

async function ensureFileExists(relativePath, label = relativePath) {
  try {
    await access(toAbsolute(relativePath))
  } catch {
    throw new Error(`${label} is missing at ${relativePath}`)
  }
}

async function readJsonFile(relativePath, label = relativePath) {
  const absolutePath = toAbsolute(relativePath)

  try {
    const raw = await readFile(absolutePath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`)
  }
}

async function readPublicJson(publicPath, label = publicPath) {
  return readJsonFile(publicPathToRelative(publicPath, label), label)
}

function productRoute(productId) {
  return `/products/${productId}`
}

async function validateAiManifest(aiManifest) {
  assertNonEmptyString(aiManifest.name, 'aiManifest.name')
  assertNonEmptyString(aiManifest.site, 'aiManifest.site')
  assertNonEmptyString(aiManifest.defaultLanguage, 'aiManifest.defaultLanguage')
  assertArray(aiManifest.languages, 'aiManifest.languages')

  assert(aiManifest.documentation && typeof aiManifest.documentation === 'object', 'aiManifest.documentation must exist')
  await ensureFileExists(publicPathToRelative(aiManifest.documentation.integrationGuide, 'aiManifest.documentation.integrationGuide'))
  await ensureFileExists(publicPathToRelative(aiManifest.documentation.llms, 'aiManifest.documentation.llms'))

  assert(aiManifest.repository && typeof aiManifest.repository === 'object', 'aiManifest.repository must exist')
  assert(aiManifest.repository.packCommand === 'npm run aeo:pack', 'aiManifest.repository.packCommand must equal npm run aeo:pack')
  assert(aiManifest.repository.validateCommand === 'npm run validate:aeo', 'aiManifest.repository.validateCommand must equal npm run validate:aeo')
  assert(aiManifest.repository.packOutput === 'dist/agent-pack/manifest.json', 'aiManifest.repository.packOutput must point to dist/agent-pack/manifest.json')

  assert(aiManifest.machineReadable && typeof aiManifest.machineReadable === 'object', 'aiManifest.machineReadable must exist')

  for (const key of REQUIRED_MACHINE_READABLE_KEYS) {
    await readPublicJson(aiManifest.machineReadable[key], `aiManifest.machineReadable.${key}`)
  }
}

async function validateAgentIntegrationManifest(aiManifest, integrationManifest) {
  assertNonEmptyString(integrationManifest.name, 'integrationManifest.name')
  assertNonEmptyString(integrationManifest.version, 'integrationManifest.version')
  assertArray(integrationManifest.sources, 'integrationManifest.sources')

  const sourceIds = []
  const sourceUrls = []

  for (const [index, source] of integrationManifest.sources.entries()) {
    assertNonEmptyString(source.id, `integrationManifest.sources[${index}].id`)
    assertNonEmptyString(source.url, `integrationManifest.sources[${index}].url`)
    assertNonEmptyString(source.format, `integrationManifest.sources[${index}].format`)
    assert(VALID_REFRESH_VALUES.has(source.refresh), `integrationManifest.sources[${index}].refresh must be daily, weekly, or monthly`)

    sourceIds.push(source.id)
    sourceUrls.push(source.url)

    await readPublicJson(source.url, `integrationManifest.sources[${index}].url`)
  }

  assertUnique(sourceIds, 'integrationManifest.source ids')
  assertUnique(sourceUrls, 'integrationManifest.source urls')

  const machineReadableUrls = Object.values(aiManifest.machineReadable)
  assertUnique(machineReadableUrls, 'aiManifest.machineReadable urls')
  assert(machineReadableUrls.length === sourceUrls.length, 'AEO manifest source counts must match')

  for (const machineReadableUrl of machineReadableUrls) {
    assert(sourceUrls.includes(machineReadableUrl), `Missing integration source for ${machineReadableUrl}`)
  }

  assert(integrationManifest.documentation && typeof integrationManifest.documentation === 'object', 'integrationManifest.documentation must exist')
  assert(integrationManifest.documentation.guide === aiManifest.documentation.integrationGuide, 'integrationManifest.documentation.guide must match ai manifest integrationGuide')
  assert(integrationManifest.documentation.llms === aiManifest.documentation.llms, 'integrationManifest.documentation.llms must match ai manifest llms path')

  assert(integrationManifest.localBuild && typeof integrationManifest.localBuild === 'object', 'integrationManifest.localBuild must exist')
  assert(integrationManifest.localBuild.command === 'npm run aeo:pack', 'integrationManifest.localBuild.command must equal npm run aeo:pack')
  assert(integrationManifest.localBuild.validateCommand === 'npm run validate:aeo', 'integrationManifest.localBuild.validateCommand must equal npm run validate:aeo')
  assert(integrationManifest.localBuild.output === 'dist/agent-pack', 'integrationManifest.localBuild.output must equal dist/agent-pack')
  assert(integrationManifest.localBuild.manifest === 'dist/agent-pack/manifest.json', 'integrationManifest.localBuild.manifest must equal dist/agent-pack/manifest.json')
}

function validateProducts(productsPayload) {
  assertArray(productsPayload.products, 'products.products')

  const ids = []

  for (const [index, product] of productsPayload.products.entries()) {
    assertNonEmptyString(product.id, `products.products[${index}].id`)
    assertNonEmptyString(product.title, `products.products[${index}].title`)
    assertNonEmptyString(product.shortDescription, `products.products[${index}].shortDescription`)
    assertNonEmptyString(product.longDescription, `products.products[${index}].longDescription`)
    assertNonEmptyString(product.repoUrl, `products.products[${index}].repoUrl`)
    assert(product.repoUrl.startsWith('https://github.com/'), `products.products[${index}].repoUrl must point to GitHub over HTTPS`)
    assert(typeof product.priceEUR === 'number' && product.priceEUR > 0, `products.products[${index}].priceEUR must be a positive number`)
    assert(VALID_COMPLEXITIES.has(product.complexity), `products.products[${index}].complexity must be low, medium, or high`)
    assertArray(product.tags, `products.products[${index}].tags`)
    assertArray(product.tech, `products.products[${index}].tech`)
    assertArray(product.features, `products.products[${index}].features`)
    ids.push(product.id)
  }

  assertUnique(ids, 'products ids')

  return new Set(ids)
}

function validateFaq(faqPayload) {
  assertArray(faqPayload.sections, 'faq.sections')

  for (const [sectionIndex, section] of faqPayload.sections.entries()) {
    assertNonEmptyString(section.id, `faq.sections[${sectionIndex}].id`)
    assertNonEmptyString(section.title, `faq.sections[${sectionIndex}].title`)
    assertNonEmptyString(section.route, `faq.sections[${sectionIndex}].route`)
    assert(section.route.startsWith('/'), `faq.sections[${sectionIndex}].route must start with /`)
    assertArray(section.items, `faq.sections[${sectionIndex}].items`)

    for (const [itemIndex, item] of section.items.entries()) {
      assertNonEmptyString(item.question, `faq.sections[${sectionIndex}].items[${itemIndex}].question`)
      assertNonEmptyString(item.answer, `faq.sections[${sectionIndex}].items[${itemIndex}].answer`)
    }
  }
}

function validateCompliance(compliancePayload) {
  assertNonEmptyString(compliancePayload.version, 'compliance.version')
  assertNonEmptyString(compliancePayload.notice, 'compliance.notice')
  assertArray(compliancePayload.standards, 'compliance.standards')
  assert(compliancePayload.links && typeof compliancePayload.links === 'object', 'compliance.links must exist')

  for (const [index, standard] of compliancePayload.standards.entries()) {
    assertNonEmptyString(standard.name, `compliance.standards[${index}].name`)
    assertNonEmptyString(standard.status, `compliance.standards[${index}].status`)
    assertArray(standard.focus, `compliance.standards[${index}].focus`)
  }

  for (const [key, route] of Object.entries(compliancePayload.links)) {
    assertNonEmptyString(route, `compliance.links.${key}`)
    assert(route.startsWith('/'), `compliance.links.${key} must start with /`)
  }
}

function validateEntityMap(entityMapPayload, productIds) {
  assertArray(entityMapPayload.entities, 'entityMap.entities')
  assert(entityMapPayload.entities.length === productIds.size, 'entityMap.entities must cover every product')

  const ids = []

  for (const [index, entity] of entityMapPayload.entities.entries()) {
    assertNonEmptyString(entity.id, `entityMap.entities[${index}].id`)
    assert(productIds.has(entity.id), `entityMap.entities[${index}].id must exist in products.json`)
    assertNonEmptyString(entity.name, `entityMap.entities[${index}].name`)
    assert(entity.route === productRoute(entity.id), `entityMap.entities[${index}].route must equal ${productRoute(entity.id)}`)
    assertArray(entity.aliases, `entityMap.entities[${index}].aliases`)
    assertArray(entity.primaryIntents, `entityMap.entities[${index}].primaryIntents`)
    assertArray(entity.tags, `entityMap.entities[${index}].tags`)
    ids.push(entity.id)
  }

  assertUnique(ids, 'entityMap entity ids')
}

function validateComparison(comparisonPayload, productIds) {
  assertArray(comparisonPayload.dimensions, 'comparison.dimensions')
  assertArray(comparisonPayload.products, 'comparison.products')
  assert(comparisonPayload.products.length === productIds.size, 'comparison.products must cover every product')

  const ids = []

  for (const [index, product] of comparisonPayload.products.entries()) {
    assertNonEmptyString(product.id, `comparison.products[${index}].id`)
    assert(productIds.has(product.id), `comparison.products[${index}].id must exist in products.json`)
    assert(product.route === productRoute(product.id), `comparison.products[${index}].route must equal ${productRoute(product.id)}`)
    assertNonEmptyString(product.useCase, `comparison.products[${index}].useCase`)
    assert(VALID_COMPLEXITIES.has(product.complexity), `comparison.products[${index}].complexity must be low, medium, or high`)
    assert(typeof product.priceFromEur === 'number' && product.priceFromEur > 0, `comparison.products[${index}].priceFromEur must be a positive number`)
    assertNonEmptyString(product.privacyFocus, `comparison.products[${index}].privacyFocus`)
    assertNonEmptyString(product.integrationDepth, `comparison.products[${index}].integrationDepth`)
    assertNonEmptyString(product.bestFor, `comparison.products[${index}].bestFor`)
    ids.push(product.id)
  }

  assertUnique(ids, 'comparison product ids')
}

function validateIntegrations(integrationsPayload, allowedSourcePaths) {
  assertNonEmptyString(integrationsPayload.version, 'integrations.version')
  assertArray(integrationsPayload.integrations, 'integrations.integrations')

  const ids = []

  for (const [index, integration] of integrationsPayload.integrations.entries()) {
    assertNonEmptyString(integration.id, `integrations.integrations[${index}].id`)
    assertNonEmptyString(integration.name, `integrations.integrations[${index}].name`)
    assertNonEmptyString(integration.goal, `integrations.integrations[${index}].goal`)
    assertArray(integration.requiredSources, `integrations.integrations[${index}].requiredSources`)
    assertArray(integration.steps, `integrations.integrations[${index}].steps`)
    assertArray(integration.recommendedQueries, `integrations.integrations[${index}].recommendedQueries`)

    for (const requiredSource of integration.requiredSources) {
      assert(allowedSourcePaths.has(requiredSource), `integrations.integrations[${index}].requiredSources contains unknown path ${requiredSource}`)
    }

    ids.push(integration.id)
  }

  assertUnique(ids, 'integration preset ids')
}

async function validatePackInputs() {
  for (const inputPath of AGENT_PACK_INPUTS) {
    await ensureFileExists(inputPath, `Agent pack input ${inputPath}`)
  }
}

async function validatePackExport() {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'diggaihh-agent-pack-'))

  try {
    const exportedCount = await exportPack(tempDir)
    assert(exportedCount === AGENT_PACK_INPUTS.length, 'Agent pack export count must equal configured inputs')

    const manifestPath = path.join(tempDir, 'manifest.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    const expectedFiles = AGENT_PACK_INPUTS.map((inputPath) => inputPath.replace(/^public\//, ''))

    assert(manifest.name === 'diggaihh-agent-pack', 'Agent pack manifest name must be diggaihh-agent-pack')
    assertArray(manifest.files, 'agent pack manifest.files')
    assert(manifest.files.length === expectedFiles.length, 'Agent pack manifest must include every configured input file')

    const manifestFiles = manifest.files.map((entry) => entry.file)
    assertUnique(manifestFiles, 'agent pack manifest file entries')

    for (const expectedFile of expectedFiles) {
      assert(manifestFiles.includes(expectedFile), `Agent pack manifest missing ${expectedFile}`)
    }

    for (const [index, entry] of manifest.files.entries()) {
      assertNonEmptyString(entry.file, `agent pack manifest.files[${index}].file`)
      assert(entry.source === `/${entry.file}`, `agent pack manifest.files[${index}].source must match file path`)
      assert(typeof entry.bytes === 'number' && entry.bytes > 0, `agent pack manifest.files[${index}].bytes must be positive`)
      assert(typeof entry.sha256 === 'string' && /^[a-f0-9]{64}$/i.test(entry.sha256), `agent pack manifest.files[${index}].sha256 must be a SHA-256 hex digest`)
    }
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

async function main() {
  const aiManifest = await readJsonFile('public/.well-known/ai.json', 'public/.well-known/ai.json')
  const integrationManifest = await readJsonFile('public/.well-known/agent-integration.json', 'public/.well-known/agent-integration.json')
  const productsPayload = await readJsonFile('public/data/products.json', 'public/data/products.json')
  const faqPayload = await readJsonFile('public/data/faq.json', 'public/data/faq.json')
  const compliancePayload = await readJsonFile('public/data/compliance-summary.json', 'public/data/compliance-summary.json')
  const integrationsPayload = await readJsonFile('public/data/agent-integrations.json', 'public/data/agent-integrations.json')
  const entityMapPayload = await readJsonFile('public/data/product-entity-map.json', 'public/data/product-entity-map.json')
  const comparisonPayload = await readJsonFile('public/data/product-comparison.json', 'public/data/product-comparison.json')

  await validatePackInputs()
  await validateAiManifest(aiManifest)
  await validateAgentIntegrationManifest(aiManifest, integrationManifest)

  const productIds = validateProducts(productsPayload)
  validateFaq(faqPayload)
  validateCompliance(compliancePayload)
  validateEntityMap(entityMapPayload, productIds)
  validateComparison(comparisonPayload, productIds)
  validateIntegrations(integrationsPayload, new Set(Object.values(aiManifest.machineReadable)))

  await validatePackExport()

  console.log('[validate:aeo] manifests, machine-readable data, and agent-pack export are valid')
}

main().catch((error) => {
  console.error('[validate:aeo] failed:', error.message)
  process.exitCode = 1
})