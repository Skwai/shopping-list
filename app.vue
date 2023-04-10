<template>
  <div>
    <NuxtLayout>
      <NuxtPage v-if="authenticated" />
      <TheLogin v-else />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { authenticated } = useSession()
await useCurrentUser().loadUser();
</script>
