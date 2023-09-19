<template>
	<h1>Hola Mundo!</h1>
	<button @click="logOut">Cerrar sesión</button>
</template>

<script setup>
import { ref } from 'vue'
import { userSession } from '../../helpers/set.session.js'
import { useRouter } from 'vue-router'

const router = useRouter()

function logOut() {
	new userSession().unSet().then(response => {
		if(response) {
			router.push({name: 'accessViewLogin'})
		}
	})
}

</script>

<style scoped>
</style>
