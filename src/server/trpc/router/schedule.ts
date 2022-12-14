import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { jsonFetch } from "@/utils/trpc";
import { env } from "@/env/server.mjs";

const { BOT_API_URL } = env;

export const scheduleRouter = router({
  get: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/schedule`, "GET");
  }),
  update: protectedProcedure
    .input(z.object({ streamTopic: z.string(), streamTime: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/schedule`, "PUT", input);
    }),
  getWeeklySchedule: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.property.findUnique({
      where: { key: "weeklySchedule" },
    });
  }),
  setWeeklySchedule: protectedProcedure
    .input(z.object({ value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.property.upsert({
        where: {
          key: "weeklySchedule",
        },
        create: {
          key: "weeklySchedule",
          value: input.value,
        },
        update: {
          value: input.value,
        },
      });
    }),
});
