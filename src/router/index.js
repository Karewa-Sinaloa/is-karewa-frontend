import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../store/index.js'

import HomeView from '../components/views/home.vue'
import AccessView from '../components/views/access.vue'
import accessViewLogin from '../components/partials/login.vue'
import accessViewRecovery from '../components/partials/recovery.vue'

const routes = [
	{
		path: '/',
		name: 'homeView',
		component: HomeView,
		meta: {
			login: true,
			component: 'homeView'
		}
	},
	{
		path: '/acceso/',
		component: AccessView,
		meta: {
			login: false,
			component: 'accessViewLogin'
		},
		children: [
			{
				path: "inicio-de-sesion",
				component: accessViewLogin,
				name: 'accessViewLogin'
			},
			{
				path: "olvide-mi-contrasena",
				component: accessViewRecovery,
				name: "accessViewRecovery"
			}
		]
	},
	{
		path: "/acceso/",
		redirect: "/acceso/inicio-de-sesion"
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior () {
		return {x: 0, y: 0}
	}
})

router.beforeEach((to) => {
	const store = useAppStore()
})

export default router
