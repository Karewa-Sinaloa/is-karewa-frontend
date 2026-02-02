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
						<div class="section__options btn__grouped" v-if="companyEditBlocked" >
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="companyEditBlocked = false">
								<span class="material-symbols-outlined">edit_square</span>
								Editar empresa
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<span class="material-symbols-outlined">delete</span>
								Eliminar empresa
							</button>
						</div>
					</div>
					<confirmation-popup :data="companyDeleteConfirmationData" @confirmed="companyDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="myOrganization" :validation-schema="companyValidateSchema" v-slot="{ values, setErrors }">	
							<div>
								<div class="form__container form__container--full">
									<label class="form__label form__label--required" for="name" id="name">Razón social</label>
									<Field id="name" name="name" placeholder="Razón social de tu empresa" class="form__input" :disabled="companyEditBlocked" :class="{'form__input--disabled': companyEditBlocked}"/>
								<ErrorMessage name="name" class="form__alert" data-field="name"/>
								</div>

                <div class="form__container form__container--half">
								<label class="form__label" for="shortname">Nombre corto</label>
									<Field id="shortname" name="shortname" placeholder="Nombre corto de la organización" class="form__input" :disabled="companyEditBlocked" :class="{'form__input--disabled': companyEditBlocked}"/>
								<ErrorMessage name="shortname" class="form__alert" data-field="shortname"/>
							</div>

								<div class="form__container form__container--half">
									<label class="form__label" for="contact_email" id="contact_email">Correo de contacto</label>
									<Field class="form__input form__input--disabled" type="email" id="email" name="email" placeholder="user@organization.tld" disabled/>
									<ErrorMessage name="contact_email" class="form__alert" data-field="contact_email"/>
								</div>

							</div>
							<input v-if="!companyEditBlocked" class="btn btn__default btn--regular btn__default--primary" type="submit" value="Actualizar contribuyente">
							<button v-if="!companyEditBlocked" class="btn btn__outlined btn--small btn__outlined--primary" @click="companyEditBlocked = true">
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
const companyDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar esta organización? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)

const companyEditBlocked = ref(true)
const tpt = ref(null)
const companyValidateSchema = yup.object().shape({
	rfc: yup.string().required().label('RFC').min(12).max(13).matches(/^[A-Z&Ñ]{3,4}[0-9]{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])[A-Z0-9]{2}[0-9A]$/i),
	name: yup.string().required().label('Nombre de la organización').max(150),
})
const myOrganization = computed(() => {
	return store.company != null ? store.company[0] : false
})

onMounted(() => {
	if(!myOrganization.value) {
		router.push({name: 'homeView'})
	}
})

function onSubmit(values, action) {
	new apiRequest().Put({
		module: 'organization',
		data: values
	}, myOrganization.value.id).then(response => {
		store.push_alert(response.data)
		companyEditBlocked.value = true
		getOrganization()
	}).catch(error => {
		store.push_alert(error.data)
	})
}

function companyDelete() {
	new apiRequest().Delete({
		module: 'organization'
	}, myOrganization.value.id)
		.then(response => {
			confirmDelete.value = false
			store.push_alert(response.data)
		}).catch(error => {
			confirmDelete.value = false
			error.data.help = "Debe borrar primero las direcciones asociadas al contribuyente"
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
