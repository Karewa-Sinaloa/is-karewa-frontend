<template>
	<h2 class="ff-headings text-center fs-4 fw-bold text-light">Bienvenido de vuelta a CFDI APP</h2>
	<span class="ff-content fw-light text-center d-block fs-6 text-light">Accede con tu correo electrónico y contraseña, si no estas registrado obtén una prueba gratuita registrándote ahora!</span>
	<Form class="mt-4" @Submit="onSubmit" :validation-schema="loginValidateSchema" ref="loginForm">
		<fieldset class="container">
			<div class="mb-1">
				<label class="form-label ff-headings text-light m-auto fw-light fs-small" for="email">Correo electrónico</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-envelope-fill fs-regular"></i>
					</span>
					<Field class="form-control" type="email" name="email" placeholder="usuario@dominio.tld"/>
				</div>
				<ErrorMessage name="email" class="p-1 d-block text-warning mt-1 fs-small ff-content" data-field="email"/>
			</div>

			<div class="mb-1">
				<label class="form-label ff-headings m-auto text-light fw-light fs-small" for="password">Contraseña</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-key-fill fs-regular"></i>
					</span>
					<Field class="form-control" type="password" name="password" id="password" placeholder="************" />
				</div>
				<ErrorMessage name="password" class="p-1 d-block text-warning mt-1 fs-small ff-content" data-field="password"/>
			</div>

			<router-link class="btn btn-link btn-sm text-light float-end ff-content" :to="{name: 'accessViewRecovery'}">¡Olvide mi contraseña!</router-link>

			<input class="btn btn-warning col-12 mb-1 mt-1 ff-headings" type="submit" value="Iniciar sesión" />
		</fieldset>
	</Form>
	<router-link class="btn btn-link btn-sm m-auto d-table text-light ff-content" :to="{name: 'accessViewRegistration'}">¿No tienes una cuenta?, ¡créala ahora!</router-link>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import { useAppStore } from '../../store/index.js'
import { userSession } from '../../helpers/set.session.js'
import { useRouter } from 'vue-router'

const loginForm = ref(null)
const store = useAppStore()
const router = useRouter()

const loginValidateSchema = yup.object().shape({
	password: yup.string().required().min(8).label('contraseña'),
	email: yup.string().required().email().label('correo electrónico')
})

function onSubmit(values) {
	new apiRequest().Post({
		'module': 'access/login',
		'data': values
	}).then(response => {
		loginForm.value.resetForm()
		new userSession().set(response.data.data.bearer).then(() => {
			store.push_alert(response.data)
			router.push({name: 'homeView'})
		}).catch(() => {
			store.push_alert({code: 'SERVER-ERROR'})
		})
	}).catch(error => {
		if(error.status === 400) {
			let errors = setFieldMessages(error.data.errors)
			this.$refs.loginForm.setErrors(errors)
		} else {
			store.push_alert(error.data)
		}
	})
}
</script>
