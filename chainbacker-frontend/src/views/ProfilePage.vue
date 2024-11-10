<template>
  <section>
    <div class="relative mt-[-20px] mr-[-28px] ml-[-28px] mb-20 bg-gradient-to-l from-success-700 to-success-500">
      <img :style="{ width: 'calc(100% + 120px)' }" class="invisible block aspect-[16/9]" src="@/assets/images.jpeg" alt="">
      <img src="@/assets/images.jpeg" class="w-[120px] h-[120px] rounded-full border-4 absolute bottom-0 translate-y-1/2 right-1/2 translate-x-1/2" alt="" />
    </div>
    <section class="flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4">User name</h1>
      <div v-if="walletBalance"
           class="text-2xl font-semibold"
      >
        Balance: {{ walletBalance }}
      </div>
      <div v-else>
        <TonConnectButton />
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useWallet } from "@/composables/useWallet.ts";
import {onBeforeMount} from "vue";
import {TonConnectButton} from "@townsquarelabs/ui-vue";

const { walletBalance, getBalance } = useWallet()

onBeforeMount(() => {
  getBalance()
})
</script>

<style scoped>

</style>
