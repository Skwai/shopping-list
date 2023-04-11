<template>
  <NuxtLayout>
    <NuxtPage v-if="authenticated" />
    <TheLogin v-else />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { authenticated } = useSession();

useHead({
  bodyAttrs: {
    class: "flex justify-center p-4 min-h-screen bg-slate-100",
  },
});

await useAsyncData(async () => {
  await useCurrentUser().loadUser();
});
</script>

<style>
#__nuxt {
  width: 100%;
}
</style>
