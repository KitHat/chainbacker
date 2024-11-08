import { createMemoryHistory, createRouter } from 'vue-router'

import MainPage from '@/views/MainPage.vue'
import ProjectPage from '@/views/ProjectPage.vue'

const routes = [
  { path: '/', component: MainPage, name: 'MainPage' },
  { path: '/project/:id', component: ProjectPage, name: 'ProjectPage' }
]

export const APP_ROUTER = createRouter({
  history: createMemoryHistory(),
  routes,
})
