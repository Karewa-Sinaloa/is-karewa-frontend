<template>
	<div class="dash">
		<sidebar-component />
		<div class="content">
			<content-header />
			<main class="main">
				<section
					class="section section--wide"
					v-if="user"
				>
					<div class="section__top">
						<h1 class="section__title">{{ title }}</h1>
						<span class="section__help-text">Agrega o edita la información del usuario del sistema</span>
						<div
							class="section__options btn__grouped"
							v-if="user.id && readOnly"
						>
							<button
								class="btn btn__default btn--smaller btn__default--primary"
								type="button"
								@click="readOnly = false"
							>
								<icon-set icon="edit" />
								Editar usuario
							</button>
							<button
								class="btn btn__default btn--smaller btn__default--primary"
								type="button"
								@click="confirmDelete = true"
							>
								<icon-set icon="delete" />
								Eliminar usuario
							</button>
						</div>
					</div>
					<confirmation-popup
						:data="userDeleteConfirmationData"
						@confirmed="userDelete"
						@declined="confirmDelete = false"
						v-if="confirmDelete"
					></confirmation-popup>
					<div class="section__content">
						<Form
							ref="formRef"
							@submit="onSubmit"
							class="form"
							:initial-values="user"
							:validation-schema="userValidateSchema"
							:key="route.fullPath"
							v-slot="{ values, setErrors }"
						>
							<div class="form__container-group">
								<div class="form__container form__container--half">
									<label
										class="form__label form__label--required"
										for="first_name"
										id="first_name"
										>Nombre(s)</label
									>
									<Field
										id="first_name"
										name="first_name"
										placeholder="Nombre(s)"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="first_name"
										class="form__alert"
										data-field="first_name"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label"
										for="middle_name"
										id="middle_name"
										>Segundo nombre</label
									>
									<Field
										id="middle_name"
										name="middle_name"
										placeholder="Segundo nombre"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="middle_name"
										class="form__alert"
										data-field="middle_name"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label form__label--required"
										for="last_name"
										id="last_name"
										>Apellido(s)</label
									>
									<Field
										id="last_name"
										name="last_name"
										placeholder="Apellido(s)"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="last_name"
										class="form__alert"
										data-field="last_name"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label"
										for="second_last_name"
										id="second_last_name"
										>Segundo apellido</label
									>
									<Field
										id="second_last_name"
										name="second_last_name"
										placeholder="Segundo apellido"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="second_last_name"
										class="form__alert"
										data-field="second_last_name"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label form__label--required"
										for="email"
										id="email"
										>Correo electrónico</label
									>
									<Field
										id="email"
										name="email"
										type="email"
										placeholder="usuario@dominio.tld"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="email"
										class="form__alert"
										data-field="email"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label"
										for="phone"
										id="phone"
										>Teléfono</label
									>
									<Field
										id="phone"
										name="phone"
										type="tel"
										placeholder="5555555555"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="phone"
										class="form__alert"
										data-field="phone"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label form__label--required"
										for="role_id"
										id="role_id"
										>Rol</label
									>
									<Field
										id="role_id"
										name="role_id"
										as="select"
										class="form__select"
										:disabled="readOnly && user.id"
										:class="{ 'form__select--disabled': readOnly && user.id }"
									>
										<option
											v-if="roles.length === 0"
											:value="user.role_id || 5"
										>
											Rol predeterminado
										</option>
										<option
											v-for="role in roles"
											:key="role.id"
											:value="role.id"
										>
											{{ role.name }}
										</option>
									</Field>
									<ErrorMessage
										name="role_id"
										class="form__alert"
										data-field="role_id"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label form__label--required"
										for="status_id"
										id="status_id"
										>Estatus</label
									>
									<Field
										id="status_id"
										name="status_id"
										as="select"
										class="form__select"
										:disabled="readOnly && user.id"
										:class="{ 'form__select--disabled': readOnly && user.id }"
									>
										<option :value="1">Activo</option>
										<option :value="2">Inactivo</option>
									</Field>
									<ErrorMessage
										name="status_id"
										class="form__alert"
										data-field="status_id"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label"
										:class="{ 'form__label--required': !user.id || !readOnly }"
										for="password"
										id="password"
										>Contraseña</label
									>
									<Field
										id="password"
										name="password"
										type="password"
										placeholder="************"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="password"
										class="form__alert"
										data-field="password"
									/>
								</div>
								<div class="form__container form__container--half">
									<label
										class="form__label"
										:class="{ 'form__label--required': !user.id || !readOnly }"
										for="repeat_password"
										id="repeat_password"
										>Repetir contraseña</label
									>
									<Field
										id="repeat_password"
										name="repeat_password"
										type="password"
										placeholder="************"
										class="form__input"
										:disabled="readOnly && user.id"
										:class="{ 'form__input--disabled': readOnly && user.id }"
									/>
									<ErrorMessage
										name="repeat_password"
										class="form__alert"
										data-field="repeat_password"
									/>
								</div>
							</div>
							<input
								v-if="!readOnly || !user.id"
								class="btn btn__default btn--small btn__default--primary"
								type="submit"
								:value="submitButtonText"
							/>
							<button
								v-if="user.id && !readOnly"
								class="btn btn__outlined btn--small btn__outlined--primary"
								type="button"
								@click="cancelEdit"
							>
								<icon-set icon="close" />
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
	import { computed, onMounted, ref, watch } from 'vue';
	import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
	import * as yup from 'yup';
	import { useAppStore } from '../../../store/index.js';
	import { Form, Field, ErrorMessage } from 'vee-validate';
	import { setFieldMessages } from '../../../helpers/yup.locale.js';
	import { apiRequest } from '../../../api/requests.js';
	import confirmationPopup from '../../partials/confirmation_popup.vue';
	import sidebarComponent from '../../partials/sidebar.vue';
	import contentHeader from '../../partials/content_header.vue';

	const store = useAppStore();
	const router = useRouter();
	const route = useRoute();
	const user = ref(null);
	const roles = ref([]);
	const readOnly = ref(true);
	const confirmDelete = ref(false);
	const formRef = ref(null);

	const userDeleteConfirmationData = {
		title: 'Confirma tu solicitud',
		text: '¿Realmente desea borrar este usuario? Esta acción es definitiva y no se puede deshacer',
		btn_confirmation_text: 'Si, borrar ahora',
		btn_declination_text: 'Cancelar',
		icon: 'attention.png',
	};

	const title = computed(() => {
		if (!user.value) return '';
		if (!user.value.id) return 'Crear nuevo usuario';
		return [user.value.first_name, user.value.middle_name, user.value.last_name, user.value.second_last_name].filter(part => part).join(' ') || 'Ficha del usuario';
	});

	const submitButtonText = computed(() => {
		return user.value && user.value.id ? 'Actualizar usuario' : 'Crear usuario';
	});

	const userValidateSchema = computed(() => {
		const create = !user.value || !user.value.id;
		return yup.object().shape({
			first_name: yup.string().required().max(100).label('nombre'),
			middle_name: yup.string().max(100).label('segundo nombre'),
			last_name: yup.string().required().max(100).label('apellido'),
			second_last_name: yup.string().max(100).label('segundo apellido'),
			email: yup.string().required().email().label('correo electrónico'),
			phone: yup
				.string()
				.matches(/^\d{10,20}$/, 'El valor del campo ${label} debe contener de 10 a 20 dígitos')
				.label('teléfono'),
			role_id: yup.number().integer().min(1).label('rol'),
			status_id: yup.number().oneOf([1, 2]).label('estatus'),
			password: create
				? yup
						.string()
						.required()
						.min(8)
						.oneOf([yup.ref('repeat_password')])
						.label('contraseña')
				: yup
						.string()
						.test('password-length', 'Este campo debe contener como mínimo 8 caracteres', value => !value || value.length >= 8)
						.oneOf([yup.ref('repeat_password')])
						.label('contraseña'),
			repeat_password: yup.string().label('repetir contraseña'),
		});
	});

	onMounted(() => {
		getRoles();
		manageRoute();
	});

	watch(
		() => route.fullPath,
		() => {
			manageRoute();
		}
	);

	onBeforeRouteLeave(() => {
		user.value = null;
	});

	function manageRoute() {
		if (route.name === 'configuracionUsuariosView') {
			if (!route.params.id || route.params.id === 0) {
				router.push({ name: 'configuracionUsuariosCreate' });
			} else {
				getUser();
			}
		} else {
			readOnly.value = false;
			user.value = {
				id: null,
				first_name: '',
				middle_name: '',
				last_name: '',
				second_last_name: '',
				email: '',
				phone: '',
				password: '',
				repeat_password: '',
				role_id: 5,
				status_id: 1,
			};
		}
	}

	function getRoles() {
		new apiRequest()
			.Get({
				module: 'roles',
				params: '?page=1&limit=99',
			})
			.then(response => {
				roles.value = response.data.data ? response.data.data : [];
			})
			.catch(error => {
				store.push_alert(error.data);
			});
	}

	function getUser() {
		user.value = null;
		new apiRequest()
			.Get(
				{
					module: 'users',
				},
				route.params.id
			)
			.then(response => {
				user.value = response.data.data;
				readOnly.value = !(route.query.edit === true || route.query.edit === 'true');
			})
			.catch(error => {
				store.push_alert(error.data);
				router.push({ name: 'configuracionView', params: { page: 1 } });
			});
	}

	function buildPayload(values) {
		const payload = {
			first_name: values.first_name,
			last_name: values.last_name,
			email: values.email,
			role_id: Number(values.role_id),
			status_id: Number(values.status_id),
		};
		if (values.middle_name) payload.middle_name = values.middle_name;
		if (values.second_last_name) payload.second_last_name = values.second_last_name;
		if (values.phone) payload.phone = Number(values.phone);
		if (values.password) payload.password = values.password;
		return payload;
	}

	function onSubmit(values, actions) {
		if (!user.value.id) {
			new apiRequest()
				.Post({
					module: 'users',
					data: buildPayload(values),
				})
				.then(response => {
					store.push_alert(response.data);
					const createdId = response.data.data && response.data.data.inserted_id ? response.data.data.inserted_id : null;
					if (createdId) {
						router.push({ name: 'configuracionUsuariosView', params: { id: createdId } });
					} else {
						router.push({ name: 'configuracionView', params: { page: 1 } });
					}
				})
				.catch(error => {
					handleError(error, actions);
				});
		} else {
			new apiRequest()
				.Put(
					{
						module: 'users',
						data: buildPayload(values),
					},
					user.value.id
				)
				.then(response => {
					store.push_alert(response.data);
					readOnly.value = true;
					getUser();
				})
				.catch(error => {
					handleError(error, actions);
				});
		}
	}

	function handleError(error, actions) {
		if (error.status === 400 && error.data && error.data.errors) {
			actions.setErrors(setFieldMessages(error.data.errors));
		} else {
			store.push_alert(error.data);
		}
	}

	function cancelEdit() {
		readOnly.value = true;
		if (formRef.value) {
			formRef.value.resetForm({ values: { ...user.value } });
		}
	}

	function userDelete() {
		new apiRequest()
			.Delete(
				{
					module: 'users',
				},
				user.value.id
			)
			.then(response => {
				confirmDelete.value = false;
				store.push_alert(response.data);
				router.push({ name: 'configuracionView', params: { page: 1 } });
			})
			.catch(error => {
				confirmDelete.value = false;
				store.push_alert(error.data);
			});
	}
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
