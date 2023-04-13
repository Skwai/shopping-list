<template>
  <form @submit.prevent="submit">
    <p>
      <input
        v-model="name"
        class="input input-bordered input-md w-full"
        placeholder="New list name"
        type="text"
        required
      />
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
