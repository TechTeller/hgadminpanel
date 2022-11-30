// src/utils/trpc.ts
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { TRPCError } from "@trpc/server"
import type { AppRouter } from "@/server/trpc/router";
import superjson from "superjson";
import { env } from "@/env/server.mjs";

export const BOT_API_URL = env.BOT_API_URL;

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});

export const jsonFetch = async (url: string, method: string, data?: object) => {
  try {
    let body
    let headers
    if (data) {
      body = JSON.stringify(data)
      headers = { 'Content-Type': 'application/json' }
    }
    const res = await fetch(url, { method, headers, body })
    console.log("help", res)
    const result = await res.json()
    console.log("json", result)
    return result
  } catch (err) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred, please try again later.',
      // optional: pass the original error to retain stack trace
      cause: err,
    });

  }
}
