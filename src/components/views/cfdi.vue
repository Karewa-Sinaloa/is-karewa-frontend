<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--full-wide">
					<div class="section__top">
						<h1 class="section__title">Crear nuevo comprobante</h1>
						<span class="section__help-text">Quam. Fusce feugiat pede vel quam. In et augue. Lorem ipsum dolor sit amet, consectetuer adipiscing.</span>
					</div>
					<div class="section__content">
						<Form class="form" @submit="onSubmit" v-if="contribuyentes">
							<fieldset class="form__fieldset">

								<div class="form__container-group">
									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="tax_payer_id">Contribuyente</label>
										<select class="form__select" id="tax_payer_id" name="tax_payer_id" v-bind="taxPayerId" v-model="tax_payer_id">
											<option value="" disabled>Selecciona la cuenta de facturación</option>
											<option v-for="contribuyente in contribuyentes" :value="contribuyente.id">{{ contribuyente.rfc }} - {{ contribuyente.razon_social }}</option>
										</select>
										<span name="tax_payer_id" class="form__alert" data-field="tax_payer_id">{{errors.tax_payer_id}}</span>
									</div>

									<div v-if="tax_payer_id">
										<div class="form__container form__container--half" @focusout="displayCustomerOptions = false" @focusin="displayCustomerOptions = true">
											<label class="form__label form__label--required" for="customer_id">Cliente</label>
											<input-autocomplete :requestParams="customerRequestParams" :textField="'razon_social'" placeholderText="Buscar cliente" @option="(v) => setCustomerData(v)" :optionText="['rfc', 'razon_social']" />
											<input id="customer_id" name="customer_id" type="hidden" v-bind="customerId" v-model="customer_id">
											<span name="customer_id" class="form__alert" data-field="customer_id">{{errors.customer_id}}</span>
										</div>
									</div>
								</div>
								<h2 class="form__section-title">Datos fiscales</h2>

								<div class="form__container-group" v-if="customerData.id">
									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="payment_method">Método de pago</label>
										<select class="form__select" id="payment_method" name="MetodoPago" v-model="MetodoPago" @change="getPaymentTypes(MetodoPago, FormaPago)" v-bind="metodoDePago">
											<option hidden value="">Selecciona el método de pago</option>
											<option v-for="pm in paymentMethods" :value="pm.code">{{pm.code}} - {{pm.description}}</option>
										</select>
										<span name="payment_method" class="form__alert" data-field="payment_method">{{errors.MetodoPago}}</span>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="payment_type">Forma de pago</label>
										<select class="form__select" id="payment_type" name="FormaPago" v-model="FormaPago" v-bind="FormaPago">
											<option hidden value="">Selecciona el tipo de pago</option>
											<option v-for="pt in paymentTypes" :value="pt.code">{{pt.code}} - {{pt.name}}</option>
										</select>
										<span name="payment_type" class="form__alert" data-field="payment_type">{{errors.FormaPago}}</span>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="cfdi_usage_id">Uso del CFDI</label>
										<select class="form__select" id="cfdi_usage_id" name="cfdi_usage_id" v-model="cfdi_usage_id" v-bind="cfdiUsageId">
											<option hidden value="">Selecciona el uso del CFDI</option>
											<option v-for="cu in cfdiUsage" :value="cu.code">{{cu.code}} - {{cu.name}}</option>
										</select>
										<span name="cfdi_usage_id" class="form__alert" data-field="cfdi_usage_id">{{errors.cfdi_usage_id}}</span>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label" for="TipoRelacion">Tipo de relación del CFDI</label>
										<Field class="form__select" as="select" id="TipoRelacion" name="TipoRelacion" v-model="cfdi.TipoRelacion">
											<option hidden value="">Selecciona la relación del CFDI</option>
											<option v-for="rt in relationTypes" :value="rt.code">{{rt.code}} - {{rt.name}}</option>
										</Field>
									</div>

									<div class="form__container form__container--half" v-if="cfdi.TipoRelacion">
										<label class="form__label form__label--required" for="UUID">UUID del comprobante relacionado</label>
										<Field class="form__input" name="UUID" id="UUID" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
									</div>
								</div>
								<h2 class="form__section-title">Productos y/o servicios</h2>
								<div>
									<button class="btn btn__default btn__default--primary btn--smaller" @click.prevent="cfdi.products.push({})">
										<icon-set icon="add"/>
										<span class="btn__text">Agregar producto</span>
									</button>
									<template v-for="(product, index) in fields" :key="product.key">
										<item-component @invoiceItem="(v) => setProductItem(index, v)" @deleteItem="deleteProduct(index)"/>
									</template>
								</div>
								<div class="cfdi__totals">
									<h2 class="form__section-title">Totales</h2>
									<div class="cfdi__detail" v-if="totals.taxes">
										<div class="cfdi__detail-row">
											<p class="cfdi__detail-field">Subtotal:</p>
											<p class="cfdi__detail-amount">{{setCurrencyAmounts(totals.subtotal)}}</p>
										</div>
										<div class="cfdi__detail-row">
											<p class="cfdi__detail-field">Descuentos:</p>
											<p class="cfdi__detail-amount">{{setCurrencyAmounts(totals.discount)}}</p>
										</div>
										<div class="cfdi__detail-row">
											<p class="cfdi__detail-field">Impuestos:</p>
											<p class="cfdi__detail-amount">{{setCurrencyAmounts(totals.taxes.total)}}</p>
										</div>
										<div class="cfdi__detail-row cfdi__detail-row--tax" v-if="totals.taxes.transferred.iva > 0">
											<p class="cfdi__detail-field">IVA trasladado:</p>
											<p class="cfdi__detail-amount">{{setCurrencyAmounts(totals.taxes.transferred.iva)}}</p>
										</div>
										<div class="cfdi__detail-row cfdi__detail-row--tax" v-if="totals.taxes.transferred.ieps > 0">
											<p class="cfdi__detail-field">IEPS trasladado:</p>
											<p class="cfdi__detail-amount">{{setCurrencyAmounts(totals.taxes.transferred.ieps)}}</p>
										</div>
									</div>
								</div>
								<button class="btn btn--regular btn__default btn__default--primary">FACTURAR AHORA</button>
							</fieldset>
						</Form>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage, useFieldArray, useForm } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import inputAutocomplete from '../partials/input-autocomplete.vue'
import itemComponent from '../partials/cfdi_item.vue'

const store = useAppStore()

const paymentMethods = ref([])
const paymentTypes = ref([])
const cfdiUsage = ref([])
const relationTypes = ref([])
const customerRequestParams = ref({
	module: 'customers',
	params: `?fields=id,razon_social,tax_payer_type,regimen_fiscal,payment_type_id,payment_method_id,cfdi_usage_id,rfc` 
})
const displayCustomerOptions = ref(false)

const cfdi = ref({
	customer_id: null,
	tax_payer_id: null,
	cfdi_usage_id: null,
	MetodoPago: null,
	FormaPago: null,
	TipoRelacion: null,
	UUID: null,
	products: []
})

const cfdiValidateSchema = yup.object().shape({
	tax_payer_id: yup.number().required().positive().integer().label('Emisor'),
	customer_id: yup.number().required().positive().integer().label('Receptor'),
	MetodoPago: yup.string().required().length(3).label('Método de pago'),
	FormaPago: yup.number().required().positive().integer().label('Forma de pago'),
	cfdi_usage_id: yup.string().required().min(3).max(4).label('Uso del CFDI'),
	//taxpayer_type: yup.string().required().label('Tipo de contribuyente'),
	//regimen_fiscal: yup.string().required().label('régimen fiscal').length(3),
	//cer: yup.string().when(['key', 'companyValidateSchema'], {is: (value) => value != null, then: (schema) => schema.required(), otherwise: (schema) => schema.nullable()}).label('archivo de clave privada .CER'),
	//key: yup.string().label('archivo de certificado .KEY').when(['cer', 'companyValidateSchema'], {is: (value) => value != null, then: (schema) => schema.required(), otherwise: (schema) => schema.nullable()})
})

const {handleSubmit, defineField, errors, setFieldValue} = useForm({
	initialValues: {
		customer_id: null,
		tax_payer_id: null,
		cfdi_usage_id: null,
		MetodoPago: null,
		FormaPago: null,
		TipoRelacion: null,
		UUID: null,
		products: [{}]
	},
	validationSchema: cfdiValidateSchema
})

const [tax_payer_id, taxPayerId] = defineField('tax_payer_id')
const [customer_id, customerId] = defineField('customer_id')
const [cfdi_usage_id, cfdiUsageId] = defineField('cfdi_usage_id')
const [MetodoPago, metodoDePago] = defineField('MetodoPago')
const [FormaPago, formaDePago] = defineField('FormaPago')
const [TipoRelacion, tipoDeRelacion] = defineField('TipoRelacion')
const [UUID, uuid] = defineField('UUID')

const {push, remove, fields, insert, update} = useFieldArray('products')

const customerData = ref({
	razon_social: null,
	id: null
})

const currencyParameters = ref({
	code: import.meta.env.VITE_CURRENCY_CODE,
	locale: import.meta.env.VITE_CURRENCY_LOCALE,
	decimals:import.meta.env.VITE_CURRENCY_DECIMALS
})

const totals = ref({})

const taxes = ref([])

const contribuyentes = computed(() => {
	return store.company != null ? store.company : null
})

watch(cfdi.value.products, () => {
	sumarizeTotals()
})

function getPaymentMethods() {
	new apiRequest().Get({
		module: 'cfdi/payment-methods'
	}).then(response => {
		paymentMethods.value = response.data.data
		getPaymentTypes()
	}).catch(error => {
		paymentMethods.value = []
	})
}

function getPaymentTypes(method = null, forma = null) {
	let params = ''
	if(!method || method=== undefined) {
		method = customerData.value.payment_method_id
	}
	if(method == 'PPD') {
		params = '?code=eq:99'
		setFieldValue('FormaPago', 99)
	} else {
		params = '?code=ne:99'
		if(forma == 99) {
			setFieldValue('FormaPago', null)
		}
	}
	new apiRequest().Get({
		module: 'cfdi/payment-types',
		params: params
	}).then(response => {
		paymentTypes.value = response.data.data
	}).catch(error => {
		paymentTypes.value = []
	})
}

function getCFDIUsage() {
	let persona = customerData.value.tax_payer_type == 2 ? 'persona_moral' : 'persona_fisica'
	let qryParams = `?fields=id,code,name&${persona}=ist:true&recipient_regimen_fiscal=any:${customerData.value.regimen_fiscal}`
	new apiRequest().Get({
		module: 'cfdi/cfdi-usage',
		params: qryParams
	}).then(response => {
		cfdiUsage.value = response.data.data
		let u = false
		response.data.data.forEach(usage => {
			if(Object.values(usage).indexOf(customerData.value.cfdi_usage_id) > -1) {
				u = true
			}
		})
		if(u === false) {
			setFieldValue('cfdi_usage_id', null)

		}
	}).catch(error => {
		cfdiUsage.value = []
		console.log(error)
	})	
}

function getTipoRelacion() {
	new apiRequest().Get({
		module: 'cfdi/relation-type'
	}).then(response => {
		relationTypes.value = response.data.data
	}).catch(error => {
		relationTypes.value = []
	})
}

function deleteProduct(index) {
	cfdi.value.products.splice(index, 1)
}


function sumarizeTotals() {
	totals.value = {
		subtotal: 0.00,
		discount: 0.00,
		taxes: {
			retentions: {
				iva: 0.00,
				isr: 0.00,
				ieps: 0.00,
				total: 0.00
			},
			transferred: {
				iva: 0.00,
				isr: 0.00,
				ieps: 0.00,
				total: 0.00
			},
			total: 0.00
		}
	}
	if(cfdi.value.products) {
		cfdi.value.products.forEach(product => {
			if(product.value) {
				totals.value.subtotal = totals.value.subtotal + parseFloat(product.value.concepto.ValorUnitario)
				totals.value.discount = totals.value.discount + parseFloat(product.value.concepto.Descuento)
				totals.value.taxes.transferred.iva = totals.value.taxes.transferred.iva + parseFloat(product.value.Impuestos.Traslados.iva.Importe)
				totals.value.taxes.transferred.ieps = totals.value.taxes.transferred.ieps + parseFloat(product.value.Impuestos.Traslados.ieps.Importe)
				totals.value.taxes.transferred.total = totals.value.taxes.transferred.total + (totals.value.taxes.transferred.iva + totals.value.taxes.transferred.ieps)
				totals.value.taxes.total = totals.value.taxes.total + totals.value.taxes.transferred.total
			}
		})
	}
}

function setCurrencyAmounts(amount) {
	if(amount && amount >= 0) {
		return amount.toLocaleString(currencyParameters.value.locale, {
			minimumFractionDigits: currencyParameters.value.decimals,
			style: 'currency',
			currency: currencyParameters.value.code
		})
	} else {
		return (0).toLocaleString(currencyParameters.value.locale, {
			minimumFractionDigits: currencyParameters.value.decimals,
			style: 'currency',
			currency: currencyParameters.value.code
		})
	}
}

function setCustomerData(v) {
	customerData.value = v
	setFieldValue('customer_id', v.id)
	setFieldValue('MetodoPago', v.payment_method_id)
	setFieldValue('FormaPago', v.payment_type_id)
	setFieldValue('cfdi_usage_id', v.cfdi_usage_id)
	getCFDIUsage()
	getPaymentMethods()
	getTipoRelacion()
}

function setProductItem(index, v) {
	if(!fields.value[index]) {
		insert(index, v.value)
	} else {
		update(index, v.value)
	}

}

// TODO: HACER QUE EL ALIAS DE CLIENTE TENGA COMO MINIMO 3 CARACTERES
const onSubmit = handleSubmit(values => {
	console.log(values)
	new apiRequest().Post({
		module: 'cfdi/generate',
		data: values
	}).then(response => {
		store.push_alert(response.data)
		//router.push({
		//	name: 'customerList',
		//	params: {id: respose.data.data.customer_id}
		//})
	}).catch(error => {
		console.log(error)
		store.push_alert(error.data)
	})
})

</script>

<style lang="sass">
	@use "../../assets/sass/components/_widgets"
	@use '../../assets/sass/components/_invoice'
	@use '../../assets/sass/components/_cfdi'
</style>
