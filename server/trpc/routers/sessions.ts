import { TRPCError } from "@trpc/server";
import { getAuth } from "firebase-admin/auth";
import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";

const SESSION_LIFESPAN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days: the maximum cookie session lifespan

export const sessionsRouter = router({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  createSession: publicProcedure
    .input(z.object({ idToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const expiresIn = SESSION_LIFESPAN_MS;

      const {
        uid: id,
        name,
        email,
      } = await getAuth().verifyIdToken(input.idToken);

      const token = await getAuth().createSessionCookie(input.idToken, {
        expiresIn,
      });

      if (email) {
        const user = await ctx.prisma.user.upsert({
          where: {
            id,
          },
          create: {
            id,
            name,
            email,
          },
          update: {
            name,
          },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        return {
          token,
          user,
        };
      } else {
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
