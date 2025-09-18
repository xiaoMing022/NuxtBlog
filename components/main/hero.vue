<script setup lang="ts">
import { homePage } from '~/data'
</script>

<template>
  <div class="container mx-auto">
    <div class="grid grid-cols-1 sm:grid-cols-2 items-center">
      <div class="px-6">
        <h1 class="text-black dark:text-zinc-300 font-semibold leading-tight text-4xl md:text-5xl my-5">
          {{ homePage.title }}
        </h1>
        <h1 class="text-black dark:text-zinc-300 font-semibold leading-tight text-4xl md:text-5xl my-5">
         欢迎来到我的博客
        </h1>
        <p class="dark:text-zinc-400 h-px:30px">
          {{ homePage.description }}&#128525 &#128536 &#128573 &#128147 &#128149 &#128150;
        </p>
      </div>
      <div class="px-6 justify-self-center">
        <LogoDog />
      </div>
    </div>
  </div>
</template>
