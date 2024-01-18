<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--verywide">
					<h1 class="section__title" v-text="sectionTitle"></h1>
					<span class="section__help-text">Agrega los productos y servicios para tus comprobantes fiscales de ingresos en esta seccion, ya los tendrás listos al momento de generar tu comprobante fiscal</span>

					<div class="section__options">
						<button class="btn btn__transparent btn--small" @click.prevent="enableEdit = true">
							<span class="material-symbols-outlined">edit_square</span>
							Editar producto/servicio
						</button>

						<button class="btn btn__transparent btn--small" @click.prevent="confirmDelete = true">
							<span class="material-symbols-outlined">delete</span>
							Eliminar producto/servicio
						</button>
					</div>
					<confirmation-popup :data="productDeleteConfirmationData" @confirmed="productDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					
					<Form @submit="onSubmit" class="form" :initial-values="productForm" :validation-schema="productValidateSchema" v-slot="{ values, setErrors }" v-if="productForm">
						<h2 class="form__section-title">Datos generales</h2>

						<div class="form__container-group">

							<div class="form__container form__container--half">
								<label class="form__label form__label--required" for="name">Nombre del producto o servicio</label>
								<Field class="form__input" id="name" name="name" placeholder="Nombre del producto / servicio"/>
								<ErrorMessage name="name" class="form__alert" data-field="name"/>
							</div>

							<div class="form__container form__container--small">
								<label class="form__label" for="sku">SKU</label>
								<Field class="form__input" id="sku" name="sku" placeholder="SKU del producto / servicio"/>
								<ErrorMessage name="sku" class="form__alert" data-field="sku"/>
							</div>

							<div class="form__container form__container--half">
								<label class="form__label form__label--required" for="description">Descripción del producto / servicio</label>
								<Field class="form__input" id="description" name="description" placeholder="Descripción del producto / servicio"/>
								<ErrorMessage name="description" class="form__alert" data-field="description"/>
							</div>

							<div class="form__container form__container--small">
								<label class="form__label form__label--required" for="code">Código SAT</label>
								<input-autocomplete :requestParams="satCodesRequestParams" :textField="'code'" :optionText="['code', 'description']" placeholderText="Buscar código" @option="v => (satCode = v)"></input-autocomplete>
								<ErrorMessage name="code" class="form__alert" data-field="code"/>
							</div>

						</div>

						<input v-if="enableEdit" class="btn btn__default btn--regular" type="submit" value="Agregar producto / servicio">
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
import { useRouter, useRoute } from 'vue-router'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import inputAutocomplete from '../partials/input-autocomplete.vue'
import confirmationPopup from '../partials/confirmation_popup.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const productData = function() {
	return {	
		tax_payer_type: null,
		razon_social: null,
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
		cfdi_usage_id: null,
		alias: null,
		reference: null,
		email: null,
		phone: null,
		comments: null,
		tax_payer_ids: []
	}
}

const satCodesRequestParams = ref({
	module: 'products/sat-codes',
	params: `?fields=code,description` 
})

const productDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar este cliente? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)
const satCode = ref(null)
const productValidateSchema = yup.object().shape({
	rfc: yup.string().required().label('RFC').min(12).max(13).matches(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i),
	razon_social: yup.string().required().label('razón social'),
	tax_payer_type: yup.number().required().label('Tipo de contribuyente').integer(),
	regimen_fiscal: yup.string().required().label('régimen fiscal').min(3).max(3),
	postal_code: yup.number().required().label('código postal').min(1000).max(99999).integer().positive(),
	state_code: yup.string().required().label('Código del país').min(3).max(3),
	localidad: yup.string().label('localidad').max(100).nullable(),
	municipio: yup.string().label('municipio').max(100).nullable(),
	colonia: yup.string().label('colonia').max(100).nullable(),
	street: yup.string().label('calle').max(150).nullable(),
	external_number: yup.string().label('número exterior').max(50).nullable(),
	internal_number: yup.string().label('número interior').max(50).nullable(),
	payment_method_id: yup.number().label('método de pago').nullable().integer().positive(),
	payment_type_id: yup.number().label('forma de pago').nullable().integer().positive(),
	cfdi_usage_id: yup.number().label('uso del CFDI').nullable().integer().positive(),
	alias: yup.string().label('alias').max(50),
	reference: yup.string().label('contacto de referencia').max(150).nullable(),
	phone: yup.string().label('número telefónico').max(20).nullable(),
	email: yup.string().email().label('correo electrónico').nullable().max(100),
	comments: yup.string().label('comentarios').nullable(),
	tax_payer_ids: yup.array().ensure()
})

const productForm = ref(null)
const submitButtonText = ref('Registrar dirección')
const displaySATCodeOptions = ref(false)
const enableEdit = ref(false)
const sectionTitle = ref('Agregar nuevo producto o servici o servicio')

onMounted(() => {
	if(route.name == 'customerView' && route.params.id > 0) {
		productId.value = route.params.id
		sectionTitle.value = 'Editar información del producto o servicio'
		//getProduct()
	} else {
		sectionTitle.value = 'Agregar nuevo producto o servicio'
		enableEdit.value = true
		productForm.value = productData()
	}
})

function productDelete() {

}

function onSubmit(values, action) {
	new apiRequest().Post({
		module: 'customers',
		data: values
	}).then(response => {
		store.push_alert(response.data)
		router.push({
			name: 'customerView',
			params: {id: respose.data.data.customer_id}
		})
	}).catch(error => {
		store.push_alert(error.data)
	})
}
</script>
