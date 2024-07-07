<template>
	<h2 class="access__subtitle">Cambiar contraseña</h2>
	<span class="access__welcome">Crea una nueva contraseña para tu cuenta, recuerda que debe ser de al menos 8 caracteres alfanuméricos</span>
	<Form class="form" @Submit="onSubmit" :validation-schema="resetValidateSchema" ref="resetForm">
		<fieldset class="form__fieldset">
			<div class="form__container">
				<label class="form__label form__label--inverted" for="password">Nueva contraseña</label>
				<Field class="form__input form__input--access form__input--inverted form__input--password" type="password" name="password" placeholder="***************"/>
				<ErrorMessage name="password" class="form__alert" data-field="password"/>
			</div>

			<div class="form__container">
				<label class="form__label" for="repeat_password">repetir la contraseña</label>
				<Field class="form__input form__input--access form__input--password" type="password" name="repeat_password" placeholder="***************"/>
			</div>

			<Field type="hidden" name="hash_string" v-model="hashString"/>
			<Field type="hidden" name="email" v-model="email"/>

			<router-link class="access__form-link" :to="{name: 'accessViewLogin'}">Iniciar sesión con mi contraseña</router-link>

			<input class="form__submit btn btn__default btn--regular btn__default--warning" type="submit" value="Cambiar contraseña" />
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
import { useRoute } from 'vue-router'

const route = useRoute()
const resetForm = ref()
const redirect_url = import.meta.env.VITE_PASS_RESET_URL
const store = useAppStore()
const resetValidateSchema = yup.object().shape({
	password: yup.string().required().min(8).label('contraseña').oneOf([yup.ref('repeat_password')]),
	repeat_password: yup.string()
})
const email = ref(atob(route.query.e))
const hashString = ref(route.query.h)
const password = ref(null)

function onSubmit(values, action) {
	setTimeout(() => {
		new apiRequest().Post({
			'module': 'access/reset',
			'data': values
		}).then(response => {
			resetForm.value.resetForm()
			store.push_alert({
				code: response.data.code
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
</script>
