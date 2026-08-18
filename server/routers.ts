import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { buildAwakeMessages } from "./awake-policy";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const chatTurnSchema = z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(1200) });
export const appRouter = router({
  system: systemRouter,
  auth: router({ me: publicProcedure.query((opts) => opts.ctx.user), logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }) }),
  awake: router({ chat: publicProcedure.input(z.object({ consent: z.literal(true), language: z.enum(["bn", "en"]), messages: z.array(chatTurnSchema).min(1).max(12) })).mutation(async ({ input }) => { try { const response = await invokeLLM({ model: "claude-haiku-4-5", messages: buildAwakeMessages(input.messages, input.language) }); const text = response.choices[0]?.message?.content; if (typeof text !== "string" || !text.trim()) throw new Error("aWake returned no readable text"); return { text: text.trim(), model: "aWake", provider: "online" }; } catch (error) { console.error("[aWake] chat request failed", error); throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "aWake is temporarily unavailable. Your message remains in your local workspace." }); } }) }),
});
export type AppRouter = typeof appRouter;
