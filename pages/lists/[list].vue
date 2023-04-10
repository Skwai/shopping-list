<template>
    <div>
        {{ list }}
    </div>
</template>

<script setup lang="ts">
const route = useRoute()

const listId  = computed<number>(() => {
    return parseInt(route.params.list as string)
})

const { data: list } = await useTrpc().lists.findOne.useQuery({ id: listId.value })
</script>