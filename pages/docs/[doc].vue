<script setup lang="ts">
import type { BlogPost } from '@/types/blog'
import { navbarData, seoData } from '~/data'

const { path } = useRoute()

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

const art = await queryCollection('content').path(path).first()

const links = art?.body?.toc?.links || []



useHead({
  title: data.value.title || '',
  meta: [
    { name: 'description', content: data.value.description },
    {
      name: 'description',
      content: data.value.description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: navbarData.homeTitle },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: `${seoData.mySite}/${path}`,
    },
    {
      property: 'og:title',
      content: data.value.title,
    },
    {
      property: 'og:description',
      content: data.value.description,
    },
    {
      property: 'og:image',
      content: data.value.ogImage || data.value.image,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@qdnvubp' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: `${seoData.mySite}/${path}`,
    },
    {
      name: 'twitter:title',
      content: data.value.title,
    },
    {
      name: 'twitter:description',
      content: data.value.description,
    },
    {
      name: 'twitter:image',
      content: data.value.ogImage || data.value.image,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `${seoData.mySite}/${path}`,
    },
  ],
})

// console.log(articles.value)

// Generate OG Image
defineOgImageComponent('Test', {
  headline: 'Liu Blog 👋',
  title: articles.value?.seo.title || '',
  description: articles.value?.seo.description || '',
  link: data.value.ogImage,
})
</script>

<template>


  <div class="w-full mx-auto px-6">

    <BlogHeader :title="data.title" :image="data.image" :alt="data.alt" :date="data.date"
      :description="data.description" :tags="data.tags" class="mb-12 col-span-12 lg:col-span-12" />

    <div class="px-6 w-full mx-auto grid lg:grid-cols-12 grid-cols-1 gap-x-16 py-10">


      <div
        class="hidden lg:block col-span-3 sticky top-24 self-start h-[calc(100vh-6rem)] overflow-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        <div class="border dark:border-gray-800 p-3 rounded-md min-w-[200px] dark:bg-slate-900">
          <h1 class="text-base font-bold mb-3 border-b dark:border-gray-800 pb-2">Table Of Content</h1>

          <div v-for="link in links" :key="link.id">
            <NuxtLink :to="`#${link.id}`" class="block mb-3 hover:underline">
              <h2 class="text-base font-semibold">{{ link.text }}</h2>
            </NuxtLink>

            <div v-if="link.children && link.children.length" class="pl-4">
              <NuxtLink v-for="child in link.children" :key="child.id" :to="`#${child.id}`"
                class="block text-m mb-3 hover:underline">
                <h3 class="text-base font-semibold">{{ child.text }}</h3>
              </NuxtLink>

            </div>
          </div>

        </div>
      </div>
      <div class="col-span-12 lg:col-span-9 lg:pl-12">
        <!-- <BlogHeader
        :title="data.title"
        :image="data.image"
        :alt="data.alt"
        :date="data.date"
        :description="data.description"
        :tags="data.tags"
      /> -->
        <div
          class="prose prose-pre:max-w-xs sm:prose-pre:max-w-full prose-sm sm:prose-base md:prose-lg prose-h1:no-underline max-w-5xl mx-auto prose-zinc dark:prose-invert prose-img:rounded-lg">
          <ContentRenderer v-if="articles" :value="articles">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
      </div>

      <!-- <div class="flex flex-row flex-wrap md:flex-nowrap mt-10 gap-2">
      <SocialShare
        v-for="network in ['facebook', 'twitter', 'github', 'email']"
        :key="network"
        :network="network"
        :styled="true"
        :label="true"
        class="p-1"
        aria-label="Share with {network}"
      />
    </div> -->
    </div>
  </div>
</template>
