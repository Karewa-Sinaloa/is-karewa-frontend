<template>
	<h2 class="access__subtitle">Crear nueva cuenta</h2>
	<span class="access__welcome">Gracias por optar por Monitor Karewa. Esta cuenta será tu cuenta principal, desde la misma podrás crear una o más empresas para facturar. Una vez registrado podrás continuar con la configuración de tu empresa.</span>
	<Form class="form" @Submit="onSubmit" :validation-schema="registrationValidateSchema" ref="registrationForm" v-slot="{setErrors, handleSubmit, values, validate}">
		<fieldset class="form__fieldset">
			<div class="form__container">
				<label class="form__label form__label--inverted" for="first_name">Nombre(s)</label>
				<Field class="form__input form__input--access form__input--inverted" type="text" name="first_name" placeholder="Nombre(s)"/>
				<ErrorMessage name="first_name" class="form__alert" data-field="first_name"/>
			</div>

			<div class="form__container">
				<label class="form__label form__label--inverted" for="last_name">Apellido(s)</label>
				<Field class="form__input form__input--inverted form__input--access" type="text" name="last_name" placeholder="Apellido(s)"/>
				<ErrorMessage name="last_name" class="form__alert" data-field="last_name"/>
			</div>

			<div class="form__container">
				<label class="form__label form__label--inverted" for="email">Correo electrónico</label>
				<Field class="form__input form__input--inverted form__input--access form__input form__input--inverted--email" type="email" name="email" placeholder="usuario@dominio.tld"/>
				<ErrorMessage name="email" class="form__alert" data-field="email"/>
			</div>

			<div class="form__container">
				<label class="form__label form__label--inverted" for="password">Contraseña</label>
				<Field class="form__input form__input--inverted form__input--access form__input form__input--inverted--password" type="password" name="password" id="password" placeholder="************" />
				<ErrorMessage name="password" class="form__alert" data-field="password"/>
			</div>

			<div class="form__container">
				<label class="form__label form__label--inverted" for="repeat_password">Repetir contraseña</label>
				<Field class="form__input form__input--inverted form__input form__input--access form__input--inverted--password" type="password" name="repeat_password" id="repeat_password" placeholder="************" />
			</div>

			<Field type="hidden" name="hcaptcha_data" v-model="hcaptchaData"/>
			<Field type="hidden" name="verification_url" v-model="userVerificationUrl"/>

			<hcaptcha-component v-if="showCaptcha" @hideCaptcha="showCaptcha = false" @releaseForm="(string) => {hcaptchaData = string, handleSubmit(onSubmit)}"></hcaptcha-component>

			<router-link class="access__form-link" :to="{name: 'accessViewLogin'}">Iniciar sesión con mi cuenta</router-link>

			<input class="form__submit btn btn__default btn--regular btn__default--warning" type="submit" value="Crear cuenta ahora" @click.prevent="validate().then(r => validateForm(r))"/>
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
import { useRouter } from 'vue-router'
import hcaptchaComponent from './hcaptcha.vue'

const registrationForm = ref(null)
const store = useAppStore()
const router = useRouter()
const hcaptchaData = ref(null)
const showCaptcha = ref(false)
const userVerificationUrl = import.meta.env.VITE_USER_VERIFICATION_URL

const registrationValidateSchema = yup.object().shape({
	first_name: yup.string().required().max(100).label('nombre'),
	last_name: yup.string().required().max(100).label('apellido'),
	password: yup.string().required().min(8).oneOf([yup.ref('repeat_password')]).label('contraseña'),
	repeat_password: yup.string().label('repetir contraseña'),
	email: yup.string().required().email().label('correo electrónico')
})

function onSubmit(values, actions) {
	new apiRequest().Post({
		'module': 'users',
		'data': values
	}).then(response => {
		registrationForm.value.resetForm()
		store.push_alert(response.data)
		store.showPopup({
			title: "¡Solo un paso más!",
			text: "Te hemos enviando un mensaje a tu dirección de correo, sigue los pasos ahí indicados para verificar tu cuenta y empezar a utilizarla.",
			type: "route",
			button_text: "ENTERADO",
			route: {
				name: "accessViewLogin"
			},
			icon: "email_open.png"
		})
	}).catch(error => {
		console.log(error)
		if(error.status === 400) {
			let errors = setFieldMessages(error.data.errors)
			actions.setErrors(errors)
		} else {
			store.push_alert(error.data)
		}
	})
}

function validateForm(response) {
	if(response.valid) {
		this.showCaptcha = true
	}
}
</script>
