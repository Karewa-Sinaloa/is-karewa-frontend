<template>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '../../store/index.js'
import { apiRequest } from '../../api/requests.js'

const route = useRoute()
const router = useRouter()
const store = useAppStore()
const routerQuery = ref(null)

store.loading(true)

onMounted(() => {
	if(route.query.h && route.query.e) {
		let hash_string = decodeURI(route.query.h)
		let email = atob(route.query.e)
		new apiRequest().Post({
			module: 'access/user-validation',
			data: {
				'email': email,
				'hash_string': hash_string
			}
		}).then(response => {
			store.loading(false)
			store.showPopup({
				type: "close",
				title: "Cuenta verificada",
				text: "¡Hemos verificado tu cuenta! Ya puedes ingresar con tu correo y contraseña, recuerda que tienes 5 creditos gratuidos para poder utilizarlos en en sistema y así probar las funcionalidades.",
				button_text: "ENTERADO",
				icon: "verified.png"
			})
			router.push({name: 'accessViewLogin'})
		}).catch(error => {
			store.loading(false)
			store.push_alert(error.data)
			router.push({name: 'accessViewLogin'})
		})
	} else {
		router.push({name: 'accessViewLogin'})
		store.set_alert({
			code: 'ACCESS005'
		})
	}
})
</script>
