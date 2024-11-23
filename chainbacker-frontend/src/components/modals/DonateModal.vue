<template>
  <div>
    <div class="flex justify-between items-center" v-for="(tier, index) in tiers" :key="index">
      <div class="mb-2">
        <h2 class="text-xl font-bold">
          {{ tier.title }}
        </h2>
        <p>
          {{ tier.description }}
        </p>
      </div>
      <RadioButton :value="tier" v-model="currentTier"></RadioButton>
    </div>
    <section class="mt-4">
      <Button :disabled="!currentTier" class="mb-2" fluid @click="onSubmit">{{ sendButtonTitle }}</Button>
      <Button severity="secondary" fluid @click="$emit('on-close')">Close</Button>
    </section>
  </div>
  <Toast />
</template>

<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'
import {computed, ref} from "vue";
import Toast from "primevue/toast";
import Button from "primevue/button";
import {KickTier} from "@/types/types.ts";
import {useSendTransaction} from "@/composables/useSendTransaction.ts";

defineProps<{ tiers: KickTier[] }>()

const { sendBack } = useSendTransaction()

const currentTier = ref<KickTier | null >(null)

const sendButtonTitle = computed(() => currentTier.value ? `You send ${currentTier.value.price} USDT` : 'Choose tier')

const emit = defineEmits(['on-close'])
const onSubmit = async () => {
  sendBack()

  emit('on-close')
}
</script>

<style scoped>
</style>
