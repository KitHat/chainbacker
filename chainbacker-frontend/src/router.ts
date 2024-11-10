import { createMemoryHistory, createRouter } from 'vue-router'

import MainPage from '@/views/MainPage.vue'
import ProjectPage from '@/views/ProjectPage.vue'
import ProfilePage from "@/views/ProfilePage.vue";

const routes = [
  { path: '/', component: MainPage, name: 'MainPage' },
  { path: '/project/:id', component: ProjectPage, name: 'ProjectPage' },
  { path: '/profile', component: ProfilePage, name: 'ProfilePage' },
]

export const APP_ROUTER = createRouter({
  history: createMemoryHistory(),
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
  routes,
})
