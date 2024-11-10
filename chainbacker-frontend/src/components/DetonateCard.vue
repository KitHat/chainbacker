<template>
  <Card class="card-container overflow-hidden">
    <template #header>
      <div class="w-full relative">
        <div class="card-progress-bar">
          <ProgressBar class="z-20card-progress-bar__animation absolute -rotate-90 top-0 w-full" style="height: 10px" :value="meterValue">
            <span class="hidden">{{ meterValue ?? 0 }}</span>
          </ProgressBar>
        </div>
        <section class="relative">
          <img class="w-full object-cover aspect-[3/3] invisible" src="@/assets/images.jpeg" alt="title">
          <img class="absolute top-0 left-0 z-10 h-full w-full object-cover aspect-[4/3]" :src="img" alt="title">
        </section>
      </div>
    </template>
    <template #content>
      <p class="text-lg font-bold mb-2 text-ellipsis overflow-hidden max-h-[32px]">{{ title }}</p>
      <p class="text-sm mb-1">
        <span v-if="props.totalSum - props.raisedSum > 0">Remains <span class="text-success-500">{{ remainSum }} TON </span></span>
        <span v-else>Over <span class="text-success-500">{{ remainSum }} TON </span></span>
      </p>
      <p><span class="text-success-500">{{ daysLeft }}</span> days left</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";

import { computed } from "vue";
import ProgressBar from "primevue/progressbar";

const props = defineProps<{
  id: number
  img: string
  title: string
  raisedSum: number
  totalSum: number
  backersCounter: number
  daysLeft: number
  type: string
}>()

const remainSum = computed(() => props.totalSum - props.raisedSum > 0 ? props.totalSum - props.raisedSum : props.raisedSum - props.totalSum)

const meterValue = computed(() => props.raisedSum / props.totalSum * 100)
</script>

<style scoped>
.card-progress-bar {
  position: absolute !important;
  width: calc(100% - 20px);
  top: 50%;
  left: 50%;
  z-index: 50;
}

@keyframes skew-y-shakeng{
  0% { transform: skewX(-90deg); }
  44% { transform: skewX(-75deg); }
  48% { transform: skewX(75deg); }
  52% { transform: skewX(-90deg); }
  100% { transform: skewX(-90deg); }
}
</style>
