<template>
  <div class="pb-[120px] mt-[20px] pl-[28px] pr-[28px]">
    <router-view />
  </div>
  <Tabbar @on-open="openCreateModal" class="max-w-[768px] fixed bottom-[20px]" />
  <Teleport to="body">
    <Dialog v-model:visible="isCreateModalOpened" modal header="Create project" :style="{ width: '25rem' }">
      <CreateModal @on-close="isCreateModalOpened = false"
                   :is-visible="isCreateModalOpened" />
    </Dialog>
  </Teleport>
</template>

<script setup lang="ts">
import Tabbar from "@/components/Tabbar.vue";
import Dialog from 'primevue/dialog';
import { ref } from "vue";
import CreateModal from "@/components/modals/CreateModal.vue";

const isCreateModalOpened = ref(false)
const openCreateModal = () => {
  isCreateModalOpened.value = !isCreateModalOpened.value
}
</script>

<style scoped>

</style>
