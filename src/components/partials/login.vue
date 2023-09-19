<template>
	<h2 class="access__subtitle">Bienvenido de vuelta a CFDI APP</h2>
	<span class="access__welcome">Accede con tu correo electrónico y contraseña, si no estas registrado obtén una prueba gratuita registrándote ahora!</span>
	<Form class="form" @Submit="onSubmit" :validation-schema="loginValidateSchema" ref="loginForm">
		<fieldset class="form__fieldset">
			<div class="form__container">
				<label class="form__label" for="email">Correo electrónico</label>
				<Field class="form__input form__input--email" type="email" name="email" placeholder="usuario@dominio.tld"/>
				<ErrorMessage name="email" class="form__alert" data-field="email"/>
			</div>

			<div class="form__container">
				<label class="form__label" for="password">Contraseña</label>
				<Field class="form__input form__input--password" type="password" name="password" id="password" placeholder="************" />
				<ErrorMessage name="password" class="form__alert" data-field="password"/>
			</div>

			<router-link class="access__form-link" :to="{name: 'accessViewRecovery'}">¡Olvide mi contraseña!</router-link>

			<input class="form__submit btn btn__default btn--regular" type="submit" value="Iniciar sesión" />
		</fieldset>
	</Form>
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
		new userSession().set(response.data.data.bearer)
		store.push_alert(response.data)
		router.push({name: 'homeView'})
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
