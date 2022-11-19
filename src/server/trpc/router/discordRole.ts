import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { DiscordType } from "@prisma/client";

export const discordRoleRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.discordRole.findMany();
  }),
  createOne: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        snowflake: z.string(),
        type: z.nativeEnum(DiscordType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.discordRole.create({ data: input });
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        snowflake: z.string(),
        type: z.nativeEnum(DiscordType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      return await ctx.prisma.discordRole.update({ where: { id }, data: rest });
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.discordRole.findUnique({ where: { id } });
    }),
});
