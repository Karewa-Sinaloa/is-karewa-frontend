<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="myProvider">
					<div class="section__top">
						<h1 class="section__title">{{myProvider.name}}</h1>
						<span class="section__help-text">Edita la información del proveedores de servicios</span>
						<div class="section__options btn__grouped" v-if="providerEditBlocked" >
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="providerEditBlocked = false">
								<span class="material-symbols-outlined">edit_square</span>
								Editar proveedor
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<span class="material-symbols-outlined">delete</span>
								Eliminar proveedor
							</button>
						</div>
					</div>
					<confirmation-popup :data="providerDeleteConfirmationData" @confirmed="providerDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="myProvider" :validation-schema="providerValidateSchema" v-slot="{ values, setErrors }">	
							<div>
								<div class="form__container form__container--full">
									<label class="form__label form__label--required" for="name" id="name">Nombre del proveedor</label>
									<Field id="name" name="name" placeholder="Nombre de de tu proveedor" class="form__input" :disabled="providerEditBlocked" :class="{'form__input--disabled': providerEditBlocked}"/>
								  <ErrorMessage name="name" class="form__alert" data-field="name"/>
								</div>

                <div class="form__container form__container--half">
								  <label class="form__label form__label--required" for="shortname">Nombre corto</label>
									<Field id="shortname" name="shortname" placeholder="Nombre corto del proveedor" class="form__input" :disabled="providerEditBlocked" :class="{'form__input--disabled': providerEditBlocked}"/>
								  <ErrorMessage name="shortname" class="form__alert" data-field="shortname"/>
							  </div>

								<div class="form__container form__container--half">
									<label class="form__label form__label--required" for="rfc" id="rfc">RFC del proveedor</label>
									<Field class="form__input" type="text" id="rfc" name="rfc" placeholder="XXX31121972XX0" :disabled="providerEditBlocked" :class="{'form__input--disabled': providerEditBlocked}"/>
									<ErrorMessage name="rfc" class="form__alert" data-field="rfc"/>
								</div>

                <div class="form__container form__container--full">
									<label class="form__label" for="comments" id="comments">Comentarios o notas</label>
									<Field class="form__input form__input--textarea" rows="4" as="textarea" id="comments" name="comments" placeholder="Comentarios o notas acerca del proveedor" :disabled="providerEditBlocked" :class="{'form__input--disabled': providerEditBlocked}"/>
									<ErrorMessage name="comments" class="form__alert" data-field="comments"/>
								</div>

							</div>
							<input v-if="!providerEditBlocked" class="btn btn__default btn--small btn__default--primary" type="submit" value="Actualizar proveedor">
							<button v-if="!providerEditBlocked" class="btn btn__outlined btn--small btn__outlined--primary" @click="providerEditBlocked = true">
								<span class="material-symbols-outlined">cancel</span>
								Cancelar</button>
						</Form>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import sidebarComponent from '../../partials/sidebar.vue'
import contentHeader from '../../partials/content_header.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useAppStore } from '../../../store/index.js'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../../helpers/yup.locale.js'
import { apiRequest } from '../../../api/requests.js'
import confirmationPopup from '../../partials/confirmation_popup.vue'

const store = useAppStore()
const router = useRouter()
const myProvider = ref(null)
const providerDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar este proveedor? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)

const providerEditBlocked = ref(true)
const tpt = ref(null)
const providerValidateSchema = yup.object().shape({
	name: yup.string().required().label('Nombre de la proveedor').max(150),
  shortname: yup.string().required().label('Nombre corto').max(20),
  rfc: yup.string().required().label('RFC').max(13),
  comments: yup.string().label('Comentarios'),
})

onMounted(() => {
  getProvider()
})

function onSubmit(values, action) {
	new apiRequest().Put({
		module: 'proveedores',
		data: values
	}, myProvider.value.id).then(response => {
		store.push_alert(response.data)
		providerEditBlocked.value = true
		getOrganization()
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function getProvider() {
  new apiRequest().Get({
    module: 'proveedores'
  }, router.currentRoute.value.params.id)
    .then(response => {
      myProvider.value = response.data.data
    }).catch(error => {
      store.push_alert(error.data)
      router.push({name: 'homeView'})
    })
}

function providerDelete() {
	new apiRequest().Delete({
		module: 'organization'
	}, myProvider.value.id)
		.then(response => {
			confirmDelete.value = false
			store.push_alert(response.data)
		}).catch(error => {
			confirmDelete.value = false
			store.push_alert(error.data)
		})
}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
