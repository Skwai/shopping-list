<template>
  <button :disabled="disabled || loading" :type="type" :loading="loading">
    <span><slot></slot></span>
  </button>
</template>

<script setup lang="ts">
import { type ButtonHTMLAttributes } from "vue";

withDefaults(
  defineProps<{
    loading?: boolean;
    disabled?: ButtonHTMLAttributes["disabled"];
    type?: ButtonHTMLAttributes["type"];
  }>(),
  {
    type: "button",
  }
);
</script>
