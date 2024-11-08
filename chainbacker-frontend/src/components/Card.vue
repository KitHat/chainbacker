<template>
  <Card class="overflow-hidden">
    <template #header>
      <img class="w-full object-cover aspect-[4/3]" src="@/assets/images.jpeg" alt="title">
    </template>
    <template #title>
      {{ title }}
    </template>
    <template #subtitle>
      <span class="text-success-500">{{ subtitle }}</span> fund raised from {{ totalSum }}
    </template>
    <template #footer>
      <ProgressBar class="mb-4" style="height: 10px" :value="meterValue">
        <template #default="{ value }">
          <span class="hidden">{{ value }}</span>
        </template>
      </ProgressBar>
      <div class="flex gap-4 items-center">
        <Chip :label="type" />
        <p><span class="text-success-500">{{ daysLeft }}</span> days left</p>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import MeterGroup from 'primevue/metergroup';

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

const subtitle = computed(() => `${props.raisedSum || 0}`)

const meterValue = computed(() => props.raisedSum / props.totalSum * 100)
</script>

<style scoped>

</style>
