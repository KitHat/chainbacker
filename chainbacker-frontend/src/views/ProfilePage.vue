<template>
  <section>
    <div class="relative mt-[-20px] mr-[-28px] ml-[-28px] mb-20 bg-gradient-to-l from-success-700 to-success-500">
      <img :style="{ width: 'calc(100% + 120px)' }" class="invisible block aspect-[16/9]" src="@/assets/images.jpeg" alt="">
      <img src="@/assets/images.jpeg" class="w-[120px] h-[120px] rounded-full border-4 absolute bottom-0 translate-y-1/2 right-1/2 translate-x-1/2" alt="" />
    </div>
    <section class="flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-4">Generous Detoner</h1>
      <div v-if="walletBalance"
           class="text-2xl font-semibold"
      >
        Balance: {{ walletBalance }}
      </div>
      <div v-else class="mb-8">
        <TonConnectButton />
      </div>
      <section class="mb-8">
        <h2 class="text-3xl font-bold mb-4">Your projects:</h2>
        <DataView data-key="launchedProjects" :value="projects.launchedProjects">
          <template #list="slotProps">
            <div class="flex flex-col">
              <router-link v-for="(item, index) in slotProps.items" :key="index" :to="{ name: 'ProjectPage', params: {  id: item.id }}" >
                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                  <div class="md:w-40 relative">
                    <img class="block xl:block mx-auto rounded w-full" :src="item.img" :alt="item.title" />
                  </div>
                  <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                      <div>
                        <Tag :value="item.type" severity="warning"></Tag>
                        <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>

              </router-link>
            </div>
          </template>
        </DataView>
      </section>
      <section>
        <h2 class="text-3xl font-bold mb-4">Your detonations:</h2>
        <DataView data-key="detonatedProjects" :value="projects.detonatedProjects">
          <template #list="slotProps">
            <div v-for="(item, index) in slotProps.items" :key="index">
              <router-link :to="{ name: 'ProjectPage', params: {  id: item.id }}" >
                <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4" :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                  <div class="md:w-40 relative">
                    <img class="block xl:block mx-auto rounded w-full" :src="item.img" :alt="item.title" />
                  </div>
                  <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                    <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                      <div>
                        <Tag :value="item.type" severity="warning"></Tag>
                        <div class="text-lg font-medium mt-2">{{ item.name }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </router-link>
            </div>
          </template>
        </DataView>
      </section>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useWallet } from "@/composables/useWallet.ts";
import { onBeforeMount, reactive } from "vue";
import { TonConnectButton } from "@townsquarelabs/ui-vue";
import DataView from 'primevue/dataview';
import Tag from 'primevue/tag';

const projects = reactive({
  launchedProjects: [
    {
      "id": 1,
      "title": "BelaBag. Converts your yoga mat into a stylish bag.",
      "description": "A unique way to carry your yoga mat, kit & essentials in one bag. With stretch goals for picnic blanket, sleeping bag & airbed versions",
      "img": "https://i.kickstarter.com/assets/047/017/107/29cb310d476e3f8ff605fad45ab83e99_original.png?fit=scale-down&origin=ugc&width=680&sig=3yX8nBeEi8uqTNSALL4%2F3saUQPvwzMe2kBA5Sej9fbM%3D",
      "type": "Technology & Gadgets",
      "totalSum": 500,
      "raisedSum": 400,
      "expirationDate": 1731657672,
      "severity": "warn",
      "tiers": [
        {
          "title": "1 BelaBag",
          "description": "- Choose from 3 colours before the campaign ends.",
          "price": 11
        },
        {
          "title": "2 BelaBagw",
          "description": "- Choose from 3 colours before the campaign ends.",
          "price": 20
        },
        {
          "title": "Full Bundle",
          "description": "BelaBag, Card Holder & Laptop Case",
          "price": 30
        }
      ]
    },
  ],
  detonatedProjects: [
    {
      "id": 2,
      "title": "Paws and Leaves – A Last Tale",
      "description": "Join a fox 🦊 finding his memories on his last journey and experience a touching, emotional tale.",
      "img": "https://i.kickstarter.com/assets/046/813/787/2919509e11a45ea39f196b1eb643ef0d_original.png?fit=scale-down&origin=ugc&width=680&sig=fhj3%2FZoq4WOfborGcPSfGb3MKU%2BPdmWeqshWSrrJqh0%3D",
      "type": "Games (Board Games, Video Games)",
      "totalSum": 1000,
      "raisedSum": 200,
      "expirationDate": 1734163272,
      "severity": "success",
      "tiers": [
        {
          "title": "Copy of the game",
          "description": "Support us and receive a copy of the game",
          "price": 4
        },
        {
          "title": "Full Pack: Game + OST + Art Pack",
          "description": "Get an OST and arts from the game! You can use the OST and Art like you have a license",
          "price": 8
        },
        {
          "title": "Big Support!",
          "description": "Get everything from previous levels, and get mentioned in titles! Thank you!",
          "price": 20
        }
      ]
    },
    {
      "id": 3,
      "title": "🎄✨ Chibi Santa Senshi Enamel Pin Collection ✨🎄",
      "description": "Celebrate the Season with Sailor Senshi in Santa Suits!",
      "img": "https://i.kickstarter.com/assets/046/884/810/04556a878b4f31262b236fd5a8188fa1_original.jpg?origin=ugc&q=80&width=600&sig=TyVkBaJCkZflWkG65h%2FLrYy9lDHj%2BT9Y2J2rOKsfQBs%3D",
      "type": "Art & Design",
      "totalSum": 100,
      "raisedSum": 300,
      "severity": "success",
      "expirationDate": 1731657672,
      "tiers": [
        {
          "title": "💜Waterproof Sticker Pack💜",
          "description": "❀ You will receive 7 die-cut 5.5cms Vinyl stickers (one of each design)!",
          "price": 1.5
        },
        {
          "title": "💜11cm Holo effect Acrylic Standee💜",
          "description": "🌟You will receive 1, 11cm Holo effect Acrylic Standee🌟 you can choose the style at the end of the campaign.",
          "price": 2.5
        },
        {
          "title": "💜Acrylic Keychain💜",
          "description": "🌟You will receive 1, Acrylic Keychain🌟",
          "price": 2.5
        }
      ]
    }
  ]
})

const { walletBalance, getBalance } = useWallet()

onBeforeMount(() => {
  getBalance()
})
</script>

<style scoped>

</style>
