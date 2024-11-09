import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@twa-dev/sdk';
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';

import { APP_ROUTER } from "./router.ts";
import { useWallet } from "@/composables/useWallet.ts";
import { TonConnectUIPlugin } from '@townsquarelabs/ui-vue'
import {MANIFEST_URL_MOCK} from "@/mocks/mocks.ts";
const { initUserWallet } = useWallet()

createApp(App).use(PrimeVue,  {
     theme: {
         preset: Lara,
             options: {
             darkModeSelector: '.my-app-dark',
             cssLayer: false
         }
     }
 }).use(TonConnectUIPlugin,{ manifestUrl: MANIFEST_URL_MOCK }).use(APP_ROUTER).mount('#app')

initUserWallet()



