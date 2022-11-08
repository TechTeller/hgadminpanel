import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { BOT_API_URL, jsonFetch } from "@/utils/trpc"

export const followupRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/followups/`, 'GET')
  }),
  createOne: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      tag: z.string()
    }))
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/followups/`, 'POST', input)
    }),
  updateOne: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      tag: z.string()
    }))
    .mutation(async ({ input }) => {
      const { id, ...rest } = input
      return await jsonFetch(`${BOT_API_URL}/followup/${id}`, 'PUT', rest)
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input
      return await jsonFetch(`${BOT_API_URL}/followup/${id}`, 'GET')
    })
})
