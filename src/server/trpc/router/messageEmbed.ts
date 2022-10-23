import { router, publicProcedure } from "../trpc"
import { z } from "zod"

export const messageRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.messageEmbed.findMany()
  }),
  insertOne: publicProcedure
    .input(z.object({ title: z.string(), slug: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { title, message, slug, ...rest } = input
      if (!title || !slug || !message) {
        // TODO error message
        return
      }
      const insert = { data: { title, slug, message, ...rest } }
      return await ctx.prisma.messageEmbed.create(insert)
    }),
  updateOne: publicProcedure
    .input(z.object({ id: z.string(), title: z.string(), slug: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input
      return await ctx.prisma.messageEmbed.update({ where: { id }, data: { ...rest } })

    }),
  findBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input
      return await ctx.prisma.messageEmbed.findUnique({ where: { slug } })
    })
})
