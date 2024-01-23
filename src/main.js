import router from './router/index.js'
import { useAppStore } from './store/index.js'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import * as bootstrap from 'bootstrap'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
//const store = useAppStore()
app.mount('#app')

