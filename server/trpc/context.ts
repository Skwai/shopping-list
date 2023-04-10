import { inferAsyncReturnType } from "@trpc/server";
import { H3Event } from "h3";
import { decodeSessionCookie } from "@/server/utils/firebase";
import { getPrismaClient } from "@/server/utils/prisma-client";

const decodeSession = async (event: H3Event) => {
  const sessionCookie = getCookie(event, "session");

  if (sessionCookie) {
    return await decodeSessionCookie(sessionCookie);
  }
};

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(event: H3Event) {
  const session = await decodeSession(event);
  const authenticated = !!session;

  return {
    prisma: getPrismaClient(),
    authenticated,
    session,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
