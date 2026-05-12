<script setup lang="ts">
import type { BlogPost } from '@/types/blog'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const { path } = useRoute()

// --- 移动端目录控制 ---
const showMobileToc = ref(false)
const handleMobileTocClick = () => {
  showMobileToc.value = false
}

// ----------------------

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

// =============================================
// 新方案：客户端 DOM 扫描生成 TOC（无数量限制）
// =============================================

interface TocItem {
  id: string
  text: string
  depth: number
  children: TocItem[]
}

const contentRef = ref<HTMLElement | null>(null)
const tocLinks = ref<TocItem[]>([])
const activeId = ref<string>('')

/** 扫描 DOM 中所有 h2/h3/h4，构建三级嵌套树 */
function buildToc() {
  if (!contentRef.value) return

  const headings = Array.from(
    contentRef.value.querySelectorAll('h2, h3, h4')
  ) as HTMLElement[]

  const links: TocItem[] = []
  let currentH2: TocItem | null = null
  let currentH3: TocItem | null = null

  headings.forEach((el) => {
    const depth = parseInt(el.tagName[1])
    const item: TocItem = {
      id: el.id,
      text: el.textContent?.trim() ?? '',
      depth,
      children: [],
    }

    if (depth === 2) {
      currentH2 = item
      currentH3 = null
      links.push(item)
    } else if (depth === 3) {
      currentH3 = item
      if (currentH2) currentH2.children.push(item)
      else links.push(item) // 没有 h2 父节点时提升为顶层
    } else if (depth === 4) {
      if (currentH3) currentH3.children.push(item)
      else if (currentH2) currentH2.children.push(item)
      else links.push(item)
    }
  })

  tocLinks.value = links
}

/** IntersectionObserver：追踪当前可见标题，高亮目录项 */
let observer: IntersectionObserver | null = null

function setupObserver() {
  if (!contentRef.value) return

  const headings = Array.from(
    contentRef.value.querySelectorAll('h2, h3, h4')
  ) as HTMLElement[]

  if (headings.length === 0) return

  // 用一个 Map 记录每个 heading 的可见比例，取最高的
  const visibilityMap = new Map<string, number>()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visibilityMap.set(entry.target.id, entry.intersectionRatio)
      })

      // 找出当前可见比例最高的 heading
      let maxRatio = 0
      let topId = ''
      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio
          topId = id
        }
      })

      if (topId) activeId.value = topId
    },
    {
      // 视口上方留 80px（navbar 高度），下方只看上半屏
      rootMargin: '-80px 0px -55% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  )

  headings.forEach((h) => observer!.observe(h))
}

onMounted(() => {
  nextTick(() => {
    buildToc()
    setupObserver()
  })
})

onUnmounted(() => {
  observer?.disconnect()
})

// =============================================

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
  <!-- 外层容器 -->
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

      <!-- 桌面端侧边栏目录 -->
      <aside class="hidden lg:block lg:col-span-3 self-start sticky top-24 max-h-[calc(100vh-6rem-1rem)] overflow-y-auto px-2">
        <div class="border dark:border-gray-800 p-4 rounded-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <p class="text-xs font-bold mb-3 border-b dark:border-gray-800 pb-2 uppercase tracking-widest text-gray-400">
            目录
          </p>

          <!-- tocLinks 为空时显示占位 -->
          <p v-if="tocLinks.length === 0" class="text-xs text-gray-400 italic">加载中…</p>

          <nav v-else>
            <template v-for="link in tocLinks" :key="link.id">
              <!-- H2 -->
              <div class="mb-1">
                <a
                  :href="`#${link.id}`"
                  :class="[
                    'block text-sm font-medium py-0.5 px-2 rounded transition-all duration-150 line-clamp-2',
                    activeId === link.id
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800/50'
                  ]"
                >
                  {{ link.text }}
                </a>

                <!-- H3 子节点 -->
                <div v-if="link.children.length" class="pl-3 mt-0.5 border-l border-gray-200 dark:border-gray-700 ml-2">
                  <template v-for="child in link.children" :key="child.id">
                    <a
                      :href="`#${child.id}`"
                      :class="[
                        'block text-xs py-0.5 px-2 rounded transition-all duration-150 line-clamp-2',
                        activeId === child.id
                          ? 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 font-medium'
                          : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                      ]"
                    >
                      {{ child.text }}
                    </a>

                    <!-- H4 子节点 -->
                    <div v-if="child.children.length" class="pl-3 border-l border-gray-100 dark:border-gray-800 ml-2">
                      <a
                        v-for="grandChild in child.children"
                        :key="grandChild.id"
                        :href="`#${grandChild.id}`"
                        :class="[
                          'block text-xs py-0.5 px-2 rounded transition-all duration-150 line-clamp-2',
                          activeId === grandChild.id
                            ? 'text-blue-400 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 font-medium'
                            : 'text-gray-400 dark:text-gray-500 hover:text-blue-400'
                        ]"
                      >
                        {{ grandChild.text }}
                      </a>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </nav>
        </div>
      </aside>

      <!-- 正文内容区域 -->
      <main class="col-span-1 lg:col-span-9">
        <div
          ref="contentRef"
          class="doc-content"
        >
          <ContentRenderer v-if="articles" :value="articles">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
      </main>

    </div>

    <!-- 移动端悬浮按钮 -->
    <button
      @click="showMobileToc = true"
      class="lg:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
      aria-label="打开目录"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
      </svg>
    </button>

    <!-- 移动端目录抽屉 -->
    <Teleport to="body">
      <div
        v-if="showMobileToc"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
        @click="showMobileToc = false"
      />

      <div
        class="fixed top-0 right-0 h-full w-72 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-transform duration-300 lg:hidden overflow-y-auto p-6"
        :class="showMobileToc ? 'translate-x-0' : 'translate-x-full'"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold tracking-wide">文章目录</h2>
          <button
            @click="showMobileToc = false"
            class="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="关闭目录"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav>
          <template v-for="link in tocLinks" :key="link.id">
            <div class="mb-1">
              <a
                :href="`#${link.id}`"
                :class="[
                  'block text-sm font-medium py-1 px-2 rounded transition-colors line-clamp-2',
                  activeId === link.id
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-800 dark:text-gray-200 hover:text-blue-600'
                ]"
                @click="handleMobileTocClick"
              >
                {{ link.text }}
              </a>

              <div v-if="link.children.length" class="pl-4 mt-0.5 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
                <template v-for="child in link.children" :key="child.id">
                  <a
                    :href="`#${child.id}`"
                    :class="[
                      'block text-xs py-1 px-2 rounded transition-colors line-clamp-2',
                      activeId === child.id
                        ? 'text-blue-500 dark:text-blue-400 font-medium'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-500'
                    ]"
                    @click="handleMobileTocClick"
                  >
                    {{ child.text }}
                  </a>

                  <div v-if="child.children.length" class="pl-3 border-l border-gray-100 dark:border-gray-800 ml-2">
                    <a
                      v-for="grandChild in child.children"
                      :key="grandChild.id"
                      :href="`#${grandChild.id}`"
                      class="block text-xs py-0.5 px-2 rounded text-gray-400 hover:text-blue-400 transition-colors line-clamp-2"
                      @click="handleMobileTocClick"
                    >
                      {{ grandChild.text }}
                    </a>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </nav>
      </div>
    </Teleport>

  </div>
</template>


<style scoped>
/* 目录滚动条美化 */
aside::-webkit-scrollbar {
  width: 3px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.dark aside::-webkit-scrollbar-thumb {
  background-color: #374151;
}
</style>