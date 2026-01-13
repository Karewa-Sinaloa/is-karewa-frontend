<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--verywide" v-if="taxpayerType">
					<div class="section__top">
						<h1 class="section__title" v-text="sectionTitle"></h1>
						<span class="section__help-text">Solicita a tu cliente la constancia de situación fiscal para agregar de forma correcrta su información. Selecciona si es una persona física o una persona moral para iniciar el registro.</span>
						<div class="section__options btn__grouped" v-if="!enableEdit">
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="enableEdit = true">
								<icon-set icon="edit"/>
								Editar cliente
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<icon-set icon="delete"/>
								Eliminar cliente
							</button>
						</div>
					</div>	
					<confirmation-popup :data="customerDeleteConfirmationData" @confirmed="customerDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<form @submit="onSubmit" class="form" v-if="customerData">
							<h2 class="form__section-title">Datos fiscales</h2>

							<div class="form__container form__container--small">
								<label class="form__label" for="tax_payer_type">Tipo de contribuyente</label>
								<Field as="select" class="form__select" :class="{'form__select--disabled': customerId}" id="tax_payer_type" name="tax_payer_type" v-model="tpt" :disabled="customerId">
									<option disabled value="">Selecciona el tipo de contribuyente</option>
									<option v-for="tptype in taxpayerType" :value="tptype.id">{{ tptype.name }}</option>
								</Field>
								<ErrorMessage name="tax_payer_type" class="form__alert" data-field="tax_payer_type"/>
							</div>
							
							<div v-if="tpt">
								<div class="form__container form__container--full">
									<label class="form__label" for="razon_social" id="razon_social">Razón social</label>
									<Field id="razon_social" name="razon_social" placeholder="Razón social de tu empresa" class="form__input" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage name="razon_social" class="form__alert" data-field="razon_social"/>
								</div>

								<div class="form__container form__container--small">
									<label class="form__label" for="rfc" id="rfc">RFC</label>
									<Field class="form__input" type="text" id="rfc" name="rfc" placeholder="XXXX010101XXX" :disabled="customerId" :class="{'form__input--disabled': customerId}" />
									<ErrorMessage name="rfc" class="form__alert" data-field="rfc"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="regimen_fiscal">Régimen fiscal</label>
									<Field as="select" class="form__select" id="regimen_fiscal" name="regimen_fiscal" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
										<option disabled value="">Selecciona el régimen fiscal</option>
										<option v-for="rf in regimenesFiscales" :value="rf.code">{{rf.code}} - {{ rf.description }}</option>
									</Field>
									<ErrorMessage name="regimen_fiscal" class="form__alert" data-field="regimen_fiscal"/>
								</div>
								
								<h2 class="form__section-title">Dirección fiscal</h2>

								<div class="form__container-group">
									<div class="form__container form__container--small">
										<label class="form__label form__label--required" for="postal_code">Código postal</label>
										<Field class="form__input" name="postal_code" id="postal_code" placeholder="00000" @change="getPostalCode" v-model="postal_code" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<ErrorMessage id="postal_code"></ErrorMessage>
										<span name="payment_method_id" class="form__alert" data-field="payment_method_id">{{errors.postal_code}}</span>
									</div>

									<div class="form__container form__container--small" v-if="postalCodeData.postal_code">
										<label class="form__label" for="state_code">Estado</label>
										<Field class="form__input" name="state_code" id="state_code" placeholder="Estado" disabled v-model="state_code" :class="{'form__input--disabled': !enableEdit}" />
										<ErrorMessage id="state_code"></ErrorMessage>
									</div>
								</div>

								<div class="form__container-group" v-if="postalCodeData.postal_code">
									<div class="form__container form__container--small">
										<label class="form__label" for="localidad">Localidad</label>
										<Field class="form__input" name="localidad" id="localidad" placeholder="Localidad" v-model="localidad" @focus="displayLocationOptions = true" autocomplete="off" @blur="displayLocationOptions = false" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<input-autocomplete :elements="postalCodeData.localidades" :showOptions="displayLocationOptions" :stringValue="localidad" @newStringValue="v => (localidad = v)"></input-autocomplete>
										<ErrorMessage id="localidad"></ErrorMessage>
									</div>

									<div class="form__container form__container--small">
										<label class="form__label" for="municipio">Municipio</label>
										<Field class="form__input" name="municipio" id="municipio" placeholder="Municipio" v-model="municipio" @focus="displayMunicipiosOptions = true" autocomplete="off" @blur="displayMunicipiosOptions = false" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<input-autocomplete :elements="postalCodeData.municipios" :stringValue="municipio" @newStringValue="v => (municipio = v)" :showOptions="displayMunicipiosOptions"></input-autocomplete>
										<ErrorMessage id="municipio"></ErrorMessage>
									</div>
								</div>

								<div class="form__container-group" v-if="postalCodeData.postal_code">
									<div class="form__container form__container--small">
										<label class="form__label" for="Colonia">Colonia</label>
										<Field class="form__input" name="colonia" id="colonia" placeholder="Colonia" v-model="colonia" @focus="displayColoniasOptions = true" autocomplete="off" @blur="displayColoniasOptions = false" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<input-autocomplete :elements="postalCodeData.colonias" :showOptions="displayColoniasOptions" :stringValue="colonia" @newStringValue="v => (colonia = v)"></input-autocomplete>
										<ErrorMessage id="colonia"></ErrorMessage>
									</div>

									<div class="form__container form__container--small">
										<label class="form__label" for="internal_number">Número interior</label>
										<Field class="form__input" name="internal_number" id="internal_number" placeholder="Número interior" v-model="internal_number" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
										<ErrorMessage id="internal_number"></ErrorMessage>
									</div>
								</div>

								<div class="form__container-group" v-if="postalCodeData.postal_code">
									<div class="form__container form__container--small">
										<label class="form__label" for="street">Calle</label>
										<Field class="form__input" name="street" id="street" placeholder="Nombre de la calle" v-model="street" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<ErrorMessage id="street"></ErrorMessage>
									</div>

									<div class="form__container form__container--small">
										<label class="form__label" for="external_number">Número exterior</label>
										<Field class="form__input" name="external_number" id="external_number" placeholder="Número exterior" v-model="external_number" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
										<ErrorMessage id="external_number"></ErrorMessage>
									</div>
								</div>
								
								<h2 class="form__section-title">Datos predefinidos</h2>
								<span class="form__help-text">Estos datos no son necesarios pero te pueden ayudar a generar más rápido el comprobante fiscal porque se agregarán automaticamente a la hora de crear el comprobante ahorandote tiempo.</span>

								<div class="form__grid">
									<div class="form__container form__container--small">
										<label class="form__label" for="payment_method_id">Método de pago</label>
										<Field as="select" id="payment_method_id" class="form__select" name="payment_method_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
											<option disabled value="">SELECCIONE UNA OPCIÓN</option>
											<option v-for="pm in paymentMethods" :value="pm.code">{{ pm.code }} &#183; {{ pm.description }}</option>
										</Field>
										<span name="payment_method_id" class="form__alert" data-field="payment_method_id">{{setFieldMessages.payment_method_id}}</span>
										<ErrorMessage name="payment_method_id"></ErrorMessage>
									</div>

									<div class="form__container form__container--small">
										<label class="form__label" for="payment_type_id">Forma de pago</label>
										<Field as="select" id="payment_type_id" class="form__select" name="payment_type_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
											<option disabled value="">SELECCIONE UNA OPCIÓN</option>
											<option v-for="pt in paymentTypes" :value="pt.id">{{ pt.code }} &#183; {{ pt.name }}</option>
										</Field>
										<ErrorMessage id="payment_type_id"></ErrorMessage>
									</div>

									<div class="form__container form__container--small">
										<label class="form__label" for="cfdi_usage_id">Uso del CFDI</label>
										<Field as="select" id="cfdi_usage_id" class="form__select" name="cfdi_usage_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
											<option disabled value="">SELECCIONE UNA OPCIÓN</option>
											<option v-for="cu in CFDIUsage" :value="cu.code">{{ cu.code }} &#183; {{ cu.name }}</option>
										</Field>
										<ErrorMessage id="cfdi_usage_id"></ErrorMessage>
									</div>	
								</div>

								<h2 class="form__section-title">Datos de contacto</h2>
								<span class="form__help-text">Añade los datos de contacto necesarios, su correo para eviarle su factura, un alias para que sea más facil identificarlo, la referencia de contacto, etc.</span>

								<div class="form__container form__container--half">
									<label class="form__label" for="alias">Alias
										<help-icon v-if="enableEdit" help_text="Agrega un alias para identificar rapidamente a tu cliente, esto lo puedes utilizar en las búsquedas que realices donde requieras encontrarlo"/>
									</label>
									<Field class="form__input" id="alias" name="alias" placeholder="Alias del receptor" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage id="alias"></ErrorMessage>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="reference">Referencia
										<help-icon v-if="enableEdit" help_text="Agrega el nombre de la persona encargada de facturación o bien el contacto responsable de la empresa"/>
									</label>
									<Field class="form__input" id="reference" name="reference" placeholder="Nombre de la persona de referencia" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage id="reference"></ErrorMessage>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="email">Dirección de email
										<help-icon v-if="enableEdit" help_text="Agrega una dirección de correo electrónico donde puedas enviar los comprobantes fiscales o bien te sirva de contacto con tu cliente"/>
									</label>
									<Field class="form__input" id="email" name="email" type="email" placeholder="usuario@dominio.tld" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage id="email"></ErrorMessage>
								</div>

								<div class="form__container form__container--small">
									<label class="form__label" for="phone">Teléfono</label>
									<Field class="form__input" id="phone" name="phone" placeholder="+52 (667) 000 00 00" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage id="phone"></ErrorMessage>
								</div>

								<div class="form__container form__container--large">
									<label class="form__label" for="comments">Comentarios</label>
									<Field class="form__input form__input--textarea" id="comments" name="comments" placeholder="Tus comentarios" rows="4" as="textarea" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
									<ErrorMessage id="comments"></ErrorMessage>
								</div>

								<h2 class="form__section-title">Contribuyentes asociados</h2>
								<span class="form__help-text">Selecciona el o los contribuyentes asociados a este cliente. Si facturas a más de un contribuyente puedes utilizar esta funcion para filtrar los clientes pertenecientes a cada uno de los contribuyentes.</span>
								<div class="form__contaier form__container--large form__container--checkbox" v-for="(contribuyente, key) in contribuyentes">
									<label class="form__label" :for="`tax_payer_ids_${key}`">
										<Field class="form__checkbox" :id="`tax_payer_ids_${key}`" name="tax_payer_ids" type="checkbox" :value="contribuyente.id" :disabled="!enableEdit" />
										<span class="form__label-checkbox" v-text="contribuyente.razon_social"></span>
									</label>

									<ErrorMessage id="tax_payer_ids"></ErrorMessage>
								</div>
							</div>

							<button type="submit "v-if="tpt && enableEdit" class="btn btn__default btn--regular btn__default--primary">
								<icon-set icon="upload"/>
								{{submitCustomerButtonText}}
							</button>
							<button v-if="tpt && enableEdit" class="btn btn__outlined btn--small btn__outlined--primary btn--fixed" @click.prevent="enableEdit = false">
								<icon-set icon="close"/>
								Cancelar
							</button>
						</form>
					</div>
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
import { useRouter, useRoute } from 'vue-router'
import * as yup from 'yup'
import { Form, Field, ErrorMessage, useFieldArray, useForm } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import { getCompany } from '../../mixins/company.js'
import inputAutocomplete from '../partials/address-input-autocomplete.vue'
import confirmationPopup from '../partials/confirmation_popup.vue'
import helpIcon from '../partials/help_icon.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const customerData = ref({	
	tax_payer_type: null,
	razon_social: 'sdfsdfds',
	rfc: null,
	regimen_fiscal: null,
	postal_code: null,
	state_code: null,
	localidad: null,
	municipio: null,
	colonia: null,
	street: null,
	external_number: null,
	internal_number: null,
	payment_method_id: null,
	payment_type_id: null,
	cfdi_usage_id: null,
	alias: null,
	reference: null,
	email: null,
	phone: null,
	comments: null,
	tax_payer_ids: []
})

const customerValidationSchema = yup.object().shape({
	rfc: yup.string().required().label('RFC').min(12).max(13).matches(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i),
	razon_social: yup.string().required().label('razón social'),
	tax_payer_type: yup.number().required().label('Tipo de contribuyente').integer().transform((value) => (Number.isNaN(value) ? 0 : value)),
	regimen_fiscal: yup.string().required().label('régimen fiscal').min(3).max(3),
	postal_code: yup.number().required().label('código postal').min(1000).max(99999).integer().positive().transform((value) => (Number.isNaN(value) ? 0 : value)),
	state_code: yup.string().required().label('Código del país').min(3).max(3),
	localidad: yup.string().label('localidad').max(100).nullable(),
	municipio: yup.string().label('municipio').max(100).nullable(),
	colonia: yup.string().label('colonia').max(100).nullable(),
	street: yup.string().label('calle').max(150).nullable(),
	external_number: yup.string().label('número exterior').max(50).nullable(),
	internal_number: yup.string().label('número interior').max(50).nullable(),
	payment_method_id: yup.number().label('método de pago').nullable().integer().positive().transform((value) => (Number.isNaN(value) ? 0 : value)),
	payment_type_id: yup.number().label('forma de pago').nullable().integer().positive().transform((value) => (Number.isNaN(value) ? 0 : value)),
	cfdi_usage_id: yup.string().label('uso del CFDI').max(4).nullable().min(3),
	alias: yup.string().label('alias').max(50),
	reference: yup.string().label('contacto de referencia').max(150).nullable(),
	phone: yup.string().label('número telefónico').max(20).nullable(),
	email: yup.string().email().label('correo electrónico').nullable().max(100),
	comments: yup.string().label('comentarios').nullable(),
	tax_payer_ids: yup.array().ensure()
})

const {handleSubmit, defineField, errors, useFieldModel, resetForm} = useForm({
	initialValues: customerData.value,
	validationSchema: customerValidationSchema
})
const customerDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar este cliente? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
//DEFINITION: TPT: Tax Payer Type
const tpt = ref(null)
const confirmDelete = ref(false)
const taxpayerType = ref(null)
const regimenesFiscales = ref(null)

const companyCreated = computed(() => {
	return store.company != null ? true : false
})

const pCodeData = () => {
	return {
		municipios: [],
		localidades: [],
		colonias: [],
		postal_code: null
	}
}

const postalCodeData = ref(pCodeData())
const submitButtonText = ref('Registrar dirección')
const displayLocationOptions = ref(false)
const displayMunicipiosOptions = ref(false)
const displayColoniasOptions = ref(false)
const paymentMethods = ref([])
const paymentTypes = ref([])
const CFDIUsage = ref([])
const customerId = ref(null)
const enableEdit = ref(false)
const sectionTitle = ref('Agregar nuevo cliente')
const submitCustomerButtonText = ref('AGREGAR CLIENTE')

const contribuyentes = computed(() => {
	return store.company
})

onMounted(() => {
	if(route.name == 'customerEdit' && route.params.id > 0) {
		customerId.value = route.params.id
		sectionTitle.value = 'Editar información del cliente'
		submitCustomerButtonText.value = 'ACTUALIZAR CLIENTE'
		getCustomer()
		if(route.query.edit == 'true') {
			enableEdit.value = true
		}
	} else {
		sectionTitle.value = 'Agregar nuevo cliente'
		submitCustomerButtonText.value = 'AGREGAR CLIENTE'
		enableEdit.value = true
		resetForm({values: customerData.value})
	}
})

watch(tpt, () => {
	if (tpt.value == 1 || tpt.value == 2) {
		getRegimenFiscal()
		getCFDIUsage()
	}
})

watch(enableEdit, () => {
	if(enableEdit.value == true) {
		router.push({name: 'customerEdit', params:{id: customerId.value}, query: {edit: true}})
	} else {
		router.push({name: 'customerEdit', params:{id: customerId.value}})
	}
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

function getPostalCode(e) {
	let postalCode = e.target.value
	displayLocationOptions.value = false
	displayMunicipiosOptions.value = false
	displayColoniasOptions.value = false
	if (postalCode.length == 5 || postalCode.length == 4) {
		if(!customerId.value) {
			resetForm({values: customerData.value})
			useFieldModel('postal_code', postalCode)
			postalCodeData.value = pCodeData()
		}
		new apiRequest()
			.Get(
				{
					module: 'locations/postal-codes',
					params: '?include=municipios,localidades,colonias'
				},
				postalCode
			)
			.then(response => {
				postalCodeData.value = response.data.data
				useFieldModel('state_code', response.data.data.pc_state_code)
			})
			.catch(error => {
				console.log(error)
				postalCodeData.value = pCodeData()
				store.push_alert(error.data)
			})
	}
}

function getMetodoPago() {
	new apiRequest().Get({
		module: "cfdi/payment-methods"
	}).then(response => {
		paymentMethods.value = response.data.data
	}).catch(error => {
		paymentMethods.value = []
	})
}

getMetodoPago()

function getFormaPago() {
	new apiRequest().Get({
		module: "cfdi/payment-types"
	}).then(response => {
		paymentTypes.value = response.data.data
	}).catch(error => {
		paymentTypes.value = []
	})
}

getFormaPago()

function getCFDIUsage() {
	let tipoContribuyenteString = tpt.value == 1 ? 'persona_fisica=ist:true' : 'persona_moral=ist:true'
	new apiRequest().Get({
		module: "cfdi/cfdi-usage",
		params: `?${tipoContribuyenteString}`
	}).then(response => {
		CFDIUsage.value = response.data.data
	}).catch(error => {
		CFDIUsage.value = []
	})
}

function getCustomer() {
	new apiRequest().Get({
		module: 'customers'
	}, customerId.value)
		.then(r => {
			resetForm({values: r.data.data})
			tpt.value = r.data.data.tax_payer_type
			postalCodeData.value.postal_code = r.data.data.postal_code
			getPostalCode({
				target: {
					value: r.data.data.postal_code
				}
			})
		}).catch(e => {
			console.log(e)
			store.push_alert(e.data)
			//router.push({
			//	name: 'customerAdd'
			//})
		})
}

function customerDelete() {

}

const onSubmit = handleSubmit(values => {
	new apiRequest().Post({
		module: 'customers',
		data: values
	}).then(response => {
		store.push_alert(response.data)
		router.push({
			name: 'customerList',
			params: {id: respose.data.data.customer_id}
		})
	}).catch(error => {
		store.push_alert(error.data)
	})
})
</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_section.sass"
</style>
