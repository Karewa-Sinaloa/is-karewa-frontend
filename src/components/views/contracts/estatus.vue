<template>
  <section class="section section--wide section--no-border">
      <div class="section__top">
        <h1 class="section__title">Estatus del contrato</h1>
        <span class="section__help-text">Agrega, elimina o edita los estatus de los contratos en esta sección.</span>
        <button class="btn btn--small btn__default btn__default--primary" @click="choosenId = 'new'" v-if="estatuss && estatuss.length > 0">
          <icon-set icon="add" />
          Crear nuevo estatus
        </button>
      </div>
      <div class="section__content" v-if="estatuss && estatuss.length > 0">
        <div class="results">
          <div class="results__result result" v-for="estatus in estatuss" :key="estatus.id">
            <div class="result__data">
              <h3 class="result__title">{{estatus.name}}</h3>
            </div>
            <result-options :optionList="{pop: true, delete: true}" @showPopup="choosenId = estatus.id" @deleteItem="deleteConfirmation(estatus.id)"></result-options>
          </div>
        </div>
        <confirmation-popup :data="estatusDeleteConfirmationData" @confirmed="estatusDelete" @declined="confirmDelete = false, itemToDelete = null" v-if="confirmDelete"></confirmation-popup>
        <pagination-container v-if="pagination" :data="pagination" module="estatusList"></pagination-container>
      </div>
      <div class="section__content" v-else-if="estatuss && estatuss.length === 0">
        <div class="results">
          <p class="results__no-results">No se encontraron estatus</p>
          <button class="btn btn--small btn__default btn__default--primary" @click="choosenId = 'new'" v-if="estatuss && estatuss.length === 0">
            <icon-set icon="add" />
            Crear nuevo estatus
          </button>
        </div>
      </div>
      <div class="section__content" v-else>
        <span class="results__loading">Cargando lista de estatus....</span>
      </div>
      <section-popup-slot v-if="choosenId" @close="choosenId = null">
        <estatus-view :id="choosenId" @close="choosenId = null" @changed="getEstatus(), choosenId = null"/>
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
import estatusView from './estatus_view.vue'

const estatuss = ref(null)
const store = useAppStore()
const confirmDelete = ref(false)
const pagination = ref(null)
const maxResults = ref(99)
const itemToDelete = ref(null)
const page = ref(1)
const choosenId = ref(null)

onMounted(() => {
  // Aquí puedes hacer la solicitud a la API para obtener los estatus
  // y asignarlos a la variable 'estatuss'
  getEstatus()
})
const estatusDeleteConfirmationData = {
  title: "Confirma tu solicitud",
  text: "¿Realmente desea borrar este estatus? Esta acción es definitiva y no se puede deshacer",
  btn_confirmation_text: "Si, borrar ahora",
  btn_declination_text: "Cancelar",
  icon: "attention.png"
}

function getEstatus() {
  estatuss.value = []
  new apiRequest().Get({
    module: 'estatus-contrato',
    params: `?page=${page.value}&limit=${maxResults.value}`
  })
    .then(response => {
      estatuss.value = response.data.data
      pagination.value = response.data.pagination ? response.data.pagination : null
    }).catch(error => {
      store.push_alert(error.data)
    })
}

const deleteConfirmation = (id) => {
  confirmDelete.value = true
  itemToDelete.value = id
}

function estatusDelete() {
  new apiRequest().Delete({
    module: 'estatus-contrato'
  }, estatuss.value.id)
    .then(response => {
      confirmDelete.value = false
      estatuss.value = estatuss.value.filter(estatus => estatus.id !== itemToDelete.value)
      store.push_alert(response.data)
    }).catch(error => {
      confirmDelete.value = false
      store.push_alert(error.data)
    })
}
</script>
