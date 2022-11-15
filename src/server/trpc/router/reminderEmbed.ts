import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { BOT_API_URL, jsonFetch } from "@/utils/trpc";

export const reminderEmbedRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/reminderEmbeds/`, "GET");
  }),
  createOne: protectedProcedure
    .input(z.object({ header: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/reminderEmbeds/`, "POST", input);
    }),
  updateOne: protectedProcedure
    .input(
      z.object({ id: z.string(), header: z.string(), description: z.string() })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await jsonFetch(`${BOT_API_URL}/reminderEmbed/${id}`, "PUT", rest);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await jsonFetch(`${BOT_API_URL}/reminderEmbed/${id}`, "GET");
    }),
});
