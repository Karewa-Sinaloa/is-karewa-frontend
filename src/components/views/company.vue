<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section class="section section--wide" v-if="taxpayerType">
					<h1 class="section__title">Crear empresa</h1>
					<span class="section__help-text">Ten a la mano tu constancia de situación fiscal y tus CSD vigentes y su contraseña.</span>
					<Form @submit="onSubmit" class="form" :initial-values-="companyForm">
						<div class="form__container form__container--half">
							<label class="form__label" for="taxpayer_type">Tipo de contribuyente</label>
							<Field as="select" class="form__select" id="taxpayer_type" name="taxpayer_type" v-model="tpt">
								<option disabled value="">Selecciona el tipo de contribuyente</option>
								<option v-for="tpt in taxpayerType" :value="tpt.id">{{ tpt.name }}</option>
							</Field>
						</div>
						<div v-if="tpt">
							<div class="form__container form__container--full">
								<label class="form__label" for="razon_social" id="razon_social">Razón social</label>
								<Field id="razon_social" name="razon_social" placeholder="Razón social de tu empresa" class="form__input" />
							</div>

							<div class="form__container form__container--small">
								<label class="form__label" for="rfc" id="rfc">RFC</label>
								<input class="form__input" type="text" id="rfc" name="rfc" placeholder="XXXX010101XXX">
							</div>
						</div>
					</Form>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAppStore } from '../../store/index.js'
import sidebarComponent from '../partials/sidebar.vue'
import contentHeader from '../partials/content_header.vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setFieldMessages }  from '../../helpers/yup.locale.js'
import { apiRequest } from '../../api/requests.js'

const store = useAppStore()
const router = useRouter()
const companyForm = {
	taxpayer_type: null,
	razon_social: null
}
const tpt = ref(null)

const taxpayerType = ref(null)

function getTaxpayerType() {
	new apiRequest().Get({
		module: 'tax-payers/types'
	}).then(response => {
		taxpayerType.value = response.data.data
	}).catch(error => {
		console.log(error)
	})
}

onMounted(() => {
	let companyCreated = store.company != null ? true : false
	if(companyCreated) {
		router.push({name: 'homeView'})
	}
})

getTaxpayerType()

function onSubmit() {}
</script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_section.sass"
</style>
