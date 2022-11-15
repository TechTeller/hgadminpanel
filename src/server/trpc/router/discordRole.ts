import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { DiscordType } from "@prisma/client";

export const discordRoleRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.discordRole.findMany();
  }),
  getOne: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.discordRole.findUnique({ where: { id } });
    }),
  upsertOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        snowflake: z.string(),
        type: z.nativeEnum(DiscordType),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return await ctx.prisma.discordRole.upsert({
        where: { id },
        create: { ...rest },
        update: { ...rest },
      });
    }),
});
