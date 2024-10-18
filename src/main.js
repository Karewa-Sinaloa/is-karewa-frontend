import { createPinia } from 'pinia'
//import { useAppStore } from './store/index.js'
import router from './router/index.js'
import { createApp } from 'vue'
import App from './App.vue'
import iconSet from "./components/partials/icons.vue"

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('iconSet', iconSet)
//const store = useAppStore()
app.mount('#app')

