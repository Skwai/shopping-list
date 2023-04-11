<template>
  <div v-if="list">
    <header class="flex align-center gap-3 mb-2">
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center text-slate-400"
      >
        <ArrowLeftCircleIcon class="w-6 h-6" />
      </RouterLink>
      <h1 class="text-xl font-bold">{{ list.name }}</h1>
    </header>

    <div class="py-2">
      <div
        v-for="item in list.items"
        :key="item.id"
        class="flex items-center gap-3 text-lg bg-slate-50 py-3 px-4 rounded-md mb-2"
      >
        <button
          role="checkbox"
          type="button"
          class="w-5 h-5 border border-slate-300 rounded-sm"
          :aria-checked="!!item.completedAt"
          @click="() => completeListItem(item.id)"
        ></button>

        {{ item.label }}
      </div>
    </div>

    <CreateListItemForm @create="addListItem" />
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftCircleIcon } from "@heroicons/vue/24/outline";
import { ListItem } from ".prisma/client";

const route = useRoute();

const listId = computed<number>(() => {
  return parseInt(route.params.list as string);
});

const { data: list } = await useTrpc().lists.getList.useQuery({
  id: listId.value,
});

const addListItem = async ({ label }: Pick<ListItem, "label">) => {
  const item = await useTrpc().lists.addItemToList.mutate({
    label,
    listId: listId.value,
  });

  if (list.value?.items) {
    list.value.items = [...list.value.items, item];
  }
};

const completeListItem = async (itemId: number) => {
  await useTrpc().lists.completeListItem.mutate({
    itemId,
  });
};
</script>
