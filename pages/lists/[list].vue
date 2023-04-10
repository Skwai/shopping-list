<template>
  <div>
    <div v-if="list">
      <h1 class="text-3xl font-bold mb-4">{{ list.name }}</h1>

      <div class="mb-4 flex flex-col gap-2 justify-start items-stretch">
        <div
          v-for="item in list.items"
          :key="item.id"
          class="flex items-center gap-3"
        >
          <button
            type="button"
            class="w-5 h-5 border border-gray-200 rounded-sm"
            @click="() => completeListItem(item.id)"
          ></button>

          {{ item.label }}
        </div>
      </div>

      <CreateListItemForm @create="addListItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ListItem } from ".prisma/client";

const route = useRoute();

const listId = computed<number>(() => {
  return parseInt(route.params.list as string);
});

const { data: list } = await useTrpc().lists.findOne.useQuery({
  id: listId.value,
});

const addListItem = async ({ label }: Pick<ListItem, "label">) => {
  const item = await useTrpc().lists.addItemToList.mutate({
    label,
    listId: listId.value,
  });

  if (list.value?.items) {
    list.value.items = [item, ...list.value.items];
  }
};

const completeListItem = async (itemId: number) => {
  await useTrpc().lists.completeListItem.mutate({
    itemId,
  });
};
</script>
