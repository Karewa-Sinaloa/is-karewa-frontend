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
                <h2 class="form__head2">Información general de el contrato</h2>
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
											class="form__select"
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
											for="subject_id"
											id="subject_id"
											>Materia</label
										>
										<Field
											id="subject_id"
											name="subject_id"
                      as="select"
											placeholder="Materia de el contrato"
											class="form__select"
											:disabled="contractEditBlocked && contract.id"
											:class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
										>
                      <option value="" disabled>Selecciona la materia de el contrato</option>
                      <option
                        v-for="subject in subjects"
                        :key="subject.slug"
                        :value="subject.id"
                      >
                        {{ subject.name }}
                      </option>
                    </Field>
										<ErrorMessage
											name="subject"
											class="form__alert"
											data-field="subject"
										/>
									</div>
								</div>
                <!-- Seleccionar el año de inicio de la administración -->
                <div class="form__container-group">
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="admin_period_start"
                      id="admin_period_start"
                    >Inicio de administración</label>
                    <Field
                      id="admin_period_start"
                      name="admin_period_start"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el año</option>
                      <option
                        v-for="year in Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i)"
                        :key="year"
                        :value="year"
                      >
                        {{ year }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="admin_period_start"
                      class="form__alert"
                      data-field="admin_period_start"
                    />
                  </div>
                  <!-- seleccionar el año de fin de la administración -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="admin_period_end"
                      id="admin_period_end"
                    >Fin de administración</label>
                    <Field
                      id="admin_period_end"
                      name="admin_period_end"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el año de fin</option>
                      <option
                        v-for="year in Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() + 6) - i)"
                        :key="year"
                        :value="year"
                      >
                        {{ year }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="admin_period_end"
                      class="form__alert"
                      data-field="admin_period_end"
                    />
                  </div>

                  <!--seleccionar el año fiscal o ejercicion que este dentro del rango del año de inicio y fin de la administración -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="fiscal_year"
                      id="fiscal_year"
                    >Año fiscal o ejercicio</label>
                    <Field
                      id="fiscal_year"
                      name="fiscal_year"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el año</option>
                      <template v-for="year in Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i)">
                      <option
                        v-if="year >= values.admin_period_start && year <= values.admin_period_end"
                      >
                        {{ year }} 
                      </option>
                      </template>
                    </Field>
                    <ErrorMessage
                      name="fiscal_year"
                      class="form__alert"
                      data-field="fiscal_year"
                    />
                  </div>

                  <!-- Seleccion de periodo (period) -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="period_id"
                      id="period_id"
                    >Periodo</label>
                    <Field
                      id="period_id"
                      name="period_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el periodo</option>
                      <option
                        v-for="period in periods"
                        :key="period.slug"
                        :value="period.id"
                      >
                        {{ period.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="period_id"
                      class="form__alert"
                      data-field="period_id"
                    />
                  </div>
                </div>

                <div class="form__container-group">
                  <!-- Seleccion de tipo de partida (partida_type) desde partidas -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="partida_type"
                      id="partida_type"
                    >Tipo de partida</label>
                    <Field
                      id="partida_type"
                      name="partida_type"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el tipo de partida</option>
                      <option
                        v-for="partida in partidas"
                        :key="partida.slug"
                        :value="partida.id"
                      >
                        {{ partida.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="partida_type"
                      class="form__alert"
                      data-field="partida_type"
                    />
                  </div>
                  <!-- Campo de texto del ID de la partida, requerido en caso de ser partida_id = 2 (Partida compuesta) -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label"
                      for="partida_id"
                      id="partida_id"
                    >ID de partida</label>
                    <Field
                      id="partida_id"
                      name="partida_id"
                      placeholder="ID de partida"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    />
                    <ErrorMessage
                      name="partida_id"
                      class="form__alert"
                      data-field="partida_id"
                    />
                  </div>
                  <!-- Seleccion de estatus de contrato (status_id) desde contractStatus -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="status_id"
                      id="status_id"
                    >Estatus de contrato</label>
                    <Field
                      id="status_id"
                      name="status_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el estatus de contrato</option>
                      <option
                        v-for="status in contractStatus"
                        :key="status.slug"
                        :value="status.id"
                      >
                        {{ status.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="status_id"
                      class="form__alert"
                      data-field="status_id"
                    />
                  </div>
                  <!-- Seleccion de tipo de contrato (contract_type_id) desde contractTypes -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label form__label--required"
                      for="contract_type_id"
                      id="contract_type_id"
                    >Tipo de contrato</label>
                    <Field
                      id="contract_type_id"
                      name="contract_type_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el tipo de contrato</option>
                      <option
                        v-for="type in contractTypes"
                        :key="type.slug"
                        :value="type.id"
                      >
                        {{ type.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="contract_type_id"
                      class="form__alert"
                      data-field="contract_type_id"
                    />
                  </div>
                </div>
                <!-- Campo para la url del contrato con el id contract_kink -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="contract_link"
                    id="contract_link"
                  >URL de el contrato</label>
                  <Field
                    id="contract_link"
                    name="contract_link"
                    placeholder="URL de el contrato"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="contract_link"
                    class="form__alert"
                    data-field="contract_link"
                  />
                </div>
                <div class="form__container-group">
                  <!-- Campo de seleccion de la fecha del contrato con id contract_date utilizando VueDatePicker -->
                  <div class="form__container form__container--small">
                    <label
                      class="form__label"
                      for="contract_date"
                      id="contract_date"
                    >Fecha de el contrato</label>
                    <Field
                      id="contract_date"
                      name="contract_date"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                      v-slot="{ field }"
                    >
                      <VueDatePicker
                        v-bind="field"
                        :disabled="contractEditBlocked && contract.id"
                        :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                        input-class="form__input"
                        wrapper-class="date-picker-wrapper"
                        format="YYYY-MM-DD"
                        />
                    </Field>
                    <ErrorMessage
                      name="contract_date"
                      class="form__alert"
                      data-field="contract_date"
                      />
                    </div>
                </div> 

                <h2 class="form__head2">Información de los montos del contrato</h2>
                <div class="form__container-group">
                  <!-- Campo de texto del monto total del contrato sin impuestos con el id subtotal -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label"
                      for="subtotal"
                      id="subtotal"
                    >Monto total sin impuestos</label>
                    <Field
                      id="subtotal"
                      name="subtotal"
                      placeholder="Monto total sin impuestos"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    />
                    <ErrorMessage
                      name="subtotal"
                      class="form__alert"
                      data-field="subtotal"
                    />
                  </div>
                  <!-- Campo de texto del monto total del contrato con impuestos con el id total_amount -->
                  <div class="form__container form__container--smaller">
                    <label
                      class="form__label"
                      for="total_amount"
                      id="total_amount"
                    >Monto total con impuestos</label>
                    <Field
                      id="total_amount"
                      name="total_amount"
                      placeholder="Monto total con impuestos"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    />
                    <ErrorMessage
                      name="total_amount"
                      class="form__alert"
                      data-field="total_amount"
                    />
                  </div>
                </div>

                <h2 class="form__head2">Información de la convocatoria</h2>
                <!-- Campo de texto para la descripcion de la obra con el id work_description -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="work_description"
                    id="work_description"
                  >Descripción de la obra</label>
                  <Field
                    class="form__input form__input--textarea"
                    rows="4"
                    as="textarea"
                    id="work_description"
                    name="work_description"
                    placeholder="Descripción de la obra"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="work_description"
                    class="form__alert"
                    data-field="work_description"
                  />
                </div>
                <!-- url de la convocatoria con id call_link -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="call_link"
                    id="call_link"
                  >URL de la convocatoria</label>
                  <Field
                    id="call_link"
                    name="call_link"
                    placeholder="URL de la convocatoria"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="call_link"
                    class="form__alert"
                    data-field="call_link"
                  />
                </div> 
                <!-- Url de la presentación de propuestas con id proposals_url -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="proposals_url"
                    id="proposals_url"
                  >URL de presentación de propuestas</label>
                  <Field
                    id="proposals_url"
                    name="proposals_url"
                    placeholder="URL de presentación de propuestas"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="proposals_url"
                    class="form__alert"
                    data-field="proposals_url"
                  />
                </div>
                <!-- Url para la presentación de la propuesta con el id proposal_url -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="proposal_url"
                    id="proposal_url"
                  >URL de presentación de la propuesta</label>
                  <Field
                    id="proposal_url"
                    name="proposal_url"
                    placeholder="URL de presentación de la propuesta"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="proposal_url"
                    class="form__alert"
                    data-field="proposal_url"
                  />
                </div>
                <!-- Campo de seleccion de la fecha de la convocatoria con id call_date utilizando VueDatePicker -->
                <div class="form__container-group">
                  <div class="form__container form__container--small">
                    <label
                      class="form__label"
                      for="call_date"
                      id="call_date"
                    >Fecha de la convocatoria</label>
                    <Field
                      id="call_date"
                      name="call_date"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                      v-slot="{ field }"
                    >
                      <VueDatePicker
                        v-bind="field"
                        :disabled="contractEditBlocked && contract.id"
                        :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                        input-class="form__input"
                        wrapper-class="date-picker-wrapper"
                        format="YYYY-MM-DD"
                      />
                    </Field>
                    <ErrorMessage
                      name="call_date"
                      class="form__alert"
                      data-field="call_date"
                    />
                  </div> 
                  <!-- Selector de la fecha de la junta de aclaraciones con id clarification_meeting_date utilizando VueDatePicker -->
                  <div class="form__container form__container--small">
                    <label
                      class="form__label"
                      for="clarification_meeting_date"
                      id="clarification_meeting_date"
                    >Fecha de junta de aclaraciones</label>
                    <Field
                      id="clarification_meeting_date"
                      name="clarification_meeting_date"
                      class="form__input"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                      v-slot="{ field }"
                    >
                      <VueDatePicker
                        v-bind="field"
                        :disabled="contractEditBlocked && contract.id"
                        :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                        input-class="form__input"
                        wrapper-class="date-picker-wrapper"
                        format="YYYY-MM-DD"
                      />
                    </Field>
                    <ErrorMessage
                      name="clarification_meeting_date"
                      class="form__alert"
                      data-field="clarification_meeting_date"
                    />
                  </div>
                </div>
                <h2 class="form__head2">Información de los participantes</h2>
                <div class="form__container-group">
                  <!-- Campo de seleccion del proveedor ganador del contrato con id provider_id  desde providers -->
                  <div class="form__container form__container--half">
                    <label
                      class="form__label form__label--required"
                      for="provider_id"
                      id="provider_id"
                    >Proveedor</label>
                    <Field
                      id="provider_id"
                      name="provider_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el proveedor de la obra</option>
                      <option
                        v-for="provider in providers"
                        :key="provider.slug"
                        :value="provider.id"
                      >
                        {{ provider.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="provider_id"
                      class="form__alert"
                      data-field="provider_id"
                    />
                  </div>
                  <!-- Campo de seleccion de la unidad convocante con id organizer_admin_unit_id desde adminUnits -->
                  <div class="form__container form__container--half">
                    <label
                      class="form__label form__label--required"
                      for="organizer_admin_unit_id"
                      id="organizer_admin_unit_id"
                    >Unidad convocante</label>
                    <Field
                      id="organizer_admin_unit_id"
                      name="organizer_admin_unit_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona la unidad convocante</option>
                      <option
                        v-for="unit in adminUnits"
                        :key="unit.slug"
                        :value="unit.id"
                      >
                        {{ unit.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="organizer_admin_unit_id"
                      class="form__alert"
                      data-field="organizer_admin_unit_id"
                    />
                  </div>
                  <!-- Campo de seleccion de la unidad solicitante con id applicant_admin_unit_id desde adminUnits -->
                  <div class="form__container form__container--half">
                    <label
                      class="form__label form__label--required"
                      for="applicant_admin_unit_id"
                      id="applicant_admin_unit_id"
                    >Unidad solicitante</label>
                    <Field
                      id="applicant_admin_unit_id"
                      name="applicant_admin_unit_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona la unidad solicitante</option>
                      <option
                        v-for="unit in adminUnits"
                        :key="unit.slug"
                        :value="unit.id"
                      >
                        {{ unit.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="applicant_admin_unit_id"
                      class="form__alert"
                      data-field="applicant_admin_unit_id"
                    />
                  </div>
                  <!-- Campo de seleccion del tipo de unidad administrativa que aplica al contrato con id admin_unit_type_id desde adminUnitTypes -->
                  <div class="form__container form__container--half">
                    <label
                      class="form__label form__label--required"
                      for="admin_unit_type_id"
                      id="admin_unit_type_id"
                    >Tipo de unidad administrativa</label>
                    <Field
                      id="admin_unit_type_id"
                      name="admin_unit_type_id"
                      as="select"
                      class="form__select"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    >
                      <option value="" disabled>Selecciona el tipo de unidad administrativa</option>
                      <option
                        v-for="type in adminUnitTypes"
                        :key="type.slug"
                        :value="type.id"
                      >
                        {{ type.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="admin_unit_type_id"
                      class="form__alert"
                      data-field="admin_unit_type_id"
                    />
                  </div>
                </div>
                <!-- Campo de texto para agregar el área responsable de la información del contrato  con el id area_in_charge -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="area_in_charge"
                    id="area_in_charge"
                  >Área responsable</label>
                  <Field
                    id="area_in_charge"
                    rows="4"
                    as="textarea"
                    name="area_in_charge"
                    placeholder="Área responsable de la información del contrato"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="area_in_charge"
                    class="form__alert"
                    data-field="area_in_charge"
                  />
                </div>
                <h2 class="form__head2">Información adicional</h2>

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
                <!-- Campo de texto de notas de Karewa -->
                <div class="form__container form__container--full">
                  <label
                    class="form__label"
                    for="organization_notes"
                    id="organization_notes"
                  >Notas de Karewa</label>
                  <Field
                    class="form__input form__input--textarea"
                    rows="4"
                    as="textarea"
                    id="organization_notes"
                    name="organization_notes"
                    placeholder="Notas internas de Karewa acerca de el contrato"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                  />
                  <ErrorMessage
                    name="organization_notes"
                    class="form__alert"
                    data-field="organization_notes"
                  />
                </div>
                <!-- Campo de seleccion de fecha de actualización de la información del contrato con id contract_updated_at utilizando VueDatePicker -->
                <div class="form__container form__container--small">
                  <label
                    class="form__label"
                    for="contract_updated_at"
                    id="contract_updated_at"
                  >Fecha de actualización de la información</label>
                  <Field
                    id="contract_updated_at"
                    name="contract_updated_at"
                    class="form__input"
                    :disabled="contractEditBlocked && contract.id"
                    :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                    v-slot="{ field }"
                  >
                    <VueDatePicker
                      v-bind="field"
                      :disabled="contractEditBlocked && contract.id"
                      :class="{ 'form__input--disabled': contractEditBlocked && contract.id }"
                      input-class="form__input"
                      wrapper-class="date-picker-wrapper"
                      format="YYYY-MM-DD"
                    />
                  </Field>
                  <ErrorMessage
                    name="contract_updated_at"
                    class="form__alert"
                    data-field="contract_updated_at"
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
  import { VueDatePicker } from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'

	const store = useAppStore();
	const router = useRouter();
	const route = useRoute();
	const contract = ref();
	const procedures = ref([]);
  const subjects = ref([]);
  const periods = ref([]);
  const partidas = ref([]);
  const contractTypes = ref([]);
  const contractStatus = ref([])
  const providers = ref([]);
  const adminUnits = ref([]);
  const adminUnitTypes = ref([]);
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
        getSubjects();
        getPeriods();
        getPartidas();
        getContractStatus();
        getContractTypes();
        getProviders();
        getAdminUnits();
        getAdminUnitTypes();
			}
		} else {
			contract.value = { name: '', notes: '', id: null };
			getProcedures();
      getSubjects();
      getPeriods();
      getPartidas();
      getContractStatus();
      getContractTypes();
      getProviders();
      getAdminUnits();
      getAdminUnitTypes();
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

  function getSubjects() {
    new apiRequest()
      .Get({
        module: 'materias',
      })
      .then(response => {
        subjects.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }

  // obtener la lista de los periodos (Periods)
  function getPeriods() {
    new apiRequest()
      .Get({
        module: 'periodos-contratos',
      })
      .then(response => {
        periods.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }
  // Obtener la lista de las partidas (partidas)
  function getPartidas() {
    new apiRequest()
      .Get({
        module: 'partidas',
      })
      .then(response => {
        partidas.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }

  // Obtener la lista de estaus de los contratos (estatus-contrato)
  function getContractStatus() {
    new apiRequest()
      .Get({
        module: 'estatus-contrato',
      })
      .then(response => {
        contractStatus.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }

  // Obtener el listado de tipo de contractos (contract_types) desde (tipo-contratos)
  function getContractTypes() {
    new apiRequest()
      .Get({
        module: 'tipo-contrato',
      })
      .then(response => {
        contractTypes.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }

  // Obtener la lista de los proveedores (providers) para el campo de seleccion del proveedor ganador del contrato desde el endpoint (proveedores)
  function getProviders() {
    new apiRequest()
      .Get({
        module: 'proveedores',
      })
      .then(response => {
        providers.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }
  // Obtener el listado de las unidades administrativas (admin_units) desde el endpoint unidades-adminstrativas para mostrarlos en los campos  de seleccion de la unidad convocante y unidad solicitante
  function getAdminUnits() { 
    new apiRequest()
      .Get({
        module: 'unidades-administrativas',
      })
      .then(response => {
        adminUnits.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }
  // Obtener el listado de tipos de unidades adminstrativas (admin_unit_types) desde el endpoint unit-types para mostrarlo en el campo de seleccion del tipo de unidad administrativa que aplica al contrato
  function getAdminUnitTypes() {
    new apiRequest()
      .Get({
        module: 'unit-types',
      })
      .then(response => {
        adminUnitTypes.value = response.data.data;
      })
      .catch(error => {
        store.push_alert(error.data);
      });
  }
</script>

<style lang="sass">
	@use "../../../assets/sass/components/_section.sass"
</style>
