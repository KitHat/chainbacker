<script setup lang="ts">
import Carousel from 'primevue/carousel';

const getImage = (src: string) => {
  const path = new URL('@/assets/Tour/', import.meta.url);
  return `${path}/${src}`
}

const TOUR_SLIDES = [
    { image: 'slide_1.png', description: 'Welcome to deTon8! Join to deTONation and support your favorite projects. Now we will call you DETONER' } ,
    { image: 'slide_2.png', description: 'deTon8 is about: Low-commission, scam-proof, DAO-governed fundraising' },
    { image: 'slide_3.png', description: 'Create your project or find whats you like and deTONate it. Have fun' },
    { image: 'slide_4.png', description: 'Be with us and you will be surprised' }
]
</script>

<template>
  <section class="">
    <Carousel :value="TOUR_SLIDES"
              :num-visible="1"
              :show-indicators="true"
              :show-navigators="false"
    >
      <template #item="{ data }">
        <div class="flex flex-col gap-6 items-center mb-4">
          <img class="w-[190px] h-[190px]" :src="data.image" alt="">
          <p v-if="'description' in data" class="text-center text-lg font-bold">{{ data.description }}</p>
        </div>
      </template>
    </Carousel>
  </section>
</template>

<style scoped>

</style>
