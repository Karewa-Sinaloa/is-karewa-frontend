<template>
	<div class="loading" v-if="store.processing == true">
		<img class="loading__spinner" src="../../assets/icons/spinner.svg" alt="Un momento por favor estamos procesando tu petición">
	</div>
</template>

<script setup>
import { useAppStore } from '../../store/index.js'

const store = useAppStore()
</script>
