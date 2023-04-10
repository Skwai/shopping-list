<template>
  <main class="m-x-auto max-w-sm border border-gray-200 rounded-lg p-6">
    <NuxtLayout>
      <NuxtPage v-if="authenticated" />
      <TheLogin v-else />
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
const { authenticated } = useSession();

await useAsyncData(async () => {
  await useCurrentUser().loadUser();
});
</script>
