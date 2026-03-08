<script setup lang="ts">
import type { BlogPost } from '@/types/blog'
import { ref, computed } from 'vue'

const { path } = useRoute()

// --- 移动端目录控制状态 ---
const showMobileToc = ref(false)

// 点击移动端目录链接后，关闭弹窗
const handleMobileTocClick = () => {
  showMobileToc.value = false
}

// ------------------------

const { data: articles, error } = await useAsyncData(`blog-post-${path}`, () =>
  queryCollection('content').path(path).first(),
)

if (error.value) navigateTo('/404')

const data = computed<BlogPost>(() => {
  const meta = articles?.value?.meta as unknown as BlogPost
  return {
    title: articles.value?.title || 'no-title available',
    description: articles.value?.description || 'no-description available',
    image: meta?.image || '/not-found.jpg',
    alt: meta?.alt || 'no alter data available',
    ogImage: (articles?.value?.ogImage as unknown as string) || '/not-found.jpg',
    date: meta?.date || 'not-date-available',
    tags: meta?.tags || [],
    published: meta?.published || false,
  }
})

// 获取目录链接
const links = computed(() => articles.value?.body?.toc?.links || [])

console.log("文章：")
console.log(articles.value?.title)


useHead({
  title: data.value.title || '',
  meta: [
    { name: 'description', content: data.value.description },
    { property: 'og:title', content: data.value.title },
    { property: 'og:description', content: data.value.description },
    { property: 'og:image', content: data.value.ogImage || data.value.image },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: data.value.title },
    { name: 'twitter:description', content: data.value.description },
    { name: 'twitter:image', content: data.value.ogImage || data.value.image },
  ],
})

defineOgImageComponent('Test', {
  headline: 'Liu Blog 👋',
  title: articles.value?.seo.title || '',
  description: articles.value?.seo.description || '',
  link: data.value.ogImage,
})
</script>

<template>
  <!-- 外层容器（不能有 overflow） -->
  <div class="px-4 sm:px-6 container mx-auto relative">

    <!-- Header -->
    <BlogHeader 
      :title="data.title"
      :image="data.image"
      :alt="data.alt"
      :date="data.date"
      :description="data.description"
      :tags="data.tags"
      class="mb-8 w-full max-w-full"
    />

    <!-- 主体两栏布局 -->
    <div class="grid lg:grid-cols-12 grid-cols-1 gap-y-8 lg:gap-x-12 pb-10">

      <!-- 侧边栏（sticky 必须放这里，并且祖先不能 overflow） -->
      <aside class="hidden lg:block lg:col-span-3 self-start sticky top-24 max-h-[calc(100vh-6rem-1rem)] overflow-y-auto px-2">
        <div class="border dark:border-gray-800 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <h1 class="text-lg font-bold mb-3 border-b dark:border-gray-800 pb-2 uppercase text-gray-500">
            目录
          </h1>

          <nav>
            <div v-for="link in links" :key="link.id" class="mb-2">
              <NuxtLink 
                :to="`#${link.id}`" 
                class="block text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors line-clamp-1"
              >
                {{ link.text }}
              </NuxtLink>

              <!-- 子标题 -->
              <div 
                v-if="link.children?.length" 
                class="pl-3 mt-1 border-l border-gray-200 dark:border-gray-800"
              >
                <NuxtLink 
                  v-for="child in link.children"
                  :key="child.id"
                  :to="`#${child.id}`"
                  class="block text-sm text-gray-500 hover:text-blue-600 py-0.5 transition-colors line-clamp-1"
                >
                  {{ child.text }}
                </NuxtLink>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      <!-- 内容 -->
      <main class="col-span-1 lg:col-span-9">
        <div class="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-zinc dark:prose-invert">
          <ContentRenderer v-if="articles" :value="articles">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
      </main>

    </div>

    <!-- 移动端按钮（fixed 正常工作） -->
    <button 
      @click="showMobileToc = true"
      class="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- 移动端目录 -->
    <Teleport to="body">
      <div
        v-if="showMobileToc"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
        @click="showMobileToc = false"
      ></div>

      <div
        class="fixed top-0 right-0 h-full w-64 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden overflow-y-auto p-6"
        :class="showMobileToc ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold">文章目录</h2>
          <button @click="showMobileToc = false" class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav>
          <div v-for="link in links" :key="link.id" class="mb-3">
            <NuxtLink 
              :to="`#${link.id}`"
              class="block text-base font-medium text-gray-800 dark:text-gray-200 hover:text-blue-600"
              @click="handleMobileTocClick"
            >
              {{ link.text }}
            </NuxtLink>

            <div 
              v-if="link.children?.length"
              class="pl-4 mt-2 border-l-2 border-gray-100 dark:border-gray-800"
            >
              <NuxtLink 
                v-for="child in link.children"
                :key="child.id"
                :to="`#${child.id}`"
                class="block text-sm text-gray-500 py-1 hover:text-blue-600"
                @click="handleMobileTocClick"
              >
                {{ child.text }}
              </NuxtLink>
            </div>
          </div>
        </nav>
      </div>
    </Teleport>

  </div>
</template>


<style scoped>
/* 确保 scrollbar 样式美观 */
.scrollbar-thin::-webkit-scrollbar {
  width: 2px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>