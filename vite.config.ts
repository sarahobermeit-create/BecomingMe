import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// @ts-ignore
import { initDatabase, getState, saveState, migrateFromJsonIfNeeded } from './server/db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function localSyncPlugin(): Plugin {
  const dataFilePath = path.resolve(__dirname, 'data', 'life_state.json')
  const dbFilePath = path.resolve(__dirname, 'data', 'life.db')

  // Initialize SQLite database and perform automatic initial migration if needed
  const db = initDatabase(dbFilePath)
  migrateFromJsonIfNeeded(db, dataFilePath)

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

        // Database status endpoint
        if (req.url === '/api/database-status' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(
            JSON.stringify({
              status: 'connected',
              engine: 'SQLite (node:sqlite)',
              database: 'data/life.db',
              tables: [
                'settings',
                'books',
                'routines',
                'meals',
                'transactions',
                'water_logs',
                'moods',
                'journal_cards',
                'hobbies',
                'workouts',
                'ideas',
                'events',
              ],
            })
          )
          return
        }

        // GET /api/state
        if (req.url === '/api/state' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('X-Storage-Engine', 'SQLite')
          const state = getState(db)
          if (state) {
            res.end(JSON.stringify(state))
          } else if (fs.existsSync(dataFilePath)) {
            const content = fs.readFileSync(dataFilePath, 'utf-8')
            res.end(content)
          } else {
            res.end(JSON.stringify({ notFound: true }))
          }
          return
        }

        // GET /api/book-search?q=... (Search online books by Title, Author, or keywords)
        if (req.url?.startsWith('/api/book-search') && req.method === 'GET') {
          const urlObj = new URL(req.url, 'http://localhost')
          const q = urlObj.searchParams.get('q')?.trim() || ''
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')

          if (!q) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Missing query parameter', results: [] }))
            return
          }

          ;(async () => {
            try {
              const searchRes = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8&fields=title,author_name,cover_i,number_of_pages_median,first_publish_year,isbn`
              )
              if (searchRes.ok) {
                const searchData = (await searchRes.json()) as any
                const results = (searchData?.docs || []).map((d: any) => ({
                  title: d.title || '',
                  author: (d.author_name || []).join(', ') || '',
                  totalPages: Number(d.number_of_pages_median) || 300,
                  coverUrl: d.cover_i
                    ? `https://covers.openlibrary.org/b/id/${d.cover_i}-L.jpg`
                    : (d.isbn && d.isbn[0]
                    ? `https://covers.openlibrary.org/b/isbn/${d.isbn[0]}-L.jpg`
                    : ''),
                  publishYear: d.first_publish_year ? String(d.first_publish_year) : '',
                  isbn: (d.isbn || [])[0] || '',
                }))

                res.end(JSON.stringify({ results }))
                return
              }

              res.end(JSON.stringify({ results: [] }))
            } catch (err: any) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message || 'Search failed', results: [] }))
            }
          })()
          return
        }

        // GET /api/isbn?isbn=...
        if (req.url?.startsWith('/api/isbn') && req.method === 'GET') {
          const urlObj = new URL(req.url, 'http://localhost')
          const isbn = urlObj.searchParams.get('isbn')?.trim() || ''
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')

          if (!isbn) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: 'Missing isbn parameter' }))
            return
          }

          ;(async () => {
            try {
              // 1. Try Open Library jscmd=data (rich metadata & cover)
              const olRes = await fetch(
                `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
              )
              if (olRes.ok) {
                const olData = (await olRes.json()) as any
                const b = olData?.[`ISBN:${isbn}`]
                if (b && b.title) {
                  const author = b.authors?.map((a: any) => a.name).join(', ') || ''
                  const coverUrl =
                    b.cover?.large ||
                    b.cover?.medium ||
                    `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`
                  const quote = b.excerpts?.[0]?.text || ''
                  const description =
                    typeof b.description === 'string'
                      ? b.description
                      : b.description?.value || ''

                  res.end(
                    JSON.stringify({
                      title: b.title,
                      author,
                      totalPages: Number(b.number_of_pages) || 300,
                      coverUrl,
                      quote,
                      description,
                      publishYear: b.publish_date || '',
                    })
                  )
                  return
                }
              }

              // 2. Try Open Library search.json
              const searchRes = await fetch(`https://openlibrary.org/search.json?isbn=${isbn}`)
              if (searchRes.ok) {
                const searchData = (await searchRes.json()) as any
                if (searchData?.docs && searchData.docs.length > 0) {
                  const doc = searchData.docs[0]
                  const author = doc.author_name?.join(', ') || ''
                  const coverUrl = doc.cover_i
                    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
                    : `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`

                  res.end(
                    JSON.stringify({
                      title: doc.title,
                      author,
                      totalPages: Number(doc.number_of_pages_median) || 300,
                      coverUrl,
                      publishYear: doc.first_publish_year?.toString() || '',
                    })
                  )
                  return
                }
              }

              // 3. Try direct ISBN endpoint
              const directRes = await fetch(`https://openlibrary.org/isbn/${isbn}.json`)
              if (directRes.ok) {
                const directData = (await directRes.json()) as any
                if (directData && directData.title) {
                  let author = ''
                  if (directData.authors?.[0]?.key) {
                    try {
                      const aRes = await fetch(`https://openlibrary.org${directData.authors[0].key}.json`)
                      if (aRes.ok) {
                        const aData = (await aRes.json()) as any
                        author = aData?.name || ''
                      }
                    } catch {}
                  }
                  res.end(
                    JSON.stringify({
                      title: directData.title,
                      author,
                      totalPages: Number(directData.number_of_pages) || 300,
                      coverUrl: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
                    })
                  )
                  return
                }
              }

              // 4. Try Penguin Books Australia (handles Australian releases like 9781761624803)
              try {
                const prhRes = await fetch(`https://www.penguin.com.au/books/${isbn}`, {
                  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                  redirect: 'follow',
                })
                if (prhRes.ok) {
                  const html = await prhRes.text()
                  const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
                  const rawTitle = titleMatch ? titleMatch[1] : ''
                  if (
                    rawTitle &&
                    !rawTitle.toLowerCase().includes('page not found') &&
                    !rawTitle.toLowerCase().includes('404')
                  ) {
                    let title = rawTitle
                    let author = ''
                    if (rawTitle.includes(' by ')) {
                      const parts = rawTitle.split(' by ')
                      title = parts[0].trim()
                      const afterBy = parts[1].split(' - ')[0].trim()
                      author = afterBy
                    }

                    const ogImageMatch = html.match(
                      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
                    )
                    const ogDescMatch = html.match(
                      /<meta[^>]+(?:name|property)=["'](?:og:description|description)["'][^>]+content=["']([^"']+)["']/i
                    )
                    const pagesMatch = html.match(/(\d+)\s*pages/i)

                    const coverUrl = ogImageMatch
                      ? ogImageMatch[1]
                      : `https://cdn2.penguin.com.au/covers/original/${isbn}.jpg`

                    res.end(
                      JSON.stringify({
                        title,
                        author,
                        totalPages: pagesMatch ? Number(pagesMatch[1]) : 352,
                        coverUrl,
                        description: ogDescMatch ? ogDescMatch[1] : '',
                        publishYear: '2026',
                      })
                    )
                    return
                  }
                }
              } catch (e) {}

              // 5. Try Penguin Random House Global
              try {
                const prhGlobalRes = await fetch(
                  `https://www.penguinrandomhouse.com/books/${isbn}`,
                  {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
                    redirect: 'follow',
                  }
                )
                if (prhGlobalRes.ok) {
                  const html = await prhGlobalRes.text()
                  const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
                  const rawTitle = titleMatch ? titleMatch[1] : ''
                  if (
                    rawTitle &&
                    !rawTitle.toLowerCase().includes('page not found') &&
                    !rawTitle.toLowerCase().includes('404')
                  ) {
                    let title = rawTitle
                    let author = ''
                    if (rawTitle.includes(' by ')) {
                      const parts = rawTitle.split(' by ')
                      title = parts[0].trim()
                      const afterBy = parts[1].split(' | ')[0].split(' - ')[0].trim()
                      author = afterBy
                    }

                    const ogImageMatch = html.match(
                      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
                    )
                    const ogDescMatch = html.match(
                      /<meta[^>]+(?:name|property)=["'](?:og:description|description)["'][^>]+content=["']([^"']+)["']/i
                    )
                    const pagesMatch = html.match(/(\d+)\s*pages/i)

                    res.end(
                      JSON.stringify({
                        title,
                        author,
                        totalPages: pagesMatch ? Number(pagesMatch[1]) : 300,
                        coverUrl: ogImageMatch ? ogImageMatch[1] : '',
                        description: ogDescMatch ? ogDescMatch[1] : '',
                      })
                    )
                    return
                  }
                }
              } catch (e) {}

              res.statusCode = 404
              res.end(JSON.stringify({ error: `No book found for ISBN ${isbn}` }))
            } catch (err: any) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: err.message || 'Lookup failed' }))
            }
          })()
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
                const parsed = JSON.parse(body)
                saveState(db, parsed)
                // Sync backup JSON file
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
              res.setHeader('X-Storage-Engine', 'SQLite')
              res.end(JSON.stringify({ ok: true, storage: 'sqlite' }))
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
