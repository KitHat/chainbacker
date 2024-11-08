<template>
  <section>
    <div class="mt-[-20px] mr-[-28px] ml-[-28px]">
      <img :style="{ width: 'calc(100% + 120px)' }" class="block aspect-[4/3]  mb-2" src="@/assets/images.jpeg" alt="">
    </div>
    <p class="mb-5 p-card-title">{{ PROJECT_MOCK.title }}</p>
    <section class="mb-5 flex justify-between">
      <div>
        <p class="p-card-subtitle">Raised so far</p>
        <p class="text-2xl font-bold text-success-500">{{  PROJECT_MOCK.raisedSum }} <span class="text-lg">{{ progress }}%</span> </p>
      </div>
      <div>
        <p class="p-card-subtitle font-bold">Raised so far</p>
        <p class="text-2xl font-bold text-success-100">{{  PROJECT_MOCK.totalSum }}</p>
      </div>
    </section>
    <ProgressBar class="mb-4" style="height: 10px" :value="progress">
      <span class="hidden">{{ progress }}</span>
    </ProgressBar>
    <section class="mb-5 flex justify-between">
      <Chip :label="PROJECT_MOCK.type"></Chip>
      <div class="flex items-center gap-1">
        <ClockIcon class="w-[18px]" />
        <p><span class="text-success-500">{{ PROJECT_MOCK.daysLeft }}</span> days left</p>
      </div>
    </section>
    <Fluid class="mb-1">
      <Button>Donate Now</Button>
    </Fluid>
    <section class="mr-[-28px] ml-[-28px]">
      <Divider></Divider>
    </section>
    <h2 class="text-2xl font-bold mb-2">
      Description
    </h2>
    <p class="p-card-subtitle">
      Lorem ipsum dolor sit amet consectetur. Pharetra odio dictumst lacus ipsum. Quis aliquam orci pulvinar eu elementum mauris vivamus... Read more
    </p>
  </section>
</template>

<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import Chip from "primevue/chip";
import ClockIcon from "@/components/icons/ClockIcon.vue";
import Button from "primevue/button";
import Fluid from "primevue/fluid";
import {Divider} from "primevue";
import {computed} from "vue";

const PROJECT_MOCK = {
  id: 1,
  image: '',
  title: 'Light',
  raisedSum: 40,
  totalSum: 500,
  backersCounter: 450,
  daysLeft: 28,
  type: 'EdTech',
  description: 'Lorem ipsum dolor sit amet consectetur. Pharetra odio dictumst lacus ipsum. Quis aliquam orci pulvinar eu elementum mauris vivamus... Read more'
}

const progress = computed(() => (PROJECT_MOCK.raisedSum / PROJECT_MOCK.totalSum) * 100)
</script>

<style scoped>

</style>
