<template>
	<div class="pagination">
		<button class="pagination__element pagination__element--prev" @click="navigateTo(1)">&#10094;</button>
		<button v-for="btn in btns" class="pagination__element pagination__element--page" @click="navigateTo(btn)" :class="{'pagination__element--active': data.page == btn}">{{ btn }}</button>
		<button class="pagination__element pagination__element--next" @click="navigateTo(props.data.pages)">&#10095;</button>
	</div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'

const props = defineProps(['data'])
const btns = ref([])
const maxBtns = ref(6)
const emit = defineEmits(['navigate'])


function showButtons() {
	let startButton = props.data.page - Math.floor(maxBtns.value / 2)
	
	if(props.data.pages < maxBtns.value) {
		maxBtns.value = props.data.pages
	}
	
	//if(props.data.page > maxBtns.value) {
	//	startButton = 1
	//}
	
	if(startButton < 1) {
		startButton = 1
	}

	for(var i = 0; i < maxBtns.value; i++) {
		btns.value.push(startButton)
		startButton++
	}
}
showButtons()

function navigateTo(page) {
	emit('navigate', page)
}
</script>

<style lang="sass" scoped>
@use "../../assets/sass/components/_pagination.sass"
</style>
