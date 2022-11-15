import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { BOT_API_URL, jsonFetch } from "@/utils/trpc";

export const channelReminderRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/reminders/`, "GET");
  }),
  createOne: protectedProcedure
    .input(
      z.object({
        channel: z.number(),
        message_interval: z.number(),
        embed: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/reminders/`, "POST", input);
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        channel: z.number(),
        message_interval: z.number(),
        embed: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, "PUT", rest);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, "GET");
    }),
});
