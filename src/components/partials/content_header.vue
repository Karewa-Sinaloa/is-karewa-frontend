<template>
	<div class="content-top">
		<div class="content-top__element">
			<button class="user-actions" @click.prevet="logOut">
				<span class="user-actions__text">Cerrar sesión</span>
				<span class="material-symbols-outlined user-actions__icon">logout</span>
			</button>
		</div>
	</div>
</template>

<script setup>
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

