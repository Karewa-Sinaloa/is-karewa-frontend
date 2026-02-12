<template>
  <div class="dash">
    <sidebar-component />
    <div class="content">
      <content-header />
      <main class="main">
        <section class="section section--wide section--no-border">
          <div class="section__top">
            <h1 class="section__title">Listado de Unidades Administrativas</h1>
            <span class="section__help-text">Aquí puedes ver y administrar las unidades administrativas asociadas a tu organización.</span>
          </div>
          <div class="section__content" v-if="adminUnits && adminUnits.length > 0">
              <div class="results">
                <div class="results__result result" v-for="adminUnit in adminUnits" :key="adminUnit.id">
                  <div class="result__data">
                    <h3 class="result__title">{{adminUnit.name}}</h3>
                  </div>
                  <result-options :optionList="{go: {name: 'unidadesAdministrativasView', params: {id: adminUnit.id}}, delete: true}" @deleteItem="deleteConfirmation"></result-options>
                </div>
              </div>
					    <confirmation-popup :data="adminUnitDeleteConfirmationData" @confirmed="adminUnitDelete" @declined="confirmDelete = false, itemToDelete = null" v-if="confirmDelete"></confirmation-popup>
              <pagination-container v-if="pagination" :data="pagination" module="unidadesAdministrativasList"></pagination-container>
          </div>
          <div class="section__content" v-else-if="adminUnits && adminUnits.length === 0">
            <div class="results">
              <p class="results__no-results">No se encontraron unidades administrativas.</p>
              <button class="btn btn--small btn__default btn__default--primary" @click="router.push({name: 'unidadesAdministrativasCreate'})">
                <icon-set icon="add" />
                Crear nueva unidad administrativa
              </button>
            </div>
          </div>
          <div class="section__content" v-else>
            <span class="results__loading">Cargando unidades administrativas...</span>
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
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../../../store/index.js'
import { apiRequest } from '../../../api/requests.js'
import confirmationPopup from '../../partials/confirmation_popup.vue'
import resultOptions from '../../partials/result_options.vue'
import paginationContainer from '../../partials/pagination.vue'

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const adminUnits = ref(null)
const confirmDelete = ref(false)
const pagination = ref(null)
const maxResults = ref(12)
const itemToDelete = ref(null)
const page = ref(computed(() => {
  return route.params.page ? parseInt(route.params.page) : 1
}))

const adminUnitDeleteConfirmationData = {
  title: "Confirma tu solicitud",
  text: "¿Realmente desea borrar esta unidad administrativa? Esta acción es definitiva y no se puede deshacer",
  btn_confirmation_text: "Si, borrar ahora",
  btn_declination_text: "Cancelar",
  icon: "attention.png"
}

onMounted(() => {
  store.new_elements([
    {name: 'unidadesAdministrativasCreate', text: 'Nueva unidad'}
  ])
  getadminUnits()
})

watch(() => route.path, () => {
	getadminUnits()
})

function getadminUnits() {
  new apiRequest().Get({
    module: 'unidades-administrativas',
    params: `?page=${page.value}&limit=${maxResults.value}`
  })
    .then(response => {
      adminUnits.value = response.data.data
      pagination.value = response.data.pagination ? response.data.pagination : null
    }).catch(error => {
      store.push_alert(error.data)
      if(error.data.http_code !== 404) {
        router.push({name: 'homeView'})
      }
      adminUnits.value = []
    })
}

const deleteConfirmation = (id) => {
  confirmDelete.value = true
  itemToDelete.value = id
}

function adminUnitDelete() {
  new apiRequest().Delete({
    module: 'unidades-administrativas'
  }, itemToDelete.value)
    .then(response => {
      confirmDelete.value = false
      adminUnits.value = adminUnits.value.filter(unit => unit.id !== itemToDelete.value)
      store.push_alert(response.data)
    }).catch(error => {
      confirmDelete.value = false
      store.push_alert(error.data)
    })
}
</script>

<style lang="sass">
  @use "../../../assets/sass/components/_results.sass"
</style>
