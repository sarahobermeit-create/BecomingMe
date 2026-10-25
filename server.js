import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDatabase, getState, saveState, migrateFromJsonIfNeeded } from './server/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5173;
const DIST_DIR = path.resolve(__dirname, 'dist');
const DATA_FILE = path.resolve(__dirname, 'data', 'life_state.json');
const DB_FILE = path.resolve(__dirname, 'data', 'life.db');

// Ensure data directory exists
if (!fs.existsSync(path.resolve(__dirname, 'data'))) {
  fs.mkdirSync(path.resolve(__dirname, 'data'), { recursive: true });
}

// Initialize SQLite backend database
const db = initDatabase(DB_FILE);
migrateFromJsonIfNeeded(db, DATA_FILE);

const sseClients = new Set();

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];

  // 1. SSE Events endpoint
  if (url === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write('\n');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 2. GET /api/state
  if (url === '/api/state' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Storage-Engine', 'SQLite');
    const state = getState(db);
    if (state) {
      res.end(JSON.stringify(state));
    } else if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      res.end(data);
    } else {
      res.end(JSON.stringify({ notFound: true }));
    }
    return;
  }

  // 3. POST /api/state
  if (url === '/api/state' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        if (body) {
          const parsed = JSON.parse(body);
          saveState(db, parsed);
          // Sync backup JSON file
          fs.writeFileSync(DATA_FILE, body, 'utf-8');

          // Broadcast to all connected devices in real time
          const sseMsg = `data: ${body}\n\n`;
          for (const client of sseClients) {
            try {
              client.write(sseMsg);
            } catch (e) {
              sseClients.delete(client);
            }
          }
        }
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-Storage-Engine', 'SQLite');
        res.end(JSON.stringify({ ok: true, storage: 'sqlite' }));
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. Serve static files from dist
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.statusCode = 500;
      res.end('Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BecomingMe server running at http://0.0.0.0:${PORT}`);
});
