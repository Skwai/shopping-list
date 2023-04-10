<template>
    <div>
        <div v-for="list in lists" :key="list.id">
            {{ list }}
        </div>

        <CreateListForm @create="createList" />
    </div>
</template>


<script setup lang="ts">
import { List } from '.prisma/client';

const { data: lists } = await useTrpc().lists.findAll.useQuery();

const createList = async ({ name }: Pick<List, "name">) => {
    const list = await useTrpc().lists.createList.mutate({ name })
}
</script>

