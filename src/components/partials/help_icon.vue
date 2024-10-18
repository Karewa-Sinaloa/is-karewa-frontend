<template>
	<button class="form__help-icon" @click.prevent="store.push_help(help_text)">
		<icon-set icon="info"/>
	</button>
</template>

<script setup>
import { useAppStore } from '../../store/index.js'

const props = defineProps(['help_text'])
const store = useAppStore()
</script>
