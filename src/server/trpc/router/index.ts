// src/server/trpc/router/index.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { channelReminderRouter } from "./channelReminder";
import { discordRoleRouter } from "./discordRole";
import { followupRouter } from "./followupMessage";
import { reminderEmbedRouter } from "./reminderEmbed";
import { scheduleRouter } from "./schedule";

export const appRouter = router({
  auth: authRouter,
  channelReminder: channelReminderRouter,
  discordRole: discordRoleRouter,
  followup: followupRouter,
  reminderEmbed: reminderEmbedRouter,
  schedule: scheduleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
