import { createPinia } from 'pinia'
import { useAppStore } from './store/index.js'
import router from './router/index.js'
import { createApp } from 'vue'
import App from './App.vue'
import iconSet from "./components/partials/icons.vue"

const pinia = createPinia()
const app = createApp(App)
const appStore = useAppStore(pinia)
app.use(pinia)
app.use(appStore)
app.use(router)
app.component('iconSet', iconSet)
app.config.globalProperties.$debug = import.meta.env.VITE_DEBUG
app.mount('#app')

