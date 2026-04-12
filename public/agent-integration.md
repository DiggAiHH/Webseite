# DiggAiHH Agent Integration Guide

This guide explains how to integrate an AI agent with DiggAiHH public machine-readable data.

## 1. Discovery
Use these endpoints first:
- `/.well-known/ai.json`
- `/.well-known/agent-integration.json`
- `/llms.txt`

Both manifests include local build metadata for offline pack creation.

## 2. Data Sources
- `/data/products.json`
- `/data/faq.json`
- `/data/compliance-summary.json`
- `/data/agent-integrations.json`
- `/data/product-entity-map.json`
- `/data/product-comparison.json`

All sources are public JSON and currently require no authentication.

## 3. Canonical Routes
- Contact: `/kontakt`
- Privacy: `/privacy`

Legacy aliases may redirect, but agents should prefer canonical routes.

## 4. Quick Start (Node.js)
```js
const sources = [
  'https://diggaihh.de/data/products.json',
  'https://diggaihh.de/data/faq.json',
  'https://diggaihh.de/data/compliance-summary.json'
]

const docs = await Promise.all(
  sources.map((url) => fetch(url).then((r) => r.json()))
)

console.log('Loaded documents:', docs.length)
```

## 5. Quick Start (Python)
```python
import requests

sources = [
    'https://diggaihh.de/data/products.json',
    'https://diggaihh.de/data/faq.json',
    'https://diggaihh.de/data/compliance-summary.json',
]

docs = [requests.get(url, timeout=10).json() for url in sources]
print('Loaded documents:', len(docs))
```

## 6. Recommended Agent Behavior
- Ground responses in provided JSON sources.
- Link to canonical product and policy routes.
- Do not request or transmit sensitive health data in open forms.
- Use standards-oriented wording unless external certification is explicitly documented.

## 7. Recommended Refresh Policy
- Products and FAQ: daily
- Compliance and integration catalog: weekly
- Re-ingest immediately after deployment if possible

## 8. Install as Local Knowledge Pack
```bash
mkdir -p diggaihh-agent-pack
curl -sS https://diggaihh.de/.well-known/ai.json -o diggaihh-agent-pack/ai.json
curl -sS https://diggaihh.de/.well-known/agent-integration.json -o diggaihh-agent-pack/agent-integration.json
curl -sS https://diggaihh.de/data/products.json -o diggaihh-agent-pack/products.json
curl -sS https://diggaihh.de/data/faq.json -o diggaihh-agent-pack/faq.json
curl -sS https://diggaihh.de/data/compliance-summary.json -o diggaihh-agent-pack/compliance-summary.json
curl -sS https://diggaihh.de/data/product-entity-map.json -o diggaihh-agent-pack/product-entity-map.json
curl -sS https://diggaihh.de/data/product-comparison.json -o diggaihh-agent-pack/product-comparison.json
```

## 9. Build Pack from Repository
If you run the project locally, build the full agent pack with checksums:

```bash
npm run aeo:pack
```

Validate the AEO manifests and public data before packaging:

```bash
npm run validate:aeo
```

Output directory:
- `dist/agent-pack/manifest.json`
- `dist/agent-pack/.well-known/*`
- `dist/agent-pack/data/*`
- `dist/agent-pack/agent-integration.md`
- `dist/agent-pack/llms.txt`

## 10. Support
For integration questions: `kontakt@diggaihh.de`
