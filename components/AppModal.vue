<template>
  <div class="modal modal-open" @click="close">
    <div class="modal-box relative" @click.stop>
      <button
        type="button"
        class="btn btn-sm btn-circle absolute right-2 top-2"
        @click="close"
      >
        ✕
      </button>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: "close"): void;
}>();

const close = () => {
  emits("close");
};

const onDocumentKeydown = (ev: KeyboardEvent) => {
  if (ev.key === "Escape") {
    emits("close");
  }
};

onMounted(() => {
  document.addEventListener("keydown", onDocumentKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", onDocumentKeydown);
});
</script>
