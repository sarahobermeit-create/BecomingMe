import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createConnection } from "node:net";
import EmbeddedPostgres from "embedded-postgres";

function isPortOpen(port, host = "localhost") {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => {
      resolve(false);
    });
  });
}

async function ensureDatabase() {
  const alreadyRunning = await isPortOpen(5432);
  if (alreadyRunning) {
    console.log("[db] PostgreSQL is already running on port 5432.");
    return null;
  }

  const dbDir = "./.postgres-data";
  console.log("[db] Starting embedded PostgreSQL on port 5432...");
  const pg = new EmbeddedPostgres({
    databaseDir: dbDir,
    user: "app",
    password: "app",
    port: 5432,
    persistent: true,
    initdbFlags: ["-E", "UTF8", "--no-locale"],
  });

  const isInitialized = existsSync(join(dbDir, "PG_VERSION"));
  if (!isInitialized) {
    console.log("[db] Initializing new database cluster...");
    await pg.initialise();
  }
  await pg.start();
  try {
    await pg.createDatabase("app");
  } catch {
    // Database 'app' may already exist from previous run
  }
  console.log("[db] PostgreSQL is ready on port 5432.");
  return pg;
}

const pg = await ensureDatabase();

const serverProcess = spawn(
  process.execPath,
  ["--env-file-if-exists=.env", "--watch", "src/server/index.ts"],
  { stdio: "inherit", shell: false }
);

const clientProcess = spawn(
  process.execPath,
  ["./node_modules/vite/bin/vite.js"],
  { stdio: "inherit", shell: false }
);

async function cleanup() {
  console.log("\n[life] Shutting down services...");
  try {
    serverProcess.kill();
  } catch {}
  try {
    clientProcess.kill();
  } catch {}
  if (pg) {
    console.log("[db] Stopping PostgreSQL...");
    try {
      await pg.stop();
    } catch {}
  }
  process.exit(0);
}

process.once("SIGINT", cleanup);
process.once("SIGTERM", cleanup);
