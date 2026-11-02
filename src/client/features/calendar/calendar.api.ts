import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { request } from "#client/api/http.ts";
import { queryClient } from "#client/api/queryClient.ts";
import type { CalendarEvent, CalendarWrite } from "#shared/calendar.ts";

export const calendarQueryOptions = queryOptions({
  queryKey: ["calendar"],
  queryFn: ({ signal }) => request<CalendarEvent[]>("/calendar", { signal }),
});

export function useCalendar() {
  return useQuery(calendarQueryOptions);
}

export function registerCalendarWrites() {
  queryClient.setMutationDefaults(["calendar", "write"], {
    mutationFn: async (variables: unknown) => {
      const write = variables as CalendarWrite;
      return request<CalendarEvent>(`/calendar/${write.id}`, {
        method: "PUT",
        body: JSON.stringify(write),
      });
    },
  });
}

export function useSaveCalendarEvent() {
  return useMutation({
    mutationKey: ["calendar", "write"],
    onMutate: async (write: CalendarWrite) => {
      await queryClient.cancelQueries({ queryKey: ["calendar"] });
      const previous = queryClient.getQueryData<CalendarEvent[]>(["calendar"]) ?? [];
      const now = new Date(write.changedAt).toISOString();
      const next: CalendarEvent = {
        id: write.id,
        title: write.title,
        date: write.date,
        time: write.time,
        endTime: write.endTime,
        category: write.category,
        color: write.color,
        notes: write.notes,
        reminder: write.reminder,
        updatedAt: now,
      };

      if (write.deleted) {
        queryClient.setQueryData<CalendarEvent[]>(["calendar"], previous.filter((c) => c.id !== write.id));
      } else {
        const index = previous.findIndex((c) => c.id === write.id);
        if (index === -1) {
          queryClient.setQueryData<CalendarEvent[]>(["calendar"], [next, ...previous]);
        } else {
          queryClient.setQueryData<CalendarEvent[]>(
            ["calendar"],
            previous.map((c) => (c.id === write.id ? next : c)),
          );
        }
      }

      return { previous };
    },
    onError: (_err, _write, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["calendar"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}
