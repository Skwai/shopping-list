<template>
    <div>
        <RouterLink :to="`/lists/${list.id}`" v-for="list in lists" :key="list.id">
            {{ list }}
        </RouterLink>

        <CreateListForm @create="createList" />
    </div>
</template>


<script setup lang="ts">
import { List } from '.prisma/client';

const { data: lists } = await useTrpc().lists.findAll.useQuery();

const createList = async ({ name }: Pick<List, "name">) => {
    const list = await useTrpc().lists.create.mutate({ name })

    lists.value?.push(list)
}
</script>

