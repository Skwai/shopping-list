<template>
  <form @submit.prevent="submit">
    <p>
      <input v-model="label" type="text" placeholder="Add item" required />
    </p>
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
