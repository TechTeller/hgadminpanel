import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { jsonFetch } from "@/utils/trpc";
import { env } from "@/env/server.mjs";

const { BOT_API_URL } = env;

export interface InitialFollowup {
  id: string;
  title: string;
  description: string;
  scheduled_events: {
    title: string;
  };
  active: boolean;
}

export const followupRouter = router({
  getAll: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          eventName: z.string(),
          active: z.boolean(),
        })
      )
    )
    .query(async () => {
      const json = await jsonFetch(`${BOT_API_URL}/followups/`, "GET");
      return json.map((item: InitialFollowup) => {
        const { scheduled_events, ...rest } = item;
        return { eventName: scheduled_events.title, ...rest };
      });
    }),
  getEvents: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/events/`, "GET");
  }),
  createOne: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        event_id: z.string(),
        active: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      return await jsonFetch(`${BOT_API_URL}/followups/`, "POST", input);
    }),
  updateOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        event_id: z.string(),
        active: z.boolean(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await jsonFetch(`${BOT_API_URL}/followup/${id}`, "PUT", rest);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await jsonFetch(`${BOT_API_URL}/followup/${id}`, "GET");
    }),
});
