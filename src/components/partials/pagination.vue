<template>
	<div class="pagination">
		<router-link :to="{name: 'customerListPaginateView', params: {page: 1}}" class="pagination__element pagination__element--prev">1</router-link>
		<router-link v-for="btn in btns" :to="{name: 'customerListPaginateView', params: {page: btn}}" class="pagination__element pagination__element--page">{{ btn }}</router-link>
		<router-link :to="{name: 'customerListPaginateView', params: {page: props.data.pages}}" class="pagination__element pagination__element--next">{{ props.data.pages }}</router-link>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { watch, ref, onMounted } from 'vue'

const route = useRoute()
const router = useRouter()
const props = defineProps(['data'])
const btns = ref([])
const page = ref(1)
const maxBtns = ref(6)

page.value = route.params.page && route.params.page > 0 ? route.params.page : 1
showButtons()

watch(() => route.path, () => {
	page.value = route.params.page && route.params.page > 0 ? route.params.page : 1
	showButtons()
})

function showButtons() {
	if(props.data.pages < maxBtns.value) {
		maxBtns.value = props.data.pages
	}
	if(page.value > maxBtns.value) {
		router.push({
			name: 'customerListPaginateView',
			params: {
				page: 1
			}
		})
	}
	let start = page.value - Math.floor(maxBtns.value / 2)
	if(start < 1) {
		start = 1
	}
	while(start <= maxBtns.value) {
		btns.value.push(start)
		start++
	}
}
</script>
