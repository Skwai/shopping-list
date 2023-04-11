<template>
  <div>
    <h1 class="text-xl font-bold mb-2">Lists</h1>

    <div class="py-2">
      <RouterLink
        v-for="list in lists"
        :key="list.id"
        class="block items-center gap-3 bg-slate-50 p-4 rounded-md mb-2"
        :to="`/lists/${list.id}`"
      >
        <h4 class="font-bold text-md">{{ list.name }}</h4>
        <time class="text-sm text-slate-500"
          >Updated {{ list.updatedAt.toLocaleDateString() }}</time
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
