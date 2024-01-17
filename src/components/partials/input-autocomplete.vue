<template>
	<div class="autocomplete">
		<input class="form__input" type="text" id="search_string" name="search_string" :placeholder="props.placeholderText" v-model="searchString" @keyup="getOptions">
		<div class="autocomplete__options" v-if="options.length > 0 && showOptions" ref="eList">
			<span class="autocomplete__option" v-for="opt, key in options" @click.prevent="returnOption(key)">{{getOptionTexts(opt)}}</span>
		</div>
	</div>	
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { apiRequest } from '../../api/requests.js'
import { useAppStore } from '../../store/index.js'

const props = defineProps({
	'textField': String,
	'requestParams': Object,
	'placeholderText': String,
	'optionText': []
})
const store = useAppStore()
const options = ref([])
const emits = defineEmits(['option'])
const eList = ref(null)
const currentFocusedElement = ref(0)
const lastSelection = ref(null)
const searchString = ref('')
const lastSearchString = ref('')
const showOptions = ref(false)

watch(() => eList.value, () => {
	if(eList.value && eList.value.children.length > 0) {
		setArrowScroll()
	}
})

function getOptionTexts(opt) {	
	let str = ''
	props.optionText.forEach(field => {
		str += ` - ${opt[field]}`
	})
	return str.replace(/^\s\-\s/, '')
}

watch(() => props.requestParams, () => {
	getOptions()
})

onMounted(() => {
	window.addEventListener('keyup', e => {
		if(eList.value && eList.value.children.length > 0) {
			setArrowScroll(e.keyCode)
		}
	})
})

function setArrowScroll(key = null) {
	if([34, 40, 13, null].indexOf(key)) {
		if(!key) {
			currentFocusedElement.value = 0
		} else if(key == 38) {
			currentFocusedElement.value = currentFocusedElement.value > 0 ? currentFocusedElement.value - 1 : 0
		} else if(key == 40) {
			currentFocusedElement.value = currentFocusedElement.value < (eList.value.children.length - 1) ? currentFocusedElement.value + 1 : eList.value.children.length - 1
		}
		let nextElement = eList.value.children[currentFocusedElement.value]
		for(let i = 0; i < eList.value.children.length; i++) {
			eList.value.children[i].classList.remove('autocomplete__option--focus')
		}
		if(nextElement) {
			nextElement.classList.add('autocomplete__option--focus')
		}
		if(key == 13) {
			returnOption(currentFocusedElement.value)
		}
	}
}

function returnOption(key) {
	searchString.value = options.value[key][props.textField]
	emits('option', options.value[key])
	showOptions.value = false
}

function getOptions(e) {
	let params = {
		module: props.requestParams.module,
		params: `${props.requestParams.params}&search=${e.target.value}` 
	}
	console.log(params)
	if(lastSearchString.value != e.target.value) {
		new apiRequest().Get(params).then(r => {
			options.value = r.data.data
			showOptions.value = true
		}).catch(e => {
			options.value = []
			store.push_alert(e.data)
		})
	}
	lastSearchString.value = e.target.value
}

</script>
