# Agent guide

Read `PROBLEM.md` for what this app is for. Read `CODEMAP.md` to find where things live. This file says how the app is built.

## Deployment

You are building a full-stack web application.

Do not write any CI/CD pipelines or GitHub Actions. Deployment is handled automatically by a host server (Coolify) listening to the `main` branch.

The root `Dockerfile` is production-ready and must stay that way. It exposes the app on a single port (3000) and includes every build step. It runs `npm run verify` during the build, so a change that doesn't typecheck or build never deploys.

To deploy updates, bump the version in `package.json` and `src/shared/version.ts`, then commit and push directly to `main`.

## Stack

One container serves the API under `/api` and the built React app for every other path.

- Node 24, running the server's TypeScript directly (no server build step)
- Fastify for the API, Postgres through Drizzle
- React, Vite, React Router and TanStack Query for the client
- Tailwind CSS for styling, shadcn/ui for base components

## Commands

```bash
cp .env.example .env       # first time only
npm install
npm run dev                # Postgres in Docker, API on :3000, client on :5173 (open this one)
npm run verify             # typecheck + build. Run before every commit.
npm run db:generate        # after changing a table, creates the SQL migration
npx shadcn@latest add <x>  # adds a shadcn component to src/client/components/ui
```

## Finding your way: CODEMAP.md

`CODEMAP.md` lists every page, component, endpoint and table, and where each kind of change goes. Use it to go straight to the right file instead of searching the repo.

Keep it current. Any change that adds, moves, renames or deletes a file, route, endpoint or table updates `CODEMAP.md` in the same commit. A wrong code map is worse than none.

## Structure

```
src/
  client/
    api/                 # request(), query client, online/offline state
    components/          # shared components used by more than one feature
      ui/                # shadcn components (button, input, ...)
    features/<name>/     # one feature: pages, its own components, <name>.api.ts
  server/
    features/<name>/     # <name>.routes.ts and <name>.table.ts
  shared/                # types used by both client and server
drizzle/                 # generated SQL migrations, applied on server start
```

`todos` is the reference feature. Copy its shape for new features, and delete it once the app has a real one.

## How to write code here

Small files with one job each. A new screen is a page that puts together small components, not one big file.

- **One component per file**, named after the component (`TodoItem.tsx` exports `TodoItem`). Never define a second component inside a file, not even a small one.
- **Size limits.** A component over 150 lines, or any file over 200 lines, gets split before you add to it. Pull out child components, hooks, or helpers.
- **Reuse before you write.** Check `CODEMAP.md`, `src/client/components` and `src/client/components/ui` first. If something close exists, extend it with a prop rather than copying it.
- **Where a component lives.** Used by one feature: that feature's folder. Used by a second feature: move it to `src/client/components` and update `CODEMAP.md`.
- **Base UI comes from shadcn.** Buttons, inputs, checkboxes, dialogs, menus and similar come from `components/ui`. Add a missing one with `npx shadcn@latest add <name>`, never build your own. You may edit files in `components/ui`; they're our code now.
- **Pages stay thin.** A page reads its route params, calls its queries, and lays out components. Data fetching and writes live in the feature's `<name>.api.ts`. Logic that isn't UI goes in a hook or helper file, not inside a component.
- **Styling.** Tailwind classes only, using the theme colours in `src/client/styles.css` (`bg-background`, `text-muted-foreground`, ...). Add a new colour there as a variable rather than using a raw colour in a class. No new CSS files and no inline `style` objects. When a pattern of classes repeats, make it a component. `src/client/shadcn.css` is copied from shadcn; don't edit it.
- **Server.** One `<name>.routes.ts` per feature, registered in `src/server/app.ts`. Route handlers validate input with a JSON schema and keep logic short. Move anything longer into a helper in the same feature folder.
- **Imports.** Across folders use `#client/*`, `#server/*` or `#shared/*` and always include the file extension (`.ts`, `.tsx`).
- **TypeScript.** Node runs server files as they are, so only use TypeScript that can be erased: no `enum`, `namespace` or constructor parameter properties. `tsc` enforces this. No `any`.
- **Comments.** None unless the reason for the code isn't obvious.

## Data and offline

The app keeps working through short outages (weak signal, a deploy restarting the server). Reads come from the cached data, writes queue and sync when the server is reachable again, and the user only sees a banner.

- All server data goes through TanStack Query. Components never call `fetch`. A feature's `<name>.api.ts` calls `request()` from `#client/api/http.ts`.
- Pages render query data through `QueryBoundary`. It handles loading, the "you're offline" notice for data that was never cached, not found, and errors.
- Every write follows the `todos` pattern:
  1. The client creates ids with `crypto.randomUUID()`, so items can be created offline.
  2. The write sends the item's full state plus `changedAt` (when the user made the change) to `PUT /api/<feature>/:id`. Never send a toggle or an increment: a write can be replayed, and it must give the same result each time.
  3. The server upserts only when `changedAt` is not older than the row's `updatedAt`, and returns 409 otherwise. Deletes set `deletedAt` and are never undone by a later write.
  4. The client registers the write with `queryClient.setMutationDefaults` in the feature's `<name>.api.ts`, and the register function is called in `main.tsx`. Callbacks passed to `useMutation` are lost on reload, so queued writes would not replay.
  5. `onMutate` updates the cache straight away. `onSettled` refetches once the last queued write has finished. A rejected write is dropped silently and the refetch shows the server's state.
- Failed requests, timeouts and 502/503/504 responses mark the app offline. It then checks `/api/health` until the server answers and resumes queued writes automatically. Don't add retry logic of your own.
- Auth isn't built yet. When it is: tokens are long-lived (30 days). On a 401, keep queued writes, send the user to log in, and resume the writes afterwards.

## Packages

- Prefer what the browser or Node already provide. Ask before adding a package.
- Versions are pinned exactly (`.npmrc` sets `save-exact`). Commit `package-lock.json`.
- Packages the server needs at runtime go in `dependencies`. Client-only packages go in `devDependencies`, because Vite bundles them and the production image installs `dependencies` only. `npx shadcn add` may put its packages in `dependencies`; move them.

## Database

- Tables live in `src/server/features/<name>/<name>.table.ts` and import nothing but `drizzle-orm`.
- After changing a table, run `npm run db:generate` and commit the new SQL in `drizzle/`. Never edit a migration that has already been deployed.
