import { router } from "../trpc";
import { listsRouter } from "./lists";
import { sessionsRouter } from "./sessions";
import { usersRouter } from "./users";

export const appRouter = router({
  sessions: sessionsRouter,
  users: usersRouter,
  lists: listsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
