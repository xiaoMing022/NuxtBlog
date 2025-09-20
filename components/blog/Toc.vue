<script setup lang="ts">
const { path } = useRoute()
const articles = await queryCollection('content').path(path).first()

const links = articles?.body?.toc?.links || []
console.log(articles)
</script>

<template>
  <div class="lg:col-span-3 sticky top-28 h-96 lg:block justify-self-end overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
    <div class="border dark:border-gray-800 p-3 rounded-md min-w-[200px] dark:bg-slate-900">
      <h1 class="text-lg font-bold mb-3 border-b dark:border-gray-800 pb-2">Table Of Content</h1>

      <div v-for="link in links" :key="link.id">
        <NuxtLink  :to="`#${link.id}`" class="block text-xs mb-3 hover:underline">
          <h2 class="text-l font-semibold">{{ link.text }}</h2>
        </NuxtLink>

        <div v-if="link.children && link.children.length" class="pl-4">
          <NuxtLink v-for="child in link.children" :key="child.id" :to="`#${child.id}`" class="block text-xs mb-3 hover:underline">
            <h3 class="text-m font-semibold">{{ child.text}}</h3>
          </NuxtLink>

        </div>
      </div>

    </div>
  </div>
</template>
