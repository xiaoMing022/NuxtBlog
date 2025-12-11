<script setup lang="ts">
  import dudu from '~/assets/images/dudu.png'
  import blog from '~/assets/images/blog.png'
// 1. 定义更新后的数据接口
interface Website {
  title: string;
  description: string;
  url: string;      // 演示地址
  github?: string;  // GitHub 地址 (可选)
  image: string;    // 网页截图/封面图
  tags: string[];
  status: string;
}

// 2. 模拟数据 (请替换为你真实的图片和链接)
const websites: Website[] = [
  {
    title: 'Dudu Agent',
    description: '一个基于Dify的智能助手，支持多种语言，多种模型，多种功能。',
    url: 'https://dudu.liu2002.top/home',
    github: 'https://github.com/yourname/dudu-home',
    image: dudu, // 示例图
    tags: ['React Native', 'Dify', 'Agent'],
    status: '运行中',
  },
  {
    title: 'Nuxt Blog',
    description: '我的技术博客，记录学习笔记与生活随想，支持 Markdown 渲染。',
    url: 'https://liu2002.top',
    github: 'https://github.com/yourname/blog',
    image: blog, // 示例图
    tags: ['Nuxt Content', 'Tailwind'],
    status: '运行中',
  },
  {
    title: '敏感数据出境风险监测系统',
    description: '用于监测敏感数据出境风险，支持数据分类、风险评估、风险预警等功能。',
    url: '#',
    // github: '...', // 如果没有开源，不填这个字段即可
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    tags: ['Admin', 'Secure'],
    status: '维护中',
  },
];

// 状态颜色辅助函数
const getStatusColor = (status: string) => {
  return status === '运行中' ? 'bg-emerald-500' : 'bg-amber-500';
};
</script>

<template>
  <main class="container max-w-5xl mx-auto text-zinc-600 px-4 py-10">

    <!-- Grid 布局 -->
    <div class="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      
      <!-- 卡片主体 -->
      <div
        v-for="(site, index) in websites"
        :key="index"
        class="group flex flex-col bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-zinc-300"
      >
        
        <!-- 1. 图片展示区 (点击也可跳转网站) -->
        <a :href="site.url" target="_blank" class="block relative h-48 overflow-hidden bg-zinc-100">
          <!-- 图片本身 -->
          <img 
            :src="site.image" 
            :alt="site.title"
            class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
          
          <!-- 状态徽标 (悬浮在图片右上角) -->
          <div class="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-white/50">
            <span class="w-1.5 h-1.5 rounded-full" :class="getStatusColor(site.status)"></span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
              {{ site.status}}
            </span>
          </div>
        </a>

        <!-- 2. 内容区 -->
        <div class="flex flex-col flex-1 p-5">
          <!-- 标题与链接 -->
          <a :href="site.url" target="_blank" class="block">
            <h3 class="text-lg font-bold text-zinc-800 group-hover:text-blue-600 transition-colors">
              {{ site.title }}
            </h3>
          </a>
          
          <!-- 描述 -->
          <p class="mt-2 text-sm text-zinc-500 line-clamp-2 leading-relaxed">
            {{ site.description }}
          </p>

          <!-- 标签 (自动推至底部) -->
          <div class="mt-4 flex flex-wrap gap-2 mb-4">
            <span 
              v-for="tag in site.tags" 
              :key="tag" 
              class="px-2 py-0.5 text-[10px] font-medium text-zinc-500 bg-zinc-100 rounded border border-zinc-200/50"
            >
              {{ tag }}
            </span>
          </div>

          <!-- 3. 底部操作栏 (GitHub + 访问) -->
          <div class="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
            
            <!-- 左侧：GitHub 链接 -->
            <div v-if="site.github">
              <a 
                :href="site.github" 
                target="_blank"
                class="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-zinc-900 transition-colors"
                @click.stop 
              >
                <!-- GitHub Icon SVG -->
                <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span>Source</span>
              </a>
            </div>
            <div v-else class="text-xs text-zinc-300 italic">
              Private
            </div>

            <!-- 右侧：访问按钮 -->
            <a 
              :href="site.url" 
              target="_blank"
              class="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Visit</span>
              <svg class="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

          </div>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>
/* 保持简洁，主要样式均通过 Tailwind 完成 */
</style>