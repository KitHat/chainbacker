<template>
  <section>
    <section>
      <div class="pb-8 pt-8
    ml-[-22px]
    mr-[-28px]
    pl-[22px]
    pr-[24px]
    overflow-scroll
    gap-1
    flex flex-nowrap grow whitespace-nowrap no-scrollbar sticky top-0 z-10">
        <Tag v-for="chip in CHIPS_FILTER_MOCK"  :value="chip" :severity="'success'" />
      </div>
      <section class="mb-5 -mx-2">
        <Carousel :value="CARDS_MOCK"
                  :num-visible="1"
                  circular
                  :indicators-content-class="null"
                  :show-indicators="false"
                  :show-navigators="false"
                  :autoplay-interval="5000"
        >
          <template #item="{ data }">
            <router-link :to="{ name: 'ProjectPage', params: {  id: data.id } }">
              <Card class="m-2"
                    v-bind="data"
                    :key="data.id" />
            </router-link>
          </template>
        </Carousel>
      </section>
      <section class="rounded-2xl w-full bg-success-700 h-[200px] mb-8 flex items-center justify-center bg-gradient-to-l from-success-700 to-success-500">
        <p class="text-center">Join the community and support your favorite projects (girls on banner)</p>
      </section>
      <h2 class="text-3xl font-bold mb-6">
        Detonate soon
      </h2>
      <section class="mb-8">
        <Carousel :value="DETONATE_CARDS_MOCK" :num-visible="2"
                  :indicators-content-class="null"
                  :show-indicators="false"
                  :show-navigators="false"
        >
          <template #item="{ data }">
            <router-link :to="{ name: 'ProjectPage', params: {  id: data.id } }">
              <DetonateCard class="m-2"
                    v-bind="data"
                    :key="data.id" />
            </router-link>
          </template>
        </Carousel>
      </section>
      <section>
        <h3 class="text-2xl font-semibold mb-6">
          Daily success
        </h3>
        <MostActiveKick />
      </section>
    </section>
    <section></section>
   </section>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import Card from "@/components/Card.vue";
import Carousel from 'primevue/carousel';
import { CARDS_MOCK, DETONATE_CARDS_MOCK } from "@/mocks/mocks.ts";
import MostActiveKick from "@/components/MostActiveKick.vue";
import DetonateCard from "@/components/DetonateCard.vue";

const CHIPS_FILTER_MOCK = ['Art & Design',
  'Technology & Gadgets',
  'Games (Board Games, Video Games)',
  'Film & Video',
  'Music & Performance'
]
</script>

<style scoped>

</style>
