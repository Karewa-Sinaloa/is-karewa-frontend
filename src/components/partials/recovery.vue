<template>
	<h2 class="access__subtitle">Recupera tu acceso</h2>
	<span class="access__welcome">Proporcionanos tu dirección de correo electrónico y te enviaremos los pasos a seguir para que puedas recuerar el acceso a tu cuenta</span>
	<Form class="form" @Submit="onSubmit" :validation-schema="recoveryValidateSchema" v-slot="{setErrors, handleSubmit, values, validate}" ref="recoveryForm">
		<fieldset class="form__fieldset">
			<div class="form__container">
				<label class="form__label form__label--inverted" for="email">Correo electrónico</label>
				<Field class="form__input form__input--inverted form__input--access form__input--email" type="email" name="email" placeholder="usuario@dominio.tld"/>
				<ErrorMessage name="email" class="form__alert" data-field="email"/>
			</div>
			
			<Field type="hidden" name="reset_url" v-model="resetUrl"/>
			<Field type="hidden" name="hcaptcha_data" v-model="hcaptchaData"/>

			<router-link class="access__form-link" :to="{name: 'accessViewLogin'}">Iniciar sesión con mi contraseña</router-link>
			<hcaptcha-component v-if="showCaptcha" @hideCaptcha="showCaptcha = false" @releaseForm="(string) => {hcaptchaData = string, handleSubmit(onSubmit)}"></hcaptcha-component>

			<input class="form__submit btn btn__default btn--regular" type="submit" @click.prevent="validate().then(r => formValidation(r))" value="Recuperar acceso" />
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
import hcaptchaComponent from './hcaptcha.vue'

const recoveryForm = ref()
const hcaptchaData = ref(null)
const showCaptcha = ref(false)
const resetUrl = import.meta.env.VITE_PASS_RESET_URL
const store = useAppStore()
const recoveryValidateSchema = yup.object().shape({
	email: yup.string().required().email().label('correo electrónico')
})

function onSubmit(values, action) {
	setTimeout(() => {
		new apiRequest().Post({
			'module': 'access/recovery',
			'data': values
		}).then(response => {
			recoveryForm.value.resetForm()
			store.push_alert({
				code: response.data.code
			})
			store.showPopup({
				title: "Revisa tu correo",
				text: "Hemos enviado un mensaje a tu correo, sigue los pasos que se indican para cambiar tu contraseña y recuperar tu acceso a la cuenta.",
				button_text: "ENTERADO",
				type: "route",
				route: {
					name: "accessViewLogin"
				},
				icon: "email_open.png"
			})
		}).catch(error => {
			if(error.status === 400) {
				let errors = setFieldMessages(error.data.errors)
				actions.setErrors(errors)
			} else {
				store.push_alert(error.data)
			}
		})
	}, 0)
}

function formValidation(response) {
	if(response.valid) {
		this.showCaptcha = true
	}
}
</script>
