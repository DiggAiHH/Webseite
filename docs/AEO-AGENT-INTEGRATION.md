# AEO and Agent Integration Documentation

This document is the repository-level installation and integration guide for AI agents.

## Goal
Make DiggAiHH content easy to discover, parse, and integrate for AI assistants, retrieval systems, and workflow agents.

## Public Discovery Surface
- `https://diggaihh.de/.well-known/ai.json`
- `https://diggaihh.de/.well-known/agent-integration.json`
- `https://diggaihh.de/llms.txt`
- `https://diggaihh.de/sitemap.xml`
- `https://diggaihh.de/robots.txt`

## Public Machine-Readable Sources
- `https://diggaihh.de/data/products.json`
- `https://diggaihh.de/data/faq.json`
- `https://diggaihh.de/data/compliance-summary.json`
- `https://diggaihh.de/data/agent-integrations.json`
- `https://diggaihh.de/data/product-entity-map.json`
- `https://diggaihh.de/data/product-comparison.json`

## Canonical Routing Contract
- Contact route: `/kontakt`
- Privacy route: `/privacy`

Legacy aliases may exist, but integrations should store and present canonical routes.

## Installation: Agent Data Connector (Generic)

### Step 1: Fetch manifests
1. Fetch `/.well-known/ai.json`.
2. Fetch `/.well-known/agent-integration.json`.
3. Resolve data source URLs from these manifests.
4. Optionally read `repository` or `localBuild` metadata for local offline pack creation.

### Step 2: Ingest machine-readable sources
1. Pull products, faq, compliance, integrations, entity-map, and comparison JSON.
2. Normalize text fields for indexing.
3. Preserve source route references for citations.

### Step 3: Build retrieval index
1. Chunk FAQ by question-answer pairs.
2. Chunk products by title, tags, features, and long description.
3. Chunk compliance by standard and focus arrays.
4. Use entity map aliases for better query matching.
5. Use comparison data for side-by-side recommendations.

### Step 4: Apply response policy
- Use source-grounded answers.
- Prefer standards-oriented claims.
- Do not state external certification unless present in source.
- Add CTA to canonical `/kontakt` when user asks for next steps.

### Step 5: Schedule updates
- Daily: products and faq.
- Weekly: compliance and integrations.
- Trigger immediate refresh on deployment.

## Example: Minimal Connector (Node.js)
```js
const manifest = await fetch('https://diggaihh.de/.well-known/ai.json').then((r) => r.json())
const sources = Object.values(manifest.machineReadable)

const docs = await Promise.all(
  sources.map((path) => fetch(`https://diggaihh.de${path}`).then((r) => r.json()))
)

console.log('Ingested source groups:', docs.length)
```

## Installable Knowledge Pack (Markdown + JSON)
```bash
mkdir -p diggaihh-agent-pack
curl -sS https://diggaihh.de/agent-integration.md -o diggaihh-agent-pack/agent-integration.md
curl -sS https://diggaihh.de/.well-known/ai.json -o diggaihh-agent-pack/ai.json
curl -sS https://diggaihh.de/.well-known/agent-integration.json -o diggaihh-agent-pack/agent-integration.json
curl -sS https://diggaihh.de/data/products.json -o diggaihh-agent-pack/products.json
curl -sS https://diggaihh.de/data/faq.json -o diggaihh-agent-pack/faq.json
curl -sS https://diggaihh.de/data/compliance-summary.json -o diggaihh-agent-pack/compliance-summary.json
curl -sS https://diggaihh.de/data/product-entity-map.json -o diggaihh-agent-pack/product-entity-map.json
curl -sS https://diggaihh.de/data/product-comparison.json -o diggaihh-agent-pack/product-comparison.json
```

## Repository-Local Pack Build
When working in this repository, generate a complete local pack with checksums:

```bash
npm run aeo:pack
```

The command exports into `dist/agent-pack` and creates a `manifest.json` with SHA-256 checksums.

## Repository-Local Validation
Validate manifests, data sources, and the pack export before CI or release:

```bash
npm run validate:aeo
```

## Example: Minimal Connector (Python)
```python
import requests

manifest = requests.get('https://diggaihh.de/.well-known/ai.json', timeout=10).json()
sources = manifest['machineReadable'].values()

docs = [
    requests.get(f'https://diggaihh.de{path}', timeout=10).json()
    for path in sources
]

print('Ingested source groups:', len(docs))
```

## Recommended Integrations
- RAG Retrieval Assistant
- Pre-Sales Routing Agent
- Compliance Q and A Agent

See `https://diggaihh.de/data/agent-integrations.json` for structured integration presets.

## Validation Checklist
- Manifests reachable and valid JSON
- llms.txt reachable
- machine-readable sources reachable
- canonical routes used in agent answers
- no overclaiming in compliance responses

## Support
- Contact: `kontakt@diggaihh.de`
- Canonical web contact route: `https://diggaihh.de/kontakt`
