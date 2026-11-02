import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "#client/App.tsx";
import { registerBookWrites } from "#client/features/books/books.api.ts";
import { registerBudgetWrites } from "#client/features/budget/budget.api.ts";
import { registerCalendarWrites } from "#client/features/calendar/calendar.api.ts";
import { registerExerciseWrites } from "#client/features/exercise/exercise.api.ts";
import { registerHobbyWrites } from "#client/features/hobbies/hobbies.api.ts";
import { registerIdeaWrites } from "#client/features/ideas/ideas.api.ts";
import { registerJournalWrites } from "#client/features/journal/journal.api.ts";
import { registerMealWrites } from "#client/features/meals/meals.api.ts";
import { registerMoodWrites } from "#client/features/mood/mood.api.ts";
import { registerRoutineWrites } from "#client/features/routines/routines.api.ts";
import { registerWaterWrites } from "#client/features/water/water.api.ts";
import "#client/styles.css";

registerBookWrites();
registerRoutineWrites();
registerWaterWrites();
registerMealWrites();
registerBudgetWrites();
registerMoodWrites();
registerJournalWrites();
registerHobbyWrites();
registerExerciseWrites();
registerIdeaWrites();
registerCalendarWrites();

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  void navigator.serviceWorker.register("/sw.js");
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
