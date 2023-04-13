<template>
  <div v-if="list">
    <header class="flex items-center gap-3 mb-2">
      <RouterLink
        to="/"
        class="inline-flex items-center justify-center text-slate-400"
      >
        <ChevronLeftIcon class="w-5 h-5" />
      </RouterLink>
      <h1 class="card-title">{{ list.name }}</h1>

      <div class="ml-auto form-control">
        <label class="label gap-3">
          <span class="label-text">Show completed</span>
          <input
            v-model="showCompletedItems"
            type="checkbox"
            class="toggle toggle-sm toggle-primary"
          />
        </label>
      </div>
    </header>

    <div class="py-2">
      <div
        v-for="item in itemsToDisplay"
        :key="item.id"
        class="flex items-center gap-3 text-lg py-3"
      >
        <input
          class="checkbox checkbox-sm"
          type="checkbox"
          :checked="!!item.completedAt"
          aria-label="Completed"
          @change="() => toggleListItem(item)"
        />

        <input
          v-model="item.label"
          class="w-full bg-transparent outline-none"
          @change="($event) => updateListItem($event, item.id)"
          @keydown.enter="($event) => updateListItem($event, item.id)"
        />
      </div>
    </div>

    <CreateListItemForm @create="addListItem" />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeftIcon } from "@heroicons/vue/24/outline";
import { ListItem } from ".prisma/client";

const route = useRoute();

const showCompletedItems = ref(false);

const itemsToDisplay = computed(() => {
  let items = list.value?.items ?? [];

  if (!showCompletedItems.value) {
    items = items.filter((item) => !item.completedAt);
  }

  return items.sort((a, b) => {
    if (a.completedAt && !b.completedAt) {
      return -1;
    }

    if (!a.completedAt && b.completedAt) {
      return 1;
    }

    return 0;
  });
});

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

const toggleListItem = async (item: ListItem) => {
  let updatedItem;

  if (item.completedAt) {
    updatedItem = await useTrpc().lists.uncompleteListItem.mutate({
      itemId: item.id,
    });
  } else {
    updatedItem = await useTrpc().lists.completeListItem.mutate({
      itemId: item.id,
    });
  }

  Object.assign(item, updatedItem);
};

const updateListItem = async (ev: Event, itemId: number) => {
  if (ev.target instanceof HTMLInputElement) {
    ev.target.blur();

    await useTrpc().lists.updateListItem.mutate({
      itemId,
      label: ev.target.value,
    });
  }
};
</script>
