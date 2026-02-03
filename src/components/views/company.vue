<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="myOrganization">
					<div class="section__top">
						<h1 class="section__title">{{myOrganization.name}}</h1>
						<span class="section__help-text">Esta es la información de tu organización, aquí podrás editar o actualizala.</span>
						<div class="section__options btn__grouped" v-if="organizationEditBlocked" >
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="organizationEditBlocked = false">
								<span class="material-symbols-outlined">edit_square</span>
								Editar organización
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true" disabled="disabled">
								<span class="material-symbols-outlined">delete</span>
								Eliminar organización
							</button>
						</div>
					</div>
					<confirmation-popup :data="organizationDeleteConfirmationData" @confirmed="organizationDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="myOrganization" :validation-schema="organizationValidateSchema" v-slot="{ values, setErrors }">	
							<div>
								<div class="form__container form__container--full">
									<label class="form__label form__label--required" for="name" id="name">Organización</label>
									<Field id="name" name="name" placeholder="Nombre de de tu organización" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="name" class="form__alert" data-field="name"/>
								</div>

                <div class="form__container form__container--half">
								  <label class="form__label" for="shortname">Nombre corto</label>
									<Field id="shortname" name="shortname" placeholder="Nombre corto de la organización" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="shortname" class="form__alert" data-field="shortname"/>
							  </div>

								<div class="form__container form__container--half">
									<label class="form__label" for="contact_email" id="contact_email">Correo de contacto</label>
									<Field class="form__input" type="email" id="contact_email" name="contact_email" placeholder="user@organization.tld" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
									<ErrorMessage name="contact_email" class="form__alert" data-field="contact_email"/>
								</div>

                <div class="form__container form__container--full">
									<label class="form__label form__label--required" for="name" id="name">Calle y núnero</label>
									<Field id="street" name="street" placeholder="Nombre de la calle y número" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="street" class="form__alert" data-field="street"/>
								</div>

                <div class="form__container form__container--half">
								  <label class="form__label" for="colonia">Colonia / Delegación</label>
									<Field id="colonia" name="colonia" placeholder="Nombre de la colonia" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="colonia" class="form__alert" data-field="colonia"/>
							  </div>

                <div class="form__container form__container--half">
								  <label class="form__label" for="ciudad">Ciudad</label>
									<Field id="city" name="city" placeholder="Nombre de la ciudad" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="city" class="form__alert" data-field="city"/>
							  </div>

                <div class="form__container form__container--half">
								  <label class="form__label" for="state">Estado</label>
									<Field id="state" name="state" placeholder="Nombre del estado" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="state" class="form__alert" data-field="state"/>
							  </div>

                <div class="form__container form__container--tiny">
								  <label class="form__label" for="postal_code">Código Postal</label>
									<Field id="postal_code" name="postal_code" placeholder="Código postal" class="form__input" :disabled="organizationEditBlocked" :class="{'form__input--disabled': organizationEditBlocked}"/>
								  <ErrorMessage name="postal_code" class="form__alert" data-field="postal_code"/>
							  </div>

							</div>
							<input v-if="!organizationEditBlocked" class="btn btn__default btn--small btn__default--primary" type="submit" value="Actualizar organización">
							<button v-if="!organizationEditBlocked" class="btn btn__outlined btn--small btn__outlined--primary" @click="organizationEditBlocked = true">
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
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import { onMounted, ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { useAppStore } from '../../store/index.js'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'
import confirmationPopup from '../partials/confirmation_popup.vue'

const store = useAppStore()
const router = useRouter()
const organizationDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar esta organización? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)

const organizationEditBlocked = ref(true)
const tpt = ref(null)
const organizationValidateSchema = yup.object().shape({
	name: yup.string().required().label('Nombre de la organización').max(150),
  shortname: yup.string().label('Nombre corto').max(20),
  contact_email: yup.string().email().label('Correo de contacto').max(100),
  street: yup.string().required().label('Calle y número').max(150),
  colonia: yup.string().label('Colonia / Delegación').max(100),
  city: yup.string().label('Ciudad').max(100),
  state: yup.string().label('Estado').max(100),
  postal_code: yup.number().label('Código postal').max(99999).min(1000)
})
const myOrganization = computed(() => {
	return store.company != null ? store.company : false
})

onMounted(() => {
	if(!myOrganization.value) {
	//	router.push({name: 'homeView'})
	}
})

function onSubmit(values, action) {
	new apiRequest().Put({
		module: 'organization',
		data: values
	}, myOrganization.value.id).then(response => {
		store.push_alert(response.data)
		organizationEditBlocked.value = true
		getOrganization()
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function organizationDelete() {
	new apiRequest().Delete({
		module: 'organization'
	}, myOrganization.value.id)
		.then(response => {
			confirmDelete.value = false
			store.push_alert(response.data)
		}).catch(error => {
			confirmDelete.value = false
			error.data.help = "Debe borrar primero las direcciones asociadas al organización"
			store.push_alert(error.data)
		})
}

function humanReadDate(dateString) {
	let d = new Date(dateString)
	return `${d.toLocaleString()}`
}
</script>

<style lang="sass">
	@use "../../assets/sass/components/_section.sass"
</style>
