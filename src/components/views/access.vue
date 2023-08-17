<script setup>
import { ref, onMounted } from 'vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { api } from '../../api/requests.js'

const loginForm = ref(null)
onMounted(() => console.log(loginForm.value.outerHTML))

let loginValidateSchema = yup.object().shape({
	password: yup.string().required().min(8).label('contraseña'),
	email: yup.string().required().email().label('correo electrónico')
})
function onSubmit(values) {
	let req = new api()
	req.Post({
		'module': 'access/login',
		'data': values
	}).then(response => {
		console.log(response)
	}).catch(error => {
		if(error.status === 400) {
			let errors = setFieldMessages(error.data.errors)
			this.$refs.loginForm.setErrors(errors)
		}
	})
}
</script>

<template>
	<div class="access">
		<div class="access__column access__column--left">
			<div class="access__hub">
				<h2 class="access__subtitle">Bienvenido de vuelta a CFDI APP</h2>
				<span class="access__welcome">Accede con tu correo electrónico y contraseña, son no estas registrado obten una prueba gratuita registrandote ahora!</span>
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

						<input class="form__submit btn btn__default btn--regular" type="submit" value="Iniciar sesión" />
					</fieldset>
				</Form>
			</div>
		</div>
		<div class="access__column access__column--right desktop-view"></div>
	</div>
</template>

<style lang="sass">
	@import "../../assets/sass/components/_access.sass"
</style>
