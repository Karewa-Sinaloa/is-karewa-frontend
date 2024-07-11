<template>
	<div class="search">
		<div class="search__container">
			<div class="section">
				<div class="section__top">

					<form class="form">
						<div class="form__container form__container--wide">
							<input class="form__input form__input--big" type="search" placeholder="Buscar ..." @keyup="setSearchText" v-model="searchString">
						</div>
					</form>
				</div>

				<div class="section__content">	

					<div class="s-results">	
						<div class="s-results__result" v-for="result in results">
							<div class="s-results__column">
								<span class="s-results__data s-results__data--main">{{result.code}}</span>
							</div>
						</div>
					</div>
				</div>
			</div>		
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref, watch, computed } from 'vue'
import { apiRequest } from '../../api/requests.js'
import { useAppStore } from '../../store/index.js'

const emits = defineEmits(['searchResults'])
const searchString = ref('')
const props = defineProps(['requestParams'])
const store = useAppStore()
const results = ref(null)

function setSearchText(e) {
	results.value = null
	getRequest(e.target.value)
}

function getRequest() {
	new apiRequest().Get(props.requestParams).then(r => {
		results.value = r.data.data
	}).catch(e => {
		console.log(e)
		results.value = null
		store.push_alert(e.data)
	})
}
</script>

<style lang="sass">
	@import "../../assets/sass/components/_search.sass"
	@import "../../assets/sass/components/_results.sass"
</style>
