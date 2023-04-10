<template>
  <form @submit.prevent="submit">
    <input
      v-model="label"
      class="p-3 border border-gray-200 block w-full focus:border-gray-300 outline-none"
      type="text"
      placeholder="Add item"
      required
    />
  </form>
</template>

<script setup lang="ts">
import { ListItem } from ".prisma/client";

const emits = defineEmits<{
  (e: "create", item: Pick<ListItem, "label">): void;
}>();

const label = ref("");

const submit = () => {
  emits("create", {
    label: label.value,
  });

  label.value = "";
};
</script>
