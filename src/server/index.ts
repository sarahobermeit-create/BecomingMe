import { join } from "node:path";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { buildApp } from "#server/app.ts";
import { db } from "#server/db.ts";
import { env } from "#server/env.ts";

await migrate(db, { migrationsFolder: join(import.meta.dirname, "../../drizzle") });

const app = await buildApp();
await app.listen({ host: "0.0.0.0", port: env.port });

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, async () => {
    await app.close();
    await db.$client.end();
  });
}
