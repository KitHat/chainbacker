<template>
  <section class="flex gap-2 justify-between">
    <section>
      <div v-for="(active, index) in MOST_ACTIVE_PROJECTS_MOCK"
           :key="index"
           class="flex items-center gap-2 mb-2"
      >
        <Avatar :image="active.image" size="large" shape="circle"></Avatar>
        <div>
          <p class="text-lg">{{ active.title }}</p>
          <div class="flex gap-1 items-center">
            <ArrowIcon class="text-success-500" />
            <p class="text-sm font-light text-success-500">{{ active.totalSum }} TON</p>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div v-for="(active, index) in MOST_ACTIVE_PROJECTS_MOCK"
           :key="index"
           class="flex items-center gap-2 mb-2"
      >
        <Avatar :image="active.image" size="large" shape="circle"></Avatar>
        <div>
          <p class="text-lg">{{ active.title }}</p>
          <div class="flex gap-1 items-center">
            <ArrowIcon class="text-success-500" />
            <p class="text-sm font-light text-success-500">{{ active.totalSum }} TON</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import Avatar from "primevue/avatar"
import {MOST_ACTIVE_PROJECTS_MOCK} from "@/mocks/mocks.ts";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";

</script>

<style scoped>

</style>
