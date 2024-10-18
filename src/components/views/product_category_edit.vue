<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--verywide">
					<div class="section__top">
						<h1 class="section__title" v-text="sectionTitle"></h1>
						<span class="section__help-text">Edita o crea nuevas categorías para tus productos.</span>
						<div class="section__options btn__grouped" v-if="route.name == 'categoryEdit'">
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="enableEdit = true">
								<icon-set icon="edit"/>
								Editar categoría
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<icon-set icon="delete"/>
								Eliminar categoría
							</button>
						</div>
					</div>	
					<confirmation-popup :data="categoryDeleteConfirmationData" @confirmed="categoryDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="categoryForm" :validation-schema="categoryValidateSchema" v-slot="{ values, setErrors }" v-if="categoryForm">

							<div class="form__container form__container--full">
								<label class="form__label" for="name" id="name">Nombre de categoría</label>
								<Field id="name" name="name" placeholder="Nombre de la categoría" class="form__input" :disabled="!enableEdit" :class="{'form__input--disabled': !enableEdit}" />
								<ErrorMessage name="name" class="form__alert" data-field="name"/>
							</div>

							<input v-if="enableEdit" class="btn btn__default btn--small btn__default--primary" type="submit" :value="submitButtonText">
							<button v-if="enableEdit && route.name == 'categoryEdit'" class="btn btn__outlined btn--small btn__outlined--primary" @click="enableEdit = false">
								<icon-set icon="close"/>
								Cancelar
							</button>
						</Form>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { useAppStore } from '../../store/index.js'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import contentHeader from '../partials/content_header.vue'
import sidebarComponent from '../partials/sidebar.vue'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import { getCompany } from '../../mixins/company.js'
import inputAutocomplete from '../partials/address-input-autocomplete.vue'
import confirmationPopup from '../partials/confirmation_popup.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()

const categoryData = () => {
	return {
		name: null
	}
}

const categoryDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar esta categoría? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)
const categoryValidateSchema = yup.object().shape({
	name: yup.string().required().label('Nombre de categoría').max(50)
})

const categoryForm = ref(null)
const submitButtonText = ref('Agregar categoría')
const categoryId = ref(null)
const enableEdit = ref(false)
const sectionTitle = ref('Agregar nueva categoría')

onMounted(() => {
	loadComponent()	
})

watch(() => route.path, () => {
	loadComponent()
})

onBeforeRouteLeave(() => {
	categoryForm.value = null
})

function loadComponent() {
	if(route.name == 'categoryEdit' && route.params.id > 0) {
		categoryId.value = route.params.id
		sectionTitle.value = 'Editar información de la categoría'
		submitButtonText.value = 'Actualizar categoría'
		enableEdit.value = false
		getCategory()
		store.new_elements([
			{
				name: 'categoryAdd',
				text: 'Agregar categoría'	
			}
		])
	} else {
		sectionTitle.value = 'Agregar nueva categoria'
		submitButtonText.value = 'Agregar categoría'
		enableEdit.value = true
		categoryForm.value = categoryData()
	}
}

function getCategory() {
	new apiRequest().Get({
		module: 'products/categories'
	}, categoryId.value)
		.then(r => {
			categoryForm.value = r.data.data
		}).catch(e => {
			store.push_alert(e.data)
			router.push({
				name: 'categoryAdd'
			})
		})
}

function categoryDelete() {
	new apiRequest().Delete({
		module: 'products/categories'
	}, categoryId.value).then(response => {
		store.push_alert(response.data)
		router.push({
			name: 'categoryView'
		})
	})
}

function onSubmit(values, action) {
	if(route.name == 'categoryAdd') {
		addCategory(values)
	}	else if(route.name == 'categoryEdit') {
		editCategory(values)
	}
}

function addCategory(values) {
	new apiRequest().Post({
		module: 'products/categories',
		data: values
	}).then(response => {
		store.push_alert(response.data)
		router.push({
			name: 'categoryEdit',
			params: {id: response.data.data.id}
		})
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function editCategory(values) {
	new apiRequest().Put({
		module: 'products/categories',
		data: values
	}, categoryId.value).then(response => {
		store.push_alert(response.data)
	}).catch(error => {
		store.push_alert(error.data)
	})
}

</script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_section.sass"
</style>
