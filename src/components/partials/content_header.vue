<template>
	<div class="navbar bg-primary justify-content-end d-flex z-3">
		<div class="dropdown dropdown-end">
			<button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
				<i class="bi-person-circle fs-6"></i>
				Usuario
			</button>
			<ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
				<li>
					<button class="dropdown-item" @click.prevet="logOut">
						<span class="ff-headings">Cerrar sesión</span>
					</button>
				</li>
			</ul>	
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

