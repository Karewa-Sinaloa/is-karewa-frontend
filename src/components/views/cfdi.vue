<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--verywide">
					<h1 class="section__title">Crear nuevo comprobante</h1>
					<span class="section__help-text">Quam. Fusce feugiat pede vel quam. In et augue. Lorem ipsum dolor sit amet, consectetuer adipiscing.</span>
					<Form class="form" @submit="onSubmit" v-if="contribuyentes" :initial-values="cfdi" :validation-schema="cfdiValidateSchema" v-slot="{ values, setErrors }">
						<fieldset class="form__fieldset">

							<div class="form__container-group">
								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="tax_payer_id">Contribuyente</label>
									<Field class="form__select" as="select" id="tax_payer_id" name="tax_payer_id" v-model="taxPayerId">
										<option value="" disabled>Selecciona la cuenta de facturación</option>
										<option v-for="contribuyente in contribuyentes" :value="contribuyente.id">{{ contribuyente.rfc }} - {{ contribuyente.razon_social }}</option>
									</Field>
								</div>

								<div v-if="taxPayerId">
									<div class="form__container form__container--half" @focusout="displayCustomerOptions = false" @focusin="displayCustomerOptions = true">
										<label class="form__label form__label--required" for="razon_social">Cliente</label>
										<input-autocomplete :requestParams="customerRequestParams" :textField="'razon_social'" placeholderText="Buscar cliente" @option="v => (customerData = v)"></input-autocomplete>
										<Field id="customer_id" name="customer_id" type="hidden" v-model="customerData.id"/>
									</div>
								</div>
							</div>
							<h2 class="form__section-title">Datos fiscales</h2>

							<div class="form__container-group" v-if="customerData.id">
								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="payment_method">Método de pago</label>
									<Field class="form__select" as="select" id="payment_method" name="payment_method">
										<option hidden value="">Selecciona el método de pago</option>
										<option v-for="pm in paymentMethods" :value="pm.code">{{pm.code}} - {{pm.description}}</option>
									</Field>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="payment_type">Forma de pago</label>
									<Field class="form__select" as="select" id="payment_type" name="payment_type">
										<option hidden value="">Selecciona el tipo de pago</option>
										<option v-for="pt in paymentTypes" :value="pt.code">{{pt.code}} - {{pt.name}}</option>
									</Field>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="cfdi_usage">Uso del CFDI</label>
									<Field class="form__select" as="select" id="cfdi_usage" name="cfdi_usage">
										<option hidden value="">Selecciona el uso del CFDI</option>
										<option v-for="cu in cfdiUsage" :value="cu.code">{{cu.code}} - {{cu.name}}</option>
									</Field>
								</div>
							</div>

						</fieldset>
					</Form>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import inputAutocomplete from '../partials/input-autocomplete.vue'

const store = useAppStore()

const taxPayerId = ref(null)
const paymentMethods = ref([])
const paymentTypes = ref([])
const cfdiUsage = ref([])
const customerRequestParams = ref({
	module: 'customers',
	params: `?fields=id,razon_social,tax_payer_type,regimen_fiscal,payment_type_id,payment_method_id,cfdi_usage_id` 
})
const displayCustomerOptions = ref(false)
const cfdi = ref({
	customer_id: null,
	tax_payer_id: null,
	cfdi_usage: null,
	payment_method: null,
	payment_type: null
})
const customerData = ref({
	razon_social: null,
	id: null
})

const cfdiValidateSchema = {}

const contribuyentes = computed(() => {
	return store.company != null ? store.company : null
})

watch(customerData, () => {
	if(customerData.value.id) {
		cfdi.value.payment_type = customerData.value.payment_type_id
		cfdi.value.payment_method = customerData.value.payment_method_id
		cfdi.value.cfdi_usage = customerData.value.cfdi_usage_id
		getCFDIUsage()
		getPaymentMethods()
		getPaymentTypes()
	}
})

function getPaymentMethods() {
	new apiRequest().Get({
		module: 'cfdi/payment-methods'
	}).then(response => {
		paymentMethods.value = response.data.data
	}).catch(error => {
		console.log(error)
		paymentMethods.value = []
	})
}

function getPaymentTypes() {
	new apiRequest().Get({
		module: 'cfdi/payment-types'
	}).then(response => {
		paymentTypes.value = response.data.data
	}).catch(error => {
		console.log(error)
		paymentTypes.value = []
	})
}

function getCFDIUsage() {
	let persona = customerData.value.tax_payer_type == 2 ? 'persona_moral' : 'persona_fisica'
	let qryParams = `?fields=id,code,name&${persona}=ist:true&recipient_regimen_fiscal=any:${customerData.value.regimen_fiscal}`
	console.log(qryParams)
	new apiRequest().Get({
		module: 'cfdi/cfdi-usage',
		params: qryParams
	}).then(response => {
		cfdiUsage.value = response.data.data
	}).catch(error => {
		console.log(error)
		cfdiUsage.value = []
	})
}

// TODO: HACER QUE EL ALIAS DE CLIENTE TENGA COMO MINIMO 3 CARACTERES
function onSubmit() {

}

</script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_widgets.sass"
</style>
