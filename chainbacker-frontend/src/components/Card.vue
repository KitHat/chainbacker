<template>
  <Card class="card-container overflow-hidden">
    <template #header>
      <img class="w-full object-cover aspect-[4/3]" src="@/assets/images.jpeg" alt="title">
    </template>
    <template #title>
      {{ title }}
    </template>
    <template #subtitle>
      <span class="text-success-500">{{ subtitle }}</span> fund raised from <span class="text-success-500">{{ totalSum }}TON</span>
    </template>
    <template #footer>
      <ProgressBar class="mb-4" style="height: 10px" :value="meterValue">
        <span class="hidden">{{ meterValue ?? 0 }}</span>
      </ProgressBar>
      <div class="card-info flex gap-4 items-center justify-between">
        <Chip :label="type" />
        <p><span class="text-success-500">{{ daysLeft }}</span> days left</p>
      </div>
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

const meterValue = computed(() => props.raisedSum / props.totalSum * 100)
</script>

<style scoped>
.card-container {
  container-name: card-grid;
  container-type: inline-size;

@container card-grid (width < 200) {
  .card-info {
    display: block;
  }
}
}
</style>
