import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { protectedProcedure, router } from "../trpc";
import { createUserWithEmail } from "~/server/utils/firebase";

const PUBLIC_LIST_FIELDS = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
};

const createNewUser = async (prisma: PrismaClient, email: string) => {
  const firebaseUser = await createUserWithEmail(email);

  return prisma.user.create({
    data: {
      id: firebaseUser.uid,
      email,
    },
  });
};

export const listsRouter = router({
  getAllLists: protectedProcedure.query(async ({ ctx }) => {
    const lists = await ctx.prisma.list.findMany({
      where: {
        deletedAt: null,
        users: {
          some: {
            id: ctx.session.uid,
          },
        },
      },
      select: PUBLIC_LIST_FIELDS,
    });

    return lists;
  }),

  getList: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.list.findFirstOrThrow({
        where: {
          id: input.id,
          deletedAt: null,
          users: {
            some: {
              id: ctx.session.uid,
            },
          },
        },
        include: {
          items: {
            where: {
              deletedAt: null,
            },
          },
        },
      });

      return list;
    }),

  createList: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      const list = await ctx.prisma.list.create({
        data: {
          name,
          users: {
            connect: {
              id: ctx.session.uid,
            },
          },
        },
        select: PUBLIC_LIST_FIELDS,
      });

      return list;
    }),

  addItemToList: protectedProcedure
    .input(
      z.object({
        listId: z.coerce.number(),
        label: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { label, listId } = input;

      const [, item] = await ctx.prisma.$transaction([
        ctx.prisma.list.findFirstOrThrow({
          where: {
            id: listId,
            deletedAt: null,
            users: {
              some: {
                id: ctx.session.uid,
              },
            },
          },
        }),
        ctx.prisma.listItem.create({
          data: {
            label,
            list: {
              connect: {
                id: listId,
              },
            },
          },
        }),
      ]);

      return item;
    }),

  getCompletedListItems: protectedProcedure
    .input(z.object({ id: z.coerce.number() }))
    .query(async ({ ctx, input }) => {
      const list = await ctx.prisma.list.findFirstOrThrow({
        where: {
          id: input.id,
          deletedAt: null,
          users: {
            some: {
              id: ctx.session.uid,
            },
          },
        },
        include: {
          items: {
            where: {
              deletedAt: null,
              completedAt: {},
            },
          },
        },
      });

      return list?.items;
    }),

  completeListItem: protectedProcedure
    .input(
      z.object({
        itemId: z.coerce.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [, item] = await ctx.prisma.$transaction([
        ctx.prisma.listItem.findFirstOrThrow({
          where: {
            id: input.itemId,
            list: {
              users: {
                some: {
                  id: ctx.session.id,
                },
              },
            },
          },
        }),

        ctx.prisma.listItem.update({
          where: {
            id: input.itemId,
          },
          data: {
            completedAt: new Date(),
          },
        }),
      ]);

      return item;
    }),

  uncompleteListItem: protectedProcedure
    .input(
      z.object({
        itemId: z.coerce.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [, item] = await ctx.prisma.$transaction([
        ctx.prisma.listItem.findFirstOrThrow({
          where: {
            id: input.itemId,
            list: {
              users: {
                some: {
                  id: ctx.session.id,
                },
              },
            },
          },
        }),

        ctx.prisma.listItem.update({
          where: {
            id: input.itemId,
          },
          data: {
            completedAt: null,
          },
        }),
      ]);

      return item;
    }),

  updateListItem: protectedProcedure
    .input(
      z.object({
        itemId: z.coerce.number(),
        label: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { label, itemId } = input;

      await ctx.prisma.listItem.updateMany({
        where: {
          id: itemId,
          list: {
            users: {
              some: {
                id: ctx.session.id,
              },
            },
          },
        },
        data: {
          label,
        },
      });
    }),

  addUserToList: protectedProcedure
    .input(
      z.object({
        listId: z.coerce.number().int(),
        email: z.coerce.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { listId, email } = input;

      let user;

      user = await ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        user = await createNewUser(ctx.prisma, email);
      }

      await ctx.prisma.list.update({
        where: {
          id: listId,
        },
        data: {
          users: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }),
});
