import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../components/views/home.vue'
import AccessView from '../components/views/access.vue'

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
		path: '/access/',
		component: AccessView,
		name: 'accesView',
		meta: {
			login: false,
			component: 'accessView'
		}
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior () {
		return {x: 0, y: 0}
	}
})

export default router
