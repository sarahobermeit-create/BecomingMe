import { existsSync } from "node:fs";
import { join } from "node:path";
import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import { booksRoutes } from "#server/features/books/books.routes.ts";
import { budgetRoutes } from "#server/features/budget/budget.routes.ts";
import { calendarRoutes } from "#server/features/calendar/calendar.routes.ts";
import { exerciseRoutes } from "#server/features/exercise/exercise.routes.ts";
import { hobbiesRoutes } from "#server/features/hobbies/hobbies.routes.ts";
import { ideasRoutes } from "#server/features/ideas/ideas.routes.ts";
import { journalRoutes } from "#server/features/journal/journal.routes.ts";
import { mealsRoutes } from "#server/features/meals/meals.routes.ts";
import { moodRoutes } from "#server/features/mood/mood.routes.ts";
import { routinesRoutes } from "#server/features/routines/routines.routes.ts";
import { waterRoutes } from "#server/features/water/water.routes.ts";

const clientDir = join(import.meta.dirname, "../../dist/client");

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.get("/api/health", async () => ({ ok: true }));

  await app.register(booksRoutes, { prefix: "/api/books" });
  await app.register(routinesRoutes, { prefix: "/api/routines" });
  await app.register(waterRoutes, { prefix: "/api/water" });
  await app.register(mealsRoutes, { prefix: "/api/meals" });
  await app.register(budgetRoutes, { prefix: "/api/budget" });
  await app.register(moodRoutes, { prefix: "/api/mood" });
  await app.register(journalRoutes, { prefix: "/api/journal" });
  await app.register(hobbiesRoutes, { prefix: "/api/hobbies" });
  await app.register(exerciseRoutes, { prefix: "/api/exercise" });
  await app.register(ideasRoutes, { prefix: "/api/ideas" });
  await app.register(calendarRoutes, { prefix: "/api/calendar" });

  // The built client only exists after `npm run build`. In dev, Vite serves it.
  if (existsSync(clientDir)) {
    await app.register(fastifyStatic, {
      root: clientDir,
      cacheControl: false,
      setHeaders: (reply, path) =>
        reply.header("cache-control", path.includes("/assets/") ? "public, max-age=31536000, immutable" : "no-cache"),
    });

    // Client-side routes all serve the app shell, so a deep link or refresh never 404s.
    app.setNotFoundHandler((request, reply) => {
      if (request.method === "GET" && !request.url.startsWith("/api/")) {
        return reply.header("cache-control", "no-cache").sendFile("index.html");
      }
      return reply.code(404).send({ error: "Not found" });
    });
  }

  return app;
}
