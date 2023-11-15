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
import NewCompanyView from '../components/views/new_company.vue'
import CompanyView from '../components/views/company.vue'
import CustomerView from '../components/views/customer.vue'
import CustomerListView from '../components/views/customer_list.vue'

const routes = [
	{
		path: '/',
		name: 'homeView',
		component: HomeView,
		meta: {
			login: true
		}
	},
	{
		path: '/empresas/nueva-empresa',
		component: NewCompanyView,
		name: 'newCompanyView',
		meta: {
			login: true
		}
	},
	{
		path: '/empresas/mi-empresa',
		component: CompanyView,
		name: 'companyView',
		meta: {
			login: true
		}
	},
	{
		path: '/clientes/nuevo-cliente',
		component: CustomerView,
		name: 'newCustomerView',
		meta: {
			login: true
		}
	},
	{
		path: '/clientes/:id(\\d+)',
		component: CustomerView,
		name: 'customerView',
		meta: {
			login: true
		}
	},
	{
		path: '/clientes/p/:page(\\d+)?',
		component: CustomerListView,
		name: 'customerListPaginateView',
		meta: {
			login: true
		}
	},
	{
		path: '/clientes',
		component: CustomerListView,
		name: 'customerListView',
		meta: {
			login: true
		}
	},
	{
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
