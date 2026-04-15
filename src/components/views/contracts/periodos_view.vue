<template>
	<section
		class="section section--wide"
		v-if="periodo"
	>
		<div class="section__top">
			<h1 class="section__title">{{ periodo.name || 'Crear nuevo periodo' }}</h1>
			<span class="section__help-text">Agrega o edita la información de los periodos de contratos</span>
		</div>
		<div class="section__content">
			<Form
				@submit="onSubmit"
				class="form"
				:initial-values="periodo"
				:validation-schema="periodoValidateSchema"
				v-slot="{ values, setErrors }"
			>
				<div>
					<div class="form__container form__container--full">
						<label
							class="form__label form__label--required"
							for="name"
							id="name"
							>Nombre del periodo</label
						>
						<Field
							id="name"
							name="name"
							placeholder="Nombre de de tu periodo"
							class="form__input"
						/>
						<ErrorMessage
							name="name"
							class="form__alert"
							data-field="name"
						/>
					</div>
				</div>
				<input
					class="btn btn__default btn--small btn__default--primary"
					type="submit"
					:value="submitButtonText"
				/>
				<button
					class="btn btn__outlined btn--small btn__outlined--primary"
					@click.prevent="emits('close')"
				>
					<span class="material-symbols-outlined">cancel</span>
					Cancelar
				</button>
			</Form>
		</div>
	</section>
</template>

<script setup>
	import { onMounted, ref, computed, defineProps, defineEmits } from 'vue';
	import * as yup from 'yup';
	import { useAppStore } from '../../../store/index.js';
	import { Form, Field, ErrorMessage } from 'vee-validate';
	import { setFieldMessages } from '../../../helpers/yup.locale.js';
	import { apiRequest } from '../../../api/requests.js';

	const store = useAppStore();
	const periodo = ref();
	const emits = defineEmits(['changed', 'close']);
	const props = defineProps({
		id: {
			type: [String, Number],
			required: true,
		},
	});
	const submitButtonText = computed(() => {
		return props.id === 'new' ? 'Crear periodo' : 'Actualizar periodo';
	});

	const periodoValidateSchema = yup.object().shape({
		name: yup.string().required().label('Nombre del periodo').max(50),
	});

	onMounted(() => {
		if (props.id !== 'new') {
			getPeriodo();
		} else {
			periodo.value = { name: '', id: null };
		}
	});

	function onSubmit(values) {
		if (props.id === 'new') {
			new apiRequest()
				.Post({
					module: 'periodos-contratos',
					data: values,
				})
				.then(response => {
					store.push_alert(response.data);
					emits('changed');
				})
				.catch(error => {
					store.push_alert(error.data);
				});
		} else {
			new apiRequest()
				.Put(
					{
						module: 'periodos-contratos',
						data: values,
					},
					periodo.value.id
				)
				.then(response => {
					store.push_alert(response.data);
					emits('changed');
				})
				.catch(error => {
					store.push_alert(error.data);
				});
		}
	}

	function getPeriodo() {
		new apiRequest()
			.Get(
				{
					module: 'periodos-contratos',
				},
				props.id
			)
			.then(response => {
				periodo.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
			});
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
