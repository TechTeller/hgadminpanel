import { router, publicProcedure } from "../trpc"
import { z } from "zod"
import { DiscordUser } from "@prisma/client"

export const discordUserRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      }
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.discordUser.findMany()
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.discordUser.findUnique({ where: { id } })
    }),
  upsertOne: publicProcedure
    .input(z.object({ userId: z.string(), username: z.string(), roles: z.string().nullable() }))
    .query(async ({ ctx, input }) => {
      const { userId, username, ...rest } = input
      const currentUser: DiscordUser | null = await ctx.prisma.discordUser.findFirst({ where: { userId, username } })
      if (currentUser) {
        return await ctx.prisma.discordUser.update({ where: { id: currentUser.id }, data: { ...rest } })
      }
      return await ctx.prisma.discordUser.create({ data: input })
    })
})
