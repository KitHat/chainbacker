import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@twa-dev/sdk';
import PrimeVue from 'primevue/config';
import Lara from '@primevue/themes/lara';

import { APP_ROUTER } from "./router.ts";

createApp(App).use(PrimeVue,  {
     theme: {
         preset: Lara,
             options: {
             darkModeSelector: 'system',
             cssLayer: false
         }
     }
 }).use(APP_ROUTER).mount('#app')


