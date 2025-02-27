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
											<input-autocomplete :requestParams="customerRequestParams" :textField="'razon_social'" placeholderText="Buscar cliente" @option="v => (customerData = v)" :optionText="['rfc', 'razon_social']" />
											<Field id="customer_id" name="customer_id" type="hidden" v-model="customerData.id"/>
										</div>
									</div>
								</div>
								<h2 class="form__section-title">Datos fiscales</h2>

								<div class="form__container-group" v-if="customerData.id">
									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="MetodoPago">Método de pago</label>
										<Field class="form__select" as="select" id="MetodoPago" name="MetodoPago" v-model="cfdi.MetodoPago">
											<option hidden value="">Selecciona el método de pago</option>
											<option v-for="pm in paymentMethods" :value="pm.code">{{pm.code}} - {{pm.description}}</option>
										</Field>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="FormaPago">Forma de pago</label>
										<Field class="form__select" as="select" id="FormaPago" name="FormaPago" v-model="cfdi.FormaPago">
											<option hidden value="">Selecciona el tipo de pago</option>
											<option v-for="pt in paymentTypes" :value="pt.code">{{pt.code}} - {{pt.name}}</option>
										</Field>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="cfdi_usage">Uso del CFDI</label>
										<Field class="form__select" as="select" id="cfdi_usage" name="cfdi_usage" v-model="cfdi.cfdi_usage">
											<option hidden value="">Selecciona el uso del CFDI</option>
											<option v-for="cu in cfdiUsage" :value="cu.code">{{cu.code}} - {{cu.name}}</option>
										</Field>
									</div>

									<div class="form__container form__container--half">
										<label class="form__label form__label--required" for="TipoRelacion">Tipo de relación del CFDI</label>
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
								<div v-if="products.length > 0">
									<button class="btn btn__default btn__default--primary btn--smaller" @click.prevent="products.push(productData())">
										<icon-set icon="add"/>
										<span class="btn__text">Agregar producto</span>
									</button>
									<div class="invoice__product" v-for="(product,index) in products" :key="index">
										<div class="form__container-group">
											
											<div class="form__container form__container--smaller">
												<label class="form__label form__label--required" for="name">Producto</label>
												<input-autocomplete :requestParams="productRequestParams" :textField="'name'" placeholderText="Producto" @option="v => setProduct(v, index)" :optionText="['code', 'name']" />
											</div>

											<div class="form__container form__container--micro">
												<label class="form__label form__label--required" for="qty">Unidades</label>
												<input class="form__input" type="number" name="qty" id="qty" placeholder="Cantidad" v-model="product.qty" @change="updateProduct(index)">
											</div>

											<div class="form__container form__container--tinier">
												<label class="form__label" for="price">Valor unitario</label>
												<input class="form__input" type="text" name="price" id="price" placeholder="Valor unitario" v-model="product.price" readonly>
											</div>

											<div class="form__container form__container--micro">
												<label class="form__label" for="taxes">Impuestos</label>
												<input class="form__input" type="text" name="taxes" id="taxes" placeholder="Impuestos" v-model="product.taxes" readonly>
											</div>

											<div class="form__container form__container--micro">
												<label class="form__label" for="percentaje_discount">% descuento</label>
												<input class="form__input" type="number" name="percentaje_discount" id="percentaje_discount" placeholder="% Descuento" v-model="product.percentaje_discount">
											</div>

											<div class="form__container form__container--micro">
												<label class="form__label" for="total_discount">Descuentos</label>
												<input class="form__input" type="text" name="total_discount" id="total_discount" placeholder="Descuentos" v-model="product.total_discount" readonly>
											</div>

											<div class="form__container form__container--tinier">
												<label class="form__label" for="subtotal">Subtotal</label>
												<input class="form__input" type="text" name="subtotal" id="subtotal" placeholder="subtotal" v-model="product.subtotal" readonly>
											</div>
										</div>
										<div class="invoice__options">
											<button class="btn btn__icon btn__icon--regular">
												<icon-set icon="edit"/>
											</button>

											<button class="btn btn__icon btn__icon--regular" @click.prevent="deleteProduct(index)">
												<icon-set icon="delete"/>
											</button>
										</div>
									</div>
								</div>
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
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import inputAutocomplete from '../partials/input-autocomplete.vue'

const store = useAppStore()

const taxPayerId = ref(null)
const paymentMethods = ref([])
const paymentTypes = ref([])
const cfdiUsage = ref([])
const relationTypes = ref([])
const customerRequestParams = ref({
	module: 'customers',
	params: `?fields=id,razon_social,tax_payer_type,regimen_fiscal,payment_type_id,payment_method_id,cfdi_usage_id,rfc` 
})
const productRequestParams = ref({
	module: 'products/products'
})
const displayCustomerOptions = ref(false)
const cfdi = ref({
	customer_id: null,
	tax_payer_id: null,
	cfdi_usage: null,
	MetodoPago: null,
	FormaPago: null,
	TipoRelacion: null,
	UUID: null
})
const customerData = ref({
	razon_social: null,
	id: null
})

const taxes = ref([])

const productData = function() {
	return {
		name: null,
		qty: 1,
		description: null,
		price: 0,
		discount_price: 0,
		taxes: 0,
		percentaje_discount: 0,
		subtotal: 0,
		total_discount: 0
	}
}

const products = ref([])

const cfdiValidateSchema = {}

const contribuyentes = computed(() => {
	return store.company != null ? store.company : null
})

onMounted(() => {
	products.value.push(productData())
})

watch(customerData, () => {
	if(customerData.value.id) {
		cfdi.value.FormaPago = customerData.value.payment_type_id
		cfdi.value.MetodoPago = customerData.value.payment_method_id
		cfdi.value.cfdi_usage = customerData.value.cfdi_usage_id
		getCFDIUsage()
		getPaymentMethods()
		getTipoRelacion()
	}
})

watch(products, () => {

})

watch(cfdi.value, () => {
	if(cfdi.value.MetodoPago == 'PPD') {
		cfdi.value.FormaPago = '99'
		getPaymentTypes('PPD')
	} else {
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

function getPaymentTypes(method = null) {
	let params = ''
	if(method == 'PPD') {
		params = '?code=eq:99'
	}
	new apiRequest().Get({
		module: 'cfdi/payment-types',
		params: params
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

function getTipoRelacion() {
	new apiRequest().Get({
		module: 'cfdi/relation-type'
	}).then(response => {
		relationTypes.value = response.data.data
	}).catch(error => {
		console.log(error.data)
		relationTypes.value = []
	})
}

function deleteProduct(index) {
	products.value.splice(index, 1)
}

function updateProduct(index) {
	setProductTotal(products.value[index], products.value[index].Cantidad).then(response => {
		products.value[index] = {
			concepto: {
				Name: p.name,
				Cantidad: 1,
				Descripcion: p.description,
				Importe: response.unit_price,
				Subtotal: response.subtotal,
				Descuento: response.discount,
				PorcentajeDescuento: 0
			},
			impuestos: {
				Total: response.taxes
			}
		}
	})
}

function setProduct(p, index) {
	products.value[index] = p
	setProductTotal(p).then(response => {
		products.value[index].qty = 1
		products.value[index].amount = response.unit_price
		products.value[index].subtotal = response.subtotal
		products.value[index].total_discount = response.total_discount
		products.value[index].percentaje_discount = response.percentaje_discount
		products.value[index].taxes = response.taxes
	})	
}

function setProductTotal(p, qty = 1) {
	return new Promise((resolve, reject) => {
		let discount = 0
		let unit_price = p.discount_price > 0 ? p.discount_price : p.price
		if(p.discount_price > 0) {
			discount = (p.price - p.discount_price) * qty
		}
		let iva_trasladado = 0
		let ieps_trasladado = 0
		let iva_retenido = 0
		let subtotal = unit_price * qty
		if(p.iva_trasladado > 0) {
			iva_trasladado = parseFloat(p.iva_trasladado_amount) * subtotal
		}
		if(p.ieps_trasladado > 0) {
			ieps_trasladado = parseFloat(p.ieps_trasladado_amount) * subtotal
		}
		if(p.iva_retenido > 0 && p.iva_trasladado > 0) {
			iva_retenido = parseFloat(p.iva_retenido_amount) * iva_trasladado
		}
		let taxes = (iva_trasladado - iva_retenido) + ieps_trasladado
		let product = {
			unit_price: parseFloat(unit_price).toFixed(p.currency_decimals),
			discount: discount.toFixed(p.currency_decimals),
			subtotal: subtotal.toFixed(p.currency_decimals),
			taxes: taxes.toFixed(p.currency_decimals)
		}
		resolve(product)
	})	
}

// TODO: HACER QUE EL ALIAS DE CLIENTE TENGA COMO MINIMO 3 CARACTERES
function onSubmit() {

}

</script>

<style lang="sass" scoped>
	@use "../../assets/sass/components/_widgets"
	@use '../../assets/sass/components/_invoice'
</style>
