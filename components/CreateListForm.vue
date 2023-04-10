<template>
  <form @submit.prevent="submit">
    <p>
      <input v-model="name" placeholder="Add new list" type="text" required />
    </p>
    <p>
      <AppButton type="submit">Create list</AppButton>
    </p>
  </form>
</template>

<script setup lang="ts">
import { List } from ".prisma/client";

const emits = defineEmits<{ (e: "create", list: Pick<List, "name">): void }>();

const name = ref("");

const submit = () => {
  emits("create", {
    name: name.value,
  });
};
</script>
