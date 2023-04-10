<template>
  <div>
    <h1 class="text-3xl font-bold">Lists</h1>
    <RouterLink
      v-for="list in lists"
      :key="list.id"
      class="block"
      :to="`/lists/${list.id}`"
    >
      <h4 class="font-bold">{{ list.name }}</h4>
      <time>Updated {{ list.updatedAt.toLocaleDateString() }}</time>
    </RouterLink>

    <CreateListForm @create="createList" />
  </div>
</template>

<script setup lang="ts">
import { List } from ".prisma/client";

const { data: lists } = await useTrpc().lists.findAll.useQuery();

const createList = async ({ name }: Pick<List, "name">) => {
  const list = await useTrpc().lists.create.mutate({ name });

  lists.value?.push(list);
};
</script>
