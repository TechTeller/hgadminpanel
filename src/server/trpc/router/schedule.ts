import { router, protectedProcedure } from "../trpc"
import { z } from "zod"
import { jsonFetch } from "@/utils/trpc"

export const scheduleRouter = router({
  get: protectedProcedure.query(async () => {
    return await fetch('TODO', { method: 'GET' })
  }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      let result = await jsonFetch('TODO', 'PUT', input)
      // TODO cast as result type
      return result
    }),
})
