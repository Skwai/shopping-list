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

  findOne: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      const lists = await ctx.prisma.list.findFirstOrThrow({
        where: {
          id: input.id,
          users: {
            some: {
              id: ctx.session.uid,
            },
          },
        },
      });

      return lists;
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      return ctx.prisma.list.create({
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
