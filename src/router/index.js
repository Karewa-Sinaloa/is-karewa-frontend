import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../store/index.js'
import { userSession } from '../helpers/set.session.js'

import HomeView from '../components/views/home.vue'
import AccessView from '../components/views/access.vue'
import accessViewLogin from '../components/partials/login.vue'
import accessViewRecovery from '../components/partials/recovery.vue'
import accessViewReset from '../components/partials/reset.vue'
import accessViewRegistration from '../components/partials/registration.vue'
import accessViewValidation from '../components/partials/verification.vue'
import OrganizationView from '../components/views/organization.vue'
import ProveedoresView from '../components/views/proveedores/view.vue'
import ProveedoresList from '../components/views/proveedores/list.vue'

const routes = [
	{
		path: '/',
		name: 'homeView',
		component: HomeView,
		meta: {
			login: true
		}
	},{
		path: '/organizacion/mi-organizacion',
		component: OrganizationView,
		name: 'organizationView',
		meta: {
			login: true
		}
	},{
		path: '/proveedores/nuevo',
		component: ProveedoresView,
		name: 'proveedoresCreate',
		meta: {
			login: true
		}
	},{
		path: '/proveedores/:id',
		component: ProveedoresView,
		name: 'proveedoresView',
		meta: {
			login: true
		}
	},{
		path: '/proveedores',
		component: ProveedoresList,
		name: 'proveedoresList',
		meta: {
			login: true
		}
	},{
		path: '/acceso/',
		component: AccessView,
		meta: {
			login: false,
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
			},
			{
				path: "cambiar-contrasena",
				component: accessViewReset,
				name: "accessViewReset"
			},
			{
				path: 'crear-cuenta',
				component: accessViewRegistration,
				name: 'accessViewRegistration'
			},
			{
				path: 'verificacion-de-usuario',
				component: accessViewValidation,
				name: 'accessViewValidation'
			}
		]
	},{
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

router.beforeEach((to, from, next) => {
	const store = useAppStore()
	const session = new userSession()
	let auth = session.verify()
	if(to.meta.login && auth) {
		next()
	} else if(['accessViewLogin', 'accessViewRecovery', 'accessViewReset'].indexOf(to.name) != -1 && auth) {
		next({name: 'homeView'})
	} else if(!auth && to.meta.login) {
		next({name: 'accessViewLogin'})
	} else {
		next()
	}
})

export default router
