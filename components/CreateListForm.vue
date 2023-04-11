<template>
  <form @submit.prevent="submit">
    <p>
      <input
        v-model="name"
        class="p-3 border border-gray-200 rounded-md block w-full focus:border-gray-300 outline-none"
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
