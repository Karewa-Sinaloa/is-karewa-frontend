<template>
	<div class="pagination">
		<button class="pagination__element pagination__element--prev" @click="navigateTo(1)">&#10094;</button>
		<button v-for="btn in btns" class="pagination__element pagination__element--page" @click="navigateTo(btn)" :class="{'pagination__element--active': currentPage == btn}">{{ btn }}</button>
		<button class="pagination__element pagination__element--next" @click="navigateTo(props.data.pages)">&#10095;</button>
	</div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'

const props = defineProps(['data'])
const btns = ref([])
const page = ref(1)
const maxBtns = ref(6)
const emit = defineEmits(['navigate'])
const currentPage = ref(1)

//currentPage.value = props.data.page

function showButtons() {
	btns.value = []
	if(props.data.pages < maxBtns.value) {
		maxBtns.value = props.data.pages
	}
	if(page.value > maxBtns.value) {
		emit('navigate', 1)
	}
	currentPage.value = props.data.page - Math.floor(maxBtns.value / 2)
	if(currentPage.value < 1) {
		currentPage.value = 1
	}

	let btnsCount = currentPage.value
	while(btnsCount <= maxBtns.value) {
		btns.value.push(btnsCount)
		btnsCount++
	}
}
showButtons()

function navigateTo(page) {
	currentPage.value = page
	emit('navigate', page)
}
</script>

<style lang="sass" scoped>
@import "../../assets/sass/components/_pagination.sass"
</style>
