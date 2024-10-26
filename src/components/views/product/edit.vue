<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--verywide">
					<div class="section__top">
						<h1 class="section__title" v-text="sectionTitle"></h1>
						<span class="section__help-text">Agrega los productos y servicios para tus comprobantes fiscales de ingresos en esta seccion, ya los tendrás listos al momento de generar tu comprobante fiscal</span>

						<div class="section__options btn__grouped" v-if="!enableEdit">
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="router.push({name: 'productEdit', params: {id: productId}, query: {edit: true}})">
								<icon-set icon="edit" />
								Editar producto/servicio
							</button>

							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<icon-set icon="delete" />
								Eliminar producto/servicio
							</button>
						</div>
					</div>
					<confirmation-popup :data="productDeleteConfirmationData" @confirmed="productDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="productForm" :validation-schema="productValidateSchema" v-slot="{ values, setErrors }" v-if="productForm">
							<h2 class="form__section-title">Datos generales</h2>

							<div class="form__container-group">

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="name">Nombre del producto o servicio</label>
									<Field class="form__input" id="name" name="name" placeholder="Nombre del producto / servicio" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
									<ErrorMessage name="name" class="form__alert" data-field="name"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="sku">SKU</label>
									<Field class="form__input" id="sku" name="sku" placeholder="SKU del producto / servicio" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
									<ErrorMessage name="sku" class="form__alert" data-field="sku"/>
								</div>

								<div class="form__container form__container--full">
									<label class="form__label form__label--required" for="description">Descripción del producto / servicio</label>
									<Field class="form__input" id="description" name="description" placeholder="Descripción del producto / servicio" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
									<ErrorMessage name="description" class="form__alert" data-field="description"/>
								</div>	

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="category_id">Categoría del producto</label>
									<Field as="select" class="form__select" id="category_id" name="category_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
										<option disabled value="">Selecciona la categoría del producto</option>
										<option v-for="category in categories" :value="category.id">{{ category.name }}</option>
									</Field>
									<ErrorMessage name="category_id" class="form__alert" data-field="category_id"/>
								</div>	

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="type_id">Tipo de producto</label>
									<Field as="select" class="form__select" id="type_id" name="type_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
										<option disabled value="">Selecciona el tipo de producto</option>
										<option v-for="type in product_types" :value="type.id">{{ type.name }}</option>
									</Field>
									<ErrorMessage name="type_id" class="form__alert" data-field="type_id"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="price">Precio</label>
									<Field class="form__input" id="price" name="price" placeholder="Precio del producto o servicio" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" @keyup="price = onlyNumbers(price)" v-model="price"/>
									<ErrorMessage name="price" class="form__alert" data-field="price"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="discount_price">Precio de descuento</label>
									<Field class="form__input" id="discount_price" name="discount_price" placeholder="Precio de descuento del producto o servicio" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" @keyup="discountPrice = onlyNumbers(discountPrice)" v-model="discountPrice"/>
									<ErrorMessage name="discount_price" class="form__alert" data-field="discount_price"/>
								</div>

							</div>
							
							<h2 class="form__section-title">Información fiscal</h2>

							<div class="form__container-group">
								
								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="unit_code">
										Unidad de medida
										<help-icon :help_text="`Nombre de la unidad: <strong>${productForm.product_unit}.</strong><br><i>Es la unidad de medida que corresponde al producto, se utliza como referencia para el SAT</i>`"/>
									</label>
									<div class="form__search">
										<Field class="form__input" id="unit_code" placeholder="Unidad de medida" name="unit_code" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" v-model="unitCode" readonly />
										<button class="form__search-button" @click.prevent="toggleSearchUnit = !toggleSearchUnit" v-if="enableEdit">
											<icon-set icon="lens-add"/>
										</button>
									</div>
									<ErrorMessage name="unit_code" class="form__alert" data-field="unit_code"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="code">
										<help-icon :help_text="`Descripción: <strong>${productForm.sat_code_description}.</strong><br><i>Descripción del código del tipo de producto según el listado emitido por el SAT'</i>`"/>
										Código SAT
									</label>
									<div class="form__search">
										<Field class="form__input" id="code" placeholder="Código SAT" name="code" v-model="satCode" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" readonly />
										<button class="form__search-button" @click.prevent="toggleSearchSatCode = !toggleSearchSatCode" v-if="enableEdit">
											<icon-set icon="lens-add"/>
										</button>
									</div>
									<ErrorMessage name="code" class="form__alert" data-field="code"/>
								</div>

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="currency_id">Moneda</label>
									<Field as="select" class="form__select" id="currency_id" name="currency_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
									<option selected value="102">MXN - Peso mexicano</option>
									</Field>
									<ErrorMessage name="currency_id" class="form__alert" data-field="currency_id"/>
								</div>
								<h3 class="form__head2">IVA trasladado</h3>
								<span class="form__help-text">Selecciona el IVA trasladado que se aplicará a tu producto o servicio</span>

								<div class="form__container form__container--full form__container--checkbox">
									<label v-for="tax,key in ivaTrasladado" class="form__label form__label--checkbox" :for="`iva_trasladado_${key}`">
										<Field type="radio" :id="`iva_trasladado_${key}`" name="iva_trasladado" class="form__checkbox" :value="tax.id" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">{{tax.tax}} - {{changeToPercentaje(tax.max_value)}}</span>
									</label>

									<label class="form__label form__label--checkbox" for="iva_trasladado_none">
										<Field type="radio" id="iva_trasladado_none" name="iva_trasladado" class="form__checkbox" :value="null" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">No aplica</span>
									</label>
								</div>

								<h3 class="form__head2">IEPS trasladado</h3>
								<span class="form__help-text">Selecciona el IEPS trasladado que se aplicará a tu producto o servicio</span>

								<div class="form__container form__container--full form__container--checkbox">
									<label v-for="tax, key in iepsTrasladado" class="form__label form__label--checkbox" :for="`ieps_trasladado_${key}`">
										<Field type="radio" :id="`ieps_trasladado_${key}`" name="ieps_trasladado" class="form__checkbox" :value="tax.id" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">{{tax.tax}} - {{changeToPercentaje(tax.max_value)}}</span>
									</label>

									<label class="form__label form__label--checkbox" for="ieps_trasladado_none">
										<Field type="radio" id="ieps_trasladado_none" name="ieps_trasladado" class="form__checkbox" :value="null" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">No aplica</span>
									</label>
								</div>

								<h3 class="form__head2">IVA retenido</h3>
								<span class="form__help-text">Selecciona el IVA retenido que se aplicará a tu producto o servicio</span>

								<div class="form__container form__container--full form__container--checkbox">
									<label v-for="tax,key in ivaRetenido" class="form__label form__label--checkbox" :for="`iva_retenido_${key}`">
										<Field type="radio" :id="`iva_retenido_${key}`" name="iva_retenido" class="form__checkbox" :value="tax.id" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">{{tax.tax}} - {{changeToPercentaje(tax.max_value)}}</span>
									</label>

									<label class="form__label form__label--checkbox" for="iva_retenido_none">
										<Field type="radio" id="iva_retenido_none" name="iva_retenido" class="form__checkbox" :value="null" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}"/>
										<span class="form__label-checkbox">No aplica</span>
									</label>
								</div>	

							</div>

							<button v-if="enableEdit" class="btn btn__default btn--small btn__default--primary" type="submit">
								<icon-set icon="upload" />
								<span>{{formSubmitText}}</span>
							</button>
							<button v-if="enableEdit" class="btn btn__outlined btn--small btn__outlined--primary" @click.prevent="router.push({name: 'productEdit', params: {id: productId}})">
								<icon-set icon="close"/>
								Cancelar
							</button>
						</Form>
					</div>
				</section>
			</main>
		</div>
		<search-component v-if="toggleSearchSatCode" :requestParams="satCodesRequestParams" :fields="searchFields" @close="toggleSearchSatCode = false" @searchResults="setSatCode"></search-component>
		<search-component v-if="toggleSearchUnit" :requestParams="unitRequestParams" :fields="unitSearchFields" @close="toggleSearchUnit = false" @searchResults="setUnit"></search-component>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed, reactive } from 'vue'
import { useAppStore } from '../../../store/index.js'
import sidebarComponent from '../../partials/sidebar.vue'
import contentHeader from '../../partials/content_header.vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../../helpers/yup.locale.js'
import { apiRequest } from '../../../api/requests.js'
import inputAutocomplete from '../../partials/input-autocomplete.vue'
import confirmationPopup from '../../partials/confirmation_popup.vue'
import searchComponent from '../../partials/search.vue'
import helpIcon from '../../partials/help_icon.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const searchFields = ref([
	{
		id: 'code',
		name: 'Código'
	},
	{
		id: 'description',
		name: 'Descripción'
	}
])
const unitSearchFields = ref([
	{
		id: 'code',
		name: 'Código'
	},
	{
		id: 'name',
		name: 'Nombre'
	}
])
const currencyDecimals = ref(2)
const productId = ref(null)
const unitCode = ref(null)
const satCode = ref(null)
const price = ref((0).toFixed(currencyDecimals.value))
const discountPrice = ref((0).toFixed(currencyDecimals.value))
const toggleSearchSatCode = ref(false)
const toggleSearchUnit = ref(false)
const formSubmitText = ref('Añadir')
const productData = function() {
	return {	
		category_id: null,
		name: null,
		sku: null,
		code: null,
		description: null,
		unit_code: null,
		price: (0).toFixed(currencyDecimals.value),
		type_id: null,
		discount_price: (0).toFixed(currencyDecimals.value),
		iva_trasladado: null,
		ieps_trasladado: null,
		iva_retenido: null,
		currency_id: 102
	}
}
const categories = ref([])
const product_types = ref([])
const satCodesRequestParams = ref({
	module: 'products/sat-codes',
	params: `?fields=code,description` 
})
const unitRequestParams = ref({
	module: 'products/units',
	params: `?fields=code,name` 
})

const productDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar este cliente? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)
const productValidateSchema = yup.object().shape({
	name: yup.string().required().label('Nombre del producto').max(100),
	code: yup.string().required().label('Código SAT'),
	description: yup.string().label('Descripción del producto').nullable(),
	unit_code: yup.string().required().label('Unidad de medida'),
	category_id: yup.string().required().label('Categoría del producto'),
	price: yup.string().required().label('Precio del producto'),
	discount_price: yup.string().required().label('Descuento de precio del producto'),
	sku: yup.string().label('SKU').max(25).nullable(),
	type_id: yup.string().label('Tipo de producto').required()
})

const productForm = ref(null)
const displaySATCodeOptions = ref(false)
const displayUnitOptions = ref(false)
const enableEdit = ref(false)
const sectionTitle = ref('Agregar nuevo producto o servicio')
const ivaTrasladado = ref([])
const iepsTrasladado = ref([])
const ivaRetenido = ref([])

function changeToPercentaje(data) {
	return `${parseFloat(data * 100).toFixed(2)}%`
}

onMounted(() => {	
	initModule()
})

watch(() => route.fullPath, () => {
	initModule()
})

function productDelete() {
	new apiRequest().Delete({
		module: 'products/products'
	}, productId.value).then(
		response => {
			store.push_alert(response.data)
			router.push({
				name: 'productList'
			})
		}
	).catch(error => {
		store.push_alert(error.data)
	})
}

onBeforeRouteLeave (() => {
	productForm.value = null
	price.value = (0).toFixed(currencyDecimals.value)
	discountPrice.value = (0).toFixed(currencyDecimals.value)
	unitCode.value = null
	satCode.value = null
})

function initModule() {
	if(route.name == 'productEdit' && route.params.id > 0) {
		productId.value = route.params.id
		formSubmitText.value = 'Actualizar'
		sectionTitle.value = 'Editar información del producto o servicio'
		if(route.query.edit == "true") {
			enableEdit.value = true
		} else {
			enableEdit.value = false
		}
		store.new_elements([
			{
				name: 'productAdd',
				text: 'Agregar Producto'	
			}
		])
		getProduct()
	} else {
		store.new_elements([])
		formSubmitText.value = 'Añadir'
		sectionTitle.value = 'Agregar nuevo producto o servicio'
		enableEdit.value = true
		productForm.value = productData()
	}
}

function getProduct() {
	new apiRequest().Get({
		module: 'products/products'
	}, productId.value).then(response => {
		productForm.value = response.data.data
		unitCode.value = response.data.data.unit_code
		satCode.value = response.data.data.code
		price.value = parseFloat(response.data.data.price).toFixed(currencyDecimals.value)
		discountPrice.value = parseFloat(response.data.data.discount_price).toFixed(currencyDecimals.value)
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function getCategories() {
	new apiRequest().Get({
		module: 'products/categories'
	}).then(response => {
		categories.value = response.data.data
	}).catch(error => {
		store.push_alert(response.data)
	})
}

function getProductTypes() {
	new apiRequest().Get({
		module: 'products/types'
	}).then(response => {
		product_types.value = response.data.data
	}).catch(error => {
		store.push_alert(response.data)
	})
}

function onSubmit(values, action) {
	values.price = parseFloat(values.price).toFixed(currencyDecimals.value)
	values.discount_price = parseFloat(values.discount_price).toFixed(currencyDecimals.value)
	if(route.name == 'productEdit') {
		putProduct(values)
	} else{
		postProduct(values)
	}
}

function postProduct(values) {
	new apiRequest().Post({
		module: 'products/products',
		data: values
	}).then(response => {
		store.push_alert(response.data)
		router.push({
			name: 'productEdit',
			params: {id: response.data.data.id}
		})
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function onlyNumbers(price) {
	return price.replace(/[^0-9\.]/g, '')
}

function putProduct(values) {
	new apiRequest().Put({
		module: 'products/products',
		data: values
	}, productId.value).then(response => {
		store.push_alert(response.data)
		enableEdit.value  = false
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function setSatCode(response) {
	satCode.value = response.code
	toggleSearchSatCode.value = false
}

function setUnit(response) {
	unitCode.value = response.code
	toggleSearchUnit.value = false
}

function getIVATrasladado() {
	new apiRequest().Get({
		module: 'products/taxes',
		params: `?fields=id,tax_id,max_value,factor,type,tax&type=eq:Fijo&tax_id=eq:2&trasladado=ist:true&factor=eq:tasa`
	}).then(response => {
		ivaTrasladado.value = response.data.data
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function getIEPSTrasladado() {
	new apiRequest().Get({
		module: 'products/taxes',
		params: `?fields=id,tax_id,max_value,factor,type,tax&type=eq:Fijo&tax_id=eq:3&trasladado=ist:true&factor=eq:tasa`
	}).then(response => {
		iepsTrasladado.value = response.data.data
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function getIIVARetenido() {
	new apiRequest().Get({
		module: 'products/taxes',
		params: `?fields=id,tax_id,max_value,factor,type,tax&type=eq:Fijo&tax_id=eq:2&retenido=ist:true&factor=eq:tasa`
	}).then(response => {
		ivaRetenido.value = response.data.data
	}).catch(error => {
		store.push_alert(error.data)
	})
}

getCategories()
getProductTypes()
getIVATrasladado()
getIEPSTrasladado()
getIIVARetenido()

</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_section.sass"
</style>
