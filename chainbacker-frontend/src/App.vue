<template>
  <div class="pb-[120px] pl-[28px] pr-[28px]">
    <router-view />
  </div>
  <Tabbar v-if="!isLoading" @on-open="openCreateModal" class="max-w-[768px] fixed z-[100] bottom-[20px]" />
  <Teleport to="body">
    <Dialog v-model:visible="isCreateModalOpened" modal header="Create project" :style="{ width: '25rem' }">
      <CreateModal @on-close="isCreateModalOpened = false"
                   :is-visible="isCreateModalOpened" />
    </Dialog>
    <Dialog v-model:visible="isTourModalOpened" modal :style="{ width: '25rem' }">
      <TourModal @on-close="isTourModalOpened = false"
                   :is-visible="isTourModalOpened" />
    </Dialog>
  </Teleport>
</template>

<script setup lang="ts">
import Tabbar from "@/components/Tabbar.vue";
import Dialog from 'primevue/dialog';
import { ref } from "vue";
import CreateModal from "@/components/modals/CreateModal.vue";

import { useWallet } from "@/composables/useWallet.ts";
import TourModal from "@/components/modals/TourModal.vue";
const { initUserWallet } = useWallet()

const isLoading = ref(true)

initUserWallet().finally(() => {
  isLoading.value = false
})

const isCreateModalOpened = ref(false)

const isTourModalOpened = ref(false)
const openCreateModal = () => {
  isCreateModalOpened.value = !isCreateModalOpened.value
}
</script>

<style scoped>

</style>
