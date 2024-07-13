<template>
	<div class="search">
		<div class="search__container">
			<div class="section">
				<div class="section__top">
					<button class="btn btn__icon" @click="$emit('close')">
						<icon-set icon="close"/>
					</button>

					<form class="form">
						<div class="form__container form__container--wide">
							<input class="form__input form__input--big" type="input" placeholder="Buscar ..." @keyup="setSearchText" v-model="searchString">
						</div>
					</form>
				</div>

				<div class="section__content">	

					<div class="s-results" v-if="results">	
						<div class="result" v-for="result in results" @click="$emit('searchResults', result)">
							<div class="result__data">
								<span v-for="(field, index) in fields" :class="{'result__title': index == 0, 'result__description': index > 0}"><strong class="result__text--strong">{{field.name}}:</strong> {{result[field.id]}}</span>
							</div>
							<div class="result__actions">
								<button class="btn btn__icon">
									<icon-set icon="add"/>
								</button>
							</div>
						</div>
						<pagination-container v-if="pagination" :data="pagination" @navigate="navigateTo"></pagination-container>
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
import paginationContainer from '../partials/single_pagination.vue'

const emits = defineEmits(['searchResults', 'close'])
const searchString = ref('')
const props = defineProps(['requestParams', 'fields'])
const store = useAppStore()
const results = ref(null)
const pagination = ref(null)

document.addEventListener('keyup', e => {
	if(e.keyCode == 27) {
		emits('close')
	}
})

function setSearchText(e) {
	results.value = null
	let str = e.target.value
	let sString = str.replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s]|\s{2,}/g, '')
	searchString.value = sString
	if(sString.length > 2) {
		getRequest()
	} else {
		results.value = null
	}
}

function getRequest(page = 1, limit = 20) {
	new apiRequest().Get({
		module: props.requestParams.module,
		params: `${props.requestParams.params}&search=${searchString.value}&page=${page}&limit=${limit}`
	}).then(r => {
		results.value = r.data.data
		pagination.value = r.data.pagination ? r.data.pagination : null
	}).catch(e => {
		results.value = null
		pagination.value = null
		store.push_alert(e.data)
	})
}

function navigateTo(r) {
	results.value = null
	getRequest(r)
}

</script>

<style lang="sass">
	@import "../../assets/sass/components/_search.sass"
	@import "../../assets/sass/components/_results.sass"
</style>
