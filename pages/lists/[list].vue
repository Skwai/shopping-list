<template>
  <div v-if="list">
    <header class="flex items-center gap-3">
      <RouterLink to="/" class="btn btn-xs btn-circle">
        <ArrowSmallLeftIcon class="w-4 h-4" />
      </RouterLink>
      <h1 class="card-title">{{ list.name }}</h1>

      <button
        type="button"
        class="ml-auto btn btn-sm"
        @click="showInviteModal = true"
      >
        Share
      </button>
    </header>
    <div class="py-2">
      <div
        v-for="item in itemsToDisplay"
        :key="item.id"
        class="flex items-center gap-3 text-lg py-3"
      >
        <input
          class="checkbox checkbox-primary checkbox-sm"
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

    <!-- <div class="form-control">
      <label class="label cursor-pointer">
        <input
          v-model="showCompletedItems"
          type="checkbox"
          class="toggle toggle-sm toggle-primary"
        />
        <span class="label-text">Show completed</span>
      </label>
    </div> -->

    <CreateListItemForm @create="addListItem" />

    <AppModal v-if="showInviteModal" @close="showInviteModal = false">
      <form @submit.prevent="inviteUser">
        <h3 class="font-bold text-lg mb-4">Share list with others</h3>

        <div class="flex items-center gap-4">
          <input
            v-model="inviteEmail"
            class="input input-bordered w-full"
            type="email"
            placeholder="Email address"
            required
          />
          <button type="submit" class="btn btn-primary">Invite</button>
        </div>
      </form>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { ArrowSmallLeftIcon } from "@heroicons/vue/24/solid";
import { ListItem } from ".prisma/client";

const route = useRoute();

const showCompletedItems = ref(false);
const inviteEmail = ref("");
const showInviteModal = ref(false);

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

const inviteUser = async () => {
  await useTrpc().lists.addUserToList.mutate({
    listId: listId.value,
    email: inviteEmail.value,
  });

  showInviteModal.value = false;
};

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
