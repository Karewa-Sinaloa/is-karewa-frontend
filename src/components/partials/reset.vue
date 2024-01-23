<template>
	<h2 class="ff-headings text-light text-center fs-4 fw-bold">Cambiar contraseña</h2>
	<span class="ff-content fs-6 text-center text-light fw-light d-block">Crea una nueva contraseña para tu cuenta, recuerda que debe ser de al menos 8 caracteres alfanuméricos</span>
	<Form class="mt-4" @Submit="onSubmit" :validation-schema="resetValidateSchema" ref="resetForm">
		<fieldset class="container">
			<div class="mb-1">
				<label class="ff-headings fw-light fs-small form-label text-light m-auto" for="password">Nueva contraseña</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-key-fill fs-regular"></i>
					</span>
					<Field class="form-control" type="password" name="password" placeholder="***************"/>
				</div>
				<ErrorMessage name="password" class="p-1 d-block text-warning mt-1 fs-small ff-content" data-field="password"/>
			</div>

			<div class="mb-1">
				<label class="ff-headings fw-light fs-small form-label text-light m-auto" for="repeat_password">repetir la contraseña</label>
				<div class="input-group">
					<span class="input-group-text">
						<i class="bi-key-fill fs-regular"></i>
					</span>
					<Field class="form-control" type="password" name="repeat_password" placeholder="***************"/>
				</div>
			</div>

			<Field type="hidden" name="hash_string" v-model="hashString"/>
			<Field type="hidden" name="email" v-model="email"/>

			<router-link class="btn btn-link text-light bt-sm float-end ff-content" :to="{name: 'accessViewLogin'}">Iniciar sesión con mi contraseña</router-link>

			<input class="btn btn-warning col-12 mb-1 mt-1 ff-headings" type="submit" value="Cambiar contraseña" />
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
