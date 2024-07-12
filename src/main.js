import router from './router/index.js'
import { useAppStore } from './store/index.js'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import iconSet from "./components/partials/icons.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.component('iconSet', iconSet)
//const store = useAppStore()
app.mount('#app')

