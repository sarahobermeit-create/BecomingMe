import { accessSync, constants, existsSync } from "node:fs";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function isDirWritable(dir: string): boolean {
  try {
    if (!existsSync(dir)) return false;
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveDataDir(): string {
  if (process.env.DATA_DIR && isDirWritable(process.env.DATA_DIR)) {
    return process.env.DATA_DIR;
  }
  if (process.env.NODE_ENV === "production") {
    if (isDirWritable("/data")) {
      return "/data";
    }
    if (isDirWritable("/app/data")) {
      console.warn("[env] /data is not writable by current user; falling back to /app/data");
      return "/app/data";
    }
  }
  return "./data";
}

export const env = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: required("DATABASE_URL"),
  dataDir: resolveDataDir(),
};
