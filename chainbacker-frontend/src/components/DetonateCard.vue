<template>
  <Card class="card-container overflow-hidden">
    <template #header>
      <div class="w-full relative">
        <img class="w-full object-cover aspect-[3/3]" src="@/assets/images.jpeg" alt="title">
        <div class="card-progress-bar">
          <ProgressBar class="card-progress-bar__animation absolute -rotate-90 top-0 w-full" style="height: 10px" :value="meterValue">
            <span class="hidden">{{ meterValue ?? 0 }}</span>
          </ProgressBar>
        </div>
      </div>
    </template>
    <template #content>
      <p class="text-lg font-bold mb-2">{{ title }}</p>
      <p class="text-sm mb-1">
        Remains <span class="text-success-500">{{ remainSum }} TON </span>
      </p>
      <p><span class="text-success-500">{{ daysLeft }}</span> days left</p>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";

import { computed } from "vue";
import Chip from "primevue/chip";
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

const subtitle = computed(() => `${props.raisedSum || 0} TON`)

const remainSum = computed(() => props.totalSum - props.raisedSum)

const meterValue = computed(() => props.raisedSum / props.totalSum * 100)
</script>

<style scoped>
.card-progress-bar {
  position: absolute !important;
  width: calc(100% - 20px);
  top: 50%;
  left: 50%;
}

@keyframes skew-y-shakeng{
  0% { transform: skewX(-90deg); }
  44% { transform: skewX(-75deg); }
  48% { transform: skewX(75deg); }
  52% { transform: skewX(-90deg); }
  100% { transform: skewX(-90deg); }
}
</style>
