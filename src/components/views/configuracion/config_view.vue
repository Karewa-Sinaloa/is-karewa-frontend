<template>
	<section class="section section--wide">
		<div class="section__top">
			<h1 class="section__title">{{ entry.name || 'Parámetro de configuración' }}</h1>
			<span class="section__help-text">Consulta o edita la información de este parámetro</span>
		</div>
		<div class="section__content">
			<Form
				@submit="onSubmit"
				class="form"
				:initial-values="initialValues"
				:validation-schema="validationSchema"
				v-slot="{ values, setFieldValue }"
			>
				<div class="form__container form__container--full">
					<label
						class="form__label form__label--required"
						for="config-name"
						>Nombre del parámetro</label
					>
					<Field
						id="config-name"
						name="name"
						placeholder="Nombre del parámetro"
						class="form__input"
					/>
					<ErrorMessage
						name="name"
						class="form__alert"
						data-field="name"
					/>
				</div>
				<div class="form__container form__container--full">
					<label
						class="form__label form__label--required"
						for="config-slug"
						>Clave del parámetro</label
					>
					<Field
						id="config-slug"
						name="slug"
						placeholder="clave-del-parametro"
						class="form__input"
					/>
					<ErrorMessage
						name="slug"
						class="form__alert"
						data-field="slug"
					/>
				</div>
				<div class="form__container form__container--full">
					<label
						class="form__label"
						for="config-value"
					>
						Valor
						<span
							class="config-value__type"
							:class="{ 'config-value__type--json': isJsonMode }"
							>{{ isJsonMode ? 'JSON' : 'Texto' }}</span
						>
					</label>
					<Field
						id="config-value"
						name="value"
						as="textarea"
						rows="10"
						placeholder="Valor del parámetro"
						class="form__input form__input--textarea config-value__field"
					/>
					<ErrorMessage
						name="value"
						class="form__alert"
						data-field="value"
					/>
					<span
						class="form__alert"
						v-if="valueError"
						v-text="valueError"
					></span>
					<button
						class="config-value__toggle"
						type="button"
						v-if="secretMap.length > 0"
						@click.prevent="toggleReveal(values, setFieldValue)"
					>
						<icon-set icon="view" />
						{{ revealed ? 'Ocultar valores sensibles' : 'Mostrar valores sensibles' }}
					</button>
				</div>
				<input
					class="btn btn__default btn--small btn__default--primary"
					type="submit"
					value="Guardar cambios"
					:disabled="submitting"
				/>
				<button
					class="btn btn__outlined btn--small btn__outlined--primary"
					type="button"
					@click.prevent="emits('close')"
				>
					<icon-set icon="close" />
					Cancelar
				</button>
			</Form>
		</div>
	</section>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import * as yup from 'yup';
	import { useAppStore } from '../../../store/index.js';
	import { Form, Field, ErrorMessage } from 'vee-validate';
	import { setFieldMessages } from '../../../helpers/yup.locale.js';
	import { apiRequest } from '../../../api/requests.js';
	import { detectValueMode, maskSecrets, parseJsonObject, restoreSecrets, toEditableValue } from '../../../helpers/config.value.js';

	const store = useAppStore();
	const submitting = ref(false);
	const revealed = ref(false);
	const valueError = ref('');
	const emits = defineEmits(['changed', 'close']);
	const props = defineProps({
		entry: {
			type: Object,
			required: true,
		},
	});

	const rawValue = props.entry.value === null || props.entry.value === undefined ? '' : String(props.entry.value);
	const isJsonMode = detectValueMode(rawValue) === 'json';
	const maskedValue = maskSecrets(toEditableValue(rawValue), isJsonMode ? 'json' : 'text');
	const secretMap = ref(maskedValue.map);
	const initialValues = ref({
		name: props.entry.name || '',
		slug: props.entry.slug || '',
		value: maskedValue.text,
	});

	const valueRule = computed(() => {
		if (!isJsonMode) {
			return yup.string().notRequired().label('valor');
		}
		return yup
			.string()
			.label('valor')
			.test('config-json', 'El valor es obligatorio y debe contener JSON válido', value => !!(value && value.trim()) && parseJsonObject(value) !== null);
	});

	const validationSchema = computed(() => {
		return yup.object().shape({
			name: yup.string().trim().required().label('nombre del parámetro').max(45),
			slug: yup.string().trim().required().label('clave del parámetro').max(45),
			value: valueRule.value,
		});
	});

	function toggleReveal(values, setFieldValue) {
		valueError.value = '';
		if (revealed.value) {
			const masked = maskSecrets(values.value, isJsonMode ? 'json' : 'text');
			setFieldValue('value', masked.text);
			secretMap.value = masked.map;
			revealed.value = false;
			return;
		}
		const restored = restoreSecrets(values.value, secretMap.value, isJsonMode ? 'json' : 'text');
		if (!restored.ok) {
			valueError.value = 'No se pudieron recuperar todos los valores ocultos, guarda los cambios antes de mostrarlos';
			return;
		}
		setFieldValue('value', restored.text);
		revealed.value = true;
	}

	function onSubmit(values, actions) {
		valueError.value = '';
		let value = values.value;
		if (!revealed.value) {
			const restored = restoreSecrets(values.value, secretMap.value, isJsonMode ? 'json' : 'text');
			if (!restored.ok) {
				actions.setErrors({
					value: 'Falta un valor oculto en el texto, muestra los valores sensibles y vuelve a incluirlo antes de guardar',
				});
				return;
			}
			value = restored.text;
			if (isJsonMode && parseJsonObject(value) === null) {
				actions.setErrors({ value: 'El valor debe contener JSON válido' });
				return;
			}
		}
		submitting.value = true;
		return new apiRequest()
			.Put(
				{
					module: 'config',
					data: {
						name: String(values.name).trim(),
						slug: String(values.slug).trim(),
						value: value,
					},
				},
				props.entry.id
			)
			.then(response => {
				submitting.value = false;
				store.push_alert(response.data);
				emits('changed');
			})
			.catch(error => {
				submitting.value = false;
				if (error.status === 400 && error.data && error.data.errors) {
					actions.setErrors(setFieldMessages(error.data.errors));
					return;
				}
				store.push_alert(error.data);
			});
	}
</script>

<style lang="sass" scoped>
	@use "../../../assets/sass/components/_section.sass"
	@use "../../../assets/sass/components/_config.sass"
</style>
