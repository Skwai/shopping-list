import { protectedProcedure, router } from "../trpc";

export const usersRouter = router({
  getCurrentUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx.session?.uid,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }),
});
