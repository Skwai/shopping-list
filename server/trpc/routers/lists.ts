import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

const PUBLIC_LIST_FIELDS = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
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
              completedAt: null,
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

      // Ensure the user has access to the list we're creating an item for
      await ctx.prisma.list.findFirstOrThrow({
        where: {
          id: listId,
          deletedAt: null,
          users: {
            some: {
              id: ctx.session.uid,
            },
          },
        },
      });

      const item = await ctx.prisma.listItem.create({
        data: {
          label,
          list: {
            connect: {
              id: listId,
            },
          },
        },
      });

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
      const item = await ctx.prisma.listItem.updateMany({
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
        data: {
          completedAt: new Date(),
        },
      });

      return item;
    }),

  uncompleteListItem: protectedProcedure
    .input(
      z.object({
        itemId: z.coerce.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const item = await ctx.prisma.listItem.updateMany({
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
        data: {
          completedAt: new Date(),
        },
      });

      return item;
    }),
});
