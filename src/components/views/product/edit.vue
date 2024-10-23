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
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="enableEdit = true">
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

								<div class="form__container form__container--small">
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
									<Field as="select" class="form__select" id="category_id" name="category_id" v-model="category_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
										<option disabled value="">Selecciona la categoría del producto</option>
										<option v-for="category in categories" :value="category.id">{{ category.name }}</option>
									</Field>
									<ErrorMessage name="category_id" class="form__alert" data-field="category_id"/>
								</div>	

								<div class="form__container form__container--small">
									<label class="form__label form__label--required" for="type_id">Tipo de producto</label>
									<Field as="select" class="form__select" id="type_id" name="type_id" v-model="type_id" :disabled="!enableEdit" :class="{'form__select--disabled': !enableEdit}">
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

								<div class="form__container form__container--small">
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
										<Field class="form__input" id="unit_code" placeholder="Unidad de medida" name="unit_code" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" v-model="unitCode"/>
										<button class="form__search-button" @click.prevent="toggleSearchUnit = !toggleSearchUnit" v-if="enableEdit">
											<icon-set icon="lens-add"/>
										</button>
									</div>
									<ErrorMessage name="unit_code" class="form__alert" data-field="unit_code"/>
								</div>

								<div class="form__container form__container--small">
									<label class="form__label form__label--required" for="code">Código SAT</label>
									<div class="form__search">
										<Field class="form__input" id="code" placeholder="Código SAT" name="code" v-model="satCode" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
										<button class="form__search-button" @click.prevent="toggleSearchSatCode = !toggleSearchSatCode" v-if="enableEdit">
											<icon-set icon="lens-add"/>
										</button>
									</div>
									<ErrorMessage name="code" class="form__alert" data-field="code"/>
								</div>

							</div>

							<button v-if="enableEdit" class="btn btn__default btn--small btn__default--primary" type="submit">
								<icon-set icon="upload" />
								<span>{{formSubmitText}}</span>
							</button>
							<button v-if="enableEdit" class="btn btn__outlined btn--small btn__outlined--primary" @click.prevent="enableEdit = false">
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
import { useRouter, useRoute } from 'vue-router'
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
const productId = ref(null)
const unitCode = ref(null)
const satCode = ref(null)
const price = ref(0)
const discountPrice = ref(0)
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
		price: null,
		type_id: null,
		discount_price: null
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

onMounted(() => {
	initModule()
})

watch(() => route.path, () => {
	initModule()
})

function productDelete() {

}

function initModule() {
	if(route.name == 'productEdit' && route.params.id > 0) {
		productId.value = route.params.id
		formSubmitText.value = 'Actualizar'
		sectionTitle.value = 'Editar información del producto o servicio'
		console.log(route.query)
		if(route.query.edit == "true") {
			enableEdit.value = true
		} else {
			enableEdit.value = false
		}
		getProduct()
	} else {
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
		price.value = response.data.data.price
		discountPrice.value = response.data.data.discount_price
	}).catch(error => {
		store.push_alert(response.data)
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
getCategories()

function getProductTypes() {
	new apiRequest().Get({
		module: 'products/types'
	}).then(response => {
		product_types.value = response.data.data
	}).catch(error => {
		store.push_alert(response.data)
	})
}
getProductTypes()

function onSubmit(values, action) {
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
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_section.sass"
</style>
