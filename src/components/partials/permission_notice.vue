<template>
	<p
		v-if="restricted"
		class="section__notice"
	>
		No tienes permisos completos en esta sección: sólo puedes realizar ciertas acciones.
	</p>
</template>

<script setup>
	import { computed } from 'vue';
	import { useAppStore } from '../../store/index.js';

	const props = defineProps({
		section: {
			type: String,
			required: true,
		},
	});

	const store = useAppStore();

	const restricted = computed(() => !store.can(props.section, 'create') || !store.can(props.section, 'edit') || !store.can(props.section, 'delete'));
</script>
