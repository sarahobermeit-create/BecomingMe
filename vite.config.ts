import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function localSyncPlugin(): Plugin {
  const dataFilePath = path.resolve(__dirname, 'data', 'life_state.json')
  const sseClients = new Set<any>()

  return {
    name: 'local-sync-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // SSE Real-time stream
        if (req.url === '/api/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          })
          res.write('\n')
          sseClients.add(res)

          req.on('close', () => {
            sseClients.delete(res)
          })
          return
        }

        // GET /api/state
        if (req.url === '/api/state' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          if (fs.existsSync(dataFilePath)) {
            const content = fs.readFileSync(dataFilePath, 'utf-8')
            res.end(content)
          } else {
            res.end(JSON.stringify({ notFound: true }))
          }
          return
        }

        // POST /api/state
        if (req.url === '/api/state' && req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              if (body) {
                fs.writeFileSync(dataFilePath, body, 'utf-8')
                // Broadcast to all connected clients (PC & Phone)
                const sseMessage = `data: ${body}\n\n`
                for (const client of sseClients) {
                  try {
                    client.write(sseMessage)
                  } catch (e) {
                    sseClients.delete(client)
                  }
                }
              }
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify({ ok: true }))
            } catch (err: any) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        if (req.url?.startsWith('/api/') && req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.statusCode = 204
          res.end()
          return
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localSyncPlugin()],
  base: './',
  server: {
    host: true, // Listen on all network addresses (accessible via Wi-Fi)
    port: 5173,
  },
})
