import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { jsonFetch } from "@/utils/trpc";
import { env } from "@/env/server.mjs";

const { BOT_API_URL } = env;

export interface InitialFollowup {
  id: string;
  title: string;
  description: string;
  active: boolean;
  tag: string;
  scheduled_events: {
    title: string;
  } | null;
  scheduled_event_followup_settings: {
    listening_time: number;
  } | null;
}

export const followupRouter = router({
  getAll: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          description: z.string(),
          active: z.boolean(),
          listeningTime: z.number(),
          eventName: z.string().optional(),
          tag: z.string().optional(),
        })
      )
    )
    .query(async () => {
      const json = await jsonFetch(`${BOT_API_URL}/followups/`, "GET");
      return json.map((item: InitialFollowup) => {
        const {
          scheduled_events,
          tag,
          scheduled_event_followup_settings,
          ...rest
        } = item;
        return {
          eventName: scheduled_events?.title ?? tag,
          listeningTime: scheduled_event_followup_settings?.listening_time ?? 0,
          ...rest,
        };
      });
    }),
  getEvents: protectedProcedure.query(async () => {
    return await jsonFetch(`${BOT_API_URL}/events/recent`, "GET");
  }),
  createOne: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        active: z.boolean(),
        listening_time: z.number(),
        event_id: z.string().optional(),
        tag: z.string().optional(),
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
        active: z.boolean(),
        listening_time: z.number(),
        event_id: z.string().optional(),
        tag: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      return await jsonFetch(`${BOT_API_URL}/followups/${id}`, "PUT", rest);
    }),
  findById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { id } = input;
      return await jsonFetch(`${BOT_API_URL}/followups/${id}`, "GET");
    }),
});
