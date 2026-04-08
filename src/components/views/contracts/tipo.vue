<template>
  <section class="section section--wide section--no-border">
      <div class="section__top">
        <h1 class="section__title">Tipos de contratos</h1>
        <span class="section__help-text">Agrega, edita o elimina tipos de contratos, estos aparecerán a la hora de crear nuevos contratoso editarlos.</span>
        <button class="btn btn--small btn__default btn__default--primary" @click="choosenId = 'new'" v-if="tipos && tipos.length > 0">
          <icon-set icon="add" />
          Crear nuevo tipo
        </button>
      </div>
      <div class="section__content" v-if="tipos && tipos.length > 0">
        <div class="results">
          <div class="results__result result" v-for="tipo in tipos" :key="tipo.id">
            <div class="result__data">
              <h3 class="result__title">{{tipo.name}}</h3>
            </div>
            <result-options :optionList="{pop: true, delete: true}" @showPopup="choosenId = tipo.id" @deleteItem="deleteConfirmation(tipo.id)"></result-options>
          </div>
        </div>
        <confirmation-popup :data="tipoDeleteConfirmationData" @confirmed="tipoDelete" @declined="confirmDelete = false, itemToDelete = null" v-if="confirmDelete"></confirmation-popup>
        <pagination-container v-if="pagination" :data="pagination" module="tipoList"></pagination-container>
      </div>
      <div class="section__content" v-else-if="tipos && tipos.length === 0">
        <div class="results">
          <p class="results__no-results">No se encontraron tipos</p>
          <button class="btn btn--small btn__default btn__default--primary" @click="choosenId = 'new'" v-if="tipos && tipos.length === 0">
            <icon-set icon="add" />
            Crear nuevo tipo
          </button>
        </div>
      </div>
      <div class="section__content" v-else>
        <span class="results__loading">Cargando lista de tipos....</span>
      </div>
      <section-popup-slot v-if="choosenId" @close="choosenId = null">
        <tipo-view :id="choosenId" @close="choosenId = null" @changed="getTipos(), choosenId = null"/>
      </section-popup-slot>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAppStore } from '../../../store/index.js'
import { apiRequest } from '../../../api/requests.js'
import confirmationPopup from '../../partials/confirmation_popup.vue'
import resultOptions from '../../partials/result_options.vue'
import paginationContainer from '../../partials/pagination.vue'
import SectionPopupSlot from '../../partials/section_popup_slot.vue'
import tipoView from './tipo_view.vue'

const tipos = ref(null)
const store = useAppStore()
const confirmDelete = ref(false)
const pagination = ref(null)
const maxResults = ref(99)
const itemToDelete = ref(null)
const page = ref(1)
const choosenId = ref(null)

onMounted(() => {
  // Aquí puedes hacer la solicitud a la API para obtener los tipo
  // y asignarlos a la variable 'tipos'
  getTipos()
})
const tipoDeleteConfirmationData = {
  title: "Confirma tu solicitud",
  text: "¿Realmente desea borrar este tipo? Esta acción es definitiva y no se puede deshacer",
  btn_confirmation_text: "Si, borrar ahora",
  btn_declination_text: "Cancelar",
  icon: "attention.png"
}

function getTipos() {
  tipos.value = []
  new apiRequest().Get({
    module: 'tipo-contrato',
    params: `?page=${page.value}&limit=${maxResults.value}`
  })
    .then(response => {
      tipos.value = response.data.data
      pagination.value = response.data.pagination ? response.data.pagination : null
    }).catch(error => {
      store.push_alert(error.data)
    })
}

const deleteConfirmation = (id) => {
  confirmDelete.value = true
  itemToDelete.value = id
}

function tipoDelete() {
  new apiRequest().Delete({
    module: 'tipo-contrato'
  }, tipos.value.id)
    .then(response => {
      confirmDelete.value = false
      tipos.value = tipos.value.filter(tipo => tipo.id !== itemToDelete.value)
      store.push_alert(response.data)
    }).catch(error => {
      confirmDelete.value = false
      store.push_alert(error.data)
    })
}
</script>
