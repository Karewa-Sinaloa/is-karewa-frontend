<template>
	<h2 class="ff-headings text-center text-light fs-4 fw-bold">Crear nueva cuenta</h2>
	<span class="ff-content text-center text-light fs-6 d-block">Gracias por optar por CFDI APP. Esta cuenta será tu cuenta principal, desde la misma podrás crear una o más empresas para facturar. Una vez registrado podrás continuar con la configuración de tu empresa.</span>
	<Form class="mt-4" @Submit="onSubmit" :validation-schema="registrationValidateSchema" ref="registrationForm" v-slot="{setErrors, handleSubmit, values, validate}">
		<fieldset class="container">
			<div class="mb-1">
				<label class="form-label text-light m-auto ff-headings fw-regular fs-small" for="first_name">Nombre(s)</label>
				<Field class="form-control" type="text" name="first_name" placeholder="Nombre(s)"/>
				<ErrorMessage name="first_name" class="p-1 d-block text-warning mt-1 fs-small ff-content" data-field="first_name"/>
			</div>

			<div class="mb-1">
				<label class="form-label text-light fs-small fw-regular m-auto ff-headings" for="last_name">Apellido(s)</label>
				<Field class="form-control" type="text" name="last_name" placeholder="Apellido(s)"/>
				<ErrorMessage name="last_name" class="p-1 text-warning fs-small mt-1 d-block ff-content" data-field="last_name"/>
			</div>

			<div class="mb-1">
				<label class="form-label text-light fs-small fw-regular ff-headings m-auto" for="email">Correo electrónico</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-envelope-fill"></i>
					</span>
					<Field class="form-control" type="email" name="email" placeholder="usuario@dominio.tld"/>
				</div>
				<ErrorMessage name="email" class="p-1 mt-1 d-block text-warning fs-small ff-content" data-field="email"/>
			</div>

			<div class="mb-1">
				<label class="form-label ff-headings text-light m-auto fw-regular fs-small" for="password">Contraseña</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-key-fill"></i>
					</span>
					<Field class="form-control" type="password" name="password" id="password" placeholder="************" />
				</div>
				<ErrorMessage name="password" class="p-1 mt-1 text-warning fs-small d-block ff-content" data-field="password"/>
			</div>

			<div class="mb-1">
				<label class="form-label ff-headings fs-small text-light fw-regular m-auto" for="repeat_password">Repetir contraseña</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-key-fill"></i>
					</span>
					<Field class="form-control" type="password" name="repeat_password" id="repeat_password" placeholder="************" />
				</div>
			</div>

			<Field type="hidden" name="hcaptcha_data" v-model="hcaptchaData"/>
			<Field type="hidden" name="verification_url" v-model="userVerificationUrl"/>

			<hcaptcha-component v-if="showCaptcha" @hideCaptcha="showCaptcha = false" @releaseForm="(string) => {hcaptchaData = string, handleSubmit(onSubmit)}"></hcaptcha-component>

			<router-link class="text-light btn btn-sm btn-link ff-content float-end" :to="{name: 'accessViewLogin'}">Iniciar sesión con mi cuenta</router-link>

			<input class="btn btn-warning col-12 mb1 mt-1 ff-headings" type="submit" value="Crear cuenta ahora" @click.prevent="validate().then(r => validateForm(r))"/>
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
