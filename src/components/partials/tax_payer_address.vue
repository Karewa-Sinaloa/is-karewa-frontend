<template>
	<div>
		<div class="section__options btn__grouped" v-if="disabledEdition">
			<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="disabledEdition = false">
				<span class="material-symbols-outlined">edit_square</span>
				Editar dirección
			</button>

			<button class="btn btn__default btn--smaller btn__default--primary" @click.prevent="confirmDelete = true">
				<span class="material-symbols-outlined">delete</span>
				Eliminar dirección
			</button>
		</div>
		<Form @submit="onSubmit" class="form" :initial-values="addrData" :validation-schema="tpaddressValidateSchema" v-slot="{ values, setErrors }">
			<div class="form__fieldset">
				<div class="form__container-group">
					<div class="form__container form__container--small">
						<label class="form__label form__label--required" for="postal_code">Código postal</label>
						<Field class="form__input" name="postal_code" id="postal_code" placeholder="00000" @change="getPostalCode" v-model="addrData.postal_code" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}" />
						<ErrorMessage id="postal_code"></ErrorMessage>
					</div>

					<div class="form__container form__container--small" v-if="postalCodeData.postal_code">
						<label class="form__label" for="state_name">Estado</label>
						<Field class="form__input" name="state_name" id="state_name" placeholder="Estado" disabled v-model="addrData.state_name" :class="{'form__input--disabled': disabledEdition}" />
						<ErrorMessage id="state_name"></ErrorMessage></div>
				</div>

				<div class="form__container-group" v-if="postalCodeData.postal_code">
					<div class="form__container form__container--small">
						<label class="form__label" for="localidad">Localidad</label>
						<Field class="form__input" name="localidad" id="localidad" placeholder="Localidad" v-model="addrData.localidad" @focus="displayLocationOptions = true" autocomplete="off" @blur="displayLocationOptions = false" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}"/>
						<input-autocomplete :elements="postalCodeData.localidades" :showOptions="displayLocationOptions" :stringValue="addrData.localidad" @newStringValue="v => (addrData.localidad = v)"></input-autocomplete>
						<ErrorMessage id="localidad"></ErrorMessage>
					</div>

					<div class="form__container form__container--small">
						<label class="form__label" for="municipio">Municipio</label>
						<Field class="form__input" name="municipio" id="municipio" placeholder="Municipio" v-model="addrData.municipio" @focus="displayMunicipiosOptions = true" autocomplete="off" @blur="displayMunicipiosOptions = false" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}"/>
						<input-autocomplete :elements="postalCodeData.municipios" :stringValue="addrData.municipio" @newStringValue="v => (addrData.municipio = v)" :showOptions="displayMunicipiosOptions"></input-autocomplete>
						<ErrorMessage id="municipio"></ErrorMessage>
					</div>
				</div>

				<div class="form__container-group" v-if="postalCodeData.postal_code">
					<div class="form__container form__container--small">
						<label class="form__label" for="Colonia">Colonia</label>
						<Field class="form__input" name="colonia" id="colonia" placeholder="Colonia" v-model="addrData.colonia" @focus="displayColoniasOptions = true" autocomplete="off" @blur="displayColoniasOptions = false" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}"/>
						<input-autocomplete :elements="postalCodeData.colonias" :showOptions="displayColoniasOptions" :stringValue="addrData.colonia" @newStringValue="v => (addrData.colonia = v)"></input-autocomplete>
						<ErrorMessage id="colonia"></ErrorMessage>
					</div>

					<div class="form__container form__container--small">
						<label class="form__label" for="internal_number">Número interior</label>
						<Field class="form__input" name="internal_number" id="internal_number" placeholder="Número interior" v-model="addrData.internal_number" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}" />
						<ErrorMessage id="internal_number"></ErrorMessage>
					</div>
				</div>

				<div class="form__container-group" v-if="postalCodeData.postal_code">
					<div class="form__container form__container--small">
						<label class="form__label" for="street">Calle</label>
						<Field class="form__input" name="street" id="street" placeholder="Nombre de la calle" v-model="addrData.street" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}"/>
						<ErrorMessage id="street"></ErrorMessage>
					</div>

					<div class="form__container form__container--small">
						<label class="form__label" for="external_number">Número exterior</label>
						<Field class="form__input" name="external_number" id="external_number" placeholder="Número exterior" v-model="addrData.external_number" :disabled="disabledEdition" :class="{'form__input--disabled': disabledEdition}" />
						<ErrorMessage id="external_number"></ErrorMessage>
					</div>
				</div>

				<Field as="hidden" id="tax_payer_id" name="tax_payer_id" v-model="props.taxpayerid"/>
			</div>
			<input class="btn btn__default btn--regular btn__default--primary" type="submit" :value="submitButtonText" v-if="!disabledEdition">
			<button class="btn btn__outlined btn--small  btn__outlined--primary" v-if="!disabledEdition" @click="disabledEdition = true">
				<span class="material-symbols-outlined">cancel</span>
				Cancelar
			</button>
		</Form>
		<confirmation-popup :data="addrDeleteConfirmationData" @confirmed="addressDelete" @declined="confirmDelete = false" v-if="confirmDelete"></confirmation-popup>
	</div>
</template>

<script setup>
	import { onMounted, ref, watch, computed } from 'vue'
	import { useRouter } from 'vue-router'
	import * as yup from 'yup'
	import { useAppStore } from '../../store/index.js'
	import { Form, Field, ErrorMessage } from 'vee-validate'
	import { setFieldMessages } from '../../helpers/yup.locale.js'
	import { apiRequest } from '../../api/requests.js'
	import inputAutocomplete from './address-input-autocomplete.vue'
	import confirmationPopup from './confirmation_popup.vue'


	const props = defineProps(['taxpayerid'])
	const disabledEdition = ref(true)
	const confirmDelete = ref(false)
	const store = useAppStore()
	const router = useRouter()
	const addressData = () => {
		return {
			state_name: null,
			postal_code: null,
			municipio: [],
			localidad: [],
			colonia: [],
			street: null,
			external_number: null,
			internal_number: null,
			id: null
		}
	}
	const pCodeData = () => {
		return {
			municipios: [],
			localidades: [],
			colonias: [],
			postal_code: null
		}
	}
	const addrData = ref(addressData())
	const postalCodeData = ref(pCodeData())
	const submitButtonText = ref('Registrar dirección')
	const displayLocationOptions = ref(false)
	const displayMunicipiosOptions = ref(false)
	const displayColoniasOptions = ref(false)
	const tpaddressValidateSchema = yup.object().shape({
		postal_code: yup.string().label('código postal').required().max(5).min(4),
		state_name: yup.string().label('estado').max(100).nullable(),
		municipio: yup.string().label('municipio').max(50).nullable(),
		localidad: yup.string().label('localidad').max(50).nullable(),
		colonia: yup.string().label('colonia').max(100).nullable(),
		external_number: yup.string().label('número exterior').max(50).nullable(),
		internal_number: yup.string().label('número interno').max(50).nullable(),
		street: yup.string().label('calle').max(150).nullable()
	})
	const addrDeleteConfirmationData = {
		title: "Confirma tu solicitud",
		text: "¿Realmente desea borrar esta dirección? Esta acción es definitiva no se puede deshacer",
		btn_confirmation_text: "Continuar",
		btn_declination_text: "No borrar",
		icon: 'attention.png'
	}

	getTaxPayerAddress()

	function getPostalCode(e) {
		let postalCode = e.target.value
		displayLocationOptions.value = false
		displayMunicipiosOptions.value = false
		displayColoniasOptions.value = false
		if (postalCode.length == 5) {
			addrData.value = addressData()
			addrData.value.postal_code = postalCode
			postalCodeData.value = pCodeData()
			new apiRequest()
				.Get(
					{
						module: 'locations/postal-codes',
						params: '?include=municipios,localidades,colonias'
					},
					postalCode
				)
				.then(response => {
					postalCodeData.value = response.data.data
					addrData.value.state_name = response.data.data.state_name
				})
				.catch(error => {
					postalCodeData.value = pCodeData()
					store.push_alert(error.data)
				})
		}
	}

	function onSubmit(values, action) {
		let request = null
		if(addrData.value.id && addrData.value.id > 0) {
			request = new apiRequest().Put({
				module: 'tax-payers/addresses',
				data: values
			}, addrData.value.id)
		} else {
			request = new apiRequest().Post({
				module: 'tax-payers/addresses',
				data: values
			})
		}
		request.then(response => {
			store.push_alert(response.data.data)
			getTaxPayerAddress()
		}).catch(error => {
			store.push_alert(error.data)
		})
	}

	function getTaxPayerAddress() {
		new apiRequest().Get({
			module: 'tax-payers/addresses',
			params: `?tax_payer_id=eq:${props.taxpayerid}`
		}).then(response => {
			addrData.value = response.data.data[0]
			postalCodeData.value.postal_code = response.data.data[0].postal_code
			disabledEdition.value = true
			submitButtonText.value = "Actualizar dirección"
		}).catch(error => {
			addrData.value = addressData()
			postalCodeData.value = pCodeData()
			disabledEdition.value = false
			submitButtonText.value = "Registrar dirección"
		})
	}

	function addressDelete() {
		confirmDelete.value = false
		new apiRequest().Delete({
			module: "tax-payers/addresses"
		}, addrData.value.id).then(response => {
			store.push_alert(response.data.data)
			getTaxPayerAddress()
		}).catch(error => {
			store.push_alert(error.data)
		})
	}
</script>
