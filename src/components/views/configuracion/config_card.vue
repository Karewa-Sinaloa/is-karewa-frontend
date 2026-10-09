<template>
	<section class="section section--wide section--no-border">
		<div class="section__top">
			<h1 class="section__title">{{ entry.name }}</h1>
			<span class="section__help-text">Clave: {{ entry.slug }} · {{ modeText }}</span>
		</div>
		<div
			class="section__content"
			v-if="rows.length > 0"
		>
			<div class="results">
				<div
					class="results__result result"
					v-for="row in rows"
					:key="row.key"
				>
					<div class="result__data">
						<h3 class="result__title">{{ row.key }}</h3>
						<span class="result__description">{{ row.display }}</span>
					</div>
					<result-options
						:optionList="{ pop: true }"
						@showPopup="popupOpen = true"
					></result-options>
				</div>
			</div>
		</div>
		<div
			class="section__content"
			v-else
		>
			<div class="results">
				<p class="results__no-results">Este parámetro no tiene valores registrados</p>
			</div>
		</div>
		<section-popup-slot
			v-if="popupOpen"
			@close="popupOpen = false"
		>
			<config-view
				:entry="entry"
				@close="popupOpen = false"
				@changed="onChanged"
			/>
		</section-popup-slot>
	</section>
</template>

<script setup>
	import { computed, ref } from 'vue';
	import resultOptions from '../../partials/result_options.vue';
	import sectionPopupSlot from '../../partials/section_popup_slot.vue';
	import configView from './config_view.vue';
	import { MASK_BULLETS, detectValueMode, isSecretKey, maskForDisplay, parseJsonObject } from '../../../helpers/config.value.js';

	const popupOpen = ref(false);
	const emits = defineEmits(['changed']);
	const props = defineProps({
		entry: {
			type: Object,
			required: true,
		},
	});

	const rawValue = computed(() => (props.entry.value === null || props.entry.value === undefined ? '' : String(props.entry.value)));
	const isJsonMode = computed(() => detectValueMode(rawValue.value) === 'json');

	const modeText = computed(() => (isJsonMode.value ? 'Valor en formato JSON' : 'Valor en formato texto'));

	const rows = computed(() => {
		const parsed = parseJsonObject(rawValue.value);
		if (parsed) {
			return Object.entries(parsed).map(([key, value]) => ({
				key: key,
				display: isSecretKey(key) ? MASK_BULLETS : preview(value),
			}));
		}
		return [
			{
				key: 'Valor',
				display: preview(maskForDisplay(rawValue.value)),
			},
		];
	});

	function preview(value) {
		if (value === null || value === undefined) {
			return '';
		}
		const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
		const compact = text.replace(/\s+/g, ' ').trim();
		return compact.length > 70 ? `${compact.slice(0, 70)}…` : compact;
	}

	function onChanged() {
		popupOpen.value = false;
		emits('changed');
	}
</script>
