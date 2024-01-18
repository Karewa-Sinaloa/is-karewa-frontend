<template>
	<div class="pp" v-if="store.popup">
		<div class="pp__container">
			<div class="pp__head">
				<img class="pp__icon" :src="`/src/assets/icons/${store.popup.icon}`" alt="Email icon">
			</div>
			<div class="pp__content">
				<h4 class="pp__title">{{ store.popup.title }}</h4>
				<p class="pp__text">{{ store.popup.text }}</p>
				<button v-if="store.popup.type == 'route'" class="btn btn__default btn--regular" @click="continueAction">{{store.popup.button_text}}</button>
				<button v-else-if="store.popup.type == 'close'" class="btn btn__default btn--regular" @click="closePopup">{{store.popup.button_text}}</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useAppStore } from '../../store/index.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const router = useRouter()

function continueAction() {
	if(store.popup.type == 'route') {
		router.push(store.popup.route)
	}
	store.showPopup(null)
}

function closePopup() {
	store.showPopup(null)
}
</script>
