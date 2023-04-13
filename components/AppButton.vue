<template>
  <button
    class="btn"
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
