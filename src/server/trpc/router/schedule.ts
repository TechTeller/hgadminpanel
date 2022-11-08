import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { BOT_API_URL, jsonFetch } from "@/utils/trpc"

export const scheduleRouter = router({
  get: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/schedule/`, 'GET')
  }),
  update: protectedProcedure
    .input(z.object({ streamTopic: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/schedule`, 'PUT', input)
    }),
})
