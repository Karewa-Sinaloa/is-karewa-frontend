<template>
	<section
		class="section section--wide"
		v-if="role"
	>
		<div class="section__top">
			<h1 class="section__title">{{ role.name || 'Crear nuevo rol' }}</h1>
			<permission-notice section="roles" />
			<span class="section__help-text">Agrega o edita la información del rol</span>
		</div>
		<div class="section__content">
			<Form
				@submit="onSubmit"
				class="form"
				:initial-values="role"
				:validation-schema="roleValidateSchema"
				v-slot="{ values }"
			>
				<div class="form__container form__container--full">
					<label
						class="form__label form__label--required"
						for="name"
						id="name"
						>Nombre del rol</label
					>
					<Field
						id="name"
						name="name"
						placeholder="Nombre del rol"
						class="form__input"
					/>
					<ErrorMessage
						name="name"
						class="form__alert"
						data-field="name"
					/>
				</div>
				<input
					class="btn btn__default btn--small btn__default--primary"
					type="submit"
					:value="submitButtonText"
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
	import permissionNotice from '../../partials/permission_notice.vue';
	import { computed, onMounted, ref } from 'vue';
	import * as yup from 'yup';
	import { useAppStore } from '../../../store/index.js';
	import { Form, Field, ErrorMessage } from 'vee-validate';
	import { apiRequest } from '../../../api/requests.js';

	const store = useAppStore();
	const role = ref();
	const emits = defineEmits(['changed', 'close']);
	const props = defineProps({
		id: {
			type: [String, Number],
			required: true,
		},
	});

	const submitButtonText = computed(() => {
		return props.id === 'new' ? 'Crear rol' : 'Actualizar rol';
	});

	const roleValidateSchema = yup.object().shape({
		name: yup.string().required().label('nombre del rol').max(100),
	});

	onMounted(() => {
		if (props.id !== 'new') {
			getRole();
		} else {
			role.value = { name: '', id: null };
		}
	});

	function onSubmit(values) {
		if (props.id === 'new') {
			new apiRequest()
				.Post({
					module: 'roles',
					data: { name: values.name },
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
						module: 'roles',
						data: { name: values.name },
					},
					role.value.id
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

	function getRole() {
		new apiRequest()
			.Get(
				{
					module: 'roles',
				},
				props.id
			)
			.then(response => {
				role.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
				emits('close');
			});
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
