<template>
  <div class="pb-[120px] mt-[20px] pl-[28px] pr-[28px]">
    <router-view />
  </div>
  <Tabbar class="fixed bottom-[20px]" />
</template>

<script setup lang="ts">
import Tabbar from "@/components/Tabbar.vue";
</script>

<style scoped>

</style>
