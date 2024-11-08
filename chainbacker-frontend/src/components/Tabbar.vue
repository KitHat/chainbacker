<template>
  <section class="w-full pl-4 pr-4">
    <Toolbar style="border-radius: 3rem; padding: 1rem 1.5rem 1rem 1.5rem" class="border-2 border-blue-900">
      <template #start>
        <router-link :to="{ name: 'MainPage' }">
          <HomeIcon class="w-[32px]" />
        </router-link>
      </template>
      <template #center>
      </template>
      <template #end>
        <ProfileIcon class="w-[32px] text-white"/>
      </template>
    </Toolbar>
  </section>
</template>

<script setup lang="ts">
import Toolbar from "primevue/toolbar"
import HomeIcon from "@/components/icons/HomeIcon.vue";
import ProfileIcon from "@/components/icons/ProfileIcon.vue";
</script>

<style scoped>

</style>
