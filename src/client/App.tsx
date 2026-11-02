import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { persistOptions, queryClient } from "#client/api/queryClient.ts";
import { Navbar } from "#client/components/Navbar.tsx";
import { NotFound } from "#client/components/NotFound.tsx";
import { OfflineBanner } from "#client/components/OfflineBanner.tsx";
import { Sidebar } from "#client/components/Sidebar.tsx";
import { VictorianAtmosphere } from "#client/components/VictorianAtmosphere.tsx";
import { BooksPage } from "#client/features/books/BooksPage.tsx";
import { BudgetPage } from "#client/features/budget/BudgetPage.tsx";
import { CalendarPage } from "#client/features/calendar/CalendarPage.tsx";
import { ExercisePage } from "#client/features/exercise/ExercisePage.tsx";
import { HobbiesPage } from "#client/features/hobbies/HobbiesPage.tsx";
import { IdeasPage } from "#client/features/ideas/IdeasPage.tsx";
import { JournalPage } from "#client/features/journal/JournalPage.tsx";
import { MealsPage } from "#client/features/meals/MealsPage.tsx";
import { MoodPage } from "#client/features/mood/MoodPage.tsx";
import { OverviewPage } from "#client/features/overview/OverviewPage.tsx";
import { RoutinesPage } from "#client/features/routines/RoutinesPage.tsx";
import { WaterPage } from "#client/features/water/WaterPage.tsx";

function AppLayout() {
  const location = useLocation();
  const isBooksTab = location.pathname.startsWith("/books");

  return (
    <div className="min-h-screen bg-[#070e0a] text-slate-100 flex flex-col font-sans selection:bg-emerald-700/30 selection:text-emerald-200 relative">
      {/* Full-screen Victorian Library Wallpaper & Atmosphere when on Books tab */}
      {isBooksTab && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('/victorian-library.jpg')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070e0a]/40 via-[#070e0a]/50 to-[#070e0a]/65" />
          <VictorianAtmosphere />
        </div>
      )}

      <OfflineBanner />
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/water" element={<WaterPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/mood" element={<MoodPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/hobbies" element={<HobbiesPage />} />
            <Route path="/exercise" element={<ExercisePage />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export function App() {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
      onSuccess={() => void queryClient.resumePausedMutations()}
    >
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </PersistQueryClientProvider>
  );
}
