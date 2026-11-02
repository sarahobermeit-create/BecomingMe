# Code map

Where things live. Update this file in the same commit as any change that adds, moves, renames or deletes a file, route, endpoint or table.

## Pages

| URL | Page | File |
|---|---|---|
| `/` | Overview Dashboard | `src/client/features/overview/OverviewPage.tsx` |
| `/books` | Grand Library & Books | `src/client/features/books/BooksPage.tsx` |
| `/routines` | Routines & Habits | `src/client/features/routines/RoutinesPage.tsx` |
| `/water` | Water Tracker | `src/client/features/water/WaterPage.tsx` |
| `/meals` | Daily Meal Logs | `src/client/features/meals/MealsPage.tsx` |
| `/budget` | Budget & Spendings | `src/client/features/budget/BudgetPage.tsx` |
| `/mood` | Mood Tracker | `src/client/features/mood/MoodPage.tsx` |
| `/journal` | Junk Journal & Scrapbook | `src/client/features/journal/JournalPage.tsx` |
| `/hobbies` | Hobbies & Craft | `src/client/features/hobbies/HobbiesPage.tsx` |
| `/exercise` | Exercise & Workouts | `src/client/features/exercise/ExercisePage.tsx` |
| `/ideas` | Ideas & Aspirations | `src/client/features/ideas/IdeasPage.tsx` |
| `/calendar` | Personal Calendar | `src/client/features/calendar/CalendarPage.tsx` |
| anything else | Not found | `src/client/components/NotFound.tsx` |

Routes are declared in `src/client/App.tsx`.

## Shared components

| Component | Use | File |
|---|---|---|
| `Navbar` | Top navigation bar with branding, date, and live indicators | `src/client/components/Navbar.tsx` |
| `Sidebar` | Left navigation sidebar with module links | `src/client/components/Sidebar.tsx` |
| `VictorianAtmosphere` | Canvas particle animation of rain and fireplace embers | `src/client/components/VictorianAtmosphere.tsx` |
| `RealisticRavenBookend` | Raven on branch bookends for bookshelves | `src/client/components/RealisticRavenBookend.tsx` |
| `KindleScreen` | E-ink paperwhite device preview card | `src/client/components/KindleScreen.tsx` |
| `HeadphonesOverCorner` | Over-ear headphones corner visual | `src/client/components/HeadphonesOverCorner.tsx` |
| `QueryBoundary` | Renders query data, or loading, offline, not found and error states | `src/client/components/QueryBoundary.tsx` |
| `OfflineBanner` | Banner at the top of every page while offline | `src/client/components/OfflineBanner.tsx` |
| `OfflineNotice` | "Oops, you're offline" for a page whose data was never cached | `src/client/components/OfflineNotice.tsx` |
| `NotFound` | Page not found | `src/client/components/NotFound.tsx` |
| `Notice` | Centred full-page message with a title and actions | `src/client/components/Notice.tsx` |
| `Button`, `Input`, `Checkbox` | shadcn base components | `src/client/components/ui/` |

## Features

### Books
| What | File |
|---|---|
| Queries, writes, ISBN & online search | `src/client/features/books/books.api.ts` |
| Bookshelf CSV parser (Bookshelf app & Goodreads) | `src/client/features/books/bookCsvParser.ts` |
| CSV Importer modal | `src/client/features/books/BookCsvImporterModal.tsx` |
| Add & Edit book modal | `src/client/features/books/BookFormModal.tsx` |
| Book detail & progress modal | `src/client/features/books/BookDetailModal.tsx` |
| Victorian wood shelf | `src/client/features/books/VictorianBookshelf.tsx` |
| Bookshelf search, sort & pagination | `src/client/features/books/BookshelfControls.tsx` |
| Cover offline sync status & trigger | `src/client/features/books/CoverSyncStatus.tsx` |
| Cover offline sync modal & controls | `src/client/features/books/CoverSyncModal.tsx` |
| Victorian leather spine | `src/client/features/books/VictorianBookSpine.tsx` |
| Giant Kindle Oasis library view | `src/client/features/books/GiantKindleLibrary.tsx` |
| Phone Audiobook player & shelf | `src/client/features/books/PhoneAudiobookLibrary.tsx` |
| Table `books` | `src/server/features/books/books.table.ts` |
| Local cover image caching & storage in `/data/covers` | `src/server/features/books/bookCovers.ts` |
| Open Library proxy search & ISBN metadata | `src/server/features/books/openLibrary.ts` |
| API: `GET /api/books`, `PUT /api/books/:id`, `POST /api/books/batch`, `GET /api/books/covers/status`, `POST /api/books/cache-covers`, `POST /api/books/covers/cancel`, `GET /api/books/covers/:file`, `GET /api/books/search`, `GET /api/books/isbn` | `src/server/features/books/books.routes.ts` |
| Types shared by client and server | `src/shared/books.ts` |

### Routines
| What | File |
|---|---|
| Queries & writes | `src/client/features/routines/routines.api.ts` |
| Habit list row | `src/client/features/routines/RoutineItemRow.tsx` |
| Table `routines` | `src/server/features/routines/routines.table.ts` |
| API: `GET /api/routines`, `PUT /api/routines/:id` | `src/server/features/routines/routines.routes.ts` |
| Types shared by client and server | `src/shared/routines.ts` |

### Other Domains
- **Water**: `src/client/features/water/`, `src/server/features/water/`, `src/shared/water.ts`
- **Meals**: `src/client/features/meals/`, `src/server/features/meals/`, `src/shared/meals.ts`
- **Budget**: `src/client/features/budget/`, `src/server/features/budget/`, `src/shared/budget.ts`
- **Mood**: `src/client/features/mood/`, `src/server/features/mood/`, `src/shared/mood.ts`
- **Journal**: `src/client/features/journal/`, `src/server/features/journal/`, `src/shared/journal.ts`
- **Hobbies**: `src/client/features/hobbies/`, `src/server/features/hobbies/`, `src/shared/hobbies.ts`
- **Exercise**: `src/client/features/exercise/`, `src/server/features/exercise/`, `src/shared/exercise.ts`
- **Ideas**: `src/client/features/ideas/`, `src/server/features/ideas/`, `src/shared/ideas.ts`
- **Calendar**: `src/client/features/calendar/`, `src/server/features/calendar/`, `src/shared/calendar.ts`

## App-wide

| To change | Go to |
|---|---|
| Routes, providers, layout | `src/client/App.tsx` |
| Startup, registering offline writes | `src/client/main.tsx` |
| Theme colours, fonts, Victorian dark theme | `src/client/styles.css` |
| shadcn settings | `components.json` |
| How requests are sent | `src/client/api/http.ts` |
| Caching, retries, offline persistence | `src/client/api/queryClient.ts` |
| Online/offline detection | `src/client/api/connectivity.ts` |
| Offline page loading (service worker) | `src/client/sw.js` |
| Registering API routes, serving the client | `src/server/app.ts` |
| Server startup, migrations | `src/server/index.ts` |
| Safe date parsing & offline conflict timestamps | `src/server/dates.ts` |
| Database connection | `src/server/db.ts` |
| Application release version | `src/shared/version.ts` |
| Environment variables | `src/server/env.ts`, `.env.example` |
| Build, dev proxy | `vite.config.ts` |
| Local development runner (Postgres + Fastify + Vite) | `scripts/dev.js` |
| Production image | `Dockerfile` |
