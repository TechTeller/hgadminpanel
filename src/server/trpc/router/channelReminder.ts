import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { BOT_API_URL, jsonFetch } from "@/utils/trpc";

export interface InitialReminder {
  id: string;
  channel: { name: string };
  embed: { header: string };
  message_interval: number;
}

export const channelReminderRouter = router({
  getAll: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          channelName: z.string(),
          embedName: z.string(),
          message_interval: z.number(),
        })
      )
    )
    .query(async () => {
      const json = await jsonFetch(`${BOT_API_URL}/reminders/`, "GET");
      return json.map((item: InitialReminder) => {
        const { channel, embed, ...rest } = item;
        return { channelName: channel.name, embedName: embed.header, ...rest };
      });
    }),
  getChannels: protectedProcedure
    .output(
      z.array(
        z.object({ name: z.string(), type: z.string(), discord_id: z.string() })
      )
    )
    .query(async () => {
      return await jsonFetch(`${BOT_API_URL}/channels/`, "GET");
    }),
  createOne: protectedProcedure
    .input(
      z.object({
        channel_id: z.string(),
        message_interval: z.number(),
        embed_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/reminders/`, "POST", input);
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        channel_id: z.string(),
        message_interval: z.number(),
        embed_id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, "PUT", rest);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await jsonFetch(`${BOT_API_URL}/reminder/${id}`, "GET");
    }),
});
