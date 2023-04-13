<template>
  <form>
    <h2 class="card-title mb-4">Sign in</h2>

    <AppButton @click="loginWithGoogle">Sign in with Google</AppButton>
  </form>
</template>

<script lang="ts" setup>
const { loginWithGoogle } = useFirebaseAuth();
</script>
