<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="taxpayerType">
					<h1 class="section__title">Crear empresa</h1>
					<span class="section__help-text">Ten a la mano tu constancia de situación fiscal y tus CSD vigentes y su contraseña.</span>
					<Form @submit="onSubmit" class="form" :initial-values="companyForm" :validation-schema="companyValidateSchema" v-slot="{ values, setErrors }">
						<div class="form__container form__container--half">
							<label class="form__label" for="taxpayer_type">Tipo de contribuyente</label>
							<Field as="select" class="form__select" id="taxpayer_type" name="taxpayer_type" v-model="tpt">
								<option disabled value="">Selecciona el tipo de contribuyente</option>
								<option v-for="tptype in taxpayerType" :value="tptype.id">{{ tptype.name }}</option>
							</Field>
							<ErrorMessage name="taxpayer_type" class="form__alert" data-field="taxpayer_type"/>
						</div>
						<div v-if="tpt">
							<div class="form__container form__container--full">
								<label class="form__label" for="razon_social" id="razon_social">Razón social</label>
								<Field id="razon_social" name="razon_social" placeholder="Razón social de tu empresa" class="form__input" />
							<ErrorMessage name="razon_social" class="form__alert" data-field="razon_social"/>
							</div>

							<div class="form__container form__container--small">
								<label class="form__label" for="rfc" id="rfc">RFC</label>
								<Field class="form__input" type="text" id="rfc" name="rfc" placeholder="XXXX010101XXX" />
								<ErrorMessage name="rfc" class="form__alert" data-field="rfc"/>
							</div>

							<div class="form__container form__container--half">
								<label class="form__label" for="regimen_fiscal">Régimen fiscal</label>
								<Field as="select" class="form__select" id="regimen_fiscal" name="regimen_fiscal">
									<option disabled value="">Selecciona el régimen fiscal</option>
									<option v-for="rf in regimenesFiscales" :value="rf.code">{{rf.code}} - {{ rf.description }}</option>
								</Field>
								<ErrorMessage name="regimen_fiscal" class="form__alert" data-field="regimen_fiscal"/>
							</div>

							<div class="form__grid">
								<h3 class="form__head2">Llave pública y privada de tu CSD</h3>
								<div class="form__drag-drop">
									<drag-drop :texts="dragDropCERTexts" @filename="setCert" accept=".cer" id="cer" module="tax-payers/csd/upload"></drag-drop>
									<ErrorMessage name="cer" class="form__alert" data-field="key"/>
								</div>
								<div class="form__drag-drop">
									<drag-drop :texts="dragDropKEYTexts" @filename="setKey" accept=".key" id="key" module="tax-payers/csd/upload"></drag-drop>
									<ErrorMessage name="key" class="form__alert" data-field="key"/>
								</div>
							</div>

							<div class="form__container form__container--small">
								<label class="form__label" for="password" id="password">Contraseña de tu CSD</label>
								<Field class="form__input" :type="csdPass" id="password" name="password" placeholder="*************" />
								<label class="form__checkbox-label" for="show_password">
									<input class="form__checkbox" type="checkbox" id="show_password" name="show_password" @change="togglePassword" value="1">
									<span>Mostrar la contraseña</span>
								</label>
								<ErrorMessage name="password" class="form__alert" data-field="password"/>
							</div>

							<Field name="cer" v-model="cert" as="hidden" />
							<Field name="key" v-model="key" as="hidden" />
						</div>
						<input v-if="tpt" class="btn btn__default btn--regular" type="submit" value="Agregar contribuyente">
					</Form>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import dragDrop from '../../components/partials/drag_drop_file.vue'
import { getCompany } from '../../mixins/company.js'

const store = useAppStore()
const router = useRouter()
const cert = ref(null)
const key = ref(null)
const dragDropCERTexts = {
	title: 'Archivo .CER',
	text: 'Sube o arrastra y suelta el archivo .CER de tu CSD',
	button_text: 'Seleccionar archivo'
}
const dragDropKEYTexts = {
	title: 'Archivo .KEY',
	text: 'Sube o arrastra y suelta el archivo .KEY de tu CSD',
	button_text: 'Seleccionar archivo'
}
const companyForm = {
	taxpayer_type: null,
	razon_social: null,
	rfc: null,
	password: null,
	cer: null,
	key: null,
	regimen_fiscal: null
}
const tpt = ref(null)
const taxpayerType = ref(null)
const regimenesFiscales = ref(null)
const showPassword = ref(false)
const csdPass = ref('password')
const companyValidateSchema = yup.object().shape({
	password: yup.string().required().label('contraseña'),
	rfc: yup.string().required().label('RFC').min(12).max(13).matches(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i),
	razon_social: yup.string().required().label('razón social'),
	taxpayer_type: yup.string().required().label('Tipo de contribuyente'),
	regimen_fiscal: yup.string().required().label('régimen fiscal').length(3),
	cer: yup.string().required().label('archivo de clave privada .key'),
	key: yup.string().required().label('archivo de certificado .CER')
})
const companyCreated = computed(() => {
	return store.company != null ? true : false
})

watch(tpt, () => {
	getRegimenFiscal()
})

function getTaxpayerType() {
	new apiRequest().Get({
		module: 'tax-payers/types'
	}).then(response => {
		taxpayerType.value = response.data.data
	}).catch(error => {
		store.push(error.data)
		router.push({
			name: 'homeView'
		})
	})
}

onMounted(() => {
	if(companyCreated.value) {
		router.push({name: 'companyView'})
	}
})

getTaxpayerType()

function getRegimenFiscal() {
	let taxPayerIdField = tpt.value == 1 ? 'p_fisica' : 'p_moral'
	new apiRequest().Get({
		module: 'tax-payers/regimen-fiscal',
		params: `?${taxPayerIdField}=eq:1`
	}).then(response => {
		regimenesFiscales.value = response.data.data
	}).catch(error => {
		store.push_alert(error.data)
		router.push({
			name: 'homeView'
		})
	})
}

function setCert(filename) {
	cert.value = filename
}

function setKey(filename) {
	key.value = filename
}

function togglePassword() {
	showPassword.value = !showPassword.value
	csdPass.value = showPassword.value ? 'text' : 'password'
}

function onSubmit(values, action) {
	new apiRequest().Post({
		module: 'tax-payers',
		data: values
	}).then(response => {
		getCompany()
			.then(() => {
				router.push({
					name: "companyView"
				})
			})
			.catch(() => {
				route.push({
					name: 'homeView'
				})
			})
	}).catch(error => {
		store.push_alert(error.data)
	})
}
</script>
