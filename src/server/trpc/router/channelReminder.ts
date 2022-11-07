import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { BOT_API_URL, jsonFetch } from "@/utils/trpc"

export const channelReminderRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/reminders/`, 'GET')
  }),
  createOne: protectedProcedure
    .input(z.object({ header: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/reminders/`, 'POST', input)
    }),
  updateOne: protectedProcedure
    .input(z.object({ id: z.string(), header: z.string(), description: z.string() }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input
      console.log("UPDATE", input, id)
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, 'PUT', rest)
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input
      console.log("HELLO", input, id)
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, 'GET')
    })
})
