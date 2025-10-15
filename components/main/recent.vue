<script lang="ts" setup>
import type { BlogPost } from '~/types/blog'


function parseDate(dateStr: string): Date {
  // 使用 / 分割字符串
  const parts = dateStr.split("/");

  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected format: YYYY/MM/DD");
  }

  const [yearStr, monthStr, dayStr] = parts;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JS 的月份从 0 开始
  const day = parseInt(dayStr, 10);

  const date = new Date(year, month, day);

  // 简单校验日期有效性
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }

  return date;
}

// Get Last 6 Publish Post from the content/blog directory
const { data } = await useAsyncData('recent-post', () =>
  queryCollection('content')
    .all()
    .then((data) => {

      console.log(data)
      return data
        .sort((a, b) => {
          const aDate = parseDate(a.meta.date as string)
          const bDate = parseDate(b.meta.date as string)
          return bDate.getTime() - aDate.getTime()
        })
        .slice(0,3)
    }),
)
console.log("文章数据：")
console.log(data)
console.log("文章数据：")

const formattedData = computed(() => {
  return data.value?.map((articles) => {
    const meta = articles.meta as unknown as BlogPost
    return {
      path: articles.path,
      title: articles.title || 'no-title available',
      description: articles.description || 'no-description available',
      image: meta.image || '/not-found.jpg',
      alt: meta.alt || 'no alter data available',
      ogImage: meta.ogImage || '/not-found.jpg',
      date: meta.date || 'not-date-available',
      tags: meta.tags || [],
      published: meta.published || false,
    }
  })
})


useHead({
  title: 'Home',
  meta: [
    {
      name: 'description',
      content:
        'Welcome To My Blog Site. ',
    },
  ],
})
</script>

<template>
  <div class="pb-10 px-4">
    <div class="flex flex-row items-center space-x-3 pt-5 pb-3">
      <Icon name="mdi:star-three-points-outline" size="2em" class="text-black dark:text-zinc-300" />
      <h2 class="text-4xl font-semibold text-black dark:text-zinc-300">最近</h2>
    </div>
    <NuxtLink to="/doc" class="text-sky-700 dark:text-sky-400 hover:underline mb-4 inline-block">查看所有文章 &rarr;</NuxtLink>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      
      <template v-for="post in formattedData" :key="post.title">
          <BlogCard
          :path="post.path"
          :title="post.title"
          :date="post.date"
          :description="post.description"
          :image="post.image"
          :alt="post.alt"
          :og-image="post.ogImage"
          :tags="post.tags"
          :published="post.published"
        />
      </template>
      <template v-if="data?.length === 0">
        <BlogEmpty />
      </template>
    </div>
  </div>
</template>
