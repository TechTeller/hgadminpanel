import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { jsonFetch } from "../../../utils/trpc"


export const channelReminderRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await jsonFetch('http://localhost:2218/api/admin/reminders/', 'GET')
  }),
  createOne: protectedProcedure
    .input(z.object({ title: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch('TODO', 'POST', input)
    }),
  updateOne: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      return await jsonFetch('TODO', 'PUT', input)
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input
      console.log("HELLO", input, id)
      return await jsonFetch(`http://localhost:2218/api/admin/reminder/${id}`, 'GET')
    })
})
