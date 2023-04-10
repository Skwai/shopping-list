import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const listsRouter = router({
  findAll: protectedProcedure.query(async ({ ctx }) => {
    const userWithLists = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.uid,
      },
      include: {
        lists: true,
      },
    });

    return userWithLists?.lists;
  }),

  createList: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      await ctx.prisma.list.create({
        data: {
          name,
          users: {
            connect: {
              id: ctx.session.uid,
            },
          },
        },
      });
    }),
});
