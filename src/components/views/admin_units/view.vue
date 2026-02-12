<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="adminUnit">
					<div class="section__top">
						<h1 class="section__title">{{adminUnit.name || 'Crear nueva unidad administrativa'}}</h1>
						<span class="section__help-text">Agrega o edita la información de la unidad administrativa</span>
						<div class="section__options btn__grouped" v-if="adminUnitEditBlocked && adminUnit.id" >
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="adminUnitEditBlocked = false">
								<span class="material-symbols-outlined">edit_square</span>
								Editar unidad administrativa
							</button>
							<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
								<span class="material-symbols-outlined">delete</span>
								Eliminar unidad administrativa
							</button>
						</div>
					</div>
					<confirmation-popup :data="admminUnitDeleteConfirmationData" @confirmed="adminUnitDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
					<div class="section__content">
						<Form @submit="onSubmit" class="form" :initial-values="adminUnit" :validation-schema="adminUnitValidateSchema" v-slot="{ values, setErrors }">	
							<div>
								<div class="form__container form__container--full">
									<label class="form__label form__label--required" for="name" id="name">Nombre de la unidad administrativa</label>
									<Field id="name" name="name" placeholder="Nombre de de la unidad administrativa" class="form__input" :disabled="adminUnitEditBlocked && adminUnit.id" :class="{'form__input--disabled': adminUnitEditBlocked && adminUnit.id}"/>
								  <ErrorMessage name="name" class="form__alert" data-field="name"/>
								</div>

                <div class="form__container form__container--full">
									<label class="form__label" for="comments" id="notes">Comentarios o notas</label>
									<Field class="form__input form__input--textarea" rows="4" as="textarea" id="notes" name="notes" placeholder="Comentarios o notas acerca de la unidad administrativa" :disabled="adminUnitEditBlocked && adminUnit.id" :class="{'form__input--disabled': adminUnitEditBlocked && adminUnit.id}"/>
									<ErrorMessage name="notes" class="form__alert" data-field="notes"/>
								</div>

							</div>
              <input v-if="!adminUnitEditBlocked || !adminUnit.id" class="btn btn__default btn--small btn__default--primary" type="submit" :value="submitButtonText"/>
							<button v-if="!adminUnitEditBlocked" class="btn btn__outlined btn--small btn__outlined--primary" @click="adminUnitEditBlocked = true">
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
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import * as yup from 'yup'
import { useAppStore } from '../../../store/index.js'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../../helpers/yup.locale.js'
import { apiRequest } from '../../../api/requests.js'
import confirmationPopup from '../../partials/confirmation_popup.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const adminUnit = ref()
const admminUnitDeleteConfirmationData = {
	title: "Confirma tu solicitud",
	text: "¿Realmente desea borrar esta unidad administrativa? Esta acción es definitiva y no se puede deshacer",
	btn_confirmation_text: "Si, borrar ahora",
	btn_declination_text: "Cancelar",
	icon: "attention.png"
}
const confirmDelete = ref(false)
const adminUnitEditBlocked = ref(true)
const submitButtonText = computed(() => {
  return adminUnit.value && adminUnit.value.id ? 'Actualizar unidad administrativa' : 'Crear unidad administrativa'
})

const adminUnitValidateSchema = yup.object().shape({
	name: yup.string().required().label('Nombre de la unidad administrativa').max(150),
  comments: yup.string().label('Comentarios'),
})

onBeforeRouteLeave((to, from, next) => {
  adminUnit.value = null
  next()
})

onMounted(() => {
  manageRoute() 
})

watch(() => route.path , async () => {
  manageRoute() 
})

function manageRoute() {
  if(route.name === 'unidadesAdministrativasView') {
    if(!route.params.id || route.params.id === 0) {
      router.push({name: 'unidadesAdministrativasCreate'})
    } else {
      store.new_elements([
        {name: 'unidadesAdministrativasCreate', text: 'Nuevo unidad administrativa'}
      ])
      getAdminunit()
    }
  } else {
    adminUnit.value = {name: '', notes: '', id: null};
  }
}

function onSubmit(values, action) {
  if(!adminUnit.value.id) {
    new apiRequest().Post({
      module: 'unidades-administrativas',
      data: values
    }).then(response => {
      store.push_alert(response.data)
      router.push({name: 'unidadesAdministrativasView', params: {id: response.data.data.inserted_id}})
    }).catch(error => {
      store.push_alert(error.data)
    })
  } else {
    new apiRequest().Put({
      module: 'unidades-administrativas',
      data: values
    }, adminUnit.value.id).then(response => {
      store.push_alert(response.data)
      adminUnitEditBlocked.value = true
      getOrganization()
    }).catch(error => {
      store.push_alert(error.data)
    })
  }
}

function getAdminunit() {
  new apiRequest().Get({
    module: 'unidades-administrativas'
  }, router.currentRoute.value.params.id)
    .then(response => {
      adminUnit.value = response.data.data
    }).catch(error => {
      store.push_alert(error.data)
      router.push({name: 'homeView'})
    })
}

function adminUnitDelete() {
	new apiRequest().Delete({
		module: 'unidades-administrativas'
	}, adminUnit.value.id)
		.then(response => {
			confirmDelete.value = false
			store.push_alert(response.data)
      router.push({name: 'unidadesAdministrativasList'})
		}).catch(error => {
			confirmDelete.value = false
			store.push_alert(error.data)
		})
}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
