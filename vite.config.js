import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk
    })

    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function resendDevProxy(env) {
  return {
    name: 'resend-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/resend/emails', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Method not allowed.' }))
          return
        }

        try {
          const body = await readJsonBody(req)
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.VITE_RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...body,
              from: body.from || env.VITE_RESEND_FROM_EMAIL,
            }),
          })

          const data = await response.text()

          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: error.message }))
        }
      })
    },
  }
}

function mailjetDevProxy(env) {
  return {
    name: 'mailjet-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/mailjet/send', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Method not allowed.' }))
          return
        }

        try {
          const body = await readJsonBody(req)
          const auth = Buffer.from(
            `${env.MAILJET_API_KEY}:${env.MAILJET_SECRET_KEY}`,
          ).toString('base64')

          const response = await fetch('https://api.mailjet.com/v3.1/send', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Messages: [
                {
                  From: {
                    Email: env.MAILJET_FROM_EMAIL,
                  },
                  To: [
                    {
                      Email: body.to,
                    },
                  ],
                  Subject: body.subject,
                  HTMLPart: body.html,
                },
              ],
            }),
          })

          const data = await response.text()

          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(data)
        } catch (error) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: error.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), resendDevProxy(env), mailjetDevProxy(env)],
  }
})
