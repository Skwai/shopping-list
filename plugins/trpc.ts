import { createTRPCNuxtClient, httpBatchLink } from "trpc-nuxt/client";
import superjson from "superjson";
import { AppRouter } from "~/server/trpc/routers";

export default defineNuxtPlugin(() => {
  const { csrf } = useCsrf();
  const headers = useRequestHeaders();

  const trpc = createTRPCNuxtClient<AppRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: "/api/trpc",
        headers: () => {
          return {
            ...headers,
            // Add the CSRF token to headers
            "csrf-token": csrf,
          };
        },
      }),
    ],
  });
  return {
    provide: {
      trpc,
    },
  };
});
