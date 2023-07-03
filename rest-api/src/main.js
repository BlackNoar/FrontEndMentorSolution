import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { MotionPlugin } from '@vueuse/motion'
const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.use(MotionPlugin)
app.mount('#app')