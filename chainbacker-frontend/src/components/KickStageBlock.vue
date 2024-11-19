<template>
  <section>
    <div v-if="currentProject.stage === KickStage.Active">
      <Button fluid @click="onClick">Detonate Now</Button>
      <Dialog v-model:visible="isDonateModalOpened" modal header="Choose tier" :style="{ width: '25rem' }">
        <DonateModal @on-close="isDonateModalOpened = false"
                     :is-visible="isDonateModalOpened"
                     :tiers="props.currentProject.tiers"
        />
      </Dialog>
    </div>
  </section>
</template>

<script setup lang="ts">
import { KickStage } from "@/constants/kick.ts";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import DonateModal from "@/components/modals/DonateModal.vue";
import { ref } from "vue";

const props = defineProps<{ currentProject: any }>()

const isDonateModalOpened = ref(false)
const onClick = () => {
  isDonateModalOpened.value = true
}
</script>
