function createHeaders() {
  return {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
}

function createBody() {
  return {
    ok: true,
    status: 'healthy',
    service: 'diggaihh-lead-api',
    runtime: 'netlify-functions',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString()
  }
}

export const handler = async (event) => {
  const method = event?.httpMethod || 'GET'
  const headers = createHeaders()

  if (method !== 'GET' && method !== 'HEAD') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'METHOD_NOT_ALLOWED' })
    }
  }

  if (method === 'HEAD') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(createBody())
  }
}
