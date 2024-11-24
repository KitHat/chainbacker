<template>
  <section class="w-full pl-4 pr-4">
    <section class="mb-1 flex w-full justify-center items-center">
      <Badge severity="warn" value="TESTNET"></Badge>
    </section>
    <Toolbar style="border-radius: 3rem; padding: 1rem 1.5rem 1rem 1.5rem" class="border-2 border-blue-900">
      <template #start>
        <router-link :to="{ name: 'MainPage' }">
          <HomeIcon class="w-[32px]" />
        </router-link>
      </template>
      <template #center>
        <CreateButton class="w-[56px]" @click="$emit('on-open')" />
      </template>
      <template #end>
        <router-link :to="{ name: 'ProfilePage' }">
          <ProfileIcon class="w-[32px] h-[32px] text-white"/>
        </router-link>
      </template>
    </Toolbar>
  </section>
</template>

<script setup lang="ts">
import Toolbar from "primevue/toolbar"
import HomeIcon from "@/components/icons/HomeIcon.vue";
import ProfileIcon from "@/components/icons/ProfileIcon.vue";
import CreateButton from "@/components/icons/CreateButton.vue";
import Badge from 'primevue/badge';
</script>

<style scoped>

</style>
