<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="myCompany">
					<h1 class="section__title">{{myCompany.razon_social}}</h1>
					<div class="section__options">
						<button class="btn btn__transparent btn--small" @click.prevent="companyEditBlocked = false">
							<span class="material-symbols-outlined">edit_square</span>
							Editar empresa
						</button>

						<button class="btn btn__transparent btn--small" @click.prevent="companyDelete">
							<span class="material-symbols-outlined">delete</span>
							Eliminar empresa
						</button>
					</div>
					<Form @submit="onSubmit" class="form" :initial-values="myCompany" :validation-schema="companyValidateSchema" v-slot="{ values, setErrors }">
						<div class="form__container form__container--half">
							<label class="form__label" for="taxpayer_type">Tipo de contribuyente</label>
							<Field as="select" class="form__select" id="taxpayer_type" name="taxpayer_type" :disabled="companyEditBlocked" :class="{'form__select--disabled': companyEditBlocked}">
								<option disabled value="">Selecciona el tipo de contribuyente</option>
								<option v-for="tptype in taxpayerType" :value="tptype.id">{{ tptype.name }}</option>
							</Field>
							<ErrorMessage name="taxpayer_type" class="form__alert" data-field="taxpayer_type"/>
						</div>
						<div>
							<div class="form__container form__container--full">
								<label class="form__label" for="razon_social" id="razon_social">Razón social</label>
								<Field id="razon_social" name="razon_social" placeholder="Razón social de tu empresa" class="form__input" :disabled="companyEditBlocked" :class="{'form__input--disabled': companyEditBlocked}"/>
							<ErrorMessage name="razon_social" class="form__alert" data-field="razon_social"/>
							</div>

							<div class="form__container form__container--small">
								<label class="form__label" for="rfc" id="rfc">RFC</label>
								<Field class="form__input" type="text" id="rfc" name="rfc" placeholder="XXXX010101XXX" :class="{'form__input--disabled': companyEditBlocked}" disabled=""/>
								<ErrorMessage name="rfc" class="form__alert" data-field="rfc"/>
							</div>

							<div class="form__container form__container--half">
								<label class="form__label" for="regimen_fiscal">Régimen fiscal</label>
								<Field as="select" class="form__select" id="regimen_fiscal" name="regimen_fiscal" v-if="regimenesFiscales" :class="{'form__select--disabled': companyEditBlocked}" :disabled="companyEditBlocked">
									<option disabled value="">Selecciona el régimen fiscal</option>
									<option v-for="rf in regimenesFiscales" :value="rf.code">{{rf.code}} - {{ rf.description }}</option>
								</Field>
								<ErrorMessage name="regimen_fiscal" class="form__alert" data-field="regimen_fiscal"/>
							</div>

							<div class="form__grid" v-if="!companyEditBlocked">
								<h3 class="form__head2">Llave pública y privada de tu CSD</h3>
								<span class="section__help-text">Recuerda que no es necesario que vuelvas a subir tus archivos, solo edita o actualiza los datos que creas que son necesarios.</span>
								<div class="form__drag-drop">
									<drag-drop :texts="dragDropCERTexts" @filename="setCert" accept=".cer" id="cer" module="tax-payers/csd/upload"></drag-drop>
									<ErrorMessage name="cer" class="form__alert" data-field="cer"/>
								</div>
								<div class="form__drag-drop">
									<drag-drop :texts="dragDropKEYTexts" @filename="setKey" accept=".key" id="key" module="tax-payers/csd/upload"></drag-drop>
									<ErrorMessage name="key" class="form__alert" data-field="key"/>
								</div>
							</div>
							<div class="form__section" v-if="companyEditBlocked">
								<h3 class="form__head2">Llave pública y privada de tu CSD</h3>
								<span class="section__help-text">Tus certificados se encuentran resguardados en nuestro servidor para agilizar el proceso de emisión de tus facturas. A continuación encontrarás la información de tus certificados.</span>
								<div class="certificate">
									<img class="certificate__icon" src="../../assets/icons/certificate.png" alt="Icono de certificado">
									<div class="certificate__data">
										<span class="certificate__text"><strong class="certificate__text--strong">Fecha de expiración:</strong> {{humanReadDate(myCompany.cert_expiration)}}</span>
										<span class="certificate__text"><strong class="certificate__text--strong">Nº Certificado:</strong> {{myCompany.no_cer}}</span>
									</div>
								</div>
							</div>

							<div class="form__container form__container--small" v-if="!companyEditBlocked">
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
						<input v-if="!companyEditBlocked" class="btn btn__default btn--regular" type="submit" value="Actualizar contribuyente">
					</Form>
				</section>
				<section class="section section--wide" v-if="myCompany">
					<h2 class="section__title">Dirección de facturación</h2>
					<span class="section__help-text">Los datos de la dirección de facturación deben ser los mismo registrados en to comprobante de identificación fiscal vigente.</span>
					<tax-payer-address></tax-payer-address>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useAppStore } from '../../store/index.js'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import dragDrop from '../../components/partials/drag_drop_file.vue'
import taxPayerAddress from '../partials/tax_payer_address.vue'

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
const companyEditBlocked = ref(true)
const tpt = ref(null)
const taxpayerType = ref(null)
const regimenesFiscales = ref(null)
const showPassword = ref(false)
const csdPass = ref('password')
const companyValidateSchema = yup.object().shape({
	password: yup.string().label('contraseña').when(['cer', 'companyValidateSchema'], {is: (value) => value != null, then: (schema) => schema.required(), otherwise: (schema) => schema.nullable()}),
	rfc: yup.string().required().label('RFC').min(12).max(13).matches(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i),
	razon_social: yup.string().required().label('razón social'),
	taxpayer_type: yup.string().required().label('Tipo de contribuyente'),
	regimen_fiscal: yup.string().required().label('régimen fiscal').length(3),
	cer: yup.string().when(['key', 'companyValidateSchema'], {is: (value) => value != null, then: (schema) => schema.required(), otherwise: (schema) => schema.nullable()}).label('archivo de clave privada .CER'),
	key: yup.string().label('archivo de certificado .KEY').when(['cer', 'companyValidateSchema'], {is: (value) => value != null, then: (schema) => schema.required(), otherwise: (schema) => schema.nullable()})
},
[
	['key', 'companyValidateSchema'],
	['cer', 'companyValidateSchema'],
	['key', 'cer']
])
const myCompany = computed(() => {
	return store.company != null ? store.company[0] : false
})

getRegimenFiscal()

function getTaxpayerType() {
	new apiRequest().Get({
		module: 'tax-payers/types'
	}).then(response => {
		taxpayerType.value = response.data.data
	}).catch(error => {
		console.log(error)
	})
}

onMounted(() => {
	if(!myCompany.value) {
		router.push({name: 'homeView'})
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
		console.log(error)
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
// TODO: AGREGAR NOTIFICACION AL CREAR LA EMPRESA O BIEN AL HABER UN ERROR AL CREARLA
function onSubmit(values, action) {
	new apiRequest().Put({
		module: 'tax-payers',
		data: values
	}, myCompany.value.id).then(response => console.log(response)).catch(error => console.warn(error))
}

function companyDelete() {
	new apiRequest().Delete({
		module: 'tax-payers'
	}, myCompany.value.id)
		.then(response => {
			console.log(response)
		}).catch(error => {
			console.log(error)
		})
}

function humanReadDate(dateString) {
	let d = new Date(dateString)
	return `${d.toLocaleString()}`
}
</script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_section.sass"
</style>
