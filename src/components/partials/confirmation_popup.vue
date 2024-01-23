<template>
	<div class="pp">
		<div class="pp__container">
			<div class="pp__head">
				<img class="pp__icon" :src="`/src/assets/icons/${props.data.icon}`" alt="Email icon">
			</div>
			<div class="pp__content">
				<h4 class="pp__title" v-text="props.data.title"></h4>
				<p class="pp__text" v-text="props.data.text"></p>
				<div class="pp__options">
					<button class="btn btn__warning btn--small" @click.prevent="emit('confirmed')">{{props.data.btn_confirmation_text}}</button>
					<button class="btn btn__no-risk btn--small" @click.prevent="emit('declined')">{{props.data.btn_declination_text}}</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const emit = defineEmits(['confirmed', 'declined'])
const props = defineProps(['data'])
</script>

<style lang="sass" scoped>
@import "../../assets/sass/components/_popups.sass"
</style>
