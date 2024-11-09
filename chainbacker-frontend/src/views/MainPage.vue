<template>
  <section>
    <div class="mb-8
    ml-[-22px]
    mr-[-28px]
    pl-[22px]
    pr-[24px]
    overflow-scroll
    gap-1
    flex flex-nowrap grow whitespace-nowrap no-scrollbar">
     <Tag v-for="chip in CHIPS_FILTER_MOCK"  :value="chip" :severity="'success'" />
    </div>
    <section class="mb-5 -mx-2">
      <Carousel :value="CARDS_MOCK"
                :num-visible="1"
                :indicators-content-class="null"
                :show-indicators="false"
                :show-navigators="false"
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
    <h2 class="text-3xl font-bold mb-6">
      coming to end
    </h2>
    <section>
      <Carousel :value="CARDS_MOCK" :num-visible="2"
                :indicators-content-class="null"
                :show-indicators="false"
                :show-navigators="false"
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
   </section>
</template>

<script setup lang="ts">
import Tag from 'primevue/tag';
import Card from "@/components/Card.vue";
import Carousel from 'primevue/carousel';

const CHIPS_FILTER_MOCK = ['Art & Design',
  'Technology & Gadgets',
  'Games (Board Games, Video Games)',
'Film & Video',
'Music & Performance']

const CARDS_MOCK = [{
  id: 1,
  title: 'Light',
  raisedSum: 40,
  totalSum: 500,
  backersCounter: 450,
  daysLeft: 28,
  type: 'EdTech',
  img: '',
  tiers: [{
    title: '',
    description: '',
    sum: 0
  }]
}, {
  id: 2,
  title: 'Light',
  raisedSum: 40,
  totalSum: 500,
  backersCounter: 450,
  daysLeft: 28,
  type: 'EdTech',
  img: ''
}, {
  id: 3,
  title: 'Light',
  raisedSum: 40,
  totalSum: 500,
  backersCounter: 450,
  daysLeft: 28,
  type: 'EdTech',
  img: ''
}]
</script>

<style scoped>

</style>
