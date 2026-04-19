<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section
					class="section section--wide"
					v-if="contract"
				>
					<div class="section__top">
						<h1 class="section__title">{{ contract.name || 'Crear nuevo contrato' }}</h1>
						<span class="section__help-text">Agrega o edita la información de el contrato</span>
						<div
							class="section__options btn__grouped"
							v-if="contractEditBlocked && contract.id"
						>
							<button
								class="btn btn__default btn--smaller btn__default--primary"
								@click.prevent="contractEditBlocked = false"
							>
								<span class="material-symbols-outlined">edit_square</span>
								Editar contrato
							</button>
							<button
								class="btn btn__default btn--smaller btn__default--primary"
								@click.prevent="confirmDelete = true"
							>
								<span class="material-symbols-outlined">delete</span>
								Eliminar contrato
							</button>
						</div>
					</div>
					<confirmation-popup
						:data="contractDeleteConfirmationData"
						@confirmed="contractDelete"
						@declined="confirmDelete = false"
						v-if="confirmDelete"
					></confirmation-popup>
					<div class="section__content">
						<Form
							@submit="onSubmit"
							class="form"
							:initial-values="contract"
							:validation-schema="contractValidateSchema"
							v-slot="{ values, setErrors }"
						>
							<div>
								<div class="form__container-group">
									<div class="form__container form__container--half">
										<label
											class="form__label form__label--required"
											for="contract_number"
											id="contract_number"
											>Número de contrato</label
										>
										<Field
											id="name"
											name="contract_number"
											placeholder="Número de contrato"
											class="form__input"
											:disabled="contractEditBlocked && contract.id"
											:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
										/>
										<ErrorMessage
											name="contract_number"
											class="form__alert"
											data-field="contract_number"
										/>
									</div>

									<div class="form__container form__container--half">
										<label
											class="form__label form__label--required"
											for="contract_id"
											id="contract_id"
											>Identificador de contrato</label
										>
										<Field
											id="name"
											name="contract_id"
											placeholder="Identificador de contrato"
											class="form__input"
											:disabled="contractEditBlocked && contract.id"
											:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
										/>
										<ErrorMessage
											name="contract_id"
											class="form__alert"
											data-field="contract_id"
										/>
									</div>
								</div>

								<div class="form__container-group">
									<div class="form__container form__container--half">
										<label
											class="form__label form__label--required"
											for="procedure_id"
											id="procedure_id"
											>Tipo de procedimiento</label
										>
										<!-- select-->
										<Field
											as="select"
											id="procedure_id"
											name="procedure_id"
											class="form__input"
											:disabled="contractEditBlocked && contract.id"
											:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
										>
											<option
												value=""
												disabled
											>
												Selecciona el tipo de procedimiento
											</option>
											<option
												v-for="procedure in procedures"
												:key="procedure.slug"
												:value="procedure.id"
											>
												{{ procedure.name }}
											</option>
										</Field>
										<ErrorMessage
											name="procedure_id"
											class="form__alert"
											data-field="procedure_id"
										/>
									</div>

									<div class="form__container form__container--half">
										<label
											class="form__label"
											for="subject"
											id="subject"
											>Materia</label
										>
										<Field
											id="subject"
											name="subject"
											placeholder="Materia de el contrato"
											class="form__input"
											:disabled="contractEditBlocked && contract.id"
											:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
										/>
										<ErrorMessage
											name="subject"
											class="form__alert"
											data-field="subject"
										/>
									</div>
								</div>

								<div class="form__container form__container--full">
									<label
										class="form__label"
										for="comments"
										id="notes"
										>Comentarios o notas</label
									>
									<Field
										class="form__input form__input--textarea"
										rows="4"
										as="textarea"
										id="notes"
										name="notes"
										placeholder="Comentarios o notas acerca de el contrato"
										:disabled="contractEditBlocked && contract.id"
										:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
									/>
									<ErrorMessage
										name="notes"
										class="form__alert"
										data-field="notes"
									/>
								</div>
							</div>
							<input
								v-if="!contractEditBlocked || !contract.id"
								class="btn btn__default btn--small btn__default--primary"
								type="submit"
								:value="submitButtonText"
							/>
							<button
								v-if="!contractEditBlocked"
								class="btn btn__outlined btn--small btn__outlined--primary"
								@click="contractEditBlocked = true"
							>
								<span class="material-symbols-outlined">cancel</span>
								Cancelar
							</button>
						</Form>
					</div>
				</section>
			</main>
		</div>
	</div>
</template>

<script setup>
	import sidebarComponent from '../../partials/sidebar.vue';
	import contentHeader from '../../partials/content_header.vue';
	import { onMounted, ref, watch, computed } from 'vue';
	import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
	import * as yup from 'yup';
	import { useAppStore } from '../../../store/index.js';
	import { Form, Field, ErrorMessage } from 'vee-validate';
	import { setFieldMessages } from '../../../helpers/yup.locale.js';
	import { apiRequest } from '../../../api/requests.js';
	import confirmationPopup from '../../partials/confirmation_popup.vue';

	const store = useAppStore();
	const router = useRouter();
	const route = useRoute();
	const contract = ref();
	const procedures = ref([]);
	const contractDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar esta contrato? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};
	const confirmDelete = ref(false);
	const contractEditBlocked = ref(true);
	const submitButtonText = computed(() => {
		return contract.value && contract.value.id ? 'Actualizar contrato' : 'Crear contrato';
	});

	const contractValidateSchema = yup.object().shape({
		name: yup.string().required().label('Nombre de el contrato').max(150),
		comments: yup.string().label('Comentarios'),
	});

	onBeforeRouteLeave((to, from, next) => {
		contract.value = null;
		next();
	});

	onMounted(() => {
		console.log('manage route');
		manageRoute();
	});

	watch(
		() => route.path,
		async () => {
			manageRoute();
		}
	);

	function manageRoute() {
		if (route.name === 'contractView') {
			if (!route.params.id || route.params.id === 0) {
				router.push({ name: 'contractCreate' });
			} else {
				store.new_elements([{ name: 'contractCreate', text: 'Nuevo contrato' }]);
				getContract();
				getProcedures();
			}
		} else {
			contract.value = { name: '', notes: '', id: null };
			getProcedures();
		}
	}

	function onSubmit(values, action) {
		if (!contract.value.id) {
			new apiRequest()
				.Post({
					module: 'contracts',
					data: values,
				})
				.then(response => {
					store.push_alert(response.data);
					router.push({ name: 'contractView', params: { id: response.data.data.inserted_id } });
				})
				.catch(error => {
					store.push_alert(error.data);
				});
		} else {
			new apiRequest()
				.Put(
					{
						module: 'contracts',
						data: values,
					},
					contract.value.id
				)
				.then(response => {
					store.push_alert(response.data);
					contractEditBlocked.value = true;
					getContract();
				})
				.catch(error => {
					store.push_alert(error.data);
				});
		}
	}

	function getContract() {
		new apiRequest()
			.Get(
				{
					module: 'contracts',
				},
				router.currentRoute.value.params.id
			)
			.then(response => {
				contract.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
				router.push({ name: 'homeView' });
			});
	}

	function contractDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'contracts',
				},
				contract.value.id
			)
			.then(response => {
				confirmDelete.value = false;
				store.push_alert(response.data);
				router.push({ name: 'contractList' });
			})
			.catch(error => {
				confirmDelete.value = false;
				store.push_alert(error.data);
			});
	}

	function getProcedures() {
		new apiRequest()
			.Get({
				module: 'procedimientos',
			})
			.then(response => {
				procedures.value = response.data.data;
			})
			.catch(error => {
				store.push_alert(error.data);
			});
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
