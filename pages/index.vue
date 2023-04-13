<template>
  <div>
    <h1 class="card-title mb-2">Lists</h1>

    <div class="py-2">
      <RouterLink
        v-for="list in lists"
        :key="list.id"
        :to="`/lists/${list.id}`"
        class="block py-3"
      >
        <h4 class="text-xl">{{ list.name }}</h4>
        <time class="text-sm text-gray-400"
          >Updated {{ list.updatedAt.toLocaleDateString("en-AU") }}</time
        >
      </RouterLink>
    </div>

    <CreateListForm @create="createList" />
  </div>
</template>

<script setup lang="ts">
import { List } from ".prisma/client";

const { data: lists } = await useTrpc().lists.getAllLists.useQuery();

const createList = async ({ name }: Pick<List, "name">) => {
  const list = await useTrpc().lists.createList.mutate({ name });

  lists.value?.push(list);
};
</script>
