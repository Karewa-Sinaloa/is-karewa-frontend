<template>
	<Form @submit="onSubmit" class="form" :initial-values="addrData" :validation-schema="tpaddressValidateSchema" v-slot="{ values, setErrors }">
		<div class="form__fieldset">
			<div class="form__container-group">
				<div class="form__container form__container--small">
					<label class="form__label form__label--required" for="postal_code">Código postal</label>
					<Field class="form__input" name="postal_code" id="postal_code" placeholder="00000" @change="getPostalCode" />
					<ErrorMessage id="postal_code"></ErrorMessage>
				</div>

				<div class="form__container form__container--small" v-if="postalCodeData.postal_code">
					<label class="form__label" for="state">Estado</label>
					<Field class="form__input" name="state_name" id="state_name" placeholder="Estado" disabled v-model="postalCodeData.state_name" />
					<ErrorMessage id="state_name"></ErrorMessage></div>
			</div>

			<div class="form__container-group" v-if="postalCodeData.postal_code">
				<div class="form__container form__container--small">
					<label class="form__label" for="location">Localidad</label>
					<Field class="form__input" name="localidad" id="localidad" placeholder="Localidad" v-model="localidad" @focus="displayLocationOptions = true" autocomplete="off" @blur="displayLocationOptions = false"/>
					<input-autocomplete :elements="postalCodeData.localidades" :showOptions="displayLocationOptions" :stringValue="localidad" @newStringValue="v => (localidad = v)"></input-autocomplete>
					<ErrorMessage id="location"></ErrorMessage>
				</div>

				<div class="form__container form__container--small">
					<label class="form__label" for="municipio">Municipio</label>
					<Field class="form__input" name="municipio" id="municipio" placeholder="Municipio" v-model="municipio" @focus="displayMunicipiosOptions = true" autocomplete="off" @blur="displayMunicipiosOptions = false"/>
					<input-autocomplete :elements="postalCodeData.municipios" :stringValue="municipio" @newStringValue="v => (municipio = v)" :showOptions="displayMunicipiosOptions"></input-autocomplete>
					<ErrorMessage id="municipio"></ErrorMessage>
				</div>
			</div>

			<div class="form__container-group" v-if="postalCodeData.postal_code">
				<div class="form__container form__container--small">
					<label class="form__label" for="Colonia">Colonia</label>
					<Field class="form__input" name="colonia" id="colonia" placeholder="Colonia" v-model="colonia" @focus="displayColoniasOptions = true" autocomplete="off" @blur="displayColoniasOptions = false"/>
					<input-autocomplete :elements="postalCodeData.colonias" :showOptions="displayColoniasOptions" :stringValue="colonia" @newStringValue="v => (colonia = v)"></input-autocomplete>
					<ErrorMessage id="colonia"></ErrorMessage>
				</div>

				<div class="form__container form__container--small">
					<label class="form__label" for="internal_number">Número interior</label>
					<Field class="form__input" name="internal_number" id="internal_number" placeholder="Número interior" />
					<ErrorMessage id="internal_number"></ErrorMessage>
				</div>
			</div>

			<div class="form__container-group" v-if="postalCodeData.postal_code">
				<div class="form__container form__container--small">
					<label class="form__label" for="street">Calle</label>
					<Field class="form__input" name="street" id="street" placeholder="Nombre de la calle"/>
					<ErrorMessage id="street"></ErrorMessage>
				</div>

				<div class="form__container form__container--small">
					<label class="form__label" for="external_number">Número exterior</label>
					<Field class="form__input" name="external_number" id="external_number" placeholder="Número exterior" />
					<ErrorMessage id="external_number"></ErrorMessage>
				</div>
			</div>
		</div>
		<input class="btn btn__default btn--regular" type="submit" value="Registrar dirección">
	</Form>
</template>

<script setup>
	import { onMounted, ref, watch, computed } from 'vue'
	import { useRouter } from 'vue-router'
	import * as yup from 'yup'
	import { useAppStore } from '../../store/index.js'
	import { Form, Field, ErrorMessage } from 'vee-validate'
	import { setFieldMessages } from '../../helpers/yup.locale.js'
	import { apiRequest } from '../../api/requests.js'
	import inputAutocomplete from '../partials/input-autocomplete.vue'

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
			internal_number: null
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

	const displayLocationOptions = ref(false)
	const displayMunicipiosOptions = ref(false)
	const displayColoniasOptions = ref(false)

	const localidad = ref(null)
	const municipio = ref(null)
	const colonia = ref(null)
	
	const tpaddressValidateSchema = yup.object().shape({
		postal_code: yup.string().label('código postal').required().max(5).min(4),
		state: yup.string().label('estado').max(100).nullable(),
		municipio: yup.string().label('municipio').max(50).nullable(),
		localidad: yup.string().label('localidad').max(50).nullable(),
		colonia: yup.string().label('colonia').max(100).nullable(),
		external_number: yup.string().label('número exterior').max(50).nullable(),
		internal_number: yup.string().label('número interno').max(50).nullable(),
		street: yup.string().label('calle').max(150).nullable()
	})

	function getPostalCode(e) {
		let postalCode = e.target.value
		displayLocationOptions.value = false
		displayMunicipiosOptions.value = false
		displayColoniasOptions.value = false
		localidad.value = null
		municipio.value = null
		colonia.value = null
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
				})
				.catch(error => {
					postalCodeData.value = pCodeData()
					store.push_alert(error.data)
				})
		}
	}

	function onSubmit(values, action) {
		new apiRequest().Post({
			module: 'tax-payer/addresses',
			data: values
		}).then(response => {
			store.push_aler(response.data.data)
		}).catch(error => {
			store.push_alert(error.data)
		})
	}
</script>
