<template>
  <div class="dash">
    <sidebar-component />
    <div class="content">
      <content-header />
      <main class="main">
        <section class="section section--wide section--no-border">
          <div class="section__top">
            <h1 class="section__title">Listado de proveedores</h1>
            <span class="section__help-text">Aquí puedes ver y administrar los proveedores de servicios asociados a tu organización.</span>
          </div>
          <div class="section__content">
              <div class="results">
                <div class="results__result result" v-for="provider in providers" :key="provider.id">
                  <div class="result__data">
                    <h3 class="result__title">{{provider.name}}</h3>
                    <span class="result__description">{{provider.shortname}}</span>
                    <span class="result__info">RFC: {{provider.rfc}}</span>
                  </div>
                  <result-options :optionList="{go: {name: 'proveedoresView', params: {id: provider.id}}, delete: true}" @deleteItem="confirmDelete = true"></result-options>
                </div>
              </div>
					    <confirmation-popup :data="providerDeleteConfirmationData" @confirmed="providerDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
              <pagination-container v-if="pagination" :data="pagination" module="proveedoresList"></pagination-container>
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
const providers = ref(null)
const confirmDelete = ref(false)
const pagination = ref(null)
const maxResults = ref(12)
const page = ref(computed(() => {
  return route.params.page ? parseInt(route.params.page) : 1
}))

const providerDeleteConfirmationData = {
  title: "Confirma tu solicitud",
  text: "¿Realmente desea borrar este proveedor? Esta acción es definitiva y no se puede deshacer",
  btn_confirmation_text: "Si, borrar ahora",
  btn_declination_text: "Cancelar",
  icon: "attention.png"
}

onMounted(() => {
  store.new_elements([
    {name: 'proveedoresCreate', text: 'Nuevo proveedor'}
  ])
  getProviders()
})

watch(() => route.path, () => {
	getProviders()
})

function getProviders() {
  new apiRequest().Get({
    module: 'proveedores',
    params: `?page=${page.value}&limit=${maxResults.value}`
  })
    .then(response => {
      providers.value = response.data.data
      pagination.value = response.data.pagination ? response.data.pagination : null
    }).catch(error => {
      store.push_alert(error.data)
      router.push({name: 'homeView'})
    })
}

function providerDelete() {
  new apiRequest().Delete({
    module: 'proveedores'
  }, providers.value.id)
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
  @use "../../../assets/sass/components/_results.sass"
</style>
