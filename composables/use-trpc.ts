export const useTrpc = () => {
  const { $trpc } = useNuxtApp();

  return $trpc;
};
