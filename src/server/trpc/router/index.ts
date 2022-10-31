// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { channelReminderRouter } from "./channelReminder"
import { followUpRouter } from "./followUp";
import { scheduleRouter } from "./schedule";

export const appRouter = router({
  auth: authRouter,
  channelReminder: channelReminderRouter,
  followUp: followUpRouter,
  schedule: scheduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
