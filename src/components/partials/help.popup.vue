<template>
	<div class="help-popup" v-if="helpText">
		<div class="help-popup__container">
			<button class="help-popup__close" @click.prevent="store.push_help(null)">
				<span class="help-popup__close-icon material-symbols-outlined">close</span>
			</button>
			<img class="help-popup__icon" src="../../assets/icons/information.png" alt="Icono de ayuda">
			<h5 class="help-popup__title">Información de apoyo</h5>
			<p class="help-popup__text" v-text="helpText"></p>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '../../store/index.js'

const store = useAppStore()

const helpText = computed(() => {
	return store.help
})

onMounted(() => {
	document.addEventListener('keyup', e => {
		if(e.keyCode == 27) {
			store.push_help(null)
		}
	})
})
</script>

<style lang="sass" scoped>
	@import "../../assets/sass/components/_help_popup.sass"
</style>
