<template>
  <section>
    <div class="mt-[-20px] mr-[-28px] ml-[-28px] relative">
      <img :style="{ width: 'calc(100% + 120px)' }" class="block aspect-[4/3]  mb-2 absolute top-0 left-0 invisible" src="@/assets/images.jpeg" alt="">
      <img :style="{ width: 'calc(100% + 120px)' }" class="block aspect-[4/3]  mb-2" :src="currentProject.img" alt="">
    </div>
    <p class="mb-5 p-card-title">{{ currentProject.title }}</p>
    <section class="mb-5 flex justify-between">
      <div>
        <p class="p-card-subtitle">Raised so far</p>
        <p v-if="'raisedSum' in currentProject" class="text-2xl font-bold text-success-500">{{  currentProject.raisedSum }} TON <span class="text-lg">{{ Math.round(progress) }}%</span> </p>
      </div>
      <div>
        <p class="p-card-subtitle font-bold">Target</p>
        <p v-if="'totalSum' in currentProject" class="text-2xl font-bold text-success-100">{{  currentProject.totalSum }} TON</p>
      </div>
    </section>
    <ProgressBar class="mb-4" style="height: 10px" :value="progress">
      <span class="hidden">{{ progress }}</span>
    </ProgressBar>
    <section class="mb-5 flex justify-between">
      <Chip :label="currentProject.type"></Chip>
      <div v-if="'daysLeft' in currentProject" class="flex items-center gap-1">
        <ClockIcon class="w-[18px]" />
        <p><span class="text-success-500">{{ currentProject.daysLeft }}</span> days left</p>
      </div>
    </section>
    <KickStageBlock class="mb-1"
                    :currentProject="currentProject"
    />
    <section class="mr-[-28px] ml-[-28px]">
      <Divider></Divider>
    </section>
    <div class="mb-5">
      <h2 class="text-2xl font-bold mb-2">
        Description
      </h2>
      <p class="p-card-subtitle">
        {{ currentProject.description }}
      </p>
    </div>
    <section class="mr-[-28px] ml-[-28px] mb-8">
      <Divider></Divider>
    </section>
    <section>
      <h2 class="text-2xl font-bold mb-1">
        Tiers
      </h2>
      <section>
        <DataTable :value="currentProject.tiers">
          <Column field="title"></Column>
          <Column field="description"></Column>
          <Column field="price"></Column>
        </DataTable>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import ProgressBar from 'primevue/progressbar';
import Chip from "primevue/chip";
import ClockIcon from "@/components/icons/ClockIcon.vue";
import {Divider} from "primevue";
import {computed, ref} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { CARDS_MOCK } from "@/mocks/mocks.ts";
import { useRoute } from "vue-router";
import KickStageBlock from "@/components/KickStageBlock.vue";

const route = useRoute()

const currentProject = ref(CARDS_MOCK.find(item => item.id === Number(route.params.id)) as typeof CARDS_MOCK[0])

const progress = computed(() => (currentProject.value.raisedSum / currentProject.value.totalSum) * 100)
</script>

<style scoped>

</style>
