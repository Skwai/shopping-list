<template>
  <button
    class="rounded-lg px-4 py-2 text-center inline-flex items-center content-center border border-gray-200 hover:border-gray-400 border-solid text-gray-600 hover:shadow-lg transition-all"
    :disabled="disabled || loading"
    :type="type"
    :loading="loading"
  >
    <span>
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { type ButtonHTMLAttributes } from "vue";

withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: boolean;
    type?: ButtonHTMLAttributes["type"];
  }>(),
  {
    type: "button",
  }
);
</script>
