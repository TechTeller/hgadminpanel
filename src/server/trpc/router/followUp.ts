import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { jsonFetch } from "@/utils/trpc"

export const followUpRouter = router({
  getAll: protectedProcedure.query(async () => {
    return await fetch('TODO', { method: 'GET' })
  }),
  createOne: protectedProcedure
    .input(z.object({ title: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      const { title, message } = input
      if (!title || !message) {
        // TODO error message
        return
      }
      let result = await jsonFetch('TODO', 'POST', input)
      // TODO cast as result type
      return result
    }),
  updateOne: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      let result = await jsonFetch('TODO', 'PUT', input)
      // TODO cast as result type
      return result

    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await jsonFetch('TODO', 'GET', input)
    })
})
